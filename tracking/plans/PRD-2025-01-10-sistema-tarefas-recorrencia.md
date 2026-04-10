---
date: 2025-01-10T12:00:00-03:00
researcher: Vibe Researcher
git_commit: 94008f6ff8ff968630d629a59775ed259e76f05b
branch: main
repository: goal_planner_uat3
topic: "Sistema de Tarefas e Recorrência - Goal Planner"
tags: [research, codebase, tarefas, recorrencia, supabase, agenda]
status: complete
last_updated: 2025-01-10
last_updated_by: Vibe Researcher
---

# Research: Sistema de Tarefas e Recorrência - Goal Planner

**Date**: 2025-01-10T12:00:00-03:00
**Researcher**: Vibe Researcher
**Git Commit**: 94008f6ff8ff968630d629a59775ed259e76f05b
**Branch**: main
**Repository**: goal_planner_uat3

## Research Question

Pesquisar e documentar o sistema atual de tarefas no Goal Planner, especialmente:
1. Estrutura da tabela `tarefas` no Supabase
2. Funcionamento do formulário de criação de tarefas na Agenda Semanal
3. Implementação atual de recorrência
4. Como o sistema de Hábitos gera tarefas (para referência)

---

## Summary

O Goal Planner possui um sistema de tarefas já implementado com recorrência básica. A tabela `tarefas` no Supabase já possui um campo `recorrencia` que aceita valores: `'nenhuma' | 'diaria' | 'semanal'`. O formulário de criação permite selecionar esses tipos de recorrência, mas **atualmente não existe lógica de geração automática** de tarefas recorrentes - apenas o campo é salvo no banco.

O sistema de Hábitos serve como excelente referência, pois já implementa geração automática de tarefas através do método `gerarTarefas()` que cria múltiplas instâncias de tarefas baseadas em dias da semana selecionados.

---

## Detailed Findings

### 1. Estrutura da Tabela `tarefas` no Supabase

**Local**: `src/lib/supabase.ts:109-155`

```typescript
tarefas: {
  Row: {
    id: string;
    user_id: string | null;
    meta_id: string | null;
    habito_id: string | null;  // Ligação com hábitos
    titulo: string;
    descricao: string | null;
    bloco: 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
    hora: string | null;
    prioridade: 'alta' | 'media' | 'baixa';
    completed: boolean;
    data: string;  // YYYY-MM-DD
    recorrencia: 'nenhuma' | 'diaria' | 'semanal';  // CAMPO EXISTENTE!
    created_at: string;
  };
  // ... Insert e Update similares
}
```

**Colunas Principais**:
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | string | UUID único |
| `user_id` | string | Usuário dono da tarefa |
| `meta_id` | string | Meta vinculada (opcional) |
| `habito_id` | string | Hábito vinculado (quando gerado de hábito) |
| `titulo` | string | Título da tarefa |
| `descricao` | string | Descrição detalhada |
| `bloco` | enum | Bloco do dia: 'one-thing', 'manha', 'tarde', 'noite' |
| `hora` | string | Horário (HH:MM) |
| `prioridade` | enum | 'alta', 'media', 'baixa' |
| `completed` | boolean | Status de conclusão |
| `data` | string | Data da tarefa (YYYY-MM-DD) |
| `recorrencia` | enum | **'nenhuma', 'diaria', 'semanal'** |
| `created_at` | string | Timestamp de criação |

**Observação Importante**: O campo `recorrencia` já existe no schema, mas apenas armazena o valor. Não há implementação de lógica para gerar automaticamente múltiplas instâncias ou próximas ocorrências.

---

### 2. Formulário de Criação de Tarefas

**Local**: `src/app/pages/agenda/TarefaCreatePage.tsx`

O formulário utiliza:
- **React Hook Form** com **Zod** para validação
- **Schema**: `src/app/pages/agenda/tarefaFormSchema.ts`

#### Schema do Formulário (tarefaFormSchema.ts:3-12):
```typescript
export const tarefaFormSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  data: z.string().min(1, 'Data é obrigatória'), // YYYY-MM-DD
  hora: z.string().optional(),
  bloco: z.enum(['one-thing', 'manha', 'tarde', 'noite']).optional(),
  prioridade: z.enum(['alta', 'media', 'baixa']).default('media'),
  metaId: z.string().optional().nullable(),
  recorrencia: z.enum(['nenhuma', 'diaria', 'semanal']).default('nenhuma'),
});
```

#### Campos do Formulário:

1. **Título** (obrigatório)
2. **Descrição** (opcional, textarea)
3. **Data** (date picker)
4. **Horário** (time picker)
5. **Bloco de Tempo** (select):
   - ☀️ ONE Thing (Manhã)
   - 🌅 Manhã
   - ☀️ Tarde
   - 🌙 Noite
6. **Prioridade** (select com ícones):
   - 🔴 Alta
   - 🟡 Média
   - ⚪ Baixa
7. **Meta Vinculada** (select opcional)
8. **Repetição** (select):
   - Não repetir
   - Todo dia
   - Toda semana

#### Submissão (TarefaCreatePage.tsx:60-77):
```typescript
const onSubmit = async (values: TarefaFormSchema) => {
  try {
    await createTarefa({
      titulo: values.titulo,
      descricao: values.descricao,
      data: values.data,
      hora: values.hora || null,
      bloco: values.bloco || null,
      prioridade: values.prioridade,
      meta_id: values.metaId || null,
      recorrencia: values.recorrencia,  // <-- Apenas salva o valor!
      completed: false,
    });
    navigate('/agenda/hoje');
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
  }
};
```

**Ponto Crítico**: O `createTarefa` apenas salva a tarefa única. Não há processamento para criar múltiplas instâncias baseadas na recorrência selecionada.

---

### 3. Implementação Atual de Recorrência

#### Estado Atual:
✅ **Já Existe**:
- Campo `recorrencia` na tabela do banco
- Seleção no formulário (criação e edição)
- Persistência do valor escolhido

❌ **Não Existe**:
- Lógica de geração de tarefas recorrentes
- Processamento no backend quando `recorrencia !== 'nenhuma'`
- Geração de instâncias futuras
- Visualização de série recorrente
- Edição em massa de tarefas recorrentes

#### Serviço de Tarefas (tarefasService.ts):
O serviço possui operações CRUD básicas:
- `getAll()` - Lista todas as tarefas
- `getByData()` - Tarefas de uma data específica
- `getById()` - Tarefa única
- `create()` - Cria uma tarefa
- `update()` - Atualiza uma tarefa
- `delete()` - Exclui uma tarefa
- `toggleCompleted()` - Alterna status de conclusão
- `getByMetaId()` - Tarefas vinculadas a uma meta

**Não há método específico para lidar com recorrência**.

---

### 4. Sistema de Hábitos - Referência para Recorrência

**Local**: `src/services/habitosService.ts`

O sistema de hábitos implementa exatamente o padrão que precisamos para tarefas recorrentes.

#### Estrutura da Tabela `habitos` (supabase.ts:269-324):
```typescript
habitos: {
  Row: {
    id: string;
    user_id: string | null;
    titulo: string;
    descricao: string | null;
    data_inicio: string;  // Período do hábito
    data_fim: string;
    dias_semana: number[];  // [0,1,2,3,4] = Seg-Sex
    hora: string | null;
    bloco: 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
    meta_id: string | null;
    prioridade: 'alta' | 'media' | 'baixa';
    status: 'ativa' | 'pausada' | 'concluida' | 'expirada';
    streak_atual: number;
    melhor_streak: number;
    ultima_conclusao: string | null;
    created_at: string;
  };
}
```

#### Geração Automática de Tarefas (habitosService.ts:147-206):

```typescript
async gerarTarefas(habito: Habito): Promise<Tarefa[]> {
  const tarefas: Omit<TarefaInsert, 'id' | 'created_at'>[] = [];
  const current = new Date(habito.data_inicio);
  const end = new Date(habito.data_fim);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  // Limita a 30 dias para evitar problemas de performance
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 30);

  while (current <= end && current <= maxDate) {
    // Pula datas passadas
    if (current < hoje) {
      current.setDate(current.getDate() + 1);
      continue;
    }

    const dayOfWeek = current.getDay();
    // Conversão: getDay() retorna 0=dom, 1=seg, ..., 6=sab
    // Formato usado: 0=seg, 6=dom
    const mappedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    if (habito.dias_semana.includes(mappedDay)) {
      const dataStr = current.toISOString().split('T')[0];
      
      // Verifica se já existe tarefa para este hábito/data
      const { data: existingTasks } = await supabase
        .from('tarefas')
        .select('id')
        .eq('habito_id', habito.id)
        .eq('data', dataStr)
        .limit(1);

      if (!existingTasks || existingTasks.length === 0) {
        tarefas.push({
          user_id: habito.user_id,
          titulo: habito.titulo,
          descricao: habito.descricao,
          data: dataStr,
          hora: habito.hora,
          bloco: habito.bloco,
          prioridade: habito.prioridade,
          meta_id: habito.meta_id,
          habito_id: habito.id,  // <-- Ligação com o hábito!
          completed: false,
          recorrencia: 'nenhuma',  // Cada tarefa é individual
        });
      }
    }

    current.setDate(current.getDate() + 1);
  }

  if (tarefas.length > 0) {
    const { error } = await supabase.from('tarefas').insert(tarefas);
    if (error) throw error;
  }

  return [];
}
```

#### Padrões do Sistema de Hábitos:

1. **Período Definido**: `data_inicio` e `data_fim`
2. **Dias Específicos**: Array `dias_semana` com números 0-6
3. **Mapeamento de Dias**: Conversão entre formatos de dia da semana
4. **Prevenção de Duplicatas**: Verifica se tarefa já existe antes de criar
5. **Limite de Geração**: Máximo 30 dias à frente
6. **Link com Origem**: Campo `habito_id` para rastreabilidade
7. **Geração no Create**: Chamado automaticamente após criar hábito

---

## Code References

### Tabela de Tarefas (Supabase Types)
- `src/lib/supabase.ts:109-155` - Definição completa do tipo Tarefa

### Formulários
- `src/app/pages/agenda/TarefaCreatePage.tsx` - Criação de tarefas
- `src/app/pages/agenda/TarefaEditPage.tsx` - Edição de tarefas
- `src/app/pages/agenda/tarefaFormSchema.ts` - Schema de validação Zod

### Serviços
- `src/services/tarefasService.ts` - CRUD de tarefas
- `src/services/habitosService.ts:147-206` - `gerarTarefas()` - REFERÊNCIA CHAVE

### Contexto
- `src/app/contexts/AppContext.tsx:182-188` - `createTarefa` 

### Mapeamento
- `src/lib/mapeamento.ts` - Conversão entre DB e UI

---

## Architecture Documentation

### Padrões Encontrados:

1. **Separação de Responsabilidades**:
   - Services: Acesso direto ao Supabase
   - Context (AppContext): Gerenciamento de estado global
   - Pages: Componentes de UI com React Hook Form

2. **Tipagem Forte**:
   - Uso de `Database['public']['Tables']['tarefas']['Row']` do Supabase
   - Schema Zod para validação de formulários
   - Mapeamento explícito entre DB e UI types

3. **Recorrência no Hábitos vs Tarefas**:
   - Hábitos: Gera múltiplas tarefas físicas no banco
   - Tarefas: Apenas flag de recorrência (sem geração)

4. **Fluxo de Dados**:
   ```
   Form (Zod) → AppContext → Service → Supabase
                      ↓
                State Update (React)
   ```

---

## Recommendations for Implementation

Baseado na pesquisa, para implementar recorrência completa em tarefas:

### Opção 1: Expandir Schema de Tarefas (Similar a Hábitos)
Adicionar campos na tabela `tarefas`:
- `data_fim` - Data limite da recorrência
- `dias_semana` - Array de dias (para recorrência semanal customizada)
- `parent_id` - ID da tarefa "mãe" (para instâncias geradas)
- `is_template` - Boolean indicando se é a definição da recorrência

### Opção 2: Tabela Separada para Recorrências
Criar tabela `tarefas_recorrentes` com:
- Definição da regra de recorrência
- Período de validade
- Função/trigger para gerar instâncias

### Opção 3: Geração Lazy (On-Demand)
- Manter apenas a flag `recorrencia`
- Calcular próximas ocorrências dinamicamente na UI
- Criar tarefa física apenas quando usuário interagir

**Referência Principal**: O método `gerarTarefas()` em `habitosService.ts:147-206` deve ser usado como base para a implementação.

---

## Open Questions

1. Qual a estratégia preferida para geração de tarefas recorrentes?
   - Geração imediata (como hábitos)?
   - Geração sob demanda?
   - Cron job para criar próximas ocorrências?

2. Como lidar com edição de tarefas recorrentes?
   - Editar apenas esta ocorrência?
   - Editar todas as futuras?
   - Editar toda a série?

3. Qual o limite de geração?
   - Hábitos limitam a 30 dias à frente
   - Tarefas devem ter limite diferente?

4. Integração com notificações?
   - Tarefas recorrentes precisam de lembretes?
