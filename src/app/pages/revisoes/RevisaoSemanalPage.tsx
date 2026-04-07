import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, ChevronRight, Star, TrendingUp, AlertTriangle, Target, Save, ChevronLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import EmptyState from '../../components/empty-state/EmptyState';
import { revisoesSemanaisService } from '../../../services/revisoesSemanaisService';

const checklistItems = [
  { id: 'r1', step: 'Revisar tarefas da semana', desc: 'O que foi feito? O que ficou pendente?', category: 'retrospectiva' },
  { id: 'r2', step: 'Avaliar progresso das metas semanais', desc: 'Cada meta semanal avançou? Por quê?', category: 'retrospectiva' },
  { id: 'r3', step: 'Identificar os 3 maiores aprendizados', desc: 'O que a semana me ensinou?', category: 'reflexao' },
  { id: 'r4', step: 'Definir ONE Thing da próxima semana', desc: 'Qual é a prioridade absoluta?', category: 'planejamento' },
  { id: 'r5', step: 'Criar metas semanais (S) para a próxima semana', desc: 'Alinhadas com as metas mensais (M)', category: 'planejamento' },
  { id: 'r6', step: 'Distribuir tarefas nos dias', desc: 'Time blocking para cada dia', category: 'planejamento' },
  { id: 'r7', step: 'Revisar hábitos da semana', desc: 'Quantos dias cada hábito foi mantido?', category: 'habitos' },
];

const categoryConfig = {
  retrospectiva: { label: 'Retrospectiva', color: '#4F46E5', bg: '#EEF2FF' },
  reflexao: { label: 'Reflexão', color: '#7C3AED', bg: '#F5F3FF' },
  planejamento: { label: 'Planejamento', color: '#059669', bg: '#ECFDF5' },
  habitos: { label: 'Hábitos', color: '#D97706', bg: '#FFFBEB' },
};

function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

function getWeekDates(year: number, week: number): { start: Date; end: Date } {
  const januaryFirst = new Date(year, 0, 1);
  const daysToAdd = (week - 1) * 7 - januaryFirst.getDay() + 1;
  const start = new Date(year, 0, daysToAdd + 1);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return { start, end };
}

export default function RevisaoSemanalPage() {
  const { user, metasSemanais, weeklyStats } = useApp();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const today = new Date();
  const [currentWeek, setCurrentWeek] = useState(getWeekNumber(today));
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [reflection, setReflection] = useState('');
  const [weekWin, setWeekWin] = useState('');
  const [revisaoId, setRevisaoId] = useState<string | null>(null);

  const semanaStr = `${currentYear}-W${currentWeek.toString().padStart(2, '0')}`;
  const { start, end } = getWeekDates(currentYear, currentWeek);

  useEffect(() => {
    if (user) {
      loadRevisao();
    }
  }, [user, currentWeek, currentYear]);

  async function loadRevisao() {
    if (!user) return;
    
    try {
      setLoading(true);
      const revisao = await revisoesSemanaisService.getBySemana(user.id, semanaStr);
      
      if (revisao) {
        setRevisaoId(revisao.id);
        setReflection(revisao.reflexao || '');
        setWeekWin(revisao.vitoria || '');
        
        if (revisao.checklist && Array.isArray(revisao.checklist)) {
          setChecked(new Set(revisao.checklist as string[]));
        }
      } else {
        setRevisaoId(null);
        setReflection('');
        setWeekWin('');
        setChecked(new Set());
      }
    } catch (error) {
      console.error('Erro ao carregar revisão:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!user) return;
    
    try {
      setSaving(true);
      await revisoesSemanaisService.saveOrUpdate(user.id, semanaStr, {
        checklist: Array.from(checked),
        reflexao: reflection,
        vitoria: weekWin,
      });
      
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Erro ao salvar revisão:', error);
      alert('Erro ao salvar revisão. Tente novamente.');
    } finally {
      setSaving(false);
    }
  }

  const toggleCheck = (id: string) => {
    setChecked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const progress = Math.round((checked.size / checklistItems.length) * 100);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' });
  };

  const isCurrentWeek = currentWeek === getWeekNumber(today) && currentYear === today.getFullYear();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <h1 className="text-slate-800">Revisão Semanal</h1>
            <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
              Semana {currentWeek}
            </span>
            {saved && (
              <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={12} />
                Salvo!
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (currentWeek === 1) {
                  setCurrentWeek(52);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentWeek(currentWeek - 1);
                }
              }}
              className="p-1 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm text-slate-600">
              {formatDate(start)} — {formatDate(end)}
            </span>
            <button
              onClick={() => {
                if (currentWeek === 52) {
                  setCurrentWeek(1);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentWeek(currentWeek + 1);
                }
              }}
              className="p-1 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <p className="text-slate-500 text-sm">
          {isCurrentWeek ? 'Esta semana · ' : ''}Segunda é sagrada para planejar
        </p>
      </div>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-slate-700 text-sm">Revisão completa</span>
          <span className="text-indigo-600 text-sm font-medium">{checked.size}/{checklistItems.length} etapas</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Week Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-emerald-600">{weeklyStats.tarefasConcluidas}</div>
          <div className="text-slate-400 text-xs mt-0.5">Tarefas feitas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-indigo-600">{weeklyStats.produtividade}%</div>
          <div className="text-slate-400 text-xs mt-0.5">Produtividade</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-amber-600">{weeklyStats.sequenciaDias}</div>
          <div className="text-slate-400 text-xs mt-0.5">Dias seguidos</div>
        </div>
      </div>

      {/* Metas da Semana */}
      {metasSemanais.length === 0 ? (
        <EmptyState
          icon={<Target className="w-12 h-12" />}
          title="Nenhuma meta semanal criada"
          description="Crie metas semanais para ter o que avaliar nesta revisão."
          actionLabel="Criar Meta Semanal"
          actionHref="/metas/semanal/criar"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="text-slate-700 text-sm mb-3">Metas Semanais — Como foi?</h3>
          <div className="space-y-3">
            {metasSemanais.map(meta => (
              <div key={meta.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50">
                {meta.status === 'concluida' ? (
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                ) : (
                  <TrendingUp size={16} className="text-amber-500 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-slate-700 text-sm truncate">{meta.titulo}</p>
                  <p className="text-xs text-slate-400">{meta.status === 'concluida' ? 'Concluída' : 'Em andamento'}</p>
                </div>
                {meta.one_thing && <Star size={12} className="text-amber-500 fill-amber-400 shrink-0" />}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="text-slate-700 text-sm mb-4">Checklist de Revisão</h3>
        <div className="space-y-2">
          {checklistItems.map(item => {
            const done = checked.has(item.id);
            const catCfg = categoryConfig[item.category as keyof typeof categoryConfig];
            return (
              <button
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer ${done ? 'bg-emerald-50' : 'hover:bg-slate-50'}`}
              >
                {done
                  ? <CheckCircle2 size={18} className="text-emerald-500 mt-0.5 shrink-0" />
                  : <Circle size={18} className="text-slate-300 mt-0.5 shrink-0" />
                }
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className={`text-sm font-medium ${done ? 'line-through text-slate-400' : 'text-slate-700'}`}>{item.step}</p>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: catCfg.bg, color: catCfg.color }}>
                      {catCfg.label}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs">{item.desc}</p>
                </div>
                <ChevronRight size={14} className="text-slate-300 mt-0.5 shrink-0" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Reflection */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-slate-700 text-sm font-medium mb-2">
            🏆 Grande vitória da semana
          </label>
          <textarea
            value={weekWin}
            onChange={e => setWeekWin(e.target.value)}
            className="w-full h-20 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-indigo-300 transition-colors"
            placeholder="Qual foi o maior resultado desta semana?"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-slate-700 text-sm font-medium mb-2">
            💡 Aprendizados e ajustes
          </label>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            className="w-full h-24 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-indigo-300 transition-colors"
            placeholder="O que aprendi? O que farei diferente na próxima semana?"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={18} />
              Salvar Revisão Semanal ✓
            </>
          )}
        </button>
      </div>
    </div>
  );
}
