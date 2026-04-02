import { useState } from 'react';
import { CheckCircle2, Circle, TrendingUp, Target, BarChart2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export default function RevisaoMensalPage() {
  const { metasMensais, metasAnuais, areas } = useApp();
  const [reflection, setReflection] = useState('');
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const checklist = [
    { id: 'c1', label: 'Revisar progresso de todas as metas mensais' },
    { id: 'c2', label: 'Avaliar métricas SMART de cada meta' },
    { id: 'c3', label: 'Verificar alinhamento com metas anuais' },
    { id: 'c4', label: 'Identificar obstáculos do mês' },
    { id: 'c5', label: 'Definir ONE Thing do próximo mês' },
    { id: 'c6', label: 'Criar metas mensais para o próximo mês' },
    { id: 'c7', label: 'Revisar progresso nas métricas das grandes metas' },
    { id: 'c8', label: 'Celebrar conquistas do mês' },
  ];

  const toggle = (id: string) => setChecked(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const avgProgress = metasMensais.length > 0
    ? Math.round(metasMensais.reduce((s, m) => s + m.progress, 0) / metasMensais.length)
    : 0;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-slate-800">Revisão Mensal</h1>
          <span className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full">Março 2025</span>
        </div>
        <p className="text-slate-500 text-sm">Retrospectiva do mês · Planejamento de Abril</p>
      </div>

      {/* Month Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-violet-600">{avgProgress}%</div>
          <div className="text-slate-400 text-xs mt-0.5">Progresso médio</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-emerald-600">{metasMensais.filter(m => m.progress >= 80).length}</div>
          <div className="text-slate-400 text-xs mt-0.5">Metas atingidas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-amber-600">{metasMensais.length}</div>
          <div className="text-slate-400 text-xs mt-0.5">Total de metas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-indigo-600">{metasAnuais.length}</div>
          <div className="text-slate-400 text-xs mt-0.5">Metas anuais ativas</div>
        </div>
      </div>

      {/* Metas Mensais Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="text-slate-700 text-sm mb-4">Resultado das Metas Mensais</h3>
        <div className="space-y-4">
          {metasMensais.map(meta => {
            const area = areas.find(a => a.id === meta.areaId);
            return (
              <div key={meta.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {area && <span className="text-sm">{area.emoji}</span>}
                    <span className="text-slate-700 text-sm">{meta.title}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-600">{meta.progress}%</span>
                    {meta.progress >= 80 ? (
                      <CheckCircle2 size={14} className="text-emerald-500" />
                    ) : (
                      <TrendingUp size={14} className="text-amber-500" />
                    )}
                  </div>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${meta.progress}%`,
                      backgroundColor: meta.progress >= 80 ? '#10B981' : meta.progress >= 50 ? '#F59E0B' : '#EF4444'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Areas overview */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart2 size={16} className="text-indigo-500" />
          <h3 className="text-slate-700 text-sm">Áreas de Vida — Progresso do Mês</h3>
        </div>
        <div className="space-y-3">
          {areas.map(area => (
            <div key={area.id} className="flex items-center gap-3">
              <span className="text-lg w-8 text-center">{area.emoji}</span>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-slate-600 text-xs">{area.name}</span>
                  <span className="text-xs font-medium" style={{ color: area.color }}>{area.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${area.progress}%`, backgroundColor: area.color }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="text-slate-700 text-sm mb-4">Checklist de Revisão Mensal</h3>
        <div className="space-y-2">
          {checklist.map(item => (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={`w-full flex items-center gap-3 p-2.5 rounded-lg text-left transition-colors cursor-pointer ${checked.has(item.id) ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
            >
              {checked.has(item.id)
                ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                : <Circle size={16} className="text-slate-300 shrink-0" />
              }
              <span className={`text-sm ${checked.has(item.id) ? 'line-through text-slate-400' : 'text-slate-600'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500">Progresso</span>
            <span className="text-indigo-600 font-medium">{checked.size}/{checklist.length}</span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${Math.round((checked.size / checklist.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <label className="block text-slate-700 text-sm font-medium mb-3">
          ✍️ Reflexão do mês — O que foi mais importante?
        </label>
        <textarea
          value={reflection}
          onChange={e => setReflection(e.target.value)}
          rows={5}
          className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-indigo-300 transition-colors"
          placeholder="O que foi mais significativo este mês? Quais foram as maiores lições? O que você faria diferente?"
        />
      </div>

      <button className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-medium transition-colors cursor-pointer">
        Concluir Revisão Mensal ✓
      </button>
    </div>
  );
}
