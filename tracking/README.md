# 📂 Pasta de Tracking - Goal Planner

**Última atualização:** 09/03/2026

---

## 🎯 Propósito desta Pasta

Esta pasta contém **todos os arquivos de tracking e coordenação** do desenvolvimento do Goal Planner.

**Use esta pasta como ponto de partida** ao iniciar trabalho para:
- ✅ Ver status atual de todas as tarefas
- ✅ Sincronizar contexto do projeto
- ✅ Planejar próximos passos
- ✅ Consultar histórico de mudanças

---

## 📁 Arquivos desta Pasta

### 1. 📊 [TRACKING.md](./TRACKING.md)
**Propósito:** Status detalhado de todas as tarefas  
**Atualização:** Diária  
**Quando usar:** Sempre que iniciar/pausar trabalho

**Contém:**
- Status de todas as tarefas (Em Progresso, Aguardando, Concluído, Bloqueado)
- Sprint atual e objetivos
- Progresso de cada tarefa
- Checklists de implementação

**📌 Comece sempre por aqui!**

---

### 2. 🧠 [CONTEXTO_PROJETO.md](./CONTEXTO_PROJETO.md)
**Propósito:** Contexto consolidado do projeto  
**Atualização:** Quando necessário  
**Quando usar:** Onboarding ou consulta de visão geral

**Contém:**
- Visão estratégica do produto
- Metodologia "A Única Coisa"
- Arquitetura de metas (G → A → M → S → D)
- Stack tecnológico
- Métricas de sucesso

---

### 3. 📝 [TRACKING_Backlog.md](./TRACKING_Backlog.md)
**Propósito:** Backlog de funcionalidades  
**Atualização:** Contínua  
**Quando usar:** Planejamento de sprints

**Contém:**
- Funcionalidades futuras
- Ideias de melhorias
- Bugs conhecidos
- Refinamentos técnicos

---

### 4. 📖 [TRACKING_GUIDE.md](./TRACKING_GUIDE.md)
**Propósito:** Guia completo de uso do sistema de tracking  
**Atualização:** Quando necessário  
**Quando usar:** Para consultar workflows e boas práticas

**Contém:**
- Como usar cada arquivo
- Workflows de sincronização
- Templates de tarefas
- Exemplos práticos

---

### 5. 📂 [tracking_arq/](./tracking_arq/)
**Propósito:** Arquivo de sprints passadas  
**Quando usar:** Consultar histórico

---

## 🔄 Workflow Recomendado

### Ao Iniciar Trabalho

```bash
# 1. Sincronizar com GitHub
git pull origin main

# 2. Abrir pasta de tracking
cd tracking/

# 3. Consultar TRACKING.md
# Ver tarefas disponíveis e status atual

# 4. Escolher tarefa e começar trabalho
# Atualizar TRACKING.md com progresso

# 5. Ao final do dia
git add tracking/TRACKING.md
git commit -m "Update: descrição"
git push origin main
```

---

## 📊 Estrutura Completa

```
tracking/
├── README.md                 (Este arquivo - índice)
├── TRACKING.md               (Status de tarefas - COMECE AQUI)
├── TRACKING_Backlog.md       (Backlog de funcionalidades)
├── CONTEXTO_PROJETO.md       (Contexto do projeto)
├── TRACKING_GUIDE.md         (Guia de uso)
└── tracking_arq/             (Histórico de Sprints)
```

---

## 🎯 Ordem de Consulta Recomendada

### Primeira Vez / Onboarding
1. **CONTEXTO_PROJETO.md** - Entender o projeto
2. **TRACKING_GUIDE.md** - Aprender o sistema
3. **TRACKING.md** - Ver tarefas atuais

### Trabalho Diário
1. **TRACKING.md** - Ver status e escolher tarefa
2. *(Trabalhar...)*
3. **TRACKING.md** - Atualizar progresso

---

## 🚀 Dicas Rápidas

### ✅ Fazer
- ✅ Sempre dar `git pull` antes de começar
- ✅ Consultar TRACKING.md ao iniciar o dia
- ✅ Atualizar progresso ao final do dia
- ✅ Fazer commits pequenos e frequentes

### ❌ Evitar
- ❌ Esquecer de fazer `git push`
- ❌ Deixar tracking desatualizado por dias
- ❌ Trabalhar sem consultar o contexto primeiro

---

## 📞 Precisa de Ajuda?

Consulte o **[TRACKING_GUIDE.md](./TRACKING_GUIDE.md)** para guia detalhado!

---

**Esta pasta é sua fonte única de verdade para coordenação de desenvolvimento! 🎯**
