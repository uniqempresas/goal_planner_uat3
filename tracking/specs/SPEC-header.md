# SPEC - Header do Goal Planner

**Data:** 25/03/2026  
**Versão:** 1.0  
**Módulo:** Layout / Navegação  
**Status:** Pronto para Implementação

---

## 1. Visão Geral

Este documento especifica a implementação técnica do componente **Header** para o Goal Planner, baseado no PRD `tracking/wireframes/PRD-header.md`.

### 1.1 Objetivos

- Implementar o header fixo com logo, busca, toggle de tema, notificações e avatar com dropdown
- Garantir responsividade (mobile < 768px, desktop ≥ 768px)
- Integrar com o hook `useAuth` existente para dados do usuário
- Suportar alternância de tema com persistência via localStorage

---

## 2. Estrutura de Arquivos

```
src/
├── components/
│   ├── layout/
│   │   └── Header.tsx          # Componente principal
│   ├── ui/                     # Componentes shadcn/ui
│   │   ├── avatar.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   └── button.tsx
│   └── icons/                  # Ícones customizados (se necessário)
│       └── SearchIcon.tsx
├── hooks/
│   ├── useAuth.tsx            # Já existe - usar para dados do usuário
│   └── useTheme.ts            # Hook customizado para tema
├── lib/
│   └── utils.ts               # Já existe - funções utilitárias
├── types/
│   └── index.ts               # Tipos compartilhados do projeto
└── App.tsx                    # Provider de tema
```

---

## 3. Interfaces TypeScript

### 3.1 Tipos Existentes (useAuth)

```typescript
// Já definidos em src/hooks/useAuth.tsx
interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  createdAt: string;
}
```

### 3.2 Novos Tipos a Criar

```typescript
// src/types/header.ts

export interface HeaderProps {
  /** Callback para abrir o menu mobile */
  onMenuClick?: () => void;
  /** Se o menu mobile está aberto */
  isMobileMenuOpen?: boolean;
}

export interface ThemeState {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

export interface NotificationBadge {
  count: number;
  hasUnread: boolean;
}

export interface SearchResult {
  id: string;
  type: 'goal' | 'area' | 'task';
  title: string;
  subtitle?: string;
}

export interface UserMenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'default' | 'destructive';
}
```

---

## 4. Componentes a Criar

### 4.1 Componente Principal: Header

| Item              | Descrição                                 | Prioridade  |
| ----------------- | ----------------------------------------- | ----------- |
| `Header.tsx`      | Componente principal do header            | Obrigatório |
| `useTheme.ts`     | Hook para gerenciar tema com localStorage | Obrigatório |
| `Header.test.tsx` | Testes unitários                          | Desejável   |

---

## 5. Implementação Técnica

### 5.1 Hook useTheme (NOVO)

Criar arquivo `src/hooks/useTheme.ts`:

```typescript
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

const THEME_KEY = 'goal_planner_theme';

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 1. Verificar localStorage
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }
    // 2. Verificar preferência do sistema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  // Aplicar classe dark no documento
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, setTheme: setThemeState, toggleTheme };
}
```

### 5.2 Componente Header (ATUALIZAR)

Atualizar `src/components/layout/Header.tsx` com as seguintes melhorias:

```tsx
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Menu,
  User,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Contagem de notificações (mock - substituir por hook real)
  const notificationCount = 3;

  // Atalho Cmd+K / Ctrl+K para busca
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  // Obter iniciais do nome para avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 md:px-6">
        {/* Mobile Menu Button - visível apenas em mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Logo */}
        <Link
          to="/dashboard"
          className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
            GP
          </span>
          <span className="hidden sm:inline">Goal Planner</span>
        </Link>

        {/* Search - Desktop only (≥768px) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="global-search"
              type="search"
              placeholder="Buscar metas, áreas, tarefas..."
              className={cn(
                'pl-9 bg-muted/50 hover:bg-muted transition-colors',
                isSearchFocused && 'ring-2 ring-primary border-primary'
              )}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1 md:gap-2 ml-auto">
          {/* Notificações */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link to="/notificacoes" aria-label="Notificações">
              <Bell className="h-5 w-5" />
              {notificationCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </Link>
          </Button>

          {/* Toggle Tema */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Modo escuro' : 'Modo claro'}
          >
            {theme === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {/* Avatar + Dropdown */}
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-9 w-9"
                  aria-label="Menu do usuário"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                  <Link to="/perfil" className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Perfil
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link to="/configuracoes" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Configurações
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive focus:text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
```

---

## 6. Configuração de Estilo (Tailwind CSS v4)

### 6.1 Classes Utilizadas

O header utiliza as seguintes classes Tailwind:

| Classe                           | Descrição                        | Breakpoint |
| -------------------------------- | -------------------------------- | ---------- |
| `sticky top-0 z-50`              | Fixo no topo                     | -          |
| `w-full border-b`                | Largura total com borda inferior | -          |
| `bg-background/95 backdrop-blur` | Fundo com transparência e blur   | -          |
| `h-16`                           | Altura de 64px (desktop)         | -          |
| `md:h-16`                        | Altura mantida em tablet+        | md         |
| `hidden md:flex`                 | Busca visível apenas em md+      | md         |
| `hidden sm:inline`               | "Goal Planner" visível em sm+    | sm         |
| `md:hidden`                      | Menu hamburger oculto em md+     | md         |

### 6.2 Tokens de Cores Usados

Baseado no `src/index.css`:

- `background` - Fundo do header
- `foreground` - Texto principal
- `primary` - Cor principal (roxo)
- `primary-foreground` - Texto sobre cor primária
- `muted` - Fundo secundário
- `muted-foreground` - Texto secundário
- `border` - Bordas
- `destructive` - Cor de erro/perigo (para logout)
- `accent` - Cor de destaque

---

## 7. Tarefas de Implementação

### Fase 1: Setup

| #   | Tarefa                                                                            | Prioridade  | Estimativa |
| --- | --------------------------------------------------------------------------------- | ----------- | ---------- |
| 1.1 | Criar hook `useTheme.ts`                                                          | Obrigatório | 15 min     |
| 1.2 | Verificar componentes shadcn/ui instalados (avatar, dropdown-menu, input, button) | Obrigatório | 5 min      |

### Fase 2: Implementação

| #   | Tarefa                                           | Prioridade  | Estimativa |
| --- | ------------------------------------------------ | ----------- | ---------- |
| 2.1 | Atualizar `Header.tsx` com código da seção 5.2   | Obrigatório | 30 min     |
| 2.2 | Integrar com `useAuth` para dados do usuário     | Obrigatório | 10 min     |
| 2.3 | Integrar com `useTheme` para alternância de tema | Obrigatório | 10 min     |
| 2.4 | Implementar atalho Cmd+K/Ctrl+K                  | Desejável   | 15 min     |
| 2.5 | Adicionar badge de notificações                  | Desejável   | 10 min     |

### Fase 3: Testes & Validação

| #   | Tarefa                                         | Prioridade  | Estimativa |
| --- | ---------------------------------------------- | ----------- | ---------- |
| 3.1 | Testar responsividade (< 768px vs ≥ 768px)     | Obrigatório | 10 min     |
| 3.2 | Testar alternância de tema e persistência      | Obrigatório | 10 min     |
| 3.3 | Testar dropdown do usuário (abrir/fechar)      | Obrigatório | 10 min     |
| 3.4 | Testar navegação (logo, perfil, configurações) | Obrigatório | 10 min     |
| 3.5 | Validar acessibilidade (Tab, ARIA)             | Desejável   | 15 min     |

---

## 8. Critérios de Aceite

### 8.1 Funcional

| ID   | Critério                                           | Validado |
| ---- | -------------------------------------------------- | -------- |
| CA01 | Header é exibido em todas as páginas autenticadas  | [ ]      |
| CA02 | Header permanece fixo ao rolar a página            | [ ]      |
| CA03 | Logo redireciona para /dashboard                   | [ ]      |
| CA04 | Tema alterna corretamente entre light e dark       | [ ]      |
| CA05 | Tema persiste após refresh da página               | [ ]      |
| CA06 | Busca é visível apenas em telas ≥ 768px            | [ ]      |
| CA07 | Atalho Cmd+K focaliza o campo de busca             | [ ]      |
| CA08 | Dropdown abre ao clicar no avatar                  | [ ]      |
| CA09 | Dropdown fecha ao clicar fora                      | [ ]      |
| CA10 | Nome e email do usuário são exibidos no dropdown   | [ ]      |
| CA11 | Link de configurações funciona                     | [ ]      |
| CA12 | Botão de sair faz logout e redireciona para /login | [ ]      |

### 8.2 Responsividade

| ID   | Critério                            | Validado |
| ---- | ----------------------------------- | -------- |
| CA13 | Layout correto em mobile (< 768px)  | [ ]      |
| CA14 | Layout correto em desktop (≥ 768px) | [ ]      |
| CA15 | Elementos não se sobrepõem          | [ ]      |

### 8.3 Acessibilidade

| ID   | Critério                            | Validado |
| ---- | ----------------------------------- | -------- |
| CA16 | Elementos são navegáveis via Tab    | [ ]      |
| CA17 | Focus visível em todos os elementos | [ ]      |
| CA18 | Labels ARIA presentes               | [ ]      |

---

## 9. Dependências

### 9.1 Já Instaladas

| Biblioteca               | Arquivo                             | Status |
| ------------------------ | ----------------------------------- | ------ |
| React 19                 | -                                   | ✅     |
| TypeScript               | -                                   | ✅     |
| Tailwind CSS v4          | src/index.css                       | ✅     |
| lucide-react             | -                                   | ✅     |
| shadcn/ui - Avatar       | src/components/ui/avatar.tsx        | ✅     |
| shadcn/ui - DropdownMenu | src/components/ui/dropdown-menu.tsx | ✅     |
| shadcn/ui - Input        | src/components/ui/input.tsx         | ✅     |
| shadcn/ui - Button       | src/components/ui/button.tsx        | ✅     |
| react-router-dom         | src/App.tsx                         | ✅     |
| useAuth (custom)         | src/hooks/useAuth.tsx               | ✅     |

### 9.2 A Criar

| Biblioteca        | Arquivo               | Status     |
| ----------------- | --------------------- | ---------- |
| useTheme (custom) | src/hooks/useTheme.ts | 🔄 A criar |

---

## 10. Notas de Implementação

1. **DropdownMenu do shadcn/ui**: O componente `DropdownMenu` já está instalado e deve ser usado em vez do dropdown manual implementado atualmente. Isso garante comportamento acessível (ARIA) e animações consistentes.

2. **Persistência de tema**: O hook `useTheme` deve salvar a preferência no `localStorage` com a chave `goal_planner_theme`.

3. **Notificações**: O badge de notificações está com valor mockado (3). Substituir por hook real quando o sistema de notificações for implementado.

4. **Busca**: A funcionalidade de busca é apenas visual (UI). A implementação do backend será feita em feature separada.

5. **Avatar fallback**: O componente usa `getInitials` para gerar as iniciais do nome do usuário quando não há avatar.

---

## 11. Histórico de Versões

| Versão | Data       | Descrição              |
| ------ | ---------- | ---------------------- |
| 1.0    | 25/03/2026 | Versão inicial da SPEC |

---

**Fim do documento**
