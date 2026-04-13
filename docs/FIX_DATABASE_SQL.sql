-- ========================================
-- FIX CRÍTICO: Criar tabela 'habitos' e coluna 'prazo' em 'metas'
-- Execute no SQL Editor do Supabase
-- ========================================

-- 1. CRIAR TABELA 'habitos' (se não existir)
CREATE TABLE IF NOT EXISTS public.habitos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    titulo TEXT NOT NULL,
    descricao TEXT,
    area_id UUID REFERENCES public.areas(id) ON DELETE SET NULL,
    frequencia_tipo TEXT NOT NULL CHECK (frequencia_tipo IN ('diario', 'semanal', 'dias_especificos')),
    frequencia_dias INTEGER DEFAULT 1,
    frequencia_semana_dias INTEGER[] DEFAULT '{}',
    duracao_minutos INTEGER DEFAULT 30,
    horario_preferido TIME,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'pausado', 'concluido', 'expirado')),
    streak_atual INTEGER DEFAULT 0,
    streak_maximo INTEGER DEFAULT 0,
    ultima_execucao DATE,
    meta_id UUID REFERENCES public.metas(id) ON DELETE SET NULL,
    data_inicio DATE DEFAULT CURRENT_DATE,
    data_fim DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ADICIONAR COLUNA 'prazo' NA TABELA 'metas' (se não existir)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'metas' 
        AND column_name = 'prazo'
    ) THEN
        ALTER TABLE public.metas ADD COLUMN prazo DATE;
    END IF;
END $$;

-- 3. ATIVAR RLS
ALTER TABLE public.habitos ENABLE ROW LEVEL SECURITY;

-- 4. CRIAR POLÍTICAS RLS (só se não existirem)
DO $$
BEGIN
    -- Select
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'habitos' AND policyname = 'Usuários veem apenas seus hábitos'
    ) THEN
        CREATE POLICY "Usuários veem apenas seus hábitos" 
        ON public.habitos FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    -- Insert
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'habitos' AND policyname = 'Usuários criam apenas seus hábitos'
    ) THEN
        CREATE POLICY "Usuários criam apenas seus hábitos" 
        ON public.habitos FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    -- Update
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'habitos' AND policyname = 'Usuários atualizam apenas seus hábitos'
    ) THEN
        CREATE POLICY "Usuários atualizam apenas seus hábitos" 
        ON public.habitos FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    -- Delete
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'habitos' AND policyname = 'Usuários deletam apenas seus hábitos'
    ) THEN
        CREATE POLICY "Usuários deletam apenas seus hábitos" 
        ON public.habitos FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- 5. CRIAR ÍNDICES
CREATE INDEX IF NOT EXISTS idx_habitos_user_id ON public.habitos(user_id);
CREATE INDEX IF NOT EXISTS idx_habitos_status ON public.habitos(status);
CREATE INDEX IF NOT EXISTS idx_habitos_area_id ON public.habitos(area_id);
CREATE INDEX IF NOT EXISTS idx_habitos_meta_id ON public.habitos(meta_id);

-- 6. TRIGGER PARA updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_habitos_updated_at ON public.habitos;
CREATE TRIGGER update_habitos_updated_at 
    BEFORE UPDATE ON public.habitos 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 7. FORÇAR REFRESH DO SCHEMA CACHE
NOTIFY pgrst, 'reload schema';

-- 8. VERIFICAÇÃO
SELECT '✅ Script executado com sucesso!' as status;
