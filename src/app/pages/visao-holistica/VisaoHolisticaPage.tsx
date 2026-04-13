import { useCallback, useMemo, useState } from 'react';
import { Eye, RefreshCw, Keyboard } from 'lucide-react';
import { ControlBar } from './components/ControlBar';
import { TreeView } from './components/TreeView';
import { useMetasHierarchy } from './hooks/useMetasHierarchy';
import { useTreeState } from './hooks/useTreeState';
import { useKeyboardNavigation } from './hooks/useKeyboardNavigation';
import { filterMetas } from './utils/filters';
import { groupMetas } from './utils/sorting';
import type { FilterState, ViewMode, GroupByOption } from './types';

export default function VisaoHolisticaPage() {
  const { metas, isLoading, error, refetch } = useMetasHierarchy();
  const {
    expandedNodes,
    toggleNode,
    viewMode,
    setViewMode,
    filters,
    setFilters,
    focusedNode,
    setFocusedNode,
  } = useTreeState();

  const [groupBy, setGroupBy] = useState<GroupByOption>('nenhum');
  const [showHelp, setShowHelp] = useState(false);

  // Aplicar filtros
  const filteredMetas = useMemo(() => {
    return filterMetas(metas, filters);
  }, [metas, filters]);

  // Aplicar agrupamento
  const groupedMetas = useMemo(() => {
    return groupMetas(filteredMetas, groupBy);
  }, [filteredMetas, groupBy]);

  // Extrair todos os IDs para navegação por teclado
  const allMetaIds = useMemo(() => {
    const ids: string[] = [];
    const extractIds = (metaList: typeof metas) => {
      metaList.forEach((meta) => {
        ids.push(meta.id);
        if (meta.children) {
          extractIds(meta.children);
        }
      });
    };
    extractIds(filteredMetas);
    return ids;
  }, [filteredMetas]);

  // Handlers
  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleViewModeChange = useCallback((mode: ViewMode) => {
    setViewMode(mode);
  }, [setViewMode]);

  const handleGroupByChange = useCallback((option: GroupByOption) => {
    setGroupBy(option);
  }, []);

  const handleToggleExpand = useCallback((metaId: string) => {
    toggleNode(metaId);
  }, [toggleNode]);

  const handleFocusNode = useCallback((metaId: string) => {
    setFocusedNode(metaId);
  }, [setFocusedNode]);

  // Atalhos de teclado
  useKeyboardNavigation({
    expandedNodes,
    onToggleExpand: handleToggleExpand,
    onFocusNode: handleFocusNode,
    focusedNode,
    metaIds: allMetaIds,
    onOpenFilters: () => {
      // Scroll para a barra de filtros
      document.querySelector('[data-filter-bar]')?.scrollIntoView({ behavior: 'smooth' });
    },
  });

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-red-200 p-6 max-w-md w-full">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-lg">⚠️</span>
            </div>
            <h2 className="font-semibold text-lg">Erro ao carregar metas</h2>
          </div>
          <p className="text-slate-600 mb-4">{error.message}</p>
          <button
            onClick={refetch}
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw size={18} />
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Eye size={20} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Visão Holística</h1>
              <p className="text-sm text-slate-500">
                Visualize todas as suas metas em uma hierarquia completa
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Atalhos de teclado (?)"
          >
            <Keyboard size={20} />
          </button>
        </div>

        {/* Keyboard Shortcuts Help */}
        {showHelp && (
          <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
            <h3 className="font-medium text-slate-700 mb-3">Atalhos de Teclado</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">→</kbd>
                <span className="text-slate-600">Expandir</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">←</kbd>
                <span className="text-slate-600">Colapsar</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">Espaço</kbd>
                <span className="text-slate-600">Selecionar</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">F</kbd>
                <span className="text-slate-600">Filtros</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">↑↓</kbd>
                <span className="text-slate-600">Navegar</span>
              </div>
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-white border border-slate-300 rounded text-xs font-mono">?</kbd>
                <span className="text-slate-600">Ajuda</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Control Bar */}
      <div data-filter-bar>
        <ControlBar
          filters={filters}
          onFiltersChange={handleFiltersChange}
          viewMode={viewMode}
          onViewModeChange={handleViewModeChange}
          groupBy={groupBy}
          onGroupByChange={handleGroupByChange}
        />
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        {groupBy === 'nenhum' ? (
          <TreeView
            metas={filteredMetas}
            expandedNodes={expandedNodes}
            onToggleExpand={handleToggleExpand}
            viewMode={viewMode}
            focusedNode={focusedNode}
            onFocusNode={handleFocusNode}
            isLoading={isLoading}
          />
        ) : (
          <div className="p-4 space-y-6">
            {Object.entries(groupedMetas).map(([groupName, groupMetas]) => (
              <div key={groupName}>
                <h2 className="text-lg font-semibold text-slate-700 mb-3 px-2">{groupName}</h2>
                <div className="space-y-3">
                  {groupMetas.map((meta) => (
                    <TreeView
                      key={meta.id}
                      metas={[meta]}
                      expandedNodes={expandedNodes}
                      onToggleExpand={handleToggleExpand}
                      viewMode={viewMode}
                      focusedNode={focusedNode}
                      onFocusNode={handleFocusNode}
                      groupBy={groupBy}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
