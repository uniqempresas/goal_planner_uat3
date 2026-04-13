import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { CircularProgress } from './CircularProgress';

interface WeekDayCardProps {
  dayName: string;
  dayNumber: number;
  date: Date;
  isSelected: boolean;
  isToday: boolean;
  completedTasks: number;
  totalTasks: number;
  hasOneThing: boolean;
  onClick: () => void;
}

export function WeekDayCard({
  dayName,
  dayNumber,
  isSelected,
  isToday,
  completedTasks,
  totalTasks,
  hasOneThing,
  onClick,
}: WeekDayCardProps) {
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <motion.button
      onClick={onClick}
      className={`
        relative flex flex-col items-center gap-1.5 p-3 rounded-2xl border-2 
        transition-all cursor-pointer w-full min-w-[80px]
        ${isSelected
          ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-100'
          : isToday
          ? 'border-indigo-300 bg-white shadow-md'
          : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-md'
        }
      `}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Today badge */}
      {isToday && (
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-600 rounded-full border-2 border-white z-10" />
      )}
      
      {/* Day name */}
      <span className={`text-xs font-medium ${isSelected ? 'text-indigo-700' : 'text-slate-500'}`}>
        {dayName}
      </span>
      
      {/* Day number */}
      <span className={`
        text-lg font-bold leading-none
        ${isSelected ? 'text-indigo-800' : isToday ? 'text-indigo-600' : 'text-slate-700'}
      `}>
        {dayNumber}
      </span>
      
      {/* ONE Thing badge */}
      {hasOneThing && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 500 }}
        >
          <Star size={12} className="text-amber-500 fill-amber-400" />
        </motion.div>
      )}
      
      {/* Circular Progress */}
      <div className="mt-1">
        <CircularProgress
          progress={progress}
          size={40}
          strokeWidth={3}
          color={isSelected ? '#6366F1' : '#6366F1'}
          showLabel={true}
        />
      </div>
      
      {/* Task count */}
      <span className="text-[10px] text-slate-400 font-medium">
        {completedTasks}/{totalTasks}
      </span>
    </motion.button>
  );
}