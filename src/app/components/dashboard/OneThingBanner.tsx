import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Star, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { fadeInUp } from '../metas/animations';

export function OneThingBanner() {
  const { tarefasHoje } = useApp();
  const oneThing = tarefasHoje.find(t => t.block === 'oneThing');

  if (!oneThing) return null;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-1"
    >
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAyOGMtNC40MzggMC04MCAyLjMyMy04MCAzLjVTMzEuNTgzIDMxNSAzMiA0MmMzLjg0Ni0uNzIgNi40NTctMi45IDcuMzktNS41OC0uNDItMi4zNDUtMS43NDUtNC4zNS00LjY4LTUuMzJzLTQuNTYyIDEuODM5LTQuNTYyIDQuNjkyYzAgMS4wNTMuNTU3IDIgMS4zNyAzLjVTMzIgNDAuOTkgMzYgNDJjMi4wNzYgMCA0LjM5NS0uODMyIDUuMTM5LTIuMDM5eiIgZmlsbD0id2hpdGUiIGZpbGwtb3BhY2l0eT0iLjEiLz48L2c+PC9zdmc+')] opacity-30" />
      
      <div className="relative bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          {/* Icon */}
          <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/30">
            <Star size={28} className="text-white fill-white" />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full">
                <Star size={12} className="fill-amber-500" />
                ONE Thing do Dia
              </span>
              <span className="bg-red-100 text-red-700 text-xs font-medium px-2 py-1 rounded-full">
                Prioridade Máxima
              </span>
            </div>
            
            <h3 className="text-slate-800 text-lg font-semibold mb-1.5">
              {oneThing.titulo}
            </h3>
            
            {oneThing.descricao && (
              <p className="text-slate-500 text-sm line-clamp-2">
                {oneThing.descricao}
              </p>
            )}
          </div>

          {/* Action Button */}
          <Link
            to="/agenda/hoje"
            className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-5 py-3 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-amber-500/30 shrink-0"
          >
            <span>Ir para Agenda</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}