import { Search, SlidersHorizontal, LayoutGrid, List, Maximize2 } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import { filterTabs } from '../lib/constants';
import type { FilterState, ViewMode, GroupByOption } from '../types';

interface ControlBarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  groupBy: GroupByOption;
  onGroupByChange: (option: GroupByOption) => void;
}

export function ControlBar({
  filters,
  onFiltersChange,
  viewMode,
  onViewModeChange,
  groupBy,
  onGroupByChange,
}: ControlBarProps) {
  const [searchValue, setSearchValue] = useState(filters.searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== filters.searchQuery) {
        onFiltersChange({ ...filters, searchQuery: searchValue });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, filters, onFiltersChange]);

  const handleStatusChange = useCallback((status: FilterState['status']) => {
    onFiltersChange({ ...filters, status });
  }, [filters, onFiltersChange]);

  return (
    <div className="bg-white border-b border-slate-200 px-4 py-4 space-y-4">
      {/* Top Row: Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar metas..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              placeholder:text-slate-400"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => onViewModeChange('compacto')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'compacto'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Compacto"
          >
            <List size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('normal')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'normal'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Normal"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => onViewModeChange('detalhado')}
            className={`p-2 rounded-md transition-all ${
              viewMode === 'detalhado'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
            title="Detalhado"
          >
            <Maximize2 size={16} />
          </button>
        </div>

        {/* Group By */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-slate-400" />
          <select
            value={groupBy}
            onChange={(e) => onGroupByChange(e.target.value as GroupByOption)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm 
              focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent
              text-slate-700"
          >
            <option value="nenhum">Agrupar: Nenhum</option>
            <option value="area">Agrupar: Área</option>
            <option value="data">Agrupar: Data</option>
            <option value="prioridade">Agrupar: Prioridade</option>
          </select>
        </div>
      </div>

      {/* Bottom Row: Filter Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleStatusChange(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all
              ${filters.status === tab.key
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
