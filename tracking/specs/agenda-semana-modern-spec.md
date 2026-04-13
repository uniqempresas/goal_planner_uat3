# 🎨 Especificação de Modernização - AgendaSemanaPage

## Visão Geral

Este documento detalha a especificação completa para modernização da tela `AgendaSemanaPage`, trazendo o mesmo padrão visual e de experiência aplicado nas páginas modernizadas de Metas (MetasListPageModern, MetasAnuaisPage).

**Data:** 13 de Abril de 2026  
**Versão:** 1.0  
**Arquivo-alvo:** `src/app/pages/agenda/AgendaSemanaPage.tsx`

---

## 1. Sistema de Design

### 1.1 Paleta de Cores

| Propósito | Cor | Hex | Usage |
|----------|-----|-----|-------|
| Primária | Indigo | `#6366F1` | Headers, primary actions |
| Secundária | Violet | `#7C3AED` | Gradientes |
| ONE Thing | Amber | `#F59E0B` | Destaque ONE Thing |
| Sucesso | Emerald | `#10B981` | Tarefas concluídas |
| Background | Slate-50 | `#F8FAFC` | Page background |
| Card | White | `#FFFFFF` | Card backgrounds |
| Border | Slate-200 | `#E2E8F0` | Card borders |
| Text Primary | Slate-800 | `#1E293B` | Headings |
| Text Secondary | Slate-500 | `#64748B` | Body text |
| Text Muted | Slate-400 | `#94A3B8` | Captions |

### 1.2 Gradientes

```css
/* Header Principal */
background: linear-gradient(135deg, #6366F1 0%, #7C3AED 100%);

/* Stats Cards - Sucesso */
background: linear-gradient(135deg, #10B981 0%, #059669 100%);

/* Stats Cards - ONE Thing */
background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
```

### 1.3 Tipografia

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|--------|---------|------|
| Page Title | Inter/System | 24px | 700 (Bold) |
| Section Title | Inter/System | 18px | 600 (Semibold) |
| Card Title | Inter/System | 16px | 600 (Semibold) |
| Body | Inter/System | 14px | 400 (Regular) |
| Caption | Inter/System | 12px | 400 (Regular) |
| Stat Value | Inter/System | 28px | 700 (Bold) |

### 1.4 Espaçamento (8pt Grid)

| Token | Valor | Uso |
|-------|-------|-----|
| xs | 4px | Tight spacing |
| sm | 8px | Component internal |
| md | 16px | Card padding |
| lg | 24px | Section spacing |
| xl | 32px | Page margins |
| 2xl | 48px | Hero sections |

### 1.5 Sombras

```css
/* Card padrão */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Card hover */
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Elevated */
box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### 1.6 Border Radius

| Elemento | Radius |
|----------|--------|
| Buttons | 12px |
| Cards | 16px |
| Inputs | 8px |
| Badges | Full (circle) |

---

## 2. Mapa de Componentes

### 2.1 Componentes a Criar

```
src/app/components/agenda/
├── WeekDayCard.tsx          # Card de dia com progresso circular
├── TaskItemModern.tsx       # Item de tarefa moderno
├── WeekStatsCard.tsx       # Card de stat da semana
├── CircularProgress.tsx      # Componente de progresso SVG
├── EmptyStateAgenda.tsx      # Empty state específico
└── animations.ts           # Animações Framer Motion
```

### 2.2 Componentes a Reutilizar

| Componente | Origem | Usage |
|-----------|--------|-------|
| StatsCard | `metas/StatsCard.tsx` | Reutilizar com adaptações |
| EmptyStateModern | `metas/EmptyStateModern.tsx` | Adaptar título/descrição |
| pageTransition | `metas/animations.ts` | Reutilizar |
| fadeInUp | `metas/animations.ts` | Reutilizar |
| staggerContainer | `metas/animations.ts` | Reutilizar |
| scaleIn | `metas/animations.ts` | Reutilizar |

---

## 3. Especificação de Componentes

### 3.1 WeekDayCard

**Props:**
```typescript
interface WeekDayCardProps {
  dayName: string;           // "Dom", "Seg", etc.
  dayNumber: number;         // 1-31
  date: Date;              // Data completa
  isSelected: boolean;     // Dia selecionado
  isToday: boolean;       // É hoje
  completedTasks: number;  // Tarefas concluídas
  totalTasks: number;    // Total de tarefas
  hasOneThing: boolean;   // Tem ONE Thing
  onClick: () => void;   // Callback de clique
}
```

**Visual:**
- Container com border-radius: 16px
- Borde colorido quando selecionado (indigo-500)
- Progress circle SVG para taxa de conclusão
- Badge "hoje" (pequeno círculo indigo)
- Ícone de estrela para ONE Thing
- Hover: escala 1.02, sombra aumentada

**Estados:**
- Default: border-slate-200, bg-white
- Selected: border-indigo-500, bg-indigo-50
- Today: badge de destaque
- Hover: escala 1.02, shadow aumentada

**Animações:**
- Hover: scale(1.02), 200ms ease-out
- Click: scale(0.98), 100ms
- Selecionado: border color transition 200ms

### 3.2 CircularProgress

**Props:**
```typescript
interface CircularProgressProps {
  progress: number;       // 0-100
  size?: number;          // Tamanho em px (default: 40)
  strokeWidth?: number;   // Espessura (default: 4)
  color?: string;          // Cor do progresso (default: indigo-500)
  bgColor?: string;        // Cor do fundo (default: slate-200)
  showLabel?: boolean;    // Mostrar percentual
}
```

**Visual:**
- SVG circle com stroke-dasharray
- Fundo em cinza claro
- Progresso em cor primária
- Texto central opcional

**Animações:**
- Progress animation: 800ms ease-out

### 3.3 TaskItemModern

**Props:**
```typescript
interface TaskItemModernProps {
  task: TarefaUI;
  onToggle: (taskId: string) => Promise<void>;
  isToggling: boolean;
  onNavigate: (taskId: string) => void;
}
```

**Visual:**
- Checkbox animado (circle → checkcircle)
- Título com line-through quando concluído
- Badge de bloco (ONE Thing, Manhã, Tarde, Noite)
- Ícone de horário opcional
- Hover: bg-slate-50

**Estados:**
- Default: circle outline em slate-300
- Completed: checkcircle filled em emerald-500
- Loading: spinner animation

**ONE Thing Visual:**
- Border esquerdo 3px em amber-500
- Ícone de estrela amber
- Background sutil amber-50

**Animações:**
- Checkbox: scale + color transition
- Completed: strike-through animation
- Hover: background transition

### 3.4 WeekStatsCard

**Props:**
```typescript
interface WeekStatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: string;
  bgColor: string;
  delay?: number;
}
```

**Visual:**
- Mesmo padrão de StatsCard das Metas
- Ícone em container quadrado
- Valor grande em bold
- Label em texto secundário
- Hover: lift + shadow

### 3.5 EmptyStateAgenda

**Props:**
```typescript
interface EmptyStateAgendaProps {
  date: Date;
  dayName: string;
  onCreateTask: () => void;
}
```

**Visual:**
- Baseado em EmptyStateModern das Metas
- Ícone: Calendar ou Clipboard
- Mensagem contextual baseada na data
- Botão: "Adicionar tarefa"

---

## 4. Animações

### 4.1 Page Transition

```typescript
const pageTransition: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
      staggerChildren: 0.08,
    },
  },
};
```

### 4.2 Card Hover

```typescript
const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  },
  hover: {
    y: -4,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};
```

### 4.3 Micro-interactions

| Elemento | Animation | Duration | Ease |
|----------|-----------|----------|------|
| WeekDayCard hover | scale(1.02) | 200ms | ease-out |
| WeekDayCard tap | scale(0.98) | 100ms | ease-in |
| Task checkbox | scale + color | 200ms | ease-out |
| Stats card hover | y(-4) | 200ms | ease-out |
| Page load | fadeInUp | 400ms | custom |
| Stagger children | stagger | 80ms | - |

---

## 5. Layout Responsivo

### 5.1 Breakpoints

| Breakpoint | Largura | Comportamento |
|------------|---------|---------------|
| Mobile | < 640px | Stack vertical, grids 1 кол |
| Tablet | 640px - 1024px | Grid 7 days, 2-column stats |
| Desktop | > 1024px | Full layout, max-w |

### 5.2 Mobile (< 640px)

```
┌─────────────────────────┐
│ Sticky Header           │
│ (gradient + blur)       │
├─────────────────────────┤
│ Navigation Buttons      │
│ (< / Esta semana / >)  │
├─────────────────────────┤
│ Week Grid (scrollable)  │
│ ┌────┬────┬────┬─────┐ │
│ │Dom │Seg │Ter │ ... │ │
│ └────┴────┴────┴─────┘ │
├─────────────────────────┤
│ Day Detail Card         │
│ ┌─────────────────────┐ │
│ │ Date + Stats        │ │
│ ├─────────────────────┤ │
│ │ Tasks List         │ │
│ │ - Task 1 ✓         │ │
│ │ - Task 2           │ │
│ │ - Task 3           │ │
│ └─────────────────────┘ │
├─────────────────────────┤
│ Stats Cards            │
│ (stack / grid)         │
└─────────────────────────┘
```

### 5.3 Desktop (> 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│ Sticky Header (gradient indigo/violet)                         │
│ ┌──────────────────────────────────────────────────────────────┐│
│ │ ← Agenda Semanal │ 12 — 18 de abr de 2026 │ [Esta semana] → ││
│ └──────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Week Navigator (7 columns)                                      │
│ ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐             │
│ │ Dom  │ Seg  │ Ter  │ Qua  │ Qui  │ Sex  │ Sáb  │             │
│ │ [○]  │ [○]  │ [●]  │ [○]  │ [○]  │ [○]  │ [○]  │             │
│ │ 2/5  │ 1/3  │ 3/4  │ 0/2  │ 0/0  │ 0/0  │ 0/0  │             │
│ └──────┴──────┴──────┴──────┴──────┴──────┴──────┘             │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────┐ ┌─────────────────┐ │
│ │ Day Detail Card                        │ │ Week Stats      │ │
│ │ ┌───────────────────────────────────┐ │ │ ┌───────────┐  │ │
│ │ │ Terça, 14 de Abril │ 3/4 concluídas │ │ │ │Concluídas │  │ │
│ │ └───────────────────────────────────┘ │ │ │    12    │  │ │
│ │ BLOCKS:                              │ │ │───────────│  │ │
│ │ ⭐ ONE Thing: [ Task ]               │ │ │ONE Things │  │ │
│ │ ☀️ Manhã: [ Task ] [ Task ]          │ │ │    5     │  │ │
│ │ 🌆 Tarde: [ Task ]                   │ │ │───────────│  │ │
│ │ 🌙 Noite: [ Task ]                   │ │ │ Taxa      │  │ │
│ │                                      │ │ │   78%    │  │ │
│ │ [+ Adicionar nova tarefa]             │ │ └───────────┘  │ │
│ └─────────────────────────────────────────┘ └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## 6. Estrutura da Page Modernizada

### 6.1 Estrutura de Componentes

```tsx
// AppShell com providers
<motion.div> // pageTransition
  <StickyHeader> // gradient + blur
    <Logo /> 
    <NavButtons />
  </StickyHeader>
  
  <main>
    <WeekNavigator>
      {weekDays.map((day, i) => (
        <WeekDayCard key={i} />
      ))}
    </WeekNavigator>
    
    <DayDetailView>
      <DayHeader />
      <TaskBlocks>
        <OneThingBlock />
        <ManhaBlock />
        <TardeBlock />
        <NoiteBlock />
      </TaskBlocks>
      <CreateTaskButton />
    </DayDetailView>
    
    <WeekStats>
      <StatsCard />
      <StatsCard />
      <StatsCard />
    </WeekStats>
  </main>
  
  <FAB mobile /> // floating action button
</motion.div>
```

### 6.2 Blocos de Tarefas

A view de dia deve ser organizada por blocos de tempo:

1. **ONE Thing** (bloco oneThing)
   - Badge amber
   - Destacado visualmente
   
2. **Manhã** (bloco manha)
   - Badge morning
   
3. **Tarde** (bloco tarde)
   - Badge afternoon
   
4. **Noite** (bloco noite)
   - Badge night

### 6.3 Comportamento de Navegação

- **Semana:** setCurrentWeekStart
- **Dia:** setSelectedDay (0-6)
- **Navegação rápida:** botões anterior/próxima semana
- **Hoje:** botão "Esta semana" retorna à semana atual

---

## 7. Estados e Edge Cases

### 7.1 Loading States

- Week tasks loading: skeleton cards
- Task toggle loading: spinner no checkbox
- Page transition: fadeInUp

### 7.2 Empty States

- **Semana vazia:** Nenhuma tarefa em nenhum dia
  - EmptyState com "Comece planejando sua semana"
  - Ação para criar semana vazia
- **Dia específico vazio:** Nenhuma tarefa naquele dia
  - EmptyStateAgenda contextual
  - Ação para criar tarefa

### 7.3 Error States

- Erro ao carregar tarefas: mostrar erro + retry
- Erro ao toggle: toast de erro

---

## 8. Gamificação

### 8.1 elementos de Gamificação

| Elemento | Origem | Descrição |
|----------|-------|----------|
| 🔥 Sequência | weeklyStats | Dias consecutivos |
| ⭐ ONE Things | task.isOneThing |ONE Things definidas |
| % Produtividade | calculated | Taxa de conclusão |
| XP (opcional) | calculated | Pontos por conclusão |

### 8.2 Visual Feedback

- **Tarefa concluída:** Checkbox verde + strike-through
- **Dia completo:** Progress circle 100%
- **Semana completa:** Celebração visual

---

## 9. Acessibilidade

### 9.1 Requisitos

- [ ] Labels em todos os botões
- [ ] ARIA para progress circles
- [ ] Keyboard navigation (← →)
- [ ] Focus states visíveis
- [ ] Screen reader announcements
- [ ] Cores não como único indicador

### 9.2 Keyboard Navigation

| Key | Action |
|-----|-------|
| Arrow Left | Dia anterior |
| Arrow Right | Próximo dia |
| Enter | Selecionar dia |
| Space | Toggle tarefa |

---

## 10. Implementação Gradual

### Fase 1: Fundamentos (prioridade alta)
- [ ] Sistema de design tokens
- [ ] Header moderno (sticky + gradient)
- [ ] WeekDayCard com progress
- [ ] Reutilizar animations

### Fase 2: Componentes (prioridade média)
- [ ] TaskItemModern
- [ ] Day organization by blocks
- [ ] WeekStats cards
- [ ] Empty state

### Fase 3: Polish (prioridade baixa)
- [ ] Micro-interactions
- [ ] Gamification
- [ ] Responsive tweaks
- [ ] Edge case handling

---

## 11. Referências

- **Page atual:** `src/app/pages/agenda/AgendaSemanaPage.tsx`
- **Referência modernização:** `src/app/pages/metas/MetasListPageModern.tsx`
- **MetasAnuais:** `src/app/pages/metas/MetasAnuaisPage.tsx`
- **StatsCards:** `src/app/components/metas/StatsCard.tsx`
- **EmptyState:** `src/app/components/metas/EmptyStateModern.tsx`
- **Animações:** `src/app/components/metas/animations.ts`

---

## 12. Resumo de Changes

| Antes | Depois |
|-------|--------|
| Header simples | Sticky + gradient + blur |
| Week grid básico | WeekDayCard com progress circle |
| Lista simples | TaskItems organizados por bloco |
| Stats números | StatsCards com ícones |
| Sem animações | Framer Motion completo |
| Empty state texto | EmptyStateModern |
| Responsivo limitado | Mobile-first robusto |

---

## ✅ Checklist de Implementação

- [ ] Review completo desta especificação
- [ ] Criar diretório `src/app/components/agenda/`
- [ ] Criar `CircularProgress.tsx`
- [ ] Criar `WeekDayCard.tsx`
- [ ] Criar `TaskItemModern.tsx`
- [ ] Criar `WeekStatsCard.tsx` (ou reutilizar)
- [ ] Criar `EmptyStateAgenda.tsx` (ou adaptar)
- [ ] Adaptar `animations.ts` ou reutilizar
- [ ] Atualizar `AgendaSemanaPage.tsx`
- [ ] Testar responsividade
- [ ] Validar acessibilidade

---

**Documento criado para o @vibe-implementer**  
**Próximo passo:** Implementação seguindo esta especificação