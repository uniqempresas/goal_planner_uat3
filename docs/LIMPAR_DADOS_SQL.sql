-- LIMPAR DADOS DO BANCO - MANTER APENAS USUÁRIO
-- Execute este script no SQL Editor do Supabase
-- IMPORTANTE: Substitua 'USER_ID_AQUI' pelo ID do usuário henriqsillva@gmail.com

-- ============================================
-- PASSO 1: Descobrir o ID do usuário
-- ============================================
-- Execute primeiro este comando para pegar o ID:
-- SELECT id, email FROM auth.users WHERE email = 'henriqsillva@gmail.com';
-- Anote o ID retornado e substitua em USER_ID_AQUI abaixo

-- ============================================
-- PASSO 2: Limpar dados mantendo o usuário
-- ============================================

-- Desativar verificações de FK temporariamente
SET session_replication_role = 'replica';

-- Limpar tarefas
DELETE FROM tarefas 
WHERE user_id != 'USER_ID_AQUI' 
   OR user_id IS NULL;

-- Limpar hábitos  
DELETE FROM habitos 
WHERE user_id != 'USER_ID_AQUI' 
   OR user_id IS NULL;

-- Limpar metas (ordem importante por causa das FKs)
-- Primeiro limpar metas diárias
DELETE FROM metas 
WHERE nivel = 'diaria' 
  AND (user_id != 'USER_ID_AQUI' OR user_id IS NULL);

-- Depois metas semanais
DELETE FROM metas 
WHERE nivel = 'semanal' 
  AND (user_id != 'USER_ID_AQUI' OR user_id IS NULL);

-- Depois metas mensais
DELETE FROM metas 
WHERE nivel = 'mensal' 
  AND (user_id != 'USER_ID_AQUI' OR user_id IS NULL);

-- Depois metas anuais
DELETE FROM metas 
WHERE nivel = 'anual' 
  AND (user_id != 'USER_ID_AQUI' OR user_id IS NULL);

-- Por fim metas grandes
DELETE FROM metas 
WHERE nivel = 'grande' 
  AND (user_id != 'USER_ID_AQUI' OR user_id IS NULL);

-- Limpar áreas
DELETE FROM areas 
WHERE user_id != 'USER_ID_AQUI' 
   OR user_id IS NULL;

-- Limpar revisões
DELETE FROM revisoes_semanais 
WHERE user_id != 'USER_ID_AQUI' 
   OR user_id IS NULL;

DELETE FROM revisoes_mensais 
WHERE user_id != 'USER_ID_AQUI' 
   OR user_id IS NULL;

-- Limpar templates
DELETE FROM templates 
WHERE user_id != 'USER_ID_AQUI' 
   OR user_id IS NULL;

-- Limpar conquistas
DELETE FROM conquistas 
WHERE user_id != 'USER_ID_AQUI' 
   OR user_id IS NULL;

-- Reativar verificações de FK
SET session_replication_role = 'origin';

-- ============================================
-- VERIFICAÇÃO
-- ============================================
-- Execute estes comandos para confirmar:

-- SELECT COUNT(*) as total_metas FROM metas;
-- SELECT COUNT(*) as total_tarefas FROM tarefas;
-- SELECT COUNT(*) as total_areas FROM areas;
-- SELECT COUNT(*) as total_habitos FROM habitos;

-- O resultado deve ser 0 ou apenas os dados do seu usuário
