import { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ArrowRight, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Filter,
  Sparkles,
  ChevronLeft,
  LayoutGrid,
  List,
  Flame
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import type { Meta, MetaNivel } from '../../../services/metasService';
import { MetaCardModern } from '../../components/metas/MetaCardModern';
import { StatsCard } from '../../components/metas/StatsCard';
import { FocusingQuestionCard } from '../../components/metas/FocusingQuestionCard';
import { EmptyStateModern } from '../../components/metas/EmptyStateModern';
import { pageTransition, fadeInUp, staggerContainer } from '../../components/metas/animations';

// Level configurations
const levelConfigs: Record<string, { 
  color: string; 
  bgColor: string; 
  textColor: string; 
  gradient: string; 
  label: string; 
  icon: string;
  description: string;
  levelPath: string;
}> = {
  anual: { 
    color: '#6366f1', 
    bgColor: '#e0e7ff', 
    textColor: '#4338ca', 
    gradient: 'from-indigo-500 to-violet-600', 
    label: 'Meta Anual', 
    icon: '📅',
    description: 'Anual',
    levelPath: 'anual'
  },
  mensal: { 
    color: '#10b981', 
    bgColor: '#d1fae5', 
    textColor: '#047857', 
    gradient: 'from-emerald-500 to-teal-600', 
    label: 'Meta Mensal', 
    icon: '🗓️',
    description: 'Mensal',
    levelPath: 'mensal'
  },
  semanal: { 
    color: '#f59e0b', 
    bgColor: '#fef3c7', 
    textColor: '#b45309', 
    gradient: 'from-amber-500 to-orange-600', 
    label: 'Meta Semanal', 
    icon: '📆',
    description: 'Semanal',
    levelPath: 'semanal'
  },
  diaria: { 
    color: '#f43f5e', 
    bgColor: '#ffe4e6', 
    textColor: '#be123c', 
    gradient: 'from-rose-500 to-pink-600', 
    label: 'Meta Diária', 
    icon: '☀️',
    description: 'Diária',
    levelPath: 'diaria'
  },
};

// Level letter mapping
const levelLetters: Record<string, MetaNivel> = {
  anual: 'anual',
  mensal: 'mensal',
  semanal: 'semanal',
  diaria: 'diaria',
};

interface MetasListPageModernProps {
  level: 'anual' | 'mensal' | 'semanal' | 'diaria';
  metas: Meta[];
  createPath: string;
  title: string;
  subtitle: string;
  focusingQuestion: string;
}

export function MetasListPageModern({ 
  level, 
  metas, 
  createPath, 
  title, 
  subtitle, 
  focusingQuestion 
}: MetasListPageModernProps) {
  const navigate = useNavigate();
  const { weeklyStats } = useApp();
  const [metasList, setMetasList] = useState<Meta[]>(metas);
  const [filterStatus, setFilterStatus] = useState<'all' | 'ativa' | 'concluida'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setMetasList(metas);
  }, [metas]);

  const config = levelConfigs[level];
  const levelNivel = levelLetters[level];

  // Filter metas
  const filteredMetas = useMemo(() => {
    if (filterStatus === 'all') return metasList;
    return metasList.filter(meta => meta.status === filterStatus);
  }, [metasList, filterStatus]);

  // Stats calculation
  const stats = useMemo(() => {
    const total = metasList.length;
    const concluidas = metasList.filter(m => m.status === 'concluida').length;
    const ativas = metasList.filter(m => m.status === 'ativa').length;
    const progressoMedio = total > 0 
      ? Math.round(metasList.reduce((acc, m) => acc + (m.status === 'concluida' ? 100 : 35), 0) / total)
      : 0;

    return { total, concluidas, ativas, progressoMedio };
  }, [metasList]);

  const handleDelete = (id: string) => {
    setMetasList(prev => prev.filter(m => m.id !== id));
  };

  const getBackPath = () => {
    switch (level) {
      case 'anual': return '/metas';
      case 'mensal': return '/metas/anuais';
      case 'semanal': return '/metas/mensais';
      case 'diaria': return '/metas/semanais';
      default: return '/metas';
    }
  };

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
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Left: Back button + Title */}
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(getBackPath())}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </motion.button>
              
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{config.icon}</span>
                  <h1 className="text-xl font-bold text-slate-800">{title}</h1>
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: config.bgColor, color: config.textColor }}
                  >
                    {config.description}
                  </span>
                </div>
                <p className="text-slate-500 text-sm ml-10">{subtitle}</p>
              </div>

              {/* Mobile title */}
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-slate-800">{title}</h1>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="hidden sm:flex items-center bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                >
                  <List size={16} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                >
                  <LayoutGrid size={16} />
                </button>
              </div>

              {/* Filter button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <Filter size={18} />
              </motion.button>

              {/* Create button */}
              <Link
                to={createPath}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:scale-105"
                style={{ backgroundColor: config.color }}
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Nova {config.label.split(' ')[1]}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Filter bar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-100 overflow-hidden"
            >
              <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-500 mr-2">Filtrar por:</span>
                  {(['all', 'ativa', 'concluida'] as const).map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        filterStatus === status
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {status === 'all' ? 'Todas' : status === 'ativa' ? 'Ativas' : 'Concluídas'}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          <StatsCard
            icon={Target}
            value={stats.total}
            label="Total de Metas"
            color={config.color}
            bgColor={config.bgColor}
            delay={0}
          />
          <StatsCard
            icon={TrendingUp}
            value={`${stats.progressoMedio}%`}
            label="Progresso Médio"
            color={config.color}
            bgColor={config.bgColor}
            delay={0.1}
          />
          <StatsCard
            icon={CheckCircle2}
            value={stats.concluidas}
            label="Metas Concluídas"
            color="#10b981"
            bgColor="#d1fae5"
            delay={0.2}
          />
        </motion.div>

        {/* Focusing Question Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <FocusingQuestionCard
            question={focusingQuestion}
            label={config.label}
            gradient={config.gradient}
            delay={0}
          />
        </motion.div>

        {/* Gamification Footer Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl text-white"
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
                <span className="font-bold">{weeklyStats.produtividade}%</span> produtividade
              </span>
            </div>
          </div>
          <div className="text-sm text-white/60">
            Continue focando em suas metas ONE Thing!
          </div>
        </motion.div>

        {/* Metas List */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4' : 'space-y-3'}
        >
          <AnimatePresence mode="popLayout">
            {filteredMetas.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="md:col-span-2"
              >
                <EmptyStateModern
                  title={`Nenhuma ${config.label} criada`}
                  description={`Crie sua primeira ${config.label.toLowerCase()} para começar a acompanhar seu progresso. Lembre-se da Focusing Question!`}
                  actionLabel={`Criar ${config.label}`}
                  actionHref={createPath}
                  color={config.color}
                  bgColor={config.bgColor}
                />
              </motion.div>
            ) : (
              filteredMetas.map((meta, index) => (
                <MetaCardModern
                  key={meta.id}
                  meta={meta}
                  level={levelNivel}
                  onDelete={handleDelete}
                  color={config.color}
                  bgColor={config.bgColor}
                  textColor={config.textColor}
                  levelPath={config.levelPath}
                  levelLabel={config.label}
                  index={index}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Floating Action Button (mobile) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 sm:hidden z-50"
      >
        <Link
          to={createPath}
          className="flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: config.color }}
        >
          <Plus size={24} />
        </Link>
      </motion.div>
    </motion.div>
  );
}
