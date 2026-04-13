import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Target, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { levelConfig } from '../../data/mockData';
import { fadeInUp, staggerContainer, scaleIn } from '../metas/animations';

export function MetasAnuaisWidget() {
  const { metasAnuais } = useApp();

  if (metasAnuais.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Target size={20} className="text-violet-600" />
            <h3 className="text-slate-800 font-semibold">Metas Anuais</h3>
          </div>
          <Link 
            to="/metas/anuais" 
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition-colors"
          >
            Ver <ArrowRight size={14} />
          </Link>
        </div>
        <div className="text-center py-8">
          <Target size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm">Nenhuma Meta Anual ainda</p>
          <Link 
            to="/metas/anuais" 
            className="text-indigo-600 text-sm font-medium mt-2 inline-block hover:underline"
          >
            Criar primeira meta
          </Link>
        </div>
      </div>
    );
  }

  const cfg = levelConfig.A;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center">
            <Target size={16} className="text-violet-600" />
          </div>
          <h3 className="text-slate-800 font-semibold">Metas Anuais</h3>
        </div>
        <Link 
          to="/metas/anuais" 
          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition-colors"
        >
          Ver <ArrowRight size={14} />
        </Link>
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        className="space-y-3"
      >
        {metasAnuais.slice(0, 3).map((meta) => {
          // Mock progress - in a real app this would be calculated
          const progress = 0;

          return (
            <motion.div key={meta.id} variants={scaleIn}>
              <Link
                to={`/metas/anual/${meta.id}`}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all group"
              >
                {/* Level Badge */}
                <div 
                  className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: cfg.bgColor }}
                >
                  <span className="text-sm font-bold" style={{ color: cfg.textColor }}>
                    A
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm font-medium truncate group-hover:text-indigo-600 transition-colors">
                    {meta.titulo}
                  </p>
                  
                  {/* Progress Bar */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                        style={{ backgroundColor: cfg.color }}
                      />
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight 
                  size={14} 
                  className="text-slate-300 group-hover:text-indigo-500 transition-colors shrink-0" 
                />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}