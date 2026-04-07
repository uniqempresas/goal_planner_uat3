import { Link } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { Meta, type MetaNivel } from '@/app/pages/metas/types';
import { cn } from '@/app/components/ui/utils';

interface HierarchyTreePreviewProps {
  ancestors: Meta[];
  currentLevel: MetaNivel;
  currentTitle?: string;
}

const nivelLabels: Record<MetaNivel, string> = {
  grande: 'G',
  anual: 'A',
  mensal: 'M',
  semanal: 'S',
  diaria: 'D',
};

const nivelFullLabels: Record<MetaNivel, string> = {
  grande: 'Grande Meta',
  anual: 'Meta Anual',
  mensal: 'Meta Mensal',
  semanal: 'Meta Semanal',
  diaria: 'Meta Diária',
};

export function HierarchyTreePreview({ ancestors, currentLevel, currentTitle }: HierarchyTreePreviewProps) {
  if (ancestors.length === 0 && !currentTitle) {
    return null;
  }

  return (
    <div className="bg-slate-50 rounded-lg p-4 flex items-center gap-2 flex-wrap text-sm">
      {ancestors.map((ancestor, index) => (
        <div key={ancestor.id} className="flex items-center gap-2">
          <Link
            to={`/metas/${ancestor.nivel}/${ancestor.id}`}
            className="flex items-center gap-1.5 text-indigo-600 hover:underline"
          >
            <span className={cn(
              'font-semibold px-1.5 py-0.5 rounded text-xs',
              ancestor.nivel === 'grande' && 'bg-purple-100 text-purple-700',
              ancestor.nivel === 'anual' && 'bg-blue-100 text-blue-700',
              ancestor.nivel === 'mensal' && 'bg-green-100 text-green-700',
              ancestor.nivel === 'semanal' && 'bg-orange-100 text-orange-700',
              ancestor.nivel === 'diaria' && 'bg-red-100 text-red-700',
            )}>
              {nivelLabels[ancestor.nivel]}
            </span>
            <span className="truncate max-w-[150px]">{ancestor.titulo}</span>
          </Link>
          {index < ancestors.length - 1 && <ChevronRight className="h-4 w-4 text-slate-400" />}
        </div>
      ))}

      {/* Current level */}
      <div className="flex items-center gap-1.5">
        {ancestors.length > 0 && <ChevronRight className="h-4 w-4 text-slate-400" />}
        <span className={cn(
          'font-semibold px-1.5 py-0.5 rounded text-xs',
          currentLevel === 'grande' && 'bg-purple-100 text-purple-700',
          currentLevel === 'anual' && 'bg-blue-100 text-blue-700',
          currentLevel === 'mensal' && 'bg-green-100 text-green-700',
          currentLevel === 'semanal' && 'bg-orange-100 text-orange-700',
          currentLevel === 'diaria' && 'bg-red-100 text-red-700',
        )}>
          {nivelLabels[currentLevel]}
        </span>
        {currentTitle ? (
          <span className="text-slate-800 font-medium">{currentTitle}</span>
        ) : (
          <span className="text-slate-500 italic">[Nova {nivelFullLabels[currentLevel]}]</span>
        )}
      </div>
    </div>
  );
}
