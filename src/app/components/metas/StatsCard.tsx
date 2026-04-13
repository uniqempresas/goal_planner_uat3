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
}

export function StatsCard({ icon: Icon, value, label, color, bgColor, delay = 0 }: StatsCardProps) {
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
      className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4 cursor-pointer"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bgColor }}
      >
        <Icon size={22} style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-2xl font-bold text-slate-800 truncate">{value}</div>
        <div className="text-slate-500 text-sm">{label}</div>
      </div>
    </motion.div>
  );
}
