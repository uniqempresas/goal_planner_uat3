import { motion } from 'framer-motion';
import { Briefcase, Heart, Home, BookOpen, Dumbbell, Palette, DollarSign, Users, Plane, Leaf } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AreaVida {
  id: string;
  nome: string;
  icone: string;
  cor: string;
}

interface AreaVidaSelectorProps {
  selectedId?: string | null;
  onSelect: (areaId: string | null) => void;
  themeColor?: string;
}

// Map de ícones para componentes
const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
  'briefcase': Briefcase,
  'heart': Heart,
  'home': Home,
  'book-open': BookOpen,
  'dumbbell': Dumbbell,
  'palette': Palette,
  'dollar-sign': DollarSign,
  'users': Users,
  'plane': Plane,
  'leaf': Leaf,
};

export function AreaVidaSelector({ selectedId, onSelect, themeColor = '#6366f1' }: AreaVidaSelectorProps) {
  const { areas } = useApp();

  // Fallback areas se não houver dados
  const defaultAreas: AreaVida[] = [
    { id: 'career', nome: 'Carreira', icone: 'briefcase', cor: '#3b82f6' },
    { id: 'health', nome: 'Saúde', icone: 'heart', cor: '#ef4444' },
    { id: 'family', nome: 'Família', icone: 'home', cor: '#10b981' },
    { id: 'learning', nome: 'Aprendizado', icone: 'book-open', cor: '#8b5cf6' },
    { id: 'fitness', nome: 'Fitness', icone: 'dumbbell', cor: '#f59e0b' },
    { id: 'creative', nome: 'Criatividade', icone: 'palette', cor: '#ec4899' },
    { id: 'finance', nome: 'Finanças', icone: 'dollar-sign', cor: '#10b981' },
    { id: 'social', nome: 'Social', icone: 'users', cor: '#6366f1' },
  ];

  const displayAreas = areas.length > 0 
    ? areas.map(a => ({ ...a, icone: a.icone || 'briefcase', cor: a.cor || themeColor }))
    : defaultAreas;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-700">
        Área de Vida (opcional)
      </label>
      
      <div className="grid grid-cols-4 sm:grid-cols-4 gap-2">
        {displayAreas.map((area) => {
          const IconComponent = iconMap[area.icone] || Briefcase;
          const isSelected = selectedId === area.id;

          return (
            <motion.button
              key={area.id}
              type="button"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(isSelected ? null : area.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-transparent shadow-lg'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
              style={{
                backgroundColor: isSelected ? `${area.cor}15` : undefined,
                borderColor: isSelected ? area.cor : undefined,
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: isSelected ? area.cor : `${area.cor}20` }}
              >
                <IconComponent
                  size={20}
                  style={{ color: isSelected ? 'white' : area.cor }}
                />
              </div>
              <span
                className={`text-xs font-medium text-center line-clamp-1 ${
                  isSelected ? 'text-slate-800' : 'text-slate-600'
                }`}
              >
                {area.nome}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Opção "Nenhuma área" */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(null)}
        className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-all ${
          !selectedId
            ? 'bg-slate-100 text-slate-600'
            : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
        }`}
      >
        Nenhuma área selecionada
      </motion.button>
    </div>
  );
}
