# SPEC - 404 Page e Error Boundary

**Projeto:** Goal Planner  
**Versão:** 1.0  
**Data:** 25/03/2026  
**\_stack:** React 19 + TypeScript + Vite + React Router v7

---

## 1. Visão Geral

Esta especificação cobre a implementação de duas funcionalidades complementares para tratamento de erros na aplicação:

1. **Página 404 (Not Found):** Exibida quando o usuário acessa uma rota que não existe
2. **Error Boundary:** Componente que captura erros de runtime em toda a aplicação

**Diferença chave:**

- **404:** Usuário tentou acessar uma rota inexistente
- **Error Boundary:** Erro de JavaScript (exceção não tratada) ocorreu durante a renderização

---

## 2. Requisitos Funcionais

### 2.1 Página 404

| Requisito | Descrição                                                  |
| --------- | ---------------------------------------------------------- |
| RF-404-01 | Exibir mensagem clara de "Página não encontrada"           |
| RF-404-02 | Incluir botão para voltar ao Dashboard                     |
| RF-404-03 | Rota catch-all (`*`) para capturar todas as URLs inválidas |
| RF-404-04 | Manter layout consistente com o app                        |

### 2.2 Error Boundary

| Requisito | Descrição                                                     |
| --------- | ------------------------------------------------------------- |
| RF-EB-01  | Capturar erros de JavaScript em toda a árvore de componentes  |
| RF-EB-02  | Exibir UI de fallback amigável quando ocorrer erro            |
| RF-EB-03  | Incluir botão "Tentar novamente" que reseta o estado de erro  |
| RF-EB-04  | Incluir botão para voltar ao Dashboard                        |
| RF-EB-05  | Exibir mensagem de erro apenas em ambiente de desenvolvimento |
| RF-EB-06  | Log do erro no console para debugging                         |

---

## 3. Especificações de UI

### 3.1 Wireframe - Página 404

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                          🔍                                 │
│                                                             │
│                   Página não encontrada                     │
│                                                             │
│      A página que você está procurando não existe           │
│           ou foi movida para outro lugar.                   │
│                                                             │
│    ┌─────────────────────────────────────────────────┐      │
│    │            Voltar ao Dashboard                  │      │
│    └─────────────────────────────────────────────────┘      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Wireframe - Error Boundary

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                                                             │
│                          ⚠️                                 │
│                                                             │
│                    Algo deu errado                          │
│                                                             │
│      Pedimos desculpas, mas ocorreu um erro inesperado      │
│               ao carregar esta página.                      │
│                                                             │
│    ┌─────────────────────────────────────────────────┐      │
│    │            Tentar novamente                      │      │
│    └─────────────────────────────────────────────────┘      │
│                                                             │
│    ┌─────────────────────────────────────────────────┐      │
│    │            Voltar ao Dashboard                   │      │
│    └─────────────────────────────────────────────────┘      │
│                                                             │
│          Erro: Something went wrong...                      │
│              (apenas em desenvolvimento)                    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Detalhamento Visual

| Elemento       | Estilo                                                                  |
| -------------- | ----------------------------------------------------------------------- |
| **Ícone 404**  | Search/X icon, 80px, `text-neutral-400`                                 |
| **Ícone Erro** | AlertTriangle icon, 80px, `text-red-500`                                |
| **Título**     | 24px, `font-semibold`, `text-foreground`                                |
| **Descrição**  | 16px, `text-neutral-500`                                                |
| **Botões**     | Primário: `bg-amber-500 hover:bg-amber-600`, Secundário: outline/border |
| **Spacing**    | Padding 16px, gap entre botões 12px                                     |

---

## 4. Arquitetura Técnica

### 4.1 Estrutura de Arquivos

```
src/
├── components/
│   └── error/
│       ├── NotFound.tsx          # Página 404
│       └── ErrorBoundary.tsx     # Componente Error Boundary
├── pages/
│   └── NotFoundPage.tsx          # Rota 404 (wrapper)
└── routes.tsx                    # Configuração de rotas
```

### 4.2 Implementação - Página 404

```tsx
// src/components/error/NotFound.tsx
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="max-w-md w-full text-center">
        {/* Ícone */}
        <div className="mb-6">
          <Search className="w-20 h-20 mx-auto text-neutral-400" />
        </div>

        {/* Título */}
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Página não encontrada
        </h2>

        {/* Descrição */}
        <p className="text-neutral-500 mb-6">
          A página que você está procurando não existe ou foi movida para outro
          lugar.
        </p>

        {/* Botão Voltar */}
        <Button asChild>
          <Link to="/dashboard">Voltar ao Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
```

### 4.3 Implementação - Error Boundary

```tsx
// src/components/error/ErrorBoundary.tsx
import { Component, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env.DEV;

      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="max-w-md w-full text-center">
            {/* Ícone */}
            <div className="mb-6">
              <AlertTriangle className="w-20 h-20 mx-auto text-red-500" />
            </div>

            {/* Título */}
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              Algo deu errado
            </h2>

            {/* Descrição */}
            <p className="text-neutral-500 mb-6">
              Pedimos desculpas, mas ocorreu um erro inesperado ao carregar esta
              página.
            </p>

            {/* Botões */}
            <div className="space-y-3">
              <Button onClick={this.handleReset} className="w-full">
                <RefreshCw className="w-4 h-4 mr-2" />
                Tentar novamente
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link to="/dashboard">Voltar ao Dashboard</Link>
              </Button>
            </div>

            {/* Debug info - apenas em desenvolvimento */}
            {isDev && this.state.error && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-left">
                <p className="text-sm text-red-600 dark:text-red-400 font-mono whitespace-pre-wrap">
                  {this.state.error.message}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 4.4 Configuração de Rotas

```tsx
// src/routes.tsx -snippet
import { createBrowserRouter, Navigate } from 'react-router-dom';
import NotFound from '@/components/error/NotFound';
import ErrorBoundary from '@/components/error/ErrorBoundary';

// ... outras imports

export const router = createBrowserRouter([
  // ... rotas existentes

  // Rota catch-all para 404 (DEVE SER A ÚLTIMA ROTA)
  {
    path: '*',
    element: (
      <ErrorBoundary>
        <NotFound />
      </ErrorBoundary>
    ),
  },
]);
```

---

## 5. Integração com Layout Existente

### 5.1 Error Boundary Global

Para capturar erros em toda a aplicação, o `ErrorBoundary` deve envolver o `MainLayout`:

```tsx
// src/App.tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import ErrorBoundary from '@/components/error/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}
```

### 5.2 Considerações sobre PrivateRoute

O `PrivateRoute` já envolve o `MainLayout`. Devido à natureza do Error Boundary (deve envolver onde o erro pode ocorrer), a melhor abordagem é:

1. **ErrorBoundary global no App.tsx** - Captura todos os erros
2. **ErrorBoundary por rota** - Opcional, para isolate errors específicos

---

## 6. Testes

### 6.1 Casos de Teste

| ID        | Cenário                               | Resultado Esperado                          |
| --------- | ------------------------------------- | ------------------------------------------- |
| TC-404-01 | Acessar URL inexistente               | Página 404 exibida com botão para dashboard |
| TC-404-02 | Clicar no botão "Voltar ao Dashboard" | Redirecionado para /dashboard               |
| TC-EB-01  | Erro thrown em componente             | UI de fallback exibida                      |
| TC-EB-02  | Clicar em "Tentar novamente"          | Componente tenta renderizar novamente       |
| TC-EB-03  | Erro persiste após retry              | Mantém UI de fallback                       |
| TC-EB-04  | Erro em modo desenvolvimento          | Mensagem de erro visível                    |
| TC-EB-05  | Erro em modo produção                 | Mensagem de erro oculta                     |

### 6.2 Teste Manual

```bash
# Testar 404
1. Acessar http://localhost:5173/rota-inexistente
2. Verificar que exibe "Página não encontrada"
3. Clicar em "Voltar ao Dashboard"
4. Verificar redirecionamento para /dashboard

# Testar Error Boundary
1. Adicionar temporariamente um throw new Error() em um componente
2. Verificar que exibe "Algo deu errado"
3. Clicar em "Tentar novamente"
4. Verificar retry ou manutenção do erro
```

---

## 7. Critérios de Aceitação

- [ ] Página 404 exibida para rotas inexistentes
- [ ] Botão "Voltar ao Dashboard" funcional na página 404
- [ ] Error Boundary captura erros de runtime
- [ ] Botão "Tentar novamente" reseta o estado de erro
- [ ] Botão "Voltar ao Dashboard" funcional no Error Boundary
- [ ] Mensagem de erro visível apenas em desenvolvimento
- [ ] Layout consistente com o restante da aplicação
- [ ] Rota catch-all (`*`) configurada como última rota

---

## 8. Riscos e Mitigações

| Risco                             | Impacto | Mitigação                                              |
| --------------------------------- | ------- | ------------------------------------------------------ |
| Error Boundary quebrar o app      | Alto    | Testar exaustivamente; usar fallback minimal se falhar |
| Rota catch-all conflitando        | Médio   | Garantir que seja a última rota                        |
| Perda de contexto de autenticação | Médio   | ErrorBoundary não deve afetar estado global            |

---

## 9. Histórico de Versões

| Versão | Data       | Alterações                      |
| ------ | ---------- | ------------------------------- |
| 1.0    | 25/03/2026 | Versão inicial da especificação |

---

**Fim do documento**
