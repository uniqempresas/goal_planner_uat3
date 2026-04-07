import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type RevisaoSemanal = Database['public']['Tables']['revisoes_semanais']['Row'];
type RevisaoSemanalInsert = Database['public']['Tables']['revisoes_semanais']['Insert'];
type RevisaoSemanalUpdate = Database['public']['Tables']['revisoes_semanais']['Update'];

export const revisoesSemanaisService = {
  async getAll(userId: string): Promise<RevisaoSemanal[]> {
    const { data, error } = await supabase
      .from('revisoes_semanais')
      .select('*')
      .eq('user_id', userId)
      .order('semana', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getBySemana(userId: string, semana: string): Promise<RevisaoSemanal | null> {
    const { data, error } = await supabase
      .from('revisoes_semanais')
      .select('*')
      .eq('user_id', userId)
      .eq('semana', semana)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(userId: string, revisao: Omit<RevisaoSemanalInsert, 'user_id'>): Promise<RevisaoSemanal> {
    const { data, error } = await supabase
      .from('revisoes_semanais')
      .insert({ ...revisao, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, revisao: Partial<RevisaoSemanalUpdate>): Promise<RevisaoSemanal> {
    const { data, error } = await supabase
      .from('revisoes_semanais')
      .update(revisao)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('revisoes_semanais')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async saveOrUpdate(userId: string, semana: string, revisao: Partial<RevisaoSemanalInsert>): Promise<RevisaoSemanal> {
    const existing = await this.getBySemana(userId, semana);
    
    if (existing) {
      return this.update(existing.id, revisao);
    } else {
      return this.create(userId, {
        semana,
        checklist: revisao.checklist || [],
        reflexao: revisao.reflexao || null,
        vitoria: revisao.vitoria || null,
      });
    }
  },
};
