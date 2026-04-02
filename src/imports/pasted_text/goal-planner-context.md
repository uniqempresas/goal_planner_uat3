# Contexto Consolidado - Goal Planner

**Última Atualização:** 09/03/2026  
**Objetivo:** Sistema de planejamento de vida baseado em "A Única Coisa"

---

## 📊 Resumo Executivo

**Goal Planner** é uma **aplicação pessoal de planejamento estratégico** que combina:
- 🎯 **Metas Hierárquicas** (G → A → M → S → D)
- 📅 **Agenda Inteligente** com Time Blocking
- 📊 **Framework SMART** com métricas personalizáveis
- 🔗 **Domino Effect** - visualização de conexão entre metas

**Proposta de Valor:** *"Materialize sua estratégia de vida - cada ação diária conectada a um propósito maior"*

---

## 🎯 Visão Estratégica

### Diferencial Competitivo
Enquanto outros apps de produtividade focam em **tarefas isoladas**, o Goal Planner foca em **propósito e conexão**:
- Cada tarefa diária está explicitamente ligada a metas maiores
- Visualização clara do "efeito dominó" (como metas pequenas alimentam grandes)
- Baseado na metodologia "A Única Coisa" de Gary Keller
- Sistema anti-procrastinação: se não serve para uma meta maior, não entra

### Pilares Estratégicos
1. **🎯 Hierarquia Infinita:** Metas podem ser subdivididas infinitamente (G → A → M → S → D)
2. **🔗 Domino Effect:** Visualização de como metas se conectam
3. **❓ Focusing Question:** "Qual é a ÚNICA coisa que posso fazer..." em cada nível
4. **📅 Time Blocking:** Agenda estruturada com blocos específicos + ONE Thing

---

## 👥 Público-Alvo: "Pessoas em Busca de Propósito"

**Características:**
- Sentem que estão estagnados na vida
- Precisam organizar objetivos em múltiplas áreas
- Buscam clareza sobre o que realmente importa
- Querem ver progresso real, não apenas marcar tarefas
- Valorizam propósito sobre produtividade vazia

**Principais Dores:**
1. ❌ Falta de clareza sobre objetivos de vida
2. ❌ Dificuldade em priorizar o que realmente importa
3. ❌ Sensação de fazer coisas "sem sentido"
4. ❌ Procrastinação por falta de conexão entre ação e propósito
5. ❌ Dificuldade em acompanhar progresso de metas de longo prazo

---

## 🏗️ Arquitetura do Produto

### Hierarquia de Metas (G → A → M → S → D)

```
Meta Grande (G) - 3 Anos
├── Meta Anual 1 (A01)
│   ├── Meta Mensal 01 (M01)
│   │   ├── Meta Semanal 01 (S01)
│   │   │   ├── Segunda: Tarefa X
│   │   │   ├── Terça: Tarefa Y
│   │   │   └── ...
│   │   └── Meta Semanal 02 (S02)
│   │       └── ...
│   └── Meta Mensal 02 (M02)
│       └── ...
└── Meta Anual 2 (A02)
    └── ...
```

**Flexibilidade:**
- Uma Meta G pode ter 1 ou várias Metas A
- Uma Meta A pode ter 3, 12 ou qualquer número de Metas M
- O usuário define quantos níveis precisa

### Módulos do Sistema

| Módulo | Descrição | Status |
|--------|-----------|--------|
| **Áreas de Vida** | Categorias personalizáveis (Saúde, Carreira, etc.) | 📋 Planejado |
| **Metas (G/A/M/S)** | Criação e gestão hierárquica | 📋 Planejado |
| **Agenda Diária** | Time blocking com blocos específicos | 📋 Planejado |
| **Dashboard** | Progresso visual e estatísticas | 📋 Planejado |
| **Templates** | Modelos de metas pré-configurados | 📋 Planejado |
| **Notificações** | Lembretes e alertas | 📋 Planejado |

---

## 📝 Framework SMART

Cada meta deve ter campos específicos:

### S - Specific (Específica)
- Descrição clara da meta
- **Focusing Question:** "Qual é a ÚNICA coisa que posso fazer..."

### M - Measurable (Mensurável)
- Métricas personalizáveis (chave-valor)
- Exemplos:
  - `quilos: 10` (perder 10kg)
  - `pessoas: 1000` (alcançar 1000 pessoas)
  - `livros: 12` (ler 12 livros)
- Suporta múltiplas métricas por meta

### A - Achievable (Atingível)
- Análise de viabilidade
- Recursos necessários
- Possíveis obstáculos

### R - Relevant (Relevante)
- Alinhamento com valores pessoais
- Conexão com metas superiores (Domino Effect)
- Por que essa meta importa?

### T - Time-bound (Temporal)
- Data de início
- Data de conclusão esperada
- Prazos intermediários (milestones)

---

## 📅 Agenda Diária - Estrutura

### Blocos de Tempo

**1. Tarefas Atrasadas**
- Tarefas não finalizadas de dias anteriores
- Prioridade automática

**2. Tarefas da Manhã**
- Bloco de trabalho matinal
- Ideal para ONE Thing (foco máximo)

**3. Tarefas da Tarde**
- Atividades operacionais
- Reuniões, emails, etc.

**4. Tarefas da Noite**
- Reflexão e planejamento
- Preparação para o dia seguinte

**5. Hábitos**
- Atividades recorrentes diárias
- Checkboxes para acompanhamento

**6. Tarefas Recorrentes**
- Tarefas que se repetem (semanal, mensal)

**7. ONE Thing** ⭐
- Apenas UMA tarefa
- Prioridade absoluta
- Se tudo der errado, essa deve ser feita

---

## 🔄 Fluxo de Planejamento

### Segunda-feira (Dia de Planejamento)
1. **Revisão da semana anterior**
   - O que foi concluído?
   - O que ficou pendente?
   
2. **Priorização da semana**
   - Definir ONE Thing da semana
   - Distribuir tarefas nos dias

3. **Agendamento**
   - Time blocking no calendário
   - Reservar slots para ONE Thing

### Durante a Semana
- Execução das tarefas planejadas
- Check-in diário de hábitos
- Reagendamento quando necessário
- Marcar tarefas como concluídas

### Final de Mês (Revisão Mensal)
1. **Retrospectiva**
   - Progresso das metas mensais
   - Métricas atingidas
   
2. **Repriorização**
   - Ajustar metas do próximo mês
   - Revisar alinhamento com metas anuais
   
3. **Planejamento**
   - Definir ONE Thing do próximo mês
   - Criar metas semanais

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologia | Justificativa |
|--------|------------|---------------|
| **Frontend** | React 19 + TypeScript | Moderno, tipado, componentizado |
| **Build Tool** | Vite | Rápido, HMR eficiente |
| **Styling** | Tailwind CSS | Produtividade e consistência |
| **Backend** | Supabase | BaaS completo (auth, DB, storage) |
| **Database** | PostgreSQL (via Supabase) | Relacional, robusto, escalável |
| **Hosting** | Vercel | Deploy automático, CDN global |
| **Routing** | React Router v7 | Navegação client-side |

---

## 🎯 Filosofia de Desenvolvimento

> **"Simples primeiro, complexo depois"**
> 
> Criar a estrutura mínima viável e evoluir baseado em necessidade real, não em suposições.

### Modelo de Desenvolvimento
O MVP será desenvolvido de forma iterativa, priorizando:
1. Hierarquia de metas funcional
2. Agenda diária operacional
3. Dashboard de progresso
4. Features avançadas (templates, notificações, etc.)

---

## 📊 Métricas de Sucesso (MVP)

### Fase 1 (Sprint 01)
- [ ] Sistema de metas hierárquicas funcional
- [ ] Agenda diária operacional
- [ ] Framework SMART implementado

### Fase 2 (Sprint 02)
- [ ] Dashboard com gráficos de progresso
- [ ] Templates de metas disponíveis
- [ ] Sistema de notificações funcionando

### Fase 3 (Sprint 03)
- [ ] Domino Effect visual implementado
- [ ] Exportação de dados (futuro)
- [ ] Integração com agente de IA (futuro)

---

## 🔗 Documentos Relacionados

- [PRD.md](./PRD.md) - Product Requirements Document (a criar)
- [ROADMAP.md](./ROADMAP.md) - Roadmap detalhado (a criar)
- [TRACKING.md](./tracking/TRACKING.md) - Status de desenvolvimento
- [TRACKING_Backlog.md](./tracking/TRACKING_Backlog.md) - Backlog de funcionalidades

---

## 📝 Notas Importantes

### Conceitos-chave
- **Focusing Question:** Pergunta fundamental em cada nível hierárquico
- **Domino Effect:** Visualização de como metas se conectam
- **ONE Thing:** Prioridade absoluta do dia/semana/mês
- **Time Blocking:** Reserva de tempo específico para foco

### Regras de Ouro
1. Toda tarefa deve estar conectada a uma meta
2. Se não serve para uma meta maior, não entra no sistema
3. Sempre ter UMA (e apenas uma) ONE Thing
4. Segunda-feira é sagrada para planejamento

---

**Este documento serve como fonte única de verdade para contextualização do projeto Goal Planner.**
