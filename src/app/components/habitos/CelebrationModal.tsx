import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles, X } from 'lucide-react';
import { useEffect } from 'react';

interface CelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  habitName: string;
  isRecord?: boolean;
}

export function CelebrationModal({ isOpen, onClose, streak, habitName, isRecord }: CelebrationModalProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="relative bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Animated Icon */}
            <motion.div
              className="relative w-24 h-24 mx-auto mb-6"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 rounded-full opacity-20 blur-xl" />
              <div className="relative w-full h-full bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                {isRecord ? (
                  <Trophy className="w-12 h-12 text-white" />
                ) : (
                  <Sparkles className="w-12 h-12 text-white" />
                )}
              </div>
            </motion.div>

            {/* Confetti Effect */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{
                    background: ['#fbbf24', '#f59e0b', '#ef4444', '#8b5cf6', '#10b981'][i % 5],
                    left: `${50 + (Math.random() - 0.5) * 60}%`,
                    top: '50%',
                  }}
                  animate={{
                    y: [0, -100 - Math.random() * 100],
                    x: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 200],
                    opacity: [1, 0],
                    scale: [1, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    delay: i * 0.1,
                    ease: "easeOut",
                  }}
                />
              ))}
            </div>

            {/* Content */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-slate-800 mb-2"
            >
              {isRecord ? '🎉 Novo Recorde!' : '🔥 Streak Mantido!'}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-slate-600 mb-4"
            >
              Você completou <strong className="text-indigo-600">{habitName}</strong>
            </motion.p>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl text-white font-bold text-3xl shadow-lg"
            >
              <span>🔥</span>
              <span>{streak}</span>
              <span className="text-lg font-medium opacity-90">dias</span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-sm text-slate-500 mt-4"
            >
              {isRecord 
                ? 'Você superou seu recorde anterior! Incrível!' 
                : 'Continue assim! Consistência é a chave do sucesso.'}
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
