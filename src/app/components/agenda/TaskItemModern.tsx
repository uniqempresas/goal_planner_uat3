import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, Star, Sun, Sunset, Moon } from 'lucide-react';
import { Link } from 'react-router';
import type { TarefaUI } from '../../../lib/mapeamento';

interface TaskItemModernProps {
  task: TarefaUI;
  onToggle: (taskId: string) => Promise<void>;
  isToggling: boolean;
  onNavigate: (taskId: string) => void;
}

const blockLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  oneThing: { label: 'ONE Thing', icon: <Star size={10} className="text-amber-500 fill-amber-400" />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  manha: { label: 'Manhã', icon: <Sun size={10} className="text-orange-500" />, color: 'bg-orange-50 text-orange-700 border-orange-200' },
  tarde: { label: 'Tarde', icon: <Sunset size={10} className="text-pink-500" />, color: 'bg-pink-50 text-pink-700 border-pink-200' },
  noite: { label: 'Noite', icon: <Moon size={10} className="text-indigo-500" />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  recorrentes: { label: 'Recorrente', icon: null, color: 'bg-slate-50 text-slate-700 border-slate-200' },
};

export function TaskItemModern({ task, onToggle, isToggling, onNavigate }: TaskItemModernProps) {
  const blockInfo = blockLabels[task.block || 'recorrentes'] || blockLabels.recorrentes;
  const isOneThing = task.isOneThing || task.block === 'oneThing';

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await onToggle(task.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
      className={`
        group flex items-start gap-3 p-3 rounded-xl transition-all
        ${isOneThing ? 'border-l-4 border-amber-400 bg-amber-50/30' : 'bg-white'}
      `}
    >
      {/* Checkbox */}
      <button 
        onClick={handleToggle}
        disabled={isToggling}
        className="mt-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
      >
        {isToggling ? (
          <Loader2 size={20} className="text-indigo-500 animate-spin" />
        ) : task.completed ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500 }}
          >
            <CheckCircle2 size={20} className="text-emerald-500" />
          </motion.div>
        ) : (
          <Circle size={20} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
        )}
      </button>

      {/* Content */}
      <Link
        to={`/agenda/tarefas/${task.id}`}
        className="flex-1 min-w-0"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className={`
              text-sm truncate transition-all
              ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}
              ${isOneThing ? 'font-medium' : ''}
            `}>
              {isOneThing && <Star size={12} className="inline text-amber-500 fill-amber-400 mr-1" />}
              {task.title}
            </p>
            {(task.hora || task.description) && (
              <p className="text-xs text-slate-400 mt-0.5 truncate">
                {task.hora && <span className="mr-2">{task.hora}</span>}
                {task.description}
              </p>
            )}
          </div>
          
          {/* Block badge */}
          <span className={`
            shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1
            ${blockInfo.color}
          `}>
            {blockInfo.icon}
            {blockInfo.label}
          </span>
        </div>
      </Link>
    </motion.div>
  );
}