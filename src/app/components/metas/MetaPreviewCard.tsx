import { motion } from 'framer-motion';
import { Target, Calendar, Star, Flame, Trophy, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import type { MetaNivel } from '../../../services/metasService';

interface MetaPreviewCardProps {
  titulo: string;
  descricao?: string;
  nivel: MetaNivel;
  prazo?: string;
  areaId?: string | null;
  parentMeta?: { titulo: string; nivel: MetaNivel } | null;
  isOneThing?: boolean;
  theme: {
    primary: string;
    gradient: string;
    bg: string;
    text: string;
    emoji: string;
  };
}

const nivelLabels: Record<MetaNivel, string> = {
  grande: 'Grande Meta',
  anual: 'Meta Anual',
  mensal: 'Meta Mensal',
  semanal: 'Meta Semanal',
  diaria: 'Meta Diária',
};

const xpByNivel: Record<MetaNivel, number> = {
  grande: 500,
  anual: 200,
  mensal: 100,
  semanal: 50,
  diaria: 25,
};

export function MetaPreviewCard({
  titulo,
  descricao,
  nivel,
  prazo,
  areaId,
  parentMeta,
  isOneThing,
  theme,
}: MetaPreviewCardProps) {
  const { areas } = useApp();
  const area = areas.find(a => a.id === areaId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, type: 'spring' }}
      className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
    >
      {/* Header com gradiente */}
      <div className={`h-2 bg-gradient-to-r ${theme.gradient}`} />

      <div className="p-6">
        {/* Título e ícone */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${theme.gradient} flex items-center justify-center shadow-lg`}>
            <span className="text-2xl">{theme.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-slate-900 truncate">
              {titulo || `Sua ${nivelLabels[nivel]}`}
            </h3>
            <p className="text-slate-500 text-sm mt-1 line-clamp-2">
              {descricao || 'Adicione uma descrição para lembrar o propósito'}
            </p>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {/* Badge do nível */}
          <span
            className="text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide"
            style={{ backgroundColor: theme.bg, color: theme.text }}
          >
            {nivel}
          </span>

          {/* ONE Thing badge */}
          {isOneThing && (
            <motion.span
              animate={{
                scale: [1, 1.05, 1],
                transition: { duration: 2, repeat: Infinity },
              }}
              className="flex items-center gap-1 text-xs bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2 py-1 rounded-full font-medium"
            >
              <Star size={10} className="fill-amber-500 text-amber-500" />
              ONE Thing
            </motion.span>
          )}

          {/* Status badge */}
          <span className="flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-medium">
            <Target size={10} />
            Ativa
          </span>
        </div>

        {/* Info row */}
        <div className="space-y-2 text-sm">
          {prazo && (
            <div className="flex items-center gap-2 text-slate-600">
              <Calendar className="w-4 h-4" style={{ color: theme.text }} />
              <span>
                Prazo: {new Date(prazo).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>
          )}

          {area && (
            <div className="flex items-center gap-2" style={{ color: area.cor || theme.text }}>
              <span className="text-base">{area.icone || '📊'}</span>
              <span className="font-medium">{area.nome}</span>
            </div>
          )}

          {parentMeta && (
            <div className="flex items-center gap-2 text-slate-500">
              <TrendingUp className="w-4 h-4" />
              <span className="truncate">
                Vinculada a: {parentMeta.titulo.slice(0, 30)}
                {parentMeta.titulo.length > 30 ? '...' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Gamification preview */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-xs text-slate-500">
                <span className="font-semibold text-orange-600">+{xpByNivel[nivel]} XP</span> ao criar
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-slate-400">Conquista potencial</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
