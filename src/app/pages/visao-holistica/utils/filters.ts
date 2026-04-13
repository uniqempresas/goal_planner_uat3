import type { MetaNode, FilterCriteria } from '../types';

/**
 * Filtra metas baseado em critérios
 */
export function filterMetas(nodes: MetaNode[], criteria: FilterCriteria): MetaNode[] {
  return nodes.filter(node => {
    // Filtro por status
    if (criteria.status && criteria.status !== 'todas') {
      const statusMap = {
        'ativas': ['ativa'],
        'concluidas': ['concluida'],
        'atrasadas': ['atrasada', 'critica'],
      };
      if (!statusMap[criteria.status]?.includes(node.computedStatus)) {
        return false;
      }
    }

    // Filtro por área
    if (criteria.areaId && node.area_id !== criteria.areaId) {
      return false;
    }

    // Filtro por ONE Thing
    if (criteria.oneThingOnly && !node.one_thing) {
      return false;
    }

    // Busca textual (título, descrição, focusing question)
    if (criteria.searchQuery) {
      const query = criteria.searchQuery.toLowerCase();
      const searchable = [
        node.titulo,
        node.descricao,
        node.focusing_question,
      ].join(' ').toLowerCase();
      
      if (!searchable.includes(query)) {
        return false;
      }
    }

    return true;
  }).map(node => ({
    ...node,
    children: node.children ? filterMetas(node.children, criteria) : undefined,
  }));
}

/**
 * Verifica se um nó ou algum de seus filhos corresponde aos critérios de busca
 */
export function nodeMatchesSearch(node: MetaNode, searchQuery: string): boolean {
  const query = searchQuery.toLowerCase();
  const searchable = [
    node.titulo,
    node.descricao,
    node.focusing_question,
  ].join(' ').toLowerCase();
  
  if (searchable.includes(query)) return true;
  
  if (node.children) {
    return node.children.some(child => nodeMatchesSearch(child, searchQuery));
  }
  
  return false;
}
