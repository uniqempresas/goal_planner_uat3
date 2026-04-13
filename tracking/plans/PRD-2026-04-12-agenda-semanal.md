---
date: 2026-04-12T15:30:00-03:00
researcher: vibe-researcher
git_commit: pending
branch: main
repository: goal_planner_uat3
topic: "Implementação da Agenda Semanal - Goal Planner"
tags: [agenda-semanal, tarefas, recorrencia, metas, calendario]
status: complete
last_updated: 2026-04-12
last_updated_by: vibe-researcher
---

# PRD: Implementação da Agenda Semanal - Goal Planner

**Data**: 2026-04-12  
**Pesquisador**: vibe-researcher  
**Git Commit**: [pending]  
**Branch**: main  
**Repositório**: goal_planner_uat3

## Visão Geral

Este documento descreve a implementação atual da **Agenda Semanal** (`/agenda/semana`) no Goal Planner, incluindo como a semana é calculada, como tarefas são filtradas, e como o formulário de criação funciona.

---

## Estrutura de Arquivos

### 📁 Localização dos Arquivos Principais

```
src/
├── app/
│   └── pages/
│       └── agenda/
│           ├── AgendaSemanaPage.tsx      # Página principal da agenda semanal
│           ├── TarefaCreatePage.tsx      # Formulário de criação de tarefas
│           └── tarefaFormSchema.ts       # Schema de validação do formulário
├── services/
│   ├── tarefasService.ts                 # Serviço de tarefas (getByData, etc)
│   ├── metasService.ts                   # Serviço de metas (getByNivel)
│   └── recorrenciaService.ts             # Serviço de recorrência
└── app/
    └── contexts/
        └── AppContext.tsx                # Contexto com grandesMetas e metasAnuais
```

---

## 1. Cálculo da Semana

### 📅 Início da Semana: SEGUNDA-FEIRA

A agenda semanal considera **segunda-feira** como o primeiro dia da semana.

**Código relevante** (`AgendaSemanaPage.tsx:13-21`):

```typescript
const [currentWeekStart, setCurrentWeekStart] = useState(() => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Se domingo, volta 6 dias; senão, calcula diferença para segunda
  const monday = new Date(today);
  monday.setDate(today.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return monday;
});
```

### 🧮 Lógica de Cálculo

| Dia Atual (getDay()) | Cálculo do diff | Resultado |
|---------------------|-----------------|-----------|
| 0 (Domingo)         | -6              | Volta 6 dias → Segunda anterior |
| 1 (Segunda)         | 0               | Mesmo dia |
| 2 (Terça)           | -1              | Volta 1 dia |
| 3 (Quarta)          | -2              | Volta 2 dias |
| 4 (Quinta)          | -3              | Volta 3 dias |
| 5 (Sexta)           | -4              | Volta 4 dias |
| 6 (Sábado)          | -5              | Volta 5 dias |

### 📊 Array de Dias da Semana

```typescript
const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const diasCompletos = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
```

### 🔄 Navegação entre Semanas

```typescript
const goToPrevWeek = () => {
  const newStart = new Date(currentWeekStart);
  newStart.setDate(currentWeekStart.getDate() - 7);
  setCurrentWeekStart(newStart);
};

const goToNextWeek = () => {
  const newStart = new Date(currentWeekStart);
  newStart.setDate(currentWeekStart.getDate() + 7);
  setCurrentWeekStart(newStart);
};
```

---

## 2. Filtragem de Tarefas

### 🔍 Serviço: `tarefasService.getByData`

**Localização**: `src/services/tarefasService.ts`

```typescript
async getByData(userId: string, data: string): Promise<Tarefa[]> {
  const { data: tarefas, error } = await supabase
    .from('tarefas')
    .select('*')
    .eq('user_id', userId)
    .eq('data', data)
    .order('hora', { ascending: true });

  if (error) throw error;
  return tarefas || [];
}
```

### ⚠️ IMPORTANTE: A query NÃO filtra por tipo de tarefa

O método `getByData` usado na Agenda Semanal **retorna TUDO** da data especificada:
- ✅ Tarefas normais (não recorrentes)
- ✅ Instâncias de tarefas recorrentes (têm `parent_id`)
- ❌ Templates de recorrência (`is_template: true`) - geralmente não aparecem pois têm datas diferentes

**Código na Agenda Semanal** (`AgendaSemanaPage.tsx:44-45`):

```typescript
const dayTasks = await tarefasService.getByData('current-user', dateStr);
```

### 🔄 Serviço oferece métodos específicos (mas NÃO são usados na Agenda Semanal)

O `tarefasService` possui métodos para filtrar especificamente, mas a Agenda Semanal usa apenas `getByData`:

```typescript
// Método para tarefas NÃO recorrentes (NÃO usado na agenda)
async getTarefasDoDia(userId: string, data: string): Promise<Tarefa[]> {
  return supabase
    .from('tarefas')
    .select('*')
    .eq('user_id', userId)
    .eq('data', data)
    .is('parent_id', null) // ← Exclui instâncias de recorrentes
    .order('hora', { ascending: true });
}

// Método para APENAS instâncias recorrentes (NÃO usado na agenda)
async getInstanciasRecorrentesDoDia(userId: string, data: string): Promise<Tarefa[]> {
  return supabase
    .from('tarefas')
    .select('*')
    .eq('user_id', userId)
    .eq('data', data)
    .not('parent_id', 'is', null) // ← Apenas instâncias
    .order('hora', { ascending: true });
}
```

### 📝 Mapping para UI

As tarefas são mapeadas para o formato `TarefaUI` (`AgendaSemanaPage.tsx:47-59`):

```typescript
tasks[i] = dayTasks.map(t => ({
  id: t.id,
  metaId: t.meta_id || undefined,
  title: t.titulo,
  description: t.descricao || undefined,
  block: (t.bloco === 'one-thing' ? 'oneThing' : 
          t.bloco === 'manha' ? 'manha' : 
          t.bloco === 'tarde' ? 'tarde' : 
          t.bloco === 'noite' ? 'noite' : 'recorrentes') as any,
  hora: t.hora || undefined,
  priority: (t.prioridade === 'alta' ? 'high' : 
             t.prioridade === 'media' ? 'medium' : 'low') as any,
  completed: t.completed,
  data: t.data,
  isOneThing: t.bloco === 'one-thing',
  notes: t.descricao || undefined,
}));
```

---

## 3. Formulário de Criação e Seleção de Metas

### 📄 TarefaCreatePage.tsx

**Localização**: `src/app/pages/agenda/TarefaCreatePage.tsx`

### 🔗 Parâmetros da URL

A Agenda Semanal passa a data selecionada via query params:

```typescript
// AgendaSemanaPage.tsx - Link de criação (linha 254)
<Link to={`/agenda/tarefas/criar?data=${selectedDate.toISOString().split('T')[0]}`}>
  Adicionar tarefa
</Link>
```

No formulário, esses params são lidos (`TarefaCreatePage.tsx:30-31`):

```typescript
const dataParam = searchParams.get('data');
const blocoParam = searchParams.get('bloco');
```

### 📦 Carregamento de Metas

**Fonte dos dados**: `AppContext` (`TarefaCreatePage.tsx:27`):

```typescript
const { createTarefa, grandesMetas, metasAnuais } = useApp();
```

### 🔄 Combinação de Metas

As metas são combinadas em um único array para o select (`TarefaCreatePage.tsx:38-41`):

```typescript
const allMetas = [
  ...grandesMetas.map(m => ({ id: m.id, titulo: m.titulo, nivel: 'Grande' })),
  ...metasAnuais.map(m => ({ id: m.id, titulo: m.titulo, nivel: 'Anual' })),
];
```

**IMPORTANTE**: Apenas **Grandes Metas** e **Metas Anuais** estão disponíveis no select.  
Metas mensais, semanais e diárias NÃO aparecem no formulário de criação.

### 🎯 Componente Select de Metas

```typescript
<FormField
  control={form.control}
  name="metaId"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Vincular a uma Meta</FormLabel>
      <Select 
        onValueChange={field.onChange} 
        defaultValue={field.value || undefined}
        value={field.value || undefined}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma meta (opcional)" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {allMetas.map(meta => (
            <SelectItem key={meta.id} value={meta.id}>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4 text-indigo-500" />
                <span>{meta.titulo}</span>
                <span className="text-xs text-slate-400 ml-auto">({meta.nivel})</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <FormMessage />
    </FormItem>
  )}
/>
```

### 📋 Schema de Validação

**Arquivo**: `src/app/pages/agenda/tarefaFormSchema.ts`

```typescript
export const tarefaFormSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  data: z.string().min(1, 'Data é obrigatória'),
  hora: z.string().optional(),
  bloco: z.enum(['one-thing', 'manha', 'tarde', 'noite']).optional(),
  prioridade: z.enum(['alta', 'media', 'baixa']).default('media'),
  metaId: z.string().optional().nullable(),
  recorrencia: z.enum(['nenhuma', 'diaria', 'semanal']).default('nenhuma'),
  recorrenciaConfig: recorrenciaConfigSchema.nullable().optional(),
});
```

---

## 4. Como Metas são Carregadas (AppContext)

### 🔄 Load de Metas

**Localização**: `src/app/contexts/AppContext.tsx` (linhas 140-158)

```typescript
const loadMetas = useCallback(async () => {
  if (!user) return;
  try {
    const [grandes, anual, mensal, semanal, diaria] = await Promise.all([
      metasService.getByNivel(user.id, 'grande'),   // ← grandesMetas
      metasService.getByNivel(user.id, 'anual'),    // ← metasAnuais
      metasService.getByNivel(user.id, 'mensal'),
      metasService.getByNivel(user.id, 'semanal'),
      metasService.getByNivel(user.id, 'diaria'),
    ]);
    setGrandesMetas(grandes);
    setMetasAnuais(anual);
    setMetasMensais(mensal);
    setMetasSemanais(semanal);
    setMetasDiarias(diaria);
  } catch (error) {
    console.error('Erro ao carregar metas:', error);
  }
}, [user]);
```

### 🔍 Serviço metasService.getByNivel

**Localização**: `src/services/metasService.ts` (linhas 22-32)

```typescript
async getByNivel(userId: string, nivel: MetaNivel): Promise<Meta[]> {
  const { data, error } = await supabase
    .from('metas')
    .select('*')
    .eq('user_id', userId)
    .eq('nivel', nivel)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}
```

**Tipo MetaNivel**:
```typescript
export type MetaNivel = 'grande' | 'anual' | 'mensal' | 'semanal' | 'diaria';
```

---

## 5. Resumo das Descobertas

### ✅ Configurações de Início de Semana

- **Local**: `AgendaSemanaPage.tsx` (linhas 13-21, 84-93)
- **Dia de início**: Segunda-feira
- **Cálculo**: `dayOfWeek === 0 ? -6 : 1 - dayOfWeek`

### ✅ Filtro de Tarefas

- **Método usado**: `tarefasService.getByData()`
- **Filtra recorrentes?**: NÃO - retorna tarefas normais + instâncias de recorrentes
- **Ordenação**: Por hora (`order('hora', { ascending: true })`)

### ✅ Filtro de Metas no Formulário

- **Local**: `TarefaCreatePage.tsx` (linhas 38-41)
- **Metas disponíveis**: Apenas Grandes Metas e Metas Anuais
- **Fonte**: `AppContext` → `grandesMetas` e `metasAnuais`
- **Serviço**: `metasService.getByNivel()`

### ✅ Fluxo de Criação de Tarefa

1. Usuário clica "Adicionar tarefa" na Agenda Semanal
2. Link: `/agenda/tarefas/criar?data=YYYY-MM-DD`
3. Formulário pré-preenche a data via `searchParams`
4. Usuário seleciona meta (apenas Grandes/Anuais disponíveis)
5. Ao salvar, tarefa é criada e usuário é redirecionado para `/agenda/hoje`

---

## 6. Referências de Código

| Arquivo | Função/Componente | Linha(s) |
|---------|------------------|----------|
| `AgendaSemanaPage.tsx` | Cálculo da semana (useState) | 13-21 |
| `AgendaSemanaPage.tsx` | goToCurrentWeek (reset) | 84-93 |
| `AgendaSemanaPage.tsx` | Load de tarefas (useEffect) | 34-70 |
| `AgendaSemanaPage.tsx` | Link de criação com data | 254 |
| `TarefaCreatePage.tsx` | Leitura de searchParams | 30-31 |
| `TarefaCreatePage.tsx` | Combinação de metas | 38-41 |
| `TarefaCreatePage.tsx` | Select de metas | 299-330 |
| `tarefaFormSchema.ts` | Schema metaId | 23 |
| `AppContext.tsx` | loadMetas | 140-158 |
| `tarefasService.ts` | getByData | [ver arquivo] |
| `metasService.ts` | getByNivel | 22-32 |

---

## 7. Observações para Desenvolvimento

### ⚠️ Pontos de Atenção

1. **Filtro de tarefas**: A agenda semanal atual mostra TODAS as tarefas da data, incluindo instâncias de recorrentes. Se for necessário separar/excluir algum tipo, usar `getTarefasDoDia` ou `getInstanciasRecorrentesDoDia`.

2. **Metas disponíveis**: Apenas Grandes e Anuais aparecem no formulário. Se quiser adicionar outras (mensal, semanal, diária), modificar `allMetas` em `TarefaCreatePage.tsx`.

3. **Hardcoded user**: O `getByData` é chamado com `'current-user'` hardcoded (`AgendaSemanaPage.tsx:45`). Isso deve ser substituído pelo user ID real quando o auth estiver implementado.

4. **Redirecionamento**: Após criar tarefa, o redirecionamento é sempre para `/agenda/hoje`, mesmo tendo vindo da semanal (`TarefaCreatePage.tsx:108, 127`).

---

*Documento gerado para a fase de Research do SDD (Spec Driven Development)*
