'use client';

import { useState, useMemo } from 'react';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  Circle, 
  RefreshCw,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  CircleDashed
} from 'lucide-react';
import type { TaskViewItem, TaskFilterState, GroupedTasks } from '../types';

interface TaskItemProps {
  tarefa: TaskViewItem;
}

function TaskItem({ tarefa }: TaskItemProps) {
  const isRecorrente = tarefa.habito_id !== null;
  
  const formattedDate = useMemo(() => {
    if (!tarefa.data) return '';
    try {
      const date = parseISO(tarefa.data);
      if (!isValid(date)) return tarefa.data;
      return format(date, 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return tarefa.data;
    }
  }, [tarefa.data]);

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-slate-100 hover:border-indigo-200 hover:shadow-sm transition-all">
      {tarefa.completed ? (
        <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
      ) : (
        <Circle size={20} className="text-slate-300 flex-shrink-0" />
      )}
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium truncate ${
            tarefa.completed ? 'text-slate-400 line-through' : 'text-slate-700'
          }`}>
            {tarefa.titulo}
          </span>
          
          {isRecorrente && (
            <RefreshCw size={14} className="text-indigo-400 flex-shrink-0" title="Tarefa recorrente" />
          )}
        </div>
        
        {(tarefa.descricao || tarefa.hora) && (
          <p className="text-xs text-slate-400 truncate mt-0.5">
            {tarefa.descricao}
          </p>
        )}
      </div>
      
      <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
        {tarefa.hora && (
          <div className="flex items-center gap-1">
            <Clock size={12} />
            <span>{tarefa.hora}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}

interface TaskSectionProps {
  title: string;
  icon: React.ReactNode;
  tasks: TaskViewItem[];
  defaultExpanded?: boolean;
  count: number;
}

function TaskSection({ title, icon, tasks, defaultExpanded = true, count }: TaskSectionProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (count === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center gap-2 w-full px-2 py-2 text-left hover:bg-slate-50 rounded-lg transition-colors"
      >
        {isExpanded ? (
          <ChevronDown size={18} className="text-slate-400" />
        ) : (
          <ChevronRight size={18} className="text-slate-400" />
        )}
        
        {icon}
        
        <span className="text-sm font-semibold text-slate-700">
          {title}
        </span>
        
        <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
          {count}
        </span>
      </button>
      
      {isExpanded && (
        <div className="mt-2 ml-6 space-y-2">
          {tasks.map((tarefa) => (
            <TaskItem key={tarefa.id} tarefa={tarefa} />
          ))}
        </div>
      )}
    </div>
  );
}

interface TasksListViewProps {
  tarefas: GroupedTasks;
  filtro: TaskFilterState;
  isLoading?: boolean;
}

export function TasksListView({ tarefas, filtro, isLoading }: TasksListViewProps) {
  // Filtrar tarefas baseado no filtro
  const filteredTasks = useMemo(() => {
    const filtrarPorTipo = (lista: TaskViewItem[]): TaskViewItem[] => {
      if (filtro.tipo === 'todas') {
        return lista;
      }
      return lista.filter((tarefa) => {
        const isRecorrente = tarefa.habito_id !== null;
        if (filtro.tipo === 'recorrentes') {
          return isRecorrente;
        }
        return !isRecorrente;
      });
    };

    return {
      atrasadas: filtro.showAtrasadas ? filtrarPorTipo(tarefas.atrasadas) : [],
      abertas: filtro.showAberto ? filtrarPorTipo(tarefas.abertas) : [],
      concluidas: filtro.showConcluidas ? filtrarPorTipo(tarefas.concluidas) : [],
    };
  }, [tarefas, filtro]);

  const atrasadasCount = filteredTasks.atrasadas.length;
  const abertasCount = filteredTasks.abertas.length;
  const concluidasCount = filteredTasks.concluidas.length;

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 bg-slate-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  const hasAnyTask = atrasadasCount > 0 || abertasCount > 0 || concluidasCount > 0;

  if (!hasAnyTask) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
          <CheckCircle size={32} className="text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">
          Nenhuma tarefa encontrada
        </h3>
        <p className="text-slate-500 max-w-md">
          Você não tem tarefas que correspondam aos filtros selecionados.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Atrasadas */}
      {filtro.showAtrasadas && (
        <TaskSection
          title="Atrasadas"
          icon={<AlertCircle size={18} className="text-red-500" />}
          tasks={filteredTasks.atrasadas}
          count={atrasadasCount}
          defaultExpanded={true}
        />
      )}
      
      {/* Em Aberto */}
      {filtro.showAberto && (
        <TaskSection
          title="Em Aberto"
          icon={<CircleDashed size={18} className="text-amber-500" />}
          tasks={filteredTasks.abertas}
          count={abertasCount}
          defaultExpanded={true}
        />
      )}
      
      {/* Concluídas */}
      {filtro.showConcluidas && (
        <TaskSection
          title="Concluídas"
          icon={<CheckCircle size={18} className="text-green-500" />}
          tasks={filteredTasks.concluidas}
          count={concluidasCount}
          defaultExpanded={false}
        />
      )}
    </div>
  );
}