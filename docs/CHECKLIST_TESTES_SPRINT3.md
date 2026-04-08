# Checklist de Testes - Goal Planner Sprint 3

**Data:** 08/04/2026  
**Versão:** 3.1  
**Status:** Sprint 3 Completa

---

## 🚀 Como Usar Este Checklist

1. Abra um terminal e rode: `npm run dev`
2. Abra o navegador em: http://localhost:5173
3. Siga os testes abaixo marcando [x] conforme for validando
4. Use as credenciais: **henriqsillva@gmail.com / @HQ29lh19**

---

## ✅ TESTE 1: Autenticação

### 1.1 Login
- [ ] Acesse http://localhost:5173/login
- [ ] Insira email: henriqsillva@gmail.com
- [ ] Insira senha: @HQ29lh19
- [ ] Clique em "Entrar"
- [ ] **Resultado esperado:** Redirecionado para Dashboard

### 1.2 Logout
- [ ] Clique no avatar/menu do usuário
- [ ] Clique em "Sair"
- [ ] **Resultado esperado:** Redirecionado para Landing Page

---

## ✅ TESTE 2: Dashboard - Bugs Corrigidos

### 2.1 Data Dinâmica (Bug corrigido)
- [ ] No Dashboard, verifique o cabeçalho superior
- [ ] **Resultado esperado:** Mostra data atual (ex: "8 de abr. de 2026")
- [ ] **NÃO deve mostrar:** "28 Mar 2026" (valor antigo mockado)

### 2.2 Stats Dinâmicos (Bug corrigido)
- [ ] Verifique o card "Sequência"
- [ ] **Resultado esperado:** Mostra número baseado nas tarefas reais
- [ ] Verifique o card "Foco esta semana"
- [ ] **Resultado esperado:** Mostra porcentagem calculada de tarefas concluídas

### 2.3 Áreas de Vida - Nomes (Bug corrigido)
- [ ] No Dashboard, role até "Áreas de Vida"
- [ ] **Resultado esperado:** Cada área mostra nome e ícone (ex: "💼 Carreira")
- [ ] **NÃO deve mostrar:** campos vazios ou "undefined"

### 2.4 Metas Anuais - Nomes (Bug corrigido)
- [ ] No Dashboard, role até "Metas Anuais"
- [ ] **Resultado esperado:** Cada meta mostra o título
- [ ] **NÃO deve mostrar:** campos vazios

### 2.5 Grandes Metas - Sem NaN (Bug corrigido)
- [ ] No Dashboard, verifique "Grandes Metas"
- [ ] **Resultado esperado:** Percentual mostra "0%" (não "NaN%")

---

## ✅ TESTE 3: CRUD Metas - Todos os Níveis

### 3.1 Metas Anuais
- [ ] Acesse: http://localhost:5173/metas/anual
- [ ] Clique em "Nova Meta Anual"
- [ ] Preencha título e salve
- [ ] **Resultado:** Meta criada aparece na lista
- [ ] Clique em "Editar" na meta criada
- [ ] **Resultado:** Abre página de edição (/metas/anual/{id}/editar)
- [ ] Altere o título e salve
- [ ] **Resultado:** Alterações persistidas
- [ ] Clique em "Excluir"
- [ ] Confirme a exclusão
- [ ] **Resultado:** Meta removida da lista

### 3.2 Metas Mensais
- [ ] Acesse: http://localhost:5173/metas/mensal
- [ ] Clique em "Nova Meta Mensal"
- [ ] Preencha título, selecione uma meta pai anual
- [ ] Salve
- [ ] **Resultado:** Meta criada aparece na lista vinculada à anual
- [ ] Teste edição e exclusão (mesmo fluxo do anual)

### 3.3 Metas Semanais
- [ ] Acesse: http://localhost:5173/metas/semanal
- [ ] Clique em "Nova Meta Semanal"
- [ ] Preencha e selecione meta pai mensal
- [ ] Salve
- [ ] **Resultado:** Meta criada e vinculada corretamente
- [ ] Teste edição e exclusão

### 3.4 Metas Diárias
- [ ] Acesse: http://localhost:5173/metas/diaria
- [ ] Clique em "Nova Meta Diária"
- [ ] Preencha e selecione meta pai semanal
- [ ] Salve
- [ ] **Resultado:** Meta criada e vinculada corretamente
- [ ] Teste edição e exclusão

### 3.5 Criar Meta Filha (Bug corrigido)
- [ ] Acesse uma Meta Anual (detalhe)
- [ ] Clique em "Criar Meta Filha"
- [ ] **Resultado esperado:** Redireciona para /metas/mensal/criar?pai={id}
- [ ] Verifique se o seletor de meta pai já vem preenchido
- [ ] Crie a meta mensal
- [ ] Repita o teste: Anual → Mensal → Semanal → Diária

---

## ✅ TESTE 4: Áreas de Vida

### 4.1 Listagem
- [ ] Acesse: http://localhost:5173/areas
- [ ] **Resultado:** Lista com 8 áreas padrão visíveis

### 4.2 Criar Área
- [ ] Clique em "Nova Área"
- [ ] No seletor de emoji: **verifique se há 70+ opções**
- [ ] No seletor de cor: **verifique se há 18+ opções**
- [ ] Preencha e salve
- [ ] **Resultado:** Área aparece na lista

### 4.3 Editar Área
- [ ] Clique em uma área existente
- [ ] Clique em "Editar"
- [ ] Altere o nome
- [ ] Salve
- [ ] **Resultado:** Alterações persistidas

### 4.4 Excluir Área
- [ ] Abra uma área
- [ ] Clique em "Excluir"
- [ ] Confirme
- [ ] **Resultado:** Área removida

---

## ✅ TESTE 5: Agenda - Bugs Corrigidos

### 5.1 Agenda Hoje
- [ ] Acesse: http://localhost:5173/agenda/hoje
- [ ] **Resultado:** Tarefas do dia listadas

### 5.2 Criar Tarefa
- [ ] Clique em "Nova Tarefa"
- [ ] Preencha título, horário, prioridade
- [ ] Salve
- [ ] **Resultado:** Tarefa aparece na lista

### 5.3 Editar Tarefa (Bug corrigido)
- [ ] Passe o mouse sobre uma tarefa
- [ ] Clique no ícone de lápis (editar)
- [ ] **Resultado:** Abre página de edição
- [ ] Altere o título e salve
- [ ] **Resultado:** Alterações persistidas

### 5.4 Excluir Tarefa com Auto-Refresh (Bug corrigido)
- [ ] Passe o mouse sobre uma tarefa
- [ ] Clique no ícone de lixeira (excluir)
- [ ] Confirme a exclusão
- [ ] **Resultado:** Tarefa removida da lista automaticamente (sem F5)

### 5.5 Toggle Conclusão
- [ ] Clique no círculo/checkbox de uma tarefa não concluída
- [ ] **Resultado:** Tarefa marcada como concluída (riscada)
- [ ] Clique novamente
- [ ] **Resultado:** Tarefa desmarcada

---

## ✅ TESTE 6: Hábitos

### 6.1 Listagem
- [ ] Acesse: http://localhost:5173/habitos
- [ ] **Resultado:** Lista de hábitos visível

### 6.2 Criar Hábito
- [ ] Clique em "Novo Hábito"
- [ ] Preencha nome, frequência, área
- [ ] Salve
- [ ] **Resultado:** Hábito criado aparece na lista

### 6.3 Completar Hábito
- [ ] Na lista, clique em "Completar" em um hábito
- [ ] **Resultado:** Streak aumenta

---

## ✅ TESTE 7: Revisões

### 7.1 Revisão Semanal
- [ ] Acesse: http://localhost:5173/revisoes/semanal
- [ ] **Resultado:** Checklist carregado
- [ ] Marque alguns itens
- [ ] Clique em "Salvar"
- [ ] Recarregue a página
- [ ] **Resultado:** Checklist mantém estado salvo

### 7.2 Revisão Mensal
- [ ] Acesse: http://localhost:5173/revisoes/mensal
- [ ] **Resultado:** Formulário carregado
- [ ] Preencha os campos
- [ ] Salve
- [ ] Recarregue
- [ ] **Resultado:** Dados persistidos

---

## ✅ TESTE 8: Configurações

### 8.1 Perfil
- [ ] Acesse: http://localhost:5173/configuracoes/perfil
- [ ] Altere o nome
- [ ] Altere a bio
- [ ] Salve
- [ ] **Resultado:** Alterações persistidas

### 8.2 Segurança
- [ ] Acesse: http://localhost:5173/configuracoes/seguranca
- [ ] **Resultado:** Opções de segurança visíveis
- [ ] Teste alteração de senha (se desejar)

---

## ✅ TESTE 9: Templates

### 9.1 Listar Templates
- [ ] Acesse: http://localhost:5173/templates
- [ ] **Resultado:** Templates padrão visíveis

### 9.2 Aplicar Template
- [ ] Clique em "Aplicar" em um template
- [ ] **Resultado:** Tarefas geradas automaticamente
- [ ] Verifique na Agenda Hoje se as tarefas apareceram

---

## 📊 Resumo dos Testes

**Total de Testes:** 50+ verificações

**Bugs Críticos Corrigidos:**
- ✅ Dashboard data dinâmica
- ✅ Dashboard stats dinâmicos
- ✅ Metas CRUD completo
- ✅ Agenda auto-refresh
- ✅ Todos os níveis de metas funcionando

**Se todos os testes passarem:** O sistema está pronto para deploy! 🚀

---

## 🐛 Encontrou algum bug?

Documente:
1. Qual teste falhou
2. O que era esperado
3. O que aconteceu
4. Screenshots (se possível)

---

**Data do checklist:** 08/04/2026  
**Versão testada:** 3.1 (Commit 600fc88)
