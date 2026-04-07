import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Template = Database['public']['Tables']['templates']['Row'];
type TemplateInsert = Database['public']['Tables']['templates']['Insert'];
type TemplateUpdate = Database['public']['Tables']['templates']['Update'];

export interface TemplateData {
  nome: string;
  descricao?: string;
  estrutura: {
    tipo: 'tarefas' | 'metas' | 'habitos';
    itens: Array<{
      titulo: string;
      descricao?: string;
      bloco?: string;
      prioridade?: string;
      meta_id?: string;
    }>;
  };
}

export const templatesService = {
  async getAll(): Promise<Template[]> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Template | null> {
    const { data, error } = await supabase
      .from('templates')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(template: TemplateData): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .insert({
        nome: template.nome,
        descricao: template.descricao || null,
        estrutura: template.estrutura,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, template: Partial<TemplateData>): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .update({
        nome: template.nome,
        descricao: template.descricao,
        estrutura: template.estrutura,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async aplicarTemplate(templateId: string, userId: string, data?: string): Promise<void> {
    const template = await this.getById(templateId);
    if (!template) throw new Error('Template não encontrado');

    const estrutura = template.estrutura as TemplateData['estrutura'];
    const dataBase = data || new Date().toISOString().split('T')[0];

    if (estrutura.tipo === 'tarefas') {
      const tarefas = estrutura.itens.map(item => ({
        user_id: userId,
        titulo: item.titulo,
        descricao: item.descricao || null,
        data: dataBase,
        bloco: (item.bloco as any) || null,
        prioridade: (item.prioridade as any) || 'media',
        meta_id: item.meta_id || null,
        completed: false,
        recorrencia: 'nenhuma' as const,
        habito_id: null,
        hora: null,
      }));

      const { error } = await supabase.from('tarefas').insert(tarefas);
      if (error) throw error;
    }
  },
};
