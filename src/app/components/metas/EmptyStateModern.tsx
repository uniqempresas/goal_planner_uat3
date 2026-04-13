import { motion } from 'framer-motion';
import { Plus, Target } from 'lucide-react';
import { Link } from 'react-router';
import { fadeInUp, floatAnimation } from './animations';

interface EmptyStateModernProps {
  title: string;
  description: string;
  actionLabel: string;
  actionHref: string;
  color: string;
  bgColor: string;
}

export function EmptyStateModern({ 
  title, 
  description, 
  actionLabel, 
  actionHref, 
  color, 
  bgColor 
}: EmptyStateModernProps) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Animated Icon */}
      <motion.div
        animate={floatAnimation}
        className="relative mb-6"
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center"
          style={{ backgroundColor: bgColor }}
        >
          <Target size={40} style={{ color }} />
        </div>
        {/* Decorative rings */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: color }}
        />
        <motion.div
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.05, 0.2],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 0.3,
          }}
          className="absolute inset-0 rounded-full border-2"
          style={{ borderColor: color }}
        />
      </motion.div>

      {/* Text content */}
      <motion.h3
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-xl font-semibold text-slate-800 mb-2 text-center"
      >
        {title}
      </motion.h3>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-slate-500 text-center mb-6 max-w-md"
      >
        {description}
      </motion.p>

      {/* Action button */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Link
          to={actionHref}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
          style={{ backgroundColor: color }}
        >
          <Plus size={18} />
          {actionLabel}
        </Link>
      </motion.div>
    </motion.div>
  );
}
