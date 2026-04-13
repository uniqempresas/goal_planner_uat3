import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { habitosService } from '../../../services/habitosService';
import type { Database } from '../../../lib/supabase';
import { 
  Flame, 
  Plus, 
  Trophy, 
  Calendar, 
  MoreVertical, 
  Play, 
  Pause, 
  Edit3, 
  Trash2,
  Target,
  Zap,
  TrendingUp,
  Filter,
  Sparkles,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Habito = Database['public']['Tables']['habitos']['Row'];

interface HabitStats {
  total: number;
  ativos: number;
  concluidos: number;
  pausados: number;
  streakTotal: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

const getPriorityColor = (prioridade: string) => {
  switch (prioridade) {
    case 'alta': return 'from-rose-500 to-red-600';
    case 'media': return 'from-amber-500 to-orange-600';
    case 'baixa': return 'from-emerald-500 to-teal-600';
    default: return 'from-slate-500 to-slate-600';
  }
};

const getPriorityBadge = (prioridade: string) => {
  const configs: Record<string, { bg: string; text: string; label: string }> = {
    alta: { bg: 'bg-rose-100', text: 'text-rose-700', label: 'Alta' },
    media: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Média' },
    baixa: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Baixa' },
  };
  return configs[prioridade] || configs.baixa;
};

const getStatusConfig = (status: string) => {
  const configs: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    ativa: { bg: 'bg-emerald-500', text: 'text-emerald-700', icon: Zap, label: 'Ativo' },
    pausada: { bg: 'bg-amber-500', text: 'text-amber-700', icon: Pause, label: 'Pausado' },
    concluida: { bg: 'bg-blue-500', text: 'text-blue-700', icon: CheckCircle2, label: 'Concluído' },
    expirada: { bg: 'bg-slate-500', text: 'text-slate-700', icon: Clock, label: 'Expirado' },
  };
  return configs[status] || configs.ativa;
};

const getBlocoIcon = (bloco: string | null) => {
  switch (bloco) {
    case 'one-thing': return Target;
    case 'manha': return () => <span className="text-lg">☀️</span>;
    case 'tarde': return () => <span className="text-lg">🌤️</span>;
    case 'noite': return () => <span className="text-lg">🌙</span>;
    default: return Calendar;
  }
};

export default function HabitosListPageModern() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'ativos' | 'pausados' | 'concluidos'>('todos');
  const [stats, setStats] = useState<HabitStats>({ total: 0, ativos: 0, concluidos: 0, pausados: 0, streakTotal: 0 });
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadHabitos();
      loadStats();
    }
  }, [user, filter]);

  async function loadStats() {
    if (!user) return;
    try {
      const habitosData = await habitosService.getAll(user.id);
      const streakTotal = habitosData.reduce((acc, h) => acc + (h.streak_atual || 0), 0);
      setStats({
        total: habitosData.length,
        ativos: habitosData.filter(h => h.status === 'ativa').length,
        concluidos: habitosData.filter(h => h.status === 'concluida').length,
        pausados: habitosData.filter(h => h.status === 'pausada').length,
        streakTotal
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
      loadHabitos();
      loadStats();
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
      loadHabitos();
      loadStats();
    } catch (error) {
      console.error('Erro ao pausar/continuar hábito:', error);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: 'short' 
    });
  }

  function getDiasSemanaLabel(dias: number[]) {
    if (dias.length === 7) return 'Todos os dias';
    if (dias.length === 0) return 'Sem dias definidos';
    const diasLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return dias.map(d => diasLabels[d]).join(', ');
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
      {/* Header Moderno */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-slate-200/80 sticky top-0 z-10">
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

          {/* Stats Rápidas */}
          <motion.div 
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {[
              { label: 'Total', value: stats.total, icon: Target, color: 'from-indigo-500 to-indigo-600' },
              { label: 'Streak Total', value: stats.streakTotal, icon: Flame, color: 'from-orange-500 to-red-500' },
              { label: 'Ativos', value: stats.ativos, icon: Zap, color: 'from-emerald-500 to-teal-500' },
              { label: 'Concluídos', value: stats.concluidos, icon: Trophy, color: 'from-violet-500 to-purple-600' },
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
                    <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros Modernos */}
        <motion.div 
          className="flex flex-wrap items-center gap-2 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mr-4">
            <Filter className="w-4 h-4 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">Filtrar:</span>
          </div>
          
          {(['todos', 'ativos', 'pausados', 'concluidos'] as const).map((f) => {
            const isActive = filter === f;
            const labels = { todos: 'Todos', ativos: 'Ativos', pausados: 'Pausados', concluidos: 'Concluídos' };
            const icons = { todos: Target, ativos: Zap, pausados: Pause, concluidos: Trophy };
            const Icon = icons[f];
            
            return (
              <motion.button
                key={f}
                onClick={() => setFilter(f)}
                className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className="w-4 h-4" />
                <span>{labels[f]}</span>
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                }`}>
                  {filterCounts[f]}
                </span>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Lista de Hábitos ou Estado Vazio */}
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
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {filteredHabitos.map((habito, index) => {
                const priorityBadge = getPriorityBadge(habito.prioridade);
                const statusConfig = getStatusConfig(habito.status);
                const StatusIcon = statusConfig.icon;
                const BlocoIcon = getBlocoIcon(habito.bloco);
                const hasStreak = (habito.streak_atual || 0) > 0;
                const isHotStreak = (habito.streak_atual || 0) >= 7;
                
                return (
                  <motion.div
                    key={habito.id}
                    variants={cardVariants}
                    layout
                    className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
                    whileHover={{ y: -4 }}
                  >
                    {/* Borda de Prioridade */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getPriorityColor(habito.prioridade)}`} />
                    
                    <div className="p-5">
                      {/* Header do Card */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getPriorityColor(habito.prioridade)} bg-opacity-10`}>
                            <BlocoIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                              {habito.titulo}
                            </h3>
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${priorityBadge.bg} ${priorityBadge.text}`}>
                              {priorityBadge.label}
                            </span>
                          </div>
                        </div>
                        
                        {/* Menu de Ações */}
                        <div className="relative">
                          <button
                            onClick={() => setMenuOpen(menuOpen === habito.id ? null : habito.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          <AnimatePresence>
                            {menuOpen === habito.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20"
                              >
                                <button
                                  onClick={() => {
                                    handleTogglePausar(habito);
                                    setMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  {habito.status === 'ativa' ? (
                                    <><Pause className="w-4 h-4" /> Pausar</>
                                  ) : (
                                    <><Play className="w-4 h-4" /> Continuar</>
                                  )}
                                </button>
                                <Link
                                  to={`/habitos/${habito.id}/editar`}
                                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                  onClick={() => setMenuOpen(null)}
                                >
                                  <Edit3 className="w-4 h-4" /> Editar
                                </Link>
                                <button
                                  onClick={() => {
                                    handleDelete(habito.id);
                                    setMenuOpen(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-4 h-4" /> Excluir
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                      
                      {/* Descrição */}
                      {habito.descricao && (
                        <p className="text-slate-500 text-sm mb-4 line-clamp-2">{habito.descricao}</p>
                      )}
                      
                      {/* Streak Section */}
                      <div className="flex items-center gap-4 mb-4">
                        <motion.div 
                          className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                            hasStreak 
                              ? isHotStreak 
                                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-50 text-slate-500'
                          }`}
                          animate={hasStreak ? {
                            scale: [1, 1.02, 1],
                          } : {}}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <motion.div
                            animate={hasStreak ? {
                              rotate: [0, -10, 10, 0],
                            } : {}}
                            transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                          >
                            <Flame className={`w-5 h-5 ${hasStreak && isHotStreak ? 'text-white' : ''}`} />
                          </motion.div>
                          <div>
                            <span className="text-lg font-bold">{habito.streak_atual || 0}</span>
                            <span className="text-xs ml-1 opacity-80">dias</span>
                          </div>
                        </motion.div>
                        
                        {(habito.melhor_streak || 0) > 0 && (
                          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 text-violet-700 border border-violet-200">
                            <Trophy className="w-4 h-4" />
                            <span className="text-sm font-semibold">{habito.melhor_streak}</span>
                            <span className="text-xs opacity-70">recorde</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Info Row */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{getDiasSemanaLabel(habito.dias_semana)}</span>
                        </div>
                        {habito.hora && (
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{habito.hora}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Status Badge */}
                      <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} bg-opacity-10 ${statusConfig.text}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig.label}
                        </div>
                        
                        <Link
                          to={`/habitos/${habito.id}`}
                          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group/link"
                        >
                          Ver detalhes
                          <motion.span
                            className="inline-block"
                            whileHover={{ x: 3 }}
                          >
                            →
                          </motion.span>
                        </Link>
                      </div>
                    </div>
                    
                    {/* Progress Bar Background */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
                      <motion.div 
                        className={`h-full bg-gradient-to-r ${getPriorityColor(habito.prioridade)}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(((habito.streak_atual || 0) / (habito.melhor_streak || 1)) * 100, 100)}%` }}
                        transition={{ duration: 1, delay: index * 0.1 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
