import { MetaCard } from './MetaCard';
import type { MetaNode } from '../types';

interface MetaTreeNodeProps {
  meta: MetaNode;
  level: number;
  expandedNodes: Set<string>;
  onToggleExpand: (metaId: string) => void;
  viewMode: 'compacto' | 'normal' | 'detalhado';
  focusedNode: string | null;
  onFocusNode: (metaId: string) => void;
}

export function MetaTreeNode({
  meta,
  level,
  expandedNodes,
  onToggleExpand,
  viewMode,
  focusedNode,
  onFocusNode,
}: MetaTreeNodeProps) {
  const isExpanded = expandedNodes.has(meta.id);
  const isFocused = focusedNode === meta.id;
  const hasChildren = meta.children && meta.children.length > 0;

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
      <MetaCard
        meta={meta}
        level={level}
        isExpanded={isExpanded}
        onToggleExpand={() => onToggleExpand(meta.id)}
        viewMode={viewMode}
        hasChildren={hasChildren}
        isFocused={isFocused}
        onFocus={() => onFocusNode(meta.id)}
      />

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="mt-2 space-y-2">
          {meta.children!.map((child) => (
            <MetaTreeNode
              key={child.id}
              meta={child}
              level={level + 1}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
              viewMode={viewMode}
              focusedNode={focusedNode}
              onFocusNode={onFocusNode}
            />
          ))}
        </div>
      )}
    </div>
  );
}
