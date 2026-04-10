# 🐛 Registro de Bugs e Correções - Goal Planner

**Projeto:** Goal Planner  
**Versão:** 4.0  
**Data de Criação:** 10/04/2026  
**Status:** Em desenvolvimento / Testes Beta

---

## 📋 ÍNDICE

1. [Bugs Conhecidos (Pré-Beta)](#bugs-conhecidos-pré-beta)
2. [Bugs Reportados pelos Beta Testers](#bugs-reportados-pelos-beta-testers)
3. [Template para Novos Bugs](#template-para-novos-bugs)
4. [Status das Correções](#status-das-correções)

---

## 🔴 Bugs Conhecidos (Pré-Beta)

Bugs identificados pela equipe de desenvolvimento antes do início dos testes beta.

### Bug #001: Formulário de Hábitos - Datas sendo resetadas

**Status:** 🔴 Não Corrigido  
**Prioridade:** Média  
**Categoria:** UX / Frontend  

**Descrição:**
Ao criar um novo hábito, quando o usuário seleciona os dias da semana (botões Seg, Ter, Qua, etc.), os campos de data (Início e Fim) são automaticamente resetados para vazio, causando erro de validação "Período é obrigatório".

**Passos para Reproduzir:**
1. Acesse: Menu → Hábitos → "+ Novo Hábito"
2. Preencha: Título, Descrição
3. Preencha: Data Início (ex: 10/04/2026) e Data Fim (ex: 31/12/2026)
4. Clique em qualquer botão de dia da semana (Seg, Ter, Qua...)
5. **ERRO:** As datas são limpas e aparece "Período é obrigatório"

**Comportamento Esperado:**
Os dias da semana devem ser selecionados sem afetar os campos de data.

**Comportamento Atual:**
Seleção de dias limpa as datas.

**Impacto:**
- Usuário precisa preencher datas DEPOIS de selecionar os dias
- Experiência confusa
- Não impede o uso, mas frustra o usuário

**Notas Técnicas:**
- Arquivo provável: `src/app/pages/habitos/HabitoCreatePage.tsx`
- Possível causa: Estado do formulário sendo sobrescrito no onChange dos dias
- A tabela `habitos` no Supabase está funcionando corretamente

**Previsão de Correção:** Sprint 5  
**Responsável:** A definir  

---

### Bug #002: [Reservado para futuros bugs pré-beta]

**Status:** ⚪ Não Iniciado  
**Prioridade:**  
**Categoria:**  

**Descrição:**

**Passos para Reproduzir:**

**Impacto:**

**Notas Técnicas:**

---

## 📝 Bugs Reportados pelos Beta Testers

Espaço para registrar bugs encontrados pelos usuários durante o período de testes beta.

### Bug #B001: [Título do Bug]

**Reportado por:** [Nome do Tester]  
**Data do Reporte:** DD/MM/AAAA  
**Status:** 🟡 Em Análise | 🔴 Confirmado | 🟢 Corrigido | ⚪ Não Reproduzido  
**Prioridade:** 🔥 Crítica | 🟠 Alta | 🟡 Média | 🟢 Baixa  
**Categoria:** Funcionalidade | UX | Performance | Segurança | Outro  

**Descrição:**
[Descreva o bug detalhadamente]

**Passos para Reproduzir:**
1. 
2. 
3. 

**Comportamento Esperado:**

**Comportamento Atual:**

**Screenshots/Anexos:**
[Links ou referências]

**Ambiente do Tester:**
- Navegador: 
- Dispositivo: 
- Sistema Operacional: 

**Notas da Equipe:**
[Análise técnica, comentários, etc.]

**Commit de Correção:** 
[Hash do commit quando corrigido]

---

### Bug #B002: 

**Reportado por:**  
**Data do Reporte:**  
**Status:**  
**Prioridade:**  
**Categoria:**  

**Descrição:**

**Passos para Reproduzir:**

**Comportamento Esperado:**

**Comportamento Atual:**

**Screenshots/Anexos:**

**Ambiente do Tester:**
- Navegador: 
- Dispositivo: 
- Sistema Operacional: 

**Notas da Equipe:**

**Commit de Correção:** 

---

## 📝 Template para Novos Bugs

Use este template para adicionar novos bugs ao registro:

```markdown
### Bug #B[XXX]: [Título Breve do Bug]

**Reportado por:** [Nome do Tester]  
**Data do Reporte:** DD/MM/AAAA  
**Status:** 🟡 Em Análise  
**Prioridade:** [🔥 Crítica | 🟠 Alta | 🟡 Média | 🟢 Baixa]  
**Categoria:** [Funcionalidade | UX | Performance | Segurança | Outro]  

**Descrição:**
[Descreva o que aconteceu]

**Passos para Reproduzir:**
1. [Passo 1]
2. [Passo 2]
3. [Passo 3]

**Comportamento Esperado:**
[O que deveria acontecer]

**Comportamento Atual:**
[O que está acontecendo errado]

**Screenshots/Anexos:**
[Se houver, adicione links ou referências]

**Ambiente do Tester:**
- Navegador: [Chrome, Firefox, Safari, etc.]
- Dispositivo: [Desktop, Mobile, Tablet]
- Sistema Operacional: [Windows, macOS, Linux, iOS, Android]

**Notas da Equipe:**
[Deixe em branco - será preenchido pela equipe técnica]

**Commit de Correção:** 
[Deixe em branco - será preenchido quando corrigido]
```

---

## 📊 Status das Correções

### Resumo Geral

| Status | Quantidade | Cor |
|--------|------------|-----|
| 🔴 Não Corrigido | 1 | Vermelho |
| 🟡 Em Análise | 0 | Amarelo |
| 🟠 Em Correção | 0 | Laranja |
| 🟢 Corrigido | 0 | Verde |
| ⚪ Não Reproduzido | 0 | Cinza |
| **TOTAL** | **1** | |

### Por Prioridade

| Prioridade | Quantidade |
|------------|------------|
| 🔥 Crítica | 0 |
| 🟠 Alta | 0 |
| 🟡 Média | 1 |
| 🟢 Baixa | 0 |

### Por Categoria

| Categoria | Quantidade |
|-----------|------------|
| Funcionalidade | 0 |
| UX | 1 |
| Performance | 0 |
| Segurança | 0 |
| Outro | 0 |

---

## 📅 Histórico de Atualizações

| Data | Versão | Mudanças |
|------|--------|----------|
| 10/04/2026 | 1.0 | Criação do documento + Bug #001 (Formulário de Hábitos) |
| | | |

---

## 📞 Contato

**Equipe de Desenvolvimento:**  
**Responsável pelo Projeto:**  
**Canal de Reporte de Bugs:** [Email/Grupo/Discord]

---

## ✅ Checklist Pré-Lançamento

Antes de lançar oficialmente, verificar:

- [ ] Todos os bugs 🔴 Críticos corrigidos
- [ ] 90% dos bugs 🟠 Alta prioridade corrigidos
- [ ] Documentação atualizada
- [ ] Testes de regressão passando
- [ ] Aprovação do QA

---

**Última Atualização:** 10/04/2026  
**Próxima Revisão:** Após início dos testes Beta
