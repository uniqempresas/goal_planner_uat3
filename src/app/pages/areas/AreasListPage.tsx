import { Link } from 'react-router';
import { ArrowRight, Plus, Target } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function AreasListPage() {
  const { areas } = useApp();

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-slate-800 mb-1">Áreas de Vida</h1>
          <p className="text-slate-500 text-sm">Organize suas metas pelas principais dimensões da sua vida.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer">
          <Plus size={15} />
          Nova Área
        </button>
      </div>

      {/* Overview bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="text-slate-700 text-sm mb-4">Progresso Geral</h3>
        <div className="flex gap-1 h-3 rounded-full overflow-hidden mb-3">
          {areas.map(area => (
            <div
              key={area.id}
              className="h-full transition-all"
              style={{ flex: 1, backgroundColor: area.color, opacity: 0.8 }}
              title={`${area.name}: ${area.progress}%`}
            />
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {areas.map(area => (
            <div key={area.id} className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: area.color }} />
              <span className="text-slate-500 text-xs">{area.emoji} {area.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {areas.map(area => (
          <Link
            key={area.id}
            to={`/areas/${area.id}`}
            className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm p-5 transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: area.bgColor }}
              >
                {area.emoji}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-slate-400">{area.metasCount} metas</span>
                <ArrowRight size={14} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>
            </div>

            <h3 className="text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition-colors">{area.name}</h3>
            <p className="text-slate-400 text-xs mb-4 leading-relaxed line-clamp-2">{area.description}</p>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs text-slate-500">Progresso</span>
                <span className="text-xs font-medium" style={{ color: area.color }}>{area.progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${area.progress}%`, backgroundColor: area.color }}
                />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Add area card */}
      <button className="mt-4 w-full md:w-auto md:min-w-[200px] border-2 border-dashed border-slate-200 hover:border-indigo-300 rounded-xl p-5 flex items-center justify-center gap-3 text-slate-400 hover:text-indigo-500 transition-all cursor-pointer">
        <Plus size={20} />
        <span className="text-sm">Adicionar nova área</span>
      </button>
    </div>
  );
}
