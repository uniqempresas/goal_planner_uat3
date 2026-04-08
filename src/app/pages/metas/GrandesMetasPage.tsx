import { useState } from 'react';
import { Link } from 'react-router';
import {
  Plus, Star, Mountain, ArrowRight, Target, ChevronDown, ChevronUp,
  Calendar, TrendingUp, CheckCircle2, Circle, Pause,
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import EmptyState from '../../components/empty-state/EmptyState';
import { type Meta, levelConfig } from '../../data/mockData';

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; color: string }> = {
    ativa: { label: 'Ativa', color: 'bg-emerald-100 text-emerald-700' },
    concluida: { label: 'Concluída', color: 'bg-blue-100 text-blue-700' },
    arquivada: { label: 'Arquivada', color: 'bg-slate-100 text-slate-600' },
    // Legacy mock format support
    active: { label: 'Ativa', color: 'bg-emerald-100 text-emerald-700' },
    completed: { label: 'Concluída', color: 'bg-blue-100 text-blue-700' },
    paused: { label: 'Pausada', color: 'bg-amber-100 text-amber-700' },
    not_started: { label: 'Não iniciada', color: 'bg-slate-100 text-slate-600' },
  };
  const s = map[status] || { label: status, color: 'bg-slate-100 text-slate-600' };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.color}`}>{s.label}</span>
  );
}

function SmartProgress({ meta }: { meta: Meta }) {
  if (!meta.smart?.measurable?.length) return null;
  return (
    <div className="space-y-2">
      {meta.smart.measurable.map(metric => {
        const pct = Math.min(100, Math.round((metric.current / metric.target) * 100));
        return (
          <div key={metric.id}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-500 capitalize">{metric.key}</span>
              <span className="text-xs text-slate-600">
                {metric.current.toLocaleString('pt-BR')} / {metric.target.toLocaleString('pt-BR')} {metric.unit} ({pct}%)
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: levelConfig.G.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MetaCard({ meta }: { meta: Meta }) {
  const { areas, metasAnuais } = useApp();
  const [expanded, setExpanded] = useState(false);
  
  // Handle both mock data and real database data
  const metaAny = meta as unknown;
  const areaId = (metaAny as { area_id?: string })?.area_id || meta.areaId;
  const parentId = (metaAny as { parent_id?: string })?.parent_id || meta.parentId;
  
  // Map database field names to mock format for display
  const title = (metaAny as { titulo?: string })?.titulo || meta.title;
  const description = (metaAny as { descricao?: string })?.descricao || meta.description;
  const focusingQuestion = (metaAny as { focusing_question?: string })?.focusing_question || meta.focusingQuestion;
  const isOneThing = (metaAny as { one_thing?: boolean })?.one_thing || meta.isOneThing;
  const status = (metaAny as { status?: string })?.status || meta.status;
  const prazo = (metaAny as { prazo?: string })?.prazo || meta.prazo;
  const smart = (metaAny as { smart?: unknown })?.smart || meta.smart;
  
  const area = areas.find(a => a.id === areaId);
  const children = metasAnuais.filter(m => ((m as unknown as { parent_id?: string })?.parent_id === meta.id) || m.parentId === meta.id);
  const cfg = levelConfig.G;

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-indigo-200 transition-all overflow-hidden">
      {/* Header */}
      <div className="p-5">
        <div className="flex items-start gap-3">
          {/* Progress Ring */}
          <div className="relative shrink-0 mt-0.5">
            <svg width={52} height={52} className="-rotate-90">
              <circle cx={26} cy={26} r={22} fill="none" stroke="#EEF2FF" strokeWidth={4} />
              <circle
                cx={26} cy={26} r={22}
                fill="none" stroke={cfg.color} strokeWidth={4}
                strokeDasharray={2 * Math.PI * 22}
                strokeDashoffset={2 * Math.PI * 22 * (1 - 0 / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-slate-700">0%</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold px-2 py-0.5 rounded" style={{ backgroundColor: cfg.bgColor, color: cfg.textColor }}>G</span>
                  {isOneThing && (
                    <span className="flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      <Star size={10} className="fill-amber-500 text-amber-500" />
                      ONE Thing
                    </span>
                  )}
                  <StatusBadge status={status} />
                </div>
                <h3 className="text-slate-800 font-medium leading-snug">{title}</h3>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/metas/grandes/${meta.id}`}
                  className="text-indigo-600 hover:text-indigo-800 p-1 rounded transition-colors"
                  title="Ver detalhes"
                >
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-3">{description}</p>

            <div className="flex flex-wrap items-center gap-3">
              {area && (
                <span className="flex items-center gap-1.5 text-xs" style={{ color: area.cor || area.color }}>
                  <span>{area.icone || area.emoji}</span>
                  <span>{area.nome || area.name}</span>
                </span>
              )}
              <span className="flex items-center gap-1.5 text-xs text-slate-400">
                <Calendar size={11} />
                Prazo: {new Date(prazo).toLocaleDateString('pt-BR', { year: 'numeric', month: 'short' })}
              </span>
              {children.length > 0 && (
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Target size={11} />
                  {children.length} meta{children.length !== 1 ? 's' : ''} anual
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Metrics */}
        {smart && (smart as { measurable?: unknown })?.measurable && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <SmartProgress meta={meta} />
          </div>
        )}

        {/* Focusing Question */}
        {focusingQuestion && (
          <div className="mt-4 bg-indigo-50 rounded-lg p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingUp size={12} className="text-indigo-500" />
              <span className="text-indigo-700 text-xs font-medium">Focusing Question</span>
            </div>
            <p className="text-slate-600 text-xs leading-relaxed italic line-clamp-2">{focusingQuestion}</p>
          </div>
        )}
      </div>

      {/* Expandable Children */}
      {children.length > 0 && (
        <div className="border-t border-slate-100">
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-full flex items-center justify-between px-5 py-3 text-sm text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <Target size={14} />
              Metas Anuais vinculadas ({children.length})
            </span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {expanded && (
            <div className="px-5 pb-4 space-y-2">
              {children.map(child => (
                <Link
                  key={child.id}
                  to={`/metas/anual/${child.id}`}
                  className="flex items-center gap-3 p-3 bg-slate-50 hover:bg-indigo-50 rounded-lg transition-colors group"
                >
                  <div className="w-6 h-6 rounded flex items-center justify-center shrink-0" style={{ backgroundColor: levelConfig.A.bgColor }}>
                    <span className="text-xs font-bold" style={{ color: levelConfig.A.textColor }}>A</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 truncate group-hover:text-indigo-700 transition-colors">{child.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="flex-1 h-1 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: '0%', backgroundColor: levelConfig.A.color }}
                        />
                      </div>
                      <span className="text-xs text-slate-400">0%</span>
                    </div>
                  </div>
                  <ArrowRight size={12} className="text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function GrandesMetasPage() {
  const { grandesMetas, areas } = useApp();

  const avgProgress = 0;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Mountain size={20} className="text-indigo-600" />
            <h1 className="text-slate-800">Grandes Metas</h1>
            <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">3 Anos</span>
          </div>
          <p className="text-slate-500 text-sm">Sua visão de longo prazo. Onde você quer estar em 3 anos?</p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/metas/grandes/criar"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
          >
            <Plus size={15} />
            Nova Grande Meta
          </Link>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800">{grandesMetas.length}</div>
            <div className="text-slate-500 text-xs mt-0.5">Total de Metas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-emerald-600">{grandesMetas.filter(m => m.status === 'active').length}</div>
            <div className="text-slate-500 text-xs mt-0.5">Ativas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600">{avgProgress}%</div>
            <div className="text-slate-500 text-xs mt-0.5">Progresso Médio</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-amber-600">{grandesMetas.filter(m => m.isOneThing).length}</div>
            <div className="text-slate-500 text-xs mt-0.5">ONE Thing</div>
          </div>
        </div>
      </div>

      {/* Focusing Question */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-5 mb-6 text-white">
        <p className="text-indigo-200 text-xs font-medium uppercase tracking-wide mb-2">Focusing Question · Grandes Metas</p>
        <p className="text-white italic leading-relaxed">
          "Qual é a ÚNICA coisa que posso fazer nos próximos 3 anos, de tal forma que minha vida se transforme completamente?"
        </p>
      </div>

      {/* Meta Cards */}
      <div className="space-y-5">
        {grandesMetas.length === 0 ? (
          <EmptyState
            icon={<Mountain className="w-12 h-12" />}
            title="Nenhuma Grande Meta criada"
            description="Crie sua primeira Grande Meta (3 anos) para começar a construir sua visão de longo prazo."
            actionLabel="Criar Primeira Grande Meta"
            actionHref="/metas/grandes/criar"
          />
        ) : (
          grandesMetas.map(meta => (
            <MetaCard key={meta.id} meta={meta} />
          ))
        )}
      </div>

      {/* Empty hint */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center">
        <p className="text-slate-400 text-sm">
          Lembre-se: você não precisa de muitas grandes metas. Foque nas que realmente transformarão sua vida.
        </p>
      </div>
    </div>
  );
}
