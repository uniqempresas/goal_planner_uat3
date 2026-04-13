import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { fadeInUp, staggerContainer, scaleIn } from '../metas/animations';

export function AreasWidget() {
  const { areas } = useApp();

  if (areas.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Heart size={20} className="text-rose-600" />
            <h3 className="text-slate-800 font-semibold">Áreas de Vida</h3>
          </div>
          <Link 
            to="/areas" 
            className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition-colors"
          >
            Ver <ArrowRight size={14} />
          </Link>
        </div>
        <div className="text-center py-8">
          <Heart size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 text-sm">Nenhuma Área de Vida ainda</p>
          <Link 
            to="/areas" 
            className="text-indigo-600 text-sm font-medium mt-2 inline-block hover:underline"
          >
            Criar primeira área
          </Link>
        </div>
      </div>
    );
  }

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
          <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
            <Heart size={16} className="text-rose-600" />
          </div>
          <h3 className="text-slate-800 font-semibold">Áreas de Vida</h3>
        </div>
        <Link 
          to="/areas" 
          className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition-colors"
        >
          Ver <ArrowRight size={14} />
        </Link>
      </div>

      {/* Areas Grid */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-2 gap-3"
      >
        {areas.slice(0, 4).map((area) => {
          // Mock progress - in a real app this would be calculated from tasks
          const progress = 0;
          
          return (
            <motion.div
              key={area.id}
              variants={scaleIn}
              className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{area.icone}</span>
                <span className="text-sm font-medium text-slate-700 truncate">
                  {area.nome}
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ backgroundColor: area.cor }}
                />
              </div>
              
              <div className="mt-1.5 text-xs text-slate-400">
                {progress}%
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}