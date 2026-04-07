import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type RevisaoMensal = Database['public']['Tables']['revisoes_mensais']['Row'];
type RevisaoMensalInsert = Database['public']['Tables']['revisoes_mensais']['Insert'];
type RevisaoMensalUpdate = Database['public']['Tables']['revisoes_mensais']['Update'];

export const revisoesMensaisService = {
  async getAll(userId: string): Promise<RevisaoMensal[]> {
    const { data, error } = await supabase
      .from('revisoes_mensais')
      .select('*')
      .eq('user_id', userId)
      .order('ano', { ascending: false })
      .order('mes', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByMesAno(userId: string, mes: number, ano: number): Promise<RevisaoMensal | null> {
    const { data, error } = await supabase
      .from('revisoes_mensais')
      .select('*')
      .eq('user_id', userId)
      .eq('mes', mes)
      .eq('ano', ano)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(userId: string, revisao: Omit<RevisaoMensalInsert, 'user_id'>): Promise<RevisaoMensal> {
    const { data, error } = await supabase
      .from('revisoes_mensais')
      .insert({ ...revisao, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, revisao: Partial<RevisaoMensalUpdate>): Promise<RevisaoMensal> {
    const { data, error } = await supabase
      .from('revisoes_mensais')
      .update(revisao)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('revisoes_mensais')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async saveOrUpdate(userId: string, mes: number, ano: number, revisao: Partial<RevisaoMensalInsert>): Promise<RevisaoMensal> {
    const existing = await this.getByMesAno(userId, mes, ano);
    
    if (existing) {
      return this.update(existing.id, revisao);
    } else {
      return this.create(userId, {
        mes,
        ano,
        checklist: revisao.checklist || [],
        reflexao: revisao.reflexao || null,
        vitoria: revisao.vitoria || null,
        aprendizados: revisao.aprendizados || null,
        foco_proximo_mes: revisao.foco_proximo_mes || null,
      });
    }
  },
};
