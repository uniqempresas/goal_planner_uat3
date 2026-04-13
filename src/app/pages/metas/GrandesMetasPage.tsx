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
  Flame,
  Mountain,
  Star
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import type { Meta } from '../../../services/metasService';
import { MetaCardModern } from '../../components/metas/MetaCardModern';
import { StatsCard } from '../../components/metas/StatsCard';
import { FocusingQuestionCard } from '../../components/metas/FocusingQuestionCard';
import { EmptyStateModern } from '../../components/metas/EmptyStateModern';
import { pageTransition, fadeInUp, staggerContainer } from '../../components/metas/animations';

// Level configuration for Grande Meta
const levelConfig = { 
  color: '#4169E1', 
  bgColor: '#dbeafe', 
  textColor: '#1e40af', 
  gradient: 'from-blue-600 to-indigo-700', 
  label: 'Grande Meta', 
  icon: '🏔️',
  description: '3 Anos',
  levelPath: 'grandes'
};

export default function GrandesMetasPage() {
  const navigate = useNavigate();
  const { grandesMetas, weeklyStats } = useApp();
  const [metasList, setMetasList] = useState<Meta[]>(grandesMetas);
  const [filterStatus, setFilterStatus] = useState<'all' | 'ativa' | 'concluida'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showFilters, setShowFilters] = useState(false);

  // Update local state when prop changes
  useEffect(() => {
    setMetasList(grandesMetas);
  }, [grandesMetas]);

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
    const oneThings = metasList.filter(m => m.one_thing).length;
    const progressoMedio = total > 0 
      ? Math.round(metasList.reduce((acc, m) => acc + (m.status === 'concluida' ? 100 : 35), 0) / total)
      : 0;

    return { total, concluidas, ativas, oneThings, progressoMedio };
  }, [metasList]);

  const handleDelete = (id: string) => {
    setMetasList(prev => prev.filter(m => m.id !== id));
  };

  const focusingQuestion = "Qual é a ÚNICA coisa que posso fazer nos próximos 3 anos, de tal forma que minha vida se transforme completamente?";

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
                onClick={() => navigate('/metas')}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
              >
                <ChevronLeft size={20} />
              </motion.button>
              
              <div className="hidden sm:block">
                <div className="flex items-center gap-2">
                  <Mountain className="w-6 h-6 text-blue-600" />
                  <h1 className="text-xl font-bold text-slate-800">Grandes Metas</h1>
                  <span 
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ backgroundColor: levelConfig.bgColor, color: levelConfig.textColor }}
                  >
                    {levelConfig.description}
                  </span>
                </div>
                <p className="text-slate-500 text-sm ml-8">Sua visão de longo prazo. Onde você quer estar em 3 anos?</p>
              </div>

              {/* Mobile title */}
              <div className="sm:hidden">
                <h1 className="text-lg font-bold text-slate-800">Grandes Metas</h1>
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
                className={`p-2 rounded-xl transition-colors ${showFilters ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                <Filter size={18} />
              </motion.button>

              {/* Create button */}
              <Link
                to="/metas/grandes/criar"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-medium transition-all hover:shadow-lg hover:scale-105"
                style={{ backgroundColor: levelConfig.color }}
              >
                <Plus size={18} />
                <span className="hidden sm:inline">Nova Grande Meta</span>
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
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6"
        >
          <StatsCard
            icon={Target}
            value={stats.total}
            label="Total de Metas"
            color={levelConfig.color}
            bgColor={levelConfig.bgColor}
            delay={0}
          />
          <StatsCard
            icon={TrendingUp}
            value={`${stats.progressoMedio}%`}
            label="Progresso Médio"
            color={levelConfig.color}
            bgColor={levelConfig.bgColor}
            delay={0.1}
          />
          <StatsCard
            icon={CheckCircle2}
            value={stats.ativas}
            label="Metas Ativas"
            color="#10b981"
            bgColor="#d1fae5"
            delay={0.2}
          />
          <StatsCard
            icon={Star}
            value={stats.oneThings}
            label="ONE Things"
            color="#f59e0b"
            bgColor="#fef3c7"
            delay={0.3}
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
            label={levelConfig.label}
            gradient={levelConfig.gradient}
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
            Grandes metas constroem grandes vidas!
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
                  title="Nenhuma Grande Meta criada"
                  description="Crie sua primeira Grande Meta (3 anos) para começar a construir sua visão de longo prazo. Lembre-se da Focusing Question!"
                  actionLabel="Criar Grande Meta"
                  actionHref="/metas/grandes/criar"
                  color={levelConfig.color}
                  bgColor={levelConfig.bgColor}
                />
              </motion.div>
            ) : (
              filteredMetas.map((meta, index) => (
                <MetaCardModern
                  key={meta.id}
                  meta={meta}
                  level="grande"
                  onDelete={handleDelete}
                  color={levelConfig.color}
                  bgColor={levelConfig.bgColor}
                  textColor={levelConfig.textColor}
                  levelPath={levelConfig.levelPath}
                  levelLabel={levelConfig.label}
                  index={index}
                />
              ))
            )}
          </AnimatePresence>
        </motion.div>

        {/* Empty hint */}
        <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
          <p className="text-slate-400 text-sm">
            Lembre-se: você não precisa de muitas grandes metas. Foque nas que realmente transformarão sua vida.
          </p>
        </div>
      </main>

      {/* Floating Action Button (mobile) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring' }}
        className="fixed bottom-6 right-6 sm:hidden z-50"
      >
        <Link
          to="/metas/grandes/criar"
          className="flex items-center justify-center w-14 h-14 rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
          style={{ backgroundColor: levelConfig.color }}
        >
          <Plus size={24} />
        </Link>
      </motion.div>
    </motion.div>
  );
}
