# SPEC-Modernizacao-Detalhes-Metas

## 1. Analise da Tela Atual — Problemas Identificados

### 1.1 Layout & Estrutura

| # | Problema | Impacto |
|---|----------|---------|
| 1 | **Header sem hierarquia visual** — titulo pequeno (`text-xl`), badges amontoados horizontalmente, sem destaque para o nivel da meta | Usuario nao identifica rapidamente o contexto da meta |
| 2 | **Cards soltos sem organizacao semantica** — Progresso, Informacoes, Submetas/Tarefas e Tarefas Vinculadas em grid de 2 colunas sem prioridade | Dificil escanear informacoes; falta hierarquia de conteudo |
| 3 | **Tarefas duplicadas** — Card "Submetas ou Tarefas" mostra tarefas para semanal, mas card "Tarefas Vinculadas" (`md:col-span-2`) tambem mostra tarefas | Conteudo redundante e confuso |
| 4 | **Ausencia de meta pai** — Nao ha indicacao de qual meta pai esta meta pertence | Perda de contexto hierarquico |
| 5 | **Grid rigido** — `md:grid-cols-2` sem considerar a prioridade do conteudo em mobile | Mobile-first nao respeitado |

### 1.2 UX & Interacao

| # | Problema | Impacto |
|---|----------|---------|
| 6 | **Progresso sem destaque** — Barra fina (`h-3`), sem animacao, numero pequeno, posicionado dentro de card generico | Progresso e um KPI principal e esta escondido |
| 7 | **Breadcrumb minimalista** — Sem indicador visual do nivel atual, apenas texto com link | Navegacao pouco intuitiva |
| 8 | **Botoes de acao sem hierarquia** — Editar, Excluir e Concluir todos em `variant="outline"` ou `default`, sem destaque para acao primaria | Usuario nao sabe qual acao e principal |
| 9 | **Checkboxes nativos** — `<input type="checkbox">` sem estilizacao, sem feedback visual | Baixa percepcao de interatividade |
| 10 | **Empty states genericos** — Apenas texto "Nenhuma tarefa vinculada" sem call-to-action visual | Oportunidade perdida de engajamento |
| 11 | **Sem estados de loading visual** — Apenas texto "Carregando..." | Experiencia pobre durante carregamento |
| 12 | **Links sem preview** — Submetas mostram apenas titulo, sem progresso ou contexto | Usuario nao tem visibilidade do estado das filhas |

### 1.3 Visual & Identidade

| # | Problema | Impacto |
|---|----------|---------|
| 13 | **Cores inconsistentes** — Progresso usa verde/azul/indigo sem relacao com o nivel da meta | Falta sistema de cor por nivel |
| 14 | **Badges sem identidade** — Area, status, ONE Thing e progresso usam todos `variant="outline"` | Dificil diferenciar categorias de informacao |
| 15 | **Sem emoji/icones por nivel** — Apenas texto para identificar o tipo de meta | Falta identidade visual e personalidade |
| 16 | **Tipografia plana** — Sem hierarquia tipografica clara, `text-sm` e `text-slate-500` para todos os labels | Conteudo parece monotono |
| 17 | **Sem animacoes** — Zero transicoes, zero motion, zero feedback visual | Sensacao de aplicativo estatico e datado |
| 18 | **Card de tarefas com bordas cruas** — `border rounded` sem refinamento, sem estados hover diferenciados | Visual inconsistente com design system |

---

## 2. Wireframe da Nova Tela

### 2.1 Desktop (>= 1024px)

```
+------------------------------------------------------------------------------------------+
|  <  Voltar para [Nivel Plural]                                                           |
+------------------------------------------------------------------------------------------+
|                                                                                          |
|  [emoji]  Titulo da Meta                                       [Status]  [Editar] [Excluir] [Concluir] |
|           Nivel da Meta | Area                                                              |
|                                                                                          |
+------------------------------------------------------------------------------------------+
|                                                                                          |
|   +----------------------------------------+    +-------------------------------------+  |
|   |                                        |    |  DESCRICAO                          |  |
|   |           [CIRCULO DE PROGRESSO]       |    |                                     |  |
|   |                                        |    |  Lorem ipsum dolor sit amet...      |  |
|   |              73%                       |    |                                     |  |
|   |                                        |    +-------------------------------------+  |
|   |   [xx] tarefas concluidas              |    +-------------------------------------+  |
|   |   de [yy] totais                       |    |  FOCUSING QUESTION                  |  |
|   |                                        |    |  "Qual e a UMA coisa...?"           |  |
|   +----------------------------------------+    +-------------------------------------+  |
|                                                                                          |
|   +----------------------------------------+    +-------------------------------------+  |
|   |  PRAZO                                 |    |  AREA DE VIDA                       |  |
|   |  15 de Janeiro de 2025                 |    |  [emoji] Nome da Area               |  |
|   |  [badge: em andamento]                 |    |                                     |  |
|   +----------------------------------------+    +-------------------------------------+  |
|                                                                                          |
+------------------------------------------------------------------------------------------+
|                                                                                          |
|  HIERARQUIA                                                                              |
|  +------------------------------------------------------------------------------------+  |
|  |  [seta] Meta Pai (Grande Meta)                                                      |  |
|  |                                                                                     |  |
|  |  +----------------------------------+  +----------------------------------+         |  |
|  |  |  [icone] Meta Filha 1            |  |  [icone] Meta Filha 2            |         |  |
|  |  |  Progresso: 45%                  |  |  Progresso: 80%                  |         |  |
|  |  +----------------------------------+  +----------------------------------+         |  |
|  |                                                                                     |  |
|  |  [+ Criar Nova Meta Filha]                                                          |  |
|  +------------------------------------------------------------------------------------+  |
|                                                                                          |
+------------------------------------------------------------------------------------------+
|                                                                                          |
|  TAREFAS (apenas para nivel semanal)                                                      |
|  +------------------------------------------------------------------------------------+  |
|  |  [x] Tarefa 1 concluida                                                            |  |
|  |  [ ] Tarefa 2 pendente                                                             |  |
|  |  [ ] Tarefa 3 pendente                                                             |  |
|  |                                                                                     |  |
|  |  [+ Adicionar Nova Tarefa]                                                         |  |
|  +------------------------------------------------------------------------------------+  |
|                                                                                          |
+------------------------------------------------------------------------------------------+
```

### 2.2 Mobile (< 768px)

```
+--------------------------+
| <  Voltar                |
+--------------------------+
|                          |
| [emoji]                  |
| Titulo da Meta           |
| Nivel | Area             |
| [Status]                 |
|                          |
| [Editar] [Excluir]       |
| [      Concluir       ]  |
|                          |
+--------------------------+
|                          |
|    [CIRCULO]             |
|      73%                 |
|                          |
| xx de yy tarefas         |
|                          |
+--------------------------+
| DESCRICAO                |
| Lorem ipsum...           |
+--------------------------+
| FOCUSING QUESTION        |
| "Qual e a UMA...?"       |
+--------------------------+
| PRAZO        | AREA      |
| 15/01/2025   | [icon] N  |
+--------------------------+
|                          |
| HIERARQUIA               |
| [seta] Meta Pai          |
|                          |
| [icon] Filha 1   45%     |
| [icon] Filha 2   80%     |
|                          |
| [+ Nova Filha]           |
+--------------------------+
|                          |
| TAREFAS                  |
| [x] Tarefa 1             |
| [ ] Tarefa 2             |
|                          |
| [+ Nova Tarefa]          |
+--------------------------+
```

---

## 3. Especificacao Visual Completa

### 3.1 Sistema de Cores por Nivel

| Nivel | Cor Primaria | Cor Classe Tailwind | Cor Fundo | Cor Texto | Emoji |
|-------|--------------|---------------------|-----------|-----------|-------|
| **Grandes** | Indigo | `indigo-600` | `indigo-50` | `indigo-900` | `\ud83c\udfaf` |
| **Anuais** | Violet | `violet-600` | `violet-50` | `violet-900` | `\ud83d\udcc5` |
| **Mensais** | Emerald | `emerald-600` | `emerald-50` | `emerald-900` | `\ud83d\udcc8` |
| **Semanais** | Amber | `amber-600` | `amber-50` | `amber-900` | `\u26a1` |
| **Diarias** | Rose | `rose-600` | `rose-50` | `rose-900` | `\u2705` |

**Regra:** Todo elemento de identidade (badge de nivel, anel do progresso, icones de acao primaria) usa a cor do nivel da meta atual.

### 3.2 Tipografia

| Elemento | Fonte | Tamanho | Peso | Cor |
|----------|-------|---------|------|-----|
| Titulo da Meta | System/Sans | `text-3xl` (mobile: `text-2xl`) | `font-bold` | `slate-900` |
| Nivel Badge | System/Sans | `text-xs` | `font-semibold` | cor do nivel |
| Progresso % | System/Sans | `text-5xl` (mobile: `text-4xl`) | `font-extrabold` | cor do nivel |
| Secao Header | System/Sans | `text-lg` | `font-semibold` | `slate-800` |
| Card Label | System/Sans | `text-sm` | `font-medium` | `slate-500` |
| Card Value | System/Sans | `text-base` | `font-normal` | `slate-800` |
| Focusing Question | System/Sans | `text-lg` | `font-medium` | `slate-700` italic |

### 3.3 Componentes

#### 3.3.1 Header Principal

```
<header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
  {/* Esquerda */}
  <div className="flex items-start gap-4">
    <div className="text-4xl">{nivelEmoji}</div>
    <div>
      <h1 className="text-3xl font-bold text-slate-900">{meta.titulo}</h1>
      <div className="flex flex-wrap items-center gap-2 mt-2">
        <Badge className="bg-{corNivel}-100 text-{corNivel}-700 border-{corNivel}-200">
          {nivelLabel}
        </Badge>
        {area && (
          <Badge variant="outline" className="text-slate-600">
            {area.emoji} {area.name}
          </Badge>
        )}
        {meta.one_thing && (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Star className="w-3 h-3 mr-1" /> ONE Thing
          </Badge>
        )}
      </div>
    </div>
  </div>

  {/* Direita — Acoes */}
  <div className="flex flex-wrap items-center gap-2">
    <Button variant="outline" size="sm" onClick={handleEditar}>
      <Edit className="w-4 h-4 mr-1" /> Editar
    </Button>
    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={handleDelete}>
      <Trash2 className="w-4 h-4 mr-1" /> Excluir
    </Button>
    <Button size="sm" className="bg-{corNivel}-600 hover:bg-{corNivel}-700" onClick={handleToggleStatus}>
      <CheckCircle className="w-4 h-4 mr-1" />
      {meta.status === 'ativa' ? 'Concluir Meta' : 'Reativar Meta'}
    </Button>
  </div>
</header>
```

#### 3.3.2 Circulo de Progresso Animado

**Especificacao:**
- Tipo: SVG circle com stroke-dasharray animado
- Tamanho: 160px (mobile: 120px)
- Stroke width: 12px
- Cor de fundo do circulo: `slate-100`
- Cor do progresso: cor do nivel (ex: `indigo-600`)
- Animacao: Framer Motion `animate={{ pathLength: progresso / 100 }}`
- Duracao: 1.2s, easing: `easeOut`
- Texto centralizado: porcentagem em `text-5xl font-extrabold`
- Subtexto: "X de Y tarefas concluidas" em `text-sm text-slate-500`

```tsx
// Estrutura do componente
<motion.div className="relative w-40 h-40">
  <svg viewBox="0 0 100 100" className="transform -rotate-90">
    {/* Circulo de fundo */}
    <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
    {/* Circulo de progresso */}
    <motion.circle
      cx="50" cy="50" r="42" fill="none"
      stroke="currentColor" strokeWidth="8"
      strokeLinecap="round"
      strokeDasharray={2 * Math.PI * 42}
      initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
      animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - progresso / 100) }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className={`text-${corNivel}-600`}
    />
  </svg>
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <motion.span
      className={`text-5xl font-extrabold text-${corNivel}-600`}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      {progresso}%
    </motion.span>
  </div>
</motion.div>
```

#### 3.3.3 Card de Informacao (Grid)

```
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Descricao */}
  <Card className="md:col-span-2">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
        <FileText className="w-4 h-4" /> Descricao
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-slate-800 leading-relaxed">{meta.descricao || "Sem descricao"}</p>
    </CardContent>
  </Card>

  {/* Focusing Question */}
  <Card className="md:col-span-2 bg-gradient-to-r from-slate-50 to-white border-l-4 border-l-{corNivel}-400">
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
        <HelpCircle className="w-4 h-4" /> Focusing Question
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-lg font-medium text-slate-700 italic">
        "{meta.focusing_question || "Sem focusing question definida"}"
      </p>
    </CardContent>
  </Card>

  {/* Prazo */}
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
        <Calendar className="w-4 h-4" /> Prazo / Data
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-slate-800 font-medium">
        {meta.data_limite
          ? new Date(meta.data_limite).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
          : "Sem prazo definido"
        }
      </p>
      {meta.data_limite && (
        <Badge variant="outline" className="mt-2 text-xs">
          {diasRestantes > 0 ? `${diasRestantes} dias restantes` : diasRestantes === 0 ? "Vence hoje" : `Atrasada em ${Math.abs(diasRestantes)} dias`}
        </Badge>
      )}
    </CardContent>
  </Card>

  {/* Area */}
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
        <LayoutGrid className="w-4 h-4" /> Area de Vida
      </CardTitle>
    </CardHeader>
    <CardContent>
      {area ? (
        <div className="flex items-center gap-3">
          <span className="text-2xl">{area.emoji}</span>
          <div>
            <p className="font-medium text-slate-800">{area.name}</p>
            {area.description && <p className="text-sm text-slate-500">{area.description}</p>}
          </div>
        </div>
      ) : (
        <p className="text-slate-500">Sem area definida</p>
      )}
    </CardContent>
  </Card>
</div>
```

#### 3.3.4 Secao de Hierarquia

**Para todos os niveis exceto Grandes:**

```
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <GitBranch className="w-5 h-5 text-slate-500" /> Hierarquia
    </CardTitle>
  </CardHeader>
  <CardContent className="space-y-4">
    {/* Meta Pai */}
    {metaPai && (
      <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
        <ArrowUp className="w-4 h-4 text-slate-400" />
        <span className="text-sm text-slate-500">Pertence a:</span>
        <Link to={`/metas/.../${metaPai.id}`} className="flex-1 font-medium text-slate-800 hover:text-{corNivel}-600">
          {nivelPaiEmoji} {metaPai.titulo}
        </Link>
        <Badge variant="outline" className="text-xs">{nivelPaiLabel}</Badge>
      </div>
    )}

    {/* Metas Filhas / Submetas */}
    {submetas.length > 0 && (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-slate-500 mb-2">
          {nivel === 'semanal' ? 'Tarefas' : `${submetas.length} meta(s) filha(s)`}
        </h4>
        {submetas.map((sub, index) => (
          <motion.div
            key={sub.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link to={`/metas/.../${sub.id}`}>
              <div className="flex items-center gap-3 p-3 rounded-lg border hover:border-{corNivel}-300 hover:bg-{corNivel}-50 transition-colors">
                {nivel === 'semanal' ? (
                  <Checkbox
                    checked={sub.completed}
                    onCheckedChange={() => handleToggleTarefa(sub.id)}
                    className="border-slate-300"
                  />
                ) : (
                  <Target className="w-4 h-4 text-{corNivel}-400" />
                )}
                <span className={`flex-1 ${sub.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                  {sub.titulo}
                </span>
                {nivel !== 'semanal' && (
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-{corFilha}-500 rounded-full"
                        style={{ width: `${sub.progresso}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">{sub.progresso}%</span>
                  </div>
                )}
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    )}

    {/* CTA */}
    <Button
      variant="outline"
      className="w-full border-dashed border-slate-300 hover:border-{corNivel}-400 hover:bg-{corNivel}-50"
      onClick={handleCriarFilha}
    >
      <Plus className="w-4 h-4 mr-2" />
      {nivel === 'semanal' ? 'Adicionar Tarefa' : 'Criar Meta Filha'}
    </Button>
  </CardContent>
</Card>
```

#### 3.3.5 Lista de Tarefas (Apenas Semanais)

```
{meta.nivel === 'semanal' && (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <ListChecks className="w-5 h-5 text-amber-500" />
        Tarefas da Semana
        <Badge variant="outline" className="ml-auto">
          {tarefas.filter(t => t.completed).length}/{tarefas.length} concluidas
        </Badge>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <AnimatePresence>
        {tarefas.map((tarefa, index) => (
          <motion.div
            key={tarefa.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
            className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
              tarefa.completed
                ? 'bg-slate-50 border-slate-200'
                : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-sm'
            }`}
          >
            <Checkbox
              id={tarefa.id}
              checked={tarefa.completed}
              onCheckedChange={() => handleToggleTarefa(tarefa.id)}
              className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
            />
            <label
              htmlFor={tarefa.id}
              className={`flex-1 cursor-pointer ${tarefa.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}
            >
              {tarefa.titulo}
            </label>
            <span className="text-xs text-slate-500">
              {new Date(tarefa.data).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })}
            </span>
          </motion.div>
        ))}
      </AnimatePresence>

      {tarefas.length === 0 && (
        <EmptyState
          icon={<ListChecks className="w-8 h-8 text-slate-300" />}
          title="Nenhuma tarefa ainda"
          description="Adicione tarefas para comecar a trackear seu progresso semanal."
          action={
            <Button variant="outline" onClick={handleAddTarefa}>
              <Plus className="w-4 h-4 mr-2" /> Adicionar Tarefa
            </Button>
          }
        />
      )}
    </CardContent>
  </Card>
)}
```

#### 3.3.6 Empty State Component

```tsx
function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        {icon}
      </motion.div>
      <h3 className="text-lg font-medium text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      {action}
    </div>
  );
}
```

#### 3.3.7 Estado de Loading

```tsx
function MetaDetailSkeleton() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-2/3 h-8" />
          <div className="flex gap-2">
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-24 h-5" />
          </div>
        </div>
      </div>

      {/* Progress + Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 lg:col-span-1 rounded-xl" />
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Hierarchy Skeleton */}
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}
```

### 3.4 Animacoes & Motion

| Elemento | Animacao | Parametros |
|----------|----------|------------|
| **Circulo de Progresso** | stroke-dashoffset | duration: 1.2s, ease: "easeOut" |
| **Numero do Progresso** | scale + opacity | delay: 0.3s, duration: 0.5s |
| **Cards (entrada)** | y: 20 -> 0 + opacity | stagger: 0.1s, duration: 0.4s |
| **Lista de Filhas/Tarefas** | x: -20 -> 0 + opacity | stagger: 0.05s, duration: 0.3s |
| **Checkbox** | scale: 0.8 -> 1 | duration: 0.2s |
| **Hover em Cards** | border-color + background | transition: 0.2s ease |
| **Hover em Filhas** | translateX: 4px | transition: 0.15s ease |
| **Empty State** | scale: 0.8 -> 1 + opacity | duration: 0.3s |
| **Skeleton** | shimmer/pulse | animate-pulse |
| **Status Change** | backgroundColor fade | duration: 0.3s |

### 3.5 Responsividade (Mobile-First)

| Breakpoint | Layout | Ajustes |
|------------|--------|---------|
| **< 640px** | Single column | Header empilhado; progresso centralizado; botoes full-width; cards sem padding lateral extra |
| **640-1024px** | 2 columns para grid de info | Progresso em cima, info embaixo; hierarquia em 1 coluna |
| **> 1024px** | 3 columns | Progresso a esquerda (1/3), info a direita (2/3); hierarquia em grid de 2 colunas para filhas |

---

## 4. Estrutura JSX Sugerida

```tsx
// MetaDetailPage.tsx - Estrutura completa sugerida

import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Edit, Trash2, CheckCircle, Calendar, Target, Star,
  TrendingUp, FileText, HelpCircle, LayoutGrid, GitBranch, ArrowUp,
  ChevronRight, Plus, ListChecks
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { metasService, type MetaNivel } from '../../../services/metasService';
import { tarefasService } from '../../../services/tarefasService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Skeleton } from '../../components/ui/skeleton';
import type { Database } from '../../../lib/supabase';

type Meta = Database['public']['Tables']['metas']['Row'];
type Tarefa = Database['public']['Tables']['tarefas']['Row'];

// --- Configuracao por Nivel ---
const NIVEL_CONFIG: Record<MetaNivel, {
  label: string;
  labelPlural: string;
  emoji: string;
  cor: string;
  corClasse: string;
  corBg: string;
  corTexto: string;
  proximoNivel: MetaNivel;
  proximoPath: string;
  proximoLabel: string;
}> = {
  grande: {
    label: 'Grande Meta',
    labelPlural: 'Grandes Metas',
    emoji: '\ud83c\udfaf',
    cor: 'indigo',
    corClasse: 'text-indigo-600',
    corBg: 'bg-indigo-50',
    corTexto: 'text-indigo-900',
    proximoNivel: 'anual',
    proximoPath: 'anuais',
    proximoLabel: 'Anual',
  },
  anual: {
    label: 'Meta Anual',
    labelPlural: 'Metas Anuais',
    emoji: '\ud83d\udcc5',
    cor: 'violet',
    corClasse: 'text-violet-600',
    corBg: 'bg-violet-50',
    corTexto: 'text-violet-900',
    proximoNivel: 'mensal',
    proximoPath: 'mensais',
    proximoLabel: 'Mensal',
  },
  mensal: {
    label: 'Meta Mensal',
    labelPlural: 'Metas Mensais',
    emoji: '\ud83d\udcc8',
    cor: 'emerald',
    corClasse: 'text-emerald-600',
    corBg: 'bg-emerald-50',
    corTexto: 'text-emerald-900',
    proximoNivel: 'semanal',
    proximoPath: 'semanais',
    proximoLabel: 'Semanal',
  },
  semanal: {
    label: 'Meta Semanal',
    labelPlural: 'Metas Semanais',
    emoji: '\u26a1',
    cor: 'amber',
    corClasse: 'text-amber-600',
    corBg: 'bg-amber-50',
    corTexto: 'text-amber-900',
    proximoNivel: 'diaria',
    proximoPath: 'diarias',
    proximoLabel: 'Diaria',
  },
  diaria: {
    label: 'Meta Diaria',
    labelPlural: 'Metas Diarias',
    emoji: '\u2705',
    cor: 'rose',
    corClasse: 'text-rose-600',
    corBg: 'bg-rose-50',
    corTexto: 'text-rose-900',
    proximoNivel: 'diaria',
    proximoPath: 'diarias',
    proximoLabel: 'Diaria',
  },
};

// --- Componentes Auxiliares ---

function ProgressCircle({ progresso, cor }: { progresso: number; cor: string }) {
  const raio = 42;
  const circunferencia = 2 * Math.PI * raio;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg viewBox="0 0 100 100" className="w-40 h-40 transform -rotate-90">
        <circle cx="50" cy="50" r={raio} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r={raio} fill="none"
          stroke="currentColor" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          initial={{ strokeDashoffset: circunferencia }}
          animate={{ strokeDashoffset: circunferencia * (1 - progresso / 100) }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={`text-${cor}-600`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-5xl font-extrabold text-${cor}-600`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {progresso}%
        </motion.span>
      </div>
    </motion.div>
  );
}

function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-10 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      {action}
    </motion.div>
  );
}

function MetaDetailSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-2/3 h-8" />
          <div className="flex gap-2">
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-24 h-5" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 lg:col-span-1 rounded-xl" />
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}

// --- Pagina Principal ---

export default function MetaDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { getAreaById, loadMetas } = useApp();

  const [meta, setMeta] = useState<Meta | null>(null);
  const [metaPai, setMetaPai] = useState<Meta | null>(null);
  const [submetas, setSubmetas] = useState<Meta[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [progresso, setProgresso] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nivel = (params.nivel as MetaNivel) || 'grande';
  const id = params.id;
  const config = NIVEL_CONFIG[nivel];
  const area = meta?.area_id ? getAreaById(meta.area_id) : null;

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      try {
        setLoading(true);
        const [metaData, subMetaData, tarefasData] = await Promise.all([
          metasService.getById(id),
          metasService.getByParentId(id),
          tarefasService.getByMetaId(id),
        ]);

        if (!metaData) {
          setError('Meta nao encontrada');
          return;
        }

        setMeta(metaData);
        setSubmetas(subMetaData);
        setTarefas(tarefasData);

        // Carregar meta pai se existir
        if (metaData.meta_pai_id) {
          const pai = await metasService.getById(metaData.meta_pai_id);
          setMetaPai(pai);
        }

        const progressoCalculado = await metasService.calcularProgresso(id);
        setProgresso(progressoCalculado);
      } catch (err) {
        console.error('Erro ao carregar meta:', err);
        setError('Erro ao carregar meta');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  // Handlers (toggle status, delete, toggle tarefa) — manter logica atual
  const handleToggleStatus = async () => { /* ... */ };
  const handleDelete = async () => { /* ... */ };
  const handleToggleTarefa = async (tarefaId: string) => { /* ... */ };

  if (loading) return <MetaDetailSkeleton />;
  if (error || !meta) return <div className="p-6 text-red-500">{error || 'Meta nao encontrada'}</div>;

  const tarefasConcluidas = tarefas.filter(t => t.completed).length;
  const diasRestantes = meta.data_limite
    ? Math.ceil((new Date(meta.data_limite).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      className="p-4 md:p-6 max-w-5xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* === BREADCRUMB === */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Button
          variant="ghost" size="sm"
          onClick={() => navigate(`/metas/${nivel === 'grande' ? 'grandes' : nivel + 's'}`)}
          className="h-auto px-2 py-1 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {config.labelPlural}
        </Button>
        <span>/</span>
        <span className="text-slate-800 font-medium">Detalhes</span>
      </nav>

      {/* === HEADER === */}
      <motion.header
        className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl ${config.corBg} flex items-center justify-center text-3xl`}>
            {config.emoji}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              {meta.titulo}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={`${config.corBg} ${config.corClasse} border-${config.cor}-200`}>
                {config.label}
              </Badge>
              {area && (
                <Badge variant="outline" className="text-slate-600">
                  {area.emoji} {area.name}
                </Badge>
              )}
              <Badge variant={meta.status === 'ativa' ? 'default' : 'secondary'}>
                {meta.status === 'ativa' ? 'Ativa' : meta.status === 'concluida' ? 'Concluida' : 'Arquivada'}
              </Badge>
              {meta.one_thing && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  <Star className="w-3 h-3 mr-1" /> ONE Thing
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('editar')}>
            <Edit className="w-4 h-4 mr-1" /> Editar
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-1" /> Excluir
          </Button>
          <Button
            size="sm"
            className={`bg-${config.cor}-600 hover:bg-${config.cor}-700`}
            onClick={handleToggleStatus}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            {meta.status === 'ativa' ? 'Concluir' : 'Reativar'}
          </Button>
        </div>
      </motion.header>

      {/* === PROGRESSO + INFO GRID === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progresso */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="h-full flex flex-col items-center justify-center p-6">
            <ProgressCircle progresso={progresso} cor={config.cor} />
            <p className="mt-4 text-sm text-slate-500 text-center">
              {tarefas.length === 0
                ? 'Sem tarefas vinculadas'
                : `${tarefasConcluidas} de ${tarefas.length} tarefas concluidas`
              }
            </p>
            {progresso === 100 && meta.status !== 'concluida' && (
              <motion.div
                className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <strong>Parabens!</strong> Todas as tarefas concluidas.
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Info Grid */}
        <motion.div
          className="lg:col-span-2 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* Descricao */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Descricao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-800 leading-relaxed">
                {meta.descricao || <span className="text-slate-400 italic">Sem descricao</span>}
              </p>
            </CardContent>
          </Card>

          {/* Focusing Question */}
          {meta.focusing_question && (
            <Card className={`border-l-4 border-l-${config.cor}-400 bg-gradient-to-r from-slate-50 to-white`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> Focusing Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-slate-700 italic">
                  "{meta.focusing_question}"
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prazo */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Prazo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meta.data_limite ? (
                  <>
                    <p className="font-medium text-slate-800">
                      {new Date(meta.data_limite).toLocaleDateString('pt-BR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                    {diasRestantes !== null && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {diasRestantes > 0 ? `${diasRestantes} dias restantes`
                          : diasRestantes === 0 ? "Vence hoje"
                          : `Atrasada em ${Math.abs(diasRestantes)} dias`}
                      </Badge>
                    )}
                  </>
                ) : (
                  <p className="text-slate-400 italic">Sem prazo definido</p>
                )}
              </CardContent>
            </Card>

            {/* Area */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" /> Area de Vida
                </CardTitle>
              </CardHeader>
              <CardContent>
                {area ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{area.emoji}</span>
                    <div>
                      <p className="font-medium text-slate-800">{area.name}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Sem area definida</p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* === HIERARQUIA === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-slate-500" /> Hierarquia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Meta Pai */}
            {metaPai && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <ArrowUp className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Pertence a:</span>
                <Link
                  to={`/metas/${nivel === 'anual' ? 'grandes' : NIVEL_CONFIG[NIVEL_CONFIG[nivel].proximoNivel]?.labelPlural.toLowerCase()}/${metaPai.id}`}
                  className={`flex-1 font-medium text-slate-800 hover:text-${config.cor}-600 transition-colors`}
                >
                  {NIVEL_CONFIG[metaPai.nivel as MetaNivel]?.emoji} {metaPai.titulo}
                </Link>
                <Badge variant="outline" className="text-xs">
                  {NIVEL_CONFIG[metaPai.nivel as MetaNivel]?.label}
                </Badge>
              </div>
            )}

            {/* Metas Filhas / Tarefas */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-500">
                {nivel === 'semanal'
                  ? `${tarefas.length} tarefa(s)`
                  : `${submetas.length} meta(s) filha(s)`
                }
              </h4>

              <AnimatePresence>
                {nivel === 'semanal' ? (
                  // TAREFAS (nivel semanal)
                  tarefas.map((tarefa, index) => (
                    <motion.div
                      key={tarefa.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        tarefa.completed
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-sm'
                      }`}
                    >
                      <Checkbox
                        id={tarefa.id}
                        checked={tarefa.completed}
                        onCheckedChange={() => handleToggleTarefa(tarefa.id)}
                        className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                      />
                      <label
                        htmlFor={tarefa.id}
                        className={`flex-1 cursor-pointer ${tarefa.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}
                      >
                        {tarefa.titulo}
                      </label>
                      <span className="text-xs text-slate-500">
                        {new Date(tarefa.data).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  // SUBMETAS (outros niveis)
                  submetas.map((sub, index) => (
                    <motion.div
                      key={sub.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={`/metas/${config.proximoPath}/${sub.id}`}
                        className="block"
                      >
                        <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:border-${config.cor}-300 hover:bg-${config.cor}-50`}>
                          <Target className={`w-4 h-4 text-${NIVEL_CONFIG[sub.nivel as MetaNivel]?.cor}-400`} />
                          <span className="flex-1 font-medium text-slate-800">{sub.titulo}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                              <div
                                className={`h-full bg-${NIVEL_CONFIG[sub.nivel as MetaNivel]?.cor}-500 rounded-full transition-all`}
                                style={{ width: `${sub.progresso || 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-slate-500">{sub.progresso || 0}%</span>
                          </div>
                          <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                            {NIVEL_CONFIG[sub.nivel as MetaNivel]?.label}
                          </Badge>
                          <ChevronRight className="w-4 h-4 text-slate-300" />
                        </div>
                      </Link>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>

              {/* Empty State para filhas/tarefas */}
              {nivel === 'semanal' && tarefas.length === 0 && (
                <EmptyState
                  icon={<ListChecks className="w-8 h-8 text-slate-300" />}
                  title="Nenhuma tarefa ainda"
                  description="Adicione tarefas para comecar a trackear seu progresso semanal."
                  action={
                    <Button variant="outline" onClick={() => navigate(`/agenda/tarefas/criar?meta=${meta.id}`)}>
                      <Plus className="w-4 h-4 mr-2" /> Adicionar Tarefa
                    </Button>
                  }
                />
              )}

              {nivel !== 'semanal' && submetas.length === 0 && (
                <EmptyState
                  icon={<Target className="w-8 h-8 text-slate-300" />}
                  title="Nenhuma meta filha"
                  description="Crie metas filhas para decompor esta meta em passos menores."
                  action={
                    <Button variant="outline" onClick={() => navigate(`/metas/${config.proximoPath}/criar?pai=${meta.id}`)}>
                      <Plus className="w-4 h-4 mr-2" /> Criar Meta Filha
                    </Button>
                  }
                />
              )}
            </div>

            {/* CTA Adicionar */}
            {(nivel === 'semanal' || submetas.length > 0) && (
              <Button
                variant="outline"
                className={`w-full border-dashed border-slate-300 hover:border-${config.cor}-400 hover:bg-${config.cor}-50`}
                onClick={() =>
                  nivel === 'semanal'
                    ? navigate(`/agenda/tarefas/criar?meta=${meta.id}`)
                    : navigate(`/metas/${config.proximoPath}/criar?pai=${meta.id}`)
                }
              >
                <Plus className="w-4 h-4 mr-2" />
                {nivel === 'semanal' ? 'Adicionar Tarefa' : 'Criar Meta Filha'}
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
```

---

## 5. Checklist de Implementacao

- [ ] Instalar dependencias: `framer-motion`, `lucide-react` (ja presentes)
- [ ] Criar componente `ProgressCircle` reutilizavel
- [ ] Criar componente `EmptyState` reutilizavel
- [ ] Criar componente `MetaDetailSkeleton` para loading
- [ ] Refatorar `MetaDetailPage` com nova estrutura JSX
- [ ] Implementar sistema de cores por nivel (`NIVEL_CONFIG`)
- [ ] Adicionar campo `metaPai` ao carregamento de dados
- [ ] Implementar animacoes Framer Motion em todos os elementos
- [ ] Garantir responsividade mobile-first (testar < 640px)
- [ ] Verificar acessibilidade (ARIA labels, foco, contraste)
- [ ] Testar interacoes (toggle tarefa, concluir meta, deletar)
- [ ] Validar tipos TypeScript (`npx tsc --noEmit`)

---

*Documento gerado em: 2026-04-28*
*Versao: 1.0*
*Autor: Sistema de Especificacao de UI*
