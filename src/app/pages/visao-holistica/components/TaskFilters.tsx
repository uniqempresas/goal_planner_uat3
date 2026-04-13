import type { TaskFilterState } from '../types';

interface TaskFiltersProps {
  filter: TaskFilterState;
  onFilterChange: (filter: TaskFilterState) => void;
}

export function TaskFilters({ filter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-slate-600">Filtrar:</span>
        <select
          value={filter.tipo}
          onChange={(e) => onFilterChange({ ...filter, tipo: e.target.value as TaskFilterState['tipo'] })}
          className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="todas">Todas</option>
          <option value="recorrentes">Recorrentes</option>
          <option value="nao_recorrentes">Não Recorrentes</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={filter.showAtrasadas}
            onChange={(e) => onFilterChange({ ...filter, showAtrasadas: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          Atrasadas
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={filter.showAberto}
            onChange={(e) => onFilterChange({ ...filter, showAberto: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          Em Aberto
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={filter.showConcluidas}
            onChange={(e) => onFilterChange({ ...filter, showConcluidas: e.target.checked })}
            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
          />
          Concluídas
        </label>
      </div>
    </div>
  );
}