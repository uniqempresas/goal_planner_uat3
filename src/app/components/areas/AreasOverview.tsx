import { motion } from 'framer-motion';
import { fadeInUp } from '../metas/animations';

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

interface AreasOverviewProps {
  areas: AreaUI[];
  totalMetas: number;
  completedMetas: number;
}

const DEFAULT_COLOR = '#6366F1';

export function AreasOverview({ areas, totalMetas, completedMetas }: AreasOverviewProps) {
  const totalProgress = totalMetas > 0 ? Math.round((completedMetas / totalMetas) * 100) : 0;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl border border-slate-200 p-5 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate-700 font-semibold text-base">Progresso Geral</h3>
        <span className="text-sm font-medium text-slate-600">
          {completedMetas} / {totalMetas} metas concluídas ({totalProgress}%)
        </span>
      </div>

      {/* Stacked progress bar */}
      <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-4">
        {areas.map((area) => (
          <motion.div
            key={area.id}
            className="h-full rounded-full"
            style={{ 
              backgroundColor: area.cor || DEFAULT_COLOR,
              opacity: 0.9
            }}
            initial={{ width: 0 }}
            animate={{ flex: area.metasCount || 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            title={`${area.nome}: ${area.progress || 0}%`}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {areas.map((area) => (
          <div key={area.id} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: area.cor || DEFAULT_COLOR }}
            />
            <span className="text-slate-500 text-sm">
              {area.icone} {area.nome}
            </span>
            <span className="text-slate-400 text-xs">
              ({area.progress || 0}%)
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}