/**
 * Service para gerenciar itens de tarefas (checklist)
 */
import { supabase } from '../lib/supabase';

// ============================================
// TIPOS
// ============================================

export interface TarefaItem {
  id: string;
  tarefa_id: string;
  nome: string;
  ordem: number;
  completed: boolean;
  created_at: string;
}

export interface TarefaItemCreate {
  tarefa_id: string;
  nome: string;
  ordem?: number;
  completed?: boolean;
}

export interface TarefaItemUpdate {
  nome?: string;
  ordem?: number;
  completed?: boolean;
}

// ============================================
// SERVICE
// ============================================

export const tarefaItensService = {
  /**
   * Buscar todos os itens de uma tarefa
   */
  async getByTarefaId(tarefaId: string): Promise<TarefaItem[]> {
    const { data, error } = await supabase
      .from('tarefa_itens')
      .select('*')
      .eq('tarefa_id', tarefaId)
      .order('ordem', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Criar um novo item
   */
  async create(item: TarefaItemCreate): Promise<TarefaItem> {
    // Se não informada ordem, pega o próximo número
    let ordem = item.ordem;
    if (ordem === undefined) {
      const { data: existing } = await supabase
        .from('tarefa_itens')
        .select('ordem')
        .eq('tarefa_id', item.tarefa_id)
        .order('ordem', { ascending: false })
        .limit(1);
      
      ordem = existing && existing.length > 0 ? (existing[0].ordem || 0) + 1 : 1;
    }

    const { data, error } = await supabase
      .from('tarefa_itens')
      .insert({
        tarefa_id: item.tarefa_id,
        nome: item.nome,
        ordem: ordem,
        completed: item.completed || false,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Atualizar um item
   */
  async update(id: string, updates: TarefaItemUpdate): Promise<TarefaItem> {
    const { data, error } = await supabase
      .from('tarefa_itens')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Excluir um item
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('tarefa_itens')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  /**
   * Toggle - inverter status de conclusão
   */
  async toggle(id: string): Promise<TarefaItem> {
    // Primeiro buscar o item atual
    const { data: current, error: fetchError } = await supabase
      .from('tarefa_itens')
      .select('completed')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // inverter o status
    const { data, error } = await supabase
      .from('tarefa_itens')
      .update({ completed: !current.completed })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Calcular progresso de uma tarefa baseado nos itens
   */
  async calcularProgresso(tarefaId: string): Promise<number> {
    const itens = await this.getByTarefaId(tarefaId);
    
    if (itens.length === 0) return 0;
    
    const concluidos = itens.filter(i => i.completed).length;
    return Math.round((concluidos / itens.length) * 100);
  },

  /**
   * Criar múltiplos itens de uma vez
   */
  async createMany(tarefaId: string, nomes: string[]): Promise<TarefaItem[]> {
    const itens = nomes.map((nome, index) => ({
      tarefa_id: tarefaId,
      nome,
      ordem: index + 1,
      completed: false,
    }));

    const { data, error } = await supabase
      .from('tarefa_itens')
      .insert(itens)
      .select();

    if (error) throw error;
    return data || [];
  },
};