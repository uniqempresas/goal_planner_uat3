import type { MetaNode, GroupedMetas, GroupByOption } from '../types';

const nivelPriority: Record<string, number> = {
  'grande': 0,
  'anual': 1,
  'mensal': 2,
  'semanal': 3,
  'diaria': 4,
};

/**
 * Ordena metas por data e nível hierárquico
 */
export function sortByDate(nodes: MetaNode[]): MetaNode[] {
  return [...nodes].sort((a, b) => {
    // Primeiro por nível hierárquico
    if (nivelPriority[a.nivel] !== nivelPriority[b.nivel]) {
      return nivelPriority[a.nivel] - nivelPriority[b.nivel];
    }

    // Depois por data de início
    const dateA = a.created_at ? new Date(a.created_at) : new Date(0);
    const dateB = b.created_at ? new Date(b.created_at) : new Date(0);
    return dateA.getTime() - dateB.getTime();
  }).map(node => ({
    ...node,
    children: node.children ? sortByDate(node.children) : undefined,
  }));
}

/**
 * Agrupa metas por critério
 */
export function groupMetas(nodes: MetaNode[], groupBy: GroupByOption): GroupedMetas {
  if (groupBy === 'nenhum') {
    return { 'Todas': nodes };
  }

  const groups: GroupedMetas = {};

  function addToGroups(node: MetaNode) {
    let key: string;

    switch (groupBy) {
      case 'area':
        key = node.areas?.nome || 'Sem Área';
        break;
      case 'data':
        key = node.prazo 
          ? formatDate(new Date(node.prazo))
          : 'Sem Data';
        break;
      case 'prioridade':
        key = node.one_thing ? '⭐ ONE Thing' : 'Normal';
        break;
      default:
        key = 'Outros';
    }

    if (!groups[key]) groups[key] = [];
    groups[key].push(node);

    // Adicionar filhos recursivamente
    node.children?.forEach(addToGroups);
  }

  nodes.forEach(addToGroups);

  return groups;
}

/**
 * Formata uma data para exibição
 */
function formatDate(date: Date): string {
  return date.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });
}
