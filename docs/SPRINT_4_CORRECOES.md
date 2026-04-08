# Sprint 4 - Correção de Bugs Críticos

**Data de Início:** 08/04/2026  
**Data Prevista de Término:** 08/04/2026  
**Status:** Em andamento

---

## 🎯 Objetivo da Sprint

Corrigir bugs críticos identificados nos testes via Chrome DevTools, especificamente:
1. Bug no redirecionamento ao criar meta filha
2. Testar e garantir funcionamento de Metas Semanais
3. Testar e garantir funcionamento de Metas Diárias

---

## 🐛 Bugs Identificados

### Bug 1: Redirecionamento Incorreto ao Criar Meta Filha (CRÍTICO)

**Descrição:**
Ao clicar em "Criar Meta Filha" em uma Meta Anual, o sistema redireciona para:
- ❌ URL atual: `/metas/anual/criar?pai={id}`
- ✅ URL correta: `/metas/mensal/criar?pai={id}`

**Impacto:**
- Impede a criação correta da hierarquia de metas
- Usuário não consegue criar meta mensal a partir de meta anual
- O mesmo problema provavelmente ocorre em outros níveis

**Arquivos Envolvidos:**
- `src/app/pages/metas/MetaDetailPage.tsx` - Botão "Criar Meta Filha"
- Função `getNextNivel()` na linha 248
- Verificar se `params.nivel` está sendo extraído corretamente

**Causa Provável:**
O parâmetro `nivel` da URL pode não estar sendo passado corretamente para a função `getNextNivel()`, ou a função está retornando o próprio nível ao invés do próximo.

**Solução Proposta:**
1. Verificar se `useParams()` está capturando o nível corretamente
2. Adicionar console.log para debug
3. Corrigir a lógica de navegação
4. Testar em todos os níveis: Grande → Anual → Mensal → Semanal → Diária

---

### Bug 2: Metas Semanais (NÃO TESTADO)

**Status:** Não testado completamente

**Testes Necessários:**
- [ ] Listar metas semanais
- [ ] Criar meta semanal vinculada a meta mensal
- [ ] Editar meta semanal
- [ ] Excluir meta semanal
- [ ] Criar meta filha (semanal → diária)

**Verificações:**
- Links de edição estão corretos (`/metas/semanal/{id}/editar`)
- Botão de exclusão funciona
- Redirecionamento ao criar filha funciona

---

### Bug 3: Metas Diárias (NÃO TESTADO)

**Status:** Não testado completamente

**Testes Necessários:**
- [ ] Listar metas diárias
- [ ] Criar meta diária vinculada a meta semanal
- [ ] Editar meta diária
- [ ] Excluir meta diária

**Observação:**
Metas diárias provavelmente não terão botão "Criar Meta Filha" pois é o último nível da hierarquia.

---

## 📋 Plano de Ação

### Fase 1: Diagnóstico (30 min)
1. Adicionar logs de debug em MetaDetailPage.tsx
2. Verificar valor de `params.nivel` em diferentes URLs
3. Testar função `getNextNivel()` isoladamente

### Fase 2: Correção (1 hora)
1. Corrigir bug de redirecionamento
2. Testar correção em todos os níveis
3. Corrigir quaisquer outros problemas encontrados

### Fase 3: Testes (30 min)
1. Testar Metas Semanais completamente
2. Testar Metas Diárias completamente
3. Validar todo o fluxo de criação de metas filhas

### Fase 4: Documentação (15 min)
1. Atualizar ROADMAP.md
2. Criar commit com todas as correções
3. Push para o repositório

---

## ✅ Critérios de Aceitação

- [ ] Criar meta filha a partir de Meta Anual redireciona para `/metas/mensal/criar`
- [ ] Criar meta filha a partir de Meta Mensal redireciona para `/metas/semanal/criar`
- [ ] Criar meta filha a partir de Meta Semanal redireciona para `/metas/diaria/criar`
- [ ] Metas Semanais: CRUD completo funcionando
- [ ] Metas Diárias: CRUD completo funcionando
- [ ] Todos os testes passam no Chrome DevTools

---

## 📝 Notas

**Data de criação:** 08/04/2026  
**Criado por:** NEO  
**Prioridade:** Alta (impede uso da hierarquia de metas)
