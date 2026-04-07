# PRD: Sistema de Hábitos

**Data:** 07 de Abril de 2026  
**Projeto:** Goal Planner  
**Versão:** 1.0  
**Tipo:** Produto / Funcionalidade  
**Status:** Rascunho

---

## 1. Problema

O Goal Planner atualmente permite criar Metas Diárias e Tarefas avulsas, mas não oferece uma forma estruturada de criar **hábitos** - ações que o usuário quer realizar repetidamente por um período específico (ex: "Exercitar por 40 dias", "Meditar todos os dias por 30 dias").

**Casos de uso:**
- Criar um novo hábito de 30/60/90 dias
- Acompanhar sequência de dias consecutivos (streak)
- Visualizar progresso do hábito
- O hábito gerar tarefas automaticamente nos dias definidos
- O hábito expirar automaticamente após o período

---

## 2. Objetivos

- Permitir criação de hábitos com data de início e fim
- Permitir selecionar dias da semana para o hábito (ex: seg, qua, sex)
- Gerar tarefas automaticamente nos dias definidos
- Tracking de streak (dias consecutivos)
- Exibição de hábitos ativos na Agenda Hoje
- Expiração automática após data_fim
- Interface para gerenciar hábitos (criar, editar, pausar, excluir)

---

## 3. Requisitos Funcionais

### 3.1 Criação de Hábito
- [ ] Título do hábito (obrigatório)
- [ ] Descrição (opcional)
- [ ] Data de início (padrão: hoje)
- [ ] Data de fim (obrigatório - ex: +40 dias)
- [ ] Dias da semana (checkboxes: seg, ter, qua, qui, sex, sáb, dom)
- [ ] Horário (opcional)
- [ ] Bloco de tempo (one-thing, manhã, tarde, noite)
- [ ] Meta vinculada (opcional)
- [ ] Prioridade (alta, média, baixa)

### 3.2 Gestão de Hábito
- [ ] Listar hábitos ativos
- [ ] Editar hábito
- [ ] Pausar hábito (não gera tarefas temporariamente)
- [ ] Reativar hábito pausado
- [ ] Excluir hábito

### 3.3 Geração de Tarefas
- [ ] Gerar tarefa automaticamente no dia definido
- [ ] Tarefa vinculada ao hábito (campo `habito_id`)
- [ ] Marcar tarefa como concluída atualiza streak

### 3.4 Tracking de Streak
- [ ] Contador de dias consecutivos
- [ ] Melhor sequência (all-time)
- [ ] Visualização do streak na Agenda Hoje

### 3.5 Exibição na Agenda Hoje
- [ ] Seção de Hábitos Ativos
- [ ] Mostrar streak atual
- [ ] Checkbox para concluir hábito do dia
- [ ] Expiração automática quando data_fim < hoje

---

## 4. Requisitos Não Funcionais

- **Performance:** Geração de tarefas < 100ms
- **UX:** Feedback visual imediato ao completar hábito
- **Dados:** Persistência completa no Supabase

---

## 5. Modelo de Dados (Tabela: habitos)

```sql
CREATE TABLE habitos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  dias_semana INTEGER[], -- [1,2,3,4,5] = seg à sex
  hora TIME,
  bloco TEXT, -- 'one-thing', 'manha', 'tarde', 'noite'
  meta_id UUID REFERENCES metas(id),
  prioridade TEXT DEFAULT 'media',
  status TEXT DEFAULT 'ativa', -- 'ativa', 'pausada', 'concluida', 'expirada'
  streak_atual INTEGER DEFAULT 0,
  melhor_streak INTEGER DEFAULT 0,
  ultima_conclusao DATE,
  created_at TIMESTAMP DEFAULT now()
);
```

---

## 6. Fluxo de Usuário

### Criar Hábito
1. Usuário acessa "Hábitos" no menu
2. Clica em "Novo Hábito"
3. Preenche formulário:
   - Título: "Exercitar"
   - Data fim: +40 dias
   - Dias: seg, qua, sex
   - Horário: 07:00
   - Bloco: Manhã
4. Clica "Criar Hábito"
5. Sistema gera tarefas para os próximos 40 dias

### Usar Hábito
1. Usuário acessa Agenda Hoje
2. Vê seção "Hábitos" com hábitos do dia
3. Completa o hábito (checkbox)
4. Sistema atualiza streak

---

## 7. Tarefas Geradas

Cada hábito gera tarefas na tabela `tarefas` com campo adicional `habito_id`:

```sql
ALTER TABLE tarefas ADD COLUMN habito_id UUID REFERENCES habitos(id);
```

A tarefa gerada:
- `titulo`: título do hábito
- `data`: data do dia específico
- `hora`: hora definida no hábito
- `bloco`: bloco definido no hábito
- `habito_id`: ID do hábito origem
- `recorrencia`: 'nenhuma' (já que é gerada especificamente)

---

## 8. Expiração

Quando `data_fim < hoje`:
1. Status do hábito muda para 'expirada'
2. Não gera mais tarefas
3. Histórico mantido para referência

---

## 9. Casos de Borda

- **Hábito sem dias selecionados:** Validar que pelo menos 1 dia está marcado
- **Data_fim anterior a data_inicio:** Validar no formulário
- **Usuário deleta hábito com tarefas geradas:** Manter tarefas, apenas desvincular
- **Streak quebrado:** Se o usuário não completou até meia-noite, streak zera

---

## 10. Critérios de Aceitação

### Dado que o usuário cria um hábito de 40 dias
### Quando o hábito é criado com dias seg, qua, sex
### E o usuário acessa a Agenda Hoje
### Então deve aparecer tarefa do hábito nos dias seg, qua, sex
### E ao completar, o streak aumenta

### Dado que o hábito está com data_fim < hoje
### Quando o usuário acessa Agenda Hoje
### Então o hábito não aparece mais na lista ativa
### E o status muda para 'expirada'

---

## 11. Referências

- **Tabela tarefas:** `src/lib/supabase.ts`
- **Serviço tarefas:** `src/services/tarefasService.ts`
- **Agenda Hoje:** `src/app/pages/agenda/AgendaHojePage.tsx`

---

## 12. Histórico

| Data | Versão | Descrição |
|------|--------|-----------|
| 07/04/2026 | 1.0 | Versão inicial do documento |
