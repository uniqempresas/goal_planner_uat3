import { Trophy, Star, Flame, Target, Zap, CheckCircle2, Lock } from 'lucide-react';

interface Conquista {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  unlocked: boolean;
  date?: string;
  progress?: number;
  total?: number;
}

const conquistas: Conquista[] = [
  {
    id: 'c1',
    title: 'Primeira Meta',
    description: 'Criou sua primeira meta no sistema',
    icon: <Target size={24} />,
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    unlocked: true,
    date: '15/01/2025',
  },
  {
    id: 'c2',
    title: 'Uma Semana de Fogo',
    description: 'Manteve 7 dias consecutivos de hábitos',
    icon: <Flame size={24} />,
    color: '#EA580C',
    bgColor: '#FFF7ED',
    unlocked: true,
    date: '22/01/2025',
  },
  {
    id: 'c3',
    title: 'Foco Total',
    description: 'Completou 30 dias seguidos definindo a ONE Thing',
    icon: <Star size={24} />,
    color: '#D97706',
    bgColor: '#FFFBEB',
    unlocked: true,
    date: '15/02/2025',
  },
  {
    id: 'c4',
    title: 'Estrategista',
    description: 'Criou sua hierarquia completa G → A → M → S → D',
    icon: <Trophy size={24} />,
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    unlocked: true,
    date: '20/01/2025',
  },
  {
    id: 'c5',
    title: 'Produtividade Máxima',
    description: 'Completou 100% das tarefas em 5 dias consecutivos',
    icon: <CheckCircle2 size={24} />,
    color: '#059669',
    bgColor: '#ECFDF5',
    unlocked: true,
    date: '01/03/2025',
  },
  {
    id: 'c6',
    title: '1000 Horas',
    description: 'Acumulou 1000 horas de foco registradas',
    icon: <Zap size={24} />,
    color: '#0891B2',
    bgColor: '#ECFEFF',
    unlocked: false,
    progress: 462,
    total: 1000,
  },
  {
    id: 'c7',
    title: 'Mestre da Consistência',
    description: 'Manteve 90 dias consecutivos de hábitos',
    icon: <Flame size={24} />,
    color: '#DC2626',
    bgColor: '#FEF2F2',
    unlocked: false,
    progress: 14,
    total: 90,
  },
  {
    id: 'c8',
    title: 'Grande Conquista',
    description: 'Completou uma Grande Meta (3 anos)',
    icon: <Trophy size={24} />,
    color: '#D97706',
    bgColor: '#FFFBEB',
    unlocked: false,
    progress: 1,
    total: 3,
  },
  {
    id: 'c9',
    title: 'Revisor Dedicado',
    description: 'Realizou 12 revisões semanais consecutivas',
    icon: <Star size={24} />,
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    unlocked: false,
    progress: 7,
    total: 12,
  },
];

function ConquistaCard({ conquista }: { conquista: Conquista }) {
  return (
    <div className={`bg-white rounded-xl border-2 p-5 transition-all ${conquista.unlocked ? 'border-slate-200 hover:border-slate-300 hover:shadow-sm' : 'border-slate-100 opacity-60'}`}>
      <div className="flex items-start gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: conquista.unlocked ? conquista.bgColor : '#F1F5F9' }}
        >
          {conquista.unlocked
            ? <span style={{ color: conquista.color }}>{conquista.icon}</span>
            : <Lock size={22} className="text-slate-300" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className={`text-sm font-semibold ${conquista.unlocked ? 'text-slate-800' : 'text-slate-400'}`}>
              {conquista.title}
            </h3>
            {conquista.unlocked
              ? <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full shrink-0">Desbloqueada</span>
              : <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full shrink-0">Bloqueada</span>
            }
          </div>
          <p className="text-slate-500 text-xs leading-relaxed mb-2">{conquista.description}</p>
          {conquista.unlocked && conquista.date && (
            <p className="text-slate-400 text-xs">Conquistado em {conquista.date}</p>
          )}
          {!conquista.unlocked && conquista.progress !== undefined && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-xs text-slate-400">Progresso</span>
                <span className="text-xs text-slate-500">{conquista.progress}/{conquista.total}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-indigo-400"
                  style={{ width: `${Math.round((conquista.progress! / conquista.total!) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConquistasPage() {
  const unlocked = conquistas.filter(c => c.unlocked);
  const locked = conquistas.filter(c => !c.unlocked);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Trophy size={20} className="text-amber-500" />
          <h1 className="text-slate-800">Conquistas</h1>
        </div>
        <p className="text-slate-500 text-sm">Reconhecimento pelo seu progresso e consistência.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-4 text-white text-center">
          <div className="text-3xl font-bold">{unlocked.length}</div>
          <div className="text-amber-100 text-xs mt-1">Desbloqueadas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-3xl font-bold text-slate-600">{locked.length}</div>
          <div className="text-slate-400 text-xs mt-1">Bloqueadas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4 text-center">
          <div className="text-3xl font-bold text-indigo-600">
            {Math.round((unlocked.length / conquistas.length) * 100)}%
          </div>
          <div className="text-slate-400 text-xs mt-1">Completado</div>
        </div>
      </div>

      {/* Unlocked */}
      <div className="mb-8">
        <h2 className="text-slate-700 mb-4 flex items-center gap-2">
          <CheckCircle2 size={16} className="text-emerald-500" />
          Desbloqueadas ({unlocked.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {unlocked.map(c => <ConquistaCard key={c.id} conquista={c} />)}
        </div>
      </div>

      {/* Locked */}
      <div>
        <h2 className="text-slate-400 mb-4 flex items-center gap-2">
          <Lock size={16} />
          Em progresso ({locked.length})
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {locked.map(c => <ConquistaCard key={c.id} conquista={c} />)}
        </div>
      </div>
    </div>
  );
}
