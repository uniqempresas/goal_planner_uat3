-- Migration: Sistema de Tarefas Recorrentes
-- Data: 2026-04-10
-- Descrição: Adiciona suporte a tarefas recorrentes com geração de instâncias

-- ============================================
-- 1. NOVOS CAMPOS NA TABELA TAREFAS
-- ============================================

-- Remover constraint antiga de recorrencia (se existir)
ALTER TABLE tarefas 
DROP CONSTRAINT IF EXISTS tarefas_recorrencia_check;

-- Campo JSON para armazenar configuração completa da recorrência
ALTER TABLE tarefas 
ADD COLUMN IF NOT EXISTS recorrencia_config JSONB DEFAULT NULL;

-- Campo para identificar tarefa "mãe" (template) - referência para instâncias
ALTER TABLE tarefas 
ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES tarefas(id) DEFAULT NULL;

-- Campo para identificar se é uma tarefa template (mãe)
ALTER TABLE tarefas 
ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE;

-- Campo para data de término da recorrência
ALTER TABLE tarefas 
ADD COLUMN IF NOT EXISTS data_fim_recorrencia DATE DEFAULT NULL;

-- ============================================
-- 2. ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índice para busca rápida de instâncias de uma tarefa mãe
CREATE INDEX IF NOT EXISTS idx_tarefas_parent_id ON tarefas(parent_id);

-- Índice para busca de templates ativos
CREATE INDEX IF NOT EXISTS idx_tarefas_is_template ON tarefas(is_template);

-- Índice GIN para busca eficiente em recorrencia_config (JSONB)
CREATE INDEX IF NOT EXISTS idx_tarefas_recorrencia_config ON tarefas USING GIN(recorrencia_config);

-- Índice combinado para busca de tarefas por data e usuário (uso na agenda)
CREATE INDEX IF NOT EXISTS idx_tarefas_user_data ON tarefas(user_id, data);

-- Índice para templates ativos de um usuário
CREATE INDEX IF NOT EXISTS idx_tarefas_template_user ON tarefas(user_id, is_template) WHERE is_template = TRUE;

-- ============================================
-- 3. MIGRAÇÃO DE DADOS EXISTENTES
-- ============================================

-- Converter tarefas existentes com recorrência != 'nenhuma' para o novo formato
UPDATE tarefas 
SET 
  recorrencia_config = CASE 
    WHEN recorrencia = 'diaria' THEN '{"tipo": "diaria"}'::jsonb
    WHEN recorrencia = 'semanal' THEN '{"tipo": "semanal", "dias_semana": [0,1,2,3,4]}'::jsonb
    ELSE NULL
  END,
  is_template = CASE 
    WHEN recorrencia IN ('diaria', 'semanal') THEN TRUE 
    ELSE FALSE 
  END
WHERE recorrencia IN ('diaria', 'semanal');

-- ============================================
-- 4. FUNÇÕES AUXILIARES (OPCIONAL - PARA BATCH JOB)
-- ============================================

-- Função para verificar se uma tarefa template precisa de mais instâncias
CREATE OR REPLACE FUNCTION precisa_mais_instancias(template_id UUID, dias_frente INT DEFAULT 15)
RETURNS BOOLEAN AS $$
DECLARE
  ultima_data DATE;
  data_limite DATE;
BEGIN
  -- Buscar a última instância gerada
  SELECT MAX(data) INTO ultima_data
  FROM tarefas
  WHERE parent_id = template_id;
  
  -- Se não tem instâncias, precisa gerar
  IF ultima_data IS NULL THEN
    RETURN TRUE;
  END IF;
  
  -- Calcular data limite (hoje + dias_frente)
  data_limite := CURRENT_DATE + dias_frente;
  
  -- Retorna true se última instância é antes da data limite
  RETURN ultima_data < data_limite;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 5. POLICY UPDATES (SE USAR RLS)
-- ============================================

-- Nota: Se Row Level Security estiver habilitado, adicionar políticas para parent_id
-- Exemplo (descomentar se necessário):
-- CREATE POLICY "Users can view their task parents" ON tarefas
--   FOR SELECT USING (auth.uid() = user_id OR EXISTS (
--     SELECT 1 FROM tarefas t WHERE t.id = tarefas.parent_id AND t.user_id = auth.uid()
--   ));

-- ============================================
-- 6. DOCUMENTAÇÃO DOS CAMPOS
-- ============================================

COMMENT ON COLUMN tarefas.recorrencia_config IS 'Configuração JSON da recorrência: {tipo, dias_semana, dia_mes, mes_ano, dia_ano, intervalo_dias, data_inicio, data_fim, max_ocorrencias}';
COMMENT ON COLUMN tarefas.parent_id IS 'Referência para a tarefa mãe (template) quando esta é uma instância gerada';
COMMENT ON COLUMN tarefas.is_template IS 'Indica se esta tarefa é um template (mãe) que gera instâncias';
COMMENT ON COLUMN tarefas.data_fim_recorrencia IS 'Data em que a recorrência termina (quando cancelada ou definida)';

-- ============================================
-- ROLLBACK (PARA REFERÊNCIA)
-- ============================================
/*
-- Para reverter esta migration:
DROP INDEX IF EXISTS idx_tarefas_user_data;
DROP INDEX IF EXISTS idx_tarefas_template_user;
DROP INDEX IF EXISTS idx_tarefas_recorrencia_config;
DROP INDEX IF EXISTS idx_tarefas_is_template;
DROP INDEX IF EXISTS idx_tarefas_parent_id;
DROP FUNCTION IF EXISTS precisa_mais_instancias(UUID, INT);
ALTER TABLE tarefas DROP COLUMN IF EXISTS recorrencia_config;
ALTER TABLE tarefas DROP COLUMN IF EXISTS parent_id;
ALTER TABLE tarefas DROP COLUMN IF EXISTS is_template;
ALTER TABLE tarefas DROP COLUMN IF EXISTS data_fim_recorrencia;
*/
