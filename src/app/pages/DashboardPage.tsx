import { Link } from 'react-router';
import {
  Star, TrendingUp, CheckCircle2, Target, ArrowRight,
  Flame, Calendar, BarChart2, Mountain, Zap,
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { levelConfig } from '../data/mockData';

function ProgressRing({ progress, size = 56, stroke = 5, color = '#4F46E5' }: { progress: number; size?: number; stroke?: number; color?: string }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (progress / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E2E8F0" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.5s ease' }}
      />
    </svg>
  );
}

export default function DashboardPage() {
  const { user, areas, grandesMetas, metasAnuais, weeklyStats, tarefasHoje } = useApp();

  const oneThing = tarefasHoje.find(t => t.block === 'oneThing');
  const completedToday = tarefasHoje.filter(t => t.completed).length;
  const totalToday = tarefasHoje.length;
  const progressPercent = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  // Data atual formatada
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const stats = [
    {
      label: 'Tarefas hoje',
      value: `${completedToday}/${totalToday}`,
      icon: <CheckCircle2 size={18} className="text-emerald-500" />,
      color: 'text-emerald-600',
      sub: `${progressPercent}% concluído`,
    },
    {
      label: 'Sequência',
      value: `${weeklyStats?.sequenciaDias || 0} dias`,
      icon: <Flame size={18} className="text-orange-500" />,
      color: 'text-orange-600',
      sub: 'Melhor sequência',
    },
    {
      label: 'Foco esta semana',
      value: `${weeklyStats?.produtividade || 0}%`,
      icon: <Zap size={18} className="text-indigo-500" />,
      color: 'text-indigo-600',
      sub: `${weeklyStats?.tarefasConcluidas || 0}/${weeklyStats?.tarefasTotal || 0} tarefas`,
    },
    {
      label: 'Metas',
      value: `${weeklyStats?.metasConcluidas || 0}`,
      icon: <BarChart2 size={18} className="text-purple-500" />,
      color: 'text-purple-600',
      sub: 'Concluídas',
    },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-slate-800 mb-0.5">Olá, {user?.name?.split(' ')[0] ?? 'Visitante'} 👋</h1>
          <p className="text-slate-500 text-sm">{todayFormatted}</p>
        </div>
        <div className="flex gap-2">
          <Link to="/agenda/hoje" className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <Calendar size={15} />
            Ver Agenda de Hoje
          </Link>
        </div>
      </div>

      {/* ONE Thing Banner */}
      {oneThing && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-2xl p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-400 rounded-xl flex items-center justify-center shrink-0">
              <Star size={22} className="text-white fill-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-amber-700 text-xs font-semibold uppercase tracking-wide">⭐ ONE Thing do Dia</span>
                <span className="bg-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full">Prioridade Máxima</span>
              </div>
              <p className="text-slate-800 font-medium mb-1">{oneThing.titulo}</p>
              {oneThing.descricao && (
                <p className="text-slate-500 text-sm">{oneThing.descricao}</p>
              )}
            </div>
            <Link
              to="/agenda/hoje"
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white px-3 py-2 rounded-lg text-sm transition-colors shrink-0"
            >
              Ir para Agenda
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              {stat.icon}
              <span className="text-slate-500 text-sm">{stat.label}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color} mb-0.5`}>{stat.value}</div>
            <div className="text-slate-400 text-xs">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grandes Metas */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Mountain size={18} className="text-indigo-600" />
              <h3 className="text-slate-800">Grandes Metas</h3>
              <span className="bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full">3 anos</span>
            </div>
            <Link to="/metas/grandes" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition-colors">
              Ver todas <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-4">
            {grandesMetas.map(meta => {
              const area = areas.find(a => a.id === meta.area_id);
              const cfg = levelConfig.G;
              const progress = 0;
              return (
                <Link key={meta.id} to={`/metas/grandes/${meta.id}`} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                  <div className="relative shrink-0">
                    <ProgressRing progress={progress} size={52} stroke={4} color={cfg.color} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-semibold text-slate-700">{progress}%</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {meta.one_thing && <Star size={12} className="text-amber-500 fill-amber-500 shrink-0" />}
                      <p className="text-slate-800 text-sm font-medium truncate group-hover:text-indigo-600 transition-colors">{meta.titulo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {area && (
                        <span className="text-xs" style={{ color: area.cor }}>
                          {area.icone} {area.nome}
                        </span>
                      )}
                      <span className="text-slate-400 text-xs">· {new Date(meta.created_at).getFullYear()}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${progress}%`, backgroundColor: cfg.color }}
                      />
                    </div>
                  </div>
                  <ArrowRight size={15} className="text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Áreas de Vida */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-slate-800">Áreas de Vida</h3>
              <Link to="/areas" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition-colors">
                Ver <ArrowRight size={13} />
              </Link>
            </div>
            <div className="space-y-3">
              {areas.slice(0, 4).map(area => (
                <div key={area.id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-slate-600 flex items-center gap-1.5">
                      <span>{area.icone}</span>
                      <span>{area.nome}</span>
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: '0%', backgroundColor: area.cor }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Metas Anuais */}
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-violet-600" />
                <h3 className="text-slate-800">Metas Anuais</h3>
              </div>
              <Link to="/metas/anual" className="text-indigo-600 text-sm flex items-center gap-1 hover:text-indigo-800 transition-colors">
                Ver <ArrowRight size={13} />
              </Link>
            </div>
            <div className="space-y-3">
              {metasAnuais.slice(0, 3).map(meta => {
                const progress = 0;
                return (
                  <div key={meta.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: levelConfig.A.bgColor }}>
                      <span className="text-xs font-bold" style={{ color: levelConfig.A.textColor }}>A</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-700 text-sm truncate">{meta.titulo}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${progress}%`, backgroundColor: levelConfig.A.color }}
                          />
                        </div>
                        <span className="text-xs text-slate-400 shrink-0">{progress}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Focusing Question Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl p-5 text-white">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-indigo-200" />
              <span className="text-indigo-200 text-xs font-medium uppercase tracking-wide">Focusing Question</span>
            </div>
            <p className="text-white text-sm leading-relaxed italic">
              "Qual é a ÚNICA coisa que posso fazer <strong>agora</strong>, de tal forma que tudo o mais se torne mais fácil ou desnecessário?"
            </p>
            <div className="mt-4 pt-3 border-t border-white/20">
              <p className="text-indigo-200 text-xs">— Gary Keller, A Única Coisa</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
