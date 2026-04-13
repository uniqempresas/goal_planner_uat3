import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router';
import { 
  MoreVertical, 
  Play, 
  Pause, 
  Edit3, 
  Trash2, 
  Calendar, 
  Clock,
  CheckCircle2,
  Flame,
  Trophy,
  Zap,
  Target,
  Sun,
  CloudSun,
  Moon
} from 'lucide-react';
import type { Database } from '../../../lib/supabase';

type Habito = Database['public']['Tables']['habitos']['Row'];

interface HabitCardProps {
  habito: Habito;
  index: number;
  onTogglePausar: (habito: Habito) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (prioridade: string) => {
  switch (prioridade) {
    case 'alta': return { gradient: 'from-rose-500 to-red-600', bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700' };
    case 'media': return { gradient: 'from-amber-500 to-orange-600', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' };
    case 'baixa': return { gradient: 'from-emerald-500 to-teal-600', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' };
    default: return { gradient: 'from-slate-500 to-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' };
  }
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'ativa': return { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', icon: Zap, label: 'Ativo' };
    case 'pausada': return { bg: 'bg-amber-500', light: 'bg-amber-50', text: 'text-amber-700', icon: Pause, label: 'Pausado' };
    case 'concluida': return { bg: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-700', icon: CheckCircle2, label: 'Concluído' };
    case 'expirada': return { bg: 'bg-slate-500', light: 'bg-slate-50', text: 'text-slate-700', icon: Clock, label: 'Expirado' };
    default: return { bg: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-700', icon: Zap, label: 'Ativo' };
  }
};

const getBlocoIcon = (bloco: string | null) => {
  switch (bloco) {
    case 'one-thing': return Target;
    case 'manha': return Sun;
    case 'tarde': return CloudSun;
    case 'noite': return Moon;
    default: return Calendar;
  }
};

const getBlocoLabel = (bloco: string | null) => {
  switch (bloco) {
    case 'one-thing': return 'One Thing';
    case 'manha': return 'Manhã';
    case 'tarde': return 'Tarde';
    case 'noite': return 'Noite';
    default: return 'Qualquer hora';
  }
};

const getDiasSemanaLabel = (dias: number[]) => {
  if (dias.length === 7) return 'Todos os dias';
  if (dias.length === 0) return 'Sem dias definidos';
  const labels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  return dias.map(d => labels[d]).join(', ');
};

export function HabitCard({ habito, index, onTogglePausar, onDelete }: HabitCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const priorityColors = getPriorityColor(habito.prioridade);
  const statusConfig = getStatusConfig(habito.status);
  const StatusIcon = statusConfig.icon;
  const BlocoIcon = getBlocoIcon(habito.bloco);
  
  const hasStreak = (habito.streak_atual || 0) > 0;
  const isHotStreak = (habito.streak_atual || 0) >= 7;
  const isRecord = (habito.streak_atual || 0) >= (habito.melhor_streak || 0) && (habito.melhor_streak || 0) > 0;
  
  const progressPercent = Math.min(
    ((habito.streak_atual || 0) / Math.max(habito.melhor_streak || 1, 7)) * 100, 
    100
  );

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ 
        duration: 0.4, 
        delay: index * 0.08,
        type: "spring",
        stiffness: 100,
        damping: 15
      }}
      className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
    >
      {/* Priority Indicator Bar */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${priorityColors.gradient}`} />
      
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <motion.div 
              className={`p-2.5 rounded-xl bg-gradient-to-br ${priorityColors.gradient} shadow-md`}
              whileHover={{ rotate: 5, scale: 1.05 }}
            >
              <BlocoIcon className="w-5 h-5 text-white" />
            </motion.div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                {habito.titulo}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors.bg} ${priorityColors.text} border ${priorityColors.border}`}>
                  {habito.prioridade === 'alta' ? 'Alta' : habito.prioridade === 'media' ? 'Média' : 'Baixa'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <BlocoIcon className="w-3 h-3" />
                  {getBlocoLabel(habito.bloco)}
                </span>
              </div>
            </div>
          </div>
          
          {/* Actions Menu */}
          <div className="relative">
            <motion.button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>
            
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-20"
                >
                  <button
                    onClick={() => {
                      onTogglePausar(habito);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    {habito.status === 'ativa' ? (
                      <><Pause className="w-4 h-4 text-amber-500" /> <span>Pausar hábito</span></>
                    ) : (
                      <><Play className="w-4 h-4 text-emerald-500" /> <span>Continuar</span></>
                    )}
                  </button>
                  <Link
                    to={`/habitos/${habito.id}/editar`}
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Edit3 className="w-4 h-4 text-indigo-500" />
                    <span>Editar</span>
                  </Link>
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={() => {
                      onDelete(habito.id);
                      setMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Excluir</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Description */}
        {habito.descricao && (
          <p className="text-slate-500 text-sm mb-4 line-clamp-2 leading-relaxed">{habito.descricao}</p>
        )}
        
        {/* Streak Section */}
        <div className="flex items-center gap-3 mb-4">
          <motion.div 
            className={`
              flex items-center gap-2 px-3 py-2 rounded-xl
              ${hasStreak 
                ? isHotStreak 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
                : 'bg-slate-50 text-slate-500 border border-slate-200'
              }
            `}
            animate={hasStreak ? {
              scale: [1, 1.02, 1],
            } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div
              animate={hasStreak ? {
                rotate: [0, -10, 10, 0],
              } : {}}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
            >
              <Flame className={`w-5 h-5 ${hasStreak && isHotStreak ? 'text-white' : ''}`} />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-none">{habito.streak_atual || 0}</span>
              <span className={`text-xs ${hasStreak && isHotStreak ? 'text-white/80' : 'opacity-70'}`}>dias</span>
            </div>
          </motion.div>
          
          {(habito.melhor_streak || 0) > 0 && (
            <motion.div 
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-violet-50 text-violet-700 border border-violet-200"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Trophy className="w-4 h-4" />
              <div className="flex flex-col">
                <span className="text-sm font-bold leading-none">{habito.melhor_streak}</span>
                <span className="text-xs opacity-70">recorde</span>
              </div>
            </motion.div>
          )}
          
          {isRecord && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-2 py-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg text-xs font-bold text-white shadow-md"
            >
              🏆 Recorde!
            </motion.div>
          )}
        </div>
        
        {/* Info Row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
            <Calendar className="w-3.5 h-3.5" />
            <span>{getDiasSemanaLabel(habito.dias_semana)}</span>
          </div>
          {habito.hora && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-lg">
              <Clock className="w-3.5 h-3.5" />
              <span>{habito.hora}</span>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.light} ${statusConfig.text}`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.bg} ${habito.status === 'ativa' ? 'animate-pulse' : ''}`} />
            {statusConfig.label}
          </div>
          
          <Link
            to={`/habitos/${habito.id}`}
            className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group/link"
          >
            Ver detalhes
            <motion.span
              className="inline-block"
              animate={{ x: isHovered ? 3 : 0 }}
              transition={{ duration: 0.2 }}
            >
              →
            </motion.span>
          </Link>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
        <motion.div 
          className={`h-full bg-gradient-to-r ${priorityColors.gradient}`}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
        />
      </div>
      
      {/* Hover Glow Effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}
