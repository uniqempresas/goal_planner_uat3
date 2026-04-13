import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, TrendingUp, Target, BarChart2, Calendar, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import EmptyState from '../../components/empty-state/EmptyState';
import { revisoesMensaisService } from '../../../services/revisoesMensaisService';

const meses = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const checklistItems = [
  { id: 'c1', label: 'Revisar progresso de todas as metas mensais' },
  { id: 'c2', label: 'Avaliar métricas SMART de cada meta' },
  { id: 'c3', label: 'Verificar alinhamento com metas anuais' },
  { id: 'c4', label: 'Identificar obstáculos do mês' },
  { id: 'c5', label: 'Definir ONE Thing do próximo mês' },
  { id: 'c6', label: 'Criar metas mensais para o próximo mês' },
  { id: 'c7', label: 'Revisar progresso nas métricas das grandes metas' },
  { id: 'c8', label: 'Celebrar conquistas do mês' },
];

export default function RevisaoMensalPage() {
  const { user, metasMensais, metasAnuais, areas, getAreaById } = useApp();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  
  const [reflection, setReflection] = useState('');
  const [vitoria, setVitoria] = useState('');
  const [aprendizados, setAprendizados] = useState('');
  const [focoProximoMes, setFocoProximoMes] = useState('');
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [revisaoId, setRevisaoId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadRevisao();
    }
  }, [user, currentMonth, currentYear]);

  async function loadRevisao() {
    if (!user) return;
    
    try {
      setLoading(true);
      const revisao = await revisoesMensaisService.getByMesAno(user.id, currentMonth + 1, currentYear);
      
      if (revisao) {
        setRevisaoId(revisao.id);
        setReflection(revisao.reflexao || '');
        setVitoria(revisao.vitoria || '');
        setAprendizados(revisao.aprendizados || '');
        setFocoProximoMes(revisao.foco_proximo_mes || '');
        
        if (revisao.checklist && Array.isArray(revisao.checklist)) {
          setChecked(new Set(revisao.checklist as string[]));
        }
      } else {
        setRevisaoId(null);
        setReflection('');
        setVitoria('');
        setAprendizados('');
        setFocoProximoMes('');
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
      await revisoesMensaisService.saveOrUpdate(user.id, currentMonth + 1, currentYear, {
        checklist: Array.from(checked),
        reflexao: reflection,
        vitoria: vitoria,
        aprendizados: aprendizados,
        foco_proximo_mes: focoProximoMes,
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

  const toggle = (id: string) => setChecked(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  const isCurrentMonth = currentMonth === today.getMonth() && currentYear === today.getFullYear();

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-3">
            <h1 className="text-slate-800">Revisão Mensal</h1>
            <span className="bg-violet-100 text-violet-700 text-xs px-2 py-0.5 rounded-full">
              {meses[currentMonth]} {currentYear}
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
                if (currentMonth === 0) {
                  setCurrentMonth(11);
                  setCurrentYear(currentYear - 1);
                } else {
                  setCurrentMonth(currentMonth - 1);
                }
              }}
              className="p-1 hover:bg-slate-100 rounded-lg"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => {
                if (currentMonth === 11) {
                  setCurrentMonth(0);
                  setCurrentYear(currentYear + 1);
                } else {
                  setCurrentMonth(currentMonth + 1);
                }
              }}
              className="p-1 hover:bg-slate-100 rounded-lg"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <p className="text-slate-500 text-sm">
          {isCurrentMonth ? 'Este mês · ' : ''}Retrospectiva e planejamento
        </p>
      </div>

      {/* Month Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-violet-600">
            {metasMensais.filter(m => m.status === 'concluida').length}
          </div>
          <div className="text-slate-400 text-xs mt-0.5">Metas atingidas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-emerald-600">
            {metasMensais.filter(m => m.status === 'ativa').length}
          </div>
          <div className="text-slate-400 text-xs mt-0.5">Em andamento</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-amber-600">{metasMensais.length}</div>
          <div className="text-slate-400 text-xs mt-0.5">Total de metas</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-3 text-center">
          <div className="text-xl font-bold text-indigo-600">{metasAnuais.length}</div>
          <div className="text-slate-400 text-xs mt-0.5">Metas anuais</div>
        </div>
      </div>

      {/* Metas Mensais Progress */}
      {metasMensais.length === 0 ? (
        <EmptyState
          icon={<Calendar className="w-12 h-12" />}
          title="Nenhuma meta mensal criada"
          description="Crie metas mensais para ter o que avaliar nesta revisão."
          actionLabel="Criar Meta Mensal"
          actionHref="/metas/mensais/criar"
        />
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="text-slate-700 text-sm mb-4">Resultado das Metas Mensais</h3>
          <div className="space-y-4">
            {metasMensais.map(meta => {
              const area = meta.area_id ? getAreaById(meta.area_id) : undefined;
              return (
                <div key={meta.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {area && <span className="text-sm">{area.icone}</span>}
                      <span className="text-slate-700 text-sm">{meta.titulo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        meta.status === 'concluida' ? 'bg-emerald-100 text-emerald-700' : 
                        meta.status === 'arquivada' ? 'bg-gray-100 text-gray-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {meta.status === 'concluida' ? 'Concluída' : 
                         meta.status === 'arquivada' ? 'Arquivada' : 'Ativa'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Areas overview */}
      {areas.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} className="text-indigo-500" />
            <h3 className="text-slate-700 text-sm">Áreas de Vida — Visão Geral</h3>
          </div>
          <div className="space-y-3">
            {areas.map(area => (
              <div key={area.id} className="flex items-center gap-3">
                <span className="text-lg w-8 text-center">{area.icone}</span>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-slate-600 text-xs">{area.nome}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
        <h3 className="text-slate-700 text-sm mb-4">Checklist de Revisão Mensal</h3>
        <div className="space-y-2">
          {checklistItems.map(item => (
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
            <span className="text-indigo-600 font-medium">{checked.size}/{checklistItems.length}</span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{ width: `${Math.round((checked.size / checklistItems.length) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Reflection */}
      <div className="space-y-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-slate-700 text-sm font-medium mb-2">
            🏆 Grande vitória do mês
          </label>
          <textarea
            value={vitoria}
            onChange={e => setVitoria(e.target.value)}
            className="w-full h-20 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-violet-300 transition-colors"
            placeholder="Qual foi a maior conquista deste mês?"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-slate-700 text-sm font-medium mb-2">
            💡 Aprendizados importantes
          </label>
          <textarea
            value={aprendizados}
            onChange={e => setAprendizados(e.target.value)}
            className="w-full h-24 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-violet-300 transition-colors"
            placeholder="Quais foram as principais lições aprendidas?"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-slate-700 text-sm font-medium mb-2">
            ✍️ Reflexão geral
          </label>
          <textarea
            value={reflection}
            onChange={e => setReflection(e.target.value)}
            rows={4}
            className="w-full text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-violet-300 transition-colors"
            placeholder="O que foi mais significativo este mês? O que você faria diferente?"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <label className="block text-slate-700 text-sm font-medium mb-2">
            🎯 Foco para o próximo mês
          </label>
          <textarea
            value={focoProximoMes}
            onChange={e => setFocoProximoMes(e.target.value)}
            className="w-full h-20 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-violet-300 transition-colors"
            placeholder="Qual será o foco principal do próximo mês?"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-medium transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Salvando...
            </>
          ) : (
            <>
              <Save size={18} />
              Salvar Revisão Mensal ✓
            </>
          )}
        </button>
      </div>
    </div>
  );
}
