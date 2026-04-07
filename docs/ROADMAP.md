---
date: 2026-04-06T18:00:00-03:00
researcher: vibe-researcher
git_commit: a699083
branch: main
repository: goal_planner_uat3
topic: "Roadmap Atualizado - Sprint 2 CONCLUÍDA"
tags: [research, roadmap, sprint-2, complete]
status: complete
last_updated: 2026-04-06
last_updated_by: neo
---

# Pesquisa: Roadmap Atualizado - Sprint 1 Concluída

**Data:** 06 de Abril de 2026  
**Pesquisador:** vibe-researcher  
**Objetivo:** Atualizar o roadmap com o progresso desde 03/04/2026.

---

## Resumo Executivo

O projeto Goal Planner evoluiu significativamente desde 03/04/2026. A **Sprint 1 foi concluída**, implementando a infraestrutura completa de backend (Supabase) e autenticação real. A **Sprint 2 está em andamento** com as primeiras páginas de detalhe e edição de Áreas já implementadas.

### Dados Coletados

- **Rotas configuradas:** 39 rotas em `src/app/routes.ts`
- **Páginas existentes:** 26 arquivos de página em `src/app/pages/`
- **Estado Global:** React Context (`AppContext`) integrado com Supabase
- **Bibliotecas principais:** React Router 7, Tailwind CSS 4, shadcn/ui, Supabase (@supabase/supabase-js)

---

## Estado Detalhado por Módulo

### 1. Autenticação e Landing (100% Visual)

- **LandingPage** (`/`) - Texto institucional estático.
- **LoginPage** (`/login`) - Formulário interativo (UI), mas sem validação real.
- **RegisterPage** (`/register`) - Formulário interativo (UI).
- **ForgotPasswordPage** (`/forgot-password`) - Formulário visual.

**Avaliação:** Completamente visual. O botão "Entrar" apenas seta o estado `isAuthenticated` como true no contexto.

---

### 2. Dashboard (95% Visual)

- **Arquivo:** `src/app/pages/DashboardPage.tsx` (260 linhas)
- **Funcionalidade:**
  - Exibe stats (tarefas, sequência, hábitos) vindos do mock.
  -ONE Thing banner (visual).
  - Lista de Grandes Metas com progress rings.
  - Lista de Áreas com barras de progresso.
- **Interatividade:** Nenhuma ação clicável leva a lugar nenhum (os links existem mas os destinos são placeholders).

**Avaliação:** Visual com dados mockados. O botão "Ver Agenda" leva a uma página real, mas sem dados de filtro.

---

### 3. Áreas de Vida (60% Visual)

- **Arquivo:** `src/app/pages/areas/AreasListPage.tsx`
- **Funcionalidade:**
  - Grid de cards das áreas.
  - Barra de progresso geral.
  - Link para detalhe (`/areas/:id`).
- **Botões:** "Nova Área" e "Adicionar nova área" existem mas são visuais.

**Rotas Pendentes:**
- `/areas/:id` → `PlaceholderPage`
- `/areas/:id/edit` → `PlaceholderPage`
- `/areas/criar` → Não existe rota

**Avaliação:** Visual. Botões não funcionam.

---

### 4. Metas (Hierarquia G/A/M/S/D) (40% Visual)

Listas existentes:
- **GrandesMetasPage** (`/metas/grandes`)
- **MetasAnuaisPage** (`/metas/anual`)
- **MetasMensaisPage** (`/metas/mensal`)
- **MetasSemanaisPage** (`/metas/semanal`)
- **MetasDiariasPage** (`/metas/diaria`)

**O que funciona:**
- Listas com cards visuais.
- Expansão de "Metas Anuais vinculadas" em Grandes Metas.
- Status badges.
- Progress bars e rings.

**O que NÃO funciona (Placeholder):**
- Todas as páginas de detalhe (`/metas/grandes/:id`)
- Todas as páginas de criação (`/metas/grandes/criar`)
- Todas as páginas de edição (`/metas/grandes/:id/editar`)

**Avaliação:** Listas prontas (UI), mas sem fluxo de criação/edição. O usuário pode apenas visualizar as metas mockadas.

---

### 5. Agenda (80% Parcialmente Funcional)

- **AgendaHojePage** (`/agenda/hoje`) - **A página mais funcional do app.**
  - Renderiza blocos de tempo (ONE Thing, Manhã, Tarde, Noite, etc).
  - **Checkbox de tarefas funciona:** Atualiza o estado local (`toggleTarefa` no Context).
  - UI de collapsed/expanded dos blocos.
- **AgendaSemanaPage** (`/agenda/semana`) - Visual completa, mas navegação entre semanas não funcional.
- **Criação de Tarefas:** `PlaceholderPage`.

**Avaliação:** Única página com estado reativo real (checkbox). As demais são visuais.

---

### 6. Revisões (90% Visual)

- **RevisaoSemanalPage** (`/revisoes/semanal`)
  - Checklist interativo ( State local `useState`).
  - Campos de texto (Reflexão, Vitória) funcionam ( State local).
  - Stats da semana vindos do mock.
- **RevisaoMensalPage** (`/revisoes/mensal`) - Visual.

**Avaliação:** Checklist e forms funcionam localmente, mas os dados não são salvos em nenhum lugar.

---

### 7. Conquistas e Templates (100% Visual)

- **ConquistasPage** - Grid de badges.
- **TemplatesListPage** - Grid de templates.

**Avaliação:** Completamente visual. Nenhuma interação.

---

### 8. Configurações (40% Parcialmente Funcional)

- **Perfil** (`/configuracoes/perfil`)
  - **Forms interativos:** Name, Email, Bio.
  - Estado local gerencia os inputs.
  - Feedback visual de "Salvo!" (simulado).
- **Geral** (`/configuracoes/geral`) - Visual estática.
- **Segurança** (`/configuracoes/seguranca`)
  - Formulário de alterar senha (visual).
  - Inputs Controlled (State local), mas sem ação no submit.
- **Notificações** (`/configuracoes/notificacoes`)
  - Toggle switches funcionam (State local).

**Avaliação:** Formulários possuem estado local, mas não salvam em storage nem backend.

---

## Análise de Funcionalidade

### Estado (React State)

O projeto usa `AppContext` (`src/app/contexts/AppContext.tsx`) para gerenciar dados.

```typescript
// Exemplo de dado mockado (linha 57)
const [grandesMetas] = useState<Meta[]>(mockGrandesMetas);
```

- Todos os dados principais são inicializados com `mockData` e são **read-only** (não há setters para criar novos dados, apenas `toggleTarefa` para marcar como completo).
- Não há `localStorage` ou `IndexedDB` implementado.

### Rotas e Navegação

O arquivo `routes.ts` define 39 rotas. O padrão observed é:

```typescript
// Exemplo de rota para detalhe (não implementado)
{ path: '/metas/grandes/:id', Component: PlaceholderPage },
```

### Stack tecnológica

- **Framework:** React 18 + Vite
- **Roteamento:** React Router 7
- **Estilização:** Tailwind CSS 4 + shadcn/ui (Radix UI)
- **Ícones:** Lucide React
- **Gráficos:** Recharts
- **Animações:** Motion (Framer Motion)
- **Forms:** React Hook Form (instalado, mas não utilizado nas páginas)
- **Validação:** Zod (instalado, mas não utilizado)

---

## Gaps Identificados vs. Roadmap Atual

O roadmap atual (`docs/ROADMAP.md`) lista 9 Sprints. Com base na análise real, o roadmap superestimou o estado de "pronto".

### O que o Roadmap disse vs. Realidade

| Área | Roadmap Diz | Realidade |
|------|-------------|-----------|
| Landing/Auth | ✅ Pronto | ✅ Visual Pronto |
| Dashboard | ✅ Pronto | ✅ Visual Pronto |
| Áreas de Vida | ✅ Pronto (Lista) | ✅ Lista Pronta, CRUD Não |
| Metas (G) | ✅ Pronto (Lista) | ✅ Lista Pronta, Forms Falta |
| Metas (A/M/S/D) | ✅ Pronto (Lista) | ✅ Lista Pronta, Forms Falta |
| Agenda Hoje | ✅ Pronto | ⚠️ Quase (Toggle funciona) |
| Agenda Semana | ❌ Falta | ✅ Visual Pronto |
| Revisão Semanal | ❌ Falta | ⚠️ Checklist funciona |
| Revisão Mensal | ❌ Falta | ✅ Visual Pronto |
| Configurações | ⚠️ Parcial | ⚠️ Forms locais (Perfil, Notif) |

**Conclusão:** O projeto está na **Fase 1 (Visual)** maspenas no início da **Fase 2 (Interatividade)**. A estimativa de 9 sprints pode ser mantida, mas a **Sprint 1 deve ser muito mais longa** (equivalente a quase todas as Sprints 1-3 originais).

---

## Proposta de Roadmap Atualizado

Com base na realidade do código, proponho uma reestruturação das fases focando na construção do **CRUD completo** antes de avançarfazer backend.

### Fase 1: Infraestrutura e Estado Local (Sprints 1-2)

**Objetivo:** Tirar o app do modo visual-only para o modo interativo com dados reais no Supabase.

**Sprint 1: Sistema de Dados e Componentes de Formulário** ✅ CONCLUÍDO
- [x] Configurar **Zod + React Hook Form** (já estava instalado)
- [x] Criar projeto Supabase "goal_planner_uat3"
- [x] Criar schema do banco (7 tabelas: areas, metas, tarefas, revisoes_semanais, revisoes_mensais, templates, conquistas)
- [x] Configurar RLS (Row Level Security) em todas as tabelas
- [x] Integrar Supabase no frontend (@supabase/supabase-js)
- [x] Criar cliente `src/lib/supabase.ts` com tipos TypeScript
- [x] Criar services (areasService, metasService, tarefasService)
- [x] Atualizar AppContext para usar dados reais do Supabase
- [x] Implementar autenticação (login/register/logout via Supabase Auth)

**Sprint 2: Fluxos de Criação e Edição** ✅ CONCLUÍDO
- [x] Criar páginas de **detalhe** (`/areas/:id`) e **edição** (`/areas/:id/edit`) para Áreas
- [x] Implementar formulários com validação (Zod + React Hook Form)
- [x] Criar componentes de seleção (EmojiPicker, ColorPicker)
- [x] Criar página de **criação** para Áreas (`/areas/criar`)
- [x] Implementar Empty States para todas as entidades
- [x] Implementar criação de **Tarefas** vinculada a Metas

**Sprint 2.1: CRUD Áreas de Vida** ✅ CONCLUÍDO
- [x] Create, Read, Update, Delete de Áreas

**Sprint 2.2: CRUD Grandes Metas (G)** ✅ CONCLUÍDO
- [x] Criar Grandes Metas
- [x] Listar Grandes Metas
- [x] Detalhar Grandes Metas
- [x] Editar Grandes Metas
- [x] Excluir Grandes Metas

**Sprint 2.3: CRUD Metas Anuais (A)** ✅ CONCLUÍDO
- [x] Create, Read, Update, Delete de Metas Anuais

**Sprint 2.4: CRUD Metas Mensais (M)** ✅ CONCLUÍDO
- [x] Create, Read, Update, Delete de Metas Mensais

**Sprint 2.5: CRUD Metas Semanais (S)** ✅ CONCLUÍDO
- [x] Create, Read, Update, Delete de Metas Semanais

**Sprint 2.6: CRUD Metas Diárias (D)** ✅ CONCLUÍDO
- [x] Create, Read, Update, Delete de Metas Diárias

**Sprint 2.7: Sistema de Criação de Metas Moderno** ✅ CONCLUÍDO
- [x] 5 páginas específicas de criação (G, A, M, S, D)
- [x] MetaParentSelector - Seleção por cards (sem dropdowns)
- [x] HierarchyTreePreview - Visualização da hierarquia
- [x] PrioritySelector - Seletor de prioridade/ONE Thing
- [x] SmartFields - Campos específicos por nível
- [x] Fluxo híbrido: criar "filha de" ou no mesmo nível
- [x] UI moderna e responsiva

---

### Fase 2: Funcionalidades Avançadas (Sprints 3-4)

**Objetivo:** Completar as lógicas de negócio que dependem do CRUD.

**Sprint 3: Agenda Hoje/Semanal, Revisões e Configurações** 🟡 EM ANDAMENTO
- [x] ~~Implementar lógica de **Agenda Semanal** com navegação entre semanas.~~
- [x] **Agenda Hoje com dados reais:**
  - [x] Conectar dados do Supabase (corrigir mapeamento de campos)
  - [x] Exibir tarefas reais do banco
  - [x] Toggle de conclusão funcionando com persistência
- [x] **CRUD de Tarefas Diárias:**
  - [x] Página de detalhe de tarefa
  - [x] Página de edição de tarefa
  - [x] Exclusão de tarefa (com confirmação)
- [x] **Agenda Semanal com navegação:**
  - [x] Navegação entre dias da semana
  - [x] Dados reais por dia selecionado
- [ ] **Sistema de Hábitos (Nova tabela):**
  - [ ] Criar tabela `habitos` no Supabase
  - [ ] Campos: data_inicio, data_fim, dias_semana, streak, status
  - [ ] Página de criação de hábitos
  - [ ] Listagem de hábitos ativos na Agenda Hoje
  - [ ] Geração automática de tarefas com base no hábito
  - [ ] Tracking de streak (dias consecutivos)
  - [ ] Expiração automática após data_fim
- [ ] Implementar **Revisão Mensal** com persistência.
- [ ] Implementar **Revisão Semanal** com persistência.
- [ ] Implementar **Configurações funcionais** (Geral, Segurança, Notificações).
- [ ] Implementar **Templates** (detalhe + aplicar).

**Sprint 3.5: Tarefas Recorrentes** 🔵 PENDENTE
- [ ] Planejar modelo de dados para recorrências
- [ ] Definir interface de configuração de recorrência
- [ ] Implementar lógica de geração de tarefas recorrentes
- [ ] Implementar edição em série (opcional)

**Sprint 4: Polish, UX e Performance**
- [ ] Substituir `PlaceholderPage` por **páginas de erro 404**.
- [ ] Implementar **animações de transição** (Framer Motion).
- [ ] Implementar **toast notifications** (Sonner).
- [ ] **Performance:** Lazy loading de rotas.
- [ ] **Mobile:** Revisão final de responsividade.

---

### Fase 3: Backend e Launch (Sprints 5-6)

(inalterado em relação ao roadmap anterior)

---

## Atualizações Recentes (06/04/2026)

### Sprint 2 CONCLUÍDA ✅

desde a última atualização do roadmap (03/04/2026), implementamos as seguintes mudanças significativas:

1. **Fase 1 - Criação de Áreas:**
   - Nova rota `/areas/criar`
   - `AreaCreatePage.tsx` com formulário de criação

2. **Fase 2 - CRUD de Metas (Genérico):**
   - `metaFormSchema.ts` com validação Zod
   - 3 páginas genéricas: `MetaCreatePage`, `MetaDetailPage`, `MetaEditPage`
   - 15 novas rotas (criar/detalhe/editar para cada nível G/A/M/S/D)
   - Visualização de metas filhas e tarefas vinculadas

3. **Fase 3 - Empty States:**
   - Implementado em: AreasListPage, GrandesMetasPage, MetasListPage, AgendaHojePage, RevisaoSemanalPage, RevisaoMensalPage

4. **Fase 4 - Criação de Tarefas:**
   - `tarefaFormSchema.ts` com validação Zod
   - `TarefaCreatePage.tsx` com vinculação a metas
   - Rota `/agenda/tarefas/criar` atualizada

---

**PRÓXIMA ETAPA:** Sprint 3 - Agenda Semanal, Revisões e Configurações

---

## Recomendação de Próximos Passos

1.  **Próximo Passo:** Implementar as páginas de **Criação** (`/areas/criar`) para fechar o ciclo de CRUD de Áreas.
2.  **Meta:** Criar as páginas de detalhe/edição/criação para **Metas** (Grandes Metas, Anuais, Mensais, Semanais, Diárias).
3.  **UX:** Adicionar **Empty States** (estados vazios) nas listas para melhorar a experiência do usuário quando não há dados.

---

## Referências de Código

- **Rotas:** `src/app/routes.ts:1-125`
- **Supabase Client:** `src/lib/supabase.ts:1-10`
- **Services:** `src/services/areasService.ts`, `src/services/metasService.ts`, `src/services/tarefasService.ts`
- **Contexto:** `src/app/contexts/AppContext.tsx:1-259`
- **Exemplo de Página Funcional (Áreas):** `src/app/pages/areas/AreaEditPage.tsx:1-175`

---

*Este documento reflete o estado do código em 06/04/2026.*
