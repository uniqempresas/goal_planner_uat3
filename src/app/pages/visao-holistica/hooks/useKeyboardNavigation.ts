import { useEffect, useCallback, useRef } from 'react';

interface UseKeyboardNavigationProps {
  expandedNodes: Set<string>;
  onToggleExpand: (metaId: string) => void;
  onFocusNode: (metaId: string) => void;
  focusedNode: string | null;
  metaIds: string[];
  onOpenFilters?: () => void;
}

/**
 * Hook para gerenciar atalhos de teclado na visão holística
 * → : Expandir nó focado
 * ← : Colapsar nó focado
 * Espaço : Selecionar/marcar nó
 * F : Abrir filtros
 * ? : Mostrar ajuda
 */
export function useKeyboardNavigation({
  expandedNodes,
  onToggleExpand,
  onFocusNode,
  focusedNode,
  metaIds,
  onOpenFilters,
}: UseKeyboardNavigationProps) {
  const metaIdsRef = useRef(metaIds);
  
  useEffect(() => {
    metaIdsRef.current = metaIds;
  }, [metaIds]);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Ignorar se estiver em um input ou textarea
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement ||
      event.target instanceof HTMLSelectElement
    ) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        if (focusedNode && !expandedNodes.has(focusedNode)) {
          onToggleExpand(focusedNode);
        }
        break;

      case 'ArrowLeft':
        event.preventDefault();
        if (focusedNode && expandedNodes.has(focusedNode)) {
          onToggleExpand(focusedNode);
        }
        break;

      case ' ': // Space
        event.preventDefault();
        if (focusedNode) {
          onToggleExpand(focusedNode);
        }
        break;

      case 'f':
      case 'F':
        event.preventDefault();
        onOpenFilters?.();
        break;

      case '?':
        event.preventDefault();
        // Mostrar ajuda - pode ser implementado posteriormente
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (metaIdsRef.current.length > 0) {
          const currentIndex = focusedNode 
            ? metaIdsRef.current.indexOf(focusedNode) 
            : -1;
          const nextIndex = Math.min(currentIndex + 1, metaIdsRef.current.length - 1);
          if (nextIndex >= 0) {
            onFocusNode(metaIdsRef.current[nextIndex]);
          }
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (metaIdsRef.current.length > 0) {
          const currentIndex = focusedNode 
            ? metaIdsRef.current.indexOf(focusedNode) 
            : 1;
          const prevIndex = Math.max(currentIndex - 1, 0);
          onFocusNode(metaIdsRef.current[prevIndex]);
        }
        break;

      default:
        break;
    }
  }, [expandedNodes, focusedNode, onToggleExpand, onFocusNode, onOpenFilters]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    isKeyboardEnabled: true,
  };
}
