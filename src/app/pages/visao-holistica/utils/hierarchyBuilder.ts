import type { Meta, MetaNode, MetaNivel, MetaStatus } from '../types';

const nivelOrder: Record<MetaNivel, number> = {
  'grande': 0,
  'anual': 1,
  'mensal': 2,
  'semanal': 3,
  'diaria': 4,
};

/**
 * Constrói a hierarquia de metas a partir de uma lista plana
 */
export function buildHierarchy(metas: Meta[]): MetaNode[] {
  const map = new Map<string, MetaNode>();
  const roots: MetaNode[] = [];

  // Primeira passagem: criar nós
  metas.forEach(meta => {
    map.set(meta.id, {
      ...meta,
      children: [],
      computedProgress: 0,
      computedStatus: calculateMetaStatus(meta),
    });
  });

  // Segunda passagem: estabelecer relações
  metas.forEach(meta => {
    const node = map.get(meta.id)!;
    
    if (meta.parent_id && map.has(meta.parent_id)) {
      const parent = map.get(meta.parent_id)!;
      parent.children = parent.children || [];
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  });

  // Ordenar raízes por hierarquia
  roots.sort((a, b) => nivelOrder[a.nivel] - nivelOrder[b.nivel]);

  // Terceira passagem: calcular progresso recursivamente
  calculateProgressRecursively(roots);

  return roots;
}

/**
 * Calcula o progresso recursivamente para todos os nós
 */
export function calculateProgressRecursively(nodes: MetaNode[]): number {
  if (!nodes.length) return 0;

  const totalProgress = nodes.reduce((sum, node) => {
    // Metas semanais e diárias: progresso manual
    if (node.nivel === 'semanal' || node.nivel === 'diaria') {
      const progress = node.metricas?.progresso_manual || 0;
      node.computedProgress = progress;
      return sum + progress;
    }

    // Metas superiores: média dos filhos
    if (node.children && node.children.length > 0) {
      node.computedProgress = calculateProgressRecursively(node.children);
    } else {
      // Sem filhos: usar progresso do banco ou 0
      node.computedProgress = node.metricas?.progresso_manual || 0;
    }

    return sum + node.computedProgress;
  }, 0);

  return Math.round(totalProgress / nodes.length);
}

/**
 * Calcula o status de uma meta baseado no prazo e progresso
 */
export function calculateMetaStatus(meta: Meta): MetaStatus {
  const now = new Date();
  const prazo = meta.prazo ? new Date(meta.prazo) : null;
  
  // Metas concluídas
  if (meta.status === 'concluida') return 'concluida';
  
  // Metas sem data -> backlog
  if (!prazo) return 'backlog';

  const diasRestantes = differenceInDays(prazo, now);
  const progresso = meta.metricas?.progresso_manual || 0;
  
  // Verificar proporcionalidade do tempo
  const tempoTotal = differenceInDays(prazo, new Date(meta.created_at));
  const tempoPassado = tempoTotal - diasRestantes;
  const progressoEsperado = tempoTotal > 0 ? (tempoPassado / tempoTotal) * 100 : 0;
  
  // Crítico: atrasado e com pouco progresso
  if (diasRestantes < 0) {
    return progresso < 80 ? 'critica' : 'atrasada';
  }
  
  // Atrasado: progresso menor que o esperado por mais de 20%
  if (progresso < progressoEsperado - 20) {
    return 'atrasada';
  }

  return 'ativa';
}

/**
 * Calcula a diferença em dias entre duas datas
 */
function differenceInDays(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date1.getTime() - date2.getTime()) / oneDay);
}

/**
 * Separa metas com e sem data (backlog)
 */
export function separateBacklogMetas(metas: MetaNode[]): {
  treeMetas: MetaNode[];
  backlogMetas: MetaNode[];
} {
  const treeMetas: MetaNode[] = [];
  const backlogMetas: MetaNode[] = [];

  function traverse(node: MetaNode) {
    if (!node.prazo && node.status !== 'concluida') {
      backlogMetas.push(node);
    } else {
      const filteredChildren = node.children?.filter(child => {
        if (!child.prazo && child.status !== 'concluida') {
          backlogMetas.push(child);
          return false;
        }
        return true;
      });
      
      treeMetas.push({
        ...node,
        children: filteredChildren,
      });
      
      filteredChildren?.forEach(traverse);
    }
  }

  metas.forEach(traverse);

  return { treeMetas, backlogMetas };
}
