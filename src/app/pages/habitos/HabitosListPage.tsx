import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { habitosService } from '../../../services/habitosService';
import type { Database } from '../../../lib/supabase';
import { HabitCard } from '../../components/habitos/HabitCard';
import { FilterTabs } from '../../components/habitos/FilterTabs';
import { CelebrationModal } from '../../components/habitos/CelebrationModal';
import { 
  Plus, 
  Sparkles,
  Target,
  Flame,
  Zap,
  Trophy,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Habito = Database['public']['Tables']['habitos']['Row'];
type FilterType = 'todos' | 'ativos' | 'pausados' | 'concluidos';

interface HabitStats {
  total: number;
  ativos: number;
  concluidos: number;
  pausados: number;
  streakTotal: number;
  streakAverage: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

export default function HabitosListPage() {
  const { user } = useApp();
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterType>('todos');
  const [stats, setStats] = useState<HabitStats>({ 
    total: 0, ativos: 0, concluidos: 0, pausados: 0, streakTotal: 0, streakAverage: 0 
  });
  const [celebration, setCelebration] = useState<{
    isOpen: boolean;
    streak: number;
    habitName: string;
    isRecord: boolean;
  }>({ isOpen: false, streak: 0, habitName: '', isRecord: false });

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadHabitos();
    }
  }, [user, filter]);

  async function loadData() {
    await Promise.all([loadHabitos(), loadStats()]);
  }

  async function loadStats() {
    if (!user) return;
    try {
      const habitosData = await habitosService.getAll(user.id);
      const streakTotal = habitosData.reduce((acc, h) => acc + (h.streak_atual || 0), 0);
      const activeHabits = habitosData.filter(h => h.status === 'ativa');
      const streakAverage = activeHabits.length > 0 
        ? Math.round(streakTotal / activeHabits.length) 
        : 0;
      
      setStats({
        total: habitosData.length,
        ativos: activeHabits.length,
        concluidos: habitosData.filter(h => h.status === 'concluida').length,
        pausados: habitosData.filter(h => h.status === 'pausada').length,
        streakTotal,
        streakAverage
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  }

  async function loadHabitos() {
    if (!user) return;
    
    try {
      setLoading(true);
      let habitosData: Habito[];
      
      switch (filter) {
        case 'ativos':
          habitosData = await habitosService.getAtivos(user.id);
          break;
        default:
          habitosData = await habitosService.getAll(user.id);
      }
      
      setHabitos(habitosData);
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este hábito?')) return;
    
    try {
      await habitosService.delete(id);
      await Promise.all([loadHabitos(), loadStats()]);
    } catch (error) {
      console.error('Erro ao excluir hábito:', error);
    }
  }

  async function handleTogglePausar(habito: Habito) {
    try {
      if (habito.status === 'ativa') {
        await habitosService.pausar(habito.id);
      } else {
        await habitosService.continuar(habito.id);
      }
      await Promise.all([loadHabitos(), loadStats()]);
    } catch (error) {
      console.error('Erro ao pausar/continuar hábito:', error);
    }
  }

  // Mock function to demonstrate celebration - integrate with real completion
  function handleCompleteHabit(habito: Habito) {
    const newStreak = (habito.streak_atual || 0) + 1;
    const isRecord = newStreak > (habito.melhor_streak || 0);
    
    setCelebration({
      isOpen: true,
      streak: newStreak,
      habitName: habito.titulo,
      isRecord
    });
  }

  const filteredHabitos = habitos.filter(h => {
    if (filter === 'todos') return true;
    if (filter === 'ativos') return h.status === 'ativa';
    if (filter === 'pausados') return h.status === 'pausada';
    if (filter === 'concluidos') return h.status === 'concluida';
    return true;
  });

  const filterCounts = {
    todos: stats.total,
    ativos: stats.ativos,
    pausados: stats.pausados,
    concluidos: stats.concluidos
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <motion.div 
          className="flex flex-col items-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="relative">
            <motion.div 
              className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-6 h-6 text-indigo-600" />
            </motion.div>
          </div>
          <p className="text-slate-600 font-medium">Carregando seus hábitos...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sm:sticky sm:top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <motion.h1 
                className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Meus Hábitos
              </motion.h1>
              <motion.p 
                className="text-slate-500 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Construa rotinas que transformam sua vida
              </motion.p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to="/habitos/criar"
                className="group inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl hover:shadow-indigo-500/30 transition-all duration-300 hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Novo Hábito</span>
              </Link>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { label: 'Total', value: stats.total, icon: Target, color: 'from-indigo-500 to-indigo-600', suffix: '' },
              { label: 'Streak Médio', value: stats.streakAverage, icon: TrendingUp, color: 'from-cyan-500 to-blue-500', suffix: '' },
              { label: 'Streak Total', value: stats.streakTotal, icon: Flame, color: 'from-orange-500 to-red-500', suffix: '' },
              { label: 'Ativos', value: stats.ativos, icon: Zap, color: 'from-emerald-500 to-teal-500', suffix: '' },
              { label: 'Concluídos', value: stats.concluidos, icon: Trophy, color: 'from-violet-500 to-purple-600', suffix: '' },
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                className="relative overflow-hidden bg-white rounded-xl p-4 border border-slate-200 shadow-sm"
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                transition={{ duration: 0.2 }}
              >
                <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${stat.color} opacity-10 rounded-full -translate-y-1/2 translate-x-1/2`} />
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-800">{stat.value}{stat.suffix}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <FilterTabs 
            activeFilter={filter}
            onFilterChange={setFilter}
            counts={filterCounts}
          />
        </motion.div>

        {/* Habits List or Empty State */}
        {filteredHabitos.length === 0 ? (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative inline-block mb-6">
              <motion.div 
                className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-100 to-violet-100 rounded-full flex items-center justify-center"
                animate={{ 
                  scale: [1, 1.05, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sparkles className="w-14 h-14 text-indigo-500" />
              </motion.div>
              <motion.div
                className="absolute -top-2 -right-2 w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <span className="text-xl">✨</span>
              </motion.div>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {filter === 'todos' ? 'Comece sua jornada de hábitos!' : `Nenhum hábito ${filter}`}
            </h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              {filter === 'todos' 
                ? 'Hábitos pequenos levam a grandes conquistas. Crie seu primeiro hábito e comece a transformar sua vida hoje.'
                : 'Não há hábitos nesta categoria no momento.'
              }
            </p>
            
            {filter === 'todos' && (
              <div className="space-y-4">
                <Link
                  to="/habitos/criar"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5" />
                  Criar Meu Primeiro Hábito
                </Link>
                
                <div className="pt-6">
                  <p className="text-sm text-slate-400 mb-3">Sugestões populares:</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['🧘 Meditar 10min', '💧 Beber 2L de água', '📚 Ler 20 páginas', '🏃‍♂️ Caminhar 30min'].map((suggestion) => (
                      <span 
                        key={suggestion}
                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-full text-sm text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer"
                      >
                        {suggestion}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {filteredHabitos.map((habito, index) => (
                <HabitCard
                  key={habito.id}
                  habito={habito}
                  index={index}
                  onTogglePausar={handleTogglePausar}
                  onDelete={handleDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={celebration.isOpen}
        onClose={() => setCelebration(prev => ({ ...prev, isOpen: false }))}
        streak={celebration.streak}
        habitName={celebration.habitName}
        isRecord={celebration.isRecord}
      />
    </div>
  );
}
