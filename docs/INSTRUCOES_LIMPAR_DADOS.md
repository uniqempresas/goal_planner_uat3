# Limpar Dados do Banco - Instruções

**Data:** 08/04/2026  
**Objetivo:** Limpar todos os dados de teste mantendo apenas o usuário henriqsillva@gmail.com

---

## 🎯 O que será mantido:
✅ Usuário henriqsillva@gmail.com (auth.users)

## 🗑️ O que será excluído:
❌ Todas as metas (grandes, anuais, mensais, semanais, diárias)
❌ Todas as tarefas
❌ Todas as áreas de vida
❌ Todos os hábitos
❌ Todas as revisões
❌ Todos os templates
❌ Todas as conquistas

---

## 📋 PASSO A PASSO

### 1. Acesse o Supabase
- Vá para: https://app.supabase.com
- Faça login na sua conta
- Selecione o projeto do Goal Planner

### 2. Abra o SQL Editor
- No menu lateral, clique em "SQL Editor"
- Clique em "New query"

### 3. Descubra seu User ID
Execute este comando primeiro:

```sql
SELECT id, email FROM auth.users WHERE email = 'henriqsillva@gmail.com';
```

**Anote o ID retornado** (vai ser algo como: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

### 4. Execute o Script de Limpeza
Copie e cole o conteúdo do arquivo `LIMPAR_DADOS_SQL.sql` (substituindo USER_ID_AQUI pelo ID que você anotou)

OU execute comando por comando:

```sql
-- Limpar metas (todas)
DELETE FROM metas WHERE user_id = 'SEU_ID_AQUI';

-- Limpar tarefas
DELETE FROM tarefas WHERE user_id = 'SEU_ID_AQUI';

-- Limpar áreas
DELETE FROM areas WHERE user_id = 'SEU_ID_AQUI';

-- Limpar hábitos
DELETE FROM habitos WHERE user_id = 'SEU_ID_AQUI';

-- Limpar revisões
DELETE FROM revisoes_semanais WHERE user_id = 'SEU_ID_AQUI';
DELETE FROM revisoes_mensais WHERE user_id = 'SEU_ID_AQUI';

-- Limpar templates
DELETE FROM templates WHERE user_id = 'SEU_ID_AQUI';
```

**Substitua `SEU_ID_AQUI` pelo ID do passo 3**

### 5. Verifique
Execute para confirmar que limpou:

```sql
SELECT 'Metas' as tabela, COUNT(*) as total FROM metas
UNION ALL
SELECT 'Tarefas', COUNT(*) FROM tarefas
UNION ALL
SELECT 'Áreas', COUNT(*) FROM areas
UNION ALL
SELECT 'Hábitos', COUNT(*) FROM habitos;
```

**Resultado esperado:** Todas as contagens devem ser 0

### 6. Teste no Sistema
- Acesse a URL da Vercel
- Faça login com henriqsillva@gmail.com
- Verifique que não há metas, tarefas, áreas, etc.
- O sistema deve estar "limpo" e pronto para uso

---

## ⚠️ IMPORTANTE

- **Esta ação é IRREVERSÍVEL**
- Faça backup dos dados se necessário
- O usuário continuará funcionando normalmente
- Apenas os dados de metas/tarefas serão excluídos

---

## 🆘 Problemas?

Se encontrar erro de Foreign Key:
1. Tente excluir na ordem: tarefas → metas → áreas
2. Ou use: `DELETE FROM tabela CASCADE;`

Se não souber o user_id:
1. Acesse: Authentication → Users
2. Procure por henriqsillva@gmail.com
3. Copie o UUID

---

**Dúvidas? Me chame!**
