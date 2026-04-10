import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================
// TIPOS DE RECORRÊNCIA
// ============================================

export type TipoRecorrencia = 'unica' | 'diaria' | 'semanal' | 'mensal' | 'anual' | 'intervalo_dias';

export interface RecorrenciaConfig {
  /** Tipo de recorrência */
  tipo: TipoRecorrencia;
  /** Para recorrência semanal: dias específicos [0-6] onde 0=Seg, 6=Dom */
  dias_semana?: number[];
  /** Para recorrência mensal: dia do mês (1-31) */
  dia_mes?: number;
  /** Para recorrência anual: mês (0-11) */
  mes_ano?: number;
  /** Para recorrência anual: dia do mês */
  dia_ano?: number;
  /** Para intervalo personalizado: a cada X dias */
  intervalo_dias?: number;
  /** Data de início da recorrência (padrão: data da tarefa) */
  data_inicio?: string; // YYYY-MM-DD
  /** Data de término (opcional) */
  data_fim?: string; // YYYY-MM-DD
  /** Número máximo de ocorrências (opcional) */
  max_ocorrencias?: number;
}

export const DIAS_SEMANA = [
  { value: 0, label: 'Segunda', short: 'Seg' },
  { value: 1, label: 'Terça', short: 'Ter' },
  { value: 2, label: 'Quarta', short: 'Qua' },
  { value: 3, label: 'Quinta', short: 'Qui' },
  { value: 4, label: 'Sexta', short: 'Sex' },
  { value: 5, label: 'Sábado', short: 'Sab' },
  { value: 6, label: 'Domingo', short: 'Dom' },
] as const;

export const TIPOS_RECORRENCIA: { value: TipoRecorrencia; label: string }[] = [
  { value: 'unica', label: 'Não repetir' },
  { value: 'diaria', label: 'Todo dia' },
  { value: 'semanal', label: 'Toda semana' },
  { value: 'mensal', label: 'Todo mês' },
  { value: 'anual', label: 'Todo ano' },
  { value: 'intervalo_dias', label: 'A cada X dias' },
];

// ============================================
// DATABASE TYPES
// ============================================

export type Database = {
  public: {
    Tables: {
      areas: {
        Row: {
          id: string;
          user_id: string | null;
          nome: string;
          cor: string | null;
          icone: string | null;
          descricao: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          nome: string;
          cor?: string | null;
          icone?: string | null;
          descricao?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          nome?: string;
          cor?: string | null;
          icone?: string | null;
          descricao?: string | null;
          created_at?: string;
        };
      };
      metas: {
        Row: {
          id: string;
          user_id: string | null;
          area_id: string | null;
          parent_id: string | null;
          nivel: 'grande' | 'anual' | 'mensal' | 'semanal' | 'diaria';
          titulo: string;
          descricao: string | null;
          status: 'ativa' | 'concluida' | 'arquivada';
          one_thing: boolean;
          focusing_question: string | null;
          smart_objetivo: string | null;
          smart_especifico: string | null;
          smart_mensuravel: string | null;
          smart_alcancavel: string | null;
          smart_relevante: string | null;
          smart_temporizado: string | null;
          metricas: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          area_id?: string | null;
          parent_id?: string | null;
          nivel: 'grande' | 'anual' | 'mensal' | 'semanal' | 'diaria';
          titulo: string;
          descricao?: string | null;
          status?: 'ativa' | 'concluida' | 'arquivada';
          one_thing?: boolean;
          focusing_question?: string | null;
          smart_objetivo?: string | null;
          smart_especifico?: string | null;
          smart_mensuravel?: string | null;
          smart_alcancavel?: string | null;
          smart_relevante?: string | null;
          smart_temporizado?: string | null;
          metricas?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          area_id?: string | null;
          parent_id?: string | null;
          nivel?: 'grande' | 'anual' | 'mensal' | 'semanal' | 'diaria';
          titulo?: string;
          descricao?: string | null;
          status?: 'ativa' | 'concluida' | 'arquivada';
          one_thing?: boolean;
          focusing_question?: string | null;
          smart_objetivo?: string | null;
          smart_especifico?: string | null;
          smart_mensuravel?: string | null;
          smart_alcancavel?: string | null;
          smart_relevante?: string | null;
          smart_temporizado?: string | null;
          metricas?: Record<string, unknown>;
          created_at?: string;
          updated_at?: string;
        };
      };
      tarefas: {
        Row: {
          id: string;
          user_id: string | null;
          meta_id: string | null;
          habito_id: string | null;
          titulo: string;
          descricao: string | null;
          bloco: 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
          hora: string | null;
          prioridade: 'alta' | 'media' | 'baixa';
          completed: boolean;
          data: string;
          recorrencia: 'nenhuma' | 'diaria' | 'semanal';
          // Novos campos para tarefas recorrentes
          recorrencia_config: RecorrenciaConfig | null;
          parent_id: string | null;
          is_template: boolean;
          data_fim_recorrencia: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          meta_id?: string | null;
          habito_id?: string | null;
          titulo: string;
          descricao?: string | null;
          bloco?: 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
          hora?: string | null;
          prioridade?: 'alta' | 'media' | 'baixa';
          completed?: boolean;
          data: string;
          recorrencia?: 'nenhuma' | 'diaria' | 'semanal';
          // Novos campos
          recorrencia_config?: RecorrenciaConfig | null;
          parent_id?: string | null;
          is_template?: boolean;
          data_fim_recorrencia?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          meta_id?: string | null;
          habito_id?: string | null;
          titulo?: string;
          descricao?: string | null;
          bloco?: 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
          hora?: string | null;
          prioridade?: 'alta' | 'media' | 'baixa';
          completed?: boolean;
          data?: string;
          recorrencia?: 'nenhuma' | 'diaria' | 'semanal';
          // Novos campos
          recorrencia_config?: RecorrenciaConfig | null;
          parent_id?: string | null;
          is_template?: boolean;
          data_fim_recorrencia?: string | null;
          created_at?: string;
        };
      };
      revisoes_semanais: {
        Row: {
          id: string;
          user_id: string | null;
          semana: string;
          checklist: unknown[];
          reflexao: string | null;
          vitoria: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          semana: string;
          checklist?: unknown[];
          reflexao?: string | null;
          vitoria?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          semana?: string;
          checklist?: unknown[];
          reflexao?: string | null;
          vitoria?: string | null;
          created_at?: string;
        };
      };
      revisoes_mensais: {
        Row: {
          id: string;
          user_id: string | null;
          mes: number;
          ano: number;
          checklist: unknown[];
          reflexao: string | null;
          vitoria: string | null;
          aprendizados: string | null;
          foco_proximo_mes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          mes: number;
          ano: number;
          checklist?: unknown[];
          reflexao?: string | null;
          vitoria?: string | null;
          aprendizados?: string | null;
          foco_proximo_mes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          mes?: number;
          ano?: number;
          checklist?: unknown[];
          reflexao?: string | null;
          vitoria?: string | null;
          aprendizados?: string | null;
          foco_proximo_mes?: string | null;
          created_at?: string;
        };
      };
      templates: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          estrutura: unknown;
          created_at: string;
        };
        Insert: {
          id?: string;
          nome: string;
          descricao?: string | null;
          estrutura?: unknown;
          created_at?: string;
        };
        Update: {
          id?: string;
          nome?: string;
          descricao?: string | null;
          estrutura?: unknown;
          created_at?: string;
        };
      };
      conquistas: {
        Row: {
          id: string;
          user_id: string | null;
          tipo: string;
          desbloqueada_em: string;
          progresso: number;
        };
        Insert: {
          id?: string;
          user_id?: string;
          tipo: string;
          desbloqueada_em?: string;
          progresso?: number;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          tipo?: string;
          desbloqueada_em?: string;
          progresso?: number;
        };
      };
      habitos: {
        Row: {
          id: string;
          user_id: string | null;
          titulo: string;
          descricao: string | null;
          data_inicio: string;
          data_fim: string;
          dias_semana: number[];
          hora: string | null;
          bloco: 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
          meta_id: string | null;
          prioridade: 'alta' | 'media' | 'baixa';
          status: 'ativa' | 'pausada' | 'concluida' | 'expirada';
          streak_atual: number;
          melhor_streak: number;
          ultima_conclusao: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          titulo: string;
          descricao?: string | null;
          data_inicio: string;
          data_fim: string;
          dias_semana: number[];
          hora?: string | null;
          bloco?: 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
          meta_id?: string | null;
          prioridade?: 'alta' | 'media' | 'baixa';
          status?: 'ativa' | 'pausada' | 'concluida' | 'expirada';
          streak_atual?: number;
          melhor_streak?: number;
          ultima_conclusao?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          titulo?: string;
          descricao?: string | null;
          data_inicio?: string;
          data_fim?: string;
          dias_semana?: number[];
          hora?: string | null;
          bloco?: 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
          meta_id?: string | null;
          prioridade?: 'alta' | 'media' | 'baixa';
          status?: 'ativa' | 'pausada' | 'concluida' | 'expirada';
          streak_atual?: number;
          melhor_streak?: number;
          ultima_conclusao?: string | null;
          created_at?: string;
        };
      };
    };
  };
};
