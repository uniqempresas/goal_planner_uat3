import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { LayoutDashboard, Plus, ArrowRight, Star } from 'lucide-react';
import { fadeInUp } from '../metas/animations';

interface DashboardEmptyStateProps {
  title?: string;
  message?: string;
}

export function DashboardEmptyState({
  title = 'Bem-vindo ao seu Dashboard',
  message = 'Comece adicionando tarefas hoje para acompanhar seu progresso.'
}: DashboardEmptyStateProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-2xl border border-slate-200 p-8 text-center"
    >
      <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <LayoutDashboard size={28} className="text-indigo-600" />
      </div>
      
      <h2 className="text-slate-800 text-xl font-semibold mb-2">
        {title}
      </h2>
      
      <p className="text-slate-500 max-w-md mx-auto mb-6">
        {message}
      </p>
      
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/agenda/hoje"
          className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Plus size={18} />
          Adicionar Tarefas
        </Link>
        
        <Link
          to="/metas"
          className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-medium transition-colors"
        >
          <Star size={18} />
          Criar Metas
        </Link>
      </div>
    </motion.div>
  );
}