import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, CheckCircle2, Circle, Plus } from 'lucide-react';
import { Link } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { tarefasService } from '../../../services/tarefasService';
import type { TarefaUI } from '../../../lib/mapeamento';

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const diasCompletos = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export default function AgendaSemanaPage() {
  const { user } = useApp();
  const [selectedDay, setSelectedDay] = useState(0);
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const diff = -dayOfWeek; // Volta para o domingo
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + diff);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  });
  
  const [tasksByDay, setTasksByDay] = useState<Record<number, TarefaUI[]>>({});
  const [loading, setLoading] = useState(true);

  const selectedDate = new Date(currentWeekStart);
  selectedDate.setDate(currentWeekStart.getDate() + selectedDay);

  const isToday = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  useEffect(() => {
    async function loadWeekTasks() {
      if (!user) return;
      
      setLoading(true);
      const tasks: Record<number, TarefaUI[]> = {};
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        try {
          // Carregar tarefas normais
          const tarefasNormais = await tarefasService.getTarefasDoDia(user.id, dateStr);
          
          // Carregar instâncias de recorrentes
          const instanciasRecorrentes = await tarefasService.getInstanciasRecorrentesDoDia(user.id, dateStr);
          
          // Combinar e remover duplicatas
          const tarefasMap = new Map<string, any>();
          [...tarefasNormais, ...instanciasRecorrentes].forEach(tarefa => {
            tarefasMap.set(tarefa.id, tarefa);
          });
          const todasTarefas = Array.from(tarefasMap.values());
          
          // Map to UI format
          tasks[i] = todasTarefas.map(t => ({
            id: t.id,
            metaId: t.meta_id || undefined,
            title: t.titulo,
            description: t.descricao || undefined,
            block: (t.bloco === 'one-thing' ? 'oneThing' : t.bloco === 'manha' ? 'manha' : t.bloco === 'tarde' ? 'tarde' : t.bloco === 'noite' ? 'noite' : 'recorrentes') as any,
            hora: t.hora || undefined,
            priority: (t.prioridade === 'alta' ? 'high' : t.prioridade === 'media' ? 'medium' : 'low') as any,
            completed: t.completed,
            data: t.data,
            isOneThing: t.bloco === 'one-thing',
            notes: t.descricao || undefined,
          }));
        } catch (e) {
          tasks[i] = [];
        }
      }
      
      setTasksByDay(tasks);
      setLoading(false);
    }
    
    loadWeekTasks();
  }, [currentWeekStart, user]);

  const goToPrevWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newStart);
  };

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart);
    newStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newStart);
  };

  const goToCurrentWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const diff = -dayOfWeek; // Volta para o domingo
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + diff);
    sunday.setHours(0, 0, 0, 0);
    setCurrentWeekStart(sunday);
    setSelectedDay(dayOfWeek);
  };

  const formatWeekRange = () => {
    const end = new Date(currentWeekStart);
    end.setDate(currentWeekStart.getDate() + 6);
    
    const startMonth = currentWeekStart.toLocaleDateString('pt-BR', { month: 'short' });
    const endMonth = end.toLocaleDateString('pt-BR', { month: 'short' });
    const startDay = currentWeekStart.getDate();
    const endDay = end.getDate();
    const year = currentWeekStart.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startDay} — ${endDay} de ${startMonth} de ${year}`;
    }
    return `${startDay} de ${startMonth} — ${endDay} de ${endMonth} de ${year}`;
  };

  const dayTasks = tasksByDay[selectedDay] || [];
  const completedCount = dayTasks.filter(t => t.completed).length;
  const totalCount = dayTasks.length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-800 mb-1">Agenda Semanal</h1>
          <p className="text-slate-500 text-sm">{formatWeekRange()}</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={goToPrevWeek}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} className="text-slate-500" />
          </button>
          <button 
            onClick={goToCurrentWeek}
            className="px-3 py-1.5 text-sm text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer"
          >
            Esta semana
          </button>
          <button 
            onClick={goToNextWeek}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <ChevronRight size={16} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* Week Overview */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {diasSemana.map((dia, i) => {
          const d = new Date(currentWeekStart);
          d.setDate(currentWeekStart.getDate() + i);
          const isSelected = i === selectedDay;
          const today = new Date();
          const isTodayDate = d.toDateString() === today.toDateString();
          const dayTasksData = tasksByDay[i] || [];
          const pct = dayTasksData.length > 0 
            ? Math.round((dayTasksData.filter(t => t.completed).length / dayTasksData.length) * 100) 
            : 0;

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : isTodayDate
                  ? 'border-indigo-200 bg-white'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className={`text-xs ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>{dia}</span>
              <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-800' : isTodayDate ? 'text-indigo-600' : 'text-slate-700'}`}>
                {d.getDate()}
              </span>
              {dayTasksData.some(t => t.isOneThing) && (
                <Star size={10} className="text-amber-500 fill-amber-400" />
              )}
              <div className="w-full">
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 mt-0.5 block">{dayTasksData.filter(t => t.completed).length}/{dayTasksData.length}</span>
              </div>
              {isTodayDate && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Selected Day Detail */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div>
            <h3 className="text-slate-800">{diasCompletos[selectedDay]}, {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}</h3>
            <p className="text-slate-400 text-sm">{completedCount}/{totalCount} tarefas concluídas</p>
          </div>
          {dayTasks.find(t => t.isOneThing) && (
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 max-w-xs">
              <Star size={12} className="text-amber-500 fill-amber-400 shrink-0" />
              <span className="text-amber-700 text-xs truncate">{dayTasks.find(t => t.isOneThing)?.title}</span>
            </div>
          )}
        </div>

        <div className="p-5">
          {loading ? (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm">Carregando tarefas...</p>
            </div>
          ) : dayTasks.length > 0 ? (
            <div className="space-y-2">
              {dayTasks.map(task => (
                <Link
                  key={task.id}
                  to={`/agenda/tarefas/${task.id}`}
                  className={`flex items-start gap-3 p-2.5 rounded-lg transition-all hover:bg-slate-50 block`}
                >
                  <button 
                    // eslint-disable-next-line no-unused-vars
                    onClick={(e) => { e.preventDefault(); /* TODO: toggle from detail */ }}
                    className="mt-0.5 cursor-pointer"
                  >
                    {task.completed
                      ? <CheckCircle2 size={18} className="text-emerald-500" />
                      : <Circle size={18} className="text-slate-300" />
                    }
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'} ${task.isOneThing ? 'font-medium' : ''}`}>
                      {task.isOneThing && <Star size={12} className="inline text-amber-500 fill-amber-400 mr-1" />}
                      {task.title}
                    </p>
                    {task.hora && <span className="text-xs text-slate-400">{task.hora}</span>}
                  </div>
                  <span className="text-xs text-slate-400 shrink-0 capitalize">
                    {task.block === 'oneThing' ? 'ONE Thing' : task.block}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-slate-400 text-sm mb-4">
                {isToday() 
                  ? 'Nenhuma tarefa para hoje' 
                  : `Nenhuma tarefa planejada para ${diasCompletos[selectedDay].toLowerCase()}`
                }
              </p>
              <Link 
                to={`/agenda/tarefas/criar?data=${selectedDate.toISOString().split('T')[0]}&origem=semana`}
                className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm"
              >
                <Plus size={16} />
                Adicionar tarefa
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Week Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {Object.values(tasksByDay).flat().filter(t => t.completed).length}
          </div>
          <div className="text-slate-500 text-xs mt-1">Tarefas concluídas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {Object.values(tasksByDay).flat().filter(t => t.isOneThing).length}
          </div>
          <div className="text-slate-500 text-xs mt-1">ONE Things definidas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {(() => {
              const total = Object.values(tasksByDay).flat();
              const completed = total.filter(t => t.completed).length;
              return total.length > 0 ? Math.round((completed / total.length) * 100) : 0;
            })()}%
          </div>
          <div className="text-slate-500 text-xs mt-1">Taxa de conclusão</div>
        </div>
      </div>
    </div>
  );
}
