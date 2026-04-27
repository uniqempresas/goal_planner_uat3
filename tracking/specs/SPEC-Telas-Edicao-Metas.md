# Especificação: Redesign das Telas de Edição de Metas - Goal Planner

## 1. Análise das Telas Atuais

### 1.1. Problemas Encontrados

#### MetaEditPage.tsx (Edição Genérica) - CRÍTICO
- **Layout ultrapassado**: Não segue o padrão de wizard (3 passos) usado nas telas de criação modernas
- **Campos faltantes**: Não edita `prazo`, `parent_id`, campos SMART (`smart_objetivo`, `smart_especifico`, etc.)
- **Sem preview**: Não há card de preview ao lado como nas telas de criação
- **Sem animações**: Zero animações vs. Framer Motion nas telas de criação
- **Permite troca de nível**: Dropdown de nível perigoso - mudar de "mensal" para "diaria" quebra a hierarquia de submetas
- **Sem seleção de meta pai**: Não é possível trocar a meta pai (parent_id) - funcionalidade essencial
- **Schema genérico**: Usa `metaFormSchema` que não inclui metade dos campos do banco
- **One Thing confuso**: Usa checkbox booleano ao invés do sistema de prioridade (normal/prioritária/one_thing) das telas modernas
- **Status editável sem contexto**: Não há explicação do impacto de arquivar/concluir

#### MetaCreatePage.tsx (Criação Genérica) - OBSOLETO
- **Página redundante**: Existem páginas específicas por nível (GrandeMetaCreatePage, MetaAnualCreatePage, etc.)
- **Mesmos problemas da edição**: Sem prazo, sem parent_id, sem SMART, sem wizard
- **Não deveria existir**: Deve ser removida ou redirecionar para a página específica do nível

#### MetaDetailPage.tsx (Detalhes) - PARCIAL
- **Visual OK mas funcionalidade limitada**: Mostra progresso, submetas, tarefas
- **Não mostra meta pai**: Não exibe a hierarquia completa (ancestrais)
- **Não mostra campos SMART**: Se a meta tem SMART preenchido, não aparece
- **Botão de edição leva para tela quebrada**: Link para MetaEditPage que não edita metade dos campos
- **Sem ações rápidas**: Não permite editar campos específicos inline

### 1.2. Inconsistências Visuais

| Aspecto | Telas de Criação (Modernas) | Telas de Edição (Atuais) |
|---------|---------------------------|------------------------|
| Layout | Wizard 3 passos + Preview | Formulário único simples |
| Tema | Gradiente por nível | Fundo branco padrão |
| Animações | Framer Motion (entrada/saída) | Nenhuma |
| Preview | Card lateral desktop | Não existe |
| Ícones | Lucide React contextualizados | Apenas ArrowLeft |
| Cores | Tema por nível (indigo, emerald, amber, rose) | Apenas slate/indigo |
| Stepper | Indicador visual de progresso | Não existe |
| Tips | Dica contextual por nível | Não existe |
| Hierarquia | Tree preview | Não existe |
| Área de Vida | Grid de ícones coloridos | Dropdown simples |

### 1.3. Funcionalidades Faltantes na Edição

1. **Troca de meta pai**: Impossível realocar uma meta na hierarquia
2. **Edição de prazo**: Campo não existe no formulário
3. **Edição de SMART**: Campos existem no banco mas não no formulário
4. **Edição de prioridade**: Sistema de prioridade (normal/prioritária/one_thing) não refletido
5. **Visualização de impacto**: Não mostra quantas submetas/tarefas serão afetadas
6. **Validação por nível**: Sem validação de prazo adequado (ex: diária não pode ter prazo de 1 ano)

---

## 2. Wireframe Estrutural

### 2.1. Layout Base (Desktop)

```
+------------------------------------------------------------------+
|  [Ícone] Editar {Nível da Meta}                          [Fechar] |
+------------------------------------------------------------------+
|  Breadcrumb: Grandes Metas > Minha Meta > Editar                 |
+------------------------------------------------------------------+
|                                                                    |
|  +------------------------+    +-----------------------------+   |
|  |  STEP 1: Essenciais    |    |     PREVIEW DA META         |   |
|  |  [Titulo          ]    |    |  +---------------------+    |   |
|  |  [Descrição       ]    |    |  | [Ícone] Título      |    |   |
|  |  [Área de Vida    ]    |    |  | Nível • Status      |    |   |
|  |  [Prazo           ]    |    |  | Prazo: 01/01/2025   |    |   |
|  |                        |    |  | Área: Carreira      |    |   |
|  |  [Continuar →]         |    |  | Prioridade: 🔥 ONE  |    |   |
|  +------------------------+    |  +---------------------+    |   |
|                                |                             |   |
|  +------------------------+    |  Dica do Goal Planner:      |   |
|  |  STEP 2: ONE Thing &   |    |  "Metas anuais devem..."    |   |
|  |  [Focusing Question]   |    |                             |   |
|  |  [Prioridade      ]    |    |  Impacto da edição:         |   |
|  |  [Meta Pai        ]    |    |  • 3 submetas vinculadas    |   |
|  |  [Hierarquia Tree ]    |    |  • 12 tarefas vinculadas    |   |
|  |                        |    |                             |   |
|  |  [← Anterior] [Salvar] |    |                             |   |
|  +------------------------+    +-----------------------------+   |
|                                                                    |
+------------------------------------------------------------------+
```

### 2.2. Layout Mobile

```
+----------------------------------+
|  [←] Editar Meta Diária    [✕]  |
+----------------------------------+
|  ●───○───○  (Stepper)            |
|  Essenciais                      |
+----------------------------------+
|                                  |
|  Título *                        |
|  [                        ]      |
|                                  |
|  Descrição                       |
|  [                        ]      |
|  [                        ]      |
|                                  |
|  Área de Vida                    |
|  [🏢][❤️][🏠][📚]...            |
|                                  |
|  Prazo                           |
|  [📅 25/12/2025]                 |
|  [30d] [60d] [90d] [6m]          |
|                                  |
|  [Continuar →]                   |
|                                  |
+----------------------------------+
```

### 2.3. Organização dos Campos por Step

#### Step 1: Essenciais (TODOS os níveis)
- **Título** (obrigatório) - Input com ícone Target
- **Descrição** (opcional) - Textarea
- **Área de Vida** (opcional) - Grid de ícones coloridos (reutilizar AreaVidaSelector)
- **Prazo** (condicional por nível) - Date picker + quick buttons
  - Grande: até 5 anos (default 3 anos)
  - Anual: até 1 ano (default 1 ano)
  - Mensal: até 1 mês (default 1 mês)
  - Semanal: até 1 semana (default 1 semana)
  - Diária: hoje (readonly)

#### Step 2: ONE Thing & Foco (Grandes, Anuais, Mensais, Semanais)
- **Focusing Question Card** - Input estilizado com gradiente do tema
- **Prioridade** - Cards selecionáveis (Normal/Prioritária/ONE Thing)
- **Meta Pai** - Seletor hierárquico (reutilizar MetaParentSelector)
- **Hierarchy Tree Preview** - Visualização da árvore (reutilizar HierarchyTreePreview)

#### Step 2 Alternativo: Prioridade & Pai (Diárias)
- **Focusing Question Card**
- **Prioridade**
- **Meta Pai** (obrigatório para diárias)
- **Bloco do Dia** - Manhã/Tarde/Noite/ONE Thing (novo campo)

#### Step 3: Framework & Review (Grandes, Anuais)
- **Campos SMART** - Expandable card (reutilizar SmartFields)
- **Review de Impacto** - Alerta com número de submetas/tarefas afetadas
- **Botão Salvar** - Gradiente do tema com animação

#### Step 3 Alternativo: Framework & Review (Mensais, Semanais)
- **Campos SMART simplificados**
- **Review de Impacto**
- **Botão Salvar**

#### Step 3 Alternativo: Review (Diárias)
- **Checklist rápido** - SmartFields nível diária
- **Botão Salvar**

---

## 3. Fluxo de Navegação

### 3.1. Como o Usuário Chega à Edição

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Lista de Metas │────▶│  Detalhes       │────▶│  Edição         │
│  (/metas/...)   │     │  (/.../:id)     │     │  (/.../:id/edit)│
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         │                       │
         ▼                       ▼
    [Clique no card]      [Clique em "Editar"]
    [Menu ações ⋮]        [Ação rápida inline]
```

### 3.2. Rotas de Edição por Nível

| Nível | Rota Atual | Rota Nova | Componente |
|-------|-----------|-----------|------------|
| Grande | `/metas/grande/:id/editar` | `/metas/grandes/:id/editar` | `GrandeMetaEditPage` |
| Anual | `/metas/anual/:id/editar` | `/metas/anuais/:id/editar` | `MetaAnualEditPage` |
| Mensal | `/metas/mensal/:id/editar` | `/metas/mensais/:id/editar` | `MetaMensalEditPage` |
| Semanal | `/metas/semanal/:id/editar` | `/metas/semanais/:id/editar` | `MetaSemanalEditPage` |
| Diária | `/metas/diaria/:id/editar` | `/metas/diarias/:id/editar` | `MetaDiariaEditPage` |

> **Nota**: Padronizar rotas no plural para consistência com as páginas de listagem.

### 3.3. Fluxo de Saída

```
Edição ──▶ Salvar ──▶ [Sucesso] ──▶ Detalhes da Meta (com toast)
   │                        │
   │                        ▼
   │                   [Erro] ──▶ Mantém na página (banner de erro)
   │
   └──▶ Cancelar ──▶ Detalhes da Meta (sem alterações)
```

### 3.4. Confirmações Necessárias

- **Mudança de meta pai**: Confirmar se existem submetas vinculadas
- **Arquivar meta**: Confirmar e informar que submetas/tarefas não serão excluídas
- **Troca de prioridade para ONE Thing**: Verificar se já existe outra ONE Thing no mesmo nível
- **Mudança de prazo para data passada**: Bloquear com erro

---

## 4. Especificação por Nível

### 4.1. Grandes Metas - Tema: Blue/Indigo (#4169E1)

#### Schema de Formulário: `grandeMetaEditSchema.ts`
```typescript
export const grandeMetaEditSchema = z.object({
  titulo: z.string().min(3).max(200),
  descricao: z.string().max(2000).nullable().optional(),
  area_id: z.string().uuid().nullable().optional(),
  prazo: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Prazo deve ser futuro',
  }),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']),
  smart_objetivo: z.string().max(500).nullable().optional(),
  smart_especifico: z.string().max(500).nullable().optional(),
  smart_mensuravel: z.string().max(500).nullable().optional(),
  smart_alcancavel: z.string().max(500).nullable().optional(),
  smart_relevante: z.string().max(500).nullable().optional(),
  smart_temporizado: z.string().max(500).nullable().optional(),
  status: z.enum(['ativa', 'concluida', 'arquivada']),
});
```

#### Campos do Wizard
- **Step 1**: Título, Descrição, Área de Vida, Prazo (1-5 anos)
- **Step 2**: Focusing Question, Prioridade, Info card "Topo da hierarquia" (sem pai)
- **Step 3**: SMART completo (6 campos), Review, Salvar

#### Validações Específicas
- Prazo máximo: 5 anos a partir de hoje
- Sem meta pai (sempre null)
- ONE Thing permitida sem pai (é o topo)

---

### 4.2. Metas Anuais - Tema: Indigo/Violet (#6366F1)

#### Schema de Formulário: `anualMetaEditSchema.ts`
```typescript
export const anualMetaEditSchema = z.object({
  titulo: z.string().min(3).max(200),
  descricao: z.string().max(2000).nullable().optional(),
  area_id: z.string().uuid().nullable().optional(),
  prazo: z.string().refine((date) => {
    const d = new Date(date);
    const max = new Date();
    max.setFullYear(max.getFullYear() + 1);
    return d > new Date() && d <= max;
  }, { message: 'Prazo deve ser entre hoje e 1 ano' }),
  parent_id: z.string().uuid().nullable().optional(),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']),
  smart_objetivo: z.string().max(500).nullable().optional(),
  smart_especifico: z.string().max(500).nullable().optional(),
  smart_mensuravel: z.string().max(500).nullable().optional(),
  smart_relevante: z.string().max(500).nullable().optional(),
  status: z.enum(['ativa', 'concluida', 'arquivada']),
});
```

#### Campos do Wizard
- **Step 1**: Título, Descrição, Área de Vida, Prazo (até 1 ano)
- **Step 2**: Focusing Question, Prioridade, Meta Pai (Grandes Metas), Hierarchy Tree
- **Step 3**: SMART completo (4 campos), Review, Salvar

#### Validações Específicas
- Prazo máximo: 1 ano
- Meta pai: Grandes Metas (dropdown filtrado)
- ONE Thing requer meta pai

---

### 4.3. Metas Mensais - Tema: Emerald/Teal (#10B981)

#### Schema de Formulário: `mensalMetaEditSchema.ts`
```typescript
export const mensalMetaEditSchema = z.object({
  titulo: z.string().min(3).max(200),
  descricao: z.string().max(2000).nullable().optional(),
  area_id: z.string().uuid().nullable().optional(),
  prazo: z.string().refine((date) => {
    const d = new Date(date);
    const max = new Date();
    max.setMonth(max.getMonth() + 1);
    return d > new Date() && d <= max;
  }, { message: 'Prazo deve ser entre hoje e 1 mês' }),
  parent_id: z.string().uuid().nullable().optional(),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']),
  smart_objetivo: z.string().max(500).nullable().optional(),
  smart_especifico: z.string().max(500).nullable().optional(),
  status: z.enum(['ativa', 'concluida', 'arquivada']),
});
```

#### Campos do Wizard
- **Step 1**: Título, Descrição, Área de Vida, Prazo (até 1 mês)
- **Step 2**: Focusing Question, Prioridade, Meta Pai (Anuais), Hierarchy Tree
- **Step 3**: SMART simplificado (2 campos), Review, Salvar

#### Validações Específicas
- Prazo máximo: 1 mês
- Meta pai: Anuais
- SMART reduzido (objetivo + específico)

---

### 4.4. Metas Semanais - Tema: Amber/Orange (#F59E0B)

#### Schema de Formulário: `semanalMetaEditSchema.ts`
```typescript
export const semanalMetaEditSchema = z.object({
  titulo: z.string().min(3).max(200),
  descricao: z.string().max(2000).nullable().optional(),
  area_id: z.string().uuid().nullable().optional(),
  prazo: z.string().refine((date) => {
    const d = new Date(date);
    const max = new Date();
    max.setDate(max.getDate() + 7);
    return d > new Date() && d <= max;
  }, { message: 'Prazo deve ser entre hoje e 1 semana' }),
  parent_id: z.string().uuid().nullable().optional(),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']),
  smart_objetivo: z.string().max(500).nullable().optional(),
  status: z.enum(['ativa', 'concluida', 'arquivada']),
});
```

#### Campos do Wizard
- **Step 1**: Título, Descrição, Área de Vida, Prazo (até 1 semana)
- **Step 2**: Focusing Question, Prioridade, Meta Pai (Mensais), Hierarchy Tree
- **Step 3**: SMART mínimo (1 campo), Review, Salvar

#### Validações Específicas
- Prazo máximo: 1 semana
- Meta pai: Mensais

---

### 4.5. Metas Diárias - Tema: Rose/Pink (#EC4899)

#### Schema de Formulário: `diariaMetaEditSchema.ts`
```typescript
export const diariaMetaEditSchema = z.object({
  titulo: z.string().min(3).max(200),
  descricao: z.string().max(2000).nullable().optional(),
  area_id: z.string().uuid().nullable().optional(),
  prazo: z.string(), // Sempre hoje, readonly
  parent_id: z.string().uuid({ message: 'Meta diária deve ter uma meta pai' }),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']),
  bloco: z.enum(['manha', 'tarde', 'noite', 'one-thing']).nullable().optional(),
  smart_objetivo: z.string().max(500).nullable().optional(),
  status: z.enum(['ativa', 'concluida', 'arquivada']),
});
```

#### Campos do Wizard
- **Step 1**: Título, Descrição, Área de Vida, Data de hoje (readonly)
- **Step 2**: Focusing Question, Prioridade, Meta Pai (Semanais - obrigatório), Bloco do Dia
- **Step 3**: Checklist rápido, Review, Salvar

#### Validações Específicas
- Prazo fixo: hoje
- Meta pai: Semanais (obrigatório)
- Bloco do dia: Manhã/Tarde/Noite/ONE Thing

---

## 5. Componentes Necessários

### 5.1. Reutilizar (Já Existem)

| Componente | Localização | Uso |
|------------|------------|-----|
| `MetaWizardStepIndicator` | `src/app/components/metas/` | Stepper visual |
| `MetaPreviewCard` | `src/app/components/metas/` | Preview lateral |
| `AreaVidaSelector` | `src/app/components/metas/` | Grid de áreas |
| `SmartFields` | `src/app/pages/metas/components/` | Campos SMART expandível |
| `MetaParentSelector` | `src/app/pages/metas/components/` | Seleção de meta pai |
| `HierarchyTreePreview` | `src/app/pages/metas/components/` | Visualização hierárquica |
| `PrioritySelector` | `src/app/pages/metas/components/` | Seleção de prioridade (atualizar) |

### 5.2. Modificar/Atualizar

#### `PrioritySelector` - Atualização Necessária
- **Problema**: Atual usa cores fixas (slate/yellow/red) e não integra com tema
- **Melhoria**: Receber `themeColor` como prop e aplicar ao card selecionado
- **Interface**:
```typescript
interface PrioritySelectorProps {
  value: Prioridade;
  onChange: (value: Prioridade) => void;
  themeColor?: string; // NOVO
}
```

#### `MetaParentSelector` - Atualização Necessária
- **Problema**: Mostra "(Opcional)" no título, mas para alguns níveis é obrigatório
- **Melhoria**: Adicionar prop `required?: boolean`
- **Interface**:
```typescript
interface MetaParentSelectorProps {
  nivel: MetaNivel;
  onSelect: (metaId: string | null) => void;
  selectedId?: string;
  required?: boolean; // NOVO
  themeColor?: string; // NOVO
}
```

#### `SmartFields` - Atualização Necessária
- **Problema**: Duplicação de nomes de campos (ex: smart_mensuravel aparece 2x em anual)
- **Melhoria**: Corrigir configuração dos campos e adicionar suporte a tema
- **Interface**:
```typescript
interface SmartFieldsProps {
  nivel: MetaNivel;
  themeColor?: string; // NOVO
}
```

### 5.3. Criar Novos

#### `MetaEditPageWrapper` - Componente Genérico
- **Propósito**: Wrapper que orquestra o wizard e reutiliza lógica comum
- **Props**:
```typescript
interface MetaEditPageWrapperProps {
  nivel: MetaNivel;
  theme: MetaTheme;
  schema: z.ZodSchema;
  steps: EditStep[];
  defaultValues: Record<string, unknown>;
}
```

#### `ImpactReviewCard` - Novo
- **Propósito**: Mostrar impacto da edição (submetas/tarefas afetadas)
- **Props**:
```typescript
interface ImpactReviewCardProps {
  metaId: string;
  submetasCount: number;
  tarefasCount: number;
  themeColor: string;
}
```

#### `BlocoDiaSelector` - Novo (Diárias)
- **Propósito**: Selecionar bloco do dia com ícones
- **Props**:
```typescript
interface BlocoDiaSelectorProps {
  value: 'manha' | 'tarde' | 'noite' | 'one-thing' | null;
  onChange: (value: string | null) => void;
}
```

#### `QuickDateButtons` - Novo
- **Propósito**: Botões de atalho para prazo (30d, 60d, etc.)
- **Props**:
```typescript
interface QuickDateButtonsProps {
  nivel: MetaNivel;
  onSelect: (date: string) => void;
  themeColor: string;
}
```

---

## 6. Recomendações Visuais

### 6.1. Paleta por Nível

| Nível | Cor Primária | Gradiente | Emoji | BG Claro |
|-------|-------------|-----------|-------|----------|
| Grande | `#4169E1` | `from-blue-600 to-indigo-700` | 🏔️ | `bg-blue-50` |
| Anual | `#6366F1` | `from-indigo-500 to-violet-600` | 📅 | `bg-indigo-50` |
| Mensal | `#10B981` | `from-emerald-500 to-teal-600` | 📊 | `bg-emerald-50` |
| Semanal | `#F59E0B` | `from-amber-500 to-orange-600` | 📆 | `bg-amber-50` |
| Diária | `#EC4899` | `from-rose-500 to-pink-600` | ☀️ | `bg-rose-50` |

> **Regra de Ouro**: NÃO USAR ROXO (Purple Ban ✅) - O sistema já usa índigo/violet que é aceitável, mas evitar purple puro (#8B5CF6, #A855F7).

### 6.2. Espaçamentos e Grid

- **Container**: `max-w-6xl mx-auto p-4 lg:p-8`
- **Grid Desktop**: `lg:grid-cols-2 gap-8`
- **Grid Mobile**: Single column, stack vertical
- **Card padding**: `p-6 lg:p-8`
- **Section spacing**: `space-y-6`
- **Input spacing**: `gap-4`
- **8-point grid**: Todos os espaçamentos múltiplos de 8px

### 6.3. Tipografia

| Elemento | Fonte | Tamanho | Peso |
|----------|-------|---------|------|
| Título da página | System UI | 3xl/4xl | Bold (700) |
| Step title | System UI | xl | Bold (700) |
| Form labels | System UI | sm | Semibold (600) |
| Input text | System UI | base | Normal (400) |
| Preview title | System UI | lg | Bold (700) |
| Tips text | System UI | sm | Normal (400) |

### 6.4. Ícones (Lucide React)

| Contexto | Ícone | Uso |
|----------|-------|-----|
| Título | `Target` | Input de título |
| Descrição | `AlignLeft` | Textarea |
| Prazo | `Calendar` | Date picker |
| Área | `LayoutGrid` | Área de vida |
| ONE Thing | `Star` | Badge prioridade |
| Prioridade | `Flame` | Prioridade alta |
| Meta Pai | `GitBranch` | Seletor de pai |
| Hierarquia | `TreePine` | Tree preview |
| SMART | `Lightbulb` | Campos SMART |
| Salvar | `Check` | Botão salvar |
| Voltar | `ChevronLeft` | Navegação |
| Continuar | `ArrowRight` | Navegação |
| Impacto | `AlertTriangle` | Review |
| Bloco manhã | `Sunrise` | Diária |
| Bloco tarde | `Sun` | Diária |
| Bloco noite | `Moon` | Diária |

### 6.5. Animações (Framer Motion)

```typescript
// Animação de entrada do card
const cardAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 300, damping: 30 }
};

// Animação de transição entre steps
const stepTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3 }
};

// Animação do stepper
const stepperAnimation = {
  scale: currentStep === step ? 1.1 : 1,
  transition: { type: 'spring', stiffness: 300, damping: 20 }
};

// Animação do preview
const previewAnimation = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { delay: 0.2, type: 'spring' }
};
```

### 6.6. Estados de Validação

```typescript
// Input não tocado
border-slate-200;

// Input válido (tocado e preenchido)
border-emerald-400 + ícone emerald;

// Input inválido
border-rose-400 + mensagem de erro + ícone rose;

// Input em foco
border-{themeColor} + ring-{themeColor}/20;
```

### 6.7. Responsividade (Mobile-First)

```css
/* Base (Mobile) */
.container: w-full p-4;
.grid: grid-cols-1;
.preview: hidden;
.stepper: w-full;

/* Desktop (lg: 1024px+) */
@screen lg {
  .container: max-w-6xl p-8;
  .grid: lg:grid-cols-2;
  .preview: block;
}
```

### 6.8. Acessibilidade

- **Keyboard navigation**: Tab order lógico, Enter para avançar steps
- **ARIA labels**: Todos os inputs com labels associados
- **Focus indicators**: Outline visível em todos os elementos interativos
- **Error announcements**: Erros anunciados por screen readers
- **Color contrast**: WCAG AA minimum (4.5:1 para texto normal)
- **Reduced motion**: Respeitar `prefers-reduced-motion`

---

## 7. Estrutura de Arquivos Proposta

```
src/app/pages/metas/
├── edit/
│   ├── GrandeMetaEditPage.tsx      # Edição de Grandes Metas
│   ├── MetaAnualEditPage.tsx       # Edição de Anuais
│   ├── MetaMensalEditPage.tsx      # Edição de Mensais
│   ├── MetaSemanalEditPage.tsx     # Edição de Semanais
│   ├── MetaDiariaEditPage.tsx      # Edição de Diárias
│   └── components/
│       ├── MetaEditWrapper.tsx     # Wrapper genérico do wizard
│       ├── ImpactReviewCard.tsx    # Card de impacto
│       ├── QuickDateButtons.tsx    # Botões de atalho de data
│       └── BlocoDiaSelector.tsx    # Seletor de bloco (diárias)
├── schemas/
│   ├── grandeMetaEditSchema.ts     # Schema Zod Grande Meta
│   ├── anualMetaEditSchema.ts      # Schema Zod Anual
│   ├── mensalMetaEditSchema.ts     # Schema Zod Mensal
│   ├── semanalMetaEditSchema.ts    # Schema Zod Semanal
│   └── diariaMetaEditSchema.ts     # Schema Zod Diária
├── components/                      # Já existem (reutilizar)
│   ├── SmartFields.tsx             # [ATUALIZAR] Adicionar tema
│   ├── MetaParentSelector.tsx      # [ATUALIZAR] Adicionar required/theme
│   ├── HierarchyTreePreview.tsx    # [REUTILIZAR]
│   └── PrioritySelector.tsx        # [ATUALIZAR] Adicionar tema
└── [ARQUIVOS LEGADOS]
    ├── MetaEditPage.tsx            # [DEPRECAR] Substituir por páginas específicas
    └── MetaCreatePage.tsx          # [DEPRECAR] Redirecionar para criar específica
```

---

## 8. Checklist de Implementação

### Phase 1: Foundation
- [ ] Criar schemas de edição por nível (`*EditSchema.ts`)
- [ ] Criar componentes genéricos (`MetaEditWrapper`, `ImpactReviewCard`)
- [ ] Atualizar componentes existentes (`PrioritySelector`, `MetaParentSelector`, `SmartFields`)

### Phase 2: Edição por Nível
- [ ] Implementar `GrandeMetaEditPage.tsx`
- [ ] Implementar `MetaAnualEditPage.tsx`
- [ ] Implementar `MetaMensalEditPage.tsx`
- [ ] Implementar `MetaSemanalEditPage.tsx`
- [ ] Implementar `MetaDiariaEditPage.tsx`

### Phase 3: Integração
- [ ] Atualizar rotas no router para usar novas páginas de edição
- [ ] Deprecar `MetaEditPage.tsx` (redirecionar para nova rota)
- [ ] Atualizar links de edição em `MetaDetailPage.tsx`
- [ ] Atualizar links de edição nos cards de lista

### Phase 4: Polish
- [ ] Testar responsividade mobile
- [ ] Verificar acessibilidade (keyboard, screen reader)
- [ ] Validar animações com `prefers-reduced-motion`
- [ ] Testar fluxos de erro (validação, API)
- [ ] Verificar consistência visual entre todos os níveis

---

## 9. Notas Técnicas

### 9.1. Compatibilidade com Schema do Supabase

O schema do banco possui os seguintes campos que DEVEM ser suportados:
- `titulo`, `descricao`, `status`, `nivel` (obrigatórios)
- `area_id`, `parent_id`, `prazo`, `focusing_question` (opcionais)
- `one_thing` (booleano - derivado de `prioridade === 'one_thing'`)
- `smart_objetivo`, `smart_especifico`, `smart_mensuravel`, `smart_alcancavel`, `smart_relevante`, `smart_temporizado` (opcionais)
- `metricas` (JSON - não editado diretamente nas telas)
- `created_at`, `updated_at` (automáticos)

### 9.2. Lógica de Conversão Prioridade ↔ One Thing

```typescript
// Ao salvar
const one_thing = prioridade === 'one_thing';

// Ao carregar
const prioridade = meta.one_thing ? 'one_thing' : meta.prioridade || 'normal';
```

### 9.3. Regras de Navegação

- **Edição sem alterar nível**: Redirecionar para detalhes do mesmo nível
- **Edição alterando pai**: Atualizar hierarchy preview em tempo real
- **Cancelar**: Voltar para detalhes sem salvar
- **Sucesso**: Invalidar cache do React Query / recarregar metas

### 9.4. Performance

- **Lazy load**: Carregar meta pai e ancestrais apenas no step 2
- **Debounced preview**: Atualizar preview com debounce de 300ms
- **Memoização**: Memoizar componentes de preview para evitar re-renders

---

## 10. Exemplo de Uso do Wrapper

```typescript
// GrandeMetaEditPage.tsx
import { MetaEditWrapper } from './components/MetaEditWrapper';
import { grandeMetaEditSchema } from '../schemas/grandeMetaEditSchema';

const THEME = {
  primary: '#4169E1',
  gradient: 'from-blue-600 to-indigo-700',
  bg: 'bg-blue-50',
  text: 'text-blue-700',
  emoji: '🏔️',
  lightGradient: 'from-slate-50 to-blue-50/30',
};

export default function GrandeMetaEditPage() {
  return (
    <MetaEditWrapper
      nivel="grande"
      theme={THEME}
      schema={grandeMetaEditSchema}
      steps={[
        { id: 1, label: 'Essenciais', fields: ['titulo', 'descricao', 'area_id', 'prazo'] },
        { id: 2, label: 'ONE Thing & Foco', fields: ['focusing_question', 'prioridade'] },
        { id: 3, label: 'Framework & Review', fields: ['smart_*'] },
      ]}
      hasParent={false}
      prazoConfig={{ maxYears: 5, defaultYears: 3 }}
    />
  );
}
```

---

**Documento version**: 1.0
**Última atualização**: 2026-04-27
**Autor**: Frontend Architect AI
**Status**: Especificação Completa - Pronto para Implementação
