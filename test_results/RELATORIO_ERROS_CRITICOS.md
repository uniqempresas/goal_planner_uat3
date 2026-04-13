# 🚨 RELATÓRIO DE TESTES NA VERCEL - ERROS CRÍTICOS

**Data:** 08 de Abril de 2026  
**Testador:** NEO  
**URL:** https://goal-planner-uat3.vercel.app  
**Credenciais:** henriqsillva@gmail.com / @HQ29lh19

---

## 📊 RESUMO EXECUTIVO

❌ **STATUS: SISTEMA BLOQUEADO PARA BETA**  
Dois erros críticos no banco de dados Supabase impedem o funcionamento correto:

1. ❌ **Tabela 'habitos' não existe** - Sistema de hábitos completamente quebrado
2. ❌ **Coluna 'prazo' não existe em 'metas'** - Não é possível criar metas anuais/mensais

---

## ❌ ERROS CRÍTICOS ENCONTRADOS

### Erro #1: Tabela 'habitos' não existe

**Mensagem:**
```
Could not find the tablet public.habitos in the schema cache
```

**Quando ocorre:** Ao tentar criar um novo hábito em `/habitos/criar`

**Impacto:** 
- ❌ Impossível criar hábitos
- ❌ Impossível ver lista de hábitos  
- ❌ Sistema de hábitos 100% inoperante

**Causa:** A tabela `habitos` não foi criada no Supabase

**Solução:** Executar script SQL para criar a tabela (ver abaixo)

---

### Erro #2: Coluna 'prazo' não existe em 'metas'

**Mensagem:**
```
Could not find the 'prazo' column of 'metas' in the schema cache
```

**Quando ocorre:** Ao tentar criar meta anual ou mensal

**Impacto:**
- ❌ Impossível criar metas anuais
- ❌ Impossível criar metas mensais
- ❌ Formulário quebra ao submeter

**Causa:** O código foi corrigido para enviar campo 'prazo', mas a coluna não existe no banco

**Solução:** Adicionar coluna 'prazo' na tabela 'metas' (incluído no script abaixo)

---

## ✅ CORREÇÕES CONFIRMADAS (FUNCIONANDO)

| Funcionalidade | Status | Commit |
|---------------|--------|--------|
| Navegação Grandes Metas | ✅ OK | `e8cbae4` |
| Campo prazo enviado pelo código | ✅ OK | `bfc8fe1` |
| Typo recurrencia→recorrencia | ✅ OK | `dc8a930` |
| Botão Excluir nas metas | ✅ OK | Interface presente |
| Breadcrumb correto | ✅ OK | Links funcionando |

---

## 🔧 SCRIPT DE CORREÇÃO

### Arquivos Criados:

1. **`docs/FIX_DATABASE_SQL.sql`** - Script completo para executar no Supabase
2. **`docs/FIX_TABELA_HABITOS.md`** - Documentação detalhada

### Como Executar:

```bash
# Passo 1: Acesse o Supabase
https://app.supabase.com

# Passo 2: Vá em SQL Editor → New Query

# Passo 3: Cole o conteúdo de docs/FIX_DATABASE_SQL.sql

# Passo 4: Clique em "Run" (▶️)

# Passo 5: Teste novamente na Vercel
```

### O que o script faz:

1. ✅ Cria tabela `habitos` com todas as colunas necessárias
2. ✅ Adiciona coluna `prazo` na tabela `metas`
3. ✅ Configura RLS (Row Level Security) para proteção de dados
4. ✅ Cria políticas de acesso (usuários só veem seus dados)
5. ✅ Adiciona índices para performance
6. ✅ Configura trigger para atualizar `updated_at` automaticamente

---

## 📋 CHECKLIST PRÉ-BETA (Bloqueado)

Antes de liberar para beta testers, confirmar:

### 🔴 CRÍTICO - Precisa corrigir:
- [ ] Executar script SQL no Supabase
- [ ] Testar criação de hábitos
- [ ] Testar criação de metas anuais
- [ ] Testar criação de metas mensais

### 🟡 IMPORTANTE - Recomendado:
- [ ] Limpar banco de dados (manter apenas henriqsillva@gmail.com)
- [ ] Testar todas as funcionalidades novamente
- [ ] Verificar se não há outros erros de schema

### 🟢 OPCIONAL - Melhorias:
- [ ] Adicionar mais emojis e cores (já está no código, verificar na Vercel)
- [ ] Testar sistema de templates
- [ ] Verificar integração com revisões

---

## 🎯 PRÓXIMOS PASSOS

### Opção A: Executar Correção Agora
1. Acesse https://app.supabase.com
2. Execute o script `docs/FIX_DATABASE_SQL.sql`
3. Teste na Vercel
4. Me avise para verificar se funcionou

### Opção B: Delegar para mim
Se quiser, posso tentar executar via MCP do Supabase (se estiver configurado).

### Opção C: Debug detalhado
Posso fazer mais testes para identificar se há outros erros de schema.

---

## 📞 SUPORTE

Se precisar de ajuda para executar o script ou tiver dúvidas:
- 📄 Documentação completa: `docs/FIX_TABELA_HABITOS.md`
- 🗃️ Script SQL: `docs/FIX_DATABASE_SQL.sql`

---

## 📝 HISTÓRICO DE TESTES

- **08/04 15:30** - Teste inicial, encontrado erro de 'prazo'
- **08/04 16:00** - Teste de navegação Grandes Metas - OK
- **08/04 16:15** - Teste de criação de hábito - ERRO: tabela não existe
- **08/04 16:30** - Criados scripts de correção

---

**Status:** ⛔ AGUARDANDO CORREÇÃO NO BANCO DE DADOS  
**Pronto para Beta:** NÃO ❌  
**Prioridade:** 🔥 CRÍTICA

---

*Relatório gerado automaticamente pelo NEO - Sistema de Testes Goal Planner*
