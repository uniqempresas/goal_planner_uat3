# SPEC - Sprint 4: Áreas de Vida

**Data de Criação:** 25/03/2026  
**Última Atualização:** 25/03/2026  
**Responsável:** Vibe Planner  
**Status:** Pronto para Implementação

---

## 1. Visão Geral

### 1.1 Objetivo

Implementar o módulo de Áreas de Vida com CRUD completo usando dados mockados. O módulo permite que usuários organizem suas metas em categorias específicas de vida, facilitando o acompanhamento e a priorização de objetivos em diferentes dimensões pessoais e profissionais.

### 1.2 Escopo

- [x] Criar mock data para Áreas de Vida
- [ ] Criar hook customizado useAreas (mock)
- [ ] Criar página de listagem de Áreas de Vida
- [ ] Criar componente de Card para cada Área
- [ ] Implementar modal de criação de nova Área
- [ ] Implementar modal de edição de Área
- [ ] Implementar exclusão de Área com confirmação
- [ ] Criar página de detalhes de uma Área
- [ ] Implementar ordenação de Áreas (drag & drop)
- [ ] Adicionar cor personalizada para cada Área
- [ ] Implementar seleção de ícones para Áreas
- [ ] Criar estado vazio (empty state)

### 1.3 Dependências

- Sprint 3 concluída
- React Router v7 configurado
- shadcn/ui instalado
- Tailwind CSS configurado

---

## 2. Estrutura de Arquivos

### 2.1 Arquivos a Criar

```
src/
├── data/
│   └── mockAreas.ts          # Dados mockados das áreas
├── types/
│   └── index.ts              # Tipos TypeScript (Area, Goal, etc.)
├── hooks/
│   └── useAreas.ts           # Hook customizado para gerenciamento
├── components/
│   └── areas/
│       ├── AreaCard.tsx      # Card de visualização da área
│       ├── AreaGrid.tsx      # Grid de áreas com drag & drop
│       ├── AreaForm.tsx     # Formulário de criação/edição
│       ├── ColorPicker.tsx  # Seletor de cor
│       ├── IconPicker.tsx   # Seletor de ícone
│       └── DeleteConfirmModal.tsx # Modal de confirmação
├── pages/
│   └── areas/
│       ├── AreasList.tsx    # Página de listagem (/areas)
│       ├── AreaDetail.tsx   # Página de detalhes (/areas/:id)
│       └── AreaFormPage.tsx # Página de form (/areas/new, /areas/:id/edit)
└── lib/
    └── constants.ts          # Cores predefined, ícones disponíveis
```

### 2.2 Arquivos a Modificar

```diff
src/routes.tsx                 # Adicionar rotas das áreas
src/App.tsx                   # Provavelmente nenhuma mudança necessária
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

## 4. Mock Data

### 4.1 Arquivo: `src/data/mockAreas.ts`

```typescript
import type { Area } from '@/types';

export const mockAreas: Area[] = [
  {
    id: '1',
    name: 'Carreira',
    description: 'Construir uma carreira sólida e satisfatória',
    color: '#3B82F6',
    icon: 'Briefcase',
    status: 'active',
    goals: [
      {
        id: 'g1',
        title: 'Tornar-se Engenheiro Senior',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-12-31',
        areaId: '1',
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-03-10T14:30:00Z',
      },
      {
        id: 'g2',
        title: 'Aprender nova tecnologia',
        status: 'completed',
        priority: 'medium',
        dueDate: '2026-06-30',
        completedAt: '2026-03-15T09:00:00Z',
        areaId: '1',
        createdAt: '2026-01-20T08:00:00Z',
        updatedAt: '2026-03-15T09:00:00Z',
      },
      {
        id: 'g3',
        title: 'Mentorar desenvolvedores júnior',
        status: 'pending',
        priority: 'high',
        dueDate: '2026-03-31',
        areaId: '1',
        createdAt: '2026-02-01T10:00:00Z',
        updatedAt: '2026-02-01T10:00:00Z',
      },
    ],
    createdAt: '2026-01-15T10:00:00Z',
    updatedAt: '2026-03-10T14:30:00Z',
    order: 0,
  },
  {
    id: '2',
    name: 'Saúde',
    description: 'Manter corpo e mente saudáveis',
    color: '#10B981',
    icon: 'Heart',
    status: 'active',
    goals: [
      {
        id: 'g4',
        title: 'Exercícios físicos 3x por semana',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-12-31',
        areaId: '2',
        createdAt: '2026-01-20T08:00:00Z',
        updatedAt: '2026-03-12T10:00:00Z',
      },
      {
        id: 'g5',
        title: 'Meditar diariamente',
        status: 'completed',
        priority: 'medium',
        dueDate: '2026-02-28',
        completedAt: '2026-02-28T07:00:00Z',
        areaId: '2',
        createdAt: '2026-01-20T08:00:00Z',
        updatedAt: '2026-02-28T07:00:00Z',
      },
      {
        id: 'g6',
        title: 'Consulta médica anual',
        status: 'pending',
        priority: 'low',
        dueDate: '2026-06-01',
        areaId: '2',
        createdAt: '2026-02-10T09:00:00Z',
        updatedAt: '2026-02-10T09:00:00Z',
      },
    ],
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-03-12T10:00:00Z',
    order: 1,
  },
  {
    id: '3',
    name: 'Finanças',
    description: 'Controle financeiro e investimentos',
    color: '#F59E0B',
    icon: 'Wallet',
    status: 'active',
    goals: [
      {
        id: 'g7',
        title: 'Criar reserva de emergência',
        status: 'in_progress',
        priority: 'high',
        dueDate: '2026-09-30',
        areaId: '3',
        createdAt: '2026-02-01T10:00:00Z',
        updatedAt: '2026-03-08T11:00:00Z',
      },
      {
        id: 'g8',
        title: 'Investir em renda fixa',
        status: 'pending',
        priority: 'medium',
        dueDate: '2026-12-31',
        areaId: '3',
        createdAt: '2026-02-05T14:00:00Z',
        updatedAt: '2026-02-05T14:00:00Z',
      },
    ],
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-03-08T11:00:00Z',
    order: 2,
  },
  {
    id: '4',
    name: 'Família',
    description: 'Tempo de qualidade com a família',
    color: '#EC4899',
    icon: 'Users',
    status: 'active',
    goals: [
      {
        id: 'g9',
        title: 'Viagem em família',
        status: 'pending',
        priority: 'medium',
        dueDate: '2026-07-15',
        areaId: '4',
        createdAt: '2026-02-10T09:00:00Z',
        updatedAt: '2026-02-10T09:00:00Z',
      },
      {
        id: 'g10',
        title: 'Jantar em família semanal',
        status: 'completed',
        priority: 'high',
        dueDate: '2026-01-31',
        completedAt: '2026-01-31T19:00:00Z',
        areaId: '4',
        createdAt: '2026-01-15T10:00:00Z',
        updatedAt: '2026-01-31T19:00:00Z',
      },
    ],
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-03-05T16:00:00Z',
    order: 3,
  },
  {
    id: '5',
    name: 'Estudos',
    description: 'Desenvolvimento intelectual contínuo',
    color: '#8B5CF6',
    icon: 'BookOpen',
    status: 'active',
    goals: [
      {
        id: 'g11',
        title: 'Ler 12 livros no ano',
        status: 'in_progress',
        priority: 'medium',
        dueDate: '2026-12-31',
        areaId: '5',
        createdAt: '2026-01-05T08:00:00Z',
        updatedAt: '2026-03-01T10:00:00Z',
      },
    ],
    createdAt: '2026-01-05T08:00:00Z',
    updatedAt: '2026-03-01T10:00:00Z',
    order: 4,
  },
  {
    id: '6',
    name: 'Lazer',
    description: 'Atividades de descanso e entretenimento',
    color: '#06B6D4',
    icon: 'Smile',
    status: 'inactive',
    goals: [],
    createdAt: '2026-02-15T10:00:00Z',
    updatedAt: '2026-02-20T14:00:00Z',
    order: 5,
  },
];
```

---

## 5. Constantes

### 5.1 Arquivo: `src/lib/constants.ts`

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
  // Trabalho
  { name: 'Briefcase', category: 'Trabalho' },
  { name: 'Laptop', category: 'Trabalho' },
  { name: 'Code', category: 'Trabalho' },
  { name: 'GraduationCap', category: 'Trabalho' },
  // Saúde
  { name: 'Heart', category: 'Saúde' },
  { name: 'Activity', category: 'Saúde' },
  { name: 'Apple', category: 'Saúde' },
  { name: 'Dumbbell', category: 'Saúde' },
  // Finanças
  { name: 'Wallet', category: 'Finanças' },
  { name: 'DollarSign', category: 'Finanças' },
  { name: 'PieChart', category: 'Finanças' },
  { name: 'TrendingUp', category: 'Finanças' },
  // Família
  { name: 'Users', category: 'Família' },
  { name: 'Home', category: 'Família' },
  { name: 'Baby', category: 'Família' },
  { name: 'Heart', category: 'Família' },
  // Pessoal
  { name: 'Star', category: 'Pessoal' },
  { name: 'Smile', category: 'Pessoal' },
  { name: 'Coffee', category: 'Pessoal' },
  { name: 'BookOpen', category: 'Pessoal' },
  // Outros
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

## 6. Hook Customizado

### 6.1 Arquivo: `src/hooks/useAreas.ts`

```typescript
import { useState, useCallback, useMemo } from 'react';
import { mockAreas } from '@/data/mockAreas';
import type {
  Area,
  CreateAreaInput,
  UpdateAreaInput,
  AreaFilter,
  AreaStats,
} from '@/types';
import { useToast } from '@/components/ui/use-toast'; // Assumindo que existe

export function useAreas() {
  const [areas, setAreas] = useState<Area[]>(mockAreas);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get area by ID
  const getAreaById = useCallback(
    (id: string) => {
      return areas.find((area) => area.id === id);
    },
    [areas]
  );

  // Calculate stats for an area
  const calculateStats = useCallback(
    (areaId: string): AreaStats => {
      const area = areas.find((a) => a.id === areaId);
      if (!area) {
        return {
          totalGoals: 0,
          completedGoals: 0,
          inProgressGoals: 0,
          overdueGoals: 0,
          progress: 0,
        };
      }

      const totalGoals = area.goals.length;
      const completedGoals = area.goals.filter(
        (g) => g.status === 'completed'
      ).length;
      const inProgressGoals = area.goals.filter(
        (g) => g.status === 'in_progress'
      ).length;
      const overdueGoals = area.goals.filter((g) => {
        if (g.status === 'completed') return false;
        if (!g.dueDate) return false;
        return new Date(g.dueDate) < new Date();
      }).length;

      const progress =
        totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

      return {
        totalGoals,
        completedGoals,
        inProgressGoals,
        overdueGoals,
        progress,
      };
    },
    [areas]
  );

  // Create new area
  const createArea = useCallback(
    async (data: CreateAreaInput): Promise<Area> => {
      setIsLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        const newArea: Area = {
          ...data,
          id: crypto.randomUUID(),
          goals: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          order: areas.length,
        };

        setAreas((prev) => [...prev, newArea]);
        return newArea;
      } catch (err) {
        setError('Erro ao criar área');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [areas.length]
  );

  // Update existing area
  const updateArea = useCallback(
    async (id: string, data: UpdateAreaInput): Promise<void> => {
      setIsLoading(true);
      setError(null);

      try {
        await new Promise((resolve) => setTimeout(resolve, 500));

        setAreas((prev) =>
          prev.map((area) =>
            area.id === id
              ? { ...area, ...data, updatedAt: new Date().toISOString() }
              : area
          )
        );
      } catch (err) {
        setError('Erro ao atualizar área');
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Delete area
  const deleteArea = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setAreas((prev) => prev.filter((area) => area.id !== id));
    } catch (err) {
      setError('Erro ao excluir área');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Reorder areas (for drag & drop)
  const reorderAreas = useCallback((newOrder: string[]): void => {
    setAreas((prev) => {
      const areaMap = new Map(prev.map((area) => [area.id, area]));
      return newOrder.map((id, index) => ({
        ...areaMap.get(id)!,
        order: index,
      }));
    });
  }, []);

  // Filter areas
  const filterAreas = useCallback(
    (filter: AreaFilter): Area[] => {
      if (filter === 'all') return areas;
      return areas.filter((area) => area.status === filter);
    },
    [areas]
  );

  // Search areas by name
  const searchAreas = useCallback(
    (query: string): Area[] => {
      if (!query.trim()) return areas;
      const lowerQuery = query.toLowerCase();
      return areas.filter((area) =>
        area.name.toLowerCase().includes(lowerQuery)
      );
    },
    [areas]
  );

  // Filtered and searched areas (combined)
  const getFilteredAreas = useCallback(
    (filter: AreaFilter, searchQuery: string): Area[] => {
      let result = areas;

      if (filter !== 'all') {
        result = result.filter((area) => area.status === filter);
      }

      if (searchQuery.trim()) {
        const lowerQuery = searchQuery.toLowerCase();
        result = result.filter((area) =>
          area.name.toLowerCase().includes(lowerQuery)
        );
      }

      return result.sort((a, b) => a.order - b.order);
    },
    [areas]
  );

  return {
    areas,
    isLoading,
    error,
    getAreaById,
    calculateStats,
    createArea,
    updateArea,
    deleteArea,
    reorderAreas,
    filterAreas,
    searchAreas,
    getFilteredAreas,
  };
}
```

---

## 7. Componentes

### 7.1 ColorPicker

**Arquivo:** `src/components/areas/ColorPicker.tsx`

```typescript
import { Check } from 'lucide-react';
import { AREA_COLORS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  customColor?: string;
  onCustomColorChange?: (color: string) => void;
}

export function ColorPicker({
  value,
  onChange,
  customColor,
  onCustomColorChange,
}: ColorPickerProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Cor de Identificação</label>
      <div className="flex flex-wrap gap-2">
        {AREA_COLORS.map((color) => (
          <button
            key={color.value}
            type="button"
            onClick={() => onChange(color.value)}
            className={cn(
              'w-8 h-8 rounded-full border-2 transition-all',
              'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2',
              value === color.value
                ? 'border-foreground ring-2 ring-primary'
                : 'border-transparent'
            )}
            style={{ backgroundColor: color.value }}
            title={color.name}
          >
            {value === color.value && (
              <Check className="w-4 h-4 text-white mx-auto" />
            )}
          </button>
        ))}
      </div>

      {/* Custom color input */}
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={customColor || value}
          onChange={(e) => onCustomColorChange?.(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border-0"
        />
        <span className="text-sm text-muted-foreground">Cor customizada</span>
      </div>
    </div>
  );
}
```

### 7.2 IconPicker

**Arquivo:** `src/components/areas/IconPicker.tsx`

```typescript
import * as LucideIcons from 'lucide-react';
import { AREA_ICONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  // Get unique icon names
  const iconNames = [...new Set(AREA_ICONS.map((i) => i.name))];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Ícone (opcional)</label>
      <div className="grid grid-cols-8 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
        {iconNames.map((iconName) => {
          const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];

          if (!IconComponent) return null;

          return (
            <button
              key={iconName}
              type="button"
              onClick={() => onChange(iconName)}
              className={cn(
                'p-2 rounded-lg transition-all hover:bg-muted',
                value === iconName && 'bg-primary text-primary-foreground'
              )}
              title={iconName}
            >
              <IconComponent className="w-5 h-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
```

### 7.3 AreaCard

**Arquivo:** `src/components/areas/AreaCard.tsx`

```typescript
import { useNavigate } from 'react-router-dom';
import { Pencil, Trash2, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as LucideIcons from 'lucide-react';
import type { Area, AreaStats } from '@/types';

interface AreaCardProps {
  area: Area;
  stats: AreaStats;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export function AreaCard({ area, stats, onEdit, onDelete }: AreaCardProps) {
  const navigate = useNavigate();
  const IconComponent = area.icon
    ? (LucideIcons[area.icon as keyof typeof LucideIcons] as React.ElementType)
    : LucideIcons.Flag;

  return (
    <Card
      className="group cursor-pointer transition-all hover:shadow-md hover:border-primary/50"
      onClick={() => navigate(`/areas/${area.id}`)}
    >
      {/* Colored left border */}
      <div
        className="h-1 rounded-t-lg"
        style={{ backgroundColor: area.color }}
      />

      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: `${area.color}20` }}
          >
            <IconComponent
              className="w-5 h-5"
              style={{ color: area.color }}
            />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{area.name}</h3>
            {area.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                {area.description}
              </p>
            )}
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onEdit(area.id);
              }}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(area.id);
              }}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
          <span>{stats.totalGoals} meta{stats.totalGoals !== 1 ? 's' : ''}</span>
          <span>{stats.completedGoals} concluída{stats.completedGoals !== 1 ? 's' : ''}</span>
        </div>
        <Progress value={stats.progress} className="h-2" />
      </CardContent>

      <CardFooter className="pt-0 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {stats.progress}% completo
        </span>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            area.status === 'active'
              ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
          }`}
        >
          {area.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </CardFooter>
    </Card>
  );
}
```

### 7.4 DeleteConfirmModal

**Arquivo:** `src/components/areas/DeleteConfirmModal.tsx`

```typescript
import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  affectedItems?: number;
  onConfirm: () => void;
  isLoading?: boolean;
}

export function DeleteConfirmModal({
  open,
  onOpenChange,
  itemName,
  affectedItems = 0,
  onConfirm,
  isLoading = false,
}: DeleteConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900">
              <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <DialogTitle>Confirmar Exclusão</DialogTitle>
            </div>
          </div>
          <DialogDescription className="mt-2">
            Tem certeza que deseja excluir "{itemName}"?
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Esta ação não pode ser desfeita.
            {affectedItems > 0 && (
              <>
                {' '}
                As {affectedItems} meta{affectedItems !== 1 ? 's' : ''} associada
                {affectedItems !== 1 ? 's' : ''} não será{affectedItems !== 1 ? 'ão' : ''} excluída
                {affectedItems !== 1 ? 's' : ''}.
              </>
            )}
          </p>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirm}
            disabled={isLoading}
          >
            {isLoading ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### 7.5 AreaForm

**Arquivo:** `src/components/areas/AreaForm.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ColorPicker } from './ColorPicker';
import { IconPicker } from './IconPicker';
import { AREA_VALIDATION } from '@/lib/constants';
import type { Area, CreateAreaInput } from '@/types';

const areaFormSchema = z.object({
  name: z
    .string()
    .min(AREA_VALIDATION.name.minLength, `Nome deve ter pelo menos ${AREA_VALIDATION.name.minLength} caracteres`)
    .max(AREA_VALIDATION.name.maxLength, `Nome deve ter no máximo ${AREA_VALIDATION.name.maxLength} caracteres`),
  description: z
    .string()
    .max(AREA_VALIDATION.description.maxLength, `Descrição deve ter no máximo ${AREA_VALIDATION.description.maxLength} caracteres`)
    .optional(),
  color: z.string().min(1, 'Selecione uma cor'),
  icon: z.string().optional(),
  status: z.enum(['active', 'inactive']),
});

type AreaFormData = z.infer<typeof areaFormSchema>;

interface AreaFormProps {
  area?: Area;
  onSubmit: (data: CreateAreaInput) => Promise<void>;
  isLoading?: boolean;
}

export function AreaForm({ area, onSubmit, isLoading = false }: AreaFormProps) {
  const navigate = useNavigate();
  const [customColor, setCustomColor] = useState<string>(area?.color || '#3B82F6');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AreaFormData>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: {
      name: area?.name || '',
      description: area?.description || '',
      color: area?.color || '#3B82F6',
      icon: area?.icon || '',
      status: area?.status || 'active',
    },
  });

  const selectedColor = watch('color');

  const handleColorChange = (color: string) => {
    setValue('color', color, { shouldValidate: true });
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setValue('color', color, { shouldValidate: true });
  };

  const handleIconChange = (icon: string) => {
    setValue('icon', icon);
  };

  const handleFormSubmit = async (data: AreaFormData) => {
    await onSubmit({
      name: data.name,
      description: data.description,
      color: data.color,
      icon: data.icon,
      status: data.status,
      order: area?.order || 0,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>
            {area ? 'Editar Área de Vida' : 'Nova Área de Vida'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Ex: Carreira, Saúde, Família"
              error={errors.name?.message}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descreva o objetivo desta área de vida..."
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {AREA_VALIDATION.description.maxLength} caracteres máximo
            </p>
          </div>

          {/* Cor */}
          <ColorPicker
            value={selectedColor}
            onChange={handleColorChange}
            customColor={customColor}
            onCustomColorChange={handleCustomColorChange}
          />
          {errors.color && (
            <p className="text-sm text-destructive">{errors.color.message}</p>
          )}

          {/* Ícone */}
          <IconPicker
            value={watch('icon')}
            onChange={handleIconChange}
          />

          {/* Status */}
          <div className="flex items-center justify-between">
            <Label htmlFor="status">Status</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Inativo</span>
              <Switch
                id="status"
                checked={watch('status') === 'active'}
                onCheckedChange={(checked) =>
                  setValue('status', checked ? 'active' : 'inactive')
                }
              />
              <span className="text-sm text-muted-foreground">Ativo</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ações do formulário */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate(-1)}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvando...' : area ? 'Salvar Alterações' : 'Criar Área'}
        </Button>
      </div>
    </form>
  );
}
```

---

## 8. Páginas

### 8.1 AreasList (Listagem)

**Arquivo:** `src/pages/areas/AreasList.tsx`

```typescript
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAreas } from '@/hooks/useAreas';
import { AreaCard } from '@/components/areas/AreaCard';
import { EmptyState } from '@/components/states/EmptyState';
import { DeleteConfirmModal } from '@/components/areas/DeleteConfirmModal';
import { Skeleton } from '@/components/ui/skeleton';
import type { AreaFilter } from '@/types';

export default function AreasList() {
  const navigate = useNavigate();
  const { areas, isLoading, calculateStats, deleteArea, getFilteredAreas } = useAreas();
  const [filter, setFilter] = useState<AreaFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState<{ id: string; name: string; goalsCount: number } | null>(null);

  // Filtered areas
  const filteredAreas = useMemo(
    () => getFilteredAreas(filter, searchQuery),
    [getFilteredAreas, filter, searchQuery]
  );

  // Handle delete
  const handleDeleteClick = (id: string) => {
    const area = areas.find((a) => a.id === id);
    if (area) {
      setAreaToDelete({
        id: area.id,
        name: area.name,
        goalsCount: area.goals.length,
      });
      setDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (areaToDelete) {
      try {
        await deleteArea(areaToDelete.id);
        setDeleteModalOpen(false);
        setAreaToDelete(null);
      } catch (error) {
        console.error('Error deleting area:', error);
      }
    }
  };

  // Handle edit
  const handleEdit = (id: string) => {
    navigate(`/areas/${id}/edit`);
  };

  return (
    <div className="container mx-auto max-w-6xl py-6 px-4">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Áreas de Vida</h1>
        <p className="text-muted-foreground mt-1">
          Gerencie as categorias da sua vida
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar áreas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as AreaFilter)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="active">Ativas</SelectItem>
            <SelectItem value="inactive">Inativas</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => navigate('/areas/new')}>
          <Plus className="w-4 h-4 mr-2" />
          Nova Área
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAreas.length === 0 && (
        <EmptyState
          title="Nenhuma área cadastrada"
          message="Comece criando sua primeira área de vida para organizar suas metas"
          actionLabel="Criar Primeira Área"
          onAction={() => navigate('/areas/new')}
        />
      )}

      {/* Areas Grid */}
      {!isLoading && filteredAreas.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAreas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              stats={calculateStats(area.id)}
              onEdit={handleEdit}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        itemName={areaToDelete?.name || ''}
        affectedItems={areaToDelete?.goalsCount}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
```

### 8.2 AreaDetail (Detalhes)

**Arquivo:** `src/pages/areas/AreaDetail.tsx`

```typescript
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useAreas } from '@/hooks/useAreas';
import { EmptyState } from '@/components/states/EmptyState';
import { DeleteConfirmModal } from '@/components/areas/DeleteConfirmModal';
import { Skeleton } from '@/components/ui/skeleton';
import * as LucideIcons from 'lucide-react';
import { useState } from 'react';

export default function AreaDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAreaById, calculateStats, isLoading, deleteArea } = useAreas();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const area = id ? getAreaById(id) : undefined;
  const stats = id ? calculateStats(id) : undefined;

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl py-6 px-4 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!area) {
    return (
      <div className="container mx-auto max-w-4xl py-6 px-4">
        <EmptyState
          title="Área não encontrada"
          message="A área que você está procurando não existe ou foi removida."
          actionLabel="Voltar para Áreas"
          onAction={() => navigate('/areas')}
        />
      </div>
    );
  }

  const IconComponent = area.icon
    ? (LucideIcons[area.icon as keyof typeof LucideIcons] as React.ElementType)
    : LucideIcons.Flag;

  const handleDelete = async () => {
    try {
      await deleteArea(area.id);
      navigate('/areas');
    } catch (error) {
      console.error('Error deleting area:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary',
    };
    return <Badge variant={variants[priority] || 'secondary'}>{priority}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'outline' | 'secondary' | 'default'> = {
      pending: 'outline',
      in_progress: 'default',
      completed: 'secondary',
      overdue: 'destructive',
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  return (
    <div className="container mx-auto max-w-4xl py-6 px-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/areas">Áreas de Vida</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{area.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/areas')}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${area.color}20` }}
            >
              <IconComponent
                className="w-6 h-6"
                style={{ color: area.color }}
              />
            </div>
            <div>
              <h1
                className="text-2xl font-bold"
                style={{ color: area.color }}
              >
                {area.name}
              </h1>
              {area.description && (
                <p className="text-muted-foreground mt-1">{area.description}</p>
              )}
              <p className="text-sm text-muted-foreground mt-2">
                Criada em: {formatDate(area.createdAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/areas/${area.id}/edit`)}>
            <Pencil className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={() => setDeleteModalOpen(true)}>
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold">{stats?.totalGoals}</p>
              <p className="text-sm text-muted-foreground">Total de Metas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{stats?.completedGoals}</p>
              <p className="text-sm text-muted-foreground">Concluídas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{stats?.inProgressGoals}</p>
              <p className="text-sm text-muted-foreground">Em Andamento</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-red-600">{stats?.overdueGoals}</p>
              <p className="text-sm text-muted-foreground">Atrasadas</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progresso Geral</span>
              <span className="font-medium">{stats?.progress}%</span>
            </div>
            <Progress value={stats?.progress || 0} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Goals Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Metas</h2>
          <Button size="sm" onClick={() => navigate('/goals/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Meta
          </Button>
        </div>

        {area.goals.length === 0 ? (
          <Card>
            <CardContent className="py-8">
              <EmptyState
                title="Nenhuma meta nesta área"
                message="Crie sua primeira meta para esta área de vida"
                actionLabel="Criar Meta"
                onAction={() => navigate('/goals/new')}
              />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Status</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Prazo</TableHead>
                  <TableHead>Prioridade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {area.goals.map((goal) => (
                  <TableRow key={goal.id} className="cursor-pointer">
                    <TableCell>
                      <Checkbox checked={goal.status === 'completed'} />
                    </TableCell>
                    <TableCell className="font-medium">{goal.title}</TableCell>
                    <TableCell>
                      {goal.dueDate
                        ? formatDate(goal.dueDate)
                        : '-'}
                    </TableCell>
                    <TableCell>{getPriorityBadge(goal.priority)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}
      </div>

      {/* Delete Modal */}
      <DeleteConfirmModal
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        itemName={area.name}
        affectedItems={area.goals.length}
        onConfirm={handleDelete}
      />
    </div>
  );
}
```

### 8.3 AreaFormPage (Criação/Edição)

**Arquivo:** `src/pages/areas/AreaFormPage.tsx\*\*

```typescript
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAreas } from '@/hooks/useAreas';
import { AreaForm } from '@/components/areas/AreaForm';
import { Skeleton } from '@/components/ui/skeleton';
import type { CreateAreaInput } from '@/types';

export default function AreaFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAreaById, createArea, updateArea, isLoading } = useAreas();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditing = Boolean(id);
  const area = id ? getAreaById(id) : undefined;

  // Redirect if editing and area not found
  useEffect(() => {
    if (isEditing && !area && !isLoading) {
      navigate('/areas');
    }
  }, [isEditing, area, isLoading, navigate]);

  const handleSubmit = async (data: CreateAreaInput) => {
    setIsSubmitting(true);
    try {
      if (isEditing && id) {
        await updateArea(id, data);
        navigate(`/areas/${id}`);
      } else {
        const newArea = await createArea(data);
        navigate(`/areas/${newArea.id}`);
      }
    } catch (error) {
      console.error('Error saving area:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-2xl py-6 px-4 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl py-6 px-4">
      <AreaForm
        area={area}
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
}
```

---

## 9. Rotas

### 9.1 Atualização do arquivo: `src/routes.tsx`

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import PrivateRoute from '@/components/PrivateRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import RecoverPassword from '@/pages/RecoverPassword';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import NotFound from '@/components/error/NotFound';

// Páginas de Áreas
import AreasList from '@/pages/areas/AreasList';
import AreaDetail from '@/pages/areas/AreaDetail';
import AreaFormPage from '@/pages/areas/AreaFormPage';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '/recover-password',
    element: <RecoverPassword />,
  },
  {
    path: '/',
    element: (
      <PrivateRoute>
        <MainLayout />
      </PrivateRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
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
      {
        path: 'goals',
        element: (
          <div className="p-6">
            <h1>Metas</h1>
            <p>Em desenvolvimento...</p>
          </div>
        ),
      },
      {
        path: 'agenda',
        element: (
          <div className="p-6">
            <h1>Agenda</h1>
            <p>Em desenvolvimento...</p>
          </div>
        ),
      },
      {
        path: 'weekly',
        element: (
          <div className="p-6">
            <h1>Planejamento Semanal</h1>
            <p>Em desenvolvimento...</p>
          </div>
        ),
      },
      {
        path: 'reviews',
        element: (
          <div className="p-6">
            <h1>Revisões</h1>
            <p>Em desenvolvimento...</p>
          </div>
        ),
      },
      {
        path: 'achievements',
        element: (
          <div className="p-6">
            <h1>Conquistas</h1>
            <p>Em desenvolvimento...</p>
          </div>
        ),
      },
      {
        path: 'templates',
        element: (
          <div className="p-6">
            <h1>Templates</h1>
            <p>Em desenvolvimento...</p>
          </div>
        ),
      },
      {
        path: 'settings',
        element: (
          <div className="p-6">
            <h1>Configurações</h1>
            <p>Em desenvolvimento...</p>
          </div>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);
```

---

## 10. Componentes UI shadcn/ui Necessários

### 10.1 Componentes a Verificar/Instala

Asegurar que os seguintes componentes shadcn/ui estão instalados:

```bash
npx shadcn@latest add checkbox
npx shadcn@latest add switch
npx shadcn@latest add select
npx shadcn@latest add table
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add breadcrumb
npx shadcn@latest add separator
npx shadcn@latest add progress
npx shadcn@latest add textarea
npx shadcn@latest add label
```

---

## 11. Validações e Edge Cases

### 11.1 Validações do Formulário

| Campo     | Regra                 | Mensagem de Erro                              |
| --------- | --------------------- | --------------------------------------------- |
| Nome      | Obrigatório           | "Nome é obrigatório"                          |
| Nome      | Mínimo 2 caracteres   | "Nome deve ter pelo menos 2 caracteres"       |
| Nome      | Máximo 100 caracteres | "Nome deve ter no máximo 100 caracteres"      |
| Descrição | Opcional              | -                                             |
| Descrição | Máximo 500 caracteres | "Descrição deve ter no máximo 500 caracteres" |
| Cor       | Obrigatória           | "Selecione uma cor"                           |
| Status    | Padrão: active        | -                                             |

### 11.2 Edge Cases

1. **Nome duplicado:** Ao criar/editar área, verificar se já existe área com o mesmo nome
2. **Exclusão com metas:** Ao excluir área, informar usuário que metas não serão excluídas
3. **Ordenação:** Manter ordem mesmo após refresh (armazenar em localStorage)
4. **Empty state:** Exibir corretamente quando não há áreas
5. **Loading state:** Exibir skeletons durante carregamento
6. **Erro de API:** Exibir mensagem de erro amigável com opção de retry

---

## 12. Testes

### 12.1 Testes Unitários (Vitest/Jest)

1. **useAreas hook**
   - Testar criação de área
   - Testar atualização de área
   - Testar exclusão de área
   - Testar cálculo de stats
   - Testar filtragem
   - Testar busca

2. **AreaCard**
   - Testar renderização com dados corretos
   - Testar clique no card
   - Testar ações de editar/excluir

3. **AreaForm**
   - Testar validação de nome obrigatório
   - Testar validação de comprimento
   - Testar seleção de cor
   - Testar seleção de ícone
   - Testar toggle de status

### 12.2 Testes de Integração

1. **Fluxo de criação**
   - Usuário clica em "Nova Área"
   - Preenche formulário
   - Clica em "Criar"
   - Redirecionado para detalhes da área

2. **Fluxo de edição**
   - Usuário acessa área
   - Clica em "Editar"
   - Modifica dados
   - Clica em "Salvar"
   - Redirecionado para detalhes

3. **Fluxo de exclusão**
   - Usuário clica em excluir
   - Modal de confirmação abre
   - Usuário confirma
   - Área removida da lista

### 12.3 Testes E2E (Playwright)

1. Navegar para /areas
2. Verificar se lista de áreas é exibida
3. Criar nova área
4. Editar área existente
5. Excluir área
6. Verificar estados vazio/erro

---

## 13. Checklist de Implementação

### 13.1 Setup Inicial

- [ ] Criar arquivo de tipos `src/types/index.ts`
- [ ] Criar arquivo de constantes `src/lib/constants.ts`
- [ ] Criar mock data `src/data/mockAreas.ts`
- [ ] Criar hook `src/hooks/useAreas.ts`

### 13.2 Componentes Base

- [ ] Criar `ColorPicker.tsx`
- [ ] Criar `IconPicker.tsx`
- [ ] Criar `DeleteConfirmModal.tsx`
- [ ] Criar `AreaCard.tsx`
- [ ] Criar `AreaForm.tsx`

### 13.3 Páginas

- [ ] Criar pasta `src/pages/areas/`
- [ ] Criar `AreasList.tsx`
- [ ] Criar `AreaDetail.tsx`
- [ ] Criar `AreaFormPage.tsx`

### 13.4 Configuração

- [ ] Atualizar `routes.tsx` com novas rotas
- [ ] Adicionar componentes shadcn necessários
- [ ] Testar navegação

### 13.5 Validação e Testes

- [ ] Testar validações de formulário
- [ ] Testar fluxos de CRUD
- [ ] Testar estados vazio/erro/loading

---

## 14. Notas Adicionais

### 14.1 Pré-requisitos

Antes de implementar esta sprint, verificar se os seguintes componentes shadcn/ui estão instalados:

- Button, Card, Input, Label
- Dialog, DropdownMenu
- Select, Checkbox, Switch
- Progress, Badge, Separator
- Table, Tabs, Breadcrumb

### 14.2 Dependências Opcionais

Para implementação futura (não incluída nesta sprint):

- **Drag & Drop:** `@dnd-kit/core`, `@dnd-kit/sortable`
- **Toast Notifications:** Already installed (sonner)
- **Date Handling:** Already available (native Date API)

### 14.3 Styled Components vs Tailwind

O projeto usa **Tailwind CSS** para estilização. Todos os componentes seguem esse padrão.

---

## 15. Critérios de Aceite

- [ ] Usuário consegue criar uma nova Área
- [ ] Usuário consegue editar uma Área existente
- [ ] Usuário consegue excluir uma Área
- [ ] Áreas aparecem em ordem de prioridade
- [ ] Cada Área tem cor e ícone distintos
- [ ] Interface responsiva e fluida
- [ ] Validações funcionam corretamente
- [ ] Estados de loading/empty/error exibidos adequadamente
- [ ] Navegação entre páginas funciona corretamente

---

**Fim do Documento**
