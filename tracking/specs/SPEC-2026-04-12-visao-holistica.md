# SPEC-2026-04-12-visao-holistica.md

## Technical Specification: Visão Holística

**Project:** Goal Planner  
**Feature:** Visão Holística (Holistic View)  
**Author:** @vibe-planner  
**Date:** 2026-04-12  
**Status:** Draft  
**Related PRD:** PRD-YYYY-MM-DD-visao-holistica *(to be created)*

---

## 1. Visão Geral Técnica

### 1.1 Objetivo
Criar uma tela de visão holística que apresente a hierarquia completa de metas (Grande → Anual → Mensal → Semanal) de forma progressiva, com expansão/colapso inline, filtros avançados e cálculo automático de progresso.

### 1.2 Principais Desafios Técnicos
1. **Performance com grandes hierarquias** - Potencial necessidade de virtualização
2. **Cálculo de progresso em tempo real** - Agregação recursiva eficiente
3. **Persistência de estado** - Árvore expandida/colapsada no localStorage
4. **Responsividade** - Mobile (drill-down) vs Desktop (árvore completa)
5. **Filtros complexos** - Composição de múltiplos critérios com debounce

### 1.3 Decisões Arquiteturais
- **Visualização:** Inline (expansão dentro da própria lista)
- **Domino Effect:** Implementado via React Context + callback pattern
- **Metas sem data:** "Caixa de Backlog" separada (todas as metas precisam ter data)
- **Progresso:** Automático baseado nos filhos (média simples)
- **Fluxo de criação:** Reutilizar telas de criação existentes

---

## 2. Arquitetura de Componentes

### 2.1 Hierarquia de Componentes

```
VisaoHolisticaPage
├── NavigationHeader (🎯 Visão Holística | 📅 Hoje | 📊 Dashboard)
├── ControlBar
│   ├── FilterTabs (Ativas | Concluídas | Atrasadas | Todas)
│   ├── SearchInput (busca textual)
│   ├── GroupBySelector (Área de Vida | Data | Prioridade)
│   └── ZoomToggle (Compacto | Normal | Detalhado)
├── BacklogSection (metas sem data)
└── TreeView
    └── MetaTreeNode (recursivo)
        ├── MetaCard
        │   ├── ExpandToggle [▼/▶]
        │   ├── LevelIcon [Ícone G/A/M/S]
        │   ├── Title
        │   ├── DateRange
        │   ├── ProgressBar
        │   ├── OneThingBadge (condicional)
        │   └── ActionButtons
        └── MetaTreeNode[] (filhos, lazy-loaded)
```

### 2.2 Props e Interfaces

```typescript
// Tipos base
interface MetaNode extends Meta {
  children?: MetaNode[];
  computedProgress: number;
  status: 'ativa' | 'concluida' | 'atrasada' | 'critica' | 'backlog';
}

// Props dos componentes principais
interface VisaoHolisticaPageProps {
  // Page não recebe props - usa context e hooks
}

interface ControlBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  groupBy: GroupByOption;
  onGroupByChange: (option: GroupByOption) => void;
}

interface FilterState {
  status: 'ativas' | 'concluidas' | 'atrasadas' | 'todas';
  searchQuery: string;
  areaId?: string;
}

type ViewMode = 'compacto' | 'normal' | 'detalhado';
type GroupByOption = 'nenhum' | 'area' | 'data' | 'prioridade';

interface MetaTreeNodeProps {
  meta: MetaNode;
  level: number; // 0 = Grande, 1 = Anual, 2 = Mensal, 3 = Semanal
  expandedNodes: Set<string>;
  onToggleExpand: (metaId: string) => void;
  viewMode: ViewMode;
}

interface MetaCardProps {
  meta: MetaNode;
  level: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  viewMode: ViewMode;
  hasChildren: boolean;
}
```

---

## 3. Estratégia de Estado

### 3.1 Estado Local (useState)

```typescript
// VisaoHolisticaPage
const [filters, setFilters] = useState<FilterState>({
  status: 'ativas',
  searchQuery: '',
});
const [viewMode, setViewMode] = useState<ViewMode>('normal');
const [groupBy, setGroupBy] = useState<GroupByOption>('nenhum');
const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
const [focusedNode, setFocusedNode] = useState<string | null>(null);

// Loading states
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<Error | null>(null);
```

### 3.2 Persistência no localStorage

```typescript
const STORAGE_KEY = 'visao-holistica-state';

interface PersistedState {
  expandedNodes: string[];
  viewMode: ViewMode;
  filters: FilterState;
  lastVisited: string;
}

// Hook personalizado para persistência
function usePersistedTreeState() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? new Set(JSON.parse(saved).expandedNodes) : new Set();
  });

  useEffect(() => {
    const state: PersistedState = {
      expandedNodes: Array.from(expandedNodes),
      viewMode,
      filters,
      lastVisited: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [expandedNodes, viewMode, filters]);

  return { expandedNodes, setExpandedNodes };
}
```

### 3.3 Cache de Dados (React Query / SWR pattern)

```typescript
// Usando um hook customizado para dados
function useMetasHierarchy(userId: string) {
  return useQuery({
    queryKey: ['metas', 'hierarchy', userId],
    queryFn: () => metasService.getFullHierarchy(userId),
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });
}

// Invalidação manual após mutações
function useInvalidateMetasCache() {
  const queryClient = useQueryClient();
  return {
    invalidate: () => {
      queryClient.invalidateQueries({ queryKey: ['metas'] });
    },
  };
}
```

### 3.4 Otimização de Re-renderização

1. **React.memo** em MetaCard e MetaTreeNode
2. **useMemo** para cálculo de progresso e filtros
3. **useCallback** para handlers de toggle e seleção
4. **Virtualização** com react-window para listas grandes (>100 itens)

---

## 4. Queries e Data Fetching

### 4.1 Estrutura da Query para Hierarquia Completa

**Abordagem recomendada:** Buscar todos os dados e montar a árvore no cliente

```typescript
// services/metasService.ts
async function getFullHierarchy(userId: string): Promise<MetaNode[]> {
  // Busca todas as metas do usuário em uma query
  const { data, error } = await supabase
    .from('metas')
    .select(`
      id,
      user_id,
      area_id,
      parent_id,
      nivel,
      titulo,
      descricao,
      status,
      one_thing,
      prioridade,
      focusing_question,
      smart_objetivo,
      smart_especifico,
      smart_mensuravel,
      smart_alcancavel,
      smart_relevante,
      smart_temporizado,
      metricas,
      created_at,
      updated_at,
      areas:area_id (nome, icone, cor)
    `)
    .eq('user_id', userId)
    .neq('status', 'arquivada') // Excluir arquivadas por padrão
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Montar estrutura hierárquica
  return buildHierarchy(data || []);
}
```

### 4.2 Construção da Hierarquia

```typescript
function buildHierarchy(metas: Meta[]): MetaNode[] {
  const map = new Map<string, MetaNode>();
  const roots: MetaNode[] = [];

  // Primeira passagem: criar nós
  metas.forEach(meta => {
    map.set(meta.id, {
      ...meta,
      children: [],
      computedProgress: 0,
    });
  });

  // Segunda passagem: estabelecer relações
  metas.forEach(meta => {
    const node = map.get(meta.id)!;
    
    if (meta.parent_id && map.has(meta.parent_id)) {
      const parent = map.get(meta.parent_id)!;
      parent.children = parent.children || [];
      parent.children.push(node);
    } else {
      // Ordenar por hierarquia: grande > anual > mensal > semanal
      const nivelOrder = { 'grande': 0, 'anual': 1, 'mensal': 2, 'semanal': 3, 'diaria': 4 };
      roots.push(node);
      roots.sort((a, b) => nivelOrder[a.nivel] - nivelOrder[b.nivel]);
    }
  });

  // Terceira passagem: calcular progresso recursivamente
  calculateProgressRecursively(roots);

  return roots;
}
```

### 4.3 Estratégia de Loading

```typescript
// Estados de loading granular
interface LoadingState {
  initial: boolean;      // Carregamento inicial da página
  refreshing: boolean;   // Revalidação em background
  expanding: Set<string>; // IDs sendo expandidos (lazy loading)
}

// Skeleton components
function TreeSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3].map(i => (
        <Skeleton key={i} className="h-16 w-full" />
      ))}
    </div>
  );
}
```

### 4.4 Tratamento de Erro

```typescript
interface ErrorState {
  type: 'network' | 'permission' | 'unknown';
  message: string;
  retry: () => void;
}

function ErrorDisplay({ error }: { error: ErrorState }) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erro ao carregar metas</AlertTitle>
      <AlertDescription>
        {error.message}
        <Button onClick={error.retry} variant="outline" size="sm" className="ml-2">
          Tentar novamente
        </Button>
      </AlertDescription>
    </Alert>
  );
}
```

---

## 5. Algoritmos

### 5.1 Cálculo de Progresso Automático

```typescript
function calculateProgressRecursively(nodes: MetaNode[]): number {
  if (!nodes.length) return 0;

  const totalProgress = nodes.reduce((sum, node) => {
    // Metas semanais: progresso manual
    if (node.nivel === 'semanal' || node.nivel === 'diaria') {
      const progress = node.metricas?.progresso_manual || 0;
      node.computedProgress = progress;
      return sum + progress;
    }

    // Metas superiores: média dos filhos
    if (node.children && node.children.length > 0) {
      node.computedProgress = calculateProgressRecursively(node.children);
    } else {
      // Sem filhos: usar progresso do banco ou 0
      node.computedProgress = node.metricas?.progresso_manual || 0;
    }

    return sum + node.computedProgress;
  }, 0);

  return Math.round(totalProgress / nodes.length);
}
```

### 5.2 Cálculo de Status (Em dia / Atrasado / Crítico)

```typescript
function calculateMetaStatus(meta: Meta): MetaStatus {
  const now = new Date();
  const prazo = meta.prazo ? new Date(meta.prazo) : null;
  
  // Metas concluídas
  if (meta.status === 'concluida') return 'concluida';
  
  // Metas sem data -> backlog
  if (!prazo) return 'backlog';

  const diasRestantes = differenceInDays(prazo, now);
  const progresso = meta.computedProgress || 0;
  
  // Verificar proporcionalidade do tempo
  const tempoTotal = differenceInDays(prazo, new Date(meta.created_at));
  const tempoPassado = tempoTotal - diasRestantes;
  const progressoEsperado = tempoTotal > 0 ? (tempoPassado / tempoTotal) * 100 : 0;
  
  // Crítico: atrasado e com pouco progresso
  if (diasRestantes < 0) {
    return progresso < 80 ? 'critica' : 'atrasada';
  }
  
  // Atrasado: progresso menor que o esperado por mais de 20%
  if (progresso < progressoEsperado - 20) {
    return 'atrasada';
  }

  return 'ativa';
}
```

### 5.3 Filtros e Busca

```typescript
interface FilterCriteria {
  status?: 'ativas' | 'concluidas' | 'atrasadas' | 'todas';
  searchQuery?: string;
  areaId?: string;
  oneThingOnly?: boolean;
}

function filterMetas(nodes: MetaNode[], criteria: FilterCriteria): MetaNode[] {
  return nodes.filter(node => {
    // Filtro por status
    if (criteria.status && criteria.status !== 'todas') {
      const statusMap = {
        'ativas': ['ativa'],
        'concluidas': ['concluida'],
        'atrasadas': ['atrasada', 'critica'],
      };
      if (!statusMap[criteria.status]?.includes(node.status)) {
        return false;
      }
    }

    // Filtro por área
    if (criteria.areaId && node.area_id !== criteria.areaId) {
      return false;
    }

    // Filtro por ONE Thing
    if (criteria.oneThingOnly && !node.one_thing) {
      return false;
    }

    // Busca textual (título, descrição, focusing question)
    if (criteria.searchQuery) {
      const query = criteria.searchQuery.toLowerCase();
      const searchable = [
        node.titulo,
        node.descricao,
        node.focusing_question,
      ].join(' ').toLowerCase();
      
      if (!searchable.includes(query)) {
        return false;
      }
    }

    return true;
  }).map(node => ({
    ...node,
    children: node.children ? filterMetas(node.children, criteria) : undefined,
  }));
}
```

### 5.4 Ordenação Cronológica

```typescript
function sortByDate(nodes: MetaNode[]): MetaNode[] {
  const nivelPriority = {
    'grande': 0,
    'anual': 1,
    'mensal': 2,
    'semanal': 3,
    'diaria': 4,
  };

  return [...nodes].sort((a, b) => {
    // Primeiro por nível hierárquico
    if (nivelPriority[a.nivel] !== nivelPriority[b.nivel]) {
      return nivelPriority[a.nivel] - nivelPriority[b.nivel];
    }

    // Depois por data de início
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
    return dateA.getTime() - dateB.getTime();
  }).map(node => ({
    ...node,
    children: node.children ? sortByDate(node.children) : undefined,
  }));
}
```

### 5.5 Agrupamento

```typescript
function groupMetas(nodes: MetaNode[], groupBy: GroupByOption): GroupedMetas {
  if (groupBy === 'nenhum') {
    return { 'Todas': nodes };
  }

  const groups: GroupedMetas = {};

  nodes.forEach(node => {
    let key: string;

    switch (groupBy) {
      case 'area':
        key = node.areas?.nome || 'Sem Área';
        break;
      case 'data':
        key = node.prazo 
          ? format(new Date(node.prazo), 'MMMM yyyy', { locale: ptBR })
          : 'Sem Data';
        break;
      case 'prioridade':
        key = node.one_thing ? 'ONE Thing' : 'Normal';
        break;
      default:
        key = 'Outros';
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(node);
  });

  return groups;
}
```

---

## 6. Estrutura de Arquivos

```
src/
├── app/
│   ├── pages/
│   │   └── visao-holistica/
│   │       ├── VisaoHolisticaPage.tsx      # Página principal
│   │       ├── components/
│   │       │   ├── ControlBar.tsx          # Barra de filtros/controles
│   │       │   ├── MetaCard.tsx            # Card individual de meta
│   │       │   ├── MetaTreeNode.tsx        # Nó da árvore (recursivo)
│   │       │   ├── TreeView.tsx            # Container da árvore
│   │       │   ├── BacklogSection.tsx      # Seção de metas sem data
│   │       │   ├── FilterTabs.tsx          # Abas de filtro de status
│   │       │   ├── GroupBySelector.tsx     # Seletor de agrupamento
│   │       │   ├── ViewModeToggle.tsx      # Toggle de zoom/compactação
│   │       │   └── NavigationHeader.tsx    # Header com navegação global
│   │       ├── hooks/
│   │       │   ├── useMetasHierarchy.ts    # Hook de fetch da hierarquia
│   │       │   ├── useTreeState.ts         # Hook de estado da árvore
│   │       │   ├── useProgressCalculator.ts # Hook de cálculo de progresso
│   │       │   └── useKeyboardNavigation.ts # Hook de atalhos de teclado
│   │       ├── utils/
│   │       │   ├── hierarchyBuilder.ts     # Builder da árvore
│   │       │   ├── progressCalculator.ts   # Cálculo de progresso
│   │       │   ├── statusCalculator.ts     # Cálculo de status
│   │       │   ├── filters.ts              # Funções de filtro
│   │       │   └── sorting.ts              # Funções de ordenação
│   │       └── types.ts                    # Types específicos da página
│   ├── components/
│   │   └── ui/
│   │       └── virtual-list/               # Componente de virtualização
│   │           └── VirtualTree.tsx
│   └── hooks/
│       └── usePersistedState.ts            # Hook genérico de persistência
├── services/
│   └── metasService.ts                     # Adicionar getFullHierarchy()
└── lib/
    └── constants.ts                        # Constantes de níveis, cores, etc.
```

### Convenções de Nomenclatura

- **Componentes:** PascalCase (MetaCard.tsx)
- **Hooks:** camelCase com prefixo `use` (useTreeState.ts)
- **Utils:** camelCase (hierarchyBuilder.ts)
- **Types:** PascalCase com sufixo (MetaNode, FilterState)
- **Testes:** Arquivos `.test.ts` ou `.spec.ts` junto aos arquivos

---

## 7. Testes

### 7.1 O que Precisa Ser Testado

#### Unit Tests (Jest/Vitest)

```typescript
// hierarchyBuilder.test.ts
describe('buildHierarchy', () => {
  it('should create correct parent-child relationships', () => {
    const metas = [
      { id: '1', nivel: 'grande', parent_id: null },
      { id: '2', nivel: 'anual', parent_id: '1' },
    ];
    const result = buildHierarchy(metas);
    expect(result[0].children).toHaveLength(1);
    expect(result[0].children[0].id).toBe('2');
  });

  it('should sort roots by hierarchy level', () => {
    const metas = [
      { id: '2', nivel: 'anual', parent_id: null },
      { id: '1', nivel: 'grande', parent_id: null },
    ];
    const result = buildHierarchy(metas);
    expect(result[0].nivel).toBe('grande');
  });
});

// progressCalculator.test.ts
describe('calculateProgressRecursively', () => {
  it('should calculate average of children for non-leaf nodes', () => {
    const nodes = [
      {
        id: '1',
        nivel: 'anual',
        children: [
          { id: '2', nivel: 'semanal', computedProgress: 50, metricas: { progresso_manual: 50 } },
          { id: '3', nivel: 'semanal', computedProgress: 100, metricas: { progresso_manual: 100 } },
        ],
      },
    ];
    calculateProgressRecursively(nodes);
    expect(nodes[0].computedProgress).toBe(75);
  });
});
```

#### Integration Tests (React Testing Library)

```typescript
// VisaoHolisticaPage.test.tsx
describe('VisaoHolisticaPage', () => {
  it('should expand node on click', async () => {
    render(<VisaoHolisticaPage />);
    const expandButton = screen.getByTestId('expand-1');
    fireEvent.click(expandButton);
    await waitFor(() => {
      expect(screen.getByTestId('node-2')).toBeInTheDocument();
    });
  });

  it('should filter metas by search query', async () => {
    render(<VisaoHolisticaPage />);
    const searchInput = screen.getByPlaceholderText('Buscar metas...');
    fireEvent.change(searchInput, { target: { value: 'teste' } });
    await waitFor(() => {
      expect(screen.queryByText('Meta não relacionada')).not.toBeInTheDocument();
    });
  });
});
```

#### E2E Tests (Playwright)

```typescript
// visao-holistica.spec.ts
test.describe('Visão Holística', () => {
  test('deve expandir e colapsar metas', async ({ page }) => {
    await page.goto('/visao-holistica');
    await page.click('[data-testid="expand-grande-1"]');
    await expect(page.locator('[data-testid="meta-anual-1"]')).toBeVisible();
    await page.click('[data-testid="collapse-grande-1"]');
    await expect(page.locator('[data-testid="meta-anual-1"]')).not.toBeVisible();
  });

  test('deve persistir estado expandido', async ({ page }) => {
    await page.goto('/visao-holistica');
    await page.click('[data-testid="expand-grande-1"]');
    await page.reload();
    await expect(page.locator('[data-testid="meta-anual-1"]')).toBeVisible();
  });

  test('deve navegar com atalhos de teclado', async ({ page }) => {
    await page.goto('/visao-holistica');
    await page.keyboard.press('ArrowRight');
    // Verificar expansão
    await page.keyboard.press('f');
    await expect(page.locator('[data-testid="filter-panel"]')).toBeVisible();
  });
});
```

### 7.2 Casos de Borda

1. **Metas circulares** (A filho de B, B filho de A) - detectar e quebrar ciclo
2. **Metas sem pai** com nível não-root - mover para backlog
3. **Muitos filhos** (>100) - implementar lazy loading
4. **Título muito longo** - truncar com ellipsis
5. **Sem conexão** - mostrar estado vazio apropriado
6. **Erro de permissão** - mostrar mensagem clara

---

## 8. Checklist de Implementação

### Fase 1: Setup e Fundação
- [ ] 1.1 Criar estrutura de pastas do módulo
- [ ] 1.2 Adicionar rota `/visao-holistica` em routes.ts
- [ ] 1.3 Adicionar item no menu de navegação (AppLayout)
- [ ] 1.4 Criar tipos TypeScript (MetaNode, FilterState, etc.)
- [ ] 1.5 Implementar `getFullHierarchy()` no metasService
- [ ] 1.6 Criar funções utilitárias base (hierarchyBuilder, progressCalculator)
- [ ] 1.7 Criar hook `usePersistedState` genérico

**Dependências:** Nenhuma
**Estimativa:** 4 horas

### Fase 2: Componentes Base
- [ ] 2.1 Criar componente NavigationHeader
- [ ] 2.2 Criar componente ControlBar
- [ ] 2.3 Criar componente FilterTabs
- [ ] 2.4 Criar componente GroupBySelector
- [ ] 2.5 Criar componente ViewModeToggle
- [ ] 2.6 Criar componente MetaCard (versão básica)
- [ ] 2.7 Criar componente BacklogSection

**Dependências:** Fase 1
**Estimativa:** 6 horas

### Fase 3: Árvore Hierárquica
- [ ] 3.1 Criar componente MetaTreeNode (recursivo)
- [ ] 3.2 Implementar lógica de expandir/colapsar
- [ ] 3.3 Adicionar animações de transição (framer-motion ou CSS)
- [ ] 3.4 Criar hook `useTreeState` com persistência
- [ ] 3.5 Implementar lazy loading de filhos
- [ ] 3.6 Criar componente TreeView
- [ ] 3.7 Testar com hierarquias profundas

**Dependências:** Fase 2
**Estimativa:** 8 horas

### Fase 4: Filtros e Busca
- [ ] 4.1 Implementar busca textual com debounce
- [ ] 4.2 Implementar filtros de status
- [ ] 4.3 Implementar filtro por área
- [ ] 4.4 Implementar agrupamento (Área/Data/Prioridade)
- [ ] 4.5 Implementar modos de visualização (Compacto/Normal/Detalhado)
- [ ] 4.6 Otimizar performance com useMemo
- [ ] 4.7 Adicionar indicadores de filtros ativos

**Dependências:** Fase 3
**Estimativa:** 6 horas

### Fase 5: Progresso e Status
- [ ] 5.1 Implementar cálculo de progresso automático
- [ ] 5.2 Implementar cálculo de status (Em dia/Atrasado/Crítico)
- [ ] 5.3 Adicionar cores por status (verde/amarelo/vermelho/cinza/azul)
- [ ] 5.4 Adicionar progress bar animada
- [ ] 5.5 Implementar atualização em tempo real
- [ ] 5.6 Adicionar tooltip com detalhes

**Dependências:** Fase 3
**Estimativa:** 5 horas

### Fase 6: Atalhos de Teclado
- [ ] 6.1 Criar hook `useKeyboardNavigation`
- [ ] 6.2 Implementar `→` expandir
- [ ] 6.3 Implementar `←` colapsar
- [ ] 6.4 Implementar `Espaço` selecionar
- [ ] 6.5 Implementar `F` abrir filtros
- [ ] 6.6 Implementar navegação por tab/arrow keys
- [ ] 6.7 Adicionar ajuda de atalhos (tecla `?`)

**Dependências:** Fase 3
**Estimativa:** 4 horas

### Fase 7: Responsividade
- [ ] 7.1 Implementar layout mobile (drill-down)
- [ ] 7.2 Implementar layout desktop (árvore completa)
- [ ] 7.3 Adicionar breakpoints e media queries
- [ ] 7.4 Testar em diferentes tamanhos de tela
- [ ] 7.5 Otimizar touch interactions

**Dependências:** Fase 3
**Estimativa:** 5 horas

### Fase 8: Performance
- [ ] 8.1 Implementar React.memo em MetaCard
- [ ] 8.2 Implementar virtualização para listas grandes
- [ ] 8.3 Otimizar re-renders com useCallback
- [ ] 8.4 Implementar code splitting (lazy load)
- [ ] 8.5 Adicionar skeleton loaders
- [ ] 8.6 Testar com 100+ metas

**Dependências:** Fase 3, 4
**Estimativa:** 6 horas

### Fase 9: Integração e Polish
- [ ] 9.1 Integrar com sistema de criação existente
- [ ] 9.2 Adicionar botões de ação (Editar, + Submeta)
- [ ] 9.3 Implementar navegação para detalhes
- [ ] 9.4 Adicionar animações de transição
- [ ] 9.5 Implementar estados vazios
- [ ] 9.6 Adicionar feedback visual (toast notifications)
- [ ] 9.7 Revisar acessibilidade (ARIA labels, keyboard nav)

**Dependências:** Fase 2-7
**Estimativa:** 6 horas

### Fase 10: Testes
- [ ] 10.1 Escrever unit tests para utils
- [ ] 10.2 Escrever integration tests para componentes
- [ ] 10.3 Escrever E2E tests principais
- [ ] 10.4 Testar casos de borda
- [ ] 10.5 Testar performance
- [ ] 10.6 Testar acessibilidade

**Dependências:** Todas as fases anteriores
**Estimativa:** 8 horas

---

## 9. Dependências entre Tasks

```
Fase 1 ───────────────────────────────────────┐
  │                                              │
  ├─► Fase 2 ──► Fase 3 ──┬─► Fase 4 ───────────┤
  │                        │                      │
  │                        ├─► Fase 5 ───────────┤
  │                        │                      │
  │                        ├─► Fase 6 ───────────┤
  │                        │                      │
  │                        ├─► Fase 7 ───────────┤
  │                        │                      │
  │                        └─► Fase 8 ───────────┤
  │                                               │
  └───────────────────────────────────────────────┴─► Fase 9 ──► Fase 10
```

**Caminho Crítico:** Fase 1 → 2 → 3 → 9 → 10
**Tempo Total Estimado:** 58 horas (~7 dias de trabalho)

---

## 10. Notas de Implementação

### Cores por Status (Tailwind)

```typescript
const statusColors = {
  ativa:      { bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500' },
  atrasada:   { bg: 'bg-amber-100',   text: 'text-amber-700',   bar: 'bg-amber-500' },
  critica:    { bg: 'bg-red-100',     text: 'text-red-700',     bar: 'bg-red-500' },
  concluida:  { bg: 'bg-slate-100',   text: 'text-slate-600',   bar: 'bg-slate-400' },
  backlog:    { bg: 'bg-blue-100',    text: 'text-blue-700',    bar: 'bg-blue-500' },
  foco:       { bg: 'bg-indigo-100',  text: 'text-indigo-700',  bar: 'bg-indigo-500' },
};
```

### Cores por Nível

```typescript
const levelColors = {
  grande:   { bg: 'bg-violet-100',  text: 'text-violet-700',  icon: Mountain },
  anual:    { bg: 'bg-blue-100',    text: 'text-blue-700',    icon: Calendar },
  mensal:   { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: CalendarDays },
  semanal:  { bg: 'bg-amber-100',   text: 'text-amber-700',   icon: CalendarCheck },
  diaria:   { bg: 'bg-rose-100',    text: 'text-rose-700',    icon: Sun },
};
```

### Animações

```typescript
// Expansão/colapso
const treeVariants = {
  hidden: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeInOut' }
  },
  visible: { 
    height: 'auto', 
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeInOut' }
  },
};

// Card hover
const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1.01, transition: { duration: 0.15 } },
};
```

---

## 11. Considerações de Segurança

1. **Validação de dados** - Sanitizar inputs de busca
2. **RLS no Supabase** - Garantir que usuário só veja suas próprias metas
3. **XSS prevention** - Escapar conteúdo dinâmico
4. **Rate limiting** - Considerar para busca em tempo real

---

## 12. Métricas de Sucesso

- [ ] Tempo de carregamento inicial < 2s
- [ ] Tempo de interação < 100ms após carregamento
- [ ] FPS mantido > 30 durante animações
- [ ] Lighthouse score > 90 (Performance, Acessibilidade)
- [ ] Test coverage > 80%

---

**Fim do Documento**

*Após aprovação, este SPEC será usado pelo @vibe-implementer para execução.*
