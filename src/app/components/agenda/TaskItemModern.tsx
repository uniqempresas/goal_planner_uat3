import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2, Star, Sun, Sunset, Moon, XCircle, CalendarPlus } from 'lucide-react';
import { Link } from 'react-router';
import type { TarefaUI } from '../../../lib/mapeamento';

interface TaskItemModernProps {
  task: TarefaUI;
  onToggle: (taskId: string) => Promise<void>;
  isToggling: boolean;
  onNavigate: (taskId: string) => void;
  onMarkMissed?: (taskId: string) => Promise<void>;
  onReschedule?: (taskId: string) => void;
}

const blockLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  oneThing: { label: 'ONE Thing', icon: <Star size={10} className="text-amber-500 fill-amber-400" />, color: 'bg-amber-50 text-amber-700 border-amber-200' },
  manha: { label: 'Manhã', icon: <Sun size={10} className="text-orange-500" />, color: 'bg-orange-50 text-orange-700 border-orange-200' },
  tarde: { label: 'Tarde', icon: <Sunset size={10} className="text-pink-500" />, color: 'bg-pink-50 text-pink-700 border-pink-200' },
  noite: { label: 'Noite', icon: <Moon size={10} className="text-indigo-500" />, color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  recorrentes: { label: 'Recorrente', icon: null, color: 'bg-slate-50 text-slate-700 border-slate-200' },
};

export function TaskItemModern({ task, onToggle, isToggling, onNavigate, onMarkMissed, onReschedule }: TaskItemModernProps) {
  const blockInfo = blockLabels[task.block || 'recorrentes'] || blockLabels.recorrentes;
  const isOneThing = task.isOneThing || task.block === 'oneThing';

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await onToggle(task.id);
  };

  const handleMarkMissed = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await onMarkMissed?.(task.id);
  };

  const handleReschedule = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onReschedule?.(task.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ backgroundColor: 'rgba(248, 250, 252, 0.8)' }}
      className={`
        group flex items-start gap-3 p-3 rounded-xl transition-all relative
        ${isOneThing ? 'border-l-4 border-amber-400 bg-amber-50/30' : ''}
        ${task.missed ? 'bg-red-50/30 border-l-4 border-red-300' : 'bg-white'}
        ${task.completed ? 'opacity-60' : ''}
      `}
    >
      {/* Checkbox - disabled for missed tasks */}
      <button 
        onClick={handleToggle}
        disabled={isToggling || task.missed}
        className="mt-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
      >
        {isToggling ? (
          <Loader2 size={20} className="text-indigo-500 animate-spin" />
        ) : task.missed ? (
          <XCircle size={20} className="text-red-400" />
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
              ${task.completed ? 'line-through text-slate-400' : task.missed ? 'text-red-600' : 'text-slate-700'}
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
          
          {/* Block badge + Missed badge */}
          <div className="flex items-center gap-1 shrink-0">
            {task.missed && (
              <span className="text-[10px] font-medium text-red-600 bg-red-100 px-1.5 py-0.5 rounded-full border border-red-200">
                Não executada
              </span>
            )}
            <span className={`
              text-[10px] font-medium px-2 py-0.5 rounded-full border flex items-center gap-1
              ${blockInfo.color}
            `}>
              {blockInfo.icon}
              {blockInfo.label}
            </span>
          </div>
        </div>

        {/* Action buttons for missed tasks */}
        {task.missed && onReschedule && (
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={handleReschedule}
              className="flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              <CalendarPlus size={14} />
              Reagendar
            </button>
          </div>
        )}
      </Link>

      {/* Mark as missed action */}
      {!task.completed && !task.missed && onMarkMissed && (
        <div className="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleMarkMissed}
            className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Marcar como não executada"
          >
            <XCircle size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
}