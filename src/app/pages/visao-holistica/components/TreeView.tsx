import { useMemo } from 'react';
import { MetaTreeNode } from './MetaTreeNode';
import { BacklogSection } from './BacklogSection';
import { Target, Plus } from 'lucide-react';
import type { MetaNode, GroupByOption } from '../types';

interface TreeViewProps {
  metas: MetaNode[];
  expandedNodes: Set<string>;
  onToggleExpand: (metaId: string) => void;
  viewMode: 'compacto' | 'normal' | 'detalhado';
  focusedNode: string | null;
  onFocusNode: (metaId: string) => void;
  groupBy: GroupByOption;
  isLoading?: boolean;
}

export function TreeView({
  metas,
  expandedNodes,
  onToggleExpand,
  viewMode,
  focusedNode,
  onFocusNode,
  isLoading,
}: TreeViewProps) {
  // Separar metas com e sem data
  const { treeMetas, backlogMetas } = useMemo(() => {
    const tree: MetaNode[] = [];
    const backlog: MetaNode[] = [];

    metas.forEach((meta) => {
      if (!meta.prazo && meta.computedStatus !== 'concluida') {
        backlog.push(meta);
      } else {
        tree.push(meta);
      }
    });

    return { treeMetas: tree, backlogMetas: backlog };
  }, [metas]);

  if (isLoading) {
    return (
      <div className="p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-20 bg-slate-100 rounded-xl animate-pulse"
            style={{ marginLeft: `${(i % 2) * 24}px` }}
          />
        ))}
      </div>
    );
  }

  if (metas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <Target size={32} className="text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          Nenhuma meta encontrada
        </h3>
        <p className="text-slate-500 max-w-md mb-6">
          Você ainda não tem metas cadastradas ou nenhuma meta corresponde aos filtros selecionados.
        </p>
        <button className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={18} />
          Criar primeira meta
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Backlog Section */}
      <BacklogSection
        metas={backlogMetas}
        viewMode={viewMode}
        expandedNodes={expandedNodes}
        onToggleExpand={onToggleExpand}
      />

      {/* Tree View */}
      <div className="space-y-3">
        {treeMetas.map((meta) => (
          <MetaTreeNode
            key={meta.id}
            meta={meta}
            level={0}
            expandedNodes={expandedNodes}
            onToggleExpand={onToggleExpand}
            viewMode={viewMode}
            focusedNode={focusedNode}
            onFocusNode={onFocusNode}
          />
        ))}
      </div>
    </div>
  );
}
