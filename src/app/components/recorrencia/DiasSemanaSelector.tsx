import { DIAS_SEMANA } from '../../../lib/supabase';
import { cn } from '../../components/ui/utils';

interface DiasSemanaSelectorProps {
  selected: number[];
  onChange: (dias: number[]) => void;
  disabled?: boolean;
}

/**
 * Componente para seleção de dias da semana
 * Exibe botões toggle para cada dia (Seg a Dom)
 * Formato: 0=Segunda, 6=Domingo
 */
export function DiasSemanaSelector({ selected, onChange, disabled }: DiasSemanaSelectorProps) {
  const toggleDia = (dia: number) => {
    if (disabled) return;

    if (selected.includes(dia)) {
      onChange(selected.filter(d => d !== dia));
    } else {
      onChange([...selected, dia].sort((a, b) => a - b));
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {DIAS_SEMANA.map((dia) => {
        const isSelected = selected.includes(dia.value);
        return (
          <button
            key={dia.value}
            type="button"
            onClick={() => toggleDia(dia.value)}
            disabled={disabled}
            className={cn(
              "w-10 h-10 rounded-lg text-sm font-medium transition-all",
              "border focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
              isSelected
                ? "bg-indigo-500 text-white border-indigo-500 shadow-sm"
                : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50",
              disabled && "opacity-50 cursor-not-allowed hover:bg-white hover:border-slate-200"
            )}
            title={dia.label}
          >
            {dia.short}
          </button>
        );
      })}
    </div>
  );
}

export default DiasSemanaSelector;
