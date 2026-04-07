# SPEC - Sistema de Criação de Metas Moderno

**Versão:** 1.0  
**Data:** 2026-04-06  
**Arquivo:** `tracking/specs/SPEC-Sprint-02-Metas-Moderno.md`  
**Responsável:** @vibe-planner

---

## 1. Visão Geral

### Objetivo
Substituir a página genérica de criação de metas (`MetaCreatePage.tsx`) por 5 páginas específicas para cada nível hierárquico (Grande, Anual, Mensal, Semanal, Diária), implementando uma experiência moderna com seleção por cards, visualização de hierarquia em árvore e seletor visual de prioridade.

### Motivação
- Eliminar a dependência de dropdowns simples para seleção de meta pai
- Proporcionar feedback visual claro da hierarquia durante a criação
- Oferecer campos específicos e relevantes para cada nível
- Melhorar a experiência do usuário (UX) com interface mais moderna e intuitiva

### Escopo
- Criação de 5 novas páginas de criação de metas
- Criação de componentes reutilizáveis para seleção de pai, visualização de hierarquia e prioridade
- Atualização das rotas para apontar para as novas páginas
- Manutenção das páginas existentes (listas, detalhes, edição) inalteradas

---

## 2. Histórias de Usuário

### HU-001: Criar Grande Meta Independente
**Como** usuário,  
**eu quero** criar uma Grande Meta sem vinculá-la a uma meta pai,  
**para** definir objetivos de longo prazo (3 anos) sem restrição hierárquica.

**Critérios de Aceite:**
- Página acessível via `/metas/grandes/criar`
- Campos disponíveis: Título, Área, Descrição, Prazo (3 anos), Focusing Question, Prioridade, Campos SMART
- Após criação, redireciona para lista de Grandes Metas

### HU-002: Criar Meta Anual Vinculada a Grande Meta
**Como** usuário,  
**eu quero** selecionar uma Grande Meta existente como pai ao criar uma Meta Anual,  
**para** manter a rastreabilidade hierarchical dos objetivos.

**Critérios de Aceite:**
- Seleção de meta pai via cards clicáveis (não dropdown)
- Tree preview atualiza em tempo real mostrando a hierarquia
- Campos disponíveis: Todos os campos de Grande Meta + Prazo (1 ano) + Meta Pai

### HU-003: Criar Meta Mensal a partir de Contexto
**Como** usuário visualizando uma Meta Anual,
**eu quero** criar uma Meta Mensal "filha" automaticamente selecionada,
**para** não precisar buscar manualmente a meta pai.

**Critérios de Aceite:**
- Botão "Criar Meta Filha" na página de detalhe pré-seleciona o pai
- Tree preview mostra: "G: [Nome] → A: [Nome]"

### HU-004: Criar Meta Semanal a partir de Mensal
**Como** usuário,  
**eu quero** criar uma Meta Semanal vinculada a uma Meta Mensal específica,  
**para** decompor objetivos mensais em ações semanais.

**Critérios de Aceite:**
- Seleção de meta pai (Mensal) via cards
- Tree preview atualiza corretamente

### HU-005: Criar Meta Diária com ONE Thing
**Como** usuário,  
**eu quero** definir uma Meta Diária como ONE Thing,  
**para** identificar minha prioridade absoluta do dia.

**Critérios de Aceite:**
- Seletor visual de prioridade com 3 opções: Normal, Prioritária, ONE Thing
- Badge visual distinto para cada nível de prioridade
- Pode ser definido em qualquer nível hierárquico

### HU-006: Fluxo Híbrido - Criar Anual a partir de Mensal
**Como** usuário,
**eu quero** criar uma nova Meta Anual escolhendo uma das metas anuais disponíveis como pai,
**para** mesmopartindo de uma página Mensal, poder criar em outro nível hierárquico.

**Critérios de Aceite:**
- Ao criar a partir de uma Meta Mensal, usuário pode escolher criar Meta Semanal (filha da atual) OU navegar para criar Meta Anual (pai da atual, precisa selecionar entre as disponíveis)

---

## 3. Fluxos de Criação

### Fluxo 1: Criação Direta
```
Usuário → Lista de Metas → Botão "Criar" → Página de Criação Específica → Preencher → Salvar → Lista
```

### Fluxo 2: Criação a Partir de Detalhe
```
Usuário → Detalhe de Meta → Botão "Criar Meta Filha" → Página de Criação (pai pré-selecionado) → Preencher → Salvar → Detalhe do Pai
```

### Fluxo 3: Navegação entre Níveis
```
Usuário → Criar Meta Semanal a partir de Mensal
       → Pode escolher criar Semanal (filha) OU
       → Pode navegar para criar Anual (pai da atual)
```

---

## 4. Especificação de Componentes

### 4.1 MetaParentSelector.tsx

**Descrição:** Componente de seleção de meta pai utilizando cards clicáveis em vez de dropdown.

**Props:**
```typescript
interface MetaParentSelectorProps {
  nivel: MetaNivel;           // Nível da meta que está sendo criada
  onSelect: (meta: Meta) => void;  // Callback ao selecionar
  selectedId?: string;        // ID pré-selecionado
}
```

** comportamento:**
- Busca metas do nível pai adequado (ex: para Anual, busca Grandes Metas)
- Exibe cards com título, área e status
- Card selecionado recebe borda/background distinto
- Empty state: "Nenhuma meta disponível. Deseja criar uma primeiro?"

**Interface Visual:**
```
┌─────────────────────────────────────────┐
│  Selecione a Meta Pai (Opcional)        │
├─────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐      │
│  │  Card 1     │  │  Card 2     │      │
│  │  Título     │  │  Título     │      │
│  │  Área       │  │  Área       │      │
│  └─────────────┘  └─────────────┘      │
│                                         │
│  [ + Criar Nova Meta Pai ]              │
└─────────────────────────────────────────┘
```

### 4.2 HierarchyTreePreview.tsx

**Descrição:** Visualização em árvore da relação hierárquica pai→filho.

**Props:**
```typescript
interface HierarchyTreePreviewProps {
  ancestors: Meta[];  // Array de metas ancestrais (G → A → M → S)
  currentLevel: MetaNivel;
}
```

**Interface Visual:**
```
G: Projeto Principal → A: Projeto X → M: [Nova Meta Mensal]
```
- Itens clicáveis para navegar até a meta pai
- O item atual destacado visualmente

### 4.3 PrioritySelector.tsx

**Descrição:** Seletor visual de prioridade/ONE Thing.

**Props:**
```typescript
interface PrioritySelectorProps {
  value: 'normal' | 'prioritaria' | 'one_thing';
  onChange: (value: 'normal' | 'prioritaria' | 'one_thing') => void;
}
```

**Interface Visual:**
```
┌────────────┐ ┌────────────┐ ┌────────────────────┐
│   Normal   │ │ Prioritária│ │    ONE Thing       │
│  (Cinza)   │ │  (Amarelo) │ │     (Vermelho)     │
└────────────┘ └────────────┘ └────────────────────┘
```
- Radio button customizado com cores e ícones
- Tooltip explicando cada opção

### 4.4 SmartFields.tsx

**Descrição:** Campos SMART específicos para cada nível.

**Props:**
```typescript
interface SmartFieldsProps {
  nivel: MetaNivel;
  register: UseFormRegister<MetaFormSchema>;
  errors: FieldErrors<MetaFormSchema>;
}
```

**Campos por Nível:**

| Nível | Campos SMART |
|-------|-------------|
| Grande | `smart_objetivo` (Objetivo), `smart_iniciativa` (Iniciativa Principal) |
| Anual | `smart_kpi` (KPI Principal), `smart_resultado` (Resultado-Chave) |
| Mensal | `smart_meta` (Meta do Mês), `smart_tarefa` (Tarefa Crítica) |
| Semanal | `smart_entrega` (Entrega), `smart_acao` (Ação Prioritária) |
| Diária | `smart_checklist` (Checklist de tarefas) |

---

## 5. Especificação de Campos por Nível

### 5.1 GrandeMetaCreatePage

| Campo | Tipo | Obrigatório | Validação | Padrão |
|-------|------|-------------|-----------|--------|
| `titulo` | string | Sim | min 3 chars, max 200 | - |
| `area_id` | uuid | Não | deve existir em areas | null |
| `descricao` | text | Não | max 2000 chars | null |
| `prazo` | date | Sim | data futura, até 3 anos | hoje + 3 anos |
| `focusing_question` | string | Não | max 300 chars | null |
| `prioridade` | enum | Não | normal/prioritaria/one_thing | normal |
| `smart_objetivo` | string | Não | max 500 chars | null |
| `smart_iniciativa` | string | Não | max 500 chars | null |

### 5.2 MetaAnualCreatePage

| Campo | Tipo | Obrigatório | Validação | Padrão |
|-------|------|-------------|-----------|--------|
| `titulo` | string | Sim | min 3 chars, max 200 | - |
| `area_id` | uuid | Não | deve existir em areas | null |
| `descricao` | text | Não | max 2000 chars | null |
| `prazo` | date | Sim | data futura, até 1 ano | hoje + 1 ano |
| `parent_id` | uuid | Condicional | deve ser nível Grande | null |
| `focusing_question` | string | Não | max 300 chars | null |
| `prioridade` | enum | Não | normal/prioritaria/one_thing | normal |
| `smart_kpi` | string | Não | max 100 chars | null |
| `smart_resultado` | string | Não | max 500 chars | null |

### 5.3 MetaMensalCreatePage

| Campo | Tipo | Obrigatório | Validação | Padrão |
|-------|------|-------------|-----------|--------|
| `titulo` | string | Sim | min 3 chars, max 200 | - |
| `area_id` | uuid | Não | deve existir em areas | null |
| `descricao` | text | Não | max 2000 chars | null |
| `prazo` | date | Sim | data futura, até 1 mês | hoje + 1 mês |
| `parent_id` | uuid | Condicional | deve ser nível Anual | null |
| `focusing_question` | string | Não | max 300 chars | null |
| `prioridade` | enum | Não | normal/prioritaria/one_thing | normal |
| `smart_meta` | string | Não | max 200 chars | null |
| `smart_tarefa` | string | Não | max 500 chars | null |

### 5.4 MetaSemanalCreatePage

| Campo | Tipo | Obrigatório | Validação | Padrão |
|-------|------|-------------|-----------|--------|
| `titulo` | string | Sim | min 3 chars, max 200 | - |
| `area_id` | uuid | Não | deve existir em areas | null |
| `descricao` | text | Não | max 2000 chars | null |
| `parent_id` | uuid | Condicional | deve ser nível Mensal | null |
| `focusing_question` | string | Não | max 300 chars | null |
| `prioridade` | enum | Não | normal/prioritaria/one_thing | normal |
| `smart_entrega` | string | Não | max 500 chars | null |
| `smart_acao` | string | Não | max 500 chars | null |

### 5.5 MetaDiariaCreatePage

| Campo | Tipo | Obrigatório | Validação | Padrão |
|-------|------|-------------|-----------|--------|
| `titulo` | string | Sim | min 3 chars, max 200 | - |
| `descricao` | text | Não | max 2000 chars | null |
| `parent_id` | uuid | Condicional | deve ser nível Semanal | null |
| `prioridade` | enum | Sim | normal/prioritaria/one_thing | normal |
| `smart_checklist` | json | Não | array de strings | [] |

---

## 6. Arquitetura de Dados

### 6.1 Schema Zod

Cada página terá seu schema específico. Exemplo para `GrandeMetaCreatePage`:

```typescript
// src/app/pages/metas/schemas/grandeMetaSchema.ts
import { z } from 'zod';

export const grandeMetaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200),
  area_id: z.string().uuid().nullable().optional(),
  descricao: z.string().max(2000).nullable().optional(),
  prazo: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Prazo deve ser uma data futura',
  }),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']).default('normal'),
  smart_objetivo: z.string().max(500).nullable().optional(),
  smart_iniciativa: z.string().max(500).nullable().optional(),
});

export type GrandeMetaFormSchema = z.infer<typeof grandeMetaSchema>;
```

### 6.2 Tipos TypeScript

```typescript
// src/app/pages/metas/types.ts
export type MetaNivel = 'grande' | 'anual' | 'mensal' | 'semanal' | 'diaria';

export type Prioridade = 'normal' | 'prioritaria' | 'one_thing';

export interface Meta {
  id: string;
  user_id: string;
  area_id: string | null;
  parent_id: string | null;
  nivel: MetaNivel;
  titulo: string;
  descricao: string | null;
  status: 'ativa' | 'concluida' | 'arquivada';
  one_thing: boolean;
  prioridade?: Prioridade;
  focusing_question: string | null;
  // Campos SMART
  smart_objetivo?: string;
  smart_iniciativa?: string;
  smart_kpi?: string;
  smart_resultado?: string;
  smart_meta?: string;
  smart_tarefa?: string;
  smart_entrega?: string;
  smart_acao?: string;
  smart_checklist?: string[];
  // Timestamps
  created_at: string;
  updated_at: string;
}
```

---

## 7. Camada de Serviço (metasService)

### 7.1 Métodos a Adicionar

```typescript
// src/services/metasService.ts

// Buscar metas por nível pai (para o seletor de cards)
async function getMetasByNivel(userId: string, nivel: MetaNivel): Promise<Meta[]>

// Buscar ancestors de uma meta (para tree preview)
async function getMetaAncestors(metaId: string): Promise<Meta[]>

// Criar meta com validação de hierarquia
async function createMetaWithValidation(
  userId: string, 
  meta: CreateMetaInput
): Promise<Meta>
```

### 7.2 Validações de Negócio

1. **Validação de Hierarquia:**
   - Meta Anual só pode ter pai do nível Grande
   - Meta Mensal só pode ter pai do nível Anual
   - Meta Semanal só pode ter pai do nível Mensal
   - Meta Diária só pode ter pai do nível Semanal

2. **Validação deONE Thing:**
   - Uma meta pode serONE Thing independente de ter pai
   - O sistema não impede múltiplas metasONE Thing no mesmo nível (apenas orienta)

---

## 8. Rotas

### 8.1 Novas Rotas a Adicionar

Adicionar em `src/app/routes.ts`:

```typescript
// Rotas de criação específicas
'/metas/grandes/criar': GrandeMetaCreatePage,
'/metas/anuais/criar': MetaAnualCreatePage,
'/metas/mensais/criar': MetaMensalCreatePage,
'/metas/semanais/criar': MetaSemanalCreatePage,
'/metas/diarias/criar': MetaDiariaCreatePage,

// Rotas com parâmetro de pai (criar filha de uma meta específica)
// Ex: /metas/anuais/criar?pai=uuid-da-grande-meta
'/metas/anuais/criar': MetaAnualCreatePage, // com query param
'/metas/mensais/criar': MetaMensalCreatePage,
'/metas/semanais/criar': MetaSemanalCreatePage,
'/metas/diarias/criar': MetaDiariaCreatePage,
```

### 8.2 Atualização de Links

As páginas de lista devem ter seus botões "Criar" atualizados:

```typescript
// Antes (GrandesMetasPage)
<Link to="/metas/criar?grand">Criar Grande Meta</Link>

// Depois
<Link to="/metas/grandes/criar">Criar Grande Meta</Link>
```

Os botões "Criar Meta Filha" nas páginas de detalhe mantêm a lógica atual (pré-selecionar pai via query param).

---

## 9.wireframes e Interface Visual

### 9.1 Layout Base da Página de Criação

```
┌────────────────────────────────────────────────────────────────┐
│  ◀ Voltar                    Criar Meta [Nível]                │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Passo 1 de 3: Informações Básicas                        │  │
│  │  ═══════════════════════                                     │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Hierarquia: G: Projeto X → A: [Nova]                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Título *                                                 │  │
│  │  [Digite o título da meta...]                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────┐  ┌────────────────────────────┐ │
│  │  Selecione a Área        │  │  Descrição                 │ │
│  │  [Dropdown]             │  │  [Textarea]                │ │
│  └──────────────────────────┘  └────────────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Meta Pai (Opcional)                                     │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐            │  │
│  │  │  Card 1    │ │  Card 2    │ │ + Criar    │            │  │
│  │  │  Título    │ │  Título    │ │  Nova      │            │  │
│  │  └────────────┘ └────────────┘ └────────────┘            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Prioridade                                              │  │
│  │  (○) Normal  ( ) Prioritária  ( ) ONE Thing             │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Campos SMART (Opcional)                                │  │
│  │  [Colapsável]                                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                │
│                              [Cancelar]  [Criar Meta]          │
└────────────────────────────────────────────────────────────────┘
```

### 9.2 Estados Visuais

**Card de Meta Pai:**
- Default: borda cinza clara, background transparente
- Hover: borda cinza, background cinza claro
- Selecionado: borda indigo, background indigo/10

**Seletor de Prioridade:**
- Normal: círculo cinza, texto cinza
- Prioritária: círculo amarelo, texto amarelo, ícone de estrela
- ONE Thing: círculo vermelho, texto vermelho, badge "ONE Thing"

---

## 10. Testes e Validação

### 10.1 Testes Unitários

1. **Schema Validation:**
   - Validar que cada schema rejeita dados inválidos
   - Validar que aceita dados válidos com todos os campos

2. **Component Rendering:**
   - MetaParentSelector renderiza cards corretamente quando há metas
   - MetaParentSelector mostra empty state quando não há metas
   - HierarchyTreePreview renderiza corretamente com ancestors

### 10.2 Testes de Integração

1. **Criação de Meta:**
   - Criar Grande Meta com todos os campos → verifica se salvou no banco
   - Criar Meta Anual vinculada a Grande → verifica parent_id

2. **Navegação:**
   - Clicar "Criar" na lista → abre página correta
   - Clicar "Criar Meta Filha" no detalhe → abre com pai pré-selecionado

### 10.3 Casos de Teste Manual

| ID | Cenário | Passos | Resultado Esperado |
|----|---------|--------|-------------------|
| TC-01 | Criar Grande Meta | /metas/grandes/criar → preencher → salvar | Meta aparece na lista |
| TC-02 | Criar Anual com pai | Detalhe G → Criar filha → salvar |parent_id = G.id |
| TC-03 | Tree preview | Selecionar pai na criação | Mostra "G: [titulo] → A: [nova]" |
| TC-04 |ONE Thing | Selecionar ONE Thing → salvar | one_thing = true |
| TC-05 | Campos SMART | Preencher campos SMART → salvar | Campos persistidos |
| TC-06 | Redirect | Após criar → salvar | Redireciona para lista correta |
| TC-07 | Validação | Criar sem título | Erro "Título é obrigatório" |

---

## 11. Critérios de Aceite Checklist

### Técnicos

- [ ] 5 novas páginas criadas em `src/app/pages/metas/`
- [ ] Schema Zod específico para cada nível
- [ ] Componente `MetaParentSelector.tsx` implementado
- [ ] Componente `HierarchyTreePreview.tsx` implementado
- [ ] Componente `PrioritySelector.tsx` implementado
- [ ] Componente `SmartFields.tsx` implementado
- [ ] Rotas atualizadas em `src/app/routes.ts`
- [ ] Campos específicos por nível implementados

### Funcionais

- [ ] Usuário consegue criar Grande Meta independente
- [ ] Usuário consegue criar meta filha a partir do detalhe
- [ ] Seleção de meta pai por cards (não dropdown)
- [ ] Tree preview atualiza em tempo real
- [ ] ONE Thing pode ser definido em qualquer nível
- [ ] Campos SMART disponíveis e opcionais

### UX

- [ ] Design moderno sem dropdowns simples
- [ ] Animações suaves
- [ ] Feedback visual de seleção
- [ ] Responsivo (mobile)
- [ ] Empty states amigáveis

### Validação

- [ ] Teste de criação com Chrome DevTools passando
- [ ] Sem erros no console
- [ ] Redirecionamento correto após criar

---

## 12. Dependências e Notas

### Dependências Existentes
- React 19 + TypeScript + Vite
- Supabase (banco de dados)
- React Hook Form + Zod (validação)
- shadcn/ui (componentes base)
- React Router (rotas)

### Notas de Implementação
1. **Performance:** Ao carregar o MetaParentSelector, usar `useMemo` para filtrar apenas metas do nível pai necessário
2. **Lazy Loading:** As páginas de criação podem usar lazy loading para melhorar performance inicial
3. **Cache:** Considerar cache local das metas para evitar múltiplas requisições durante navegação
4. **Mobile:** Cards do MetaParentSelector devem empilhar verticalmente em telas menores

### Pontos de Atenção
- Manter compatibilidade com dados existentes (não quebrar campos existentes)
- O campo `one_thing` existente no banco deve ser mapeado para o novo campo `prioridade`
- Ao editar uma meta existente, carregar valores atuais corretamente
