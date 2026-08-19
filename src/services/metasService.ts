import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { tarefasService } from './tarefasService';
import { buildHierarchy, calculateProgressRecursively } from '../app/pages/visao-holistica/utils/hierarchyBuilder';
import type { Meta as HierarchyMeta, MetaNode } from '../app/pages/visao-holistica/types';

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
    
    // DEBUG: Log do que está sendo enviado para o Supabase
    console.log('DEBUG metasService.create - meta recebida:', meta);
    console.log('DEBUG metasService.create - prazo:', meta.prazo);
    console.log('DEBUG metasService.create - tipo prazo:', typeof meta.prazo);
    
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

    if (error) {
      console.error('DEBUG metasService.create - erro do Supabase:', error);
      throw new Error(error.message);
    }
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

  // Novos métodos para o sistema moderno de criação de metas
  async getMetasByNivel(userId: string, nivel: MetaNivel): Promise<Meta[]> {
    const { data, error } = await supabase
      .from('metas')
      .select('*')
      .eq('user_id', userId)
      .eq('nivel', nivel)
      .eq('status', 'ativa')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getMetaAncestors(metaId: string): Promise<Meta[]> {
    const ancestors: Meta[] = [];
    let currentMeta = await this.getById(metaId);
    
    while (currentMeta?.parent_id) {
      const parent = await this.getById(currentMeta.parent_id);
      if (parent) {
        ancestors.unshift(parent);
        currentMeta = parent;
      } else {
        break;
      }
    }
    
    return ancestors;
  },

  /**
   * Busca todas as metas do usuário com suas áreas relacionadas
   * para construir a hierarquia completa
   */
  async getFullHierarchy(userId: string): Promise<Meta[]> {
    const { data, error } = await supabase
      .from('metas')
      .select(`
        *,
        areas:area_id (id, nome, icone, cor)
      `)
      .eq('user_id', userId)
      .neq('status', 'arquivada')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  /**
   * Calcula o progresso real de uma meta baseado nas tarefas vinculadas
   * Fórmula: (Tarefas Concluídas / Total de Tarefas) × 100
   * 
   * Regras:
   * - Meta concluída manualmente: sempre 100%
   * - Meta sem tarefas: 0%
   * - Tarefas recorrentes (instâncias) também são contadas
   */
  async calcularProgresso(metaId: string): Promise<number> {
    try {
      // Verificar se a meta está concluída manualmente
      const meta = await this.getById(metaId);
      if (meta?.status === 'concluida') {
        return 100;
      }

      // Buscar todas as tarefas vinculadas à meta (incluindo instâncias de recorrentes)
      const tarefas = await tarefasService.getByMetaId(metaId);
      
      if (tarefas.length === 0) {
        return 0;
      }

      const concluidas = tarefas.filter(t => t.completed).length;
      return Math.round((concluidas / tarefas.length) * 100);
    } catch (error) {
      console.error(`[metasService] Erro ao calcular progresso da meta ${metaId}:`, error);
      return 0;
    }
  },

  /**
   * Calcula o progresso de múltiplas metas de uma só vez
   * Útil para listas de metas
   */
  async calcularProgressoMultiplo(metaIds: string[]): Promise<Record<string, number>> {
    const progressos: Record<string, number> = {};
    
    await Promise.all(
      metaIds.map(async (metaId) => {
        progressos[metaId] = await this.calcularProgresso(metaId);
      })
    );
    
    return progressos;
  },

  /**
   * Calcula o progresso de todas as metas de um usuário baseado
   * nas tarefas vinculadas e na média dos filhos (mesma regra da visão holística).
   * Retorna um mapa metaId -> progresso (%)
   */
  async calcularProgressoHierarquia(userId: string): Promise<Record<string, number>> {
    const [metas, tarefas] = await Promise.all([
      this.getFullHierarchy(userId),
      tarefasService.getAll(userId),
    ]);

    const progressMap: Record<string, number> = {};
    const porMeta = new Map<string, { total: number; concluidas: number }>();
    tarefas
      .filter(t => t.meta_id && !t.is_template)
      .forEach(t => {
        const atual = porMeta.get(t.meta_id!) ?? { total: 0, concluidas: 0 };
        atual.total += 1;
        if (t.completed) atual.concluidas += 1;
        porMeta.set(t.meta_id!, atual);
      });
    porMeta.forEach((stats, metaId) => {
      progressMap[metaId] = stats.total > 0 ? Math.round((stats.concluidas / stats.total) * 100) : 0;
    });

    const hierarchy = buildHierarchy(metas as HierarchyMeta[], progressMap);
    calculateProgressRecursively(hierarchy, progressMap);

    const progressos: Record<string, number> = {};
    const percorrer = (nodes: MetaNode[]) => {
      nodes.forEach(node => {
        progressos[node.id] = node.computedProgress;
        if (node.children) percorrer(node.children);
      });
    };
    percorrer(hierarchy);

    return progressos;
  },
};