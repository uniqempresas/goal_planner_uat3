---
date: 2026-04-10
planner: Vibe Planner
branch: main
repository: goal_planner_uat3
topic: "Sistema de Tarefas Recorrentes - Especificação Técnica"
tags: [spec, tarefas, recorrencia, implementacao]
status: draft
based_on: PRD-2026-04-08-tarefas-recorrentes-vs-habitos.md
---

# SPEC: Sistema de Tarefas Recorrentes

**Data**: 2026-04-10  
**Planner**: Vibe Planner  
**Branch**: main  
**Baseado em**: PRD-2026-04-08-tarefas-recorrentes-vs-habitos.md

---

## 📋 Sumário Executivo

Esta especificação técnica detalha a implementação completa do sistema de Tarefas Recorrentes no Goal Planner, expandindo as funcionalidades existentes (campo `recorrencia` com valores básicos) para suportar recorrências complexas com geração automática de instâncias.

---

## 1. Estrutura de Dados

### 1.1 Alterações no Banco de Dados

#### Tabela `tarefas` - Campos Novos

```sql
-- Migração: expandir campo recorrencia e adicionar metadados
ALTER TABLE tarefas 
DROP CONSTRAINT IF EXISTS tarefas_recorrencia_check;

-- Novo campo JSON para armazenar configuração completa da recorrência
ALTER TABLE tarefas ADD COLUMN IF NOT EXISTS recorrencia_config JSONB DEFAULT NULL;

-- Campo para identificar tarefa "mãe" (template)
ALTER TABLE tarefas ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES tarefas(id) DEFAULT NULL;

-- Campo para identificar se é uma tarefa template
ALTER TABLE tarefas ADD COLUMN IF NOT EXISTS is_template BOOLEAN DEFAULT FALSE;

-- Campo para data de término da recorrência
ALTER TABLE tarefas ADD COLUMN IF NOT EXISTS data_fim_recorrencia DATE DEFAULT NULL;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_tarefas_parent_id ON tarefas(parent_id);
CREATE INDEX IF NOT EXISTS idx_tarefas_is_template ON tarefas(is_template);
CREATE INDEX IF NOT EXISTS idx_tarefas_recorrencia_config ON tarefas USING GIN(recorrencia_config);
```

#### Estrutura do JSON `recorrencia_config`

```typescript
interface RecorrenciaConfig {
  // Tipo de recorrência
  tipo: 'unica' | 'diaria' | 'semanal' | 'mensal' | 'anual' | 'intervalo_dias';
  
  // Para recorrência semanal: dias específicos [0-6] onde 0=Seg, 6=Dom
  dias_semana?: number[];
  
  // Para recorrência mensal: dia do mês (1-31)
  dia_mes?: number;
  
  // Para recorrência anual: mês (0-11) e dia
  mes_ano?: number;
  dia_ano?: number;
  
  // Para intervalo personalizado: a cada X dias
  intervalo_dias?: number;
  
  // Data de início da recorrência (padrão: data da tarefa)
  data_inicio?: string; // YYYY-MM-DD
  
  // Data de término (opcional)
  data_fim?: string; // YYYY-MM-DD
  
  // Número máximo de ocorrências (opcional)
  max_ocorrencias?: number;
}
```

**Exemplos de Configuração:**

```json
// Toda sexta-feira
{
  "tipo": "semanal",
  "dias_semana": [4]
}

// Segunda, quarta e sexta
{
  "tipo": "semanal",
  "dias_semana": [0, 2, 4]
}

// A cada 3 dias
{
  "tipo": "intervalo_dias",
  "intervalo_dias": 3
}

// Todo dia 15 do mês
{
  "tipo": "mensal",
  "dia_mes": 15
}

// Todo ano em 25/12
{
  "tipo": "anual",
  "mes_ano": 11,
  "dia_ano": 25
}

// Diária por 30 dias
{
  "tipo": "diaria",
  "data_fim": "2026-05-10"
}
```

### 1.2 Diferença: Tarefa Mãe vs Instâncias

| Característica | Tarefa Mãe (Template) | Instâncias (Filhas) |
|----------------|----------------------|---------------------|
| `is_template` | `true` | `false` |
| `parent_id` | `null` | UUID da mãe |
| `recorrencia_config` | Config completa | `null` (ou cópia) |
| `data` | Data de início | Data específica |
| Permite edição em lote | Sim (propaga) | Sim (avisa usuário) |
| Excluir | Cancela toda série | Remove apenas essa |
| Completar | N/A | Marca individual |

**Fluxo de Criação:**
1. Usuário cria tarefa com recorrência
2. Sistema cria **tarefa mãe** (`is_template=true`)
3. Sistema gera **instâncias** para o período configurado
4. Cada instância tem `parent_id` apontando para a mãe

---

## 2. Tipos de Recorrência Suportados

### 2.1 Matriz de Funcionalidades

| Tipo | Descrição | Configuração | Exemplo |
|------|-----------|--------------|---------|
| **única** | Não repete | - | Tarefa normal |
| **diaria** | Todo dia | `data_fim` opcional | "Todo dia até 31/12" |
| **semanal** | Dias específicos | `dias_semana: number[]` | "Seg, Qua, Sex" |
| **mensal** | Dia fixo do mês | `dia_mes: number` | "Dia 15" |
| **anual** | Data fixa anual | `mes_ano, dia_ano` | "Natal: 25/12" |
| **intervalo_dias** | A cada X dias | `intervalo_dias: number` | "A cada 3 dias" |

### 2.2 Validações por Tipo

```typescript
// Validações necessárias
const validacoesRecorrencia = {
  semanal: {
    required: ['dias_semana'],
    validate: (dias: number[]) => dias.every(d => d >= 0 && d <= 6),
    error: 'Dias da semana devem estar entre 0 (Seg) e 6 (Dom)'
  },
  mensal: {
    required: ['dia_mes'],
    validate: (dia: number) => dia >= 1 && dia <= 31,
    error: 'Dia do mês deve estar entre 1 e 31'
  },
  anual: {
    required: ['mes_ano', 'dia_ano'],
    validate: (mes: number, dia: number) => mes >= 0 && mes <= 11 && dia >= 1 && dia <= 31,
    error: 'Mês deve estar entre 0-11, dia entre 1-31'
  },
  intervalo_dias: {
    required: ['intervalo_dias'],
    validate: (intervalo: number) => intervalo >= 1 && intervalo <= 365,
    error: 'Intervalo deve ser entre 1 e 365 dias'
  }
};
```

---

## 3. Arquitetura da Solução

### 3.1 Quando Gerar Instâncias?

**Estratégia Híbrida: On-Create + Lazy Loading + Batch Job**

```
┌─────────────────────────────────────────────────────────────┐
│                    ESTRATÉGIA DE GERAÇÃO                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  1. ON-CREATE (Síncrono)                                    │
│     └── Gerar instâncias para os próximos 30 dias          │
│     └── Feedback imediato ao usuário                        │
│                                                             │
│  2. LAZY LOADING (On-Demand)                                │
│     └── Ao carregar agenda, verificar se precisa           │
│         gerar mais instâncias para os próximos 30 dias     │
│                                                             │
│  3. BATCH JOB (Background)                                  │
│     └── Processo diário às 00:01                           │
│     └── Gera instâncias para todas as tarefas recorrentes  │
│         que estão com menos de 15 dias de "estoque"        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Por que não gerar tudo de uma vez?**
- Performance: evita gerar milhares de tarefas sem data fim
- Flexibilidade: permite alterar regras de recorrência no futuro
- Storage: economiza espaço no banco

### 3.2 Prevenção de Duplicatas

```typescript
async function gerarInstancias(
  tarefaMae: Tarefa,
  dataInicio: string,
  dataFim: string
): Promise<TarefaInsert[]> {
  const instancias: TarefaInsert[] = [];
  const datas = calcularDatasRecorrencia(tarefaMae.recorrencia_config, dataInicio, dataFim);
  
  for (const data of datas) {
    // Verificar se já existe instância para esta data
    const { data: existente } = await supabase
      .from('tarefas')
      .select('id')
      .eq('parent_id', tarefaMae.id)
      .eq('data', data)
      .limit(1);
    
    if (!existente || existente.length === 0) {
      instancias.push(criarInstancia(tarefaMae, data));
    }
  }
  
  return instancias;
}
```

### 3.3 Edição de Tarefas Recorrentes

**Opções de Edição:**

| Opção | Comportamento | Implementação |
|-------|--------------|---------------|
| **Apenas esta** | Edita só a instância atual | `UPDATE tarefas WHERE id = instancia_id` |
| **Todas futuras** | Edita mãe e regenera instâncias futuras | `UPDATE tarefas WHERE id = parent_id` + regenerar |
| **Todas** | Edita mãe e atualiza todas instâncias | `UPDATE tarefas WHERE id = parent_id` + `UPDATE tarefas WHERE parent_id = x` |

**Fluxo "Todas as Futuras":**
1. Atualizar tarefa mãe com novos dados
2. Atualizar `recorrencia_config` se necessário
3. Excluir todas instâncias com `data >= hoje`
4. Regenerar instâncias com novas regras

**UI para Edição:**
```tsx
<AlertDialog>
  <AlertDialogTitle>Editar Tarefa Recorrente</AlertDialogTitle>
  <AlertDialogDescription>
    Esta é uma tarefa recorrente. O que você deseja editar?
  </AlertDialogDescription>
  <AlertDialogAction onClick={() => editarApenasEsta(instanciaId)}>
    Apenas esta instância
  </AlertDialogAction>
  <AlertDialogAction onClick={() => editarTodasFuturas(parentId)}>
    Esta e todas as futuras
  </AlertDialogAction>
  <AlertDialogAction onClick={() => editarTodas(parentId)}>
    Todas as instâncias
  </AlertDialogAction>
</AlertDialog>
```

### 3.4 Exclusão de Tarefas Recorrentes

| Opção | Comportamento |
|-------|--------------|
| **Apenas esta** | Soft delete da instância específica |
| **Todas futuras** | Define `data_fim_recorrencia` na mãe = ontem |
| **Todas** | Soft delete da mãe + todas instâncias |

---

## 4. Interface do Usuário

### 4.1 Expansão do Formulário de Criação

**Novo Layout do Formulário:**

```
┌─────────────────────────────────────────────────────┐
│  Criar Tarefa                                       │
├─────────────────────────────────────────────────────┤
│  Título: [____________________]                     │
│  Descrição: [____________________]                  │
│  Data: [___/___/____]                               │
│  Hora: [__:__]                                      │
│  Prioridade: [ Alta ▼]                              │
│  Bloco: [ Manhã ▼]                                  │
│                                                     │
│  Repetição: [ Semanal ▼]  ◄── NOVO: mais opções    │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Configuração de Recorrência                  │   │
│  │                                              │   │
│  │ ☑ Seg  ☐ Ter  ☑ Qua  ☐ Qui  ☑ Sex  ☐ Sab    │   │
│  │ ☐ Dom                                       │   │
│  │                                              │   │
│  │ Repetir até: [___/___/____]  (opcional)     │   │
│  │                                              │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  [ Cancelar ]  [ Criar Tarefa ]                     │
└─────────────────────────────────────────────────────┘
```

### 4.2 Componentes Necessários

#### 4.2.1 `RecorrenciaSelect`
```tsx
interface RecorrenciaSelectProps {
  value: TipoRecorrencia;
  onChange: (value: TipoRecorrencia) => void;
}

// Opções: única, diaria, semanal, mensal, anual, intervalo_dias
```

#### 4.2.2 `DiasSemanaSelector`
```tsx
interface DiasSemanaSelectorProps {
  selected: number[]; // [0, 2, 4]
  onChange: (dias: number[]) => void;
}

// Checkbox grid: Seg Ter Qua Qui Sex Sab Dom
```

#### 4.2.3 `RecorrenciaConfigPanel`
```tsx
interface RecorrenciaConfigPanelProps {
  tipo: TipoRecorrencia;
  config: Partial<RecorrenciaConfig>;
  onChange: (config: RecorrenciaConfig) => void;
}

// Renderiza controles específicos baseado no tipo
```

#### 4.2.4 `TarefaRecorrenteBadge`
```tsx
interface TarefaRecorrenteBadgeProps {
  config: RecorrenciaConfig;
}

// Exibe ícone + texto resumido: "🔁 Toda seg, qua, sex"
```

### 4.3 Validações de UI

```typescript
const validacoesFormulario = {
  // Se recorrência é semanal, obriga pelo menos 1 dia selecionado
  semanal: (dias: number[]) => dias.length > 0 || 'Selecione pelo menos um dia',
  
  // Data fim deve ser posterior à data início
  dataFim: (inicio: Date, fim?: Date) => 
    !fim || fim > inicio || 'Data fim deve ser posterior à data início',
  
  // Máximo de 365 dias para geração inicial
  periodoMaximo: (dias: number) => 
    dias <= 365 || 'Período máximo de 1 ano para geração inicial'
};
```

---

## 5. Implementação Técnica

### 5.1 Services Necessários

#### 5.1.1 `recorrenciaService.ts`

```typescript
export const recorrenciaService = {
  /**
   * Calcula todas as datas de ocorrência baseado na configuração
   */
  calcularDatas(
    config: RecorrenciaConfig,
    dataInicio: string,
    dataFim?: string,
    maxOcorrencias?: number
  ): string[];

  /**
   * Gera instâncias de uma tarefa recorrente
   */
  async gerarInstancias(
    tarefaMae: Tarefa,
    diasParaFrente?: number // default: 30
  ): Promise<Tarefa[]>;

  /**
   * Verifica se é necessário gerar mais instâncias (lazy loading)
   */
  async verificarEGerarNovasInstancias(
    tarefaMaeId: string
  ): Promise<boolean>;

  /**
   * Propaga alterações da mãe para instâncias futuras
   */
  async atualizarInstanciasFuturas(
    parentId: string,
    novosDados: Partial<Tarefa>,
    novaConfig?: RecorrenciaConfig
  ): Promise<void>;

  /**
   * Cancela recorrência a partir de uma data
   */
  async cancelarFuturas(
    parentId: string,
    aPartirDe: string
  ): Promise<void>;

  /**
   * Processa todas as tarefas recorrentes (para batch job)
   */
  async processarRecorrentesBatch(): Promise<{
    processadas: number;
    instanciasCriadas: number;
  }>;
};
```

#### 5.1.2 `tarefasService.ts` - Métodos Adicionais

```typescript
export const tarefasService = {
  // ... métodos existentes

  /**
   * Cria tarefa com recorrência (gera mãe + instâncias)
   */
  async criarTarefaRecorrente(
    tarefa: TarefaInsert,
    config: RecorrenciaConfig
  ): Promise<{ mae: Tarefa; instancias: Tarefa[] }>;

  /**
   * Busca tarefas recorrentes do dia (inclui instâncias)
   */
  async getTarefasRecorrentesDoDia(
    userId: string,
    data: string
  ): Promise<Tarefa[]>;

  /**
   * Busca templates de recorrência ativos
   */
  async getTemplatesAtivos(userId: string): Promise<Tarefa[]>;
};
```

### 5.2 Funções Utilitárias

#### 5.2.1 `dateUtils.ts`

```typescript
/**
 * Calcula próximas datas para recorrência semanal
 */
export function calcularDatasSemanal(
  dataInicio: string,
  diasSemana: number[],
  dataFim?: string,
  maxOcorrencias?: number
): string[] {
  const datas: string[] = [];
  const start = new Date(dataInicio);
  const end = dataFim ? new Date(dataFim) : null;
  const max = maxOcorrencias || 365;
  
  let current = new Date(start);
  let count = 0;
  
  while ((!end || current <= end) && count < max) {
    const dayOfWeek = current.getDay(); // 0=Dom, 1=Seg
    const mappedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // 0=Seg, 6=Dom
    
    if (diasSemana.includes(mappedDay) && current >= start) {
      datas.push(formatDate(current));
      count++;
    }
    
    current.setDate(current.getDate() + 1);
  }
  
  return datas;
}

/**
 * Calcula datas para recorrência a cada X dias
 */
export function calcularDatasIntervalo(
  dataInicio: string,
  intervaloDias: number,
  dataFim?: string,
  maxOcorrencias?: number
): string[] {
  const datas: string[] = [];
  const start = new Date(dataInicio);
  const end = dataFim ? new Date(dataFim) : null;
  const max = maxOcorrencias || 365;
  
  let current = new Date(start);
  let count = 0;
  
  while ((!end || current <= end) && count < max) {
    datas.push(formatDate(current));
    current.setDate(current.getDate() + intervaloDias);
    count++;
  }
  
  return datas;
}

/**
 * Calcula datas para recorrência mensal
 */
export function calcularDatasMensal(
  dataInicio: string,
  diaMes: number,
  dataFim?: string,
  maxOcorrencias?: number
): string[] {
  const datas: string[] = [];
  const start = new Date(dataInicio);
  const end = dataFim ? new Date(dataFim) : null;
  const max = maxOcorrencias || 24; // 2 anos
  
  let current = new Date(start.getFullYear(), start.getMonth(), diaMes);
  if (current < start) {
    current.setMonth(current.getMonth() + 1);
  }
  
  let count = 0;
  while ((!end || current <= end) && count < max) {
    // Ajusta para último dia do mês se necessário
    const ultimoDia = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    const diaAjustado = Math.min(diaMes, ultimoDia);
    const dataAjustada = new Date(current.getFullYear(), current.getMonth(), diaAjustado);
    
    datas.push(formatDate(dataAjustada));
    current.setMonth(current.getMonth() + 1);
    count++;
  }
  
  return datas;
}

/**
 * Formata data para YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}
```

### 5.3 Integração com Agenda Diária

#### 5.3.1 Modificação em `AgendaHojePage.tsx`

```typescript
// No carregamento da agenda, incluir tarefas recorrentes
async function carregarAgenda() {
  const [tarefasNormais, tarefasRecorrentes, habitos] = await Promise.all([
    tarefasService.getByData(userId, data),
    tarefasService.getTarefasRecorrentesDoDia(userId, data), // NOVO
    habitosService.getByData(userId, data)
  ]);
  
  // Verificar se precisa gerar mais instâncias (lazy loading)
  const templates = await tarefasService.getTemplatesAtivos(userId);
  for (const template of templates) {
    await recorrenciaService.verificarEGerarNovasInstancias(template.id);
  }
  
  // Combinar e mapear para UI
  const todasTarefas = [...tarefasNormais, ...tarefasRecorrentes];
  setTarefasHoje(mapTarefasToUI(todasTarefas));
}
```

#### 5.3.2 Exibição na Lista

```tsx
// TarefaItem.tsx - Adicionar badge de recorrência
{tarefa.recorrenciaConfig && (
  <Badge variant="outline" className="text-xs">
    <RepeatIcon className="w-3 h-3 mr-1" />
    {formatarRecorrencia(tarefa.recorrenciaConfig)}
  </Badge>
)}

// Função formatarRecorrencia
function formatarRecorrencia(config: RecorrenciaConfig): string {
  switch (config.tipo) {
    case 'diaria':
      return 'Todo dia';
    case 'semanal':
      if (config.dias_semana?.length === 1) {
        return `Toda ${DIAS_SEMANA[config.dias_semana[0]]}`;
      }
      return `${config.dias_semana?.length || 0}x por semana`;
    case 'mensal':
      return `Dia ${config.dia_mes} de cada mês`;
    case 'anual':
      return `Todo ano em ${config.dia_ano}/${config.mes_ano! + 1}`;
    case 'intervalo_dias':
      return `A cada ${config.intervalo_dias} dias`;
    default:
      return 'Recorrente';
  }
}
```

---

## 6. Exemplos de Uso

### 6.1 Cenário 1: Reunião Toda Sexta-feira

**Configuração:**
```typescript
const config: RecorrenciaConfig = {
  tipo: 'semanal',
  dias_semana: [4], // Sexta
  data_fim: '2026-12-31'
};

// Gera tarefas para todas as sextas até 31/12/2026
// Exemplo: "Reunião de Sprint - Review"
```

### 6.2 Cenário 2: Academia Seg, Qua, Sex

**Configuração:**
```typescript
const config: RecorrenciaConfig = {
  tipo: 'semanal',
  dias_semana: [0, 2, 4], // Seg, Qua, Sex
  // sem data_fim = indefinido
};

// Gera tarefas indefinidamente (até limite de 30 dias à frente)
// Sistema gera mais conforme necessário (lazy loading)
```

### 6.3 Cenário 3: Remédio a Cada 3 Dias

**Configuração:**
```typescript
const config: RecorrenciaConfig = {
  tipo: 'intervalo_dias',
  intervalo_dias: 3,
  data_fim: '2026-06-30'
};

// Gera: 10/04, 13/04, 16/04, 19/04...
// Exemplo: "Tomar antibiótico"
```

### 6.4 Cenário 4: Pagamento Dia 15

**Configuração:**
```typescript
const config: RecorrenciaConfig = {
  tipo: 'mensal',
  dia_mes: 15,
  // sem data_fim = indefinido
};

// Gera todo dia 15 de cada mês
// Exemplo: "Pagar fatura do cartão"
```

### 6.5 Cenário 5: Aniversário

**Configuração:**
```typescript
const config: RecorrenciaConfig = {
  tipo: 'anual',
  mes_ano: 4, // Maio (0-11)
  dia_ano: 15,
  // sem data_fim = indefinido
};

// Gera todo ano em 15/05
// Exemplo: "Aniversário da Maria"
```

### 6.6 Cenário 6: Curso por 30 Dias

**Configuração:**
```typescript
const config: RecorrenciaConfig = {
  tipo: 'diaria',
  data_fim: '2026-05-10' // 30 dias após início
};

// Gera todos os dias por 30 dias
// Exemplo: "Estudar módulo do curso"
```

---

## 7. Fluxos de Implementação

### 7.1 Fluxo: Criar Tarefa Recorrente

```
Usuário preenche formulário
        │
        ▼
Seleciona tipo de recorrência
        │
        ▼
Configura detalhes (dias, intervalo, etc)
        │
        ▼
Clica "Criar"
        │
        ▼
┌─────────────────────┐
│ Valida formulário   │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Cria tarefa MÃE     │
│ is_template = true  │
│ recorrencia_config  │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Calcula datas das   │
│ próximas 30 ocorr.  │
└─────────────────────┘
        │
        ▼
┌─────────────────────┐
│ Gera INSTÂNCIAS     │
│ parent_id = mãe.id  │
│ Verifica duplicatas │
└─────────────────────┘
        │
        ▼
Redireciona para agenda
```

### 7.2 Fluxo: Carregar Agenda Diária

```
Usuário abre agenda
        │
        ▼
Busca tarefas do dia
        │
        ▼
Busca tarefas recorrentes
(que são instâncias com 
 data = hoje)
        │
        ▼
┌─────────────────────┐
│ Para cada template  │
│ verificar se última │
│ instância < hoje+15 │
└─────────────────────┘
        │
        ▼
Se necessário, gerar mais
instâncias (lazy loading)
        │
        ▼
Renderizar lista
```

### 7.3 Fluxo: Editar Tarefa Recorrente

```
Usuário clica editar
        │
        ▼
Verifica se é instância
        │
    ┌───┴───┐
   Sim      Não
    │        │
    ▼        ▼
Mostra    Edição normal
modal de  (tarefa mãe)
opções:   
- Apenas esta
- Todas futuras  
- Todas
        │
    ┌───┴───┬──────────┐
    │       │          │
    ▼       ▼          ▼
Apenas   Todas      Todas
esta     futuras    (passadas
         │          também)
         │              │
         ▼              ▼
    UPDATE mãe     UPDATE mãe
    UPDATE         + UPDATE
    instância      instâncias
                   DELETE futuras
                   REGENERA
```

---

## 8. Testes e Validação

### 8.1 Testes Unitários

```typescript
describe('recorrenciaService', () => {
  describe('calcularDatas', () => {
    it('deve calcular datas semanais corretamente', () => {
      const config = { tipo: 'semanal', dias_semana: [4] };
      const datas = calcularDatasSemanal('2026-04-10', [4], '2026-04-30');
      expect(datas).toEqual(['2026-04-10', '2026-04-17', '2026-04-24']);
    });

    it('deve calcular intervalo de dias corretamente', () => {
      const datas = calcularDatasIntervalo('2026-04-10', 3, '2026-04-20');
      expect(datas).toEqual(['2026-04-10', '2026-04-13', '2026-04-16', '2026-04-19']);
    });

    it('deve respeitar data_fim', () => {
      const datas = calcularDatasSemanal('2026-04-10', [4], '2026-04-15');
      expect(datas).toHaveLength(1);
    });
  });

  describe('gerarInstancias', () => {
    it('não deve criar duplicatas', async () => {
      // Testar idempotência
    });

    it('deve limitar a 30 dias inicialmente', async () => {
      // Verificar limite
    });
  });
});
```

### 8.2 Testes de Integração

```typescript
describe('Fluxo Completo de Recorrência', () => {
  it('deve criar tarefa mãe e instâncias', async () => {
    // Criar tarefa recorrente
    // Verificar mãe criada
    // Verificar instâncias geradas
  });

  it('deve editar apenas uma instância', async () => {
    // Criar recorrência
    // Editar uma instância
    // Verificar que outras não mudaram
  });

  it('deve cancelar recorrência futura', async () => {
    // Criar recorrência
    // Cancelar futuras
    // Verificar que instâncias futuras foram deletadas
  });
});
```

---

## 9. Considerações de Performance

### 9.1 Estratégias

| Estratégia | Implementação | Benefício |
|------------|--------------|-----------|
| **Lazy Loading** | Gerar instâncias sob demanda | Evita gerar tarefas desnecessárias |
| **Batch Limit** | Máximo 30 dias por vez | Controla tamanho das operações |
| **Indices** | `parent_id`, `is_template` | Queries rápidas |
| **JSONB Index** | GIN index em `recorrencia_config` | Busca eficiente em config |
| **Duplicata Check** | Verificar antes de inserir | Evita retrabalho |

### 9.2 Métricas de Monitoramento

```typescript
// Métricas a monitorar
interface MetricasRecorrencia {
  tempoGeracaoInstancias: number;  // < 2s
  numeroInstanciasGeradas: number; // por operação
  taxaDuplicatasEvitadas: number;  // %
  tempoCarregamentoAgenda: number; // < 1s
}
```

---

## 10. Migração e Backward Compatibility

### 10.1 Migração de Dados Existentes

```sql
-- Tarefas existentes com recorrencia != 'nenhuma'
-- devem ser convertidas para o novo formato

UPDATE tarefas 
SET 
  recorrencia_config = CASE 
    WHEN recorrencia = 'diaria' THEN '{"tipo": "diaria"}'::jsonb
    WHEN recorrencia = 'semanal' THEN '{"tipo": "semanal", "dias_semana": [0,1,2,3,4]}'::jsonb
    ELSE NULL
  END,
  is_template = CASE 
    WHEN recorrencia != 'nenhuma' THEN true 
    ELSE false 
  END
WHERE recorrencia IN ('diaria', 'semanal');
```

### 10.2 Backward Compatibility

- Manter campo `recorrencia` antigo como deprecated
- Novo código usa `recorrencia_config`
- Migration script converte dados automaticamente

---

## 11. Task Breakdown para Implementação

### Fase 1: Fundação (Estimativa: 4h)
- [ ] **Task 1.1**: Criar migration do banco (novos campos + índices)
- [ ] **Task 1.2**: Atualizar tipos TypeScript (interfaces, enums)
- [ ] **Task 1.3**: Criar `recorrenciaService.ts` com funções utilitárias
- [ ] **Task 1.4**: Criar testes unitários para cálculo de datas

### Fase 2: Core da Recorrência (Estimativa: 6h)
- [ ] **Task 2.1**: Implementar `gerarInstancias()` no service
- [ ] **Task 2.2**: Implementar `verificarEGerarNovasInstancias()` (lazy loading)
- [ ] **Task 2.3**: Implementar `atualizarInstanciasFuturas()`
- [ ] **Task 2.4**: Implementar `cancelarFuturas()`
- [ ] **Task 2.5**: Adicionar métodos em `tarefasService.ts`

### Fase 3: Interface do Usuário (Estimativa: 6h)
- [ ] **Task 3.1**: Criar componente `DiasSemanaSelector.tsx`
- [ ] **Task 3.2**: Criar componente `RecorrenciaConfigPanel.tsx`
- [ ] **Task 3.3**: Atualizar formulário de criação (`TarefaCreatePage.tsx`)
- [ ] **Task 3.4**: Corrigir bug de digitação em `TarefaEditPage.tsx`
- [ ] **Task 3.5**: Adicionar modal de opções para edição (esta/todas/todas futuras)
- [ ] **Task 3.6**: Adicionar badge de recorrência na lista

### Fase 4: Integração com Agenda (Estimativa: 3h)
- [ ] **Task 4.1**: Modificar `AgendaHojePage.tsx` para carregar recorrentes
- [ ] **Task 4.2**: Adicionar lazy loading no carregamento da agenda
- [ ] **Task 4.3**: Atualizar `mapeamento.ts` (interface TarefaUI)
- [ ] **Task 4.4**: Exibir recorrência na página de detalhes

### Fase 5: Testes e Polish (Estimativa: 4h)
- [ ] **Task 5.1**: Testes de integração completos
- [ ] **Task 5.2**: Testes manuais dos cenários de uso
- [ ] **Task 5.3**: Validação de edge cases (fevereiro, ano bissexto)
- [ ] **Task 5.4**: Revisão de código e refatoração

### Fase 6: Migração (Estimativa: 2h)
- [ ] **Task 6.1**: Criar script de migração de dados existentes
- [ ] **Task 6.2**: Testar migração em ambiente de staging
- [ ] **Task 6.3**: Documentar rollback procedure

**Total Estimado: 25 horas**

---

## 12. Acceptance Criteria

### Critérios Funcionais

```gherkin
Feature: Tarefas Recorrentes

  Scenario: Criar tarefa semanal
    Given estou no formulário de criação de tarefa
    When seleciono "Repetir toda semana"
    And seleciono "Segunda", "Quarta" e "Sexta"
    And clico em "Criar"
    Then a tarefa mãe é criada
    And instâncias são geradas para as próximas 4 semanas

  Scenario: Tarefa aparece na agenda
    Given tenho uma tarefa recorrente configurada
    When abro a agenda de um dia específico
    Then vejo a instância daquela data como uma tarefa normal

  Scenario: Editar apenas esta instância
    Given tenho uma tarefa recorrente com múltiplas instâncias
    When edito uma instância específica
    And seleciono "Apenas esta"
    Then apenas aquela instância é modificada

  Scenario: Cancelar recorrência futura
    Given tenho uma tarefa recorrente ativa
    When seleciono "Cancelar futuras"
    Then instâncias futuras são removidas
    And tarefas passadas permanecem

  Scenario: Lazy loading de instâncias
    Given tenho uma tarefa recorrente sem data fim
    When chego a 10 dias do fim das instâncias geradas
    Then o sistema gera automaticamente mais 30 dias
```

---

## 13. Referências

### Arquivos Relacionados

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/supabase.ts` | Schema do banco de dados |
| `src/app/pages/agenda/TarefaCreatePage.tsx` | Formulário de criação |
| `src/app/pages/agenda/TarefaEditPage.tsx` | Formulário de edição (com bug) |
| `src/app/pages/agenda/TarefaDetailPage.tsx` | Página de detalhes |
| `src/app/pages/agenda/tarefaFormSchema.ts` | Schema Zod |
| `src/lib/mapeamento.ts` | Interface TarefaUI |
| `src/services/habitosService.ts` | Referência: método `gerarTarefas()` |
| `src/app/pages/agenda/AgendaHojePage.tsx` | Agenda diária |

### Documentação

- [PRD-2026-04-08-tarefas-recorrentes-vs-habitos.md](../plans/PRD-2026-04-08-tarefas-recorrentes-vs-habitos.md)
- [Skill: plan-writing](../../.opencode/skills/plan-writing/SKILL.md)

---

## 14. Anexos

### A. Diagrama ER Atualizado

```
┌─────────────────┐       ┌─────────────────┐
│    tarefas      │       │    tarefas      │
│   (template)    │◄──────┤  (instâncias)   │
├─────────────────┤  1:N  ├─────────────────┤
│ id (PK)         │       │ id (PK)         │
│ is_template=true│       │ parent_id (FK)  │
│ recorrencia_cfg │       │ is_template=false│
│ ...             │       │ data (específica)│
└─────────────────┘       └─────────────────┘
```

### B. Enum de Dias da Semana

```typescript
export const DIAS_SEMANA = [
  { value: 0, label: 'Segunda', short: 'Seg' },
  { value: 1, label: 'Terça', short: 'Ter' },
  { value: 2, label: 'Quarta', short: 'Qua' },
  { value: 3, label: 'Quinta', short: 'Qui' },
  { value: 4, label: 'Sexta', short: 'Sex' },
  { value: 5, label: 'Sábado', short: 'Sab' },
  { value: 6, label: 'Domingo', short: 'Dom' },
];
```

### C. Decision Log

| Data | Decisão | Motivo |
|------|---------|--------|
| 2026-04-10 | JSONB para config | Flexibilidade para novos tipos de recorrência |
| 2026-04-10 | Lazy loading + 30 dias | Performance e storage |
| 2026-04-10 | Tarefa mãe vs instâncias | Permite editar individualmente |
| 2026-04-10 | Soft delete | Preservar histórico |

---

**Documento gerado em**: 2026-04-10  
**Planner**: Vibe Planner  
**Status**: Pronto para Implementação  
**Próximo Passo**: @vibe-implementer deve ler este SPEC e iniciar fase de implementação

---

**⚠️ IMPORTANTE**: Após revisar este SPEC, o usuário DEVE limpar o contexto antes de iniciar a fase de implementação com @vibe-implementer. Isso garante que o context window esteja em 40-50% para qualidade máxima na implementação.
