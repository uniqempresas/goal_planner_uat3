# Roadmap - Goal Planner (Atualizado)

**Data de Atualização:** 01/04/2026  
**Status Atual:** Telas principais prontas (Figma), CRUD não implementado, backend não iniciado

---

## 🎯 Visão Geral

Este roadmap considera que todas as **telas principais foram exportadas do Figma** e estão visualmente prontas, mas **faltam as funcionalidades interativas** (forms, CRUD, persistência).

**Abordagem:**
1. **Fase 1:** Implementar todos os forms de criação/edição (CRUD local)
2. **Fase 2:** Completar páginas pendentes e visualizações de detalhe
3. **Fase 3:** Integrar com Supabase para persistência real
4. **Fase 4:** Polish, testes e deploy

---

## 📊 Estado Atual Resumido

### ✅ Já Pronto (Vindo do Figma)
- [x] Landing Page
- [x] Autenticação (Login/Register/Forgot)
- [x] Dashboard
- [x] Lista de Áreas de Vida
- [x] Listas de Metas (G/A/M/S/D)
- [x] Agenda Hoje (Time Blocking visual)
- [x] Revisão Semanal
- [x] Conquistas
- [x] Templates
- [x] Configurações (layout base + Perfil)

### ❌ O que Falta
- [ ] Forms de criação/edição de Metas
- [ ] Forms de criação/edição de Áreas
- [ ] Forms de criação/edição de Tarefas
- [ ] Visualizações de detalhe (Meta, Área, Template)
- [ ] Agenda Semanal
- [ ] Revisão Mensal
- [ ] Configurações funcionais (Geral/Segurança/Notificações)
- [ ] Backend/Supabase

---

## Fase 1: CRUD Completo (Sprints 1-3)

### Sprint 1: CRUD de Metas (Grandes Metas)

**Objetivo:** Implementar criação, edição e exclusão de Grandes Metas

#### Tasks
- [ ] Criar página `/metas/grandes/criar` com form multi-step
  - [ ] Step 1: Informações básicas (título, descrição, área)
  - [ ] Step 2: Framework SMART (campos específicos)
  - [ ] Step 3: Métricas personalizáveis (key-value dinâmico)
  - [ ] Step 4: Revisão e confirmação
- [ ] Criar página `/metas/grandes/:id` (detalhe da meta)
  - [ ] Visualização completa da meta
  - [ ] Hierarquia de sub-metas (A→M→S→D)
  - [ ] Timeline/histórico
  - [ ] Ações (editar, excluir, concluir)
- [ ] Criar página `/metas/grandes/:id/editar`
  - [ ] Reutilizar componentes do form de criação
  - [ ] Preencher com dados existentes
- [ ] Implementar exclusão com confirmação (modal)
- [ ] Implementar marcação de meta como concluída
- [ ] Adicionar validação com Zod + React Hook Form

#### Critérios de Aceite
- [ ] Usuário consegue criar uma Grande Meta completa
- [ ] Usuário consegue visualizar detalhes de uma meta
- [ ] Usuário consegue editar uma meta existente
- [ ] Usuário consegue excluir uma meta
- [ ] Validações impedem dados inválidos
- [ ] Dados persistem no estado local (mock avançado)

---

### Sprint 2: CRUD de Metas (Anuais/Mensais/Semanais/Diárias)

**Objetivo:** Implementar CRUD para os demais níveis hierárquicos

#### Tasks
- [ ] Criar forms para Metas Anuais (`/metas/anual/criar` e `/metas/anual/:id/editar`)
  - [ ] Seleção da Grande Meta pai
  - [ ] Campos específicos de meta anual
- [ ] Criar forms para Metas Mensais (`/metas/mensal/criar` e `/metas/mensal/:id/editar`)
  - [ ] Seleção da Meta Anual pai
  - [ ] Campos específicos de meta mensal
- [ ] Criar forms para Metas Semanais (`/metas/semanal/criar` e `/metas/semanal/:id/editar`)
  - [ ] Seleção da Meta Mensal pai
  - [ ] Campos específicos de meta semanal
- [ ] Criar forms para Metas Diárias (`/metas/diaria/criar` e `/metas/diaria/:id/editar`)
  - [ ] Seleção da Meta Semanal pai
  - [ ] Campos específicos de meta diária
- [ ] Criar componente reutilizável `MetaForm` com variações por nível
- [ ] Implementar navegação hierárquica (breadcrumbs melhorados)
- [ ] Criar páginas de detalhe para cada nível (opcional: reutilizar componente)

#### Critérios de Aceite
- [ ] CRUD completo para todos os níveis hierárquicos
- [ ] Navegação fluida entre níveis (pai → filho)
- [ ] Componente de form reutilizável e manutenível
- [ ] Validações específicas por tipo de meta

---

### Sprint 3: CRUD de Áreas e Tarefas

**Objetivo:** Implementar CRUD para Áreas de Vida e Tarefas da Agenda

#### Tasks

**Áreas de Vida:**
- [ ] Criar página `/areas/criar` com form de nova área
  - [ ] Campo nome
  - [ ] Seleção de cor (color picker)
  - [ ] Seleção de ícone (biblioteca de ícones)
  - [ ] Descrição opcional
- [ ] Criar página `/areas/:id` (detalhe da área)
  - [ ] Visualização completa da área
  - [ ] Lista de metas associadas
  - [ ] Estatísticas de progresso
  - [ ] Timeline de atividades
- [ ] Criar página `/areas/:id/editar`
- [ ] Implementar exclusão de área com confirmação
- [ ] Verificar dependências antes de excluir (metas associadas)

**Tarefas (Agenda):**
- [ ] Criar página `/agenda/tarefas/criar`
  - [ ] Título da tarefa
  - [ ] Seleção do bloco de tempo (manhã/tarde/noite/etc)
  - [ ] Associação com meta diária (opcional)
  - [ ] Prioridade (alta/média/baixa)
  - [ ] Hora agendada
  - [ ] Recorrência (uma vez, diária, semanal)
- [ ] Criar página `/agenda/tarefas/:id/editar`
- [ ] Implementar exclusão de tarefa
- [ ] Implementar marcação de tarefa como concluída (já parcialmente funcional)
- [ ] Adicionar "Tarefas Atrasadas" com lógica de datas

#### Critérios de Aceite
- [ ] CRUD completo de Áreas de Vida
- [ ] CRUD completo de Tarefas
- [ ] Área não pode ser excluída se tiver metas associadas
- [ ] Tarefas atrasadas aparecem automaticamente no bloco correto
- [ ] Recorrência funciona (tarefas diárias/semanais se repetem)

---

## Fase 2: Páginas Pendentes (Sprints 4-5)

### Sprint 4: Agenda Semanal e Revisão Mensal

**Objetivo:** Completar as funcionalidades de planejamento semanal e revisão mensal

#### Tasks

**Agenda Semanal:**
- [ ] Implementar página `/agenda/semana`
  - [ ] Visualização em grid de 7 dias
  - [ ] Cada dia mostra blocos de tempo resumidos
  - [ ] Visualização de ONE Thing por dia
  - [ ] Indicadores de produtividade (cores)
- [ ] Implementar navegação entre semanas (anterior/próxima)
- [ ] Implementar "Hoje" (voltar para semana atual)
- [ ] Permitir click em um dia para ir para `/agenda/hoje` filtrado
- [ ] Mostrar resumo semanal (total de tarefas, concluídas, taxa)

**Revisão Mensal:**
- [ ] Implementar página `/revisoes/mensal`
  - [ ] Checklist de reflexão mensal (template de perguntas)
  - [ ] Resumo do mês (metas concluídas, pendentes)
  - [ ] Análise por área de vida (progresso mensal)
  - [ ] Campo "Vitória do mês"
  - [ ] Campo "Aprendizados do mês"
  - [ ] Campo "Foco para o próximo mês"
- [ ] Criar template de perguntas configurável
- [ ] Implementar histórico de revisões mensais

#### Critérios de Aceite
- [ ] Agenda semanal funcional e navegável
- [ ] Revisão mensal com checklist completo
- [ ] Dados persistem entre sessões (localStorage)
- [ ] Interface responsiva para mobile

---

### Sprint 5: Detalhes, Templates e Configurações

**Objetivo:** Completar páginas de detalhe e funcionalidades de configuração

#### Tasks

**Detalhe de Template:**
- [ ] Implementar página `/templates/:id`
  - [ ] Visualização da estrutura completa do template
  - [ ] Lista de metas que serão criadas
  - [ ] Descrição e objetivo do template
  - [ ] Botão "Aplicar Template"
  - [ ] Modal de confirmação com seleção de área

**Configurações - Geral:**
- [ ] Implementar `/configuracoes/geral`
  - [ ] Tema (claro/escuro/sistema)
  - [ ] Idioma (PT/EN/ES)
  - [ ] Formato de data e hora
  - [ ] Zona horária
  - [ ] Exportar dados (JSON)
  - [ ] Importar dados (JSON)

**Configurações - Segurança:**
- [ ] Implementar `/configuracoes/seguranca`
  - [ ] Alterar senha (form com senha atual + nova)
  - [ ] Autenticação de dois fatores (2FA) - UI apenas
  - [ ] Sessões ativas (lista mock)
  - [ ] Log de atividades (lista mock)

**Configurações - Notificações:**
- [ ] Implementar `/configuracoes/notificacoes`
  - [ ] Notificações por email (toggle)
  - [ ] Notificações push (toggle)
  - [ ] Lembretes diários (horário configurável)
  - [ ] Lembretes de metas (prazo próximo)
  - [ ] Resumo semanal (dia/hora configurável)

#### Critérios de Aceite
- [ ] Página de detalhe de template funcional
- [ ] Configurações de Geral, Segurança e Notificações implementadas
- [ ] Tema escuro funciona globalmente
- [ ] Preferências persistem no localStorage

---

## Fase 3: Backend e Persistência (Sprints 6-7)

### Sprint 6: Setup Supabase e Auth Real

**Objetivo:** Configurar backend e migrar autenticação para Supabase

#### Tasks

**Setup:**
- [ ] Criar projeto Supabase
- [ ] Configurar PostgreSQL
- [ ] Configurar Storage para avatares
- [ ] Configurar variáveis de ambiente (.env)
- [ ] Instalar e configurar `@supabase/supabase-js`

**Autenticação:**
- [ ] Migrar `useAuth` mockado para Supabase Auth
- [ ] Implementar registro real com email/senha
- [ ] Implementar login real
- [ ] Implementar recuperação de senha real
- [ ] Implementar logout
- [ ] Configurar persistência de sessão
- [ ] Criar middleware de proteção de rotas

**Usuário:**
- [ ] Criar tabela `profiles` no Supabase
- [ ] Sincronizar dados do usuário com Supabase
- [ ] Upload de avatar para Storage
- [ ] Atualizar perfil no banco

#### Critérios de Aceite
- [ ] Registro funciona com Supabase
- [ ] Login funciona com Supabase
- [ ] Dados do usuário persistem no banco
- [ ] Sessão persiste entre reloads
- [ ] Proteção de rotas funciona corretamente

---

### Sprint 7: Persistência de Dados (CRUD Real)

**Objetivo:** Migrar todos os dados mockados para Supabase

#### Tasks

**Schema do Banco:**
- [ ] Criar tabela `areas` (id, user_id, name, color, icon, description, created_at)
- [ ] Criar tabela `metas` (id, user_id, area_id, parent_id, nivel, titulo, descricao, smart_fields, metrics, status, one_thing, created_at, updated_at)
- [ ] Criar tabela `tarefas` (id, user_id, meta_id, titulo, bloco, hora, prioridade, completed, recorrencia, data, created_at)
- [ ] Criar tabela `revisoes_semanais` (id, user_id, data, checklist, stats, notas)
- [ ] Criar tabela `revisoes_mensais` (id, user_id, mes, ano, checklist, stats, notas)
- [ ] Criar tabela `conquistas` (id, user_id, tipo, desbloqueada_em, progresso)
- [ ] Configurar RLS (Row Level Security) em todas as tabelas
- [ ] Criar índices para performance

**Hooks de API:**
- [ ] Criar `useAreasApi` (substituir mock)
- [ ] Criar `useMetasApi` (substituir mock)
- [ ] Criar `useTarefasApi` (substituir mock)
- [ ] Criar `useRevisoesApi` (substituir mock)
- [ ] Criar `useConquistasApi` (substituir mock)

**Integração:**
- [ ] Substituir todos os dados mockados por chamadas API
- [ ] Implementar loading states
- [ ] Implementar error handling
- [ ] Implementar cache local (React Query ou SWR)
- [ ] Criar sistema de retry para falhas de rede

#### Critérios de Aceite
- [ ] Todas as entidades persistem no Supabase
- [ ] RLS protege dados do usuário
- [ ] CRUD completo funciona com backend real
- [ ] Loading states em todas as operações
- [ ] Erros são tratados e exibidos ao usuário

---

## Fase 4: Polish e Launch (Sprints 8-9)

### Sprint 8: UX, Animações e Performance

**Objetivo:** Melhorar experiência do usuário com animações, estados vazios e otimizações

#### Tasks

**Animações:**
- [ ] Implementar transições de página com Framer Motion
- [ ] Adicionar animações em modais e dialogs
- [ ] Animar progresso de metas (círculos e barras)
- [ ] Animação de conclusão de tarefa (confetti)
- [ ] Skeleton loaders para todas as páginas
- [ ] Transições suaves no dark mode

**UX Melhorias:**
- [ ] Criar empty states para todas as listas
- [ ] Adicionar tooltips em ícones e botões
- [ ] Implementar toast notifications (Sonner já instalado)
- [ ] Adicionar confirmações para ações destrutivas
- [ ] Implementar undo/redo para exclusões (opcional)
- [ ] Melhorar feedback visual de loading

**Performance:**
- [ ] Implementar lazy loading de rotas
- [ ] Code splitting por módulo
- [ ] Otimizar imagens (avatares, ícones)
- [ ] Implementar virtualização para listas longas
- [ ] Analisar bundle size

**Mobile:**
- [ ] Revisar responsividade em todas as páginas
- [ ] Otimizar menu mobile inferior
- [ ] Testar touch gestures
- [ ] Ajustar fontes e espaçamentos para mobile

#### Critérios de Aceite
- [ ] Animações fluidas em todas as interações
- [ ] Empty states em todas as listas
- [ ] Performance aceitável (LCP < 2.5s)
- [ ] Responsividade funciona em todos os breakpoints

---

### Sprint 9: Testes, Segurança e Deploy

**Objetivo:** Garantir qualidade e fazer deploy em produção

#### Tasks

**Testes:**
- [ ] Configurar Vitest para testes unitários
- [ ] Escrever testes para hooks customizados
- [ ] Escrever testes para componentes críticos
- [ ] Configurar Playwright para testes E2E
- [ ] Criar testes E2E para fluxo principal (login → criar meta → dashboard)
- [ ] Configurar coverage report (meta: 60%)

**Segurança:**
- [ ] Auditar dependências (`npm audit`)
- [ ] Revisar políticas RLS do Supabase
- [ ] Implementar rate limiting nas APIs
- [ ] Sanitizar inputs (proteção XSS)
- [ ] Configurar headers de segurança no Vercel

**Deploy:**
- [ ] Configurar projeto no Vercel
- [ ] Configurar variáveis de ambiente de produção
- [ ] Configurar Supabase para produção
- [ ] Executar deploy de produção
- [ ] Configurar domínio personalizado (se aplicável)
- [ ] Configurar SSL/HTTPS
- [ ] Configurar monitoramento (Sentry)
- [ ] Configurar analytics (Plausible/Google Analytics)

**Documentação:**
- [ ] Atualizar README.md com instruções de uso
- [ ] Criar CHANGELOG.md
- [ ] Documentar API (se houver)
- [ ] Criar guia de contribuição (se open source)

#### Critérios de Aceite
- [ ] Testes unitários passando
- [ ] Testes E2E passando
- [ ] Aplicação online em produção
- [ ] Nenhuma vulnerabilidade crítica
- [ ] Monitoramento ativo

---

## 📅 Resumo das Sprints

| Sprint | Foco | Duração Estimada | Principais Entregas |
|--------|------|------------------|---------------------|
| **S1** | CRUD Grandes Metas | 1 semana | Forms de criação/edição, detalhe da meta |
| **S2** | CRUD Metas A/M/S/D | 1 semana | Forms para todos os níveis hierárquicos |
| **S3** | CRUD Áreas e Tarefas | 1 semana | CRUD completo de áreas e tarefas |
| **S4** | Agenda Semanal + Revisão Mensal | 1 semana | Planejamento semanal, revisão mensal |
| **S5** | Detalhes e Configurações | 1 semana | Templates aplicáveis, configurações funcionais |
| **S6** | Backend - Auth | 1 semana | Supabase Auth, registro/login real |
| **S7** | Backend - Dados | 1 semana | Persistência real de todas as entidades |
| **S8** | Polish | 1 semana | Animações, empty states, performance |
| **S9** | Launch | 1 semana | Testes, deploy, monitoramento |

**Total:** 9 sprints (~9 semanas)

---

## 🎯 Priorização de Features (Após MVP)

### Alta Prioridade (P1)
- [ ] Drag & drop para reordenar tarefas
- [ ] Sistema de notificações push
- [ ] App mobile (PWA)
- [ ] Integração com calendário (Google/Outlook)

### Média Prioridade (P2)
- [ ] Colaboração (compartilhar metas)
- [ ] Integração com agente de IA
- [ ] Relatórios avançados (PDF)
- [ ] Gamificação avançada (níveis, ranking)

### Baixa Prioridade (P3)
- [ ] Integração com wearables
- [ ] API pública
- [ ] Marketplace de templates
- [ ] Versão white-label

---

## 📝 Notas Importantes

### Durante o Desenvolvimento
1. **Manter dados mockados** até a Sprint 6 para permitir desenvolvimento offline
2. **Criar componentes reutilizáveis** para forms (MetaForm, AreaForm, etc.)
3. **Validação sempre no client e server** (Zod + Supabase constraints)
4. **Feature flags** para funcionalidades de risco
5. **Commits frequentes** com mensagens claras

### Checkpoints de Qualidade
- [ ] Ao final de cada sprint: revisar com stakeholders
- [ ] Sprint 3: Demonstração de CRUD completo
- [ ] Sprint 5: Demo de funcionalidades 100% offline
- [ ] Sprint 7: Demo com backend real
- [ ] Sprint 9: Go/No-go para produção

### Dívida Técnica
- Reservar 10% do tempo de cada sprint para refatoração
- Manter TODOs documentados no código
- Revisar código após cada sprint

---

## 📊 Métricas de Sucesso

### Sprint 3 (CRUD Completo)
- [ ] Todas as entidades com CRUD funcional
- [ ] 0 bugs críticos
- [ ] Interface responsiva em todos os breakpoints

### Sprint 5 (Features Completas)
- [ ] 100% das páginas principais implementadas
- [ ] Fluxo de usuário completo (landing → registro → criação de meta → dashboard)
- [ ] Dados persistem no localStorage

### Sprint 7 (Backend)
- [ ] 100% dos dados persistem no Supabase
- [ ] RLS funcionando corretamente
- [ ] Performance: < 500ms para carregar dashboard

### Sprint 9 (Launch)
- [ ] 0 bugs críticos
- [ ] Lighthouse score > 80
- [ ] Test coverage > 60%
- [ ] Uptime de 99.9%

---

**Este roadmap é um guia vivo. Ajustar conforme feedback e descobertas durante o desenvolvimento.**
