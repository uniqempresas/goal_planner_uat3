import { motion } from 'framer-motion';
import { Target, Zap, Pause, Trophy, Filter } from 'lucide-react';

interface FilterTabsProps {
  activeFilter: string;
  onFilterChange: (filter: 'todos' | 'ativos' | 'pausados' | 'concluidos') => void;
  counts: {
    todos: number;
    ativos: number;
    pausados: number;
    concluidos: number;
  };
}

const filters = [
  { id: 'todos', label: 'Todos', icon: Target },
  { id: 'ativos', label: 'Ativos', icon: Zap },
  { id: 'pausados', label: 'Pausados', icon: Pause },
  { id: 'concluidos', label: 'Concluídos', icon: Trophy },
] as const;

export function FilterTabs({ activeFilter, onFilterChange, counts }: FilterTabsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
      <div className="flex items-center gap-2 text-slate-500">
        <Filter className="w-4 h-4" />
        <span className="text-sm font-medium">Filtrar por:</span>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.id;
          const Icon = filter.icon;
          const count = counts[filter.id as keyof typeof counts];
          
          return (
            <motion.button
              key={filter.id}
              onClick={() => onFilterChange(filter.id as any)}
              className={`
                relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                transition-all duration-200 overflow-hidden
                ${isActive 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200 hover:border-slate-300'
                }
              `}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Active indicator animation */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: '-100%' }}
                  animate={{ x: '100%' }}
                  transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                />
              )}
              
              <Icon className={`w-4 h-4 relative z-10 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span className="relative z-10">{filter.label}</span>
              <motion.span
                className={`
                  relative z-10 ml-1 px-1.5 py-0.5 rounded-md text-xs font-bold
                  ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}
                `}
                initial={false}
                animate={{ scale: count > 0 ? 1 : 0.9 }}
              >
                {count}
              </motion.span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
