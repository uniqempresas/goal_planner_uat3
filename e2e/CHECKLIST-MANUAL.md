# Checklist Manual de Verificação - Goal Planner

> **Nota**: Este checklist deve ser usado quando não for possível executar os testes E2E automatizados.

## Credenciais de Teste
- **Email**: henriqsillva@gmail.com
- **Senha**: @HQ29lh19

---

## Dashboard Tests

### 1. Data dinâmica
- [ ] Acessar `/dashboard`
- [ ] Verificar se a data no header NÃO é "28 Mar 2026"
- [ ] Verificar se a data mostrada é a data atual (ex: "8 Abr 2026")
- [ ] **Esperado**: Data deve ser dinâmica baseada no dia atual

### 2. weeklyStats
- [ ] Na dashboard, verificar se há seção de estatísticas
- [ ] Verificar se há informação de "Sequência" ou "dias seguidos"
- [ ] Verificar se há informação de "Produtividade"
- [ ] Verificar se há informação de tarefas concluídas/pendentes
- [ ] **Esperado**: Todas as estatísticas devem ser calculadas dinamicamente

### 3. Nomes das áreas
- [ ] Verificar se áreas são exibidas na dashboard
- [ ] Verificar se cada área tem um nome visível
- [ ] Verificar se cada área tem um ícone/emoji
- [ ] **Esperado**: Áreas devem mostrar nome e ícone corretamente

### 4. Nomes das metas
- [ ] Verificar se metas são exibidas na dashboard
- [ ] Verificar se cada meta tem um título visível
- [ ] **Esperado**: Metas devem mostrar título corretamente

### 5. Sem NaN
- [ ] Inspecionar elementos de percentual/progresso
- [ ] Verificar se há algum "NaN" ou "nan" na página
- [ ] Verificar se há "undefined" ou "null" visível
- [ ] **Esperado**: Não deve haver NaN nos percentuais

---

## CRUD Metas Tests

### 6. Metas Anuais
- [ ] Acessar `/metas/anual`
- [ ] Clicar em "Criar meta"
- [ ] Preencher título: "Meta Anual Teste"
- [ ] Salvar
- [ ] Verificar se aparece na lista
- [ ] Clicar na meta criada → Editar
- [ ] Alterar título para "Meta Anual Editada"
- [ ] Salvar
- [ ] Verificar se atualizou
- [ ] Clicar em Excluir
- [ ] Confirmar exclusão
- [ ] Verificar se sumiu da lista
- [ ] **Esperado**: CRUD completo funciona

### 7. Metas Mensais
- [ ] Acessar `/metas/mensal`
- [ ] Criar meta mensal
- [ ] Editar meta
- [ ] Excluir meta
- [ ] **Esperado**: CRUD completo funciona

### 8. Metas Semanais
- [ ] Acessar `/metas/semanal`
- [ ] Criar meta semanal
- [ ] Editar meta
- [ ] Excluir meta
- [ ] **Esperado**: CRUD completo funciona

### 9. Metas Diárias
- [ ] Acessar `/metas/diaria`
- [ ] Criar meta diária
- [ ] Editar meta
- [ ] Excluir meta
- [ ] **Esperado**: CRUD completo funciona

### 10. Criar meta filha
- [ ] Acessar `/metas/grandes`
- [ ] Criar uma meta grande
- [ ] Abrir detalhes da meta
- [ ] Clicar em "Criar meta filha"
- [ ] Preencher dados
- [ ] Salvar
- [ ] **Esperado**: Redirecionamento correto após criar

---

## Agenda Tests

### 11. Criar tarefa
- [ ] Acessar `/agenda/hoje`
- [ ] Clicar em "Nova tarefa"
- [ ] Preencher título: "Tarefa Teste"
- [ ] Salvar
- [ ] **Esperado**: Tarefa aparece na lista

### 12. Editar tarefa
- [ ] Na lista de tarefas, clicar em uma tarefa
- [ ] Clicar em Editar
- [ ] Alterar título
- [ ] Salvar
- [ ] **Esperado**: Tarefa atualizada na lista

### 13. Excluir tarefa
- [ ] Na lista de tarefas, clicar em uma tarefa
- [ ] Clicar em Excluir
- [ ] Confirmar
- [ ] **Esperado**: Lista atualiza automaticamente sem a tarefa

---

## Áreas Tests

### 14. Emojis disponíveis
- [ ] Acessar `/areas/criar`
- [ ] Clicar no seletor de emoji
- [ ] Contar opções de emojis
- [ ] **Esperado**: 70+ opções de emojis disponíveis

### 15. Cores disponíveis
- [ ] Na tela de criar área
- [ ] Verificar seletor de cor
- [ ] Contar opções de cores
- [ ] **Esperado**: 18+ opções de cores disponíveis

---

## Resultado Esperado

✅ **Passou**: Todos os itens marcados funcionam corretamente
❌ **Falhou**: Algum item não funciona (anotar qual)

---

## Problemas Encontrados

| # | Problema | Severidade | Status |
|---|----------|------------|--------|
|   |          |            |        |
|   |          |            |        |

**Legenda Severidade**:
- 🔴 Crítico - Impede uso
- 🟡 Médio - Funciona parcialmente  
- 🟢 Baixo - Cosmético
