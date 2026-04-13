import { Link } from 'react-router';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useApp } from '../../contexts/AppContext';
import { AreaCardModern, AreasOverview, AreaStatsCards, AreaEmptyState } from '../../components/areas';
import { pageTransition, fadeInUp } from '../../components/metas/animations';

export default function AreasListPage() {
  const { areas } = useApp();

  // Calculate totals
  const totalMetas = areas.reduce((acc, a) => acc + (a.metasCount || 0), 0);
  const completedMetas = areas.reduce((acc, a) => acc + (a.metasConcluidas || 0), 0);

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      className="min-h-screen pb-8"
    >
      {/* Sticky Header */}
      <motion.header 
        className="sticky top-0 z-40 bg-gradient-to-r from-indigo-500 to-violet-600 backdrop-blur-xl shadow-lg"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-white text-xl sm:text-2xl font-bold mb-1">
                Áreas de Vida
              </h1>
              <p className="text-white/80 text-sm">
                Organize suas metas pelas principais dimensões da sua vida.
              </p>
            </div>
            <Link 
              to="/areas/criar"
              className="ml-4 flex items-center gap-2 bg-white hover:bg-slate-50 text-indigo-600 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:scale-105"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Nova Área</span>
            </Link>
          </div>
        </div>
      </motion.header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6">
        {areas.length === 0 ? (
          <AreaEmptyState onCreateFirst={() => {}} />
        ) : (
          <>
            {/* Stats Cards */}
            <AreaStatsCards areas={areas} />

            {/* Overview Bar */}
            <AreasOverview 
              areas={areas} 
              totalMetas={totalMetas}
              completedMetas={completedMetas}
            />

            {/* Grid de Áreas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {areas.map((area, index) => (
                <AreaCardModern 
                  key={area.id} 
                  area={area} 
                  index={index} 
                />
              ))}

              {/* Card de Adicionar Área */}
              <Link 
                to="/areas/criar"
                className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 rounded-2xl p-5 transition-all cursor-pointer group min-h-[200px]"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center mb-3 transition-colors">
                  <Plus size={24} className="text-slate-400 group-hover:text-indigo-500 transition-colors" />
                </div>
                <span className="text-slate-500 group-hover:text-indigo-600 text-sm font-medium transition-colors">
                  Adicionar nova área
                </span>
              </Link>
            </div>
          </>
        )}
      </main>
    </motion.div>
  );
}