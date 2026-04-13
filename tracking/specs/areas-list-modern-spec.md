# 🎨 Especificação de Modernização - AreasListPage

## Visão Geral

Este documento detalha a especificação completa para modernização da tela `AreasListPage`, trazendo o mesmo padrão visual e de experiência aplicado nas páginas modernizadas de Metas e Agenda Semana.

**Data:** 13 de Abril de 2026  
**Versão:** 1.0  
**Arquivo-alvo:** `src/app/pages/areas/AreasListPage.tsx`  
**Arquivo de spec:** `tracking/specs/areas-list-modern-spec.md`

---

## 1. Sistema de Design

### 1.1 Paleta de Cores

| Propósito | Cor | Hex | Usage |
|----------|-----|-----|-------|
| Primária (Fallback) | Indigo | `#6366F1` | Headers, primary actions |
| Secundária | Violet | `#7C3AED` | Gradientes |
| ONE Thing | Amber | `#F59E0B` | Destaque ONE Thing |
| Sucesso | Emerald | `#10B981` | Metas concluídas |
| Background | Slate-50 | `#F8FAFC` | Page background |
| Card | White | `#FFFFFF` | Card backgrounds |
| Border | Slate-200 | `#E2E8F0` | Card borders |
| Text Primary | Slate-800 | `#1E293B` | Headings |
| Text Secondary | Slate-500 | `#64748B` | Body text |
| Text Muted | Slate-400 | `#94A3B8` | Captions |

### 1.2 Cores Dinâmicas por Área

Cada área possui sua própria cor (`area.cor`). O design deve usar essa cor dinamicamente:

- **Cards de Área:** A cor da área é usada para:
  - Background do ícone (20% opacity)
  - Borda esquerda ou elemento decorativo
  - Progress bar
  - Badge de progresso

- **Fallback:** Se `area.cor` não existir, usar Indigo `#6366F1`

### 1.3 Gradientes

```css
/* Header Principal */
background: linear-gradient(135deg, #6366F1 0%, #7C3AED 100%);

/* Stats Cards - Sucesso */
background: linear-gradient(135deg, #10B981 0%, #059669 100%);

/* Stats Cards - Destaque */
background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
```

### 1.4 Tipografia

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|---------|------|
| Page Title | Inter/System | 24px | 700 (Bold) |
| Section Title | Inter/System | 18px | 600 (Semibold) |
| Card Title | Inter/System | 16px | 600 (Semibold) |
| Body | Inter/System | 14px | 400 (Regular) |
| Caption | Inter/System | 12px | 400 (Regular) |
| Stat Value | Inter/System | 28px | 700 (Bold) |

### 1.5 Espaçamento (8pt Grid)

| Token | Valor | Uso |
|-------|-------|-----|
| xs | 4px | Tight spacing |
| sm | 8px | Component internal |
| md | 16px | Card padding |
| lg | 24px | Section spacing |
| xl | 32px | Page margins |
| 2xl | 48px | Hero sections |

### 1.6 Sombras

```css
/* Card padrão */
box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

/* Card hover */
box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);

/* Elevated */
box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### 1.7 Border Radius

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
src/app/components/areas/
├── AreaCardModern.tsx        # Card de área moderno com progresso
├── AreasOverview.tsx         # Overview bar com stats
├── AreaEmptyState.tsx        # Empty state específico
├── AreaStatsCards.tsx        # Cards de estatísticas
└── animations.ts             # Animações Framer Motion
```

### 2.2 Componentes a Reutilizar

| Componente | Origem | Usage |
|-----------|--------|-------|
| StatsCard | `metas/StatsCard.tsx` | Reutilizar para stats gerais |
| EmptyStateModern | `metas/EmptyStateModern.tsx` | Adaptar título/descrição |
| pageTransition | `metas/animations.ts` | Reutilizar |
| fadeInUp | `metas/animations.ts` | Reutilizar |
| staggerContainer | `metas/animations.ts` | Reutilizar |
| scaleIn | `metas/animations.ts` | Reutilizar |

---

## 3. Especificação de Componentes

### 3.1 AreaCardModern

**Props:**
```typescript
interface AreaCardModernProps {
  area: AreaUI;
  index: number;
  onNavigate: (areaId: string) => void;
}
```

**Visual:**
- Container com border-radius: 16px
- Borda esquerda 4px com cor da área
- Ícone em container quadrado com cor da área (20% opacity)
- Título, descrição e progresso
- Badge de quantidade de metas
- Hover: lift (y: -4px), shadow aumentada, scale(1.02)

**Estrutura:**
```
┌────────────────────────────────────────┐
│ ┌────┐                                 │
│ │ 🔵 │  Título da Área           5 metas →
│ └────┘  Descrição opcional...          │
├────────────────────────────────────────┤
│ Progresso              75%             │
│ ████████████░░░░░░░░░░░░░               │
└────────────────────────────────────────┘
```

** Estados:**
- Default: border-slate-200, bg-white
- Hover: border-slate-300, bg-white, shadow hover
- Loading: skeleton

**Animações:**
- Hover: scale(1.02), y(-4), shadow, 200ms ease-out
- Page entrance: staggered fadeInUp, 80ms delay per card

### 3.2 AreasOverview

**Props:**
```typescript
interface AreasOverviewProps {
  areas: AreaUI[];
  totalMetas: number;
  completedMetas: number;
}
```

**Visual:**
- Card elevado com border-radius: 16px
- Header com título "Progresso Geral"
- Barra de progresso múltipla (stack) com cores por área
- Legenda com ícones coloridos por área

**Estrutura:**
```
┌────────────────────────────────────────┐
│  Progresso Geral                       │
│  ████░░████████░░░░░░░░░░░░░░░░        │
│                                         │
│  🔵 Saúde  🔴 Carreira  🟢 Finanças    │
└────────────────────────────────────────┘
```

**Animações:**
- Progress bars: animate width on mount, 800ms ease-out

### 3.3 AreaStatsCards

**Props:**
```typescript
interface AreaStatsCardsProps {
  areas: AreaUI[];
}
```

**Visual:**
- Grid de 3 cards (desktop), stack (mobile)
- Cards elevados com ícones e gradientes
- Estatísticas:
  - Total de Áreas
  - Áreas com Progresso > 50%
  - Média de Progresso Geral

**Cards:**
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│     📊       │ │     🎯       │ │     ⭐       │
│      5       │ │      3       │ │     68%      │
│    Áreas     │ │  Ativas      │ │   Média      │
└──────────────┘ └──────────────┘ └──────────────┘
```

**Animações:**
- Entrance: staggered fadeInUp
- Hover: lift + shadow (igual a outros stats cards)

### 3.4 AreaEmptyState

**Props:**
```typescript
interface AreaEmptyStateProps {
  onCreateFirst: () => void;
}
```

**Visual:**
- Baseado em EmptyStateModern
- Ícone: Layers ou Grid
- Título: "Nenhuma área criada ainda"
- Descrição contextual
- Botão: "Criar Primeira Área"

---

## 4. Estrutura da Page Modernizada

### 4.1 Layout Geral

```tsx
<motion.div> // pageTransition
  <StickyHeader>
    <div className="flex items-center justify-between">
      <div>
        <h1>Áreas de Vida</h1>
        <p>Organize suas metas...</p>
      </div>
      <Button> + Nova Área </Button>
    </div>
  </StickyHeader>

  <main>
    <AreaStatsCards />
    
    <AreasOverview />
    
    <AreasGrid>
      {areas.map((area, i) => (
        <AreaCardModern key={area.id} index={i} />
      ))}
      <AddAreaCard />
    </AreasGrid>
  </main>
</motion.div>
```

### 4.2 Header Moderno

- Background gradient indigo → violet
- Sticky com backdrop-blur
- Título em branco
- Subtítulo em white/80
- Botão "Nova Área" com estilo elevado

### 4.3 Grid de Áreas

- Desktop: 3 colunas
- Tablet: 2 colunas
- Mobile: 1 coluna
- Gap: 16px

### 4.4 Card de Adicionar Área

- Mesmo tamanho que cards normais
- Border dashed
- Hover: border solid indigo, bg-indigo-50
- Clique → navegar para /areas/criar

---

## 5. Animações

### 5.1 Page Transition

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

### 5.2 Card Animations

```typescript
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

const cardHover = {
  rest: {
    y: 0,
    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  },
  hover: {
    y: -4,
    scale: 1.02,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
};
```

### 5.3 Micro-interactions

| Elemento | Animation | Duration | Ease |
|----------|-----------|----------|------|
| Card hover | scale(1.02) + y(-4) | 200ms | ease-out |
| Card click | scale(0.98) | 100ms | ease-in |
| Stats entrance | fadeInUp | 400ms | custom |
| Stagger | stagger | 80ms | - |
| Progress bar | width animate | 800ms | ease-out |

---

## 6. Responsividade

### 6.1 Breakpoints

| Breakpoint | Largura | Comportamento |
|------------|---------|---------------|
| Mobile | < 640px | Stack vertical, grid 1 coluna |
| Tablet | 640px - 1024px | Grid 2 colunas |
| Desktop | > 1024px | Grid 3 colunas, max-w |

### 6.2 Mobile (< 640px)

```
┌─────────────────────────┐
│ Header Sticky            │
│ (gradient + blur)        │
├─────────────────────────┤
│ Stats Cards              │
│ ┌───────┐ ┌───────┐     │
│ │Total  │ │Ativas │     │
│ │  5    │ │   3   │     │
│ └───────┘ └───────┘     │
├─────────────────────────┤
│ Overview Bar            │
│ ████████████░░░░         │
├─────────────────────────┤
│ Área Card                │
│ ┌───────────────────────┐│
│ │ [icon] Título     5 →  ││
│ │ Descrição...           ││
│ │ Progress: 75%          ││
│ └───────────────────────┘│
│                           │
│ + Adicionar nova área    │
└─────────────────────────┘
```

### 6.3 Desktop (> 1024px)

```
┌─────────────────────────────────────────────────────────────────┐
│ Header Sticky (gradient indigo → violet)                       │
│ ┌───────────────────────────────────────────────────────────────┐│
│ │ Áreas de Vida           [ + Nova Área ]                      ││
│ │ Organize suas metas...                                        ││
│ └───────────────────────────────────────────────────────────────┘│
├─────────────────────────────────────────────────────────────────┤
│ Stats Cards (3 columns)                                         │
│ ┌─────────┐ ┌─────────┐ ┌─────────┐                           │
│ │   📊    │ │   🎯    │ │   ⭐    │                           │
│ │    5    │ │    3    │ │   68%   │                           │
│ │  Áreas  │ │ Ativas  │ │  Média  │                           │
│ └─────────┘ └─────────┘ └─────────┘                           │
├─────────────────────────────────────────────────────────────────┤
│ Overview Bar                                                    │
│ ████████████░░░░░░░░░░░░░                                       │
├─────────────────────────────────────────────────────────────────┤
│ Grid (3 columns)                                                │
│ ┌───────────┐ ┌───────────┐ ┌───────────┐                     │
│ │  Saúde    │ │ Carreira  │ │Finanças   │                     │
│ │  🔵       │ │  🔴       │ │  🟢       │                     │
│ │           │ │           │ │           │                     │
│ │ 80%       │ │ 45%       │ │ 92%       │                     │
│ └───────────┘ └───────────┘ └───────────┘                     │
│                                                             │
│ + Adicionar nova área                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Estados e Edge Cases

### 7.1 Loading States

- Cards loading: skeleton animation
- Stats loading: placeholder cards
- Page transition: fadeInUp

### 7.2 Empty States

- **Zero áreas:** AreaEmptyState com ação para criar
- **Uma área:** Grid com 1 card + add card
- **Muitas áreas:** Grid completo, scroll se necessário

### 7.3 Error States

- Erro ao carregar áreas: mensagem + retry
- Área sem progresso: mostrar 0%

---

## 8. Gamificação

### 8.1 Elementos de Gamificação

| Elemento | Descrição | Visual |
|----------|-----------|--------|
| 🔥 Sequência | Áreas com progresso > 80% | Badge "Em alta" |
| 📊 Completion | % médio de progresso | Stats card |
| 🎯 Áreas Ativas | Áreas com metas ativas | Stats card |
| ⭐ Destaque | Área com maior progresso | Badge especial |

### 8.2 Visual Feedback

- Card com progresso 100%: borda verde, ícone de celebração
- Área com progresso > 80%: badge "Em alta"
- Hover em cards: micro-animação

---

## 9. Dados Necessários

### 9.1 Tipo AreaUI

```typescript
interface AreaUI {
  id: string;
  nome: string;
  icone: string;
  descricao: string;
  cor: string | null;
  progress: number;
  metasCount: number;
  metasConcluidas: number;
  createdAt: string;
}
```

### 9.2 Dados do Context

```typescript
const { areas } = useApp();
// areas deve ter:
// - area.cor (string | null)
// - area.progress (number)
// - area.metasCount (number)
```

---

## 10. Referências

- **Page atual:** `src/app/pages/areas/AreasListPage.tsx`
- **Referência 1:** `src/app/pages/metas/MetasAnuaisPage.tsx`
- **Referência 2:** `src/app/pages/agenda/AgendaSemanaPage.tsx` (spec)
- **StatsCards:** `src/app/components/metas/StatsCard.tsx`
- **EmptyState:** `src/app/components/metas/EmptyStateModern.tsx`
- **Animações:** `src/app/components/metas/animations.ts`

---

## 11. Resumo de Changes

| Antes | Depois |
|-------|--------|
| Header simples | Sticky + gradient + blur |
| Cards simples | Cards elevados com hover animation |
| Overview bar básica | Overview com stats cards acima |
| Empty state texto | AreaEmptyState (EmptyStateModern) |
| Sem animações | Framer Motion completo |
| Grid básico | Grid responsivo 1/2/3 colunas |
| Sem gamificação | Stats cards + badges |

---

## ✅ Checklist de Implementação

- [ ] Review completo desta especificação
- [ ] Criar diretório `src/app/components/areas/`
- [ ] Criar `AreaCardModern.tsx`
- [ ] Criar `AreasOverview.tsx`
- [ ] Criar `AreaStatsCards.tsx`
- [ ] Criar `AreaEmptyState.tsx`
- [ ] Adaptar ou reutilizar `animations.ts`
- [ ] Atualizar `AreasListPage.tsx`
- [ ] Testar responsividade (mobile/tablet/desktop)
- [ ] Validar cores dinâmicas por área
- [ ] Verificar animações Framer Motion

---

**Documento criado para o @vibe-implementer**  
**Próximo passo:** Implementação seguindo esta especificação