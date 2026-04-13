import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Mountain, ArrowRight, Star } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { levelConfig } from '../../data/mockData';
import { CircularProgress } from '../agenda/CircularProgress';
import { fadeInUp, staggerContainer, scaleIn } from '../metas/animations';

export function GrandesMetasWidget() {
  const { grandesMetas, areas } = useApp();

  if (grandesMetas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Mountain size={20} className="text-indigo-600" />
            <h3 className="text-slate-800 font-semibold">Grandes Metas</h3>
            <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
              3 anos
            </span>
          </div>
          <Link 
            to="/metas/grandes" 
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition-colors"
          >
            Ver todas <ArrowRight size={14} />
          </Link>
        </div>
        <div className="text-center py-8">
          <Mountain size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm">Nenhuma Grande Meta ainda</p>
          <Link 
            to="/metas/grandes" 
            className="text-indigo-600 text-sm font-medium mt-2 inline-block hover:underline"
          >
            Criar primeira meta
          </Link>
        </div>
      </div>
    );
  }

  const cfg = levelConfig.G;

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
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Mountain size={16} className="text-indigo-600" />
          </div>
          <h3 className="text-slate-800 font-semibold">Grandes Metas</h3>
          <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2 py-0.5 rounded-full">
            3 anos
          </span>
        </div>
        <Link 
          to="/metas/grandes" 
          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition-colors"
        >
          Ver todas <ArrowRight size={14} />
        </Link>
      </div>

      {/* Content */}
      <motion.div
        variants={staggerContainer}
        className="space-y-3"
      >
        {grandesMetas.slice(0, 4).map((meta) => {
          const area = areas.find(a => a.id === meta.area_id);
          // Calculate a mock progress for now - in a real app this would be calculated
          const progress = 0;

          return (
            <motion.div key={meta.id} variants={scaleIn}>
              <Link
                to={`/metas/grandes/${meta.id}`}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-all group"
              >
                {/* Circular Progress */}
                <div className="relative shrink-0">
                  <CircularProgress
                    progress={progress}
                    size={48}
                    strokeWidth={4}
                    color={cfg.color}
                    showLabel
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {meta.one_thing && (
                      <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />
                    )}
                    <p className="text-slate-800 text-sm font-medium truncate group-hover:text-indigo-600 transition-colors">
                      {meta.titulo}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {area && (
                      <span 
                        className="text-xs flex items-center gap-1"
                        style={{ color: area.cor }}
                      >
                        <span>{area.icone}</span>
                        <span>{area.nome}</span>
                      </span>
                    )}
                    <span className="text-slate-400 text-xs">
                      · {new Date(meta.created_at).getFullYear()}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                      style={{ backgroundColor: cfg.color }}
                    />
                  </div>
                </div>

                {/* Arrow */}
                <ArrowRight 
                  size={16} 
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