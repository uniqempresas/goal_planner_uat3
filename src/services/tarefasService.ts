import { supabase } from '../lib/supabase';
import type { Database, RecorrenciaConfig } from '../lib/supabase';

type Tarefa = Database['public']['Tables']['tarefas']['Row'];
type TarefaInsert = Database['public']['Tables']['tarefas']['Insert'];
type TarefaUpdate = Database['public']['Tables']['tarefas']['Update'];

export const tarefasService = {
  async getAll(userId: string): Promise<Tarefa[]> {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('user_id', userId)
      .order('data', { ascending: true })
      .order('hora', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getByData(userId: string, data: string): Promise<Tarefa[]> {
    const { data: tarefas, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('user_id', userId)
      .eq('data', data)
      .order('hora', { ascending: true });

    if (error) throw error;
    return tarefas || [];
  },

  async getById(id: string): Promise<Tarefa | null> {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(userId: string, tarefa: Omit<TarefaInsert, 'user_id'>): Promise<Tarefa> {
    const { data, error } = await supabase
      .from('tarefas')
      .insert({ ...tarefa, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, tarefa: Partial<TarefaUpdate>): Promise<Tarefa> {
    const { data, error } = await supabase
      .from('tarefas')
      .update(tarefa)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tarefas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleCompleted(id: string): Promise<Tarefa> {
    const tarefa = await this.getById(id);
    if (!tarefa) throw new Error('Tarefa não encontrada');
    
    return this.update(id, { completed: !tarefa.completed });
  },

  async getByMetaId(metaId: string): Promise<Tarefa[]> {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('meta_id', metaId)
      .order('data', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  // ============================================
  // MÉTODOS PARA TAREFAS RECORRENTES
  // ============================================

  /**
   * Busca tarefas de uma data específica, incluindo instâncias de recorrentes
   */
  async getTarefasDoDia(userId: string, data: string): Promise<Tarefa[]> {
    const { data: tarefas, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('user_id', userId)
      .eq('data', data)
      .eq('is_template', false) // Não incluir templates (tarefas mãe de recorrentes)
      .order('hora', { ascending: true });

    if (error) throw error;
    return tarefas || [];
  },

  /**
   * Busca instâncias de tarefas recorrentes para uma data específica
   */
  async getInstanciasRecorrentesDoDia(userId: string, data: string): Promise<Tarefa[]> {
    const { data: instancias, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('user_id', userId)
      .eq('data', data)
      .not('parent_id', 'is', null) // Apenas instâncias (têm parent_id)
      .order('hora', { ascending: true });

    if (error) throw error;
    return instancias || [];
  },

  /**
   * Busca templates de recorrência ativos de um usuário
   */
  async getTemplatesAtivos(userId: string): Promise<Tarefa[]> {
    const { data, error } = await supabase
      .from('tarefas')
      .select('*')
      .eq('user_id', userId)
      .eq('is_template', true)
      .is('data_fim_recorrencia', null)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Busca tarefa mãe (template) pelo ID da instância
   */
  async getParentPorInstancia(instanciaId: string): Promise<Tarefa | null> {
    // Primeiro busca a instância
    const { data: instancia, error: errorInstancia } = await supabase
      .from('tarefas')
      .select('parent_id')
      .eq('id', instanciaId)
      .single();

    if (errorInstancia || !instancia?.parent_id) {
      return null;
    }

    // Depois busca a mãe
    const { data: parent, error: errorParent } = await supabase
      .from('tarefas')
      .select('*')
      .eq('id', instancia.parent_id)
      .single();

    if (errorParent) {
      console.error('[tarefasService] Erro ao buscar parent:', errorParent);
      return null;
    }

    return parent;
  },

  /**
   * Verifica se uma tarefa é uma instância de recorrência
   */
  async isInstanciaRecorrente(tarefaId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('tarefas')
      .select('parent_id')
      .eq('id', tarefaId)
      .single();

    if (error) {
      console.error('[tarefasService] Erro ao verificar instância:', error);
      return false;
    }

    return !!data?.parent_id;
  },
};