// Generic metas list page used for Anual, Mensal, Semanal, Diaria
import { Link } from 'react-router';
import { Plus, ArrowRight, Star, Calendar, Target, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import EmptyState from '../../components/empty-state/EmptyState';
import { type Meta, type MetaLevel, levelConfig } from '../../data/mockData';
import { metasService } from '../../../services/metasService';
import { useState, useEffect } from 'react';

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

function getLevelPath(level: MetaLevel): string {
  switch (level) {
    case 'A': return 'anual';
    case 'M': return 'mensal';
    case 'S': return 'semanal';
    case 'D': return 'diaria';
    default: return 'anual';
  }
}

function MetaRow({ meta, level, onDelete }: { meta: Meta; level: MetaLevel; onDelete: (id: string) => void }) {
  const { areas, getMetaById } = useApp();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Handle both mock data and real database data
  const metaAny = meta as unknown;
  const areaId = (metaAny as { area_id?: string })?.area_id || meta.areaId;
  const parentId = (metaAny as { parent_id?: string })?.parent_id || meta.parentId;
  const title = (metaAny as { titulo?: string })?.titulo || meta.title;
  const progress = (metaAny as { progress?: number })?.progress || meta.progress || 0;
  const isOneThing = (metaAny as { one_thing?: boolean })?.one_thing || meta.isOneThing;
  const status = (metaAny as { status?: string })?.status || meta.status;
  const prazo = (metaAny as { prazo?: string })?.prazo || meta.prazo;
  
  const area = areas.find(a => a.id === areaId);
  const parent = parentId ? getMetaById(parentId) : undefined;
  const cfg = levelConfig[level];
  const levelPath = getLevelPath(level);

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

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!confirm(`Tem certeza que deseja excluir a meta "${title}"?`)) {
      return;
    }
    
    setIsDeleting(true);
    try {
      await metasService.delete(meta.id);
      onDelete(meta.id);
    } catch (err) {
      console.error('Erro ao excluir meta:', err);
      alert('Erro ao excluir meta. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-slate-200 hover:border-indigo-200 hover:shadow-sm transition-all group">
      <Link
        to={`/metas/${levelPath}/${meta.id}`}
        className="flex items-center gap-4 flex-1 min-w-0"
      >
        <div className="relative shrink-0">
          <svg width={44} height={44} className="-rotate-90">
            <circle cx={22} cy={22} r={18} fill="none" stroke={cfg.bgColor} strokeWidth={4} />
            <circle
              cx={22} cy={22} r={18}
              fill="none" stroke={cfg.color} strokeWidth={4}
              strokeDasharray={2 * Math.PI * 18}
              strokeDashoffset={2 * Math.PI * 18 * (1 - progress / 100)}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xs font-bold" style={{ color: cfg.textColor }}>{progress}%</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: cfg.bgColor, color: cfg.textColor }}>{level}</span>
            {isOneThing && (
              <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full">
                <Star size={9} className="fill-amber-500 text-amber-500" />
                ONE Thing
              </span>
            )}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[status]}`}>
              {statusLabels[status]}
            </span>
          </div>
          <p className="text-slate-800 text-sm font-medium group-hover:text-indigo-600 transition-colors truncate mb-1">{title}</p>
          <div className="flex flex-wrap items-center gap-3">
            {area && (
              <span className="text-xs flex items-center gap-1" style={{ color: area.cor || area.color }}>
                {area.icone || area.emoji} {area.nome || area.name}
              </span>
            )}
            {parent && (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Target size={10} />
                {((parent as unknown as { titulo?: string }).titulo || (parent as unknown as { title?: string }).title || '').slice(0, 30)}…
              </span>
            )}
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar size={10} />
              {new Date(prazo).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Progress bar on mobile */}
        <div className="hidden sm:block w-28">
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
            <div
              className="h-full rounded-full"
              style={{ width: `${progress}%`, backgroundColor: cfg.color }}
            />
          </div>
        </div>

        <ArrowRight size={15} className="text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
      </Link>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 shrink-0">
        <Link
          to={`/metas/${levelPath}/${meta.id}/editar`}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
          title="Editar"
          onClick={(e) => e.stopPropagation()}
        >
          <Edit size={16} />
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
          title="Excluir"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export function MetasListPage({ level, metas, createPath, title, subtitle, focusingQuestion }: MetasListPageProps) {
  const cfg = levelConfig[level];
  const [metasList, setMetasList] = useState(metas);

  // Update local state when prop changes
  useEffect(() => {
    setMetasList(metas);
  }, [metas]);

  const handleDelete = (id: string) => {
    setMetasList(prev => prev.filter(m => m.id !== id));
  };

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
          <div className="text-xl font-bold text-slate-800">{metasList.length}</div>
          <div className="text-slate-500 text-xs mt-0.5">Total</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold" style={{ color: cfg.color }}>
            {metasList.length > 0 ? Math.round(metasList.reduce((s, m) => {
              const mAny = m as unknown;
              return s + ((mAny as { progress?: number })?.progress || (mAny as { metricas?: unknown })?.metricas ? 0 : m.progress || 0);
            }, 0) / metasList.length) : 0}%
          </div>
          <div className="text-slate-500 text-xs mt-0.5">Progresso médio</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-emerald-600">{metasList.filter(m => {
            const mAny = m as unknown;
            const status = (mAny as { status?: string })?.status || m.status;
            return status === 'ativa' || status === 'active';
          }).length}</div>
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
        {metasList.length === 0 ? (
          <EmptyState
            icon={<Target className="w-12 h-12" />}
            title={`Nenhuma ${cfg.label} criada`}
            description={`Crie uma meta para começar a tracked seu progresso.`}
            actionLabel={`Criar Primeira ${cfg.label}`}
            actionHref={createPath}
          />
        ) : (
          metasList.map(meta => <MetaRow key={meta.id} meta={meta} level={level} onDelete={handleDelete} />)
        )}
      </div>
    </div>
  );
}
