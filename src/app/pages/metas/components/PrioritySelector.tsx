import { Star } from 'lucide-react';
import { cn } from '../../../components/ui/utils';
import type { Prioridade } from '../../types';

interface PrioritySelectorProps {
  value: Prioridade;
  onChange: (value: Prioridade) => void;
}

const priorities: { value: Prioridade; label: string; description: string; icon: React.ReactNode; color: string; bgColor: string }[] = [
  {
    value: 'normal',
    label: 'Normal',
    description: 'Meta comum do dia a dia',
    icon: null,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100 border-slate-200',
  },
  {
    value: 'prioritaria',
    label: 'Prioritária',
    description: 'Meta importante que precisa de atenção',
    icon: <Star className="h-4 w-4" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50 border-yellow-200',
  },
  {
    value: 'one_thing',
    label: 'ONE Thing',
    description: 'Sua única prioridade absoluta',
    icon: null,
    color: 'text-red-600',
    bgColor: 'bg-red-50 border-red-200',
  },
];

export function PrioritySelector({ value, onChange }: PrioritySelectorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {priorities.map((priority) => (
          <div
            key={priority.value}
            onClick={() => onChange(priority.value)}
            className={cn(
              'cursor-pointer rounded-lg border-2 p-4 transition-all flex flex-col items-center text-center',
              value === priority.value
                ? 'border-indigo-500 bg-indigo-50 ring-2 ring-indigo-200 ring-offset-2'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
              priority.bgColor,
              value !== priority.value && priority.bgColor
            )}
          >
            {priority.icon && (
              <div className={cn('mb-2', priority.color)}>
                {priority.icon}
              </div>
            )}
            <span className={cn('font-semibold', priority.color)}>
              {priority.label}
            </span>
            <p className="text-xs text-slate-500 mt-1">
              {priority.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
