# Critérios de Aceite - Sprint 2.7: Criação de Metas Moderna

## Objetivo
Criar um sistema de criação de metas moderno e hierárquico com telas específicas para cada nível (G, A, M, S, D), substituindo a página genérica atual.

---

## Critérios de Aceite Técnicos

### ✅ 1. Estrutura de Arquivos
- [ ] 5 novas páginas de criação criadas em `src/app/pages/metas/`
  - [ ] `GrandeMetaCreatePage.tsx`
  - [ ] `MetaAnualCreatePage.tsx`
  - [ ] `MetaMensalCreatePage.tsx`
  - [ ] `MetaSemanalCreatePage.tsx`
  - [ ] `MetaDiariaCreatePage.tsx`
- [ ] Schema Zod específico criado para cada nível em `src/app/pages/metas/`
- [ ] Componentes reutilizáveis criados:
  - [ ] `MetaParentSelector.tsx` - Seleção por cards
  - [ ] `HierarchyTreePreview.tsx` - Visualização da hierarquia
  - [ ] `PrioritySelector.tsx` - Seletor de prioridade/ONE Thing

### ✅ 2. Rotas
- [ ] Novas rotas configuradas em `src/app/routes.ts`
- [ ] Links de criação nas páginas de lista redirecionam para páginas específicas
- [ ] Botão "Criar Meta Filha" nas páginas de detalhe funciona

### ✅ 3. Campos por Nível
- [ ] **GrandeMetaCreatePage**: título, área, descrição, prazo (3 anos), focusing_question, one_thing, campos SMART
- [ ] **MetaAnualCreatePage**: título, área, descrição, prazo (1 ano), meta_pai (G), focusing_question, one_thing, campos SMART
- [ ] **MetaMensalCreatePage**: título, área, descrição, prazo (1 mês), meta_pai (A), focusing_question, one_thing, campos SMART
- [ ] **MetaSemanalCreatePage**: título, área, descrição, meta_pai (M), focusing_question, one_thing, campos SMART
- [ ] **MetaDiariaCreatePage**: título, descrição, meta_pai (S), ONE Thing

---

## Critérios de Aceite Funcionais

### ✅ 4. Fluxo de Criação
- [ ] Usuário consegue criar Grande Meta diretamente (sem pai)
- [ ] Usuário consegue criar Meta Anual vinculada a uma Grande Meta
- [ ] Usuário consegue criar Meta Mensal vinculada a uma Meta Anual
- [ ] Usuário consegue criar Meta Semanal vinculada a uma Meta Mensal
- [ ] Usuário consegue criar Meta Diária vinculada a uma Meta Semanal
- [ ] Usuário consegue criar "filha de" a partir de qualquer página de detalhe

### ✅ 5. Hierarquia Visual
- [ ] Ao selecionar meta pai, mostra tree preview (G → A → M → S → D)
- [ ] Tree preview atualiza em tempo real quando muda a seleção
- [ ] Visual é moderna (não dropdown simples)

### ✅ 6. ONE Thing / Prioridade
- [ ] Cada nível tem seletor de prioridade visual
- [ ] Opções: Normal, Prioritária, ONE Thing
- [ ] Visual com cores e badges diferenciados
- [ ] Pode ter ONE Thing em qualquer nível (sem hierarquia)

### ✅ 7. Campos SMART
- [ ] Cada nível mostra campos relevantes SMART
- [ ] Campos são opcionais mas disponíveis
- [ ] UI moderna para campos SMART

---

## Critérios de Aceite de Validação (Chrome DevTools)

### ✅ 8. Teste de Criação - Grande Meta
- [ ] Navegar para `/metas/grandes/criar`
- [ ] Preencher título, área (opcional), descrição
- [ ] Selecionar prioridade (opcional)
- [ ] Clicar em "Criar Meta"
- [ ] Meta aparece na lista de Grandes Metas
- [ ] Sem erros no console

### ✅ 9. Teste de Criação Hierárquica
- [ ] Ir para detalhes de uma Grande Meta
- [ ] Clicar em "Criar Meta Filha"
- [ ] Página abre com meta pai pré-selecionada
- [ ] Tree preview mostra: "G: [Nome da Meta]"
- [ ] Criar Meta Anual
- [ ] Meta é criada com parent_id correto

### ✅ 10. Teste de Navegação
- [ ] Links nas páginas de lista levam para páginas corretas
- [ ] Breadcrumbs funcionam corretamente
- [ ] Botões Voltar/Cancelar funcionam
- [ ] Após criar, redireciona para lista correta

---

## Critérios de Aceite UX

### ✅ 11. Design Moderno
- [ ] Sem dropdowns simples para seleção de meta pai
- [ ] Uso de cards para seleção
- [ ] Animações suaves
- [ ] Feedback visual de seleção
- [ ] Responsivo (funciona em mobile)

### ✅ 12. Empty States
- [ ] Se não houver metas pais disponíveis, mostra mensagem amigável
- [ ] Oferece opção de criar meta pai primeiro

---

## Checklist de Testes Manuais

| Cenário | Passo | Resultado Esperado |
|---------|-------|-------------------|
| Criar G | /metas/grandes/criar → criar | Meta aparece na lista |
| Criar A de G | Detalhe G → Criar filha → criar | A vinculada a G |
| Criar M de A | Detalhe A → Criar filha → criar | M vinculada a A |
| Criar S de M | Detalhe M → Criar filha → criar | S vinculada a M |
| Criar D de S | Detalhe S → Criar filha → criar | D vinculada a S |
| Tree Preview | Selecionar pai | Mostra hierarquia visual |
| Priority | Selecionar ONE Thing | Badge diferente |

---

## Definição de Pronto (DoD)

**Todas as tarefas abaixo devem estar concluídas para considerar a Sprint concluída:**

1. ✅ Código implementado e commitado
2. ✅ Deploy realizado
3. ✅ Todos os 12 critérios de aceite técnicos aprovados
4. ✅ Todos os 10 testes funcionais passando
5. ✅ Testes de validação com Chrome DevTools passando
6. ✅ Sem erros críticos no console

---

*Documento gerado em: ${new Date().toISOString()}*
*Versão: 1.0*
