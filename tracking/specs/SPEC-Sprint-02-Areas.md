# SPEC Sprint 02 - Páginas de Área (Detail, Edit e Empty State)

**Data**: 2026-04-03  
**Versão**: 1.0  
**Status**: Pronto para Implementação  
**Prioridade**: Alta

---

## 1. Visão Geral

Esta especificação detalha a implementação das primeiras páginas do Sprint 02, seguindo o padrão visual existente em `AreasListPage.tsx` e utilizando os serviços disponíveis no `AppContext`.

**Objetivos Técnicos**:
- Criar páginas funcionais com design consistente ao projeto
- Utilizar shadcn/ui para componentes de formulário
- Integrar com AppContext para estado e mutations
- Preparar estrutura para Empty States reutilizáveis

---

## 2. Abordagem Técnica

### 2.1 Stack Tecnológico
- **Framework**: React + React Router
- **Estilização**: Tailwind CSS (classes existentes do projeto)
- **Estado**: AppContext (`useApp()` hook)
- **Componentes UI**: shadcn/ui (`src/app/components/ui/`)
- **Ícones**: lucide-react

### 2.2 Padrão Visual
- Container principal: `p-6 max-w-5xl mx-auto`
- Cores de texto: `text-slate-800` (títulos), `text-slate-500` (descrições), `text-slate-400` (metadados)
- Cores de ação: `indigo-600` (primária), `slate-500` (secundária)
- Cards: `bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all`
- Tipografia: `text-sm` (corpo), `text-xs` (metadados), `text-xl`/`text-2xl` (títulos de seção)

### 2.3 Estrutura de Arquivos
```
src/app/
├── pages/areas/
│   ├── AreaDetailPage.tsx    # NOVO
│   └── AreaEditPage.tsx      # NOVO
├── components/
│   └── empty-state/           # A criar
│       └── EmptyState.tsx    # NOVO
```

---

## 3. Página: AreaDetailPage

### 3.1 Rota e Propósito
- **Rota**: `/areas/:id`
- **Props da Rota**: `useParams<{ id: string }>()`
- **Função**: Exibir detalhes de uma área, seu progresso e metas vinculadas

### 3.2 UI/UX Design

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│  Breadcrumb: Áreas > [Nome da Área]                  │
├─────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────────────────────┐ │
│  │  Emoji 64px  │  │  Nome da Área               │ │
│  │  Cor de Fundo│  │  Descrição opcional         │ │
│  │              │  │  [Botão Editar] [Botão Voltar]│ │
│  └──────────────┘  └──────────────────────────────┘ │
├─────────────────────────────────────────────────────┤
│  Estatísticas (Card)                                │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐               │
│  │ Total   │ │ Ativas  │ │ Concluíd│               │
│  │ Metas   │ │         │ │ as      │               │
│  └─────────┘ └─────────┘ └─────────┘               │
├─────────────────────────────────────────────────────┤
│  Progresso Geral (Barra de progresso)               │
│  ████████████░░░░░░░ 65%                            │
├─────────────────────────────────────────────────────┤
│  Grandes Metas Vinculadas                           │
│  ┌─────────────────────────────────────────────┐   │
│  │ [Badge G] Título da Meta          [Progress] │   │
│  │         Área relacionada           [>]      │   │
│  └─────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────┐   │
│  │ [Badge G] Título da Meta          [Progress] │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

**Detalhamento Visual**:
- **Header**: Flexbox com emoji grande (64x64, rounded-xl) e informações ao lado
- **Cores**: Usar `area.color` para acentos e `area.bgColor` para fundo do emoji
- **Estatísticas**: 3 cards pequenos em grid (1fr 1fr 1fr), borda sutil
- **Progresso**: Barra de progresso simples (bg-slate-100 + área color)
- **Lista de Metas**: Cards de meta similares ao existentes, filtrados por `areaId`

### 3.3 Componentes Necessários
- `Breadcrumb` (shadcn/ui ou manual)
- `Card`, `CardHeader`, `CardTitle`, `CardContent` (shadcn/ui)
- `Badge` (shadcn/ui) - para badge "G"
- `Button` (shadcn/ui) - para ações
- `Progress` (shadcn/ui) - para barra de progresso
- `ArrowLeft`, `Pencil`, `MoreHorizontal` (lucide-react)

### 3.4 Fluxo de Dados

```typescript
// Hooks necessários
const { id } = useParams();
const { getAreaById, grandesMetas } = useApp();

// Busca de dados
const area = getAreaById(id);

// Filtragem de metas filhas
const metasDaArea = grandesMetas.filter(m => m.area_id === id);

// Cálculo de progresso
// O progresso pode vir do campo 'progress' da área (se existir) ou ser calculado
// Considerando que o banco pode não ter esse campo ainda, usar fallback:
const totalMetas = metasDaArea.length;
const metasConcluidas = metasDaArea.filter(m => m.status === 'concluida').length;
const progresso = totalMetas > 0 ? Math.round((metasConcluidas / totalMetas) * 100) : 0;
```

### 3.5 Tratamento de Erros
- Se `area` for `undefined`: Renderizar componente "Área não encontrada" com botão de voltar
- Loading state: Skeleton durante busca de dados (se necessário, mas dados devem estar no contexto)

### 3.6 Tipos e Interfaces

```typescript
interface AreaDetailPageProps {
  // Herda parâmetros da rota
}

interface MetaCardProps {
  meta: Meta;
  onNavigate?: (id: string) => void;
}
```

### 3.7 Validações
- Verificar se `id` existe na URL
- Tratar caso área não seja encontrada (`!area`)

### 3.8 Critérios de Aceitação
- [ ] Página renderiza com dados corretos da área
- [ ] Emoji e cor da área são exibidos corretamente
- [ ] Lista de Grandes Metas filtra apenas metas dessa área
- [ ] Progresso é calculado e exibido
- [ ] Botão "Editar" navega para `/areas/:id/edit`
- [ ] Botão "Voltar" funciona
- [ ] Layout é responsivo (mobile/desktop)

---

## 4. Página: AreaEditPage

### 4.1 Rota e Propósito
- **Rota**: `/areas/:id/edit`
- **Props da Rota**: `useParams<{ id: string }>()`
- **Função**: Formulário para editar dados de uma área existente

### 4.2 UI/UX Design

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│  Breadcrumb: Áreas > [Nome] > Editar                │
├─────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐   │
│  │  Formulário                                 │   │
│  │                                             │   │
│  │  Nome * [________________]                   │   │
│  │                                             │   │
│  │  Emoji    [🎯] [✈️] [💼] [💰] [+ Custom]     │   │
│  │           (Grid de ícones selecionáveis)    │   │
│  │                                             │   │
│  │  Cor      [●][●][●][●][●][●][●][●]        │   │
│  │           (Color picker ou preset)          │   │
│  │                                             │   │
│  │  Descrição                                  │   │
│  │  [                                       ] │   │
│  │                                             │   │
│  │  [Cancelar]              [Salvar Alterações]│   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### 4.3 Componentes shadcn/ui
- `Form` (react-hook-form)
- `FormField`, `FormItem`, `FormLabel`, `FormMessage`
- `Input` (para Nome)
- `Textarea` (para Descrição)
- `Button` (submit e cancel)
- `Popover` + `Calendar` (se necessário para data, mas área geralmente não tem)
- `Alert` (para erros de validação)

### 4.4 Fluxo de Dados

```typescript
// State do formulário (react-hook-form + zod)
const form = useForm<AreaFormSchema>({
  resolver: zodResolver(areaFormSchema),
  defaultValues: {
    nome: area?.nome || '',
    icone: area?.icone || '🎯',
    cor: area?.cor || '#6366f1', // indigo-500 default
    descricao: area?.descricao || '',
  }
});

// Submit
const onSubmit = async (values: AreaFormSchema) => {
  await updateArea(id, values);
  navigate(`/areas/${id}`);
};
```

### 4.5 Validação (Zod Schema)

```typescript
const areaFormSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").max(100),
  icone: z.string().emoji().optional().default('🎯'),
  cor: z.string().regex(/^#/).default('#6366f1'),
  descricao: z.string().max(500).optional(),
});
```

### 4.6 Componente: EmojiPicker e ColorPicker

**EmojiPicker**:
- Array de emojis populares como presets: `['🎯', '✈️', '💼', '💰', '🏠', '❤️', '🧠', '💪', '🌱', '🎨', '📚', '🚴']`
- Layout: Grid flexível com 点击 para selecionar
- Input manual permitido para emojis custom

**ColorPicker**:
- Presets de cores do projeto:
  ```javascript
  const colorPresets = [
    '#6366f1', // indigo-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
    '#22c55e', // green-500
    '#14b8a6', // teal-500
    '#0ea5e9', // sky-500
    '#3b82f6', // blue-500
  ];
  ```
- Layout: Grid de círculos coloridos clicáveis

### 4.7 Tratamento de States
- **Loading**: Desabilitar botão "Salvar" e mostrar spinner durante mutation
- **Erro**: Mostrar toast de erro se `updateArea` falhar
- **Sucesso**: Redirecionar para página de detalhe após sucesso

### 4.8 Critérios de Aceitação
- [ ] Formulário pré-preenchido com dados existentes
- [ ] Validação de nome obrigatório funciona
- [ ] Seleção de emoji atualiza valor no formulário
- [ ] Seleção de cor atualiza valor no formulário
- [ ] Submit atualiza dados via AppContext
- [ ] Cancelar retorna para página de detalhe
- [ ] Layout responsivo

---

## 5. Atualização: AreasListPage

### 5.1 Necessidade
A página atual não implementa Empty State. Precisamos adicionar verificação de `areas.length`.

### 5.2 Implementação do EmptyState

**Estrutura do Componente**:
```tsx
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  actionOnClick?: () => void;
}
```

**Localização**: Criar em `src/app/components/empty-state/EmptyState.tsx`

**Design**:
- Container centralizado (flex, justify-center, items-center, min-h-[400px])
- Ícone grande (size=48 ou 64, text-slate-300)
- Título (text-xl font-semibold text-slate-800)
- Descrição (text-slate-500 text-center max-w-md)
- Botão de ação (se fornecido)

### 5.3 Atualização na AreasListPage

```tsx
// Adicionar após imports
import EmptyState from '../../components/empty-state/EmptyState';
import { Plus } from 'lucide-react';

// Substituir grid condicionalmente
{areas.length === 0 ? (
  <EmptyState
    icon={<Target className="w-12 h-12 text-slate-300" />}
    title="Nenhuma área ainda"
    description="Crie áreas para organizar suas metas por dimensões de vida."
    actionLabel="Criar Primeira Área"
    actionHref="/areas/criar" // Precisa existir ou criar rota
  />
) : (
  // ... grid existente
)}
```

### 5.4 Critérios de Aceitação
- [ ] Empty State exibido quando `areas.length === 0`
- [ ] Layout profissional e consistente com o padrão do app
- [ ] Botão de ação funcional

---

## 6. Tarefas de Implementação

### Fase 1: Componentes Auxiliares
- [ ] **Tarefa 1.1**: Criar componente `EmptyState.tsx` em `src/app/components/empty-state/`
- [ ] **Tarefa 1.2**: Criar componente `EmojiPicker.tsx` em `src/app/components/forms/` (ou inline)
- [ ] **Tarefa 1.3**: Criar componente `ColorPicker.tsx` em `src/app/components/forms/` (ou inline)

### Fase 2: Páginas de Área
- [ ] **Tarefa 2.1**: Criar `AreaDetailPage.tsx` em `src/app/pages/areas/`
- [ ] **Tarefa 2.2**: Criar `AreaEditPage.tsx` em `src/app/pages/areas/`
- [ ] **Tarefa 2.3**: Configurar rotas em `src/app/routes.tsx` (ou equivalente)
  - `{ path: '/areas/:id', Component: AreaDetailPage }`
  - `{ path: '/areas/:id/edit', Component: AreaEditPage }`

### Fase 3: Integração
- [ ] **Tarefa 3.1**: Atualizar `AreasListPage.tsx` para incluir Empty State

---

## 7. Dependências e Notas

- **Validação**: Usar `zod` + `@hookform/resolvers` (já instalados)
- **Toasts**: Usar `sonner` (shadcn/ui) para feedback de sucesso/erro
- **Navegação**: `useNavigate` do react-router
- **Types**: Importar `Meta` e `Area` de `AppContext` ou `supabase.ts`
- **Ícones**: lucide-react (já em uso)

---

## 8. Glossário

- **G**: Grande Meta (nível mais alto da hierarquia)
- **AppContext**: Contexto global React com estado da aplicação
- **shadcn/ui**: Biblioteca de componentes utilizada no projeto
- **Empty State**: Estado de interface mostrado quando não há dados para exibir
