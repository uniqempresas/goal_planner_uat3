import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, CheckCircle2, Circle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const diasCompletos = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];

// Generate mock week data
const mockWeekData = diasSemana.map((_, i) => ({
  day: i,
  tasks: Math.floor(Math.random() * 8) + 2,
  completed: Math.floor(Math.random() * 6),
  hasOneThing: i < 5,
  oneThing: i < 5 ? ['Escrever artigo RSC', 'Reunião técnica + artigo', 'Code review + blog', 'Treino + artigo DDD', 'Planejamento semanal'][i] : null,
}));

export default function AgendaSemanaPage() {
  const [selectedDay, setSelectedDay] = useState(4); // Sexta (index 4 = today)
  const { tarefasHoje, toggleTarefa } = useApp();

  const weekStart = new Date('2025-03-24');
  const selectedDate = new Date(weekStart);
  selectedDate.setDate(weekStart.getDate() + selectedDay);

  const dayTasks = selectedDay === 4 ? tarefasHoje : [];
  const dayData = mockWeekData[selectedDay];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-800 mb-1">Agenda Semanal</h1>
          <p className="text-slate-500 text-sm">24 — 30 de Março de 2025</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
            <ChevronLeft size={16} className="text-slate-500" />
          </button>
          <button className="px-3 py-1.5 text-sm text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition-colors cursor-pointer">
            Esta semana
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer">
            <ChevronRight size={16} className="text-slate-500" />
          </button>
        </div>
      </div>

      {/* Week Overview */}
      <div className="grid grid-cols-7 gap-2 mb-6">
        {diasSemana.map((dia, i) => {
          const d = new Date(weekStart);
          d.setDate(weekStart.getDate() + i);
          const isToday = i === 4;
          const isSelected = i === selectedDay;
          const data = mockWeekData[i];
          const pct = data.tasks > 0 ? Math.round((data.completed / data.tasks) * 100) : 0;

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl border-2 transition-all cursor-pointer ${
                isSelected
                  ? 'border-indigo-500 bg-indigo-50'
                  : isToday
                  ? 'border-indigo-200 bg-white'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <span className={`text-xs ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>{dia}</span>
              <span className={`text-sm font-semibold ${isSelected ? 'text-indigo-800' : isToday ? 'text-indigo-600' : 'text-slate-700'}`}>
                {d.getDate()}
              </span>
              {data.hasOneThing && (
                <Star size={10} className="text-amber-500 fill-amber-400" />
              )}
              <div className="w-full">
                <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400 mt-0.5 block">{data.completed}/{data.tasks}</span>
              </div>
              {isToday && (
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
            <p className="text-slate-400 text-sm">{dayData.completed}/{dayData.tasks} tarefas concluídas</p>
          </div>
          {dayData.oneThing && (
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 max-w-xs">
              <Star size={12} className="text-amber-500 fill-amber-400 shrink-0" />
              <span className="text-amber-700 text-xs truncate">{dayData.oneThing}</span>
            </div>
          )}
        </div>

        <div className="p-5">
          {dayTasks.length > 0 ? (
            <div className="space-y-2">
              {dayTasks.map(task => (
                <div key={task.id} className={`flex items-start gap-3 p-2.5 rounded-lg transition-all ${task.completed ? 'opacity-60' : 'hover:bg-slate-50'}`}>
                  <button onClick={() => toggleTarefa(task.id)} className="mt-0.5 cursor-pointer">
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
                  <span className="text-xs text-slate-400 shrink-0 capitalize">{task.block === 'oneThing' ? 'ONE Thing' : task.block}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <p className="text-sm">
                {selectedDay < 4 ? 'Dia concluído' : selectedDay === 4 ? 'Carregando tarefas de hoje...' : 'Nenhuma tarefa planejada ainda'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Week Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">
            {mockWeekData.reduce((s, d) => s + d.completed, 0)}
          </div>
          <div className="text-slate-500 text-xs mt-1">Tarefas concluídas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">
            {mockWeekData.filter(d => d.hasOneThing).length}
          </div>
          <div className="text-slate-500 text-xs mt-1">ONE Things definidas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-2xl font-bold text-emerald-600">
            {Math.round(mockWeekData.reduce((s, d) => s + (d.tasks > 0 ? d.completed / d.tasks : 0), 0) / 7 * 100)}%
          </div>
          <div className="text-slate-500 text-xs mt-1">Taxa de conclusão</div>
        </div>
      </div>
    </div>
  );
}
