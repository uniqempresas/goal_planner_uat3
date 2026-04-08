# Checklist de Testes - Validação na Vercel

**Data:** 08/04/2026  
**Versão:** 1.0  
**Ambiente:** Produção (Vercel)  
**URL:** [Inserir URL da Vercel aqui]

---

## 🚀 Instruções

1. Acesse a URL da Vercel no navegador
2. Use suas credenciais: **henriqsillva@gmail.com / @HQ29lh19**
3. Siga os testes abaixo marcando [x] conforme for validando
4. Se encontrar algum erro, anote para correção

---

## ✅ TESTES BÁSICOS (5 min)

### 1. Login e Navegação
- [ ] Acessa a URL da Vercel
- [ ] Faz login com sucesso
- [ ] Dashboard carrega com dados
- [ ] Menu lateral funciona (abre/fecha)
- [ ] Consegue navegar entre todas as seções

### 2. Logout
- [ ] Clica em "Sair"
- [ ] Redireciona para login
- [ ] Não consegue acessar dashboard sem login

---

## ✅ TESTES DASHBOARD (3 min)

- [ ] Data atual aparece no cabeçalho
- [ ] Stats carregam (sequência, produtividade, tarefas)
- [ ] "ONE Thing" do dia aparece
- [ ] Grandes Metas listadas com nome e %
- [ ] Áreas de Vida aparecem com ícones
- [ ] Metas Anuais aparecem com nome

---

## ✅ TESTES DE METAS - HIERARQUIA COMPLETA (10 min)

### Grande Meta
- [ ] Acessa "/metas/grandes"
- [ ] Cria nova Grande Meta
- [ ] Edita uma Grande Meta
- [ ] **Volta para lista e vê a meta criada**

### Meta Anual (Filha da Grande)
- [ ] Acessa "/metas/anual"
- [ ] Cria Meta Anual vinculada a Grande Meta
- [ ] Edita Meta Anual
- [ ] Clica em "Criar Meta Filha" → deve ir para **Meta Mensal**

### Meta Mensal (Filha da Anual)
- [ ] Acessa "/metas/mensal"
- [ ] Cria Meta Mensal vinculada a Anual
- [ ] Edita Meta Mensal
- [ ] Clica em "Criar Meta Filha" → deve ir para **Meta Semanal**

### Meta Semanal (Filha da Mensal)
- [ ] Acessa "/metas/semanal"
- [ ] Cria Meta Semanal vinculada a Mensal
- [ ] Edita Meta Semanal
- [ ] Clica em "Criar Meta Filha" → deve ir para **Meta Diária**

### Meta Diária (Filha da Semanal - último nível)
- [ ] Acessa "/metas/diaria"
- [ ] Cria Meta Diária vinculada a Semanal
- [ ] Edita Meta Diária
- [ ] **NÃO deve ter botão "Criar Meta Filha"** (último nível)

---

## ✅ TESTES DE ÁREAS (3 min)

- [ ] Acessa "/areas"
- [ ] Cria nova Área (testar vários emojis e cores)
- [ ] Edita uma Área
- [ ] Exclui uma Área (se houver para teste)
- [ ] Verifica se áreas aparecem no Dashboard

---

## ✅ TESTES DE AGENDA (5 min)

- [ ] Acessa "/agenda/hoje"
- [ ] Cria nova tarefa
- [ ] Edita tarefa existente
- [ ] Marca tarefa como concluída (checkbox)
- [ ] Exclui tarefa
- [ ] **Verifica se exclusão atualiza a tela automaticamente**
- [ ] Acessa "/agenda/semana" (visualização semanal)

---

## ✅ TESTES DE HÁBITOS (3 min)

- [ ] Acessa "/habitos"
- [ ] Cria novo hábito
- [ ] Marca hábito como completo
- [ ] Verifica se streak aumenta
- [ ] Edita hábito

---

## ✅ TESTES DE CONFIGURAÇÕES (3 min)

### Perfil
- [ ] Acessa "/configuracoes/perfil"
- [ ] Altera nome
- [ ] Altera bio
- [ ] Salva
- [ ] Recarrega página → verifica se persistiu

### Segurança
- [ ] Acessa "/configuracoes/seguranca"
- [ ] Página carrega sem erros

---

## ✅ TESTES DE RESPONSIVIDADE (5 min)

### No computador:
- [ ] Testa em tela grande (1920px)
- [ ] Reduz janela para tablet (768px)
- [ ] Reduz janela para mobile (375px)
- [ ] Menu adapta corretamente

### No celular (se possível):
- [ ] Acessa pelo celular
- [ ] Login funciona
- [ ] Consegue navegar no menu
- [ ] Consegue criar meta/tarefa
- [ ] Interface não quebra

---

## ✅ TESTES DE PERFORMANCE (2 min)

- [ ] Página carrega em menos de 3 segundos
- [ ] Navegação entre páginas é fluida
- [ ] Não há travamentos ao usar

---

## ✅ TESTES DO CONSOLE (F12)

Abra o console (F12 → Console) e verifique:

- [ ] Não há erros vermelhos ao carregar página
- [ ] Não há warnings críticos
- [ ] Não aparece erros ao navegar entre páginas
- [ ] Não aparece erros ao criar/editar itens

---

## 📊 RESULTADO

### Contagem de Testes:
- **Total:** ~50 verificações
- **Passaram:** ___
- **Falharam:** ___

### Bugs Encontrados:
| # | Bug | Severidade | Status |
|---|-----|------------|--------|
| 1 | | Alta/Média/Baixa | Corrigir/Ignorar |
| 2 | | | |

### Pode liberar para testes de usuários?
- [ ] SIM - Todos os testes passaram
- [ ] NÃO - Há bugs críticos para corrigir primeiro

---

**Validado por:** ________________  
**Data:** __/__/____  
**Versão testada:** 4.0
