import { motion } from 'framer-motion';
import { LucideIcon, CheckCircle2, Star, TrendingUp } from 'lucide-react';

interface WeekStatsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  type?: 'default' | 'success' | 'oneThing';
  delay?: number;
}

const typeStyles = {
  default: {
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
    gradient: 'from-indigo-500 to-violet-600',
  },
  success: {
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
    gradient: 'from-emerald-500 to-teal-600',
  },
  oneThing: {
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-600',
  },
};

export function WeekStatsCard({ icon: Icon, value, label, type = 'default', delay = 0 }: WeekStatsCardProps) {
  const styles = typeStyles[type];

  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-4
        hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer
      `}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.25, 0.46, 0.45, 0.94],
        delay: delay * 0.1
      }}
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' }}
    >
      {/* Gradient accent on top */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${styles.gradient}`} />
      
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${styles.iconBg}`}>
          <Icon size={20} className={styles.iconColor} />
        </div>
        <div>
          <div className="text-2xl font-bold text-slate-800 leading-none">
            {value}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            {label}
          </div>
        </div>
      </div>
    </motion.div>
  );
}