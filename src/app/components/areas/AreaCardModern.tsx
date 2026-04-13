import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { fadeInUp, cardHover } from '../metas/animations';

interface AreaUI {
  id: string;
  nome: string;
  icone: string;
  descricao: string;
  cor: string | null;
  progress: number;
  metasCount: number;
  metasConcluidas: number;
  createdAt: string;
}

interface AreaCardModernProps {
  area: AreaUI;
  index: number;
}

const DEFAULT_COLOR = '#6366F1';

export function AreaCardModern({ area, index }: AreaCardModernProps) {
  const areaColor = area.cor || DEFAULT_COLOR;
  const isHighProgress = area.progress >= 80;
  const isComplete = area.progress === 100;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      custom={index}
      whileHover="hover"
      className="group"
    >
      <Link
        to={`/areas/${area.id}`}
        className="relative block bg-white rounded-2xl border border-slate-200 p-5 cursor-pointer"
        style={{
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}
      >
        {/* Left colored border */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ backgroundColor: areaColor }}
        />

        <div className="flex items-start justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${areaColor}20` }}
          >
            {area.icone || '🎯'}
          </div>
          
          <div className="flex items-center gap-2">
            {isComplete && (
              <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                ✅ Concluída
              </span>
            )}
            {isHighProgress && !isComplete && (
              <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                🔥 Em alta
              </span>
            )}
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-slate-400">{area.metasCount || 0} metas</span>
              <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
          </div>
        </div>

        <h3 className="text-slate-800 font-semibold text-base mb-1 group-hover:text-indigo-600 transition-colors">
          {area.nome}
        </h3>
        <p className="text-slate-500 text-sm mb-4 leading-relaxed line-clamp-2">
          {area.descricao || 'Sem descrição'}
        </p>

        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-xs text-slate-500">Progresso</span>
            <span 
              className="text-xs font-semibold"
              style={{ color: areaColor }}
            >
              {area.progress || 0}%
            </span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: areaColor }}
              initial={{ width: 0 }}
              animate={{ width: `${area.progress || 0}%` }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}