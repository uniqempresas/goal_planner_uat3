---
date: 2026-04-06T18:30:00.000Z
researcher: vibe-researcher
git_commit: current
branch: uat3
repository: goal_planner_uat3
topic: "PRD Sprint 2 - Fluxos de Criação e Edição"
tags: [research, prd, sprint-2, roadmap]
status: complete
last_updated: 2026-04-06
last_updated_by: vibe-researcher
---

# PRD: Sprint 2 - Fluxos de Criação e Edição

## 1. Visão Geral da Sprint

**Objetivo:** Completar os fluxos de criação e edição de entidades (Áreas, Metas, Tarefas) e melhorar a experiência do usuário com Empty States profissionais.

**Contexto:**
- Projeto: Goal Planner (SaaS produtividade pessoal)
- Stack: React 19 + TypeScript + Vite + Supabase + Vercel
- Fase: Sprint 2 em andamento
- Pré-requisitos已完成: Páginas de detalhe (`/areas/:id`) e edição (`/areas/:id/edit`) para Áreas, formulários com validação Zod, componentes EmojiPicker e ColorPicker.

## 2. Funcionalidades Planejadas

### 2.1. Página de Criação de Áreas (`/areas/criar`)

**Descrição:** Formulário para criação de nova área de vida, espelhando o fluxo de edição mas sem dados pré-populados.

**Rotas Envolvidas:**
- `src/app/routes.ts`: Adicionar rota `/areas/criar` -> `AreaCreatePage`

**Componentes a Criar/Reutilizar:**
- `EmojiPicker` (já existe em `src/app/components/forms/EmojiPicker.tsx`)
- `ColorPicker` (já existe em `src/app/components/forms/ColorPicker.tsx`)
- Componentes de formulário shadcn/ui (Input, Textarea, Button, Card)

**Validação (Zod):**
- `name`: string, obrigatório, 1-100 caracteres
- `emoji`: string, opcional, default '🎯'
- `color`: string, opcional, default '#6366f1', formato hex
- `description`: string, opcional, max 500 caracteres

**Serviço:**
- Reutilizar `areasService.create()` existente.

**User Stories:**
- "Como usuário, quero poder criar uma nova Área de Vida a partir de um formulário acessível pelo menu ou listagem, para organizar meus objetivos."

### 2.2. CRUD de Metas (Todas as Hierarquias)

**Descrição:** Implementação completa de páginas de detalhe, criação e edição para todos os níveis de metas (Grande -> Anual -> Mensal -> Semanal -> Diária).

**Hierarquia e Rotas (em `routes.ts`):**

| Nível | Lista (OK) | Detalhe | Criar | Editar |
| :--- | :--- | :--- | :--- | :--- |
| **Grande** | `/metas/grandes` (GrandesMetasPage) | `/metas/grandes/:id` (Novo) | `/metas/grandes/criar` (PlaceholderPage) | `/metas/grandes/:id/editar` (PlaceholderPage) |
| **Anual** | `/metas/anual` | `/metas/anual/:id` | `/metas/anual/criar` | `/metas/anual/:id/editar` |
| **Mensal** | `/metas/mensal` | `/metas/mensal/:id` | `/metas/mensal/criar` | `/metas/mensal/:id/editar` |
| **Semanal** | `/metas/semanal` | `/metas/semanal/:id` | `/metas/semanal/criar` | `/metas/semanal/:id/editar` |
| **Diária** | `/metas/diaria` | `/metas/diaria/:id` | `/metas/diaria/criar` | `/metas/diaria/:id/editar` |

**Campos das Metas (baseados no schema Supabase `metas`):**
- `titulo` (string, obrigatório)
- `descricao` (string, opcional)
- `area_id` (string, foreign key, opcional - vincula a uma Área de Vida)
- `parent_id` (string, foreign key, opcional - define a hierarquia)
- `one_thing` (boolean, default false)
- `focusing_question` (string, opcional)
- `status` ('ativa', 'concluida', 'arquivada')
- Campos SMART (objetivo, especifico, mensuravel, alcancavel, relevante, temporizado) - podem ser usados para UI de Collapsible dentro do formulário ou página de detalhes.

**Dependências Técnicas:**
- `metasService.getByNivel()` já existe e retorna dados. Pode precisar de `getById` mais robusto ( já existe).
- O estado global `AppContext` já gerencia `grandesMetas`, `metasAnuais`, etc., e expõe `getMetaById`.
- Validação Zod específica para cada nível de meta (ex: prazo pode ser obrigatório em alguns níveis).

**User Stories:**
- "Como usuário, quero visualizar os detalhes de uma Meta (incluindo seu progresso, métricas e Focusing Question) para acompanhar meu avanço."
- "Como usuário, quero criar uma nova Meta selecionando seu nível (Grande, Anual, etc), título, área vinculada e definindo-a como minha 'ONE Thing' se for prioritária."
- "Como usuário, quero editar uma meta existente para corrigir informações ou atualizar meu progresso."

### 2.3. Empty States

**Descrição:** Componentes visuais profissionais exibidos quando listas estão vazias, com call-to-action claro para criar o primeiro item.

**Localização:**
- Já existe componente genérico em `src/app/components/empty-state/EmptyState.tsx`.

**Entidades que precisam de Empty State:**
1.  **Áreas** (AreasListPage)
2.  **Metas** (todas as 5 páginas: GrandesMetasPage, MetasAnuaisPage, MetasMensaisPage, MetasSemanaisPage, MetasDiariasPage)
3.  **Tarefas** (AgendaHojePage, AgendaSemanaPage)
4.  **Revisões** (RevisaoSemanalPage, RevisaoMensalPage)

**Implementação:**
- Importar e utilizar o componente `EmptyState` nas páginas listadas, passando o ícone, título, descrição e ação (Link para página de criação) específicos de cada contexto.

### 2.4. Criação de Tarefas (`/agenda/tarefas/criar`)

**Descrição:** Página para adicionar novas tarefas na agenda.

**Rotas em `routes.ts`:**
- `/agenda/tarefas/criar` (atualmente PlaceholderPage)
- `/agenda/tarefas/:id/editar` (PlaceholderPage)

**Campos (baseados no schema Supabase `tarefas`):**
- `titulo` (string, obrigatório)
- `descricao` (string, opcional)
- `meta_id` (string, foreign key, opcional - vincular a uma Meta)
- `bloco` (enum: 'one-thing', 'manha', 'tarde', 'noite') - define o bloco de tempo
- `hora` (string, opcional - formato HH:mm)
- `prioridade` (enum: 'alta', 'media', 'baixa')
- `data` (date string, obrigatório)
- `recorrencia` (enum: 'nenhuma', 'diaria', 'semanal')

**Serviço:**
- Reutilizar `tarefasService.create()` existente (já expoosto no AppContext).
- `tarefasService.getByMetaId()` pode ser útil para UI de seleção de meta.

**User Stories:**
- "Como usuário, quero registrar uma tarefa na minha agenda diária, vinculando-a a uma meta específica (opcional) e definindo seu horário ou bloco de tempo."

## 3. Arquitetura e Dependências

### 3.1. Estrutura de Arquivos Sugerida
```
src/
├── app/
│   ├── pages/
│   │   ├── areas/
│   │   │   ├── AreaCreatePage.tsx (Novo)
│   │   │   ├── areaFormSchema.ts (Reutilizar)
│   │   ├── metas/
│   │   │   ├── MetaDetailPage.tsx (Genérico ou específico por nível?)
│   │   │   ├── MetaEditPage.tsx   (Genérico)
│   │   │   ├── metaFormSchema.ts (Novo)
│   │   ├── agenda/
│   │   │   ├── TarefaCreatePage.tsx (Novo)
│   │   │   ├── tarefaFormSchema.ts (Novo)
├── services/
│   ├── metasService.ts (Verificar necessidade de novos métodos como update)
```

### 3.2. Componentes Reutilizáveis Existentes
- `EmptyState`: Pronto para uso.
- `EmojiPicker`, `ColorPicker`: Prontos.
- Componentes shadcn/ui (Card, Button, Input, Textarea, Select, Form).

## 4. Critérios de Aceite (Geral)

1.  ** Navegabilidade**: Todas as páginas novas devem ser acessíveis via URL e links corretos.
2.  **Validação**: Formulários devem validar inputs com Zod e exibir mensagens de erro claras.
3.  **Persistência**: Dados criados/editados devem ser salvos no Supabase e refletir no estado global.
4.  **Responsividade**: Layout deve funcionar bem em mobile e desktop.
5.  **UX**: Estados de loading ( skeletons) durante fetch de dados.

## 5. Historico e Contexto
Este plano é continuação da Sprint 2. As páginas de detalhe e edição de Áreas já servem como referência de implementação (padrão) para as próximas páginas.