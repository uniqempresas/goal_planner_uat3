import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

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
};