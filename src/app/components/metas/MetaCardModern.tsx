import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router';
import { Star, Calendar, Target, Edit, Trash2, CheckCircle2, ArrowRight, Trophy } from 'lucide-react';
import { metasService } from '../../../services/metasService';
import { useApp } from '../../contexts/AppContext';
import type { Meta, MetaNivel } from '../../../services/metasService';
import { listItem, cardHover, buttonTap, badgePulse } from './animations';

interface MetaCardModernProps {
  meta: Meta;
  level: MetaNivel;
  onDelete: (id: string) => void;
  color: string;
  bgColor: string;
  textColor: string;
  levelPath: string;
  levelLabel: string;
  index?: number;
}

const statusConfig: Record<string, { label: string; bgColor: string; textColor: string; icon: typeof CheckCircle2 }> = {
  ativa: { 
    label: 'Ativa', 
    bgColor: 'bg-emerald-100', 
    textColor: 'text-emerald-700',
    icon: CheckCircle2 
  },
  concluida: { 
    label: 'Concluída', 
    bgColor: 'bg-blue-100', 
    textColor: 'text-blue-700',
    icon: Trophy 
  },
  arquivada: { 
    label: 'Arquivada', 
    bgColor: 'bg-slate-100', 
    textColor: 'text-slate-600',
    icon: CheckCircle2 
  },
};

export function MetaCardModern({ 
  meta, 
  level, 
  onDelete, 
  color, 
  bgColor, 
  textColor, 
  levelPath,
  levelLabel,
  index = 0 
}: MetaCardModernProps) {
  const { areas, getMetaById, loadMetas } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const area = areas.find(a => a.id === meta.area_id);
  const parent = meta.parent_id ? getMetaById(meta.parent_id) : undefined;
  const status = meta.status;
  const isCompleted = status === 'concluida';
  
  // Progresso simulado (pode ser calculado baseado em tarefas relacionadas)
  const progress = isCompleted ? 100 : Math.floor(Math.random() * 40) + 30;
  
  const statusInfo = statusConfig[status] || statusConfig.ativa;
  const StatusIcon = statusInfo.icon;

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Tem certeza que deseja excluir a meta "${meta.titulo}"?`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await metasService.delete(meta.id);
      onDelete(meta.id);
    } catch (err) {
      console.error('Erro ao excluir meta:', err);
      alert('Erro ao excluir meta. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleComplete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsCompleting(true);
    try {
      await metasService.toggleStatus(meta.id);
      await loadMetas();
    } catch (err) {
      console.error('Erro ao concluir meta:', err);
      alert('Erro ao concluir meta. Tente novamente.');
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <motion.div
      variants={listItem}
      initial="hidden"
      animate="visible"
      exit="exit"
      transition={{ delay: index * 0.05 }}
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`group relative bg-white rounded-xl border ${isCompleted ? 'border-slate-200' : 'border-slate-200 hover:border-indigo-200'} transition-all duration-300 overflow-hidden`}
    >
      {/* Hover gradient overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.02 : 0 }}
        className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 pointer-events-none"
      />

      <div className="relative p-4 sm:p-5">
        <div className="flex items-start gap-4">
          {/* Progress Circle */}
          <motion.div 
            className="relative flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <svg width="56" height="56" className="-rotate-90">
              {/* Background circle */}
              <circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={isCompleted ? '#e2e8f0' : bgColor}
                strokeWidth="5"
              />
              {/* Progress circle */}
              <motion.circle
                cx="28"
                cy="28"
                r="24"
                fill="none"
                stroke={isCompleted ? '#10b981' : color}
                strokeWidth="5"
                strokeDasharray={2 * Math.PI * 24}
                initial={{ strokeDashoffset: 2 * Math.PI * 24 }}
                animate={{ 
                  strokeDashoffset: 2 * Math.PI * 24 * (1 - progress / 100),
                  stroke: isCompleted ? '#10b981' : color
                }}
                transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                strokeLinecap="round"
              />
            </svg>
            {/* Percentage text */}
            <div className="absolute inset-0 flex items-center justify-center">
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Trophy size={18} className="text-emerald-500" />
                </motion.div>
              ) : (
                <span className="text-sm font-bold" style={{ color: textColor }}>
                  {progress}%
                </span>
              )}
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {/* Level badge */}
              <span 
                className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                {level}
              </span>
              
              {/* ONE Thing badge */}
              {meta.one_thing && (
                <motion.span
                  animate={badgePulse}
                  className="flex items-center gap-1 text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2 py-0.5 rounded-full font-medium"
                >
                  <Star size={10} className="fill-amber-500 text-amber-500" />
                  ONE Thing
                </motion.span>
              )}
              
              {/* Status badge */}
              <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${statusInfo.bgColor} ${statusInfo.textColor}`}>
                <StatusIcon size={10} />
                {statusInfo.label}
              </span>
            </div>

            {/* Title */}
            <Link
              to={`/metas/${levelPath}/${meta.id}`}
              className={`block text-base font-semibold mb-2 transition-colors ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800 group-hover:text-indigo-600'}`}
            >
              {meta.titulo}
            </Link>

            {/* Metadata row */}
            <div className="flex flex-wrap items-center gap-3 text-xs">
              {/* Area */}
              {area && (
                <span 
                  className="flex items-center gap-1 font-medium"
                  style={{ color: area.cor || '#6366f1' }}
                >
                  <span className="text-base">{area.icone || '📊'}</span>
                  <span>{area.nome || area.name}</span>
                </span>
              )}
              
              {/* Parent meta */}
              {parent && (
                <span className="text-slate-400 flex items-center gap-1">
                  <Target size={10} />
                  <span className="truncate max-w-[120px]">
                    {parent.titulo.slice(0, 25)}{parent.titulo.length > 25 ? '...' : ''}
                  </span>
                </span>
              )}
              
              {/* Deadline */}
              {meta.prazo && (
                <span className={`flex items-center gap-1 ${isCompleted ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Calendar size={10} />
                  {new Date(meta.prazo).toLocaleDateString('pt-BR', { 
                    day: '2-digit', 
                    month: 'short' 
                  })}
                </span>
              )}
            </div>

            {/* Progress bar (mobile visible, desktop optional) */}
            <div className="mt-3 sm:hidden">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{ backgroundColor: isCompleted ? '#10b981' : color }}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col items-end gap-2">
            {/* Complete button */}
            {!isCompleted && (
              <motion.button
                whileTap={buttonTap}
                onClick={handleComplete}
                disabled={isCompleting}
                className="p-2 rounded-lg transition-colors bg-slate-50 hover:bg-emerald-50 text-slate-400 hover:text-emerald-600"
                title="Marcar como concluída"
              >
                <CheckCircle2 size={18} />
              </motion.button>
            )}

            {/* Edit link */}
            <Link
              to={`/metas/${levelPath}/${meta.id}/editar`}
              onClick={(e) => e.stopPropagation()}
              className="p-2 rounded-lg transition-colors bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600"
              title="Editar"
            >
              <Edit size={18} />
            </Link>

            {/* Delete button */}
            <motion.button
              whileTap={buttonTap}
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 rounded-lg transition-colors bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-600 disabled:opacity-50"
              title="Excluir"
            >
              <Trash2 size={18} />
            </motion.button>
          </div>
        </div>

        {/* Progress bar desktop */}
        <div className="hidden sm:block mt-4">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              style={{ backgroundColor: isCompleted ? '#10b981' : color }}
            />
          </div>
        </div>

        {/* Arrow indicator on hover */}
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
          className="absolute right-4 bottom-4"
        >
          <ArrowRight size={16} className="text-indigo-400" />
        </motion.div>
      </div>
    </motion.div>
  );
}
