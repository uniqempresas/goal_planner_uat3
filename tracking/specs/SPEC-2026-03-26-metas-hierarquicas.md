# SPEC - Sprint 5: Metas Hierárquicas (Hierarchical Goals)

**Date**: 2026-03-26  
**Status**: Ready for Implementation  
**Input**: PRD-2026-03-26-metas-hierarquicas.md, Wireframes (modulo-04)

---

## 1. Overview

This sprint implements the core hierarchical goal structure based on "The One Thing" methodology: Grand (G) → Annual (A) → Monthly (M) → Weekly (S) → Daily (D). This includes full CRUD for the hierarchy, drill-down navigation, automatic progress calculation, and the "ONE Thing" priority system.

**Key Features:**

- Hierarchical Goal Structure (G→A→M→S→D)
- Drill-down Navigation & Breadcrumbs
- Automatic Progress Roll-up
- SMART Metrics & Milestones
- "ONE Thing" Selection

---

## 2. Tech Stack & Patterns

- **Framework**: React (Next.js App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context + Hooks (`useGoals`)
- **Data**: Mock Data (JSON/TS) for this sprint
- **Icons**: Lucide React

**Reusable Components to Leverage:**

- `GoalCard`: Display goal summary, progress, dates.
- `ProgressBar`: Visual progress indicator (0-100%).
- `Badge`: Status and priority indicators.
- `MetricTable`: For SMART metrics.
- `MilestoneList`: For intermediate goals.
- `FilterBar`: For search and filtering.

---

## 3. Data Model

### 3.1 Types (`src/types/index.ts`)

```typescript
export type GoalLevel = 'grand' | 'annual' | 'monthly' | 'weekly' | 'daily';

export type GoalStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export type Priority = 'low' | 'medium' | 'high';

export interface Metric {
  id: string;
  indicator: string;
  current: number;
  target: number;
  unit: string;
}

export interface Milestone {
  id: string;
  title: string;
  completedAt?: string;
  dueDate: string;
  status: GoalStatus;
}

export interface Goal {
  id: string;
  title: string;
  level: GoalLevel;
  parentId: string | null;
  areaId: string;

  // Content
  description?: string;
  focusingQuestion?: string;

  // SMART
  metrics?: Metric[];

  // Viability/Relevance (Specific to G/A in UI, but stored here for simplicity)
  viabilityScore?: number; // 1-10
  relevanceScore?: number; // 1-10

  // Dates
  startDate?: string;
  dueDate: string;
  completedAt?: string;

  // Status
  status: GoalStatus;
  priority: Priority;

  // Special
  isOneThing: boolean;
  progress: number; // 0-100 (Calculated)

  // Children count (Denormalized for performance/display)
  childrenCount?: number;
  completedChildrenCount?: number;

  // Milestones
  milestones?: Milestone[];

  createdAt: string;
  updatedAt: string;
}
```

---

## 4. API / Data Layer

### 4.1 Mock Data Strategy

Create `src/data/mockGoals.ts` with a complete hierarchy chain as defined in PRD.

**Chain:**

1.  **G**: "Tornar-se referência em React" (Carreira)
2.  **A**: "Dominar React 19 e Server Components"
3.  **M**: "Estudar Server Actions e Form Actions"
4.  **S**: "Criar projeto teste com Server Actions"
5.  **D**: Task 1 "Setup Vite project", Task 2 "Implement form"

### 4.2 Hooks (`useGoals`)

Create `src/hooks/useGoals.ts`:

- **`getGoals()`**: Returns all goals (flat list).
- **`getGoalById(id)`**: Returns specific goal.
- **`getGoalsByLevel(level)`**: Returns goals for a specific level (e.g., all Annuals).
- **`getChildGoals(parentId)`**: Returns direct children of a goal.
- **`getRootGoals(areaId?)`**: Returns top-level goals (Grand) optionally filtered by Area.
- **`calculateProgress(goalId)`**: Recursive function to calculate progress based on children.
- **`createGoal(goal)`**: Adds a new goal.
- **`updateGoal(id, updates)`**: Updates existing goal.
- **`deleteGoal(id)`**: Removes goal and handles orphans (optional: restrict deletion if has children).

---

## 5. Routing

| Route                           | Component                | Description                                 |
| :------------------------------ | :----------------------- | :------------------------------------------ |
| `/metas/grandes`                | `pages/GoalsGrandList`   | List all Grand Goals                        |
| `/metas/grandes/criar`          | `pages/GoalGrandCreate`  | Create Grand Goal                           |
| `/metas/grandes/:id`            | `pages/GoalGrandDetail`  | Detail view + Cascade to Annual             |
| `/metas/grandes/:id/editar`     | `pages/GoalGrandEdit`    | Edit Grand Goal                             |
| `/metas/anual`                  | `pages/GoalsAnnualList`  | List all Annual Goals (filterable by year)  |
| `/metas/anual/criar`            | `pages/GoalAnnualCreate` | Create Annual Goal (needs Parent selection) |
| `/metas/anual/:id`              | `pages/GoalAnnualDetail` | Detail view + Cascade to Monthly            |
| `/metas/mensal`                 | `pages/GoalsMonthlyList` | ...                                         |
| `/metas/semanal`                | `pages/GoalsWeeklyList`  | ...                                         |
| `/agenda` (or `/metas/diarias`) | `pages/Agenda`           | Daily tasks list                            |

**Note**: We can use a dynamic route like `/metas/[level]/:id` if the UI is generic enough, but specific routes allow better breadcrumbs and SEO (future proofing).

---

## 6. Component Breakdown

### 6.1 Pages

1.  **GoalsList (Grand/Annual/Monthly/Weekly/Daily)**
    - Reusable page wrapper (`GoalsPageLayout`).
    - Header with Stats (Total goals, In Progress, Completed).
    - Filter/Search bar.
    - Grid of `GoalCard`s.

2.  **GoalDetail (Generic or Specific)**
    - Breadcrumbs component (Crucial).
    - Hero section (Title, Dates, Description).
    - Stats Grid (Viability, Relevance, Progress).
    - Cascade Section (Children goals).
    - Milestones list.
    - Metrics table.

3.  **GoalForm (Create/Edit)**
    - Title Input.
    - Focusing Question Input.
    - Description Textarea.
    - Date Pickers (Start/Due).
    - Area Select.
    - Priority Select.
    - Viability/Relevance Sliders (1-10).
    - SMART Metrics Editor (Dynamic add/remove).
    - Milestones Editor (Dynamic add/remove).
    - ONE Thing Toggle.

### 6.2 Key Components to Build

- **`Breadcrumbs`**: Dynamic path generation based on goal hierarchy.
- **`GoalCard`**: Displays title, progress bar, dates, status badge.
- **`StatsCard`**: Small card for displaying Viability/Relevance/Progress.
- **`MetricEditor`**: Table-like input for SMART metrics.
- **`CascadeView`**: List of child goals (e.g., Annual goals inside Grand Goal detail).

---

## 7. Implementation Plan

### Phase 1: Foundation

1.  **Update Types**: Add `Goal`, `GoalLevel`, `Metric`, `Milestone` to `src/types`.
2.  **Create Mock Data**: Populate `src/data/mockGoals.ts` with the chain (G→A→M→S→D).
3.  **Implement `useGoals` Hook**: Logic for fetching, filtering, and calculating progress.

### Phase 2: Core UI (Grand Goals)

4.  **Create `GoalCard`** component.
5.  **Implement `/metas/grandes` (List View)**.
6.  **Implement `GoalForm`** (Reusable for Create/Edit).
7.  **Implement `/metas/grandes/criar`**.

### Phase 3: Details & Hierarchy

8.  **Implement `Breadcrumbs`**.
9.  **Implement `GoalDetail` View**: Show stats and "Metas Anuais Associadas".
10. **Implement `/metas/anual`**: List Annual Goals.
11. **Implement Drill-down**: Connect Grand -> Annual -> Monthly -> Weekly -> Daily.

### Phase 4: Logic & Polish

12. **Implement Progress Calculation**: Ensure completing a Daily Task updates Weekly progress.
13. **ONE Thing Logic**: Ensure only one active "One Thing" per parent.
14. **Refinement**: Apply Tailwind styling to match wireframes exactly.

---

## 8. Acceptance Criteria

- [ ] **Hierarchy**: Can view goals from Grand (G) down to Daily (D).
- [ ] **Breadcrumbs**: Navigation works back up the tree.
- [ ] **Creation**: Can create a Grand Goal and link it to an Area.
- [ ] **Creation**: Can create an Annual Goal and link it to a Grand Goal.
- [ ] **Progress**: Completing a Daily Task updates the progress bar of the parent Weekly, Monthly, and Annual goals.
- [ ] **Visual**: UI matches the wireframes (Cards, Progress Bars, Metrics).
- [ ] **ONE Thing**: Can mark a goal as "ONE Thing".
- [ ] **Empty States**: Appropriate messages when no goals exist.

---

## Appendix: Key Visual Details (from Wireframes)

- **Header**: "🎯 METAS GRANDES" (Large Title).
- **Card**: Title, Progress Bar (e.g., `███████░░░░ 35%`), Dates, Children Count.
- **One Thing Badge**: Visual indicator for the focused item.
- **Stats**: "Viabilidade (1-10)", "Relevância (1-10)" in Detail View.
