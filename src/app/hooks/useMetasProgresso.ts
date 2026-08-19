import { useCallback, useEffect, useState } from 'react';
import { metasService } from '../../services/metasService';
import { useApp } from '../contexts/AppContext';

export function useMetasProgresso(): Record<string, number> {
  const { user } = useApp();
  const [progressos, setProgressos] = useState<Record<string, number>>({});

  const carregar = useCallback(async () => {
    if (!user?.id) return;
    try {
      const resultado = await metasService.calcularProgressoHierarquia(user.id);
      setProgressos(resultado);
    } catch (error) {
      console.error('[useMetasProgresso] Erro ao calcular progresso:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  return progressos;
}