# SPEC: Sistema de Loading/Skeleton

**Date:** 2026-03-25  
**Status:** Ready for Implementation  
**Based on PRD:** PRD-loading-skeleton.md

---

## 1. Visão Geral da Implementação

Este documento detalha a especificação técnica para implementação do Sistema de Loading e Skeleton no Goal Planner. O sistema fornece feedback visual durante o carregamento de dados, utilizando placeholders animados que mimetizam a estrutura final da interface.

**Stack Tecnológico:**

- React 19 + TypeScript
- Tailwind CSS v4
- tw-animate-css (já configurado no projeto)
- lucide-react para ícones

---

## 2. Estrutura de Arquivos

```
src/
├── components/
│   ├── ui/
│   │   └── Skeleton.tsx              # Componente base
│   ├── skeletons/
│   │   ├── CardSkeleton.tsx
│   │   ├── ListSkeleton.tsx
│   │   ├── TextSkeleton.tsx
│   │   ├── TableSkeleton.tsx
│   │   ├── AvatarSkeleton.tsx
│   │   └── index.ts
│   └── states/
│       ├── LoadingState.tsx
│       ├── ErrorState.tsx
│       ├── EmptyState.tsx
│       ├── SuccessState.tsx
│       └── ContentSwitch.tsx
├── hooks/
│   └── useContentState.ts
└── lib/
    └── skeleton-constants.ts
```

---

## 3. Componente Base: Skeleton

### 3.1 Interface

```typescript
// src/components/ui/Skeleton.tsx

interface SkeletonProps {
  /** Classes CSS adicionais */
  className?: string;
  /** Variante visual do skeleton */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Largura do skeleton */
  width?: string | number;
  /** Altura do skeleton */
  height?: string | number;
  /** Se deve desabilitar animação */
  disableAnimation?: boolean;
}
```

### 3.2 Implementação

```tsx
import { cn } from '@/lib/utils';

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
  disableAnimation = false,
}: SkeletonProps) {
  const baseStyles = 'bg-neutral-200 dark:bg-neutral-800';

  const variantStyles = {
    text: 'rounded-sm h-4',
    circular: 'rounded-full',
    rectangular: 'rounded-md',
  };

  return (
    <div
      className={cn(
        baseStyles,
        variantStyles[variant],
        !disableAnimation && 'animate-pulse',
        className
      )}
      style={{
        width: width,
        height: height,
      }}
      aria-hidden="true"
    />
  );
}
```

### 3.3 Regras de Estilo

- **Cores:** `bg-neutral-200` (light) / `bg-neutral-800` (dark)
- **Animação:** `animate-pulse` do Tailwind (1.5s, ease-in-out, infinite)
- **Border-radius:**
  - text: `rounded-sm` (4px)
  - rectangular: `rounded-md` (8px)
  - circular: `rounded-full`

---

## 4. Componentes Especializados

### 4.1 CardSkeleton

```typescript
interface CardSkeletonProps {
  /** Se deve exibir área de imagem */
  showImage?: boolean;
  /** Altura da imagem placeholder */
  imageHeight?: string | number;
  /** Classes CSS adicionais */
  className?: string;
}
```

**Estrutura Visual:**

```
┌─────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │     IMAGEM (opcional)  │ │
│ └─────────────────────────┘ │
│                             │
│ ██████████████████████████  │ ← título
│                             │
│ ██████████████████████████  │ ← linha 1
│ ████████████████████████    │ ← linha 2
│                             │
│ ████████                   │ ← badge/ação
└─────────────────────────────┘
```

**Implementação:**

```tsx
export function CardSkeleton({
  showImage = true,
  imageHeight = 160,
  className,
}: CardSkeletonProps) {
  return (
    <div className={cn('rounded-lg border p-4 space-y-3', className)}>
      {showImage && (
        <Skeleton
          variant="rectangular"
          height={imageHeight}
          className="w-full"
        />
      )}
      <Skeleton variant="text" className="w-3/4 h-5" />
      <div className="space-y-2">
        <Skeleton variant="text" className="w-full" />
        <Skeleton variant="text" className="w-5/6" />
      </div>
      <Skeleton variant="text" className="w-24 h-6" />
    </div>
  );
}
```

### 4.2 ListSkeleton

```typescript
interface ListSkeletonProps {
  /** Número de itens na lista */
  count?: number;
  /** Se deve exibir avatar/thumbnail */
  showAvatar?: boolean;
  /** Tamanho do avatar */
  avatarSize?: 'sm' | 'md' | 'lg';
  /** Classes CSS adicionais */
  className?: string;
}
```

**Implementação:**

```tsx
const avatarSizes = {
  sm: 32,
  md: 40,
  lg: 48,
};

export function ListSkeleton({
  count = 5,
  showAvatar = true,
  avatarSize = 'md',
  className,
}: ListSkeletonProps) {
  const size = avatarSizes[avatarSize];

  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          {showAvatar && (
            <Skeleton variant="circular" width={size} height={size} />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="w-1/3" />
            <Skeleton variant="text" className="w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 4.3 TextSkeleton

```typescript
interface TextSkeletonProps {
  /** Número de linhas */
  lines?: number;
  /** Largura da última linha (percentual) */
  lastLineWidth?: number;
  /** Classes CSS adicionais */
  className?: string;
}
```

**Implementação:**

```tsx
export function TextSkeleton({
  lines = 3,
  lastLineWidth = 60,
  className,
}: TextSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={i === lines - 1 ? `${lastLineWidth}%` : 'w-full'}
        />
      ))}
    </div>
  );
}
```

### 4.4 TableSkeleton

```typescript
interface TableSkeletonProps {
  /** Número de colunas */
  columns?: number;
  /** Número de linhas */
  rows?: number;
  /** Se deve exibir header */
  showHeader?: boolean;
  /** Classes CSS adicionais */
  className?: string;
}
```

**Implementação:**

```tsx
export function TableSkeleton({
  columns = 4,
  rows = 5,
  showHeader = true,
  className,
}: TableSkeletonProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {showHeader && (
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} variant="text" className="flex-1 h-4" />
          ))}
        </div>
      )}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" className="flex-1 h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}
```

### 4.5 AvatarSkeleton

```typescript
interface AvatarSkeletonProps {
  /** Tamanho do avatar */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Classes CSS adicionais */
  className?: string;
}
```

**Implementação:**

```tsx
const avatarSizes = {
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

export function AvatarSkeleton({
  size = 'md',
  className,
}: AvatarSkeletonProps) {
  return (
    <Skeleton
      variant="circular"
      width={avatarSizes[size]}
      height={avatarSizes[size]}
      className={className}
    />
  );
}
```

---

## 5. Componentes de Estado

### 5.1 ErrorState

```typescript
interface ErrorStateProps {
  /** Título da mensagem de erro */
  title?: string;
  /** Mensagem de erro detalhada */
  message?: string;
  /** Função para tentar novamente */
  onRetry?: () => void;
  /** Label do botão de retry */
  retryLabel?: string;
  /** Ícone personalizado */
  icon?: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
}
```

**Implementação:**

```tsx
import { AlertCircle, RefreshCw } from 'lucide-react';

export function ErrorState({
  title = 'Algo deu errado',
  message = 'Não foi possível carregar os dados.',
  onRetry,
  retryLabel = 'Tentar novamente',
  icon,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        'bg-destructive/5 border border-destructive/20 rounded-lg',
        className
      )}
      role="alert"
    >
      {icon || <AlertCircle className="w-12 h-12 text-destructive mb-4" />}
      <h3 className="text-lg font-semibold text-destructive mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
```

### 5.2 EmptyState

```typescript
interface EmptyStateProps {
  /** Título do estado vazio */
  title?: string;
  /** Mensagem descritiva */
  message?: string;
  /** Label da ação principal */
  actionLabel?: string;
  /** Função da ação */
  onAction?: () => void;
  /** Ícone personalizado */
  icon?: ReactNode;
  /** Classes CSS adicionais */
  className?: string;
}
```

**Implementação:**

```tsx
import { Inbox } from 'lucide-react';

export function EmptyState({
  title = 'Nenhum item encontrado',
  message = 'Comece criando algo novo!',
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center',
        'bg-muted/30 border border-dashed rounded-lg',
        className
      )}
    >
      {icon || <Inbox className="w-12 h-12 text-muted-foreground mb-4" />}
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-4 max-w-sm">{message}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>
          <Plus className="w-4 h-4 mr-2" />
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
```

### 5.3 ContentSwitch

```typescript
type ContentState = 'loading' | 'success' | 'error' | 'empty';

interface ContentSwitchProps<T> {
  /** Estado atual do conteúdo */
  state: ContentState;
  /** Dados carregados */
  data?: T;
  /** Componente de loading customizado */
  loadingComponent?: ReactNode;
  /** Componente de erro customizado */
  errorComponent?: ReactNode;
  /** Componente vazio customizado */
  emptyComponent?: ReactNode;
  /** Componente de sucesso (children) */
  children: (data: T) => ReactNode;
  /** Props adicionais para componentes de estado */
  loadingProps?: Record<string, unknown>;
  errorProps?: Record<string, unknown>;
  emptyProps?: Record<string, unknown>;
}
```

**Implementação:**

```tsx
export function ContentSwitch<T>({
  state,
  data,
  loadingComponent,
  errorComponent,
  emptyComponent,
  children,
  loadingProps,
  errorProps,
  emptyProps,
}: ContentSwitchProps<T>) {
  switch (state) {
    case 'loading':
      return loadingComponent || <CardSkeleton {...loadingProps} />;

    case 'error':
      return errorComponent || <ErrorState {...errorProps} />;

    case 'empty':
      return emptyComponent || <EmptyState {...emptyProps} />;

    case 'success':
    default:
      return data ? children(data) : null;
  }
}
```

---

## 6. Hook Customizado

### 6.1 useContentState

```typescript
import { useState, useEffect, useCallback } from 'react';

interface UseContentStateOptions<T> {
  /** Chave da query (para React Query) */
  queryKey?: unknown[];
  /** Função para buscar dados */
  queryFn?: () => Promise<T>;
  /** Dados iniciais */
  initialData?: T;
  /** Se deve carregar imediatamente */
  immediate?: boolean;
}

interface UseContentStateReturn<T> {
  /** Estado atual */
  state: 'loading' | 'success' | 'error' | 'empty';
  /** Dados */
  data: T | undefined;
  /** Erro se houver */
  error: Error | null;
  /** Se está carregando */
  isLoading: boolean;
  /** Se houve erro */
  isError: boolean;
  /** Se dados estão vazios */
  isEmpty: boolean;
  /** Função para carregar dados */
  refetch: () => Promise<void>;
  /** Função para definir dados manualmente */
  setData: (data: T) => void;
}

// Versão standalone (sem React Query)
export function useContentState<T>({
  queryKey,
  queryFn,
  initialData,
  immediate = true,
}: UseContentStateOptions<T>): UseContentStateReturn<T> {
  const [state, setState] = useState<'loading' | 'success' | 'error' | 'empty'>(
    'loading'
  );
  const [data, setData] = useState<T | undefined>(initialData);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    if (!queryFn) return;

    setState('loading');
    setError(null);

    try {
      const result = await queryFn();
      setData(result);
      setState(
        result && (Array.isArray(result) ? result.length > 0 : true)
          ? 'success'
          : 'empty'
      );
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setState('error');
    }
  }, [queryFn]);

  useEffect(() => {
    if (immediate && queryFn) {
      refetch();
    }
  }, [immediate, queryFn, refetch]);

  return {
    state,
    data,
    error,
    isLoading: state === 'loading',
    isError: state === 'error',
    isEmpty: state === 'empty',
    refetch,
    setData,
  };
}
```

---

## 7. Constantes de Configuração

```typescript
// src/lib/skeleton-constants.ts

export const SKELETON_CONFIG = {
  animation: {
    duration: 1500,
    timing: 'ease-in-out',
  },
  colors: {
    light: {
      base: 'bg-neutral-200',
      highlight: 'bg-neutral-100',
    },
    dark: {
      base: 'bg-neutral-800',
      highlight: 'bg-neutral-700',
    },
  },
  sizes: {
    avatar: {
      sm: 32,
      md: 40,
      lg: 56,
      xl: 80,
    },
  },
  spacing: {
    grid: 4, // 4px base
    gap: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
    },
  },
} as const;

export const CONTENT_STATE_MESSAGES = {
  error: {
    title: 'Algo deu errado',
    message: 'Não foi possível carregar os dados.',
    retryLabel: 'Tentar novamente',
  },
  empty: {
    title: 'Nenhum item encontrado',
    message: 'Comece criando algo novo!',
  },
} as const;
```

---

## 8. Barrel Export

```typescript
// src/components/skeletons/index.ts
export { Skeleton } from './Skeleton';
export { CardSkeleton } from './CardSkeleton';
export { ListSkeleton } from './ListSkeleton';
export { TextSkeleton } from './TextSkeleton';
export { TableSkeleton } from './TableSkeleton';
export { AvatarSkeleton } from './AvatarSkeleton';

// src/components/states/index.ts
export { ErrorState } from './ErrorState';
export { EmptyState } from './EmptyState';
export { ContentSwitch } from './ContentSwitch';
```

---

## 9. Exemplos de Uso

### 9.1 Uso Simples com Skeletons

```tsx
import {
  CardSkeleton,
  ListSkeleton,
  TextSkeleton,
} from '@/components/skeletons';

// Card grid loading
function MetasGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} showImage />
      ))}
    </div>
  );
}

// List loading
function AtividadesListSkeleton() {
  return <ListSkeleton count={5} showAvatar avatarSize="md" />;
}

// Text loading
function DescricaoSkeleton() {
  return <TextSkeleton lines={4} lastLineWidth={40} />;
}
```

### 9.2 Uso com Estados

```tsx
import { CardSkeleton } from '@/components/skeletons';
import { ErrorState, EmptyState, ContentSwitch } from '@/components/states';
import { useContentState } from '@/hooks/useContentState';

function MetasList() {
  const { state, data, isLoading, isError, isEmpty, error, refetch } =
    useContentState<Meta[]>({
      queryKey: ['metas'],
      queryFn: fetchMetas,
    });

  return (
    <ContentSwitch
      state={state}
      loadingComponent={
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      }
      errorComponent={<ErrorState message={error?.message} onRetry={refetch} />}
      emptyComponent={
        <EmptyState
          title="Nenhuma meta encontrada"
          message="Comece criando sua primeira meta!"
          actionLabel="+ Nova Meta"
          onAction={() => navigate('/metas/new')}
        />
      }
    >
      {(metas) => <MetasGrid metas={metas} />}
    </ContentSwitch>
  );
}
```

---

## 10. Critérios de Aceite

### 10.1 Funcionalidade

- [ ] Componente `Skeleton` renderiza com cores corretas para light/dark mode
- [ ] `Skeleton` aceita props: `className`, `variant`, `width`, `height`, `disableAnimation`
- [ ] Todos os skeletons especializados funcionam conforme especificação
- [ ] Estados `ErrorState` e `EmptyState` exibem mensagens e botões funcionais
- [ ] Animação pulse é suave (1.5s, ease-in-out, infinite)

### 10.2 Integração

- [ ] `useContentState` integra-se com React Query
- [ ] Componentes são reutilizáveis sem dependências externas

### 10.3 Responsividade

- [ ] Skeletons adaptam-se a diferentes tamanhos de tela
- [ ] Funciona em desktop e mobile

### 10.4 Acessibilidade

- [ ] Skeleton usa `aria-hidden="true"`
- [ ] Estados usam `role="alert"` para erros
- [ ] Respeita `prefers-reduced-motion`
- [ ] Ícones complementam texto (não apenas cor)

---

## 11. Tarefas de Implementação

### Fase 1: Componentes Base

- [ ] 1.1 Criar `src/components/ui/Skeleton.tsx`
- [ ] 1.2 Criar `src/lib/skeleton-constants.ts`

### Fase 2: Skeletons Especializados

- [ ] 2.1 Criar `CardSkeleton.tsx`
- [ ] 2.2 Criar `ListSkeleton.tsx`
- [ ] 2.3 Criar `TextSkeleton.tsx`
- [ ] 2.4 Criar `TableSkeleton.tsx`
- [ ] 2.5 Criar `AvatarSkeleton.tsx`
- [ ] 2.6 Criar barrel export em `index.ts`

### Fase 3: Estados de Conteúdo

- [ ] 3.1 Criar `ErrorState.tsx`
- [ ] 3.2 Criar `EmptyState.tsx`
- [ ] 3.3 Criar `ContentSwitch.tsx`
- [ ] 3.4 Criar barrel export em `index.ts`

### Fase 4: Hooks

- [ ] 4.1 Criar `useContentState.ts`

### Fase 5: Testes e Validação

- [ ] 5.1 Testar em diferentes temas (light/dark)
- [ ] 5.2 Verificar responsividade
- [ ] 5.3 Testar acessibilidade

---

## 12. Notas de Implementação

1. **Animações:** Usar apenas `animate-pulse` do Tailwind (já configurado). Não é necessário importar tw-animate-css para skeletons.

2. **Cores:** Utilizar as variáveis CSS do projeto (`bg-neutral-200`, `dark:bg-neutral-800`) para suporte automático a dark mode.

3. **Utilitários:** Usar `cn()` de `@/lib/utils` para merge de classes.

4. **Ícones:** Utilizar `lucide-react` que já está no projeto.

5. **Button:** Reutilizar componente Button existente em `src/components/ui/button.tsx`.

---

**Fim da Especificação**
