import { motion } from 'framer-motion';
import { Flame, TrendingUp, Target, Award } from 'lucide-react';

interface StreakBadgeProps {
  current: number;
  best: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const getStreakLevel = (streak: number) => {
  if (streak >= 30) return { label: 'Lendário', color: 'from-purple-500 to-pink-500', icon: Award };
  if (streak >= 14) return { label: 'Mestre', color: 'from-amber-500 to-orange-500', icon: Flame };
  if (streak >= 7) return { label: 'Quente', color: 'from-orange-400 to-red-500', icon: TrendingUp };
  if (streak >= 3) return { label: 'Iniciante', color: 'from-emerald-400 to-teal-500', icon: Target };
  return { label: 'Frio', color: 'from-slate-400 to-slate-500', icon: Target };
};

export function StreakBadge({ current, best, size = 'md', showLabel = true }: StreakBadgeProps) {
  const level = getStreakLevel(current);
  const Icon = level.icon;
  const isHot = current >= 7;
  const isRecord = current >= best && best > 0;

  const sizes = {
    sm: { container: 'px-2 py-1', icon: 'w-3 h-3', text: 'text-sm', label: 'text-xs' },
    md: { container: 'px-3 py-1.5', icon: 'w-4 h-4', text: 'text-base', label: 'text-xs' },
    lg: { container: 'px-4 py-2', icon: 'w-5 h-5', text: 'text-lg', label: 'text-sm' },
  };

  const s = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <motion.div
        className={`inline-flex items-center gap-1.5 ${s.container} rounded-xl bg-gradient-to-r ${level.color} text-white shadow-lg`}
        animate={isHot ? {
          boxShadow: [
            '0 4px 14px rgba(249, 115, 22, 0.3)',
            '0 4px 20px rgba(249, 115, 22, 0.5)',
            '0 4px 14px rgba(249, 115, 22, 0.3)',
          ],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <motion.div
          animate={isHot ? {
            rotate: [0, -10, 10, 0],
            scale: [1, 1.1, 1],
          } : {}}
          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
        >
          <Icon className={s.icon} />
        </motion.div>
        <span className={`font-bold ${s.text}`}>{current}</span>
      </motion.div>

      {showLabel && (
        <div className="flex flex-col">
          <span className={`text-slate-500 ${s.label}`}>
            {isRecord && best > 0 ? '🏆 Recorde!' : `${level.label}`}
          </span>
          {best > 0 && current < best && (
            <span className="text-xs text-slate-400">
              Melhor: {best}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
