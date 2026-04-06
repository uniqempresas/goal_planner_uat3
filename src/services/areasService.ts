import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Area = Database['public']['Tables']['areas']['Row'];
type AreaInsert = Database['public']['Tables']['areas']['Insert'];
type AreaUpdate = Database['public']['Tables']['areas']['Update'];

export const areasService = {
  async getAll(userId: string): Promise<Area[]> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Area | null> {
    const { data, error } = await supabase
      .from('areas')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(userId: string, area: Omit<AreaInsert, 'user_id'>): Promise<Area> {
    const { data, error } = await supabase
      .from('areas')
      .insert({ ...area, user_id: userId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, area: Partial<AreaUpdate>): Promise<Area> {
    const { data, error } = await supabase
      .from('areas')
      .update(area)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('areas')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};