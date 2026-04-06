import { useState } from 'react';
import { Link } from 'react-router';
import {
  Star, AlertTriangle, Sun, Cloud, Moon, RefreshCw, Calendar,
  CheckCircle2, Circle, ChevronDown, ChevronUp, Plus, Clock,
  Target, Flame,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import EmptyState from '../../components/empty-state/EmptyState';
import { type Tarefa, type TimeBlock, blockConfig } from '../../data/mockData';

const blockOrder: TimeBlock[] = ['oneThing', 'atrasadas', 'manha', 'tarde', 'noite', 'habitos', 'recorrentes'];

const blockIcons: Record<TimeBlock, React.ReactNode> = {
  oneThing: <Star size={16} className="text-amber-500 fill-amber-400" />,
  atrasadas: <AlertTriangle size={16} className="text-red-500" />,
  manha: <Sun size={16} className="text-amber-500" />,
  tarde: <Cloud size={16} className="text-sky-500" />,
  noite: <Moon size={16} className="text-indigo-500" />,
  habitos: <RefreshCw size={16} className="text-emerald-500" />,
  recorrentes: <Calendar size={16} className="text-purple-500" />,
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-400',
  medium: 'bg-amber-400',
  low: 'bg-slate-300',
};

function TarefaItem({ tarefa, onToggle }: { tarefa: Tarefa; onToggle: (id: string) => void }) {
  const { getMetaById } = useApp();
  const meta = tarefa.metaId ? getMetaById(tarefa.metaId) : undefined;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${tarefa.completed ? 'opacity-60' : 'hover:bg-black/5'}`}>
      <button
        onClick={() => onToggle(tarefa.id)}
        className="mt-0.5 shrink-0 transition-transform hover:scale-110 cursor-pointer"
      >
        {tarefa.completed
          ? <CheckCircle2 size={20} className="text-emerald-500" />
          : <Circle size={20} className="text-slate-300 hover:text-slate-400" />
        }
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={`text-sm leading-relaxed ${tarefa.completed ? 'line-through text-slate-400' : 'text-slate-800'} ${tarefa.isOneThing ? 'font-medium' : ''}`}>
            {tarefa.title}
          </p>
          {tarefa.priority && (
            <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${priorityColors[tarefa.priority]}`} />
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-1">
          {tarefa.hora && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock size={10} />
              {tarefa.hora}
            </span>
          )}
          {meta && (
            <span className="text-xs text-indigo-500 flex items-center gap-1">
              <Target size={10} />
              {meta.title.slice(0, 30)}{meta.title.length > 30 ? '…' : ''}
            </span>
          )}
          {tarefa.notes && (
            <span className="text-xs text-slate-400 italic line-clamp-1">{tarefa.notes}</span>
          )}
        </div>
      </div>
    </div>
  );
}

function TimeBlockSection({ block, tarefas, onToggle }: {
  block: TimeBlock;
  tarefas: Tarefa[];
  onToggle: (id: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const cfg = blockConfig[block];
  const completed = tarefas.filter(t => t.completed).length;
  const isOneThing = block === 'oneThing';
  const hasItems = tarefas.length > 0;

  if (!hasItems && block !== 'oneThing') return null;

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-all ${isOneThing ? 'shadow-md' : ''}`}
      style={{ borderColor: cfg.borderColor, backgroundColor: cfg.bgColor }}
    >
      {/* Block Header */}
      <button
        onClick={() => setCollapsed(c => !c)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: isOneThing ? '#F59E0B' : cfg.borderColor + '30' }}
          >
            {blockIcons[block]}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm" style={{ color: cfg.color }}>
                {cfg.label}
              </span>
              {isOneThing && (
                <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">Prioridade Absoluta</span>
              )}
            </div>
            {hasItems && (
              <span className="text-xs text-slate-400">{completed}/{tarefas.length} concluídas</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasItems && (
            <div className="hidden sm:flex items-center gap-1">
              {tarefas.map(t => (
                <div
                  key={t.id}
                  className={`w-2 h-2 rounded-full ${t.completed ? 'bg-emerald-400' : 'bg-slate-200'}`}
                />
              ))}
            </div>
          )}
          {collapsed ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronUp size={16} className="text-slate-400" />}
        </div>
      </button>

      {/* Block Content */}
      {!collapsed && (
        <div className="px-4 pb-4">
          {tarefas.length === 0 && isOneThing && (
            <div className="text-center py-6">
              <Star size={28} className="text-amber-300 fill-amber-200 mx-auto mb-3" />
              <p className="text-amber-700 text-sm font-medium mb-1">Nenhuma ONE Thing definida</p>
              <p className="text-amber-600 text-xs mb-4">Defina a única coisa mais importante do seu dia.</p>
              <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-sm mx-auto transition-colors cursor-pointer">
                <Plus size={14} />
                Definir ONE Thing
              </button>
            </div>
          )}

          {tarefas.length > 0 && (
            <div className="space-y-1">
              {tarefas.map(tarefa => (
                <TarefaItem key={tarefa.id} tarefa={tarefa} onToggle={onToggle} />
              ))}
            </div>
          )}

          {block !== 'oneThing' && (
            <button className="flex items-center gap-2 text-slate-400 hover:text-slate-600 text-sm mt-3 px-3 py-2 rounded-lg hover:bg-black/5 transition-colors cursor-pointer w-full">
              <Plus size={14} />
              Adicionar tarefa
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function AgendaHojePage() {
  const { tarefasHoje, toggleTarefa, weeklyStats } = useApp();

  const completed = tarefasHoje.filter(t => t.completed).length;
  const total = tarefasHoje.length;
  const progressPct = Math.round((completed / total) * 100);

  const habitasBlock = tarefasHoje.filter(t => t.block === 'habitos');
  const habitosCompleted = habitasBlock.filter(t => t.completed).length;
  const habitosProgress = habitasBlock.length > 0 ? Math.round((habitosCompleted / habitasBlock.length) * 100) : 0;

  const today = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-slate-800">Agenda de Hoje</h1>
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">
            <Flame size={14} className="text-orange-500" />
            <span className="text-orange-700 text-xs font-medium">{weeklyStats.streakDays} dias</span>
          </div>
        </div>
        <p className="text-slate-500 text-sm capitalize">{today}</p>
      </div>

      {/* Day Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-700 text-sm font-medium">Progresso do Dia</span>
          <span className="text-slate-600 text-sm">{completed}/{total} tarefas · {progressPct}%</span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-600">{completed}</div>
            <div className="text-slate-400 text-xs">Concluídas</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-indigo-600">{total - completed}</div>
            <div className="text-slate-400 text-xs">Pendentes</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-amber-600">{habitosProgress}%</div>
            <div className="text-slate-400 text-xs">Hábitos</div>
          </div>
        </div>
      </div>

      {/* Empty State or Time Blocks */}
      {tarefasHoje.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-12 h-12" />}
          title="Nenhuma tarefa para hoje"
          description="Adicione tarefas para organizar seu dia e acompanhar seu progresso."
          actionLabel="Criar Primeira Tarefa"
          actionHref="/agenda/tarefas/criar"
        />
      ) : (
        <>
          {/* Time Blocks */}
          <div className="space-y-4">
            {blockOrder.map(block => (
              <TimeBlockSection
                key={block}
                block={block}
                tarefas={tarefasHoje.filter(t => t.block === block)}
                onToggle={toggleTarefa}
              />
            ))}
          </div>

          {/* Add task floating */}
          <div className="mt-6 bg-slate-50 rounded-xl border border-dashed border-slate-200 p-4 text-center">
            <Link to="/agenda/tarefas/criar" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 text-sm mx-auto transition-colors">
              <Plus size={16} />
              Adicionar nova tarefa ao dia
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
