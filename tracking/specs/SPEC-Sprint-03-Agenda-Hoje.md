# SPEC: Agenda Hoje com Dados Reais

**Data:** 07 de Abril de 2026  
**Projeto:** Goal Planner  
**Versão:** 1.0  
**Tipo:** Técnica / Implementação  
**Status:** Rascunho

---

## 1. Visão Geral

Esta especificação detalha a implementação técnica para conectar a página Agenda Hoje aos dados reais do Supabase, mantendo o layout visual existente.

---

## 2. Estrutura de Dados

### 2.1 Tipo Tarefa (Banco)

```typescript
type TarefaDB = {
  id: string;
  user_id: string | null;
  meta_id: string | null;
  titulo: string;
  descricao: string | null;
  bloco: 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
  hora: string | null;
  prioridade: 'alta' | 'media' | 'baixa';
  completed: boolean;
  data: string;
  recorrencia: 'nenhuma' | 'diaria' | 'semanal';
  created_at: string;
};
```

### 2.2 Tipo Tarefa (UI - Frontend)

```typescript
type TarefaUI = {
  id: string;
  metaId?: string;
  title: string;
  description?: string;
  block: TimeBlock; // 'oneThing' | 'atrasadas' | 'manha' | 'tarde' | 'noite' | 'habitos' | 'recorrentes'
  hora?: string;
  priority?: 'high' | 'medium' | 'low';
  completed: boolean;
  data: string;
  isOneThing: boolean;
  notes?: string;
};
```

### 2.3 Mapeamento Banco → UI

```typescript
const mapTarefaToUI = (tarefa: TarefaDB): TarefaUI => {
  // Map bloco
  const blockMap: Record<string, TimeBlock> = {
    'one-thing': 'oneThing',
    'manha': 'manha',
    'tarde': 'tarde',
    'noite': 'noite',
  };
  
  // Map prioridade
  const priorityMap: Record<string, string> = {
    'alta': 'high',
    'media': 'medium',
    'baixa': 'low',
  };
  
  return {
    id: tarefa.id,
    metaId: tarefa.meta_id || undefined,
    title: tarefa.titulo,
    description: tarefa.descricao || undefined,
    block: blockMap[tarefa.bloco || ''] || 'recorrentes',
    hora: tarefa.hora || undefined,
    priority: priorityMap[tarefa.prioridade] as 'high' | 'medium' | 'low',
    completed: tarefa.completed,
    data: tarefa.data,
    isOneThing: tarefa.bloco === 'one-thing',
    notes: tarefa.descricao || undefined,
  };
};
```

---

## 3. Componentes a Modificar

### 3.1 AppContext.tsx

**Problema:** O contexto já tem os dados, mas vamos verificar se o mapeamento está correto.

```typescript
// Verificar se loadTarefas retorna dados corretos
const loadTarefas = useCallback(async (data?: string) => {
  if (!user) return;
  try {
    const dataParam = data || new Date().toISOString().split('T')[0];
    const tarefas = await tarefasService.getByData(user.id, dataParam);
    // TODO: Aplicar mapeamento aqui se necessário
    setTarefasHoje(tarefas);
  } catch (error) {
    console.error('Erro ao carregar tarefas:', error);
  }
}, [user]);
```

### 3.2 AgendaHojePage.tsx

**Modificações necessárias:**

1. **Linha 49:** Trocar `tarefa.title` por `tarefa.titulo`
2. **Linha 66:** Trocar `meta.title` por `meta.titulo`
3. **Demais linhas:** Verificar uso de campos mock

### 3.3 TimeBlockSection

O componente espera um campo `block` que pode não existir nos dados reais. Verificar lógica:

```typescript
// Antes (mock)
tarefas={tarefasHoje.filter(t => t.block === block)}

// Depois (real)
// O campo 'bloco' do banco precisa ser mapeado para 'block' da UI
```

---

## 4. Implementação em Duas Abordagens

### Abordagem A: Mapeamento no Context (Recomendada)

Modificar o `AppContext` para aplicar o mapeamento antes de armazenar no estado.

**Prós:**
- Centraliza a lógica de transformação
- Componentes UI não precisam saber detalhes do banco
- Mantém compatibilidade com outros componentes

**Contras:**
- Requer alteração no Context

### Abordagem B: Mapeamento na Página

Aplicar o mapeamento diretamente na `AgendaHojePage`.

**Prós:**
- Menos risco para outros componentes
- Implementação rápida

**Contras:**
- Lógica distribuída
- Outros componentes podem ter o mesmo problema

---

## 5. Detalhes de Implementação

### 5.1 Configuração de Blocos

O arquivo `src/app/data/mockData.ts` define a configuração dos blocos:

```typescript
export const blockConfig: Record<TimeBlock, {
  label: string;
  color: string;
  borderColor: string;
  bgColor: string;
}> = {
  oneThing: {
    label: 'ONE Thing',
    color: '#F59E0B',
    borderColor: '#F59E0B',
    bgColor: '#FFFBEB',
  },
  atrasadas: {
    label: 'Atrasadas',
    color: '#EF4444',
    borderColor: '#EF4444',
    bgColor: '#FEF2F2',
  },
  manha: {
    label: 'Manhã',
    color: '#F59E0B',
    borderColor: '#F59E0B',
    bgColor: '#FFFBEB',
  },
  // ...outros blocos
};
```

**Problema:** O banco tem `one-thing`, mas a UI espera `oneThing`.

**Solução:** Criar utilitário de mapeamento.

### 5.2 Campos Opcionais

Verificar campos que podem ser `null`:

- `hora`: pode ser `null`
- `descricao`: pode ser `null`
- `bloco`: pode ser `null`
- `meta_id`: pode ser `null`

### 5.3 Ordernação

O service já retorna ordenado por `hora`. Verificar se a ordem dos blocos está correta:

```typescript
const blockOrder: TimeBlock[] = [
  'oneThing',
  'atrasadas',
  'manha',
  'tarde',
  'noite',
  'habitos',
  'recorrentes'
];
```

---

## 6. Testes

### 6.1 Teste de Carregamento

1. Criar tarefa no banco para hoje
2. Acessar página Agenda Hoje
3. Verificar se tarefa aparece

### 6.2 Teste de Toggle

1. Clicar no checkbox de uma tarefa
2. Verificar mudança visual imediata
3. Recarregar página
4. Verificar que tarefa permanece marcada

### 6.3 Teste de Campos

1. Criar tarefa com título, descrição, hora, prioridade
2. Verificar que todos os campos aparecem corretamente
3. Verificar que优先级 é exibida com a cor correta

---

## 7. Referências

- **Arquivo mockData:** `src/app/data/mockData.ts` (linhas ~60-120)
- **AgendaHojePage:** `src/app/pages/agenda/AgendaHojePage.tsx`
- **AppContext:** `src/app/contexts/AppContext.tsx` (linhas 130-151)
- **tarefasService:** `src/services/tarefasService.ts` (linhas 21-31)

---

## 8. Checklist de Implementação

- [ ] Criar utilitário de mapeamento `mapBlocoToUI`
- [ ] Criar utilitário de mapeamento `mapPrioridadeToUI`
- [ ] Atualizar `AppContext.loadTarefas` para aplicar mapeamento
- [ ] Atualizar `AgendaHojePage` para usar `tarefa.titulo` (ou verificar se mapeamento resolve)
- [ ] Atualizar `TarefaItem` para exibir dados reais
- [ ] Testar carregamento de tarefas
- [ ] Testar toggle de conclusão
- [ ] Testar vinculação com metas

---

## 9. Riscos e Mitigações

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| Dados não aparecem | Alta | Verificar console e formato da data |
| Toggle não persiste | Alta | Confirmar chamada API no service |
| Erro de tipos | Média | Verificar tipos TypeScript |
| Quebrar outras páginas | Média | Testar Agenda Semana |

---

## 10. Histórico

| Data | Versão | Descrição |
|------|--------|-----------|
| 07/04/2026 | 1.0 | Versão inicial |
