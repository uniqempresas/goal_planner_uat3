import { useCallback, useEffect, useState } from 'react';
import { metasService } from '../../../../services/metasService';
import { tarefasService } from '../../../../services/tarefasService';
import { useApp } from '../../../contexts/AppContext';
import { buildHierarchy, calculateProgressRecursively } from '../utils/hierarchyBuilder';
import type { MetaNode } from '../types';

interface UseMetasHierarchyResult {
  metas: MetaNode[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook para buscar e construir a hierarquia completa de metas
 */
export function useMetasHierarchy(): UseMetasHierarchyResult {
  const { user } = useApp();
  const [metas, setMetas] = useState<MetaNode[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchMetas = useCallback(async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const [data, tarefas] = await Promise.all([
        metasService.getFullHierarchy(user.id),
        tarefasService.getAll(user.id),
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

      const hierarchy = buildHierarchy(data, progressMap);
      
      // Recalcular progresso para garantir consistência
      calculateProgressRecursively(hierarchy, progressMap);
      
      setMetas(hierarchy);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Erro ao carregar metas'));
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchMetas();
  }, [fetchMetas]);

  return {
    metas,
    isLoading,
    error,
    refetch: fetchMetas,
  };
}
