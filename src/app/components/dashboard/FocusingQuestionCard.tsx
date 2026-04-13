import { motion } from 'framer-motion';
import { TrendingUp, Lightbulb } from 'lucide-react';
import { fadeInUp } from '../metas/animations';

export function FocusingQuestionCard() {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-purple-700 rounded-2xl p-5 text-white shadow-lg shadow-indigo-600/20"
    >
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-indigo-200" />
        <span className="text-indigo-200 text-xs font-semibold uppercase tracking-wider">
          Focusing Question
        </span>
      </div>
      
      <p className="text-white text-sm leading-relaxed italic">
        "Qual é a <strong>ÚNICA</strong> coisa que posso fazer{' '}
        <span className="text-amber-300 font-semibold">agora</span>, de tal forma que tudo o mais 
        se torne mais fácil ou desnecessário?"
      </p>
      
      <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
        <p className="text-indigo-200 text-xs">— Gary Keller, A Única Coisa</p>
        <TrendingUp size={16} className="text-indigo-300" />
      </div>
    </motion.div>
  );
}