# SPEC: Sistema de Hábitos

**Data:** 07 de Abril de 2026  
**Projeto:** Goal Planner  
**Versão:** 1.0  
**Tipo:** Técnica / Implementação  
**Status:** Rascunho

---

## 1. Visão Geral

Esta especificação detalha a implementação técnica do Sistema de Hábitos, incluindo nova tabela no banco, service, e integração na Agenda Hoje.

---

## 2. Estrutura de Dados

### 2.1 Tipo Hábito (Banco)

```typescript
type Habito = {
  id: string;
  user_id: string | null;
  titulo: string;
  descricao: string | null;
  data_inicio: string; // YYYY-MM-DD
  data_fim: string; // YYYY-MM-DD
  dias_semana: number[]; // [1,2,3,4,5,6,0] = seg-dom
  hora: string | null; // HH:mm
  bloco: 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
  meta_id: string | null;
  prioridade: 'alta' | 'media' | 'baixa';
  status: 'ativa' | 'pausada' | 'concluida' | 'expirada';
  streak_atual: number;
  melhor_streak: number;
  ultima_conclusao: string | null;
  created_at: string;
};
```

### 2.2 Tipo Hábito (UI)

```typescript
type HabitoUI = {
  id: string;
  titulo: string;
  descricao?: string;
  dataInicio: string;
  dataFim: string;
  diasSemana: number[];
  hora?: string;
  bloco?: string;
  metaId?: string;
  prioridade: string;
  status: 'ativa' | 'pausada' | 'concluida' | 'expirada';
  streakAtual: number;
  melhorStreak: number;
  ultimaConclusao?: string;
  diasRestantes: number;
  progresso: number; // 0-100
};
```

---

## 3. Atualização do Banco de Dados

### 3.1 Nova Tabela habitos

Adicionar em `src/lib/supabase.ts`:

```typescript
habitos: {
  Row: {
    id: string;
    user_id: string | null;
    titulo: string;
    descricao: string | null;
    data_inicio: string;
    data_fim: string;
    dias_semana: number[];
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
  Insert: { /* ... */ };
  Update: { /* ... */ };
}
```

### 3.2 Adicionar Campo habito_id na tabela tarefas

```typescript
tarefas: {
  Row: {
    // ... existing fields
    habito_id: string | null;
  };
  Insert: {
    habito_id?: string | null;
  };
  Update: {
    habito_id?: string | null;
  };
}
```

---

## 4. Service: habitosService.ts

```typescript
export const habitosService = {
  // CRUD
  async getAll(userId: string): Promise<Habito[]>
  async getById(id: string): Promise<Habito | null>
  async create(userId: string, habito: Omit<HabitoInsert, 'user_id'>): Promise<Habito>
  async update(id: string, habito: Partial<HabitoUpdate>): Promise<Habito>
  async delete(id: string): Promise<void>
  
  // Específicos
  async getAtivos(userId: string): Promise<Habito[]>
  async toggleStreak(id: string, data: string): Promise<Habito>
  
  // Geração de tarefas
  async gerarTarefas(habitoId: string): Promise<Tarefa[]>
  async verificarExpirados(userId: string): Promise<void>
}
```

---

## 5. Lógica de Geração de Tarefas

### 5.1 Função Gerar Tarefas

```typescript
async function gerarTarefas(habito: Habito): Promise<Tarefa[]> {
  const tarefas: Tarefa[] = [];
  const current = new Date(habito.data_inicio);
  const end = new Date(habito.data_fim);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    // getDay() returns 0=dom, 1=seg, ..., 6=sab
    // Converter para nosso formato: 0=seg, 6=dom
    const mappedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    
    if (habito.dias_semana.includes(mappedDay)) {
      tarefas.push({
        titulo: habito.titulo,
        descricao: habito.descricao,
        data: current.toISOString().split('T')[0],
        hora: habito.hora,
        bloco: habito.bloco,
        prioridade: habito.prioridade,
        meta_id: habito.meta_id,
        habito_id: habito.id,
        completed: false,
        user_id: habito.user_id,
      });
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return tarefas;
}
```

### 5.2 Função Atualizar Streak

```typescript
async function toggleStreak(habitoId: string, data: string): Promise<Habito> {
  const habito = await this.getById(habitoId);
  const hoje = new Date().toISOString().split('T')[0];
  
  if (habito.ultima_conclusao === hoje) {
    // Já completou hoje, não fazer nada
    return habito;
  }
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];
  
  let novoStreak = 1;
  
  if (habito.ultima_conclusao === yesterdayStr) {
    // Consecutivo!
    novoStreak = habito.streak_atual + 1;
  }
  
  const novoMelhor = Math.max(habito.melhor_streak, novoStreak);
  
  return this.update(habitoId, {
    streak_atual: novoStreak,
    melhor_streak: novoMelhor,
    ultima_conclusao: hoje,
  });
}
```

---

## 6. Componentes a Criar

### 6.1 habitosService.ts
- Localização: `src/services/habitosService.ts`

### 6.2 HabitosListPage
- Localização: `src/app/pages/habitos/HabitosListPage.tsx`
- Lista hábitos ativos, pausados, concluídos
- Botões para criar, editar, pausar, excluir

### 6.3 HabitoCreatePage
- Localização: `src/app/pages/habitos/HabitoCreatePage.tsx`
- Formulário completo de criação

### 6.4 HabitoDetailPage
- Localização: `src/app/pages/habitos/HabitoDetailPage.tsx`
- Detalhes do hábito com estatísticas

### 6.5 Integração na AgendaHojePage
- Nova seção "Hábitos do Dia"
- Lista hábitos que devem ser feitos hoje
- Checkbox para completar e atualizar streak

---

## 7. Rotas

```typescript
// Hábitos
{ path: '/habitos', Component: HabitosListPage },
{ path: '/habitos/criar', Component: HabitoCreatePage },
{ path: '/habitos/:id', Component: HabitoDetailPage },
{ path: '/habitos/:id/editar', Component: HabitoEditPage },
```

---

## 8. Validações

### 8.1 Criação de Hábito
- `titulo`: obrigatório, max 200 caracteres
- `data_inicio`: obrigatória, não pode ser anterior a hoje
- `data_fim`: obrigatória, deve ser posterior a data_inicio
- `dias_semana`: obrigatório, pelo menos 1 dia selecionado

### 8.2 Geração de Tarefas
- Não gerar tarefas duplicadas para o mesmo hábito/data
- Verificar se já existem tarefas para o hábito antes de gerar

---

## 9. Verificação de Expiração

Executar ao carregar a Agenda Hoje:

```typescript
async function verificarHabitosExpirados(userId: string) {
  const hoje = new Date().toISOString().split('T')[0];
  
  await supabase
    .from('habitos')
    .update({ status: 'expirada' })
    .eq('user_id', userId)
    .eq('status', 'ativa')
    .lt('data_fim', hoje);
}
```

---

## 10. Checklist de Implementação

- [ ] Adicionar tipo `habitos` em `src/lib/supabase.ts`
- [ ] Adicionar campo `habito_id` em `tarefas`
- [ ] Criar `src/services/habitosService.ts`
- [ ] Adicionar rotas em `src/app/routes.ts`
- [ ] Criar `HabitosListPage.tsx`
- [ ] Criar `HabitoCreatePage.tsx`
- [ ] Criar `HabitoDetailPage.tsx`
- [ ] Criar `HabitoEditPage.tsx`
- [ ] Integrar na `AgendaHojePage.tsx`
- [ ] Testar criação de hábito
- [ ] Testar geração de tarefas
- [ ] Testar atualização de streak
- [ ] Testar expiração

---

## 11. Riscos e Mitigações

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| Tarefas duplicadas | Alta | Verificar existência antes de gerar |
| Streak quebrado ao meio-dia | Média | Usar data local, não UTC |
| Muitos hábitos = muitas tarefas | Média | Limitar geração a 30 dias ahead |

---

## 12. Referências

- ** PRD:** `tracking/plans/PLAN-Sprint-03-Habitos.md`
- **Tarefas Service:** `src/services/tarefasService.ts`
- **Agenda Hoje:** `src/app/pages/agenda/AgendaHojePage.tsx`
- **Supabase Types:** `src/lib/supabase.ts`

---

## 13. Histórico

| Data | Versão | Descrição |
|------|--------|-----------|
| 07/04/2026 | 1.0 | Versão inicial |
