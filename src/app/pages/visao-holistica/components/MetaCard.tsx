import { ChevronRight, ChevronDown, Star } from 'lucide-react';
import { levelColors, levelIcons, statusColors } from '../lib/constants';
import type { MetaNode } from '../types';

interface MetaCardProps {
  meta: MetaNode;
  level: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  viewMode: 'compacto' | 'normal' | 'detalhado';
  hasChildren: boolean;
  isFocused?: boolean;
  onFocus?: () => void;
}

export function MetaCard({
  meta,
  level,
  isExpanded,
  onToggleExpand,
  viewMode,
  hasChildren,
  isFocused,
  onFocus,
}: MetaCardProps) {
  const LevelIcon = levelIcons[meta.nivel];
  const colors = levelColors[meta.nivel];
  const statusColors_ = statusColors[meta.computedStatus];
  
  const indentPadding = level * 24;

  if (viewMode === 'compacto') {
    return (
      <div
        className={`group flex items-center gap-2 p-2 rounded-lg border transition-all duration-150 cursor-pointer
          ${colors.bg} ${colors.border} border
          ${isFocused ? 'ring-2 ring-indigo-500 ring-offset-1' : ''}
          hover:shadow-sm`}
        style={{ marginLeft: `${indentPadding}px` }}
        onClick={onFocus}
        data-testid={`meta-card-${meta.id}`}
        tabIndex={0}
      >
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand();
            }}
            className="p-0.5 rounded hover:bg-white/50 transition-colors"
          >
            {isExpanded ? (
              <ChevronDown size={14} className="text-slate-500" />
            ) : (
              <ChevronRight size={14} className="text-slate-500" />
            )}
          </button>
        )}
        
        <LevelIcon size={14} className={colors.icon} />
        
        <span className={`text-sm font-medium truncate flex-1 ${colors.text}`}>
          {meta.titulo}
        </span>
        
        {meta.one_thing && (
          <Star size={12} className="text-amber-500 fill-amber-500" />
        )}
        
        <div className="w-12 h-1.5 bg-white/50 rounded-full overflow-hidden">
          <div
            className={`h-full ${statusColors_.bar} transition-all duration-300`}
            style={{ width: `${meta.computedProgress}%` }}
          />
        </div>
        
        <span className={`text-xs font-medium ${statusColors_.text}`}>
          {meta.computedProgress}%
        </span>
      </div>
    );
  }

  return (
    <div
      className={`group rounded-xl border transition-all duration-200 
        ${colors.bg} ${colors.border} border
        ${isFocused ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
        hover:shadow-md`}
      style={{ marginLeft: `${indentPadding}px` }}
      onClick={onFocus}
      data-testid={`meta-card-${meta.id}`}
      tabIndex={0}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Expand/Collapse Button */}
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand();
              }}
              className="mt-1 p-1 rounded-lg hover:bg-white/50 transition-colors"
            >
              {isExpanded ? (
                <ChevronDown size={18} className="text-slate-500" />
              ) : (
                <ChevronRight size={18} className="text-slate-500" />
              )}
            </button>
          ) : (
            <div className="mt-1 w-8" />
          )}

          {/* Icon & Title Section */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1.5 rounded-lg bg-white/60`}>
                <LevelIcon size={16} className={colors.icon} />
              </div>
              
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                {meta.nivel}
              </span>
              
              {meta.one_thing && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium">
                  <Star size={10} className="fill-amber-500" />
                  ONE Thing
                </span>
              )}
              
              <span className={`ml-auto inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors_.badge}`}>
                {meta.computedStatus === 'ativa' ? 'Em dia' : 
                 meta.computedStatus === 'concluida' ? 'Concluída' :
                 meta.computedStatus === 'atrasada' ? 'Atrasada' :
                 meta.computedStatus === 'critica' ? 'Crítica' : 'Backlog'}
              </span>
            </div>

            <h3 className={`font-semibold text-lg leading-tight ${colors.text} mb-1`}>
              {meta.titulo}
            </h3>

            {viewMode === 'detalhado' && meta.descricao && (
              <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                {meta.descricao}
              </p>
            )}

            {viewMode === 'detalhado' && meta.focusing_question && (
              <p className="text-sm text-indigo-600 mt-2 italic">
                "{meta.focusing_question}"
              </p>
            )}

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-slate-500">Progresso</span>
                <span className={`text-xs font-semibold ${statusColors_.text}`}>
                  {meta.computedProgress}%
                </span>
              </div>
              <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                <div
                  className={`h-full ${statusColors_.bar} transition-all duration-500 ease-out rounded-full`}
                  style={{ width: `${meta.computedProgress}%` }}
                />
              </div>
            </div>

            {/* Footer Info */}
            {(meta.prazo || meta.areas) && (
              <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                {meta.prazo && (
                  <span>
                    Prazo: {new Date(meta.prazo).toLocaleDateString('pt-BR')}
                  </span>
                )}
                {meta.areas && (
                  <span className="flex items-center gap-1">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: meta.areas.cor || '#94a3b8' }}
                    />
                    {meta.areas.nome}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
