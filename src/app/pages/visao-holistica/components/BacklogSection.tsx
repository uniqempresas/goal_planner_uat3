import { Archive, Inbox } from 'lucide-react';
import { MetaCard } from './MetaCard';
import type { MetaNode } from '../types';

interface BacklogSectionProps {
  metas: MetaNode[];
  viewMode: 'compacto' | 'normal' | 'detalhado';
  expandedNodes: Set<string>;
  onToggleExpand: (metaId: string) => void;
}

export function BacklogSection({ 
  metas, 
  viewMode, 
  expandedNodes, 
  onToggleExpand 
}: BacklogSectionProps) {
  if (metas.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Inbox size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="font-semibold text-blue-900">Backlog</h2>
          <p className="text-sm text-blue-600">
            {metas.length} meta{metas.length !== 1 ? 's' : ''} sem data definida
          </p>
        </div>
      </div>

      <div className="space-y-2">
        {metas.map((meta) => (
          <MetaCard
            key={meta.id}
            meta={meta}
            level={0}
            isExpanded={expandedNodes.has(meta.id)}
            onToggleExpand={() => onToggleExpand(meta.id)}
            viewMode={viewMode}
            hasChildren={!!meta.children && meta.children.length > 0}
          />
        ))}
      </div>

      {metas.length === 0 && (
        <div className="text-center py-8 text-blue-400">
          <Archive size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Nenhuma meta no backlog</p>
        </div>
      )}
    </div>
  );
}
