-- Migration: Criar tabela de itens de tarefas
-- Execute este SQL no Supabase SQL Editor

-- 1. Criar tabela tarefa_itens
CREATE TABLE IF NOT EXISTS tarefa_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarefa_id UUID NOT NULL REFERENCES tarefas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Adicionar índice para performance
CREATE INDEX IF NOT EXISTS idx_tarefa_itens_tarefa_id ON tarefa_itens(tarefa_id);

-- 3. Habilitar RLS
ALTER TABLE tarefa_itens ENABLE ROW LEVEL SECURITY;

-- 4. Política de acesso
DROP POLICY IF EXISTS "Users can manage their tarefa_itens" ON tarefa_itens;
CREATE POLICY "Users can manage their tarefa_itens" ON tarefa_itens
  FOR ALL
  USING (
    tarefa_id IN (
      SELECT id FROM tarefas WHERE user_id = auth.uid()
    )
  );

-- 5. Verificar se foi criado
SELECT * FROM tarefa_itens LIMIT 0;