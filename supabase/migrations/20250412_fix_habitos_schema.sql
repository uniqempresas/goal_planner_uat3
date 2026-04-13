-- ===========================================
-- MIGRAÇÃO: Correção Completa da Tabela Habitos
-- Data: 2026-04-12
-- Descrição: Adiciona campos faltantes e corrige inconsistências
-- ===========================================

-- ===========================================
-- 1. ADICIONAR CAMPO 'hora' (TIME)
-- ===========================================
-- O frontend envia 'hora' mas o banco só tinha 'horario_preferido'
-- Vamos manter ambos para compatibilidade ou usar 'hora' como padrão

-- Verificar se a coluna já existe antes de criar
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'habitos' 
        AND column_name = 'hora'
    ) THEN
        ALTER TABLE habitos 
        ADD COLUMN hora TIME;
        
        RAISE NOTICE 'Coluna hora adicionada com sucesso';
    ELSE
        RAISE NOTICE 'Coluna hora já existe';
    END IF;
END $$;

-- ===========================================
-- 2. CORRIGIR O CAMPO 'status' - ALTERAR CHECK CONSTRAINT
-- ===========================================
-- O frontend envia 'ativa'|'pausada'|'concluida'|'expirada' (feminino)
-- O banco aceita 'ativo'|'pausado'|'concluido'|'expirado' (masculino)

-- Primeiro, remover a constraint existente
ALTER TABLE habitos 
DROP CONSTRAINT IF EXISTS habitos_status_check;

-- Adicionar nova constraint com valores no feminino (compatível com frontend)
ALTER TABLE habitos 
ADD CONSTRAINT habitos_status_check 
CHECK (status = ANY (ARRAY['ativa'::text, 'pausada'::text, 'concluida'::text, 'expirada'::text]));

-- Atualizar valor padrão para 'ativa'
ALTER TABLE habitos 
ALTER COLUMN status SET DEFAULT 'ativa'::text;

-- Converter valores existentes do masculino para feminino
UPDATE habitos 
SET status = CASE status
    WHEN 'ativo' THEN 'ativa'
    WHEN 'pausado' THEN 'pausada'
    WHEN 'concluido' THEN 'concluida'
    WHEN 'expirado' THEN 'expirada'
    ELSE status
END
WHERE status IN ('ativo', 'pausado', 'concluido', 'expirado');

-- ===========================================
-- 3. SINCRONIZAR CAMPOS DUPLICADOS (ALIAS)
-- ===========================================
-- streak_maximo <-> melhor_streak
-- ultima_execucao <-> ultima_conclusao

-- Garantir que melhor_streak sincronize com streak_maximo
-- Criar trigger para manter sincronização
CREATE OR REPLACE FUNCTION sync_streak_fields()
RETURNS TRIGGER AS $$
BEGIN
    -- Se melhor_streak foi atualizado, atualizar streak_maximo
    IF NEW.melhor_streak IS DISTINCT FROM OLD.melhor_streak THEN
        NEW.streak_maximo := NEW.melhor_streak;
    END IF;
    
    -- Se streak_maximo foi atualizado, atualizar melhor_streak
    IF NEW.streak_maximo IS DISTINCT FROM OLD.streak_maximo THEN
        NEW.melhor_streak := NEW.streak_maximo;
    END IF;
    
    -- Se ultima_conclusao foi atualizada, atualizar ultima_execucao
    IF NEW.ultima_conclusao IS DISTINCT FROM OLD.ultima_conclusao THEN
        NEW.ultima_execucao := NEW.ultima_conclusao;
    END IF;
    
    -- Se ultima_execucao foi atualizada, atualizar ultima_conclusao
    IF NEW.ultima_execucao IS DISTINCT FROM OLD.ultima_execucao THEN
        NEW.ultima_conclusao := NEW.ultima_execucao;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Remover trigger existente se houver
DROP TRIGGER IF EXISTS sync_habitos_fields ON habitos;

-- Criar trigger
CREATE TRIGGER sync_habitos_fields
    BEFORE INSERT OR UPDATE ON habitos
    FOR EACH ROW
    EXECUTE FUNCTION sync_streak_fields();

-- Sincronizar dados existentes
UPDATE habitos 
SET streak_maximo = melhor_streak 
WHERE melhor_streak IS NOT NULL AND (streak_maximo IS NULL OR streak_maximo != melhor_streak);

UPDATE habitos 
SET ultima_execucao = ultima_conclusao 
WHERE ultima_conclusao IS NOT NULL AND (ultima_execucao IS NULL OR ultima_execucao != ultima_conclusao);

-- ===========================================
-- 4. ATUALIZAR COMENTÁRIOS DOS CAMPOS
-- ===========================================

COMMENT ON COLUMN habitos.hora IS 'Horário do hábito no formato HH:MM (ex: 08:30)';
COMMENT ON COLUMN habitos.status IS 'Status do hábito: ativa, pausada, concluida, expirada';
COMMENT ON COLUMN habitos.melhor_streak IS 'Maior streak consecutivo alcançado (alias para streak_maximo)';
COMMENT ON COLUMN habitos.streak_maximo IS 'Maior streak consecutivo alcançado (mantido para compatibilidade)';
COMMENT ON COLUMN habitos.ultima_conclusao IS 'Data da última vez que o hábito foi concluído (alias para ultima_execucao)';
COMMENT ON COLUMN habitos.ultima_execucao IS 'Data da última vez que o hábito foi executado (mantido para compatibilidade)';

-- ===========================================
-- 5. ÍNDICES RECOMENDADOS PARA PERFORMANCE
-- ===========================================

-- Índice para buscas por user_id + status (muito comum)
CREATE INDEX IF NOT EXISTS idx_habitos_user_status ON habitos(user_id, status);

-- Índice para buscas por datas
CREATE INDEX IF NOT EXISTS idx_habitos_datas ON habitos(data_inicio, data_fim);

-- Índice para buscas por meta_id
CREATE INDEX IF NOT EXISTS idx_habitos_meta ON habitos(meta_id) WHERE meta_id IS NOT NULL;

-- ===========================================
-- VERIFICAÇÃO FINAL
-- ===========================================

-- Listar todas as colunas da tabela para confirmar
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'habitos' 
ORDER BY ordinal_position;
