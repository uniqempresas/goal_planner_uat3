# SPEC - Sistema de Dark Mode

**Data**: 25 de Março de 2026  
**Versão**: 1.0  
**Status**: Pronto para Implementação

---

## 1. Visão Geral

Este documento especifica a implementação do sistema de Dark Mode para o Goal Planner, permitindo que usuários alternem entre temas claro e escuro com persistência de preferência e suporte às preferências do sistema operacional.

**Stack Tecnológico**:

- React 19 + TypeScript
- Tailwind CSS v4
- localStorage API

---

## 2. Análise de Requisitos

### 2.1 Requisitos Funcionais

| ID   | Requisito                                               | Prioridade  |
| ---- | ------------------------------------------------------- | ----------- |
| RF01 | Toggle de tema visível no Header com ícones de sol/lua  | Obrigatório |
| RF02 | Alternância entre light e dark mode ao clicar no toggle | Obrigatório |
| RF03 | Persistência de preferência em localStorage             | Obrigatório |
| RF04 | Restauração do tema salvo ao recarregar a página        | Obrigatório |
| RF05 | Suporte a prefers-color-scheme do SO                    | Obrigatório |
| RF06 | Transição suave entre temas                             | Obrigatório |

### 2.2 Requisitos Não Funcionais

| ID    | Requisito       | Critério                                         |
| ----- | --------------- | ------------------------------------------------ |
| RNF01 | Performance     | Troca instantânea sem reload                     |
| RNF02 | Compatibilidade | Fallback para light se localStorage indisponível |
| RNF03 | Acessibilidade  | Contraste adequado em ambos os modos             |

### 2.3 Estado Atual do Código

**Arquivos analisados**:

- `src/index.css:81-124` - CSS Variables existentes (`:root` e `.dark`)
- `src/components/layout/Header.tsx:22-28` - Toggle atual (sem persistência)
- `src/App.tsx` - Estrutura da aplicação

**Observações**:

- CSS Variables já configuradas com Tailwind CSS v4
- Toggle básico já existe mas não persiste preferência
- Não há verificação de `prefers-color-scheme`

---

## 3. Abordagem Técnica

### 3.1 Arquitetura da Solução

```
src/
├── hooks/
│   └── useTheme.ts          # Hook para gerenciar tema
├── components/
│   └── layout/
│       └── Header.tsx       # Toggle button (modificar existente)
└── App.tsx                  # Aplicar useTheme no mount
```

### 3.2 Lógica de Resolução de Tema

```typescript
// Prioridade de resolução:
// 1. localStorage.getItem('goal-planner-theme')
// 2. window.matchMedia('(prefers-color-scheme: dark)').matches
// 3. fallback: 'light'
```

### 3.3 Aplicação do Tema

- Adicionar/remover classe `.dark` no elemento `<html>`
- Usar CSS Variables já definidas em `src/index.css`
- Transições CSS via Tailwind (default)

---

## 4. Estrutura de Arquivos

### 4.1 Novo Arquivo: `src/hooks/useTheme.ts`

```typescript
import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'goal-planner-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  // 1. Obter tema inicial (só executa no client)
  useEffect(() => {
    setMounted(true);

    // Verifica localStorage primeiro
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored && (stored === 'light' || stored === 'dark')) {
      setTheme(stored);
      applyTheme(stored);
      return;
    }

    // Fallback: prefers-color-scheme
    const prefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const systemTheme = prefersDark ? 'dark' : 'light';
    setTheme(systemTheme);
    applyTheme(systemTheme);
  }, []);

  // 2. Função para aplicar tema ao document
  const applyTheme = useCallback((newTheme: Theme) => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  }, []);

  // 3. Função para alternar tema
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, [theme, applyTheme]);

  return { theme, toggleTheme, mounted };
}
```

### 4.2 Modificações: `src/components/layout/Header.tsx`

```typescript
// Remover useState local do theme
// Usar useTheme hook

import { useTheme } from '@/hooks/useTheme';

// No componente:
const { theme, toggleTheme, mounted } = useTheme();

// Render condicional para evitar hydration mismatch:
// {mounted && (theme === 'light' ? <Moon /> : <Sun />)}
```

### 4.3 Adição: Transições CSS

Adicionar em `src/index.css`:

```css
html {
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

* {
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}
```

---

## 5. Tarefas de Implementação

### Fase 1: Criação do Hook (15 min)

- [ ] **T5.1** Criar arquivo `src/hooks/useTheme.ts`
- [ ] **T5.2** Implementar lógica de resolução de tema
- [ ] **T5.3** Implementar persistência localStorage
- [ ] **T5.4** Implementar suporte a prefers-color-scheme

### Fase 2: Integração com Header (10 min)

- [ ] **T5.5** Importar useTheme no Header.tsx
- [ ] **T5.6** Substituir useState local pelo hook
- [ ] **T5.7** Adicionar render condicional para evitar hydration mismatch

### Fase 3: Transições e Polish (5 min)

- [ ] **T5.8** Adicionar transições CSS suaves
- [ ] **T5.9** Testar alternância light → dark → light

---

## 6. Critérios de Aceite

### 6.1 Funcionalidade

- [ ] **CA01** Toggle de tema visível no Header com ícones de sol/lua
- [ ] **CA02** Clicar no toggle alterna corretamente entre light e dark mode
- [ ] **CA03** Classe `.dark` é aplicada/removida no elemento `<html>`
- [ ] **CA04** Preferência é salva no localStorage ao mudar o tema
- [ ] **CA05** Ao recarregar a página, o tema salvo no localStorage é restaurado
- [ ] **CA06** Se não houver localStorage, usa prefers-color-scheme do SO
- [ ] **CA07** Se nem localStorage nem prefers-color-scheme, usa 'light' como fallback

### 6.2 Design/UI

- [ ] **CA08** Elementos do UI estão com cores corretas em modo escuro
- [ ] **CA09** Textos são legíveis em ambos os modos
- [ ] **CA10** Bordas e separadores visíveis no dark mode
- [ ] **CA11** Transição suave ao trocar de tema (efeito visual)

### 6.3 Testes

- [ ] **CA12** Testar alternância light → dark → light
- [ ] **CA13** Testar persistência após refresh da página
- [ ] **CA14** Testar em browser com prefers-color-scheme: dark
- [ ] **CA15** Testar em browser com prefers-color-scheme: light

---

## 7. Considerações de Acessibilidade

### 7.1 Suporte a prefers-reduced-motion

O projeto deve respeitar a preferência do usuário por movimento reduzido. Adicionar em `src/index.css`:

```css
@media (prefers-reduced-motion: reduce) {
  html,
  * {
    transition: none !important;
    animation-duration: 0.01ms !important;
  }
}
```

### 7.2 Atributos ARIA

O botão de toggle deve incluir:

- `aria-label`: "Alternar para modo escuro" / "Alternar para modo claro"
- `role`: "switch" (opcional)

---

## 8. Glossário

| Termo                | Definição                                        |
| -------------------- | ------------------------------------------------ |
| localStorage         | API de armazenamento local do navegador          |
| prefers-color-scheme | Media query do CSS para preferência de cor do SO |
| CSS Variables        | Variáveis CSS definidas com --prefix             |
| Hydration            | Processo de React hydrate no client-side         |
