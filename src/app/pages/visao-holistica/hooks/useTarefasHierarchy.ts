import { useCallback, useEffect, useState } from 'react';
import { isBefore, startOfDay, parseISO } from 'date-fns';
import { tarefasService } from '../../../../services/tarefasService';
import { useApp } from '../../../contexts/AppContext';
import type { TaskViewItem, GroupedTasks, TaskFilterState } from '../types';

interface UseTarefasHierarchyResult {
  tarefas: GroupedTasks;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Determina o status de uma tarefa baseado na data e completion
 */
function getTaskStatus(tarefa: TaskViewItem): 'atrasada' | 'aberta' | 'concluida' {
  if (tarefa.completed) {
    return 'concluida';
  }

  const hoje = startOfDay(new Date());
  const tarefaData = startOfDay(parseISO(tarefa.data));

  if (isBefore(tarefaData, hoje)) {
    return 'atrasada';
  }

  return 'aberta';
}

/**
 * Hook para buscar tarefas e agrupá-las por status
 */
export function useTarefasHierarchy(): UseTarefasHierarchyResult {
  const { user } = useApp();
  const [tarefas, setTarefas] = useState<GroupedTasks>({
    atrasadas: [],
    abertas: [],
    concluidas: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchTarefas = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const data = await tarefasService.getAll(user.id);

      // Converter para TaskViewItem
      const taskViewItems: TaskViewItem[] = data.map((tarefa) => ({
        id: tarefa.id,
        titulo: tarefa.titulo,
        descricao: tarefa.descricao || undefined,
        data: tarefa.data,
        hora: tarefa.hora || undefined,
        completed: tarefa.completed,
        habito_id: tarefa.habito_id,
        meta_id: tarefa.meta_id,
        data_conclusao: tarefa.data_conclusao || undefined,
      }));

      // Agrupar por status
      const agrupadas: GroupedTasks = {
        atrasadas: [],
        abertas: [],
        concluidas: [],
      };

      taskViewItems.forEach((tarefa) => {
        const status = getTaskStatus(tarefa);
        agrupadas[status].push(tarefa);
      });

      // Ordenar por data
      agrupadas.atrasadas.sort((a, b) => a.data.localeCompare(b.data));
      agrupadas.abertas.sort((a, b) => a.data.localeCompare(b.data));
      agrupadas.concluidas.sort((a, b) => {
        if (!a.data_conclusao || !b.data_conclusao) return 0;
        return b.data_conclusao.localeCompare(a.data_conclusao);
      });

      setTarefas(agrupadas);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar tarefas'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTarefas();
  }, [fetchTarefas]);

  return {
    tarefas,
    isLoading,
    error,
    refetch: fetchTarefas,
  };
}

/**
 * Hook para filtrar tarefas por tipo
 */
export function useFilteredTarefas(
  tarefas: GroupedTasks,
  filtro: TaskFilterState
): GroupedTasks {
  const filtered = tarefas;

  // Filtrar por tipo (recorrentes, não recorrentes, ou todas)
  const filtrarPorTipo = (lista: TaskViewItem[]): TaskViewItem[] => {
    if (filtro.tipo === 'todas') {
      return lista;
    }

    return lista.filter((tarefa) => {
      const isRecorrente = tarefa.habito_id !== null;
      if (filtro.tipo === 'recorrentes') {
        return isRecorrente;
      }
      return !isRecorrente;
    });
  };

  return {
    atrasadas: filtrarPorTipo(filtered.atrasadas),
    abertas: filtrarPorTipo(filtered.abertas),
    concluidas: filtrarPorTipo(filtered.concluidas),
  };
}