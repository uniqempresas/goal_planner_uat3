# Correção do Erro "Dia do mês deve estar entre 1 e 31"

## Problema
Ao tentar criar uma Meta Semanal em `/metas/semanal/criar`, ocorria o erro:
> "Dia do mês deve estar entre 1 e 31"

## Causa Raiz
O problema era uma **inconsistência de tipos TypeScript** entre o frontend e o banco de dados:

1. ✅ **Banco de dados PostgreSQL**: Campo `prazo` existe (tipo `date`)
2. ❌ **Tipos Supabase** (`src/lib/supabase.ts`): Campo `prazo` **não estava definido** na tabela `metas`
3. ❌ **Tipos da aplicação** (`src/app/pages/metas/types.ts`): Tipo `SemanalMetaForm` **não incluía** o campo `prazo`
4. ✅ **Schema Zod** (`semanalMetaSchema.ts`): Validava o campo `prazo` corretamente

Essa inconsistência causava:
- Erros de compilação TypeScript
- Falha na comunicação com o Supabase
- Mensagem de erro confusa vinda do PostgreSQL

## Correções Aplicadas

### 1. Atualizar Tipos do Supabase (`src/lib/supabase.ts`)
Adicionado campo `prazo: string | null` em:
- `metas.Row`
- `metas.Insert`
- `metas.Update`

### 2. Atualizar Tipos da Aplicação (`src/app/pages/metas/types.ts`)
Adicionado `prazo: string` em:
- `SemanalMetaForm`
- `DiariaMetaForm`

### 3. Adicionar Logs de Debug (`src/app/pages/metas/MetaSemanalCreatePage.tsx`)
```typescript
console.log('DEBUG - Valor do prazo:', values.prazo);
console.log('DEBUG - Tipo do prazo:', typeof values.prazo);
console.log('DEBUG - Valores completos:', values);
```

## Formato Esperado da Data
O campo `prazo` deve ser enviado no formato **`YYYY-MM-DD`** (ex: `2026-04-19`).

Este formato é:
- ✅ Compatível com input type="date" do HTML
- ✅ Compatível com PostgreSQL tipo `date`
- ✅ Validado pelo schema Zod com regex `/^\d{4}-\d{2}-\d{2}$/`

## Validação
Para testar a correção:

1. Acesse http://localhost:5173/metas/semanal/criar
2. Preencha o formulário com:
   - Título: "Teste de Meta"
   - Prazo: Selecione qualquer data futura
3. Abra o console do navegador (F12)
4. Clique em "Criar Meta Semanal"
5. Verifique os logs de debug no console
6. A meta deve ser criada sem erros

## Verificação dos Tipos
Para regenerar os tipos do Supabase:
```bash
npx supabase gen types typescript --project-id kczebejbfznosmbrarsg --schema public > src/lib/database.types.ts
```

## Arquivos Modificados
- `src/lib/supabase.ts` - Adicionado campo `prazo` nos tipos
- `src/app/pages/metas/types.ts` - Adicionado `prazo` nos tipos de formulário
- `src/app/pages/metas/MetaSemanalCreatePage.tsx` - Adicionado logs de debug

## Nota
O erro "Dia do mês deve estar entre 1 e 31" era uma mensagem de erro do PostgreSQL quando recebia um valor de data inválido devido à inconsistência de tipos. Com os tipos corrigidos, o valor é enviado corretamente no formato `YYYY-MM-DD`.