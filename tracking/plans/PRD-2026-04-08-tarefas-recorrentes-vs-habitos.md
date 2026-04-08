---
date: 2026-04-08T00:00:00-03:00
researcher: Neo
branch: main
git_commit: bfc8fe1
repository: goal_planner_uat3
topic: "Tarefas Recorrentes vs Hábitos - Estado Atual da Implementação"
tags: [research, tarefas, habitos, recorrencia, agenda]
status: complete
last_updated: 2026-04-08
last_updated_by: Neo
---

# Pesquisa: Tarefas Recorrentes vs Hábitos - Estado Atual da Implementação

**Data**: 2026-04-08  
**Researcher**: Neo  
**Git Commit**: bfc8fe1  
**Branch**: main  
**Repository**: goal_planner_uat3

---

## 🎯 Resumo Executivo

| Funcionalidade | Status | Detalhes |
|----------------|--------|----------|
| **Tarefas Recorrentes** | ⚠️ **Parcial** | Campo básico existe, mas com bugs e funcionalidade limitada |
| **Hábitos** | ✅ **Completo** | Implementação robusta com todas as funcionalidades |

**Conclusão**: O sistema possui **Tarefas Recorrentes implementadas parcialmente** (com bugs) e **Hábitos completamente implementados**. A principal diferença conceitual está respeitada: hábitos são ações de rotina pessoal com tracking, enquanto tarefas recorrentes são ações específicas que se repetem.

---

## 1. TAREFAS RECORRENTES - Estado Atual

### ✅ O QUE EXISTE (Implementado)

#### 1.1 Schema do Banco de Dados
**Arquivo**: `src/lib/supabase.ts:122`

```typescript
recorrencia: 'nenhuma' | 'diaria' | 'semanal';
```

**Campos disponíveis:**
- `nenhuma` - Não repetir (padrão)
- `diaria` - Todo dia
- `semanal` - Toda semana

#### 1.2 Schema de Validação (Zod)
**Arquivo**: `src/app/pages/agenda/tarefaFormSchema.ts:11`

```typescript
recorrencia: z.enum(['nenhuma', 'diaria', 'semanal']).default('nenhuma'),
```

#### 1.3 UI de Criação
**Arquivo**: `src/app/pages/agenda/TarefaCreatePage.tsx`
- **Linha 46**: Valor padrão `'nenhuma'` no formulário
- **Linhas 274-296**: Campo de seleção de recorrência com interface completa
- **Linha 70**: Envio do campo `recorrencia` ao criar tarefa

```tsx
<FormField name="recorrencia">
  <FormLabel>Repetição</FormLabel>
  <Select>
    <SelectItem value="nenhuma">Não repetir</SelectItem>
    <SelectItem value="diaria">Todo dia</SelectItem>
    <SelectItem value="semanal">Toda semana</SelectItem>
  </Select>
</FormField>
```

#### 1.4 UI de Edição
**Arquivo**: `src/app/pages/agenda/TarefaEditPage.tsx`
- **Linha 33**: Schema de validação com recorrência
- **Linha 62**: Valor padrão `'nenhuma'`
- **Linhas 337-359**: Campo de seleção de recorrência

---

### ❌ PROBLEMAS IDENTIFICADOS

#### 🔴 **BUG CRÍTICO - Erro de Digitação**
**Arquivo**: `src/app/pages/agenda/TarefaEditPage.tsx`
- **Linha 80**: `recurrencia` (com "e" em vez de "o")
- **Linha 99**: `recurrencia` novamente

**Impacto**: A edição de recorrência não funciona corretamente porque o campo está com nome errado.

#### 🟡 **Campo Não Mapeado na UI**
**Arquivo**: `src/lib/mapeamento.ts:13-25`

A interface `TarefaUI` **NÃO inclui** o campo `recorrencia`:

```typescript
export interface TarefaUI {
  id: string;
  metaId?: string;
  title: string;
  description?: string;
  block: TimeBlock;
  hora?: string;
  priority?: Priority;
  completed: boolean;
  data: string;
  isOneThing: boolean;
  notes?: string;
  // ❌ recorrencia não está aqui
}
```

**Impacto**: A recorrência não é exibida na interface de lista/agenda.

#### 🟡 **Não Exibido na Página de Detalhes**
**Arquivo**: `src/app/pages/agenda/TarefaDetailPage.tsx`

A recorrência **NÃO é exibida** na visualização de detalhes da tarefa.

#### 🟢 **Funcionalidade Limitada**
- Apenas 3 opções (falta: mensal, anual, personalizada)
- Sem campos avançados:
  - Data de início/fim da recorrência
  - Dias específicos da semana
  - Frequência customizada (a cada X dias/semanas)
  - Contador de repetições

---

### 📊 Status das Funcionalidades de Recorrência

| Funcionalidade | Status | Observação |
|----------------|--------|------------|
| Campo no banco de dados | ✅ Sim | `recorrencia: 'nenhuma' \| 'diaria' \| 'semanal'` |
| Campo no formulário de criação | ✅ Sim | Funcionando |
| Campo no formulário de edição | ⚠️ Parcial | Bug de digitação |
| Exibição na lista/agenda | ❌ Não | Campo não mapeado na UI |
| Exibição em detalhes | ❌ Não | Não implementado |
| Geração de instâncias | ❌ Não | Não há lógica de repetição |
| Edição em lote | ❌ Não | Não implementado |
| Opção "mensal" | ❌ Não | Apenas diária/semanal |
| Opção "anual" | ❌ Não | Não existe |

---

## 2. HÁBITOS - Estado Atual

### ✅ IMPLEMENTAÇÃO COMPLETA

#### 2.1 Estrutura de Páginas
**Diretório**: `src/app/pages/habitos/`

| Página | Arquivo | Funcionalidade |
|--------|---------|----------------|
| Listagem | `HabitosListPage.tsx` | Lista com filtros (todos/ativos/pausados/concluídos) |
| Criação | `HabitoCreatePage.tsx` | Formulário completo |
| Edição | `HabitoEditPage.tsx` | Edição com dados existentes |
| Detalhes | `HabitoDetailPage.tsx` | Visualização completa com estatísticas |

#### 2.2 Modelo de Dados Completo
**Arquivo**: `src/lib/supabase.ts` (tabela `habitos`)

**Campos Principais:**
- `id`, `user_id`, `titulo`, `descricao`

**Periodicidade e Agendamento:**
- `data_inicio`: Data de início (YYYY-MM-DD)
- `data_fim`: Data de término (YYYY-MM-DD)
- `dias_semana`: Array de 0-6 (0=Segunda, 6=Domingo)
- `hora`: Horário opcional (HH:MM)
- `bloco`: Time block ('one-thing', 'manha', 'tarde', 'noite')

**Streak e Tracking:**
- `streak_atual`: Sequência atual de dias consecutivos
- `melhor_streak`: Maior sequência já alcançada
- `ultima_conclusao`: Data da última conclusão

**Organização:**
- `meta_id`: Vinculação a meta
- `prioridade`: 'alta', 'media', 'baixa'
- `status`: 'ativa', 'pausada', 'concluida', 'expirada'

#### 2.3 Funcionalidades Especiais Implementadas

##### 🔥 Sistema de Streak
**Serviço**: `src/services/habitosService.ts`

- **`toggleStreak(id)`**: Marca/desmarca hábito como feito hoje
  - Previne duplicatas (verifica se já foi concluído hoje)
  - Calcula streak automaticamente:
    - Se concluído ontem: incrementa streak atual
    - Se não: reinicia streak para 1
  - Atualiza melhor_streak se streak_atual superar

##### 🔄 Geração Automática de Tarefas
**Local**: `habitosService.ts:gerarTarefas()`

- Cria tarefas automaticamente a partir do hábito
- Gerado no momento da criação do hábito
- Cria tarefas para cada dia do período que corresponda aos `dias_semana`
- Limitado a 30 dias à frente (performance)
- Evita duplicatas verificando tarefas existentes
- Vincula tarefas ao hábito via `habito_id`

##### ⏰ Verificação de Expiração
- `verificarExpirados(userId)`: Marca hábitos como 'expirada' quando `data_fim` < hoje
- Executado automaticamente no carregamento da agenda

##### 📊 Estatísticas
- `getEstatisticas(userId)`: Retorna contagem por status (total, ativos, concluidos, pausados)

#### 2.4 Integração com Agenda
**Arquivo**: `src/app/pages/agenda/AgendaHojePage.tsx`

- Bloco especial **"Hábitos"** no Time Blocking
- Exibe hábitos ativos para o dia atual
- Mostra: título, horário, streak atual
- Permite marcar como concluído diretamente na agenda
- Link para criar novo hábito quando vazio

---

### 📊 Status das Funcionalidades de Hábitos

| Funcionalidade | Status | Observação |
|----------------|--------|------------|
| CRUD Completo | ✅ Sim | 4 páginas implementadas |
| Filtros por status | ✅ Sim | Todos/Ativos/Pausados/Concluídos |
| Periodicidade (dias da semana) | ✅ Sim | Array de 0-6 |
| Agendamento (data início/fim) | ✅ Sim | Completo |
| Streak/Tracking | ✅ Sim | Sistema completo |
| Pausar/Continuar | ✅ Sim | Funcionalidade implementada |
| Expiração automática | ✅ Sim | Verificação automática |
| Geração de tarefas | ✅ Sim | Automático ao criar hábito |
| Priorização | ✅ Sim | Alta/média/baixa |
| Time Blocking | ✅ Sim | Integrado com agenda |
| Vinculação a metas | ✅ Sim | FK para metas |
| Visualização na agenda | ✅ Sim | Bloco de hábitos |
| Estatísticas | ✅ Sim | Contagem por status |

---

## 3. DIFERENÇA CONCEITUAL - Implementada Corretamente ✅

### 🎯 Hábitos
**Conceito**: Ações de rotina pessoal que fazem parte da identidade do usuário  
**Exemplos**: Meditar, beber água, exercício, ler  
**Características**:
- ✅ Tracking diário com streak
- ✅ Foco em consistência e sequência
- ✅ Dias da semana específicos
- ✅ Geração de tarefas automática
- ✅ Sistema de pausar/continuar

### 📋 Tarefas Recorrentes
**Conceito**: Ações específicas que se repetem no tempo  
**Exemplos**: Reunião toda segunda, pagar conta dia 15, relatório mensal  
**Características**:
- ⚠️ Campo básico de recorrência existe
- ❌ Sem geração de instâncias
- ❌ Sem campos avançados (data fim, frequência customizada)

---

## 4. O QUE FALTA IMPLEMENTAR (Tarefas Recorrentes)

### 🔴 Prioridade Alta (Bugs)
1. **Corrigir erro de digitação** em `TarefaEditPage.tsx` (linhas 80 e 99)
   - `recurrencia` → `recorrencia`

### 🟡 Prioridade Média (Funcionalidade Básica)
2. **Adicionar campo `recorrencia`** na interface `TarefaUI` (`mapeamento.ts`)
3. **Exibir recorrência** na página de detalhes da tarefa
4. **Exibir recorrência** na lista/agenda de tarefas

### 🟢 Prioridade Baixa (Melhorias)
5. **Adicionar opção "mensal"** ao campo de recorrência
6. **Adicionar campos avançados**:
   - Data de início/fim da recorrência
   - Dias específicos da semana (para recorrência semanal)
   - Frequência customizada (a cada X dias/semanas/meses)
   - Contador de repetições
7. **Implementar geração de instâncias** (lógica de repetição real)
8. **Edição em lote** (editar todas as instâncias ou apenas uma)

---

## 5. REFERÊNCIAS DE CÓDIGO

### Tarefas Recorrentes
- Schema do banco: `src/lib/supabase.ts:122`
- Schema Zod: `src/app/pages/agenda/tarefaFormSchema.ts:11`
- Criação: `src/app/pages/agenda/TarefaCreatePage.tsx:274-296`
- Edição (com bug): `src/app/pages/agenda/TarefaEditPage.tsx:337-359`
- Interface UI: `src/lib/mapeamento.ts:13-25`

### Hábitos
- Páginas: `src/app/pages/habitos/`
- Serviço: `src/services/habitosService.ts`
- Schema do banco: `src/lib/supabase.ts` (tabela `habitos`)
- Integração agenda: `src/app/pages/agenda/AgendaHojePage.tsx`

---

## 6. CONCLUSÃO

### ✅ Implementado
- **Hábitos**: Implementação completa e robusta
- **Tarefas Recorrentes**: Campo básico existe no banco e nos formulários

### ⚠️ Problemas Atuais
- Bug crítico de digitação impede edição de recorrência
- Recorrência não é exibida na interface
- Funcionalidade limitada (apenas diária/semanal)

### 📝 Recomendação
O sistema já faz a **distinção conceitual correta** entre Hábitos e Tarefas Recorrentes. Para tornar as Tarefas Recorrentes totalmente funcionais, é necessário:
1. Corrigir o bug de digitação (5 minutos)
2. Adicionar o campo na interface UI (10 minutos)
3. Implementar lógica de geração de instâncias (trabalho maior)

---

*Documento gerado em: 2026-04-08*  
*Pesquisador: Neo*  
*Commit: bfc8fe1*