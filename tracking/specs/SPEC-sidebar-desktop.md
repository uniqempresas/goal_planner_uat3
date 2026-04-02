# SPEC - Sidebar Desktop

**Módulo:** Layout / Componente de Navegação  
**Arquivo:** `SPEC-sidebar-desktop.md`  
**Versão:** 1.0  
**Data:** 25/03/2026  
**Status:** Pronto para Implementação

---

## 1. Visão Geral do PRD

A **Sidebar Desktop** é o componente principal de navegação no desktop, posicionado fixamente na parte esquerda da tela. É exibida apenas em telas maiores que `lg` (1024px) e pode estar colapsada ou expandida.

### Objetivos

- Prover navegação rápida entre as principais áreas do aplicativo
- Permitir colapsar para maximizar espaço de conteúdo
- Manter estado persistido entre sessões
- Seguir identidade visual amber/neutral

---

## 2. Análise do Código Existente

### Arquivos Analisados

- `src/components/layout/Sidebar.tsx` - Componente atual
- `src/components/layout/MainLayout.tsx` - Layout que usa a sidebar
- `src/routes.tsx` - Rotas definidas

### Implementação Atual (v0.1)

- ✅ 8 itens de navegação (faltando Templates)
- ✅ Estado collapsed com toggle
- ✅ Largura: 256px (w-64) / 64px (w-16)
- ✅ Usa react-router-dom Link
- ✅ Persistência via useState (sem localStorage ainda)
- ❌ Larguras não correspondem ao PRD (260px/72px)
- ❌ Faltam ícones: BarChart3, CalendarDays, Award
- ❌ Faltando item "Templates"
- ❌ Sem logo "Goal Planner"
- ❌ Cores do item ativo não são amber

---

## 3. Especificação Técnica

### 3.1 Dimensões (do PRD)

| Propriedade        | Valor Expandido | Valor Colapsado |
| ------------------ | --------------- | --------------- |
| Largura            | 260px           | 72px            |
| Altura             | 100vh           | 100vh           |
| Padding vertical   | 16px            | 16px            |
| Padding horizontal | 12px            | 12px            |
| Item height        | 44px            | 44px            |
| Gap entre itens    | 4px             | 4px             |
| Logo height        | 40px            | 40px            |

### 3.2 Breakpoints

```css
/* desktop only */
@media (min-width: 1024px) {
  .sidebar {
    display: flex;
  }
}

/* hidden on smaller screens */
@media (max-width: 1023px) {
  .sidebar {
    display: none;
  }
}
```

### 3.3 Posicionamento

```css
position: fixed;
top: 0;
left: 0;
bottom: 0;
z-index: 30;
background: var(--color-surface);
border-right: 1px solid var(--color-border);
```

### 3.4 Itens de Navegação

| #   | ID            | Label         | Ícone (Lucide)    | Rota            |
| --- | ------------- | ------------- | ----------------- | --------------- |
| 1   | dashboard     | Dashboard     | `LayoutDashboard` | `/dashboard`    |
| 2   | areas         | Áreas de Vida | `Target`          | `/areas`        |
| 3   | metas         | Metas         | `Trophy`          | `/goals`        |
| 4   | agenda        | Agenda        | `Calendar`        | `/agenda`       |
| 5   | semanal       | Plano Semanal | `CalendarDays`    | `/weekly`       |
| 6   | revisoes      | Revisões      | `BarChart3`       | `/reviews`      |
| 7   | conquistas    | Conquistas    | `Award`           | `/achievements` |
| 8   | templates     | Templates     | `FileText`        | `/templates`    |
| 9   | configuracoes | Configurações | `Settings`        | `/settings`     |

**Nota:** As rotas devem corresponder às existentes em `routes.tsx`:

- Metas → `/goals`
- Plano Semanal → `/weekly`
- Revisões → `/reviews`
- Conquistas → `/achievements`
- Templates → `/templates` (nova rota a ser criada)

### 3.5 Estados Visuais

#### Sidebar

| Estado    | Largura | Labels visíveis | Ícones              |
| --------- | ------- | --------------- | ------------------- |
| Expandida | 260px   | Sim             | Sim                 |
| Colapsada | 72px    | Não             | Sim (centralizados) |

#### Item de Navegação

| Estado | Cor texto     | Cor background | Ícone         |
| ------ | ------------- | -------------- | ------------- |
| Normal | `neutral-600` | transparent    | `neutral-500` |
| Hover  | `neutral-900` | `neutral-100`  | `neutral-700` |
| Ativo  | `amber-600`   | `amber-50`     | `amber-500`   |
| Focus  | `amber-600`   | outline        | `amber-500`   |

---

## 4. Tarefas de Implementação

### Fase 1: Atualizar imports e dados

- [ ] **T1.1:** Adicionar novos ícones lucide-react:
  - `CalendarDays` (Piano Semanal)
  - `BarChart3` (Revisões)
  - `Award` (Conquistas)
  - `FileText` (Templates)

### Fase 2: Modificar componente Sidebar

- [ ] **T2.1:** Criar hook `useSidebarState` para persistência localStorage
  - Chave: `'sidebar-state'`
  - Valores: `'collapsed'` | `'expanded'`
  - Default: `'expanded'`

- [ ] **T2.2:** Atualizar array `navItems` com os 9 itens corretos
  - Usar rotas existentes do router
  - Adicionar Templates (sem rota ainda - usar href="#" temporário)

- [ ] **T2.3:** Implementar logo no topo
  - Expandido: "Goal Planner" em texto bold amber-500
  - Colapsado: "GP" em texto bold amber-500
  - Altura: 40px (h-10)
  - Border bottom: 1px border-border

- [ ] **T2.4:** Atualizar larguras
  - Expandida: `w-[260px]`
  - Colapsada: `w-[72px]`

- [ ] **T2.5:** Atualizar cores do item ativo
  - Background: `bg-amber-50`
  - Texto: `text-amber-600`
  - Ícone: `text-amber-500`

- [ ] **T2.6:** Atualizar botão de toggle
  - Expandido: "ChevronLeft" + "Colapsar"
  - Colapsado: "ChevronRight" (apenas ícone centralizado)

- [ ] **T2.7:** Implementar scroll interno
  - `overflow-y-auto` no nav
  - Customizar scrollbar se necessário

### Fase 3: Atualizar MainLayout

- [ ] **T3.1:** Ajustar margin do main content conforme estado
  - Expandido: `lg:ml-[260px]`
  - Colapsado: `lg:ml-[72px]`

- [ ] **T3.2:** Passar estado collapsed para Sidebar

### Fase 4: Acessibilidade

- [ ] **T4.1:** Adicionar atributos ARIA
  - `role="navigation"` na sidebar
  - `aria-label="Navegação principal"`
  - `aria-current="page"` no item ativo
  - `aria-expanded` no botão de toggle

- [ ] **T4.2:** Implementar keyboard navigation
  - Focus visible states
  - Tab navigation

---

## 5. Código de Referência

### 5.1 Hook useSidebarState

```typescript
// src/hooks/useSidebarState.ts
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'sidebar-state';

export function useSidebarState() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCollapsed(stored === 'collapsed');
    }
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const newValue = !prev;
      localStorage.setItem(STORAGE_KEY, newValue ? 'collapsed' : 'expanded');
      return newValue;
    });
  };

  return { collapsed, toggle };
}
```

### 5.2 Estrutura do Componente Atualizada

```tsx
// src/components/layout/Sidebar.tsx (versão atualizada)
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Trophy,
  Calendar,
  CalendarDays,
  BarChart3,
  Award,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useSidebarState } from '@/hooks/useSidebarState';

const navItems = [
  {
    id: 'dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  { id: 'areas', href: '/areas', icon: Target, label: 'Áreas de Vida' },
  { id: 'metas', href: '/goals', icon: Trophy, label: 'Metas' },
  { id: 'agenda', href: '/agenda', icon: Calendar, label: 'Agenda' },
  {
    id: 'semanal',
    href: '/weekly',
    icon: CalendarDays,
    label: 'Plano Semanal',
  },
  { id: 'revisoes', href: '/reviews', icon: BarChart3, label: 'Revisões' },
  { id: 'conquistas', href: '/achievements', icon: Award, label: 'Conquistas' },
  { id: 'templates', href: '/templates', icon: FileText, label: 'Templates' },
  {
    id: 'configuracoes',
    href: '/settings',
    icon: Settings,
    label: 'Configurações',
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ collapsed = false, onToggle }: SidebarProps) {
  const location = useLocation();

  const isActive = (href: string) => {
    return location.pathname === href;
  };

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 bottom-0 z-30',
        'bg-surface border-r border-border',
        'transition-all duration-300 ease-in-out',
        'flex flex-col',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
      role="navigation"
      aria-label="Navegação principal"
    >
      {/* Logo */}
      <div
        className={cn(
          'h-10 flex items-center justify-center border-b border-border',
          collapsed ? 'px-2' : 'px-3'
        )}
      >
        {collapsed ? (
          <span className="text-xl font-bold text-amber-500">GP</span>
        ) : (
          <span className="text-lg font-bold text-amber-500">Goal Planner</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                    'transition-colors duration-200',
                    'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
                    active
                      ? 'bg-amber-50 text-amber-600'
                      : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
                    collapsed ? 'justify-center' : ''
                  )}
                  title={collapsed ? item.label : undefined}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon
                    className={cn(
                      'w-5 h-5 flex-shrink-0',
                      active ? 'text-amber-500' : 'text-neutral-500'
                    )}
                  />
                  {!collapsed && (
                    <span
                      className={cn(
                        'text-sm font-medium',
                        active && 'font-semibold'
                      )}
                    >
                      {item.label}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Toggle Button */}
      <div className="p-3 border-t border-border">
        <button
          onClick={onToggle}
          className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900',
            'transition-colors duration-200',
            'w-full',
            collapsed ? 'justify-center' : ''
          )}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expandir sidebar' : 'Colapsar sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span className="text-sm">Colapsar</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
```

### 5.3 MainLayout Atualizado

```tsx
// src/components/layout/MainLayout.tsx (versão atualizada)
import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { Sidebar, MobileSidebar } from './Sidebar';
import MobileNav from './MobileNav';
import { useSidebarState } from '@/hooks/useSidebarState';

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { collapsed, toggle } = useSidebarState();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <Header onMenuClick={() => setMobileMenuOpen(true)} />

      <div className="flex">
        {/* Desktop Sidebar */}
        <div
          className={`hidden lg:block fixed top-0 left-0 bottom-0 z-30 transition-all duration-300 ${
            collapsed ? 'w-[72px]' : 'w-[260px]'
          }`}
        >
          <Sidebar collapsed={collapsed} onToggle={toggle} />
        </div>

        {/* Mobile Sidebar */}
        <MobileSidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* Main Content */}
        <main
          className={`flex-1 min-h-[calc(100vh-4rem)] pb-16 transition-all duration-300 ${
            collapsed ? 'lg:ml-[72px]' : 'lg:ml-[260px]'
          }`}
        >
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
```

---

## 6. Testes de Aceitação

| ID   | Caso de Teste            | Critério de Êxito                             |
| ---- | ------------------------ | --------------------------------------------- |
| TC01 | Tela desktop (>= 1024px) | Sidebar visível, ocupa 260px ou 72px          |
| TC02 | Tela mobile (< 1024px)   | Sidebar desktop ocultada, MobileNav visível   |
| TC03 | Clicar em toggle         | Sidebar colapsa/expande com animação de 300ms |
| TC04 | Estar em /goals          | Item "Metas" destacado com bg-amber-50        |
| TC05 | Refresh na página        | Estado de collapsed persiste após refresh     |
| TC06 | Hover em item            | Background muda para neutral-100              |
| TC07 | Sidebar colapsada        | Apenas ícones visíveis, centralizados         |
| TC08 | Logo colapsado           | Exibe "GP" centrado                           |
| TC09 | Logo expandido           | Exibe "Goal Planner"                          |
| TC10 | Navegação por teclado    | Tab navigation funciona, focus visível        |

---

## 7. Riscos e Mitigações

| Risco                                    | Mitigação                                                          |
| ---------------------------------------- | ------------------------------------------------------------------ |
| Conflito com MobileSidebar               | Manter componentes separados, desktop usa classe `hidden lg:block` |
| State não sincronizado entre componentes | Usar Context API ou prop drilling para estado compartilhado        |
| Scrollbar feio em alguns browsers        | Customizar scrollbar com CSS ou usar biblioteca                    |
| Rota /templates não existe               | Criar página placeholder ou redirecionar                           |

---

## 8. Dependências

- react-router-dom (já instalado)
- lucide-react (já instalado)
- clsx + tailwind-merge (já instalado via shadcn/ui)

---

## 9. Arquivos a Modificar

1. **`src/hooks/useSidebarState.ts`** - Novo arquivo (criar)
2. **`src/components/layout/Sidebar.tsx`** - Modificar
3. **`src/components/layout/MainLayout.tsx`** - Modificar

---

## 10. Histórico de Versões

| Versão | Data       | Alterações                              |
| ------ | ---------- | --------------------------------------- |
| 1.0    | 25/03/2026 | Versão inicial baseada no wireframe PRD |

---

**Fim do documento**
