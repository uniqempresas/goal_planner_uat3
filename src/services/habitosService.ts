import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';
import { tarefasService } from './tarefasService';

type Habito = Database['public']['Tables']['habitos']['Row'];
type HabitoInsert = Database['public']['Tables']['habitos']['Insert'];
type HabitoUpdate = Database['public']['Tables']['habitos']['Update'];
type Tarefa = Database['public']['Tables']['tarefas']['Row'];
type TarefaInsert = Database['public']['Tables']['tarefas']['Insert'];

// Tipo auxiliar para criação de hábito (campos que o frontend envia)
interface HabitoCreateData {
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
  frequencia_tipo?: 'diario' | 'semanal' | 'dias_especificos';
  frequencia_dias?: number;
}

export const habitosService = {
  async getAll(userId: string): Promise<Habito[]> {
    const { data, error } = await supabase
      .from('habitos')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getById(id: string): Promise<Habito | null> {
    const { data, error } = await supabase
      .from('habitos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async create(userId: string, habito: HabitoCreateData): Promise<Habito> {
    // Preparar dados para inserção (mapear campos do frontend para o schema do banco)
    const insertData: HabitoInsert = {
      user_id: userId,
      titulo: habito.titulo,
      descricao: habito.descricao ?? null,
      data_inicio: habito.data_inicio,
      data_fim: habito.data_fim,
      dias_semana: habito.dias_semana,
      hora: habito.hora ?? null,
      horario_preferido: habito.hora ?? null, // Sinônimo para compatibilidade
      bloco: habito.bloco ?? null,
      meta_id: habito.meta_id ?? null,
      prioridade: habito.prioridade ?? 'media',
      status: (habito.status ?? 'ativa') as any, // 'ativa' | 'pausada' | 'concluida' | 'expirada'
      streak_atual: habito.streak_atual ?? 0,
      melhor_streak: habito.melhor_streak ?? 0,
      streak_maximo: habito.melhor_streak ?? 0, // Sinônimo para compatibilidade
      ultima_conclusao: habito.ultima_conclusao ?? null,
      ultima_execucao: habito.ultima_conclusao ?? null, // Sinônimo para compatibilidade
      frequencia_tipo: habito.frequencia_tipo ?? 'dias_especificos',
      frequencia_dias: habito.frequencia_dias ?? 1,
      frequencia_semana_dias: habito.dias_semana, // Mapear dias_semana para frequencia_semana_dias
    };

    const { data, error } = await supabase
      .from('habitos')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar hábito:', error);
      throw new Error(`Erro ao criar hábito: ${error.message}`);
    }
    
    // Gerar tarefas automaticamente ao criar hábito
    if (data) {
      await this.gerarTarefas(data);
    }
    
    return data;
  },

  async update(id: string, habito: Partial<HabitoUpdate> | Partial<HabitoCreateData>): Promise<Habito> {
    // Preparar dados para atualização
    const updateData: Partial<HabitoUpdate> = { ...habito };

    // Sincronizar campos sinônimos se necessário
    if ('hora' in habito && habito.hora !== undefined) {
      updateData.horario_preferido = habito.hora;
    }
    if ('melhor_streak' in habito && habito.melhor_streak !== undefined) {
      updateData.streak_maximo = habito.melhor_streak;
    }
    if ('ultima_conclusao' in habito && habito.ultima_conclusao !== undefined) {
      updateData.ultima_execucao = habito.ultima_conclusao;
    }

    const { data, error } = await supabase
      .from('habitos')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar hábito:', error);
      throw new Error(`Erro ao atualizar hábito: ${error.message}`);
    }
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from('habitos')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async getAtivos(userId: string): Promise<Habito[]> {
    const { data, error } = await supabase
      .from('habitos')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'ativa')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  },

  async getAtivosHoje(userId: string): Promise<Habito[]> {
    const hoje = new Date();
    const diaSemana = hoje.getDay();
    // Converter: getDay() returns 0=dom, 1=seg, ..., 6=sab
    // Nosso formato: 0=seg, 6=dom
    const mappedDay = diaSemana === 0 ? 6 : diaSemana - 1;
    const hojeStr = hoje.toISOString().split('T')[0];

    const { data: habitosAtivos, error: errorAtivos } = await supabase
      .from('habitos')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'ativa')
      .lte('data_inicio', hojeStr)
      .gte('data_fim', hojeStr);

    if (errorAtivos) throw errorAtivos;
    
    if (!habitosAtivos) return [];

    // Filtrar pelos dias da semana
    return habitosAtivos.filter(h => h.dias_semana?.includes(mappedDay));
  },

  async toggleStreak(id: string): Promise<Habito> {
    const habito = await this.getById(id);
    if (!habito) throw new Error('Hábito não encontrado');

    const hoje = new Date().toISOString().split('T')[0];

    if (habito.ultima_conclusao === hoje) {
      // Já completou hoje, não fazer nada
      return habito;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    let novoStreak = 1;

    if (habito.ultima_conclusao === yesterdayStr) {
      // Consecutivo!
      novoStreak = (habito.streak_atual || 0) + 1;
    }

    const novoMelhor = Math.max(habito.melhor_streak || 0, novoStreak);

    return this.update(id, {
      streak_atual: novoStreak,
      melhor_streak: novoMelhor,
      ultima_conclusao: hoje,
    });
  },

  async pausar(id: string): Promise<Habito> {
    return this.update(id, { status: 'pausada' });
  },

  async continuar(id: string): Promise<Habito> {
    return this.update(id, { status: 'ativa' });
  },

  async gerarTarefas(habito: Habito): Promise<Tarefa[]> {
    const tarefas: Omit<TarefaInsert, 'id' | 'created_at'>[] = [];
    const current = new Date(habito.data_inicio || new Date());
    const end = new Date(habito.data_fim || new Date());
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    // Limit to 30 days ahead to avoid performance issues
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);

    while (current <= end && current <= maxDate) {
      // Skip past dates
      if (current < hoje) {
        current.setDate(current.getDate() + 1);
        continue;
      }

      const dayOfWeek = current.getDay();
      // getDay() returns 0=dom, 1=seg, ..., 6=sab
      // Converter para nosso formato: 0=seg, 6=dom
      const mappedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

      if (habito.dias_semana?.includes(mappedDay)) {
        // Check if task already exists for this habit/date
        const dataStr = current.toISOString().split('T')[0];
        const { data: existingTasks } = await supabase
          .from('tarefas')
          .select('id')
          .eq('habito_id', habito.id)
          .eq('data', dataStr)
          .limit(1);

        if (!existingTasks || existingTasks.length === 0) {
          tarefas.push({
            user_id: habito.user_id,
            titulo: habito.titulo,
            descricao: habito.descricao,
            data: dataStr,
            hora: habito.hora,
            bloco: habito.bloco,
            prioridade: habito.prioridade,
            meta_id: habito.meta_id,
            habito_id: habito.id,
            completed: false,
            recorrencia: 'nenhuma',
          });
        }
      }

      current.setDate(current.getDate() + 1);
    }

    if (tarefas.length > 0) {
      const { error } = await supabase.from('tarefas').insert(tarefas);
      if (error) throw error;
    }

    return [];
  },

  async verificarExpirados(userId: string): Promise<void> {
    const hoje = new Date().toISOString().split('T')[0];

    const { error } = await supabase
      .from('habitos')
      .update({ status: 'expirada' })
      .eq('user_id', userId)
      .eq('status', 'ativa')
      .lt('data_fim', hoje);

    if (error) throw error;
  },

  async getEstatisticas(userId: string): Promise<{
    total: number;
    ativos: number;
    concluidos: number;
    pausados: number;
  }> {
    const { data, error } = await supabase
      .from('habitos')
      .select('status')
      .eq('user_id', userId);

    if (error) throw error;

    const stats = {
      total: data.length,
      ativos: data.filter(h => h.status === 'ativa').length,
      concluidos: data.filter(h => h.status === 'concluida').length,
      pausados: data.filter(h => h.status === 'pausada').length,
    };

    return stats;
  },
};
