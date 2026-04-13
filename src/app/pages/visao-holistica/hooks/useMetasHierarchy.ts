import { useCallback, useEffect, useState } from 'react';
import { metasService } from '../../../../services/metasService';
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

      const data = await metasService.getFullHierarchy(user.id);
      const hierarchy = buildHierarchy(data);
      
      // Recalcular progresso para garantir consistência
      calculateProgressRecursively(hierarchy);
      
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
