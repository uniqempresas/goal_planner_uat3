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
        className="relative block bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 cursor-pointer active:scale-[0.99] transition-transform"
        style={{
          boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        }}
      >
        {/* Left colored border */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
          style={{ backgroundColor: areaColor }}
        />

        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center text-xl sm:text-2xl shrink-0"
              style={{ backgroundColor: `${areaColor}20` }}
            >
              {area.icone || '🎯'}
            </div>
            <h3 className="text-slate-800 font-semibold text-sm sm:text-base truncate group-hover:text-indigo-600 transition-colors">
              {area.nome}
            </h3>
          </div>
          <ArrowRight size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors shrink-0" />
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-2">
          {isComplete && (
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full inline-flex items-center gap-1">
              ✅ <span className="hidden sm:inline">Concluída</span>
            </span>
          )}
          {isHighProgress && !isComplete && (
            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full inline-flex items-center gap-1">
              🔥 <span className="hidden sm:inline">Em alta</span>
            </span>
          )}
          <span className="text-xs text-slate-400">{area.metasCount || 0} metas</span>
        </div>

        <p className="text-slate-500 text-sm mb-3 leading-relaxed line-clamp-2">
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