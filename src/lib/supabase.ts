import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
          estrutura: unknown;
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