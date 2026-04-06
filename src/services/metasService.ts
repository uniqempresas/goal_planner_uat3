import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Meta = Database['public']['Tables']['metas']['Row'];
type MetaInsert = Database['public']['Tables']['metas']['Insert'];
type MetaUpdate = Database['public']['Tables']['metas']['Update'];

export type MetaNivel = 'grande' | 'anual' | 'mensal' | 'semanal' | 'diaria';

export const metasService = {
  async getAll(userId: string): Promise<Meta[]> {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getByNivel(userId: string, nivel: MetaNivel): Promise<Meta[]> {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('user_id', userId)
      .eq('nivel', nivel)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Meta | null> {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByParentId(parentId: string): Promise<Meta[]> {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async create(userId: string, meta: Omit<MetaInsert, 'user_id'>): Promise<Meta> {
    // Normalizar nivel: URL pode ter "grandes" mas banco espera "grande"
    const nivelNormalizado = meta.nivel?.replace(/s$/, '') as MetaNivel || meta.nivel;
    
    const { data, error } = await supabase
      .from('metas')
      .insert({ 
        ...meta, 
        nivel: nivelNormalizado,
        user_id: userId,
        status: meta.status || 'ativa',
        one_thing: meta.one_thing || false,
        metricas: meta.metricas || {}
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async update(id: string, meta: Partial<MetaUpdate>): Promise<Meta> {
    const { data, error } = await supabase
      .from('metas')
      .update({ 
        ...meta, 
        updated_at: meta.updated_at || new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('metas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleStatus(id: string): Promise<Meta> {
    const meta = await this.getById(id);
    if (!meta) throw new Error('Meta não encontrada');
    
    const novoStatus = meta.status === 'ativa' ? 'concluida' : 'ativa';
    return this.update(id, { status: novoStatus });
  },

  async toggleOneThing(id: string): Promise<Meta> {
    const meta = await this.getById(id);
    if (!meta) throw new Error('Meta não encontrada');
    
    return this.update(id, { one_thing: !meta.one_thing });
  },
};