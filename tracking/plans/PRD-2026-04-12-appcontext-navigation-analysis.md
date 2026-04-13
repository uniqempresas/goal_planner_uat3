# Goal Planner Application Analysis

## Date
2026-04-12

## Git Commit
b76ff2a

## Branch
main

## Overview
This document provides a comprehensive analysis of the Goal Planner React application, focusing on the AppContext data management, navigation layout structure, and service architecture.

---

## 1. Navigation Menu Items

### Current Navigation Structure (from AppLayout.tsx)

The application uses a sidebar navigation with the following structure:

#### Main Navigation Groups (8 items):

1. **Dashboard**
   - Path: `/dashboard`
   - Icon: LayoutDashboard
   - No children

2. **Áreas de Vida**
   - Path: `/areas`
   - Icon: Layers
   - No children

3. **Metas** (Expandable)
   - Path: `/metas`
   - Icon: Target
   - **Children:**
     - Grandes (3 anos) → `/metas/grandes` (Mountain icon)
     - Anuais → `/metas/anual` (CalendarDays icon)
     - Mensais → `/metas/mensal` (CalendarCheck icon)
     - Semanais → `/metas/semanal` (CalendarRange icon)
     - Diárias → `/metas/diaria` (CheckSquare icon)

4. **Agenda** (Expandable)
   - Path: `/agenda`
   - Icon: Calendar
   - **Children:**
     - Hoje → `/agenda/hoje` (Sun icon)
     - Semana → `/agenda/semana` (CalendarRange icon)
     - Hábitos → `/habitos` (Star icon)

5. **Templates**
   - Path: `/templates`
   - Icon: BookOpen
   - No children

6. **Revisões** (Expandable)
   - Path: `/revisoes`
   - Icon: ClipboardCheck
   - **Children:**
     - Semanal → `/revisoes/semanal`
     - Mensal → `/revisoes/mensal`

7. **Conquistas**
   - Path: `/conquistas`
   - Icon: Trophy
   - No children

8. **Configurações**
   - Path: `/configuracoes`
   - Icon: Settings
   - No children

### Navigation Component Features:

- **Collapsible sidebar**: Can toggle between expanded (240px) and collapsed (64px) states
- **Active state highlighting**: Uses `NavLink` with `isActive` class to highlight current page
- **Expandable groups**: Groups with children can be expanded/collapsed
- **Mobile responsive**: Mobile sidebar overlay with full navigation
- **Icons**: Uses Lucide React icons throughout

---

## 2. Data Structure in AppContext

### State Management Overview

AppContext manages the global application state using React Context API with the following structure:

### Authentication State:
```typescript
isAuthenticated: boolean;
user: User | null;
loading: boolean;
```

### Areas State:
```typescript
areas: Area[];  // Array of areas (life domains)
// CRUD operations: loadAreas, createArea, updateArea, deleteArea
```

### Metas State (5-level hierarchy):
```typescript
grandesMetas: Meta[];   // 3-year goals
metasAnuais: Meta[];    // Annual goals
metasMensais: Meta[];   // Monthly goals
metasSemanais: Meta[];  // Weekly goals
metasDiarias: Meta[];   // Daily goals
```

### Tasks State:
```typescript
tarefasHoje: TarefaUI[];  // Today's tasks with UI mapping
// Operations: loadTarefas, toggleTarefa, createTarefa, updateTarefa, deleteTarefa
```

### Habits State:
```typescript
habitosHoje: Habito[];  // Today's active habits
// Operations: loadHabitos, toggleHabitoStreak
```

### Statistics State:
```typescript
weeklyStats: {
  tarefasTotal: number;
  tarefasConcluidas: number;
  metasConcluidas: number;
  sequenciaDias: number;  // Streak counter (mock)
  produtividade: number;  // Completion percentage
};
```

### UI State:
```typescript
sidebarOpen: boolean;
setSidebarOpen: (open: boolean) => void;
```

### Helper Functions:
```typescript
getMetaById: (id: string) => Meta | undefined;   // Find meta across all levels
getAreaById: (id: string) => Area | undefined;   // Find area by ID
```

### Type Definitions:

**Area (Database Schema):**
- `id`: string
- `user_id`: string
- `nome`: string (name)
- `icone`: string (emoji icon)
- `cor`: string (color)
- `descricao`: string | null (description)
- `created_at`: string

**Meta (Database Schema):**
- `id`: string
- `user_id`: string
- `titulo`: string (title)
- `descricao`: string | null
- `nivel`: 'grande' | 'anual' | 'mensal' | 'semanal' | 'diaria'
- `area_id`: string | null (parent area)
- `parent_id`: string | null (parent meta)
- `status`: 'ativa' | 'concluida'
- `one_thing`: boolean (priority flag)
- `progresso`: number (0-100)
- `data_inicio`: string | null
- `data_fim`: string | null
- `metricas`: JSON object
- `created_at`: string
- `updated_at`: string | null

---

## 3. How Metas Are Currently Loaded

### Service Layer: metasService.ts

The metas are loaded through a service layer that interacts with Supabase:

#### Key Methods:

**1. Load All Metas by Level (used in AppContext):**
```typescript
// In AppContext.tsx (lines 140-158)
const loadMetas = useCallback(async () => {
  if (!user) return;
  try {
    const [grandes, anual, mensal, semanal, diaria] = await Promise.all([
      metasService.getByNivel(user.id, 'grande'),
      metasService.getByNivel(user.id, 'anual'),
      metasService.getByNivel(user.id, 'mensal'),
      metasService.getByNivel(user.id, 'semanal'),
      metasService.getByNivel(user.id, 'diaria'),
    ]);
    setGrandesMetas(grandes);
    setMetasAnuais(anual);
    setMetasMensais(mensal);
    setMetasSemanais(semanal);
    setMetasDiarias(diaria);
  } catch (error) {
    console.error('Erro ao carregar metas:', error);
  }
}, [user]);
```

**2. Service Implementation (metasService.ts):**
```typescript
async getByNivel(userId: string, nivel: MetaNivel): Promise<Meta[]> {
  const { data, error } = await supabase
    .from('metas')
    .select('*')
    .eq('user_id', userId)
    .eq('nivel', nivel)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

### Loading Strategy:

1. **Parallel Loading**: All 5 meta levels are loaded simultaneously using `Promise.all()`
2. **User-scoped**: All queries filter by `user_id` for data isolation
3. **Ordered by Creation**: Results are sorted by `created_at` DESC (newest first)
4. **Auto-load on Auth**: Metas are automatically loaded when user authenticates (line 319-326 in AppContext)

### Additional Service Methods:

- `getAll(userId)` - Get all metas without level filter
- `getById(id)` - Get single meta by ID
- `getByParentId(parentId)` - Get child metas
- `create(userId, meta)` - Create new meta
- `update(id, meta)` - Update existing meta
- `delete(id)` - Delete meta
- `toggleStatus(id)` - Toggle between 'ativa'/'concluida'
- `toggleOneThing(id)` - Toggle priority flag
- `getMetaAncestors(metaId)` - Get ancestor hierarchy

### Areas Loading:

Similarly loaded via `areasService.getAll(user.id)`:
```typescript
async getAll(userId: string): Promise<Area[]> {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

---

## Summary

### Current Navigation Items: 8 main groups with 10+ sub-items
- Dashboard, Áreas de Vida, Metas (5 sub-items), Agenda (3 sub-items), Templates, Revisões (2 sub-items), Conquistas, Configurações

### AppContext Data Structure:
- User authentication state
- 5 arrays for hierarchical metas (grande → diária)
- Areas array for life domains
- Tasks array (mapped to UI format)
- Habits array
- Weekly statistics (calculated from tasks)
- Sidebar UI state

### Meta Loading Mechanism:
- Service layer pattern with Supabase integration
- Parallel loading of all 5 meta levels on user login
- User-scoped queries for security
- Sorted by creation date (newest first)
- Automatic loading triggered by authentication state change
