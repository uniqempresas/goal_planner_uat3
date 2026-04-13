import { useState, useCallback, useEffect } from 'react';
import { usePersistedState } from '../../../hooks/usePersistedState';
import type { FilterState, ViewMode } from '../types';

interface UseTreeStateResult {
  expandedNodes: Set<string>;
  toggleNode: (nodeId: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  expandNode: (nodeId: string) => void;
  collapseNode: (nodeId: string) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  filters: FilterState;
  setFilters: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  focusedNode: string | null;
  setFocusedNode: (nodeId: string | null) => void;
}

const STORAGE_KEY = 'visao-holistica-state';

const defaultFilters: FilterState = {
  status: 'ativas',
  searchQuery: '',
};

interface PersistedTreeState {
  expandedNodes: string[];
  viewMode: ViewMode;
  filters: FilterState;
}

/**
 * Hook para gerenciar o estado da árvore com persistência
 */
export function useTreeState(): UseTreeStateResult {
  const [persistedState, setPersistedState] = usePersistedState<PersistedTreeState>({
    key: STORAGE_KEY,
    defaultValue: {
      expandedNodes: [],
      viewMode: 'normal',
      filters: defaultFilters,
    },
  });

  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(
    () => new Set(persistedState.expandedNodes)
  );
  const [viewMode, setViewMode] = useState<ViewMode>(persistedState.viewMode);
  const [filters, setFilters] = useState<FilterState>(persistedState.filters);
  const [focusedNode, setFocusedNode] = useState<string | null>(null);

  // Persistir mudanças
  useEffect(() => {
    setPersistedState({
      expandedNodes: Array.from(expandedNodes),
      viewMode,
      filters,
    });
  }, [expandedNodes, viewMode, filters, setPersistedState]);

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const expandNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => new Set(prev).add(nodeId));
  }, []);

  const collapseNode = useCallback((nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      newSet.delete(nodeId);
      return newSet;
    });
  }, []);

  const expandAll = useCallback(() => {
    // Expande todos os nós - será implementado quando tivermos acesso à lista completa
    setExpandedNodes(prev => new Set(prev));
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set());
  }, []);

  return {
    expandedNodes,
    toggleNode,
    expandAll,
    collapseAll,
    expandNode,
    collapseNode,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    focusedNode,
    setFocusedNode,
  };
}
