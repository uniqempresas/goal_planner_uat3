# ERRO CRÍTICO - Tabela 'habitos' não encontrada

**Data:** 08/04/2026  
**Erro:** `Could not find the tablet public.habitos in the schema cache`  
**Impacto:** Sistema de Hábitos completamente QUEBRADO

---

## 🚨 Problema

Ao tentar criar um novo Hábito, o sistema retorna erro dizendo que a tabela `public.habitos` não existe no schema cache do Supabase.

### Possíveis Causas:

1. ❌ **Tabela não foi criada** no Supabase
2. ❌ **Nome da tabela incorreto** (plural vs singular)
3. ❌ **Problema de schema** (public vs outro schema)
4. ❌ **RLS (Row Level Security)** bloqueando acesso
5. ❌ **Cache do Supabase** desatualizado

---

## ✅ Solução - Script SQL Completo

Execute no SQL Editor do Supabase:

```sql
-- ========================================
-- 1. VERIFICAR SE TABELA EXISTE
-- ========================================
SELECT * FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'habitos';

-- Se retornar vazio, a tabela NÃO existe

-- ========================================
-- 2. CRIAR TABELA 'habitos' (se não existir)
-- ========================================
CREATE TABLE IF NOT EXISTS public.habitos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    
    -- Frequência
    frequencia_tipo TEXT NOT NULL CHECK (frequencia_tipo IN ('diario', 'semanal', 'dias_especificos')),
    frequencia_dias INTEGER DEFAULT 1, -- para 'diario': intervalo em dias
    frequencia_semana_dias INTEGER[] DEFAULT '{}', -- para 'semanal': [1,3,5] = seg,qua,sex
    
    -- Duração e horário
    duracao_minutos INTEGER DEFAULT 30,
    horario_preferido TIME,
    
    -- Status
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'concluido', 'expirado')),
    
    -- Streak (sequência)
    streak_atual INTEGER DEFAULT 0,
    streak_maximo INTEGER DEFAULT 0,
    ultima_execucao DATE,
    
    -- Metas
    meta_id UUID REFERENCES public.metas(id) ON DELETE SET NULL,
    
    -- Datas
    data_inicio DATE DEFAULT CURRENT_DATE,
    data_fim DATE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 3. ADICIONAR COLUNA 'prazo' NA TABELA 'metas' (se não existir)
-- ========================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'metas' 
        AND column_name = 'prazo'
    ) THEN
        ALTER TABLE public.metas ADD COLUMN prazo DATE;
        RAISE NOTICE 'Coluna prazo adicionada à tabela metas';
    ELSE
        RAISE NOTICE 'Coluna prazo já existe na tabela metas';
    END IF;
END $$;

-- ========================================
-- 4. ATIVAR RLS (Row Level Security)
-- ========================================
ALTER TABLE public.habitos ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 5. CRIAR POLÍTICAS RLS
-- ========================================

-- Política: Usuários só veem seus próprios hábitos
CREATE POLICY "Usuários veem apenas seus hábitos" 
ON public.habitos FOR SELECT 
USING (auth.uid() = user_id);

-- Política: Usuários só inserem hábitos para si mesmos
CREATE POLICY "Usuários criam apenas seus hábitos" 
ON public.habitos FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Política: Usuários só atualizam seus próprios hábitos
CREATE POLICY "Usuários atualizam apenas seus hábitos" 
ON public.habitos FOR UPDATE 
USING (auth.uid() = user_id);

-- Política: Usuários só deletam seus próprios hábitos
CREATE POLICY "Usuários deletam apenas seus hábitos" 
ON public.habitos FOR DELETE 
USING (auth.uid() = user_id);

-- ========================================
-- 6. CRIAR ÍNDICES PARA PERFORMANCE
-- ========================================
CREATE INDEX IF NOT EXISTS idx_habitos_user_id ON public.habitos(user_id);
CREATE INDEX IF NOT EXISTS idx_habitos_status ON public.habitos(status);
CREATE INDEX IF NOT EXISTS idx_habitos_area_id ON public.habitos(area_id);
CREATE INDEX IF NOT EXISTS idx_habitos_meta_id ON public.habitos(meta_id);

-- ========================================
-- 7. TRIGGER PARA ATUALIZAR updated_at
-- ========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_habitos_updated_at 
    BEFORE UPDATE ON public.habitos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- 8. VERIFICAÇÃO FINAL
-- ========================================
SELECT 
    'Tabela habitos criada com sucesso!' as status,
    COUNT(*) as colunas
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'habitos';
```

---

## 🔧 Instruções Passo a Passo

### Passo 1: Acessar Supabase
1. Vá para: https://app.supabase.com
2. Faça login
3. Selecione o projeto "Goal Planner"

### Passo 2: Abrir SQL Editor
1. No menu lateral, clique em **"SQL Editor"**
2. Clique em **"New query"**
3. Cole o script acima

### Passo 3: Executar
1. Clique no botão **"Run"** (▶️)
2. Aguarde a execução completa
3. Verifique a mensagem de sucesso

### Passo 4: Testar
1. Acesse: https://goal-planner-uat3.vercel.app/habitos
2. Tente criar um novo hábito
3. Verifique se funciona!

---

## 📋 Checklist de Verificação

Após executar o script, confirme:

- [ ] Tabela `habitos` aparece no Table Editor
- [ ] RLS está ativado (cadeado vermelho no ícone da tabela)
- [ ] Políticas RLS aparecem na aba "Policies"
- [ ] Consegue criar um hábito pela UI
- [ ] Consegue editar o hábito
- [ ] Consegue excluir o hábito

---

## 🐛 Se ainda não funcionar...

### Opção A: Limpar Cache do Supabase
```sql
-- Forçar atualização do schema cache
NOTIFY pgrst, 'reload schema';
```

### Opção B: Verificar Permissões
```sql
-- Verificar se o usuário autenticado tem permissão
SELECT * FROM pg_policies WHERE tablename = 'habitos';
```

### Opção C: Recriar Tabela (último recurso)
```sql
-- ⚠️ CUIDADO: Isso apaga TODOS os dados de hábitos!
DROP TABLE IF EXISTS public.habitos CASCADE;
-- Depois execute o script de criação novamente
```

---

## 📝 Notas

- O script também **adiciona a coluna 'prazo'** na tabela 'metas' (outro erro que encontramos)
- Todas as políticas RLS garantem que usuários só vejam seus próprios dados
- Índices criados para melhorar performance

---

**Criado por:** NEO  
**Data:** 08/04/2026
