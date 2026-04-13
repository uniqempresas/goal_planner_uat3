/**
 * Utility functions for mapping between database types and UI types
 */

import type { Database, RecorrenciaConfig } from './supabase';

type TarefaDB = Database['public']['Tables']['tarefas']['Row'];

export type TimeBlock = 'oneThing' | 'atrasadas' | 'manha' | 'tarde' | 'noite' | 'habitos' | 'recorrentes';

export type Priority = 'high' | 'medium' | 'low';

export interface TarefaUI {
  id: string;
  metaId?: string;
  habitoId?: string;
  title: string;
  description?: string;
  block: TimeBlock;
  hora?: string;
  priority?: Priority;
  completed: boolean;
  data: string;
  isOneThing: boolean;
  notes?: string;
  // Campos para recorrência
  isRecorrente?: boolean;
  isInstancia?: boolean;
  parentId?: string;
  recorrenciaConfig?: RecorrenciaConfig | null;
}

/**
 * Maps database 'bloco' field to UI 'block' field
 */
export function mapBlocoToUI(bloco: string | null): TimeBlock {
  const map: Record<string, TimeBlock> = {
    'one-thing': 'oneThing',
    'atrasadas': 'atrasadas',
    'manha': 'manha',
    'tarde': 'tarde',
    'noite': 'noite',
    'habitos': 'habitos',
  };
  
  return map[bloco || ''] || 'recorrentes';
}

/**
 * Maps database 'prioridade' field to UI 'priority' field
 */
export function mapPrioridadeToUI(prioridade: string | null): Priority | undefined {
  const map: Record<string, Priority> = {
    'alta': 'high',
    'media': 'medium',
    'baixa': 'low',
  };
  
  return prioridade ? map[prioridade] : undefined;
}

/**
 * Maps database tarefa to UI tarefa format
 */
export function mapTarefaToUI(tarefa: TarefaDB): TarefaUI {
  return {
    id: tarefa.id,
    metaId: tarefa.meta_id || undefined,
    habitoId: tarefa.habito_id || undefined,
    title: tarefa.titulo,
    description: tarefa.descricao || undefined,
    block: mapBlocoToUI(tarefa.bloco),
    hora: tarefa.hora || undefined,
    priority: mapPrioridadeToUI(tarefa.prioridade),
    completed: tarefa.completed,
    data: tarefa.data,
    isOneThing: tarefa.bloco === 'one-thing',
    notes: tarefa.descricao || undefined,
    // Mapear campos de recorrência
    isRecorrente: tarefa.is_template || false,
    isInstancia: !!tarefa.parent_id,
    parentId: tarefa.parent_id || undefined,
    recorrenciaConfig: tarefa.recorrencia_config,
  };
}

/**
 * Maps array of database tarefas to UI tarefas
 */
export function mapTarefasToUI(tarefas: TarefaDB[]): TarefaUI[] {
  return tarefas.map(mapTarefaToUI);
}
