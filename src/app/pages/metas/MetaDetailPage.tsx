import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Edit, Trash2, CheckCircle, Calendar, Target, Star,
  FileText, HelpCircle, LayoutGrid, GitBranch, ArrowUp,
  ChevronRight, Plus, ListChecks
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { metasService, type MetaNivel } from '../../../services/metasService';
import { tarefasService } from '../../../services/tarefasService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Checkbox } from '../../components/ui/checkbox';
import { Skeleton } from '../../components/ui/skeleton';
import type { Database } from '../../../lib/supabase';

type Meta = Database['public']['Tables']['metas']['Row'];
type Tarefa = Database['public']['Tables']['tarefas']['Row'];

// --- Configuracao por Nivel ---
const NIVEL_CONFIG: Record<MetaNivel, {
  label: string;
  labelPlural: string;
  emoji: string;
  cor: string;
  corTexto: string;
  corBg: string;
  corBorda: string;
  corBgHover: string;
  corBordaHover: string;
  corTextoHover: string;
  corSolid: string;
  corSolidHover: string;
  proximoNivel: MetaNivel;
  proximoPath: string;
  proximoLabel: string;
}> = {
  grande: {
    label: 'Grande Meta',
    labelPlural: 'Grandes Metas',
    emoji: '\ud83c\udfaf',
    cor: 'indigo',
    corTexto: 'text-indigo-600',
    corBg: 'bg-indigo-50',
    corBorda: 'border-indigo-200',
    corBgHover: 'hover:bg-indigo-50',
    corBordaHover: 'hover:border-indigo-300',
    corTextoHover: 'hover:text-indigo-600',
    corSolid: 'bg-indigo-600',
    corSolidHover: 'hover:bg-indigo-700',
    proximoNivel: 'anual',
    proximoPath: 'anuais',
    proximoLabel: 'Anual',
  },
  anual: {
    label: 'Meta Anual',
    labelPlural: 'Metas Anuais',
    emoji: '\ud83d\udcc5',
    cor: 'violet',
    corTexto: 'text-violet-600',
    corBg: 'bg-violet-50',
    corBorda: 'border-violet-200',
    corBgHover: 'hover:bg-violet-50',
    corBordaHover: 'hover:border-violet-300',
    corTextoHover: 'hover:text-violet-600',
    corSolid: 'bg-violet-600',
    corSolidHover: 'hover:bg-violet-700',
    proximoNivel: 'mensal',
    proximoPath: 'mensais',
    proximoLabel: 'Mensal',
  },
  mensal: {
    label: 'Meta Mensal',
    labelPlural: 'Metas Mensais',
    emoji: '\ud83d\udcc8',
    cor: 'emerald',
    corTexto: 'text-emerald-600',
    corBg: 'bg-emerald-50',
    corBorda: 'border-emerald-200',
    corBgHover: 'hover:bg-emerald-50',
    corBordaHover: 'hover:border-emerald-300',
    corTextoHover: 'hover:text-emerald-600',
    corSolid: 'bg-emerald-600',
    corSolidHover: 'hover:bg-emerald-700',
    proximoNivel: 'semanal',
    proximoPath: 'semanais',
    proximoLabel: 'Semanal',
  },
  semanal: {
    label: 'Meta Semanal',
    labelPlural: 'Metas Semanais',
    emoji: '\u26a1',
    cor: 'amber',
    corTexto: 'text-amber-600',
    corBg: 'bg-amber-50',
    corBorda: 'border-amber-200',
    corBgHover: 'hover:bg-amber-50',
    corBordaHover: 'hover:border-amber-300',
    corTextoHover: 'hover:text-amber-600',
    corSolid: 'bg-amber-600',
    corSolidHover: 'hover:bg-amber-700',
    proximoNivel: 'diaria',
    proximoPath: 'diarias',
    proximoLabel: 'Diária',
  },
  diaria: {
    label: 'Meta Diária',
    labelPlural: 'Metas Diárias',
    emoji: '\u2705',
    cor: 'rose',
    corTexto: 'text-rose-600',
    corBg: 'bg-rose-50',
    corBorda: 'border-rose-200',
    corBgHover: 'hover:bg-rose-50',
    corBordaHover: 'hover:border-rose-300',
    corTextoHover: 'hover:text-rose-600',
    corSolid: 'bg-rose-600',
    corSolidHover: 'hover:bg-rose-700',
    proximoNivel: 'diaria',
    proximoPath: 'diarias',
    proximoLabel: 'Diária',
  },
};

// --- Componentes Auxiliares ---

function ProgressCircle({ progresso, cor }: { progresso: number; cor: string }) {
  const raio = 42;
  const circunferencia = 2 * Math.PI * raio;

  const config = NIVEL_CONFIG[cor as MetaNivel] || NIVEL_CONFIG.grande;

  return (
    <motion.div
      className="relative flex items-center justify-center"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <svg viewBox="0 0 100 100" className="w-32 h-32 md:w-40 md:h-40 transform -rotate-90">
        <circle cx="50" cy="50" r={raio} fill="none" stroke="#f1f5f9" strokeWidth="8" />
        <motion.circle
          cx="50" cy="50" r={raio} fill="none"
          stroke="currentColor" strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circunferencia}
          initial={{ strokeDashoffset: circunferencia }}
          animate={{ strokeDashoffset: circunferencia * (1 - progresso / 100) }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className={config.corTexto}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={`text-4xl md:text-5xl font-extrabold ${config.corTexto}`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {progresso}%
        </motion.span>
      </div>
    </motion.div>
  );
}

function EmptyState({ icon, title, description, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-10 text-center"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-medium text-slate-700 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">{description}</p>
      {action}
    </motion.div>
  );
}

function MetaDetailSkeleton() {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-start gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="w-2/3 h-8" />
          <div className="flex gap-2">
            <Skeleton className="w-20 h-5" />
            <Skeleton className="w-24 h-5" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Skeleton className="h-64 lg:col-span-1 rounded-xl" />
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-32 rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        </div>
      </div>
      <Skeleton className="h-48 rounded-xl" />
    </div>
  );
}

// --- Pagina Principal ---

export default function MetaDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { getAreaById, loadMetas } = useApp();

  const [meta, setMeta] = useState<Meta | null>(null);
  const [metaPai, setMetaPai] = useState<Meta | null>(null);
  const [submetas, setSubmetas] = useState<Meta[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [progresso, setProgresso] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nivel = (params.nivel as MetaNivel) || 'grande';
  const id = params.id;
  const config = NIVEL_CONFIG[nivel];
  const area = meta?.area_id ? getAreaById(meta.area_id) : null;

  useEffect(() => {
    async function loadData() {
      if (!id) return;

      try {
        setLoading(true);

        const [metaData, subMetaData, tarefasData] = await Promise.all([
          metasService.getById(id),
          metasService.getByParentId(id),
          tarefasService.getByMetaId(id),
        ]);

        if (!metaData) {
          setError('Meta não encontrada');
          return;
        }

        setMeta(metaData);
        setSubmetas(subMetaData);
        setTarefas(tarefasData);

        // Carregar meta pai se existir
        if (metaData.parent_id) {
          const pai = await metasService.getById(metaData.parent_id);
          setMetaPai(pai);
        }

        const progressoCalculado = await metasService.calcularProgresso(id);
        setProgresso(progressoCalculado);
      } catch (err) {
        console.error('Erro ao carregar meta:', err);
        setError('Erro ao carregar meta');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!meta) return;

    try {
      const updated = await metasService.toggleStatus(meta.id);
      setMeta(updated);

      // Recalcular progresso apos mudanca de status
      const novoProgresso = await metasService.calcularProgresso(meta.id);
      setProgresso(novoProgresso);

      await loadMetas();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleDelete = async () => {
    if (!meta) return;

    if (!confirm('Tem certeza que deseja excluir esta meta?\n\nIsso tambem excluira todas as metas filhas vinculadas. Esta acao nao pode ser desfeita.')) {
      return;
    }

    try {
      await metasService.delete(meta.id);
      await loadMetas();
      navigate(`/metas/${nivel === 'grande' ? 'grandes' : nivel}`);
    } catch (err) {
      console.error('Erro ao excluir meta:', err);
      alert('Erro ao excluir meta. Tente novamente.');
    }
  };

  const handleToggleTarefa = async (tarefaId: string) => {
    try {
      const updated = await tarefasService.toggleCompleted(tarefaId);
      setTarefas(prev => prev.map(t => t.id === tarefaId ? updated : t));

      // Recalcular progresso da meta apos concluir/desmarcar tarefa
      if (meta) {
        const novoProgresso = await metasService.calcularProgresso(meta.id);
        setProgresso(novoProgresso);
      }
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
    }
  };

  if (loading) return <MetaDetailSkeleton />;

  if (error || !meta) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error || 'Meta nao encontrada'}</p>
        <Button onClick={() => navigate(`/metas/${nivel === 'grande' ? 'grandes' : nivel}`)} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const tarefasConcluidas = tarefas.filter(t => t.completed).length;
  const diasRestantes = meta.prazo
    ? Math.ceil((new Date(meta.prazo).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <motion.div
      className="p-4 md:p-6 max-w-5xl mx-auto space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* === BREADCRUMB === */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <Button
          variant="ghost" size="sm"
          onClick={() => navigate(`/metas/${nivel === 'grande' ? 'grandes' : nivel}`)}
          className="h-auto px-2 py-1 -ml-2"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          {config.labelPlural}
        </Button>
        <span>/</span>
        <span className="text-slate-800 font-medium">Detalhes</span>
      </nav>

      {/* === HEADER === */}
      <motion.header
        className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-start gap-4">
          <div className={`w-14 h-14 rounded-2xl ${config.corBg} flex items-center justify-center text-3xl`}>
            {config.emoji}
          </div>
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
              {meta.titulo}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <Badge className={`${config.corBg} ${config.corTexto} ${config.corBorda}`}>
                {config.label}
              </Badge>
              {area && (
                <Badge variant="outline" className="text-slate-600">
                  {area.icone} {area.nome}
                </Badge>
              )}
              <Badge variant={meta.status === 'ativa' ? 'default' : 'secondary'}>
                {meta.status === 'ativa' ? 'Ativa' : meta.status === 'concluida' ? 'Concluida' : 'Arquivada'}
              </Badge>
              {meta.one_thing && (
                <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
                  <Star className="w-3 h-3 mr-1" /> ONE Thing
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(`/metas/${nivel === 'grande' ? 'grandes' : nivel}/${meta.id}/editar`)}>
            <Edit className="w-4 h-4 mr-1" /> Editar
          </Button>
          <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-1" /> Excluir
          </Button>
          <Button
            size="sm"
            className={`${config.corSolid} ${config.corSolidHover}`}
            onClick={handleToggleStatus}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            {meta.status === 'ativa' ? 'Concluir' : 'Reativar'}
          </Button>
        </div>
      </motion.header>

      {/* === PROGRESSO + INFO GRID === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progresso */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="h-full flex flex-col items-center justify-center p-6">
            <ProgressCircle progresso={progresso} cor={nivel} />
            <p className="mt-4 text-sm text-slate-500 text-center">
              {tarefas.length === 0
                ? 'Sem tarefas vinculadas'
                : `${tarefasConcluidas} de ${tarefas.length} tarefas concluidas`
              }
            </p>
            {progresso === 100 && meta.status !== 'concluida' && (
              <motion.div
                className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
              >
                <strong>Parabens!</strong> Todas as tarefas concluidas.
              </motion.div>
            )}
          </Card>
        </motion.div>

        {/* Info Grid */}
        <motion.div
          className="lg:col-span-2 space-y-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          {/* Descricao */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Descricao
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-800 leading-relaxed">
                {meta.descricao || <span className="text-slate-400 italic">Sem descricao</span>}
              </p>
            </CardContent>
          </Card>

          {/* Focusing Question */}
          {meta.focusing_question && (
            <Card className={`border-l-4 ${config.corBorda.replace('200', '400')} bg-gradient-to-r from-slate-50 to-white`}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> Focusing Question
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-medium text-slate-700 italic">
                  &ldquo;{meta.focusing_question}&rdquo;
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Prazo */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Prazo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {meta.prazo ? (
                  <>
                    <p className="font-medium text-slate-800">
                      {new Date(meta.prazo).toLocaleDateString('pt-BR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </p>
                    {diasRestantes !== null && (
                      <Badge variant="outline" className="mt-2 text-xs">
                        {diasRestantes > 0 ? `${diasRestantes} dias restantes`
                          : diasRestantes === 0 ? "Vence hoje"
                          : `Atrasada em ${Math.abs(diasRestantes)} dias`}
                      </Badge>
                    )}
                  </>
                ) : (
                  <p className="text-slate-400 italic">Sem prazo definido</p>
                )}
              </CardContent>
            </Card>

            {/* Area */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 flex items-center gap-2">
                  <LayoutGrid className="w-4 h-4" /> Area de Vida
                </CardTitle>
              </CardHeader>
              <CardContent>
                {area ? (
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{area.icone}</span>
                    <div>
                      <p className="font-medium text-slate-800">{area.nome}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 italic">Sem area definida</p>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>

      {/* === HIERARQUIA === */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-slate-500" /> Hierarquia
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Meta Pai */}
            {metaPai && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <ArrowUp className="w-4 h-4 text-slate-400" />
                <span className="text-sm text-slate-500">Pertence a:</span>
                <Link
                  to={`/metas/${nivel === 'anual' ? 'grandes' : (nivel === 'mensal' ? 'anuais' : nivel === 'semanal' ? 'mensais' : 'semanais')}/${metaPai.id}`}
                  className={`flex-1 font-medium text-slate-800 ${config.corTextoHover} transition-colors`}
                >
                  {NIVEL_CONFIG[metaPai.nivel as MetaNivel]?.emoji} {metaPai.titulo}
                </Link>
                <Badge variant="outline" className="text-xs">
                  {NIVEL_CONFIG[metaPai.nivel as MetaNivel]?.label}
                </Badge>
              </div>
            )}

            {/* Metas Filhas / Tarefas */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-500">
                {nivel === 'semanal'
                  ? `${tarefas.length} tarefa(s)`
                  : `${submetas.length} meta(s) filha(s)`
                }
              </h4>

              <AnimatePresence>
                {nivel === 'semanal' ? (
                  // TAREFAS (nivel semanal)
                  tarefas.map((tarefa, index) => (
                    <motion.div
                      key={tarefa.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        tarefa.completed
                          ? 'bg-slate-50 border-slate-200'
                          : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-sm'
                      }`}
                    >
                      <Checkbox
                        id={tarefa.id}
                        checked={tarefa.completed}
                        onCheckedChange={() => handleToggleTarefa(tarefa.id)}
                        className="data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                      />
                      <label
                        htmlFor={tarefa.id}
                        className={`flex-1 cursor-pointer ${tarefa.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}
                      >
                        {tarefa.titulo}
                      </label>
                      <span className="text-xs text-slate-500">
                        {new Date(tarefa.data).toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' })}
                      </span>
                    </motion.div>
                  ))
                ) : (
                  // SUBMETAS (outros niveis)
                  submetas.map((sub, index) => {
                    const subConfig = NIVEL_CONFIG[sub.nivel as MetaNivel] || NIVEL_CONFIG.grande;
                    return (
                      <motion.div
                        key={sub.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Link
                          to={`/metas/${config.proximoPath}/${sub.id}`}
                          className="block"
                        >
                          <div className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${config.corBordaHover} ${config.corBgHover}`}>
                            <Target className={`w-4 h-4 ${subConfig.corTexto}`} />
                            <span className="flex-1 font-medium text-slate-800">{sub.titulo}</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                                <div
                                  className={`h-full ${subConfig.corSolid} rounded-full transition-all`}
                                  style={{ width: `${sub.progresso || 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-slate-500">{sub.progresso || 0}%</span>
                            </div>
                            <Badge variant="outline" className="text-xs hidden sm:inline-flex">
                              {subConfig.label}
                            </Badge>
                            <ChevronRight className="w-4 h-4 text-slate-300" />
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>

              {/* Empty State para filhas/tarefas */}
              {nivel === 'semanal' && tarefas.length === 0 && (
                <EmptyState
                  icon={<ListChecks className="w-8 h-8 text-slate-300" />}
                  title="Nenhuma tarefa ainda"
                  description="Adicione tarefas para comecar a trackear seu progresso semanal."
                  action={
                    <Button variant="outline" onClick={() => navigate(`/agenda/tarefas/criar?meta=${meta.id}`)}>
                      <Plus className="w-4 h-4 mr-2" /> Adicionar Tarefa
                    </Button>
                  }
                />
              )}

              {nivel !== 'semanal' && submetas.length === 0 && (
                <EmptyState
                  icon={<Target className="w-8 h-8 text-slate-300" />}
                  title="Nenhuma meta filha"
                  description="Crie metas filhas para decompor esta meta em passos menores."
                  action={
                    <Button variant="outline" onClick={() => navigate(`/metas/${config.proximoPath}/criar?pai=${meta.id}`)}>
                      <Plus className="w-4 h-4 mr-2" /> Criar Meta Filha
                    </Button>
                  }
                />
              )}
            </div>

            {/* CTA Adicionar */}
            <Button
              variant="outline"
              className={`w-full border-dashed border-slate-300 ${config.corBordaHover} ${config.corBgHover}`}
              onClick={() =>
                nivel === 'semanal'
                  ? navigate(`/agenda/tarefas/criar?meta=${meta.id}`)
                  : navigate(`/metas/${config.proximoPath}/criar?pai=${meta.id}`)
              }
            >
              <Plus className="w-4 h-4 mr-2" />
              {nivel === 'semanal' ? 'Adicionar Tarefa' : 'Criar Meta Filha'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
