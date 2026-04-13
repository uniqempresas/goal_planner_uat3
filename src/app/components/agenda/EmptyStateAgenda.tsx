import { motion } from 'framer-motion';
import { Calendar, Plus } from 'lucide-react';
import { Link } from 'react-router';

interface EmptyStateAgendaProps {
  date: Date;
  dayName: string;
  onCreateTask: () => void;
}

export function EmptyStateAgenda({ date, dayName, onCreateTask }: EmptyStateAgendaProps) {
  const isToday = date.toDateString() === new Date().toDateString();
  
  const title = isToday 
    ? 'Nenhuma tarefa para hoje' 
    : `Nenhuma tarefa para ${dayName.toLowerCase()}`;
    
  const description = isToday
    ? 'Comece seu dia adicionando uma tarefa'
    : 'Adicione tarefas para planejar seu dia';

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 px-4"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <motion.div
        className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4"
        animate={{ 
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Calendar size={28} className="text-slate-400" />
      </motion.div>
      
      <h3 className="text-slate-700 font-semibold text-lg mb-2">
        {title}
      </h3>
      
      <p className="text-slate-500 text-sm text-center mb-6 max-w-xs">
        {description}
      </p>
      
      <button
        onClick={onCreateTask}
        className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl font-medium text-sm hover:bg-indigo-700 transition-colors"
      >
        <Plus size={16} />
        Adicionar tarefa
      </button>
    </motion.div>
  );
}