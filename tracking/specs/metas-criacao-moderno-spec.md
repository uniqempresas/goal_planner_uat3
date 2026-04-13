# Especificação de Design: Modernização das Telas de Criação de Metas

## 📋 Visão Geral

Esta especificação define o padrão de design para modernização de 6 telas do Goal Planner:
- **4 telas de criação** com wizard de 3 passos (Meta Anual, Mensal, Semanal, Diária)
- **1 tela de listagem** (Grandes Metas)
- **1 tela de criação** (Grande Meta - topo da hierarquia)

**Padrão de Referência:** `HabitoCreatePage.tsx` e `TarefaCreatePage.tsx`

---

## 🎨 Design System por Nível

### Cores Primárias

| Nível | Cor Principal | Gradiente | Hex | Uso |
|-------|---------------|-----------|-----|-----|
| **Grande Meta** | Azul Royal | `from-blue-600 to-indigo-700` | `#4169E1` | Header, badges, progresso |
| **Anual** | Índigo | `from-indigo-500 to-violet-600` | `#6366F1` | Header, badges, progresso |
| **Mensal** | Esmeralda | `from-emerald-500 to-teal-600` | `#10B981` | Header, badges, progresso |
| **Semanal** | Âmbar | `from-amber-500 to-orange-600` | `#F59E0B` | Header, badges, progresso |
| **Diária** | Rosa | `from-rose-500 to-pink-600` | `#EC4899` | Header, badges, progresso |

### Cores de Background e Estado

```typescript
const levelTheme = {
  grande: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    text: 'text-blue-700',
    hover: 'hover:bg-blue-100',
    ring: 'focus:ring-blue-500',
    gradient: 'from-blue-600 to-indigo-700',
    lightGradient: 'from-blue-50 to-indigo-50/30',
  },
  anual: {
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    text: 'text-indigo-700',
    hover: 'hover:bg-indigo-100',
    ring: 'focus:ring-indigo-500',
    gradient: 'from-indigo-500 to-violet-600',
    lightGradient: 'from-slate-50 to-indigo-50/30',
  },
  mensal: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    text: 'text-emerald-700',
    hover: 'hover:bg-emerald-100',
    ring: 'focus:ring-emerald-500',
    gradient: 'from-emerald-500 to-teal-600',
    lightGradient: 'from-slate-50 to-emerald-50/30',
  },
  semanal: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    text: 'text-amber-700',
    hover: 'hover:bg-amber-100',
    ring: 'focus:ring-amber-500',
    gradient: 'from-amber-500 to-orange-600',
    lightGradient: 'from-slate-50 to-amber-50/30',
  },
  diaria: {
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    text: 'text-rose-700',
    hover: 'hover:bg-rose-100',
    ring: 'focus:ring-rose-500',
    gradient: 'from-rose-500 to-pink-600',
    lightGradient: 'from-slate-50 to-rose-50/30',
  },
};
```

### Ícones por Nível

| Nível | Ícone | Elemento |
|-------|-------|----------|
| Grande Meta | 🏔️ | Mountain |
| Anual | 📅 | Calendar |
| Mensal | 🗓️ | CalendarDays |
| Semanal | 📆 | CalendarRange |
| Diária | ☀️ | Sun |

---

## 🧙 Estrutura do Wizard (3 Passos)

### Passo 1: Essenciais

**Objetivo:** Capturar informações fundamentais da meta

**Campos:**
1. **Título da Meta** (input texto)
   - Placeholder dinâmico por nível:
     - Grande: "Ex: Construir empresa de $1M"
     - Anual: "Ex: Lançar produto no mercado"
     - Mensal: "Ex: Finalizar módulo do curso"
     - Semanal: "Ex: Entregar relatório de vendas"
     - Diária: "Ex: Completar tarefa prioritária"
   - Validação: obrigatório, min 3 caracteres
   - Ícone à esquerda: `Target` (cor do nível quando preenchido)

2. **Descrição** (textarea expansível)
   - Placeholder: "Descreva os detalhes desta meta..."
   - Auto-resize: 3 linhas → 6 linhas
   - Opcional

3. **Área de Vida** (seletor visual com ícones)
   - Grid de cards clicáveis (ícone + nome)
   - Cor da área aplicada como border/border-left quando selecionada
   - Opcional

4. **Prazo** (date picker)
   - Default por nível:
     - Grande: `new Date(Date.now() + 3 * 365 * 24 * 60 * 60 * 1000)`
     - Anual: `new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)`
     - Mensal: `new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)`
     - Semanal: `new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)`
     - Diária: `new Date()`
   - Botões rápidos: "30 dias", "60 dias", "90 dias", "6 meses"
   - Ícone `Calendar` à direita

### Passo 2: ONE Thing & Foco

**Objetivo:** Definir prioridade e hierarquia

**Elementos:**

1. **Focusing Question Card** (destaque visual)
   - Layout: Card com gradiente sutil do nível
   - Label: "Focusing Question · {Nível}"
   - Texto em itálico
   - Exemplos por nível:
     - Grande: "Qual é a ÚNICA coisa que posso fazer nos próximos 3 anos..."
     - Anual: "Qual é a ÚNICA coisa que posso fazer este ano..."
     - Mensal: "Qual é a ÚNICA coisa que posso fazer este mês..."
     - Semanal: "Qual é a ÚNICA coisa que posso fazer esta semana..."
     - Diária: "Qual é a ÚNICA coisa que posso fazer hoje..."

2. **Toggle ONE Thing** (se é a prioridade máxima)
   - 3 opções em cards:
     - **Normal**: "Meta comum do dia a dia"
     - **Prioritária**: "Meta importante que precisa de atenção" (⭐)
     - **ONE Thing**: "Sua única prioridade absoluta" (🔥 destaque especial)

3. **Seletor de Meta Pai** (quando aplicável)
   - Reutilizar componente existente `MetaParentSelector`
   - Cards clicáveis com preview da meta
   - Opção "Nenhuma meta pai"
   - Botão para criar nova meta pai se não existir

4. **Preview da Hierarquia** (se tem meta pai)
   - Reutilizar `HierarchyTreePreview`
   - Mostrar caminho: Grande → Anual → Mensal → Semanal → Diária
   - Meta atual destacada

### Passo 3: Framework & Review

**Objetivo:** Definir critérios SMART e revisar

**Elementos:**

1. **Campos SMART** (colapsíveis)
   - Reutilizar componente `SmartFields`
   - Fields por nível (conforme já definido no componente existente)
   - Ícone `Lightbulb` (âmbar)
   - Collapsible: fechado por default

2. **Preview Card da Meta**
   - Layout igual `HabitPreview` / `TarefaPreview`
   - Header com barra de cor do nível
   - Ícone principal com gradiente do nível
   - Badges: ONE Thing (se aplicável), status
   - Info: prazo, área de vida, meta pai
   - Gamificação preview: XP potencial, conquista

3. **Gamificação Section**
   - XP estimado por nível:
     - Grande: +500 XP
     - Anual: +200 XP
     - Mensal: +100 XP
     - Semanal: +50 XP
     - Diária: +25 XP
   - Conquista potencial
   - Frase motivacional

4. **Botão de Submit**
   - Gradiente do nível
   - Texto: "Criar {NívelLabel}"
   - Ícone `Sparkles` ou `Check`
   - Loading state com spinner

---

## 🎭 Animações

### Transições entre Passos

```typescript
// AnimatePresence config
<AnimatePresence mode="wait">
  {currentStep === 1 && (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Step content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Step Indicator

```typescript
// StepIndicator component
<motion.div
  initial={false}
  animate={{
    scale: currentStep === step ? 1.1 : 1,
    backgroundColor: currentStep >= step ? themeColor : '#e2e8f0',
  }}
  transition={{ type: "spring", stiffness: 300, damping: 20 }}
>
  {currentStep > step ? <Check /> : step}
</motion.div>

// Connector line
<div className={`w-12 h-1 mx-2 rounded-full transition-colors ${
  currentStep > step ? 'bg-themeColor' : 'bg-slate-200'
}`} />
```

### Hover Effects

```typescript
// Cards selecionáveis
<motion.button
  whileHover={{ scale: 1.02, y: -2 }}
  whileTap={{ scale: 0.98 }}
  className="transition-shadow hover:shadow-lg"
/>

// Input focus
<input className="
  transition-all duration-200
  focus:border-theme-500 
  focus:ring-4 focus:ring-theme-500/20
" />
```

### Preview Card Animation

```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2, type: "spring" }}
>
  {/* Preview content */}
</motion.div>
```

### Error Banner

```typescript
<AnimatePresence>
  {error && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl"
    >
      {error}
    </motion.div>
  )}
</AnimatePresence>
```

---

## 🗺️ Mapa de Componentes

### Componentes Existentes (REUTILIZAR)

| Componente | Localização | Descrição |
|------------|-------------|-----------|
| `MetaParentSelector` | `pages/metas/components/` | Seletor de meta pai com cards |
| `HierarchyTreePreview` | `pages/metas/components/` | Preview da árvore hierárquica |
| `PrioritySelector` | `pages/metas/components/` | Seletor de prioridade (3 opções) |
| `SmartFields` | `pages/metas/components/` | Campos SMART colapsíveis |
| `StatsCard` | `components/metas/` | Card de estatísticas |
| `FocusingQuestionCard` | `components/metas/` | Card da focusing question |
| `MetaCardModern` | `components/metas/` | Card de meta moderno |
| `EmptyStateModern` | `components/metas/` | Empty state estilizado |
| `StepIndicator` | Inline (copiar de HabitoCreatePage) | Indicador de passos |

### Componentes Novos (CRIAR)

| Componente | Descrição | Props |
|------------|-----------|-------|
| `MetaPreview` | Preview da meta sendo criada | `meta`, `nivel`, `theme` |
| `AreaVidaSelector` | Seletor visual de áreas | `areas`, `selected`, `onSelect` |
| `WizardLayout` | Layout padrão do wizard | `children`, `step`, `theme` |
| `MetaCreateHeader` | Header sticky do wizard | `nivel`, `subtitle`, `theme` |

### Hooks Personalizados

```typescript
// useMetaWizard.ts
export function useMetaWizard(nivel: MetaNivel) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<MetaFormData>({});
  const [error, setError] = useState<string | null>(null);
  
  const validateStep = (step: number): boolean => { /* ... */ };
  const nextStep = () => { /* ... */ };
  const prevStep = () => { /* ... */ };
  
  return { currentStep, formData, error, validateStep, nextStep, prevStep };
}
```

---

## 📱 Responsividade

### Breakpoints

| Breakpoint | Largura | Layout |
|------------|---------|--------|
| Mobile | < 640px | Single column, steps em cima |
| Tablet | 640px - 1024px | Single column, preview abaixo |
| Desktop | > 1024px | 2 columns (form | preview) |

### Mobile (< 640px)

```typescript
// Layout single column
<div className="max-w-2xl mx-auto p-4">
  {/* Step indicator horizontal */}
  <StepIndicator currentStep={currentStep} totalSteps={3} />
  
  {/* Form apenas (sem preview sticky) */}
  <div className="bg-white rounded-2xl shadow-xl">
    {/* Steps com AnimatePresence */}
  </div>
  
  {/* Preview simplificado no step 3 */}
  {currentStep === 3 && <MetaPreviewMobile />}
</div>
```

### Desktop (> 1024px)

```typescript
// Layout 2 columns
<div className="max-w-6xl mx-auto p-4 lg:p-8">
  <div className="grid lg:grid-cols-2 gap-8 items-start">
    {/* Left: Form */}
    <motion.div className="bg-white rounded-2xl shadow-xl">
      {/* Form content */}
    </motion.div>
    
    {/* Right: Sticky Preview */}
    <div className="hidden lg:block sticky top-8">
      <MetaPreview {...formData} />
      <DicaCard theme={theme} />
    </div>
  </div>
</div>
```

### Touch Targets (Mobile)

- Botões: min 44px height
- Cards clicáveis: min 48px height
- Inputs: min 48px height
- Espaçamento entre elementos: 16px mínimo

---

## 🎯 Especificações Detalhadas

### Tipografia

| Elemento | Fonte | Tamanho | Peso | Cor |
|----------|-------|---------|------|-----|
| Page Title | System | 32px / 24px mobile | 700 (bold) | slate-900 |
| Step Title | System | 20px | 600 (semibold) | slate-900 |
| Step Subtitle | System | 14px | 400 | slate-500 |
| Label | System | 14px | 600 (semibold) | slate-700 |
| Input Text | System | 16px | 400 | slate-900 |
| Button | System | 16px | 600 | white |
| Card Title | System | 16px | 600 | slate-800 |
| Preview Title | System | 20px | 700 | slate-900 |
| Badge | System | 12px | 500 | inherit |

### Espaçamentos (8-point grid)

```
4px  - micro spacing
8px  - tight spacing
16px - default spacing
24px - section spacing
32px - large spacing
48px - section break
64px - page padding
```

### Bordas e Sombras

```css
/* Cards */
border-radius: 16px; /* rounded-2xl */
border: 1px solid slate-200;
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);

/* Inputs */
border-radius: 12px; /* rounded-xl */
border: 2px solid slate-200;
focus: border-theme-500;

/* Buttons */
border-radius: 12px; /* rounded-xl */

/* Badges */
border-radius: 9999px; /* rounded-full */
```

### Estados de Input

```typescript
// Default
border-slate-200

// Focus
border-theme-500
ring-4 ring-theme-500/20

// Valid (touched and valid)
border-emerald-400
bg-emerald-50/30

// Error
border-rose-400
bg-rose-50
```

---

## 🏗️ Estrutura de Arquivos

```
src/app/pages/metas/
├── GrandesMetasPage.tsx              # LISTAGEM - Modernizar
├── GrandeMetaCreatePage.tsx          # CRIAÇÃO - Refatorar para wizard
├── MetaAnualCreatePage.tsx           # CRIAÇÃO - Refatorar para wizard
├── MetaMensalCreatePage.tsx          # CRIAÇÃO - Refatorar para wizard
├── MetaSemanalCreatePage.tsx         # CRIAÇÃO - Refatorar para wizard
├── MetaDiariaCreatePage.tsx          # CRIAÇÃO - Refatorar para wizard
├── components/
│   ├── MetaParentSelector.tsx        # EXISTENTE - manter
│   ├── HierarchyTreePreview.tsx      # EXISTENTE - manter
│   ├── PrioritySelector.tsx          # EXISTENTE - atualizar cores dinâmicas
│   ├── SmartFields.tsx               # EXISTENTE - manter
│   ├── MetaPreview.tsx               # NOVO - Preview da meta
│   ├── StepIndicator.tsx             # NOVO - Indicador de passos
│   ├── AreaVidaSelector.tsx          # NOVO - Seletor de áreas
│   └── MetaWizardLayout.tsx          # NOVO - Layout base do wizard
├── hooks/
│   └── useMetaWizard.ts              # NOVO - Hook do wizard
└── types/
    └── metaWizard.ts                 # NOVO - Tipos do wizard
```

---

## 🧪 Validações

### Step 1 - Essenciais

```typescript
const validateStep1 = (data: Step1Data): string | null => {
  if (!data.titulo?.trim()) return 'O título da meta é obrigatório';
  if (data.titulo.length < 3) return 'O título deve ter pelo menos 3 caracteres';
  if (!data.prazo) return 'O prazo é obrigatório';
  
  const prazoDate = new Date(data.prazo);
  if (isNaN(prazoDate.getTime())) return 'Data de prazo inválida';
  
  return null;
};
```

### Step 2 - ONE Thing

```typescript
const validateStep2 = (data: Step2Data): string | null => {
  // ONE Thing só pode ser selecionado se tiver meta pai (exceto Grande Meta)
  if (data.prioridade === 'one_thing' && !data.parentId && nivel !== 'grande') {
    return 'ONE Thing precisa estar vinculada a uma meta pai';
  }
  return null;
};
```

### Step 3 - Framework

```typescript
const validateStep3 = (data: Step3Data): string | null => {
  // Campos SMART são opcionais
  return null;
};
```

---

## 📝 Checklist de Implementação

### GrandesMetasPage (Listagem)

- [ ] Substituir layout atual por `MetasListPageModern`
- [ ] Header gradiente Azul Royal
- [ ] Stats cards (Total, Ativas, Progresso, ONE Thing)
- [ ] Focusing Question card
- [ ] Cards de metas usando `MetaCardModern`
- [ ] Empty state moderno
- [ ] FAB mobile

### GrandeMetaCreatePage (Criação - 3 anos)

- [ ] Wizard 3 passos
- [ ] Cor Azul Royal em todo o tema
- [ ] Sem seletor de meta pai (é o topo)
- [ ] Prazo default: 3 anos
- [ ] Preview sticky (desktop)
- [ ] Animações entre passos

### MetaAnualCreatePage (Criação)

- [ ] Wizard 3 passos
- [ ] Cor Índigo
- [ ] Seletor de meta pai (Grandes Metas)
- [ ] Prazo default: 1 ano
- [ ] Preview sticky (desktop)
- [ ] Animações entre passos

### MetaMensalCreatePage (Criação)

- [ ] Wizard 3 passos
- [ ] Cor Esmeralda
- [ ] Seletor de meta pai (Metas Anuais)
- [ ] Prazo default: 30 dias
- [ ] Preview sticky (desktop)
- [ ] Animações entre passos

### MetaSemanalCreatePage (Criação)

- [ ] Wizard 3 passos
- [ ] Cor Âmbar
- [ ] Seletor de meta pai (Metas Mensais)
- [ ] Prazo default: 7 dias
- [ ] Preview sticky (desktop)
- [ ] Animações entre passos

### MetaDiariaCreatePage (Criação)

- [ ] Wizard 3 passos
- [ ] Cor Rosa
- [ ] Seletor de meta pai (Metas Semanais)
- [ ] Prazo: data atual
- [ ] Preview sticky (desktop)
- [ ] Animações entre passos

---

## 🔗 Referências

### Arquivos de Referência (manter padrão)

1. **Wizard Pattern:** `src/app/pages/habitos/HabitoCreatePage.tsx`
2. **Preview Pattern:** `src/app/pages/agenda/TarefaCreatePage.tsx`
3. **Listagem Moderna:** `src/app/pages/metas/MetasListPageModern.tsx`
4. **Cards Modernos:** `src/app/components/metas/MetaCardModern.tsx`

### Componentes UI Base

- Todos os componentes em `src/app/components/ui/`
- `Button`, `Input`, `Textarea`, `Card`, `Select`, `Form`

---

## 🎨 Design Commitment

> **DESIGN COMMITMENT:**
> - **Geometry:** Bordas arredondadas (rounded-xl/2xl) para aparência amigável
> - **Typography:** System font stack (Inter/SF Pro), headers semibold, body regular
> - **Palette:** Cores distintas por nível de meta (Azul→Índigo→Esmeralda→Âmbar→Rosa)
> - **Effects/Motion:** Gradientes suaves, sombras em cards, transições suaves entre passos
> - **Layout uniqueness:** Wizard 3 passos com preview sticky, hierarquia visual clara
> - **Mobile-first:** Layout single column em mobile, 2-col em desktop

---

*Documento criado para o @vibe-implementer - NÃO implementar código diretamente, seguir especificações.*
