# ⚠️ Problemas Conhecidos - Tarefas Recorrentes

**Data:** 10/04/2026  
**Status:** Implementado com pendências de segurança/robustez

---

## 🚨 Problemas Identificados pelo Debugador

### 🔴 CRÍTICO - Corrigido
- ✅ **Erro de importação DIAS_SEMANA** - Corrigido no commit

### 🟠 ALTO - Pendente (não bloqueia testes)

#### 1. **Validação de user_id nas operações de edição/exclusão**
**Arquivos:** `recorrenciaService.ts` (funções `editarTodasFuturas`, `editarTodas`, `excluirTodasFuturas`, `excluirTodas`)

**Problema:** As funções não verificam se o usuário tem permissão para modificar a tarefa mãe.

**Impacto:** Potencial vulnerabilidade de segurança se alguém souber o ID da tarefa.

**Solução:** Adicionar parâmetro `userId` em todas as funções e validar nas queries:
```typescript
.eq('id', parentId)
.eq('user_id', userId)
```

**Status:** ⏳ Não implementado - requer mudanças nas assinaturas das funções e em todos os pontos que as chamam.

---

#### 2. **Transação não-atômica na criação**
**Arquivo:** `TarefaCreatePage.tsx`

**Problema:** Se `gerarInstancias` falhar após a tarefa mãe ser criada, ficamos com template órfão sem instâncias.

**Solução:** Implementar rollback ou usar transação do Supabase (RPC).

**Status:** ⏳ Não implementado - requer criação de função RPC no PostgreSQL.

---

#### 3. **Race condition em `gerarInstancias`**
**Problema:** Verificação de duplicata e inserção não são atômicas.

**Solução:** Usar `ON CONFLICT` do PostgreSQL.

**Status:** ⏳ Não implementado - baixa probabilidade em uso normal.

---

## 📝 Nota para Testes Beta

O sistema está **funcional para testes**! Os problemas acima são de segurança/robustez e não impedem o uso normal:

✅ Criar tarefas recorrentes funciona  
✅ Geração de instâncias funciona  
✅ Edição de instâncias funciona  
✅ Exclusão funciona  
✅ Visualização na agenda funciona  

⚠️ Os problemas de segurança só seriam exploráveis por usuários mal-intencionados com conhecimento técnico avançado.

---

## 🛠️ Correções Pós-Beta

Recomenda-se corrigir antes do lançamento oficial:

- [ ] Adicionar validação de `user_id` em todas as operações de recorrência
- [ ] Implementar transação atômica na criação (RPC)
- [ ] Adicionar `ON CONFLICT` na inserção de instâncias
- [ ] Otimizar query N+1 em `gerarInstancias`
- [ ] Adicionar índice em `data_fim_recorrencia`

---

**Responsável:** A definir  
**Prioridade:** Alta (para lançamento oficial)  
**Esforço estimado:** 4-6 horas
