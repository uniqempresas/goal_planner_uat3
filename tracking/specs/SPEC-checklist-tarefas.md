# SPEC: Checklist de Itens em Tarefas

## Visão Geral

Implementar sistema de checklist/itens dentro de tarefas, permitindo que cada tarefa tenha uma lista de sub-itens que compõe sua conclusão.

---

## Requisitos Funcionais

### RF-001: Criação de Itens
- Usuário pode adicionar itens ao criar uma tarefa
- Usuário pode adicionar itens ao editar uma tarefa
- Cada item tem: nome (obrigatório), ordem (automática), status (concluído/não)

### RF-002: Visualização na Lista
- Tarefas com itens mostram ícone indicador
- Tarefas com itens mostram progresso (ex: "2/4")
- Ao clicar na tarefa, abre detalhes com os itens

### RF-003: Gerenciamento de Itens
- Marcar item como concluído (toggle)
- Editar nome do item
- Excluir item
- Reordenar itens (opcional - ordem alfabética por padrão)

### RF-004: Progresso Automático
- Progresso da tarefa = (itens concluídos / total de itens) * 100
- Se tarefa não tiver itens, mantém progresso manual atual
- Atualização em tempo real ao marcar itens

---

## Estrutura de Dados

### Banco - Tabela: tarefa_itens
```sql
CREATE TABLE tarefa_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tarefa_id UUID NOT NULL REFERENCES tarefas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### TypeScript - Interfaces
```typescript
interface TarefaItem {
  id: string;
  tarefa_id: string;
  nome: string;
  ordem: number;
  completed: boolean;
  created_at: string;
}

interface TarefaUI {
  // ... campos existentes
  itens?: TarefaItem[];
  itensCount?: number;
  itensCompleted?: number;
}
```

---

## Componentes a Criar

### 1. TarefaItensList (src/app/components/agenda/TarefaItensList.tsx)
- Lista de itens com checkboxes
- Botão para adicionar novo item
- Mostra progresso (ex: "2/4")

### 2. TarefaItemRow (src/app/components/agenda/TarefaItemRow.tsx)
- Linha individual de item
- Checkbox para toggle
- Botão de excluir
- Input para editar nome

---

## Integrações

### TarefaCreatePage.tsx
- Seção "Itens da Tarefa" (opcional)
- Campo de input para adicionar itens
- Lista de itens já adicionados

### TarefaEditPage.tsx
- Seção "Itens da Tarefa"
- Mesmo UI da criação

### TaskItem (ou componente de listagem)
- Ícone indicador se tem itens
- Badge de progresso

---

## Algoritmos

### Cálculo de Progresso
```typescript
function calcularProgressoTarefa(itens: TarefaItem[]): number {
  if (itens.length === 0) return 0;
  const concluidos = itens.filter(i => i.completed).length;
  return Math.round((concluidos / itens.length) * 100);
}
```

### Toggle Item
```typescript
async function toggleItem(itemId: string) {
  // 1. Atualiza item no banco
  // 2. Recalcula progresso da tarefa
  // 3. Atualiza UI
}
```

---

## Fluxo de Implementação (Ordenado)

### Fase 1: Banco
1. [ ] Criar migration SQL `tarefa_itens`
2. [ ] Aplicar migration no Supabase

### Fase 2: Backend
3. [ ] Definir tipos em `src/lib/supabase.ts`
4. [ ] Criar `src/services/tarefaItensService.ts`
5. [ ] Adicionar métodos CRUD

### Fase 3: Mapeamento
6. [ ] Atualizar `src/lib/mapeamento.ts` - mapTarefaToUI

### Fase 4: Componentes UI
7. [ ] Criar `TarefaItensList.tsx`
8. [ ] Criar `TarefaItemRow.tsx`

### Fase 5: Integração Criação
9. [ ] Adicionar UI em `TarefaCreatePage.tsx`

### Fase 6: Integração Edição
10. [ ] Adicionar UI em `TarefaEditPage.tsx`

### Fase 7: Lista de Tarefas
11. [ ] Atualizar visualização na lista (ícone + progresso)

### Fase 8: Testes
12. [ ] Testes manuais via Chrome DevTools

---

## Critérios de Validação

- [ ] Criar tarefa com itens funciona
- [ ] Editar tarefa e adicionar itens funciona  
- [ ] Marcar item como concluído atualiza progresso
- [ ] Ícone aparece na lista de tarefas
- [ ] Progresso mostra corretamente (ex: "2/4")
- [ ] Excluir tarefa remove itens em cascata

---

## Dependências

- Supabase (banco de dados)
- React Hook Form (formulários)
- Lucide React (ícones)

---

## Observações

- Itens não têm data/hora - apenas nome e status
- Ordem é automática (alfabética ou criação)
- Exclusão em cascata: se excluir tarefa, exclui itens
- Progresso manual da tarefa é sobrescrito se tiver itens