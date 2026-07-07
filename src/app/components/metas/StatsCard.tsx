import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { scaleIn } from './animations';

interface StatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color: string;
  bgColor: string;
  delay?: number;
  compact?: boolean;
}

export function StatsCard({ icon: Icon, value, label, color, bgColor, delay = 0, compact = false }: StatsCardProps) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={{ 
        y: -4, 
        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        transition: { duration: 0.2 }
      }}
      className={`bg-white rounded-xl border border-slate-200 cursor-pointer ${
        compact
          ? 'p-2 sm:p-4 flex flex-col items-center justify-center text-center'
          : 'p-4 flex items-center gap-4'
      }`}
    >
      <div
        className={`rounded-xl flex items-center justify-center flex-shrink-0 ${
          compact ? 'w-9 h-9 sm:w-12 sm:h-12 mb-1 sm:mb-2' : 'w-12 h-12'
        }`}
        style={{ backgroundColor: bgColor }}
      >
        <Icon className={`${compact ? 'w-5 h-5 sm:w-6 sm:h-6' : 'w-6 h-6'}`} style={{ color }} />
      </div>
      <div className={`${compact ? '' : 'flex-1 min-w-0 text-left'}`}>
        <div className={`font-bold text-slate-800 ${compact ? 'text-lg sm:text-2xl' : 'text-2xl'}`}>{value}</div>
        <div className={`text-slate-500 ${compact ? 'text-[10px] sm:text-sm hidden sm:block' : 'text-sm'}`}>{label}</div>
      </div>
    </motion.div>
  );
}
