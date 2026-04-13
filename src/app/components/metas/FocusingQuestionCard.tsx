import { motion } from 'framer-motion';
import { HelpCircle, Sparkles } from 'lucide-react';
import { fadeInUp } from './animations';

interface FocusingQuestionCardProps {
  question: string;
  label: string;
  gradient: string;
  delay?: number;
}

export function FocusingQuestionCard({ question, label, gradient, delay = 0 }: FocusingQuestionCardProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${gradient}`}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl" />
      
      {/* Header */}
      <div className="relative flex items-center gap-2 mb-3">
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
          }}
        >
          <Sparkles className="w-5 h-5 text-white/90" />
        </motion.div>
        <span className="text-white/80 text-sm font-medium uppercase tracking-wide">
          Focusing Question · {label}
        </span>
      </div>
      
      {/* Question text */}
      <div className="relative">
        <p className="text-white text-lg md:text-xl font-medium leading-relaxed italic">
          "{question.replace(/"/g, '').trim()}"
        </p>
      </div>
      
      {/* Icon decoration */}
      <div className="absolute top-4 right-4 opacity-20">
        <HelpCircle size={64} className="text-white" />
      </div>
    </motion.div>
  );
}
