// Generic metas list page used for Anual, Mensal, Semanal, Diaria
import { Link } from 'react-router';
import { Plus, ArrowRight, Star, Calendar, Target } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import EmptyState from '../../components/empty-state/EmptyState';
import { type Meta, type MetaLevel, levelConfig } from '../../data/mockData';

const levelIcons: Record<MetaLevel, string> = {
  G: '🏔️',
  A: '📅',
  M: '🗓️',
  S: '📆',
  D: '☀️',
};

interface MetasListPageProps {
  level: MetaLevel;
  metas: Meta[];
  createPath: string;
  title: string;
  subtitle: string;
  focusingQuestion: string;
}

function MetaRow({ meta, level }: { meta: Meta; level: MetaLevel }) {
  const { areas, getMetaById } = useApp();
  const area = areas.find(a => a.id === meta.area_id);
  const parent = meta.parent_id ? getMetaById(meta.parent_id) : undefined;
  const cfg = levelConfig[level];

  const statusColors: Record<string, string> = {
    ativa: 'bg-emerald-100 text-emerald-700',
    concluida: 'bg-blue-100 text-blue-700',
    arquivada: 'bg-slate-100 text-slate-600',
  };
  const statusLabels: Record<string, string> = {
    ativa: 'Ativa',
    concluida: 'Concluída',
    arquivada: 'Arquivada',
  };

  const detailPath = `/${level === 'A' ? 'anual' : level === 'M' ? 'mensal' : level === 'S' ? 'semanal' : 'diaria'}/${meta.id}`;

  return (
    <Link
      to={`/metas${detailPath}`}
      className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all group"
    >
      <div className="relative shrink-0">
        <svg width={44} height={44} className="-rotate-90">
          <circle cx={22} cy={22} r={18} fill="none" stroke={cfg.bgColor} strokeWidth={4} />
          <circle
            cx={22} cy={22} r={18}
            fill="none" stroke={cfg.color} strokeWidth={4}
            strokeDasharray={2 * Math.PI * 18}
            strokeDashoffset={2 * Math.PI * 18 * (1 - meta.progress / 100)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-bold" style={{ color: cfg.textColor }}>{meta.progress}%</span>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: cfg.bgColor, color: cfg.textColor }}>{level}</span>
          {meta.isOneThing && (
            <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
              <Star size={9} className="fill-amber-500 text-amber-500" />
              ONE Thing
            </span>
          )}
          <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[meta.status]}`}>
            {statusLabels[meta.status]}
          </span>
        </div>
        <p className="text-slate-800 text-sm font-medium group-hover:text-indigo-600 transition-colors truncate mb-1">{meta.title}</p>
        <div className="flex flex-wrap items-center gap-3">
          {area && (
            <span className="text-xs flex items-center gap-1" style={{ color: area.color }}>
              {area.emoji} {area.name}
            </span>
          )}
          {parent && (
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Target size={10} />
              {parent.title.slice(0, 30)}…
            </span>
          )}
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar size={10} />
            {new Date(meta.prazo).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Progress bar on mobile */}
      <div className="hidden sm:block w-28">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
          <div
            className="h-full rounded-full"
            style={{ width: `${meta.progress}%`, backgroundColor: cfg.color }}
          />
        </div>
      </div>

      <ArrowRight size={15} className="text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
    </Link>
  );
}

export function MetasListPage({ level, metas, createPath, title, subtitle, focusingQuestion }: MetasListPageProps) {
  const cfg = levelConfig[level];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{levelIcons[level]}</span>
            <h1 className="text-slate-800">{title}</h1>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: cfg.bgColor, color: cfg.textColor }}>
              {cfg.description}
            </span>
          </div>
          <p className="text-slate-500 text-sm">{subtitle}</p>
        </div>
        <Link
          to={createPath}
          className="flex items-center gap-2 text-white px-4 py-2 rounded-lg text-sm transition-colors whitespace-nowrap"
          style={{ backgroundColor: cfg.color }}
        >
          <Plus size={15} />
          Nova {cfg.label}
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-slate-800">{metas.length}</div>
          <div className="text-slate-500 text-xs mt-0.5">Total</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold" style={{ color: cfg.color }}>
            {metas.length > 0 ? Math.round(metas.reduce((s, m) => s + m.progress, 0) / metas.length) : 0}%
          </div>
          <div className="text-slate-500 text-xs mt-0.5">Progresso médio</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-emerald-600">{metas.filter(m => m.status === 'active').length}</div>
          <div className="text-slate-500 text-xs mt-0.5">Ativas</div>
        </div>
      </div>

      {/* Focusing Question */}
      <div className="rounded-xl p-4 mb-6" style={{ backgroundColor: cfg.bgColor }}>
        <p className="text-xs font-medium mb-1.5" style={{ color: cfg.textColor }}>Focusing Question · {cfg.label}</p>
        <p className="text-slate-700 text-sm italic">{focusingQuestion}</p>
      </div>

      {/* List */}
      <div className="space-y-3">
        {metas.length === 0 ? (
          <EmptyState
            icon={<Target className="w-12 h-12" />}
            title={`Nenhuma ${cfg.label} criada`}
            description={`Crie uma meta para começar a tracked seu progresso.`}
            actionLabel={`Criar Primeira ${cfg.label}`}
            actionHref={createPath}
          />
        ) : (
          metas.map(meta => <MetaRow key={meta.id} meta={meta} level={level} />)
        )}
      </div>
    </div>
  );
}
