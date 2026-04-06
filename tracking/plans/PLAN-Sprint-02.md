---
date: '2026-04-03T13:45:00-03:00'
researcher: Henri
git_commit: 5b0cf7a
branch: feature/sprint-02-forms
repository: goal_planner_uat3
topic: 'PRD Sprint 2 - Páginas de Criação, Detalhe e Edição'
tags: [research, prd, sprint-2, forms, pages]
status: complete
last_updated: '2026-04-03'
last_updated_by: Henri
---

# PRD Sprint 2: Páginas de Criação, Detalhe e Edição

**Data**: 3 de Abril de 2026  
**Pesquisador**: Henri  
**Versão**: 1.0  
**Status**: Pronto para Planejamento

---

## 1. Visão Geral da Sprint

### Objetivo Principal
Implementar páginas reais de criação, detalhamento e edição para todas as entidades do sistema (Áreas, Metas, Tarefas), com associação hierárquica funcional (G→A→M→S→D) e Empty States profissionais.

### Escopo da Sprint
- **Total de páginas a implementar**: 21
- **Entidades**: Áreas, Grandes Metas (G), Metas Anuais (A), Metas Mensais (M), Metas Semanais (S), Metas Diárias (D), Tarefas
- **Tipos de página**: Criação, Detalhe, Edição

---

## 2. Estado Atual do Projeto

### 2.1 Rotas com PlaceholderPage

| Rota | Tipo | Prioridade |
|------|------|-------------|
| `/areas/:id` | Detalhe | Alta |
| `/areas/:id/edit` | Edição | Alta |
| `/metas/grandes/criar` | Criação | Alta |
| `/metas/grandes/:id` | Detalhe | Alta |
| `/metas/grandes/:id/editar` | Edição | Alta |
| `/metas/anual/criar` | Criação | Alta |
| `/metas/anual/:id` | Detalhe | Alta |
| `/metas/anual/:id/editar` | Edição | Alta |
| `/metas/mensal/criar` | Criação | Alta |
| `/metas/mensal/:id` | Detalhe | Alta |
| `/metas/mensal/:id/editar` | Edição | Alta |
| `/metas/semanal/criar` | Criação | Alta |
| `/metas/semanal/:id` | Detalhe | Alta |
| `/metas/semanal/:id/editar` | Edição | Alta |
| `/metas/diaria/criar` | Criação | Alta |
| `/metas/diaria/:id` | Detalhe | Alta |
| `/metas/diaria/:id/editar` | Edição | Alta |
| `/agenda/tarefas/criar` | Criação | Alta |
| `/agenda/tarefas/:id/editar` | Edição | Alta |
| `/templates/:id` | Detalhe | Baixa |

### 2.2 Componentes UI Disponíveis

O projeto já possui toda a biblioteca shadcn/ui instalada em `src/app/components/ui/`:

- **Formulários**: `form.tsx`, `input.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`
- **Navegação**: `tabs.tsx`, `navigation-menu.tsx`, `breadcrumb.tsx`
- **Feedback**: `dialog.tsx`, `sheet.tsx`, `alert-dialog.tsx`, `sonner.tsx`
- **Data**: `calendar.tsx`
- **Layout**: `card.tsx`, `avatar.tsx`, `badge.tsx`, `progress.tsx`

### 2.3 Serviços Disponíveis

#### AreasService (`src/services/areasService.ts`)
```typescript
- getAll(userId: string): Promise<Area[]>
- getById(id: string): Promise<Area | null>
- create(userId: string, area): Promise<Area>
- update(id: string, area): Promise<Area>
- delete(id: string): Promise<void>
```

#### MetasService (`src/services/metasService.ts`)
```typescript
- getAll(userId: string): Promise<Meta[]>
- getByNivel(userId: string, nivel): Promise<Meta[]>
- getById(id: string): Promise<Meta | null>
- getByParentId(parentId: string): Promise<Meta[]>
- create(userId: string, meta): Promise<Meta>
- update(id: string, meta): Promise<Meta>
- delete(id: string): Promise<void>
- toggleStatus(id: string): Promise<Meta>
- toggleOneThing(id: string): Promise<Meta>
```

#### TarefasService (`src/services/tarefasService.ts`)
```typescript
- getAll(userId: string): Promise<Tarefa[]>
- getByData(userId: string, data: string): Promise<Tarefa[]>
- getById(id: string): Promise<Tarefa | null>
- getByMetaId(metaId: string): Promise<Tarefa[]>
- create(userId: string, tarefa): Promise<Tarefa>
- update(id: string, tarefa): Promise<Tarefa>
- delete(id: string): Promise<void>
- toggleCompleted(id: string): Promise<Tarefa>
```

### 2.4 AppContext já fornece

```typescript
// Áreas
areas: Area[]
createArea(area): Promise<Area>
updateArea(id, area): Promise<Area>
deleteArea(id): Promise<void>
getAreaById(id): Area | undefined

// Metas
grandesMetas: Meta[]
metasAnuais: Meta[]
metasMensais: Meta[]
metasSemanais: Meta[]
metasDiarias: Meta[]
loadMetas(): Promise<void>
getMetaById(id): Meta | undefined

// Tarefas
tarefasHoje: Tarefa[]
createTarefa(tarefa): Promise<Tarefa>
toggleTarefa(id): Promise<void>
loadTarefas(data?): Promise<void>
```

---

## 3. Requisitos por Página

### 3.1 Páginas de Área

#### 3.1.1 Detalhe de Área (`/areas/:id`)
**Arquivo**: `src/app/pages/areas/AreaDetailPage.tsx` (a criar)

**Funcionalidades**:
- Exibir nome, emoji, cor e descrição da área
- Mostrar progresso geral da área (calculado a partir das metas filhas)
- Listar Grandes Metas vinculadas à área
- Estatísticas: total de metas, metas ativas, concluídas
- Link para editar área

**Componentes necessários**:
- AreaHeader com emoji grande e cor
- MetaList para listar Grandes Metas
- ProgressRing para visualização do progresso
- ActionButtons (editar, arquivar)

**Dependências**:
- `getAreaById()` do AppContext
- `grandesMetas` filtradas por areaId

#### 3.1.2 Editar Área (`/areas/:id/edit`)
**Arquivo**: `src/app/pages/areas/AreaEditPage.tsx` (a criar)

**Campos do formulário**:
- Nome (text input, obrigatório)
- Emoji (picker com sugestões)
- Cor (color picker com presets)
- Descrição (textarea)

**Fluxo**:
1. Carregar dados atuais da área
2. Preencher formulário
3. Validação (nome obrigatório)
4. Submit → `updateArea()` → redirect para detalhe

### 3.2 Páginas de Grandes Metas (G)

#### 3.2.1 Criar Grande Meta (`/metas/grandes/criar`)
**Arquivo**: `src/app/pages/metas/grandes/GrandeMetaCreatePage.tsx` (a criar)

**Campos do formulário**:
- Título (text input, obrigatório, max 100 chars)
- Descrição (textarea, max 500 chars)
- Área (select obrigatório - lista de áreas do usuário)
- Focusing Question (textarea com helper "Qual é a ÚNICA coisa...?")

**Seção SMART**:
- Objetivo (text input)
- Específico (textarea)
- Mensurável (dynamic fields: key, target, unit)
- Alcançável (textarea)
- Relevante (textarea)
- Temporizado (date range: start/end)

**Opções**:
-ONE Thing toggle (checkbox)

**Fluxo**:
1. Validar campos obrigatórios
2. Gerar objeto de meta
3. Chamar service de criação (via AppContext ou direto)
4. Redirect para `/metas/grandes/:id`

#### 3.2.2 Detalhe de Grande Meta (`/metas/grandes/:id`)
**Arquivo**: `src/app/pages/metas/grandes/GrandeMetaDetailPage.tsx` (a criar)

**Exibição**:
- Cabeçalho com badge "G", título, status, progresso (ring)
- Área vinculada com cor
- Focusing Question em destaque
- Seção SMART com métricas (gráficos de progresso)
- Metas Anuais filhas (cards expansíveis)
- Estatísticas: prazo, dias restantes

**Ações**:
- Editar
- Marcar como ONE Thing
- Alterar status (ativa/concluída/pausa)
- Deletar (com confirmação)

#### 3.2.3 Editar Grande Meta (`/metas/grandes/:id/editar`)
**Arquivo**: `src/app/pages/metas/grandes/GrandeMetaEditPage.tsx` (a criar)

Mesma estrutura do formulário de criação, mas:
- Pré-preenchido com dados existentes
- Campos desabilitados que não podem mudar (nível, área?)
- Botão "Salvar Alterações"

### 3.3 Páginas de Metas Anuais (A)

#### 3.3.1 Criar Meta Anual (`/metas/anual/criar`)
**Arquivo**: `src/app/pages/metas/anuais/MetaAnualCreatePage.tsx` (a criar)

**Campos**:
- Título (text input)
- Descrição (textarea)
- **Grande Meta Pai** (select obrigatório - apenas G do mesmo usuário)
- Área (auto-preenchido based no pai, editável)
- Focusing Question

**Seção SMART** (similar ao G)

**Fluxo**:
1. Buscar lista de G do usuário (`grandesMetas`)
2. Ao selecionar G, auto-preencher área
3. Criar → `parent_id` setado para G

#### 3.3.2 Detalhe de Meta Anual (`/metas/anual/:id`)
**Arquivo**: `src/app/pages/metas/anuais/MetaAnualDetailPage.tsx` (a criar)

- Similar ao detalhe de G
- Badge "A" com cor específica
- Link para Grande Meta pai
- Metas Mensais filhas

#### 3.3.3 Editar Meta Anual (`/metas/anual/:id/editar`)
**Arquivo**: `src/app/pages/metas/anuais/MetaAnualEditPage.tsx` (a criar)

### 3.4 Páginas de Metas Mensais (M)

#### 3.4.1 Criar Meta Mensal (`/metas/mensal/criar`)
**Arquivo**: `src/app/pages/metas/mensais/MetaMensalCreatePage.tsx` (a criar)

**Campos**:
- Título
- Descrição
- **Meta Anual Pai** (select obrigatório - apenas A do usuário)
- Área (auto-fill)
- Focusing Question

#### 3.4.2 Detalhe/Editar Meta Mensal
Similar aos outros níveis

### 3.5 Páginas de Metas Semanais (S)

#### 3.5.1 Criar Meta Semanal (`/metas/semanal/criar`)
**Arquivo**: `src/app/pages/metas/semanais/MetaSemanalCreatePage.tsx` (a criar)

**Campos**:
- Título
- Descrição
- **Meta Mensal Pai** (select)
- Área (auto-fill)
- Focusing Question

### 3.6 Páginas de Metas Diárias (D)

#### 3.6.1 Criar Meta Diária (`/metas/diaria/criar`)
**Arquivo**: `src/app/pages/metas/diarias/MetaDiariaCreatePage.tsx` (a criar)

**Campos**:
- Título
- Descrição
- **Meta Semanal Pai** (select)
- Área (auto-fill)
- Focusing Question
- Data (date picker, default: hoje)

### 3.7 Páginas de Tarefas

#### 3.7.1 Criar Tarefa (`/agenda/tarefas/criar`)
**Arquivo**: `src/app/pages/agenda/tarefas/TarefaCreatePage.tsx` (a criar)

**Campos do formulário**:
- Título (text input, obrigatório)
- Descrição (textarea, opcional)
- **Bloco** (select obrigatório): one-thing, manha, tarde, noite, habitos, recorrentes
- Hora (time picker, opcional - para blocos manha/tarde/noite)
- **Prioridade** (select): alta, media, baixa
- **Data** (date picker, default: hoje)
- **Meta vinculada** (select opcional) - lista de metas ativas
-ONE Thing toggle
- Recorrência (select): nenhuma, diaria, semanal

**Fluxo**:
1. Criar → `createTarefa()` → redirect para agenda/hoje

#### 3.7.2 Editar Tarefa (`/agenda/tarefas/:id/editar`)
**Arquivo**: `src/app/pages/agenda/tarefas/TarefaEditPage.tsx` (a criar)

Mesma estrutura, pré-preenchido

---

## 4. Empty States Profissionais

Todas as páginas de lista (não as de criação) devem ter Empty States:

### 4.1 Estrutura do Empty State
```tsx
<EmptyState
  icon={lucide-icon}
  title="Título contextual"
  description="Descrição do que fazer"
  actionLabel="Criar algo"
  actionHref="/rota-da-criação"
/>
```

### 4.2 Empty States por Página

| Página | Título | Descrição |
|--------|--------|-----------|
| Áreas | "Nenhuma área ainda" | "Crie áreas para organizar suas metas por dimensões de vida" |
| G | "Nenhuma Grande Meta" | "Grandes metas são sua visão de 3 anos. Comece pela mais impactante" |
| A | "Nenhuma Meta Anual" | "Metas anuais são seus objetivos de 1 ano. Vincule a uma Grande Meta" |
| M | "Nenhuma Meta Mensal" | "Metas mensais são suas metas de curto prazo. Divida suas anuais" |
| S | "Nenhuma Meta Semanal" | "Metas semanais são seu foco da semana. Comece pelo mais importante" |
| D | "Nenhuma Meta Diária" | "Metas diárias são suas tarefas de hoje. Qual é a sua prioridade?" |
| Tarefas | "Nenhuma tarefa hoje" | "Adicione tarefas para organizar seu dia" |

---

## 5. Hierarquia e Associações

### 5.1 Cadeia G→A→M→S→D

```
G (Grande Meta)
 └─ A (Meta Anual) [parent_id = G.id]
     └─ M (Meta Mensal) [parent_id = A.id]
         └─ S (Meta Semanal) [parent_id = M.id]
             └─ D (Meta Diária) [parent_id = S.id]
```

### 5.2 Regras de Associação nos Formulários

| Criar | Pai Obrigatório? | Lista de Pais Disponíveis |
|-------|-------------------|---------------------------|
| Meta Anual | ✅ Sim | G (ativas) |
| Meta Mensal | ✅ Sim | A (ativas da mesma área) |
| Meta Semanal | ✅ Sim | M (ativas) |
| Meta Diária | ✅ Sim | S (ativas) |
| Tarefa | ❌ Não | Meta (opcional - qualquer nível) |

### 5.3 Auto-preenchimento
- Ao selecionar pai, área deve ser auto-preenchida
- Usuário pode alterar área se necessário
- Se mudar área, validar se pai continua compatível

---

## 6. Dependências Técnicas

### 6.1 Pacotes NPM Necessários
- `react-hook-form` - já instalado (shadcn/ui form)
- `@hookform/resolvers` - para validação Zod
- `zod` - para schemas de validação
- `date-fns` - para manipulação de datas
- `lucide-react` - já instalado

### 6.2 Estrutura de Componentes a Criar

```
src/app/components/
├── forms/
│   ├── AreaForm.tsx
│   ├── MetaForm.tsx (genérico ou por nível)
│   └── TarefaForm.tsx
├── empty-state/
│   └── EmptyState.tsx
└── shared/
    ├── MetaSelector.tsx (para seleção de meta pai)
    ├── AreaSelector.tsx
    └── SmartFields.tsx (para campos SMART dinâmicos)
```

### 6.3 Rotas a Atualizar em `routes.ts`

```typescript
// Substituir PlaceholderPage por páginas reais
import AreaDetailPage from './pages/areas/AreaDetailPage';
import AreaEditPage from './pages/areas/AreaEditPage';
import GrandeMetaCreatePage from './pages/metas/grandes/GrandeMetaCreatePage';
// ... outros imports

// Atualizar rotas:
// { path: '/areas/:id', Component: AreaDetailPage },
// { path: '/areas/:id/edit', Component: AreaEditPage },
// { path: '/metas/grandes/criar', Component: GrandeMetaCreatePage },
// ... etc
```

---

## 7. Critérios de Aceitação

### 7.1 Páginas de Criação
- [ ] Formulário valida campos obrigatórios
- [ ] Seleção de pai mostra apenas opções válidas
- [ ] Ao criar, redirect para página de detalhe
- [ ] Mensagem de sucesso via toast (sonner)

### 7.2 Páginas de Detalhe
- [ ] Exibe todos os campos da entidade
- [ ] Mostra link para entidade pai (se existir)
- [ ] Lista entidades filhas (seexistirem)
- [ ] Botões de ação (editar, deletar, status)

### 7.3 Páginas de Edição
- [ ] Pré-preenche dados existentes
- [ ] Salvar atualiza no banco
- [ ] Cancelar retorna para detalhe

### 7.4 Empty States
- [ ] Exibido quando não há dados
- [ ] Botão leva para página de criação
- [ ] Texto motivacional contextual

### 7.5 Hierarquia
- [ ] seleção de pai é filtrada por nível
- [ ] área é auto-preenchida ao selecionar pai
- [ ] mudanças de área são permitidas

---

## 8. Ordens de Prioridade

### Fase 1: Áreas (Alta Prioridade)
1. Área Detail
2. Área Edit
3. Atualizar AreasList para usar Empty State

### Fase 2: Grandes Metas (Alta Prioridade)
1. Grande Meta Create
2. Grande Meta Detail
3. Grande Meta Edit
4. Atualizar GrandesMetasPage para Empty State

### Fase 3: Metas Anuais, Mensais, Semanais, Diárias (Média)
- Repetir padrão de G para cada nível

### Fase 4: Tarefas (Média)
1. Tarefa Create
2. Tarefa Edit

### Fase 5: Refinamentos
- Empty States em todas as listas
- Validação de formulários
- Toast notifications
- Loading states

---

## 9. Notas Adicionais

1. **AppContext já tem métodos de CRUD** - não precisa criar novos serviços, apenas usar os existentes
2. **Tipos TypeScript** - já estão definidos em `src/lib/supabase.ts` (Database type)
3. **shadcn/ui** - já está tudo instalado, usar componentes existentes
4. **Hierarquia G→A→M→S→D** - implementada via campo `parent_id` no banco
5. **Focusing Question** - disponível para todos os níveis de meta

---

## 10. Historico de Decisões

- Sprint 1 focou em listas e dashboard ( PLACEHOLDERs deixados para Sprint 2)
- shadcn/ui instalado como dependência principal
- Supabase já configurado com services de CRUD