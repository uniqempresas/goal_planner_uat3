# SPEC - Sprint 4: Módulo de Áreas de Vida (CRUD Completo)

**Data de Criação:** 25/03/2026  
**Última Atualização:** 25/03/2026  
**Responsável:** Vibe Planner  
**Status:** Implementação Concluída ✅

---

## 1. Visão Geral

### 1.1 Objetivo

Implementar o módulo de Áreas de Vida com CRUD completo usando dados mockados. O módulo permite que usuários organizem suas metas em categorias específicas de vida, facilitando o acompanhamento e a priorização de objetivos em diferentes dimensões pessoais e profissionais.

### 1.2 Escopo

- [x] Mock data para Áreas de Vida
- [x] Hook customizado useAreas (mock)
- [x] Página de listagem de Áreas de Vida (/areas)
- [x] Componente de Card para cada Área
- [x] Formulário de criação de nova Área (/areas/new)
- [x] Formulário de edição de Área (/areas/:id/edit)
- [x] Exclusão de Área com confirmação
- [x] Página de detalhes de uma Área (/areas/:id)
- [x] Cor personalizada para cada Área
- [x] Seleção de ícones para Áreas
- [x] Estado vazio (empty state)
- [ ] Ordenação de Áreas (drag & drop) - NÃO IMPLEMENTADO

### 1.3 Dependências

- Sprint 3 concluída ✅
- React Router v7 configurado ✅
- shadcn/ui instalado ✅
- Tailwind CSS configurado ✅

---

## 2. Estrutura de Arquivos Implementada

```
src/
├── data/
│   └── mockAreas.ts              ✅ Implementado
├── types/
│   └── index.ts                  ✅ Implementado
├── hooks/
│   └── useAreas.ts               ✅ Implementado
├── components/
│   └── areas/
│       ├── AreaCard.tsx          ✅ Implementado
│       ├── AreaForm.tsx         ✅ Implementado
│       ├── ColorPicker.tsx      ✅ Implementado
│       ├── IconPicker.tsx       ✅ Implementado
│       └── DeleteConfirmModal.tsx ✅ Implementado
├── pages/
│   └── areas/
│       ├── AreasList.tsx        ✅ Implementado
│       ├── AreaDetail.tsx       ✅ Implementado
│       └── AreaFormPage.tsx    ✅ Implementado
└── lib/
    └── constants.ts              ✅ Implementado
```

---

## 3. Tipos TypeScript

### 3.1 Arquivo: `src/types/index.ts`

```typescript
// Status da área
export type AreaStatus = 'active' | 'inactive';

// Status da meta
export type GoalStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

// Prioridade da meta
export type GoalPriority = 'low' | 'medium' | 'high';

// Meta associada a uma área
export interface Goal {
  id: string;
  title: string;
  description?: string;
  status: GoalStatus;
  priority: GoalPriority;
  dueDate?: string;
  completedAt?: string;
  areaId: string;
  createdAt: string;
  updatedAt: string;
}

// Área de vida
export interface Area {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  status: AreaStatus;
  goals: Goal[];
  createdAt: string;
  updatedAt: string;
  order: number;
}

// Dados para criação de área (sem id e timestamps)
export type CreateAreaInput = Omit<
  Area,
  'id' | 'createdAt' | 'updatedAt' | 'goals'
>;

// Dados para atualização de área
export type UpdateAreaInput = Partial<CreateAreaInput>;

// Tipo para filtragem na listagem
export type AreaFilter = 'all' | 'active' | 'inactive';

// Stats de uma área
export interface AreaStats {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  overdueGoals: number;
  progress: number;
}
```

---

## 4. Constantes

### 4.1 Arquivo: `src/lib/constants.ts`

```typescript
// Cores predefinidas para áreas de vida
export const AREA_COLORS = [
  { name: 'Azul', value: '#3B82F6', emotion: 'Profissional, confiança' },
  { name: 'Verde', value: '#10B981', emotion: 'Crescimento, saúde' },
  { name: 'Amarelo', value: '#F59E0B', emotion: 'Energia, cautela' },
  { name: 'Laranja', value: '#F97316', emotion: 'Motivação, ação' },
  { name: 'Roxo', value: '#8B5CF6', emotion: 'Criatividade, espiritualidade' },
  { name: 'Pink', value: '#EC4899', emotion: 'Amor, relacionamentos' },
  { name: 'Cinza', value: '#6B7280', emotion: 'Neutro, geral' },
  { name: 'Ciano', value: '#06B6D4', emotion: 'Calma, comunicação' },
] as const;

// Ícones disponíveis para áreas (lucide-react)
export const AREA_ICONS = [
  { name: 'Briefcase', category: 'Trabalho' },
  { name: 'Laptop', category: 'Trabalho' },
  { name: 'Code', category: 'Trabalho' },
  { name: 'GraduationCap', category: 'Trabalho' },
  { name: 'Heart', category: 'Saúde' },
  { name: 'Activity', category: 'Saúde' },
  { name: 'Apple', category: 'Saúde' },
  { name: 'Dumbbell', category: 'Saúde' },
  { name: 'Wallet', category: 'Finanças' },
  { name: 'DollarSign', category: 'Finanças' },
  { name: 'PieChart', category: 'Finanças' },
  { name: 'TrendingUp', category: 'Finanças' },
  { name: 'Users', category: 'Família' },
  { name: 'Home', category: 'Família' },
  { name: 'Baby', category: 'Família' },
  { name: 'Star', category: 'Pessoal' },
  { name: 'Smile', category: 'Pessoal' },
  { name: 'Coffee', category: 'Pessoal' },
  { name: 'BookOpen', category: 'Pessoal' },
  { name: 'Target', category: 'Outros' },
  { name: 'Flag', category: 'Outros' },
  { name: 'Calendar', category: 'Outros' },
  { name: 'MapPin', category: 'Outros' },
  { name: 'Plane', category: 'Outros' },
  { name: 'Music', category: 'Outros' },
  { name: 'Gamepad2', category: 'Outros' },
  { name: 'Palette', category: 'Outros' },
] as const;

// Limites de validação
export const AREA_VALIDATION = {
  name: {
    minLength: 2,
    maxLength: 100,
  },
  description: {
    maxLength: 500,
  },
} as const;
```

---

## 5. Hook Customizado

### 5.1 Arquivo: `src/hooks/useAreas.ts`

**Funcionalidades implementadas:**

- `getAreaById(id)` - Retorna área pelo ID ✅
- `calculateStats(areaId)` - Calcula estatísticas ✅
- `createArea(data)` - Cria nova área ✅
- `updateArea(id, data)` - Atualiza área existente ✅
- `deleteArea(id)` - Exclui área ✅
- `reorderAreas(newOrder)` - Reordena áreas (implementado no hook, mas UI não implementada) ⚠️
- `filterAreas(filter)` - Filtra por status ✅
- `searchAreas(query)` - Busca por nome ✅
- `getFilteredAreas(filter, searchQuery)` - Combinação de filtros e busca ✅

---

## 6. Componentes

### 6.1 ColorPicker (`src/components/areas/ColorPicker.tsx`)

- Seletor de cores predefinidas ✅
- Suporte a cor customizada ✅
- Visualização de seleção atual ✅

### 6.2 IconPicker (`src/components/areas/IconPicker.tsx`)

- Grid de ícones da biblioteca lucide-react ✅
- Seleção por clique ✅
- Renderização correta dos ícones ✅

### 6.3 AreaCard (`src/components/areas/AreaCard.tsx`)

- Exibição de cor e ícone ✅
- Nome e descrição ✅
- Barra de progresso ✅
- Contador de metas ✅
- Status (ativo/inativo) ✅
- Menu dropdown com editar/excluir ✅
- Clique navega para detalhes ✅

### 6.4 DeleteConfirmModal (`src/components/areas/DeleteConfirmModal.tsx`)

- Modal de confirmação com ícone de alerta ✅
- Nome da área a ser excluída ✅
- Contagem de metas afetadas ✅
- Botões Cancelar e Excluir ✅
- Estados de loading ✅

### 6.5 AreaForm (`src/components/areas/AreaForm.tsx`)

- Validação com Zod ✅
- Campos: Nome, Descrição, Cor, Ícone, Status ✅
- Botões de Cancelar e Salvar ✅
- Estados de loading ✅

---

## 7. Páginas

### 7.1 AreasList (`src/pages/areas/AreasList.tsx`)

- Título "Áreas de Vida" com descrição ✅
- Campo de busca em tempo real ✅
- Dropdown de filtro por status ✅
- Botão "Nova Área" ✅
- Grid responsivo de cards ✅
- Modal de confirmação de exclusão ✅
- Empty state ✅
- Loading state com Skeleton ✅

### 7.2 AreaDetail (`src/pages/areas/AreaDetail.tsx`)

- Breadcrumb de navegação ✅
- Nome da área em destaque ✅
- Cor e ícone ✅
- Descrição ✅
- Data de criação ✅
- Estatísticas (Total, Concluídas, Em Andamento, Atrasadas) ✅
- Barra de progresso geral ✅
- Lista de metas ✅
- Botões Editar e Excluir ✅

### 7.3 AreaFormPage (`src/pages/areas/AreaFormPage.tsx`)

- Reutiliza componente AreaForm ✅
- Rotas: /areas/new e /areas/:id/edit ✅
- Tratamento de loading ✅
- Redirect se área não encontrada (modo edição) ✅

---

## 8. Rotas

### 8.1 Arquivo: `src/routes.tsx`

```typescript
// Rotas de Áreas de Vida
{
  path: 'areas',
  children: [
    {
      index: true,
      element: <AreasList />,
    },
    {
      path: 'new',
      element: <AreaFormPage />,
    },
    {
      path: ':id',
      element: <AreaDetail />,
    },
    {
      path: ':id/edit',
      element: <AreaFormPage />,
    },
  ],
},
```

---

## 9. Validações

| Campo     | Regra              | Mensagem                                      |
| --------- | ------------------ | --------------------------------------------- |
| Nome      | Obrigatório        | "Nome é obrigatório"                          |
| Nome      | Mín 2 caracteres   | "Nome deve ter pelo menos 2 caracteres"       |
| Nome      | Máx 100 caracteres | "Nome deve ter no máximo 100 caracteres"      |
| Descrição | Máx 500 caracteres | "Descrição deve ter no máximo 500 caracteres" |
| Cor       | Obrigatória        | Seleção obrigatória (default: #3B82F6)        |
| Status    | Default: active    | -                                             |

---

## 10. Fluxos de Usuário

### 10.1 Criar Nova Área

```
1. Usuário acessa /areas
2. Clica no botão "Nova Área"
3. Sistema navega para /areas/new
4. Usuário preenche formulário (nome, descrição, cor, ícone)
5. Clica em "Criar Área"
6. Sistema cria área e navega para /areas/:id
```

### 10.2 Editar Área

```
1. Usuário acessa /areas
2. Clica no ícone de editar no card OU acessa /areas/:id e clica em "Editar"
3. Sistema navega para /areas/:id/edit
4. Usuário modifica campos desejados
5. Clica em "Salvar Alterações"
6. Sistema atualiza área e navega para /areas/:id
```

### 10.3 Excluir Área

```
1. Usuário acessa /areas
2. Clica no ícone de excluir no card
3. Modal de confirmação abre
4. Usuário visualiza nome e quantidade de metas afetadas
5. Clica em "Excluir"
6. Sistema remove área e atualiza lista
```

### 10.4 Visualizar Detalhes

```
1. Usuário acessa /areas
2. Clica no card da área
3. Sistema navega para /areas/:id
4. Usuário visualiza estatísticas, progresso e metas
```

---

## 11. Pendências e Melhorias Futuras

### 11.1 NÃO IMPLEMENTADO - Ordenação Drag & Drop

A funcionalidade de reorderAreas está implementada no hook, mas a UI para reordenar áreas via drag & drop não foi implementada. Requer biblioteca adicional (ex: @dnd-kit).

**Recomendação:** Adiar para sprint futura se necessário.

### 11.2 Melhorias opcionais

- Toast notifications (sonner) após criar/editar/excluir
- Funcionalidade de toggle de completo em metas na página de detalhes
- Redirecionamento para página de metas ao clicar em "Nova Meta" na página de detalhes

---

## 12. Critérios de Aceite Verificados

### 12.1 Criação de Área ✅

- [x] Usuário consegue acessar página de criação via botão "Nova Área"
- [x] Formulário valida campos obrigatórios
- [x] Usuário pode selecionar cor de uma paleta predefinida
- [x] Usuário pode selecionar ícone de uma lista categorizada
- [x] Usuário pode definir status (ativo/inativo)
- [x] Após criação, área aparece na lista

### 12.2 Edição de Área ✅

- [x] Usuário pode acessar página de edição via ícone no card ou botão na página de detalhes
- [x] Formulário é pré-preenchido com dados existentes
- [x] Alterações são salvas corretamente

### 12.3 Exclusão de Área ✅

- [x] Usuário pode excluir área via ícone no card ou botão na página de detalhes
- [x] Modal de confirmação abre com informações relevantes
- [x] Usuário pode cancelar ou confirmar exclusão
- [x] Após exclusão, área é removida da lista

### 12.4 Aparência ✅

- [x] Cada área exibe cor distintiva
- [x] Cada área exibe ícone representativo
- [x] Barra de progresso reflete % de metas concluídas
- [x] Interface responsiva (mobile, tablet, desktop)

### 12.5 Busca e Filtro ✅

- [x] Campo de busca filtra áreas por nome em tempo real
- [x] Filtro de status (Todas/Ativas/Inativas) funciona corretamente
- [x] Busca e filtro podem ser combinados

### 12.6 Estado Vazio ✅

- [x] Quando não há áreas, mensagem explicativa é exibida
- [x] Botão para criar primeira área está presente e funcional

---

## 13. Histórico de Versões

| Versão | Data       | Descrição                               |
| ------ | ---------- | --------------------------------------- |
| 1.0    | 25/03/2026 | Versão inicial - Implementação completa |

---

## 14. Referências

- **PRD:** `tracking/docs/PRD-Sprint-04.md`
- **UI/UX Docs:** `tracking/docs/frontend/modulo-areas-de-vida.md`
- **Wireframes:** `tracking/wireframes/modulo-03-areas-de-vida.md`
