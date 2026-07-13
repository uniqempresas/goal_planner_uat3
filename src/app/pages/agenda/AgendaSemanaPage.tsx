import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Loader2,
  CheckCircle2,
  Target,
  Flame,
  Sparkles,
  XCircle 
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { tarefasService } from '../../../services/tarefasService';
import type { TarefaUI } from '../../../lib/mapeamento';
import { WeekDayCard } from '../../components/agenda/WeekDayCard';
import { TaskItemModern } from '../../components/agenda/TaskItemModern';
import { WeekStatsCard } from '../../components/agenda/WeekStatsCard';
import { EmptyStateAgenda } from '../../components/agenda/EmptyStateAgenda';
import { pageTransition, fadeInUp, staggerContainer } from '../../components/metas/animations';

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const diasCompletos = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

function formatDateLocal(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

export default function AgendaSemanaPage() {
  const navigate = useNavigate();
  const { user, weeklyStats } = useApp();
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDay());
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = -dayOfWeek;
    const sunday = new Date(today);
    sunday.setDate(today.getDate() + diff);
    sunday.setHours(0, 0, 0, 0);
    return sunday;
  });
  
  const [tasksByDay, setTasksByDay] = useState<Record<number, TarefaUI[]>>({});
  const [loading, setLoading] = useState(true);
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');

  const selectedDate = new Date(currentWeekStart);
  selectedDate.setDate(currentWeekStart.getDate() + selectedDay);

  const isTodayDate = () => {
    const today = new Date();
    return selectedDate.toDateString() === today.toDateString();
  };

  // Load week tasks
  useEffect(() => {
    async function loadWeekTasks() {
      if (!user) return;
      
      setLoading(true);
      const tasks: Record<number, TarefaUI[]> = {};
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(currentWeekStart);
        date.setDate(currentWeekStart.getDate() + i);
        const dateStr = formatDateLocal(date);
        
        try {
          const tarefasNormais = await tarefasService.getTarefasDoDia(user.id, dateStr);
          const instanciasRecorrentes = await tarefasService.getInstanciasRecorrentesDoDia(user.id, dateStr);
          
          const tarefasMap = new Map<string, any>();
          [...tarefasNormais, ...instanciasRecorrentes].forEach(tarefa => {
            tarefasMap.set(tarefa.id, tarefa);
          });
          const todasTarefas = Array.from(tarefasMap.values());
          
          tasks[i] = todasTarefas.map(t => ({
            id: t.id,
            metaId: t.meta_id || undefined,
            habitoId: t.habito_id || undefined,
            title: t.titulo,
            description: t.descricao || undefined,
            block: (t.bloco === 'one-thing' ? 'oneThing' : t.bloco === 'manha' ? 'manha' : t.bloco === 'tarde' ? 'tarde' : t.bloco === 'noite' ? 'noite' : 'recorrentes') as any,
            hora: t.hora || undefined,
            priority: (t.prioridade === 'alta' ? 'high' : t.prioridade === 'media' ? 'medium' : 'low') as any,
            completed: t.completed,
            missed: t.missed,
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
    const dayOfWeek = today.getDay();
    const diff = -dayOfWeek;
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

  const handleToggleTask = async (taskId: string) => {
    if (togglingTaskId === taskId) return;
    
    setTogglingTaskId(taskId);
    
    try {
      await tarefasService.toggleCompleted(taskId);
      
      setTasksByDay(prev => {
        const newTasksByDay = { ...prev };
        const dayTasks = [...(newTasksByDay[selectedDay] || [])];
        const taskIndex = dayTasks.findIndex(t => t.id === taskId);
        
        if (taskIndex !== -1) {
          dayTasks[taskIndex] = {
            ...dayTasks[taskIndex],
            completed: !dayTasks[taskIndex].completed
          };
          newTasksByDay[selectedDay] = dayTasks;
        }
        
        return newTasksByDay;
      });
    } catch (error) {
      console.error('Erro ao alternar status da tarefa:', error);
    } finally {
      setTogglingTaskId(null);
    }
  };

  const handleMarkMissed = async (taskId: string) => {
    try {
      await tarefasService.markAsMissed(taskId);
      setTasksByDay(prev => {
        const newTasksByDay = { ...prev };
        for (let i = 0; i < 7; i++) {
          const dayTasks = [...(newTasksByDay[i] || [])];
          const taskIndex = dayTasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            dayTasks[taskIndex] = { ...dayTasks[taskIndex], missed: true };
            newTasksByDay[i] = dayTasks;
            break;
          }
        }
        return newTasksByDay;
      });
    } catch (error) {
      console.error('Erro ao marcar tarefa como não executada:', error);
    }
  };

  const handleReschedule = async (taskId: string, newData: string) => {
    if (!user) return;
    try {
      const result = await tarefasService.rescheduleFromMissed(user.id, taskId, newData);
      setTasksByDay(prev => {
        const newTasksByDay = { ...prev };
        // Update original task as missed
        for (let i = 0; i < 7; i++) {
          const dayTasks = [...(newTasksByDay[i] || [])];
          const taskIndex = dayTasks.findIndex(t => t.id === taskId);
          if (taskIndex !== -1) {
            dayTasks[taskIndex] = { ...dayTasks[taskIndex], missed: true };
            newTasksByDay[i] = dayTasks;
            break;
          }
        }
        // Add new task to appropriate day
        const newDate = new Date(result.nova.data + 'T12:00:00');
        const newDayIndex = (newDate.getDay() - new Date(currentWeekStart).getDay() + 7) % 7;
        // Find correct week offset
        const weekStart = new Date(currentWeekStart);
        let targetDayIndex = -1;
        for (let i = 0; i < 7; i++) {
          const d = new Date(weekStart);
          d.setDate(weekStart.getDate() + i);
          const dStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (dStr === result.nova.data) {
            targetDayIndex = i;
            break;
          }
        }
        if (targetDayIndex >= 0) {
          const newDayTasks = [...(newTasksByDay[targetDayIndex] || [])];
          newDayTasks.push({
            id: result.nova.id,
            title: result.nova.titulo,
            description: result.nova.descricao || undefined,
            block: (result.nova.bloco === 'one-thing' ? 'oneThing' : result.nova.bloco === 'manha' ? 'manha' : result.nova.bloco === 'tarde' ? 'tarde' : result.nova.bloco === 'noite' ? 'noite' : 'recorrentes') as any,
            hora: result.nova.hora || undefined,
            priority: (result.nova.prioridade === 'alta' ? 'high' : result.nova.prioridade === 'media' ? 'medium' : 'low') as any,
            completed: false,
            missed: false,
            data: result.nova.data,
            isOneThing: result.nova.bloco === 'one-thing',
          });
          newTasksByDay[targetDayIndex] = newDayTasks;
        }
        return newTasksByDay;
      });
      setReschedulingId(null);
    } catch (error) {
      console.error('Erro ao reagendar tarefa:', error);
    }
  };

  const handleNavigateToTask = (taskId: string) => {
    navigate(`/agenda/tarefas/${taskId}`);
  };

  // Sort tasks by time (tasks with time first, sorted by time; tasks without time go to end)
  const dayTasks = (tasksByDay[selectedDay] || [])
    .sort((a, b) => {
      if (!a.hora && !b.hora) return 0;
      if (!a.hora) return 1;
      if (!b.hora) return -1;
      return a.hora.localeCompare(b.hora);
    });
  const dayTarefas = dayTasks.filter(t => !t.habitoId);
  const completedTarefas = dayTarefas.filter(t => t.completed).length;
  const totalTarefas = dayTarefas.length;
  const dayHabitos = dayTasks.filter(t => t.habitoId);
  const completedHabitos = dayHabitos.filter(t => t.completed).length;
  const totalHabitos = dayHabitos.length;

  // Week stats calculation
  const weekTotalTasks = Object.values(tasksByDay).flat();
  const weekOnlyTarefas = weekTotalTasks.filter(t => !t.habitoId);
  const weekCompleted = weekOnlyTarefas.filter(t => t.completed).length;
  const weekMissed = weekOnlyTarefas.filter(t => t.missed).length;
  const weekOneThings = weekTotalTasks.filter(t => t.isOneThing).length;
  const weekProgress = weekTotalTasks.length > 0 
    ? Math.round((weekTotalTasks.filter(t => t.completed).length / weekTotalTasks.length) * 100) 
    : 0;

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-slate-50"
    >
      {/* Sticky Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-40 bg-gradient-to-r from-indigo-500 to-violet-600 backdrop-blur-xl border-b border-white/10"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back + Title */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/agenda')}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </motion.button>
              
              <div>
                <h1 className="text-xl font-bold text-white">Agenda Semanal</h1>
                <p className="text-white/80 text-sm">{formatWeekRange()}</p>
              </div>
            </div>

            {/* Right: Navigation */}
            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToPrevWeek}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <ChevronLeft size={16} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToCurrentWeek}
                className="px-3 py-1.5 text-sm text-white font-medium bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                Esta semana
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={goToNextWeek}
                className="p-2 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
              >
                <ChevronRight size={16} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Week Navigator Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-7 gap-2 mb-6"
        >
          {diasSemana.map((dia, i) => {
            const d = new Date(currentWeekStart);
            d.setDate(currentWeekStart.getDate() + i);
            const isSelected = i === selectedDay;
            const today = new Date();
            const isTodayDate = d.toDateString() === today.toDateString();
            const dayTasksData = tasksByDay[i] || [];
            
            return (
              <WeekDayCard
                key={i}
                dayName={dia}
                dayNumber={d.getDate()}
                date={d}
                isSelected={isSelected}
                isToday={isTodayDate}
                completedTasks={dayTasksData.filter(t => t.completed).length}
                totalTasks={dayTasksData.length}
                hasOneThing={dayTasksData.some(t => t.isOneThing)}
                onClick={() => setSelectedDay(i)}
              />
            );
          })}
        </motion.div>

        {/* Day Detail + Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Day Detail Card */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              {/* Day Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">
                    {diasCompletos[selectedDay]}, {selectedDate.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {completedTarefas}/{totalTarefas} tarefas concluídas
                  </p>
                </div>
                {dayTasks.find(t => t.isOneThing) && (
                  <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 max-w-xs">
                    <Sparkles size={12} className="text-amber-500 fill-amber-400" />
                    <span className="text-amber-700 text-xs truncate">
                      {dayTasks.find(t => t.isOneThing)?.title}
                    </span>
                  </div>
                )}
              </div>

              {/* Tasks List */}
              <div className="p-3">
                {loading ? (
                  <div className="text-center py-10">
                    <Loader2 size={24} className="text-indigo-500 animate-spin mx-auto mb-2" />
                    <p className="text-slate-400 text-sm">Carregando tarefas...</p>
                  </div>
                ) : dayTasks.length > 0 ? (
                  <AnimatePresence mode="popLayout">
                    <div className="space-y-1">
                      {dayTasks.map((task, index) => (
                        <motion.div
                          key={task.id}
                          variants={fadeInUp}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: index * 0.05 }}
                        >
                          <TaskItemModern
                            task={task}
                            onToggle={handleToggleTask}
                            isToggling={togglingTaskId === task.id}
                            onNavigate={handleNavigateToTask}
                            onMarkMissed={handleMarkMissed}
                            onReschedule={handleReschedule}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </AnimatePresence>
                ) : (
                  <EmptyStateAgenda
                    date={selectedDate}
                    dayName={diasCompletos[selectedDay]}
                    onCreateTask={() => navigate(`/agenda/tarefas/criar?data=${formatDateLocal(selectedDate)}`)}
                  />
                )}
                
                {/* Add Task Button */}
                <Link 
                  to={`/agenda/tarefas/criar?data=${formatDateLocal(selectedDate)}`}
                  className="flex items-center gap-2 p-3 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-all text-sm mt-3"
                >
                  <Plus size={16} />
                  Adicionar nova tarefa
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Week Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <WeekStatsCard
              icon={CheckCircle2}
              value={weekCompleted}
              label="Tarefas concluídas"
              type="success"
              delay={0}
            />
            <WeekStatsCard
              icon={Sparkles}
              value={weekOneThings}
              label="ONE Things"
              type="oneThing"
              delay={1}
            />
            <WeekStatsCard
              icon={XCircle}
              value={weekMissed}
              label="Não executadas"
              type="missed"
              delay={2}
            />
            <WeekStatsCard
              icon={Target}
              value={`${weekProgress}%`}
              label="Taxa de conclusão"
              type="default"
              delay={3}
            />
          </motion.div>
        </div>

        {/* Gamification Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl text-white"
        >
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-sm">
                <span className="font-bold">{weeklyStats.sequenciaDias}</span> dias de sequência
              </span>
            </div>
            <div className="h-4 w-px bg-white/20 hidden sm:block" />
            <div className="hidden sm:flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-sm">
                <span className="font-bold">{weeklyStats.produtividade}</span>% produtividade
              </span>
            </div>
          </div>
          <div className="text-sm text-white/60">
            Continue focando em suas tarefas ONE Thing!
          </div>
        </motion.div>
      </main>

      {/* FAB for mobile */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 sm:hidden z-50"
      >
        <Link
          to={`/agenda/tarefas/criar?data=${formatDateLocal(selectedDate)}`}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
        >
          <Plus size={24} />
        </Link>
      </motion.div>
    </motion.div>
  );
}