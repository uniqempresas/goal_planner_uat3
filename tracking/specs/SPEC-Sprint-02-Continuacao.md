# SPEC.md - Sprint 2: Continuação (Criação, CRUD Metas, Empty States)

**Versão:** 1.0
**Data:** 2026-04-06
**Responsável:** vibe-planner
**Status:** ready_for_implementation
**Pré-requisitos:** Páginas `AreaDetailPage` e `AreaEditPage` implementadas.

---

## 1. Arquitetura Técnica

### 1.1 Stack
- **Frontend:** React 19 + TypeScript + Vite
- **UI:** shadcn/ui + Tailwind CSS + Lucide React
- **State Management:** React Context (AppContext existente)
- **Backend:** Supabase (via services existentes)
- **Validação:** Zod + React Hook Form

### 1.2 Estrutura de Arquivos
```
src/app/pages/
├── areas/
│   ├── AreaCreatePage.tsx    [NOVA]
│   └── areaFormSchema.ts      [EXISTE - reutilizar]
├── metas/
│   ├── MetaDetailPage.tsx     [NOVA - Genérica para todos os níveis]
│   ├── MetaEditPage.tsx       [NOVA - Genérica]
│   ├── MetaCreatePage.tsx     [NOVA - Genérica]
│   └── metaFormSchema.ts      [NOVA]
├── agenda/
│   ├── TarefaCreatePage.tsx  [NOVA]
│   ├── TarefaDetailPage.tsx  [NOVA]
│   └── tarefaFormSchema.ts    [NOVA]
```

### 1.3 Services Utilizados
- `areasService.create()`: Para criação de áreas.
- `metasService`: `getById`, `getByNivel`, `create`, `update`, `delete`, `toggleStatus`.
- `tarefasService`: `create`, `update`, `getByData`.

### 1.4 Componentes Reutilizáveis
- `EmptyState`: Genérico, aceita ícone, título, descrição e ação.
- `EmojiPicker`, `ColorPicker`: Já prontos.
- shadcn/ui: Card, Button, Input, Textarea, Select, Form, Dialog, Skeleton.

---

## 2. Design UI/UX (Wireframe em Texto)

### 2.1 Página de Criação de Área (`/areas/criar`)
**Referência:** Semelhante ao `AreaEditPage` mas sem dados pré-populados.

*Layout:*
- Header: "Criar Nova Área" + Botão Voltar
- Card central:
  - Input: Nome (obrigatório)
  - EmojiPicker: Ícone
  - ColorPicker: Cor
  - Textarea: Descrição
- Footer: Botões "Cancelar" e "Criar Área"

*Validação Zod:*
- Nome: 1-100 chars, obrigatório.
- Emoji: default '🎯'.
- Cor: default '#6366f1'.
- Descrição: max 500 chars.

### 2.2 CRUD de Metas (Genérico)
**Estrutura de URLs:** `/metas/:nivel` (grande, anual, mensal, semanal, diaria)
- Detalhe: `/metas/:nivel/:id`
- Criar: `/metas/:nivel/criar`
- Editar: `/metas/:nivel/:id/editar`

*Wireframe - Detail Page:*
```
+----------------------------------------------------------+
|  [< Voltar]  Meta Details                     [Editar]   |
+----------------------------------------------------------+
|  [Emoji]  Título da Meta                      [⭐ One]   |
|  Status: Ativa | Nível: Anual                            |
+----------------------------------------------------------+
|  Descrição:                                             |
|  [Texto da descrição...]                               |
+----------------------------------------------------------+
|  Área Vinculada: [Nome da Área] (Link para Area)        |
+----------------------------------------------------------+
|  Submetas (Filhos):                                     |
|  - [ ] Meta Filha 1                                    |
|  - [ ] Meta Filha 2                                    |
|  [+ Adicionar Submeta]                                 |
+----------------------------------------------------------+
|  Tarefas Vinculadas:                                    |
|  [ ] Tarefa 1 - 14:00 - Alta                            |
|  [ ] Tarefa 2 - 16:00 - Média                           |
|  [+ Adicionar Tarefa]                                   |
+----------------------------------------------------------+
|  [Botão Concluir Meta]  [Botão Arquivar]                |
+----------------------------------------------------------+
```

*Wireframe - Create/Edit Page:*
```
+----------------------------------------------------------+
|  [< Voltar]  Criar Meta                     [Salvar]     |
+----------------------------------------------------------+
|  Título: [___________________________]                   |
|  Descrição: [_________________________________]         |
+----------------------------------------------------------+
|  Área: [Selecionar Área        v]                       |
|  Nível: (Selecionado pela URL - readonly se necessário) |
+----------------------------------------------------------+
|  ☑️ Definir como minha "One Thing"                      |
|  Focusing Question: [________________________________]  |
+----------------------------------------------------------+
|  Campos SMART (Opcional):                               |
|  - Objetivo: [...]                                      |
|  - Específico: [...]                                    |
+----------------------------------------------------------+
```

### 2.3 Empty States (Genérico)
*Wireframe:*
```
+------------------------------------------+
|          [Ícone Grande cinza]            |
|                                          |
|   Nenhum item encontrado                 |
|   Aqui vai uma descrição explicativa    |
|   do que o usuário deve fazer.           |
|                                          |
|   [Botão Primário: Criar Primeiro Item]  |
+------------------------------------------+
```
- **Áreas:** "Nenhuma área criada ainda. Crie sua primeira área de vida para começar a organizar suas metas."
- **Metas:** "Você ainda não definiu nenhuma meta neste nível. Que tal criar uma?"
- **Tarefas:** "Nenhuma tarefa para hoje. Descanse ou aproveite o tempo livre!"
- **Revisões:** "Revisão semanal vazia.complete suas tarefas para gerar insights."

### 2.4 Criação de Tarefas (`/agenda/tarefas/criar`)
*Wireframe:*
```
+----------------------------------------------------------+
|  [< Voltar]  Nova Tarefa                      [Salvar]  |
+----------------------------------------------------------+
|  Título: [___________________________] *                |
+----------------------------------------------------------+
|  Descrição: [_________________________________]          |
+----------------------------------------------------------+
|  Data: [Calendário]                                      |
|  Horário: [__:__]  Bloco: [Manhã/Tarde/Noite/One Thing] |
+----------------------------------------------------------+
|  Meta Vinculada: [Selecionar Meta     v] (Opcional)      |
|  Prioridade: ( ) Alta  ( ) Média  ( ) Baixa              |
+----------------------------------------------------------+
|  Recorrência: [Nenhuma        v]                         |
+----------------------------------------------------------+
```

---

## 3. Fluxo de Dados

### 3.1 Criação de Área
1. Usuário acessa `/areas/criar`.
2. Preenche formulário (react-hook-form + zod).
3. Submit -> Chama `createArea` do AppContext.
4. AppContext chama `areasService.create`.
5. Supabase insere registro.
6. AppContext atualiza estado `areas`.
7. Navigate para `/areas/:id` (detail).

### 3.2 CRUD de Metas
1. **Create:**
   - Usuário acessa `/metas/:nivel/criar`.
   - Define nível via URL (não há seletor de nível, é definido pela página).
   - Submit -> `metasService.create(userId, { ...dados, nivel: params.nivel })`.
   - Atualiza estado global.
2. **Read:**
   - `MetaDetailPage` busca `meta` via `useApp().getMetaById(id)`.
   - Se não encontrar, mostra estado de "Não encontrada".
   - Se encontrar, carrega filhas (`metasService.getByParentId`).
3. **Update/Delete:**
   - Semelhante ao padrão de Áreas.

### 3.3 Empty States
- Verificar comprimento do array de dados no componente (ex: `areas.length === 0`).
- Se vazio, renderizar `<EmptyState ... />`.
- Se não vazio, renderizar `<Table ou Grid>`.

---

## 4. Lista de Tarefas Detalhadas

### Fase 1: Preparação & Criação de Áreas
- [ ] **4.1.1** Adicionar rota `/areas/criar` em `routes.ts`
- [ ] **4.1.2** Criar componente `AreaCreatePage.tsx` (cópia do Edit removendo pré-população)
- [ ] **4.1.3** Testar criação de área via UI (verificar se aparece na lista)

### Fase 2: CRUD de Metas (Genérico)
- [ ] **4.2.1** Definir `metaFormSchema.ts` com Zod (campos: titulo, descricao, area_id, nivel, one_thing, focusing_question)
- [ ] **4.2.2** Criar `MetaDetailPage.tsx` (genérico)
  - Exibir detalhes da meta.
  - Exibir lista de tarefas filhas (vincular `tarefasService.getByMetaId`).
  - Exibir lista de metas filhas (vincular `metasService.getByParentId`).
  - Ações: Concluir, Arquivar, Voltar.
- [ ] **4.2.3** Criar `MetaCreatePage.tsx` (genérico)
  - Campos do schema.
  - Select de Área (buscar áreas do usuário).
- [ ] **4.2.4** Criar `MetaEditPage.tsx` (genérico)
  - Semelhante ao create, mas pré-populando dados.
- [ ] **4.2.5** Configurar rotas dinâmicas em `routes.ts` para todos os níveis:
  - `/metas/grandes`, `/metas/grandes/:id`, `/metas/grandes/criar`, etc.

### Fase 3: Empty States
- [ ] **4.3.1** Importar e implementar `EmptyState` em `AreasListPage.tsx`
- [ ] **4.3.2** Implementar `EmptyState` em `GrandesMetasPage`, `MetasAnuaisPage`, `MetasMensaisPage`, `MetasSemanaisPage`, `MetasDiariasPage`
- [ ] **4.3.3** Implementar `EmptyState` em `AgendaHojePage`, `AgendaSemanaPage`
- [ ] **4.3.4** Implementar `EmptyState` em `RevisaoSemanalPage`, `RevisaoMensalPage`

### Fase 4: Criação de Tarefas
- [ ] **4.4.1** Definir `tarefaFormSchema.ts` com Zod (titulo, data, hora, bloco, prioridade, meta_id, recorrencia)
- [ ] **4.4.2** Criar `TarefaCreatePage.tsx`
  - Form com validação Zod.
  - Select para Meta (buscar metas ativas).
- [ ] **4.4.3** Adicionar rota `/agenda/tarefas/criar` em `routes.ts`
- [ ] **4.4.4** Adicionar botão flutuante (FAB) ou link na Agenda para criar tarefa rápidamente (opcional, mas esperado no UX).

---

## 5. Critérios de Aceite

- [ ] Usuário consegue criar uma nova Área através de formulário.
- [ ] Usuário consegue criar, editar e visualizar Metas de qualquer nível (G/A/M/S/D).
- [ ] Páginas de detalhe de Meta mostram corretamente suas sub-metas e tarefas filhas.
- [ ] Empty States aparecem corretamente quando não há dados.
- [ ] Usuário consegue criar uma nova Tarefa vinculada a uma Meta.
- [ ] Todo formulário possui validação Zod e feedback visual de erros.
- [ ] Navegação entre páginas funciona corretamente.
- [ ] Responsividade: páginas funcionem em mobile (layout empilhado).