import { Link } from 'react-router';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Flame,
  Zap,
  Target,
  LucideIcon,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { staggerContainer, scaleIn } from '../metas/animations';

interface StatItem {
  label: string;
  value: string;
  subValue: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export function DashboardStats() {
  const { tarefasHoje, weeklyStats } = useApp();

  const completedToday = tarefasHoje.filter(t => t.completed).length;
  const totalToday = tarefasHoje.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const stats: StatItem[] = [
    {
      label: 'Tarefas Hoje',
      value: `${completedToday}/${totalToday}`,
      subValue: `${progressPercent}% concluído`,
      icon: CheckCircle2,
      color: '#10B981',
      bgColor: '#D1FAE5',
    },
    {
      label: 'Sequência',
      value: `${weeklyStats?.sequenciaDias || 0} dias`,
      subValue: 'Dias consecutivos',
      icon: Flame,
      color: '#F97316',
      bgColor: '#FED7AA',
    },
    {
      label: 'Foco Semana',
      value: `${weeklyStats?.produtividade || 0}%`,
      subValue: `${weeklyStats?.tarefasConcluidas || 0}/${weeklyStats?.tarefasTotal || 0} tarefas`,
      icon: Zap,
      color: '#6366F1',
      bgColor: '#E0E7FF',
    },
    {
      label: 'Metas',
      value: `${weeklyStats?.metasConcluidas || 0}`,
      subValue: 'Concluídas',
      icon: Target,
      color: '#9333EA',
      bgColor: '#F3E8FF',
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={scaleIn}
            transition={{ delay: index * 0.05 }}
            whileHover={{ 
              y: -4, 
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
              transition: { duration: 0.2 }
            }}
            className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3 cursor-pointer group"
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: stat.bgColor }}
            >
              <Icon size={20} style={{ color: stat.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div 
                className="text-xl font-bold text-slate-800 truncate"
                style={{ color: stat.color }}
              >
                {stat.value}
              </div>
              <div className="text-slate-500 text-xs truncate">{stat.label}</div>
              <div className="text-slate-400 text-[10px] truncate">{stat.subValue}</div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}