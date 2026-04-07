# PRD: Agenda Hoje com Dados Reais

**Data:** 07 de Abril de 2026  
**Projeto:** Goal Planner  
**Versão:** 1.0  
**Tipo:** Produto / Funcionalidade  
**Status:** Rascunho

---

## 1. Problema

A página Agenda Hoje (`/agenda/hoje`) atualmente exibe tarefas mockadas (dados de exemplo) em vez de dados reais do banco de dados Supabase. O layout visual está completo e funcional, mas:

- O toggle de conclusão atual atualiza apenas o estado local (React state)
- As tarefas exibidas são genéricas e não pertencem ao usuário logado
- O campo `title` é usado no frontend, mas o banco usa `titulo`
- O campo `block` é usado no frontend, mas o banco usa `bloco`
- A vinculação com metas não está sendo exibida corretamente

**Impacto:** Usuários não conseguem gerenciar suas tarefas diárias de forma persistente.

---

## 2. Objetivos

- Conectar a página Agenda Hoje ao banco de dados Supabase
- Exibir apenas tarefas do usuário autenticado
- Persistir o toggle de conclusão (marcar/desmarcar tarefa)
- Manter o layout visual existente (não alterar UI)
- Suportar vinculação com metas (exibir meta vinculada na tarefa)

---

## 3. Requisitos Funcionais

### 3.1 Carregamento de Dados
- [ ] Carregar tarefas do banco de dados filtradas pela data atual
- [ ] Filtrar tarefas por `user_id` (apenas do usuário logado)
- [ ] Ordernar por `bloco` (one-thing, manha, tarde, noite, habitos, recorrentes)
- [ ] Ordernar por `hora` dentro de cada bloco

### 3.2 Exibição de Tarefas
- [ ] Exibir título da tarefa (campo `titulo` do banco)
- [ ] Exibir descrição da tarefa (campo `descricao`)
- [ ] Exibir hora da tarefa (campo `hora`)
- [ ] Exibir bloco da tarefa (campo `bloco` - mapeado para UI)
- [ ] Exibir prioridade (campo `prioridade`: alta, media, baixa)
- [ ] Exibirmeta vinculada (campo `meta_id` → buscar título da meta)

### 3.3 Interação com Tarefas
- [ ] Toggle de conclusão funciona com persistência no banco
- [ ] Atualizar campo `completed` na tabela `tarefas`
- [ ] Refletir alteração imediata na UI

### 3.4 Navegação
- [ ] Link para criar nova tarefa (`/agenda/tarefas/criar`) funciona
- [ ] Exibir Empty State quando não houver tarefas

---

## 4. Requisitos Não Funcionais

- **Performance:** Carregamento inicial < 500ms
- **UX:** Feedback visual imediato no toggle (otimista)
- **Segurança:** Filtrar apenas tarefas do `user_id` logado

---

## 5. Abordagem Técnica

### 5.1 Mapeamento de Campos

O frontend usa nomes diferentes do banco. Implementar transformação:

| Campo Banco | Campo UI | Tipo |
|-------------|----------|------|
| `titulo` | `title` | string |
| `descricao` | `description` | string |
| `bloco` | `block` | enum |
| `prioridade` | `priority` | enum |

### 5.2 Transformação de Bloco

O banco usa valores diferentes do frontend:

| Valor Banco | Valor UI | Label |
|------------|---------|-------|
| `one-thing` | `oneThing` | ONE Thing |
| `manha` | `manha` | Manhã |
| `tarde` | `tarde` | Tarde |
| `noite` | `noite` | Noite |
| `null` | `habitos` | Hábitos |
| `null` | `recorrentes` | Recorrentes |

### 5.3 Arquitetura

```
AgendaHojePage
  ↓ (usa)
AppContext.tarefasHoje
  ↓ (carrega via)
tarefasService.getByData(userId, data)
  ↓ (busca no)
Supabase (tabela tarefas)
```

### 5.4 Componentes a Modificar

1. **AgendaHojePage.tsx** - Trocar `tarefa.title` por `tarefa.titulo`
2. **TarefaItem** - Adaptar para usar campos reais
3. **AppContext** - Já está configurado, apenas verificar se retorna dados corretos

---

## 6. Tarefas

- [ ] 1. Analisar código atual da AgendaHojePage
- [ ] 2. Identificar pontos de mock (campos title, block, etc.)
- [ ] 3. Criar função de mapeamento banco→UI
- [ ] 4. Atualizar AgendaHojePage para usar campos reais
- [ ] 5. Testar carregamento de tarefas
- [ ] 6. Testar toggle de conclusão
- [ ] 7. Validar vinculação com metas

---

## 7. Riscos

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| Dados não carregam | Alta | Verificar console logs de erro |
| Toggle não persiste | Alta | Confirmar chamada ao service |
| Campos não mapeados | Média | Testar cada campo visualizado |

---

## 8. Critérios de Aceitação

### Dado que o usuário está logado
### E existem tarefas cadastradas para hoje no banco
### Quando a página Agenda Hoje carrega
### Então as tarefas devem ser exibidas com os dados reais do banco
### E o título deve vir do campo `titulo` (não `title`)

### Dado que o usuário clica no checkbox de uma tarefa
### Quando a tarefa é marcada como concluída
### E a página é recarregada
### Então a tarefa deve permanecer marcada (dados persistidos)

---

## 9. Referências

- **Página atual:** `src/app/pages/agenda/AgendaHojePage.tsx`
- **Service:** `src/services/tarefasService.ts`
- **Context:** `src/app/contexts/AppContext.tsx`
- **Tipos DB:** `src/lib/supabase.ts` (tipo `tarefas`)
- **Mock Data:** `src/app/data/mockData.ts` (referência de estrutura original)

---

## 10. Histórico de Mudanças

| Data | Versão | Descrição |
|------|--------|-----------|
| 07/04/2026 | 1.0 | Versão inicial do documento |
