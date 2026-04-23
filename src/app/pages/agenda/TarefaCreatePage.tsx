import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Target, 
  Zap, 
  ChevronRight, 
  ChevronLeft,
  Check,
  Sun,
  Sunrise,
  Sunset,
  Moon,
  Flag,
  Briefcase,
  BookOpen,
  Heart,
  Home,
  Trophy,
  ArrowRight,
  Repeat,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { tarefasService } from '../../../services/tarefasService';
import { tarefaItensService } from '../../../services/tarefaItensService';
import { recorrenciaService } from '../../../services/recorrenciaService';
import { format, addDays, startOfWeek, addWeeks, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import type { RecorrenciaConfig } from '../../../lib/supabase';
import { TarefaItensList } from '../../components/agenda/TarefaItensList';
import type { TarefaItemUI } from '../../../lib/mapeamento';

// ==========================================
// TIPOS E CONSTANTES
// ==========================================

type Step = 1 | 2 | 3;
type Bloco = 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
type Prioridade = 'alta' | 'media' | 'baixa';

interface TarefaTemplate {
  icon: string;
  titulo: string;
  descricao: string;
  bloco: Bloco;
  hora: string;
  prioridade: Prioridade;
}

const BLOCOS = [
  { value: 'one-thing', label: 'One Thing', icon: Target, color: 'from-amber-500 to-orange-500', desc: 'Sua prioridade máxima' },
  { value: 'manha', label: 'Manhã', icon: Sunrise, color: 'from-orange-400 to-amber-500', desc: '6h - 12h' },
  { value: 'tarde', label: 'Tarde', icon: Sun, color: 'from-sky-400 to-blue-500', desc: '12h - 18h' },
  { value: 'noite', label: 'Noite', icon: Moon, color: 'from-indigo-500 to-violet-600', desc: '18h - 22h' },
] as const;

const PRIORIDADES = [
  { value: 'alta', label: 'Alta', color: 'from-rose-500 to-red-600', bg: 'bg-rose-500', icon: Flag },
  { value: 'media', label: 'Média', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500', icon: Flag },
  { value: 'baixa', label: 'Baixa', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500', icon: Flag },
] as const;

const TEMPLATES: TarefaTemplate[] = [
  // Trabalho
  { icon: '💼', titulo: 'Reunião com equipe', descricao: 'Sincronização semanal', bloco: 'manha', hora: '09:00', prioridade: 'alta' },
  { icon: '📧', titulo: 'Responder emails', descricao: 'Caixa de entrada zero', bloco: 'manha', hora: '08:00', prioridade: 'media' },
  { icon: '📊', titulo: 'Revisar relatório', descricao: 'Análise de métricas', bloco: 'tarde', hora: '14:00', prioridade: 'alta' },
  // Estudo
  { icon: '📚', titulo: 'Estudar 1 hora', descricao: 'Foco no aprendizado', bloco: 'one-thing', hora: '07:00', prioridade: 'alta' },
  { icon: '🎓', titulo: 'Assistir aula', descricao: 'Curso online', bloco: 'tarde', hora: '15:00', prioridade: 'media' },
  { icon: '📝', titulo: 'Fazer exercícios', descricao: 'Prática do conteúdo', bloco: 'noite', hora: '19:00', prioridade: 'media' },
  // Saúde
  { icon: '🏃', titulo: 'Academia', descricao: 'Treino físico', bloco: 'manha', hora: '06:00', prioridade: 'alta' },
  { icon: '🩺', titulo: 'Consulta médica', descricao: 'Check-up', bloco: 'tarde', hora: '14:00', prioridade: 'alta' },
  { icon: '🧘', titulo: 'Yoga/Meditação', descricao: 'Bem-estar mental', bloco: 'noite', hora: '21:00', prioridade: 'baixa' },
  // Pessoal
  { icon: '🛒', titulo: 'Fazer compras', descricao: 'Supermercado', bloco: 'tarde', hora: '16:00', prioridade: 'media' },
  { icon: '🧺', titulo: 'Lavar roupa', descricao: 'Tarefa doméstica', bloco: 'manha', hora: '09:00', prioridade: 'baixa' },
  { icon: '🍳', titulo: 'Preparar refeição', descricao: 'Cozinhar almoço', bloco: 'manha', hora: '11:00', prioridade: 'media' },
];

// ==========================================
// COMPONENTES REUTILIZÁVEIS
// ==========================================

interface StepIndicatorProps {
  currentStep: Step;
  totalSteps: number;
}

function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <motion.div
            initial={false}
            animate={{
              scale: currentStep === step ? 1.1 : 1,
              backgroundColor: currentStep >= step ? '#6366f1' : '#e2e8f0',
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
              currentStep >= step ? 'text-white' : 'text-slate-400'
            }`}
          >
            {currentStep > step ? (
              <Check className="w-5 h-5" />
            ) : (
              step
            )}
          </motion.div>
          {step < totalSteps && (
            <div
              className={`w-12 h-1 mx-2 rounded-full transition-colors ${
                currentStep > step ? 'bg-indigo-500' : 'bg-slate-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

interface TarefaPreviewProps {
  titulo: string;
  descricao: string;
  data: string;
  hora: string;
  bloco: Bloco;
  prioridade: Prioridade;
  metaTitulo?: string;
  isRecorrente: boolean;
}

function TarefaPreview({ titulo, descricao, data, hora, bloco, prioridade, metaTitulo, isRecorrente }: TarefaPreviewProps) {
  const prioridadeConfig = PRIORIDADES.find(p => p.value === prioridade);
  const blocoConfig = BLOCOS.find(b => b.value === bloco);
  
  // Função segura para formatar data
  const formatarData = (dataString: string): string => {
    if (!dataString) return 'Data não definida';
    
    try {
      // Adicionar timezone fixo para evitar problemas de conversão
      const dataComTimezone = `${dataString}T12:00:00`;
      const date = new Date(dataComTimezone);
      
      if (!isValid(date)) return 'Data inválida';
      
      return date.toLocaleDateString('pt-BR', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
    } catch (e) {
      return 'Data inválida';
    }
  };
  
  const dataFormatada = formatarData(data);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
    >
      {/* Header com prioridade */}
      <div className={`h-2 bg-gradient-to-r ${prioridadeConfig?.color}`} />
      
      <div className="p-6">
        {/* Título e ícone */}
        <div className="flex items-start gap-4 mb-4">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${prioridadeConfig?.color} flex items-center justify-center shadow-lg`}>
            <Check className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              {titulo || 'Sua Nova Tarefa'}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {descricao || 'Adicione uma descrição para mais contexto'}
            </p>
          </div>
        </div>

        {/* Data e hora */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span className="capitalize">{dataFormatada}</span>
          </div>
          {hora && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-4 h-4" />
              <span>{hora}</span>
            </div>
          )}
          {isRecorrente && (
            <div className="flex items-center gap-1.5 text-indigo-600">
              <Repeat className="w-4 h-4" />
              <span className="text-sm font-medium">Recorrente</span>
            </div>
          )}
        </div>

        {/* Bloco e prioridade */}
        <div className="flex items-center gap-2 mb-4">
          {blocoConfig && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${blocoConfig.color}`}>
              <blocoConfig.icon className="w-3.5 h-3.5" />
              {blocoConfig.label}
            </div>
          )}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${prioridadeConfig?.color}`}>
            <Flag className="w-3.5 h-3.5" />
            {prioridadeConfig?.label}
          </div>
        </div>

        {/* Meta vinculada */}
        {metaTitulo && (
          <div className="flex items-center gap-2 text-sm text-slate-600 pt-3 border-t border-slate-100">
            <Target className="w-4 h-4 text-indigo-500" />
            <span>Vinculada a: <span className="font-medium text-slate-800">{metaTitulo}</span></span>
          </div>
        )}

        {/* Gamification teaser */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Trophy className="w-4 h-4" />
            <span>Complete esta tarefa para ganhar +10 pontos!</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function TarefaCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, metasSemanais, metasMensais } = useApp();

  // Get params from URL
  const dataParam = searchParams.get('data');
  const blocoParam = searchParams.get('bloco');
  const origemParam = searchParams.get('origem');

  // Estado do wizard
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [data, setData] = useState(dataParam || format(new Date(), 'yyyy-MM-dd'));
  const [hora, setHora] = useState('');
  const [bloco, setBloco] = useState<Bloco>(blocoParam as Bloco || null);
  const [prioridade, setPrioridade] = useState<Prioridade>('media');
  const [metaId, setMetaId] = useState<string | null>(null);
  
  // Recorrência
  const [recorrenciaConfig, setRecorrenciaConfig] = useState<RecorrenciaConfig | null>(null);

  // Itens da tarefa (checklist)
  const [tarefaItens, setTarefaItens] = useState<TarefaItemUI[]>([]);

  // Validação em tempo real
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Metas disponíveis (semanais e mensais)
  const metasSemanaisOptions = metasSemanais.map(m => ({ id: m.id, titulo: m.titulo, nivel: 'Semanal' }));
  const metasMensaisOptions = metasMensais.map(m => ({ id: m.id, titulo: m.titulo, nivel: 'Mensal' }));
  const allMetas = [...metasSemanaisOptions, ...metasMensaisOptions];

  const metaSelecionada = allMetas.find(m => m.id === metaId);

  const aplicarTemplate = (template: TarefaTemplate) => {
    setTitulo(template.titulo);
    setDescricao(template.descricao);
    setBloco(template.bloco);
    setHora(template.hora);
    setPrioridade(template.prioridade);
  };

  const validateStep = (step: Step): boolean => {
    setError(null);
    
    switch (step) {
      case 1:
        if (!titulo.trim()) {
          setError('Dê um nome à sua tarefa para começar!');
          return false;
        }
        return true;
      case 2:
        if (!data) {
          setError('Selecione uma data para a tarefa');
          return false;
        }
        // Validar formato da data
        const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dataRegex.test(data)) {
          setError('Formato de data inválido. Use AAAA-MM-DD');
          return false;
        }
        // Validar se a data é válida
        const [ano, mes, dia] = data.split('-').map(Number);
        if (mes < 1 || mes > 12 || dia < 1 || dia > 31) {
          setError('Data inválida. Verifique dia e mês.');
          return false;
        }
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as Step);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as Step);
      setError(null);
    }
  };

  // Quick date options
  const quickDateOptions = [
    { label: 'Hoje', value: 0 },
    { label: 'Amanhã', value: 1 },
    { label: 'Próx. semana', value: 7 },
    { label: 'Próx. mês', value: 30 },
  ];

  const setQuickDate = (days: number) => {
    setData(format(addDays(new Date(), days), 'yyyy-MM-dd'));
  };

  // Quick time options
  const quickTimeOptions = [
    { label: 'Manhã', value: '09:00' },
    { label: 'Tarde', value: '14:00' },
    { label: 'Noite', value: '19:00' },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(3)) return;

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setLoading(true);
      
      const isRecorrente = recorrenciaConfig && recorrenciaConfig.tipo !== 'unica';

      if (isRecorrente) {
        // Validar configuração
        const validacao = recorrenciaService.validarConfiguracao(recorrenciaConfig!);
        if (!validacao.valido) {
          setError(validacao.erro || 'Configuração de recorrência inválida');
          return;
        }

        // Criar tarefa mãe
        const tarefaMae = await tarefasService.create(user.id, {
          titulo,
          descricao: descricao || null,
          data,
          hora: hora || null,
          bloco,
          prioridade,
          meta_id: metaId,
          recorrencia: 'nenhuma',
          completed: false,
          is_template: true,
          recorrencia_config: recorrenciaConfig,
          data_fim_recorrencia: recorrenciaConfig?.data_fim || null,
        });

        // Gerar instâncias
        if (tarefaMae) {
          await recorrenciaService.gerarInstancias(tarefaMae, 30);
        }
      } else {
        // Tarefa normal
        const novaTarefa = await tarefasService.create(user.id, {
          titulo,
          descricao: descricao || null,
          data,
          hora: hora || null,
          bloco,
          prioridade,
          meta_id: metaId,
          recorrencia: 'nenhuma',
          completed: false,
          is_template: false,
          recorrencia_config: null,
          parent_id: null,
          data_fim_recorrencia: null,
        });

        // Salvar itens da tarefa (se existirem)
        if (novaTarefa && tarefaItens.length > 0) {
          const nomes = tarefaItens.map(i => i.nome);
          await tarefaItensService.createMany(novaTarefa.id, nomes);
        }
      }

      navigate('/agenda/hoje');
    } catch (err: any) {
      console.error('Erro ao criar tarefa:', err);
      setError(err.message || 'Erro ao criar tarefa');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50/30">
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-2">
            Criar Nova Tarefa
          </h1>
          <p className="text-slate-600">
            Organize suas atividades em 3 passos simples
          </p>
        </motion.div>

        {/* Stepper */}
        <StepIndicator currentStep={currentStep} totalSteps={3} />

        {/* Error Banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-rose-600" />
              </div>
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Formulário */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
          >
            <form onSubmit={handleSubmit}>
              <div className="p-6 lg:p-8">
                <AnimatePresence mode="wait">
                  {/* PASSO 1: Definição da Tarefa */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                          O que você precisa fazer?
                        </h2>
                        <p className="text-slate-500 text-sm">
                          Comece escolhendo uma sugestão ou crie algo novo
                        </p>
                      </div>

                      {/* Templates rápidos */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                          Sugestões rápidas
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {TEMPLATES.slice(0, 12).map((template, idx) => (
                            <motion.button
                              key={idx}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              type="button"
                              onClick={() => aplicarTemplate(template)}
                              className="p-3 bg-white rounded-xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all text-center group"
                              title={`${template.titulo} - ${template.descricao}`}
                            >
                              <span className="text-2xl mb-1 block group-hover:scale-110 transition-transform">
                                {template.icon}
                              </span>
                              <span className="text-xs text-slate-600 font-medium line-clamp-1">
                                {template.titulo}
                              </span>
                            </motion.button>
                          ))}
                        </div>
                      </div>

                      {/* Título */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Nome da tarefa *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            value={titulo}
                            onChange={(e) => setTitulo(e.target.value)}
                            onBlur={() => setTouched(prev => ({ ...prev, titulo: true }))}
                            className={`w-full px-4 py-3 pl-12 border-2 rounded-xl transition-all outline-none ${
                              titulo.trim() && touched.titulo
                                ? 'border-emerald-400 bg-emerald-50/30'
                                : 'border-slate-200 focus:border-indigo-500'
                            }`}
                            placeholder="Ex: Estudar React 1 hora"
                            maxLength={200}
                          />
                          <Sparkles className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                            titulo.trim() ? 'text-emerald-500' : 'text-slate-400'
                          }`} />
                        </div>
                        {touched.titulo && !titulo.trim() && (
                          <p className="mt-1 text-sm text-rose-500">O nome da tarefa é obrigatório</p>
                        )}
                      </div>

                      {/* Descrição */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Descrição (opcional)
                        </label>
                        <textarea
                          value={descricao}
                          onChange={(e) => setDescricao(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-colors resize-none"
                          rows={3}
                          placeholder="Detalhes adicionais sobre a tarefa..."
                        />
                      </div>

                      {/* Itens da Tarefa (Checklist) */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <TarefaItensList
                          itens={tarefaItens}
                          onAdd={(nome) => {
                            const novoItem: TarefaItemUI = {
                              id: `temp-${Date.now()}`,
                              tarefaId: '',
                              nome,
                              ordem: tarefaItens.length + 1,
                              completed: false,
                            };
                            setTarefaItens(prev => [...prev, novoItem]);
                          }}
                          onDelete={(id) => {
                            setTarefaItens(prev => prev.filter(item => item.id !== id));
                          }}
                          onToggle={(id) => {
                            setTarefaItens(prev => prev.map(item => 
                              item.id === id ? { ...item, completed: !item.completed } : item
                            ));
                          }}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* PASSO 2: Agendamento e Recorrência */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                          Quando vai realizar?
                        </h2>
                        <p className="text-slate-500 text-sm">
                          Defina data, horário e se será recorrente
                        </p>
                      </div>

                      {/* Data */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Data *
                        </label>
                        <input
                          type="date"
                          value={data}
                          onChange={(e) => setData(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                        
                        {/* Quick date buttons */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {quickDateOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setQuickDate(opt.value)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Horário */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                          Horário (opcional)
                        </label>
                        <input
                          type="time"
                          value={hora}
                          onChange={(e) => setHora(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                        />
                        
                        {/* Quick time buttons */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {quickTimeOptions.map((opt) => (
                            <button
                              key={opt.value}
                              type="button"
                              onClick={() => setHora(opt.value)}
                              className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-700 rounded-lg text-sm font-medium transition-colors"
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Recorrência */}
                      <div className="border-t border-slate-200 pt-6">
                        <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                          <Repeat className="w-4 h-4" />
                          Repetição
                        </h3>
                        <div className="bg-slate-50 rounded-xl p-4">
                          <label className="block text-sm font-medium text-slate-700 mb-2">
                            Frequência
                          </label>
                          <select
                            value={recorrenciaConfig?.tipo || 'unica'}
                            onChange={(e) => {
                              const tipo = e.target.value as RecorrenciaConfig['tipo'];
                              if (tipo === 'unica') {
                                setRecorrenciaConfig(null);
                              } else {
                                setRecorrenciaConfig({
                                  tipo,
                                  data_inicio: data,
                                });
                              }
                            }}
                            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                          >
                            <option value="unica">Uma vez</option>
                            <option value="diaria">Diária</option>
                            <option value="semanal">Semanal</option>
                            <option value="mensal">Mensal</option>
                            <option value="intervalo_dias">A cada X dias</option>
                          </select>

                          {/* Configurações específicas */}
                          {recorrenciaConfig?.tipo === 'semanal' && (
                            <div className="mt-3">
                              <label className="block text-xs font-medium text-slate-600 mb-2">
                                Dias da semana
                              </label>
                              <div className="flex gap-1">
                                {/* 
                                  Mapeamento correto:
                                  Botão: D S T Q Q S S (Dom-Seg-Ter-Qua-Qui-Sex-Sab)
                                  Sistema: 0=Seg, 1=Ter, 2=Qua, 3=Qui, 4=Sex, 5=Sab, 6=Dom
                                */}
                                {[
                                  { label: 'D', value: 6 }, // Domingo → 6
                                  { label: 'S', value: 0 }, // Segunda → 0
                                  { label: 'T', value: 1 }, // Terça → 1
                                  { label: 'Q', value: 2 }, // Quarta → 2
                                  { label: 'Q', value: 3 }, // Quinta → 3
                                  { label: 'S', value: 4 }, // Sexta → 4
                                  { label: 'S', value: 5 }, // Sábado → 5
                                ].map((dia) => (
                                  <button
                                    key={dia.value}
                                    type="button"
                                    onClick={() => {
                                      const dias = recorrenciaConfig.dias_semana || [];
                                      const newDias = dias.includes(dia.value)
                                        ? dias.filter(d => d !== dia.value)
                                        : [...dias, dia.value].sort((a, b) => a - b);
                                      setRecorrenciaConfig({ ...recorrenciaConfig, dias_semana: newDias });
                                    }}
                                    className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${
                                      (recorrenciaConfig.dias_semana || []).includes(dia.value)
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-white text-slate-600 border border-slate-200'
                                    }`}
                                  >
                                    {dia.label}
                                  </button>
                                ))}
                              </div>
                              <p className="text-xs text-slate-400 mt-1">
                                {(recorrenciaConfig.dias_semana || []).length > 0 
                                  ? `Selecionados: ${(recorrenciaConfig.dias_semana || []).map(d => ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom'][d]).join(', ')}`
                                  : 'Clique nos dias para selecionar'
                                }
                              </p>
                            </div>
                          )}

                          {recorrenciaConfig?.tipo === 'mensal' && (
                            <div className="mt-3">
                              <label className="block text-xs font-medium text-slate-600 mb-2">
                                Dia do mês
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={31}
                                value={recorrenciaConfig.dia_mes || 1}
                                onChange={(e) => setRecorrenciaConfig({ 
                                  ...recorrenciaConfig, 
                                  dia_mes: parseInt(e.target.value) || 1 
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                              />
                              <p className="text-xs text-slate-400 mt-1">
                                Ex: 25 = todo dia 25 de cada mês
                              </p>
                            </div>
                          )}

                          {recorrenciaConfig?.tipo === 'intervalo_dias' && (
                            <div className="mt-3">
                              <label className="block text-xs font-medium text-slate-600 mb-2">
                                Repetir a cada quantos dias?
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={365}
                                value={recorrenciaConfig.intervalo_dias || 2}
                                onChange={(e) => setRecorrenciaConfig({ 
                                  ...recorrenciaConfig, 
                                  intervalo_dias: parseInt(e.target.value) || 1 
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                              />
                            </div>
                          )}

                          {recorrenciaConfig && recorrenciaConfig.tipo !== 'unica' && (
                            <div className="mt-3">
                              <label className="block text-xs font-medium text-slate-600 mb-2">
                                Repetir até <span className="text-red-500">*</span>
                                <span className="text-slate-400 font-normal"> (obrigatório)</span>
                              </label>
                              <input
                                type="date"
                                value={recorrenciaConfig.data_fim || ''}
                                min={data}
                                required
                                onChange={(e) => setRecorrenciaConfig({ 
                                  ...recorrenciaConfig, 
                                  data_fim: e.target.value || undefined 
                                })}
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                              />
                              {!recorrenciaConfig.data_fim && (
                                <p className="text-xs text-red-500 mt-1">
                                  Defina até quando esta tarefa deve se repetir
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* PASSO 3: Contexto e Priorização */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6"
                    >
                      <div>
                        <h2 className="text-xl font-bold text-slate-900 mb-1">
                          Como esta tarefa se encaixa?
                        </h2>
                        <p className="text-slate-500 text-sm">
                          Defina prioridade, bloco e vinculação com metas
                        </p>
                      </div>

                      {/* Prioridade */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Prioridade
                        </label>
                        <div className="flex gap-3">
                          {PRIORIDADES.map((option) => {
                            const isSelected = prioridade === option.value;
                            const Icon = option.icon;
                            return (
                              <motion.button
                                key={option.value}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setPrioridade(option.value)}
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                                  isSelected
                                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : ''}`} />
                                {option.label}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Bloco do dia */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Bloco do dia
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {BLOCOS.map((option) => {
                            const Icon = option.icon;
                            const isSelected = bloco === option.value;
                            return (
                              <motion.button
                                key={option.value}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="button"
                                onClick={() => setBloco(option.value)}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${
                                  isSelected
                                    ? `border-transparent bg-gradient-to-br ${option.color} text-white shadow-lg`
                                    : 'border-slate-200 hover:border-indigo-300 bg-white'
                                }`}
                              >
                                <div className="flex items-center gap-3 mb-2">
                                  <Icon className={`w-5 h-5 ${isSelected ? 'text-white' : 'text-slate-600'}`} />
                                  <span className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                    {option.label}
                                  </span>
                                </div>
                                <p className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                  {option.desc}
                                </p>
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Meta Vinculada */}
                      {allMetas.length > 0 && (
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-3">
                            Vincular a uma meta (opcional)
                          </label>
                          <select
                            value={metaId || ''}
                            onChange={(e) => setMetaId(e.target.value || null)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none transition-colors"
                          >
                            <option value="">Selecione uma meta...</option>
                            {metasSemanaisOptions.length > 0 && (
                              <optgroup label="Metas Semanais">
                                {metasSemanaisOptions.map(meta => (
                                  <option key={meta.id} value={meta.id}>
                                    {meta.titulo}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                            {metasMensaisOptions.length > 0 && (
                              <optgroup label="Metas Mensais">
                                {metasMensaisOptions.map(meta => (
                                  <option key={meta.id} value={meta.id}>
                                    {meta.titulo}
                                  </option>
                                ))}
                              </optgroup>
                            )}
                          </select>
                        </div>
                      )}

                      {/* Submit */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Criando tarefa...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Criar Tarefa
                          </>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer com navegação */}
              <div className="px-6 lg:px-8 py-4 bg-slate-50 border-t border-slate-100 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentStep === 1
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </button>
                
                {currentStep < 3 && (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                  >
                    Continuar
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Preview (Desktop) */}
          <div className="hidden lg:block sticky top-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Preview da tarefa
              </p>
              <TarefaPreview
                titulo={titulo}
                descricao={descricao}
                data={data}
                hora={hora}
                bloco={bloco}
                prioridade={prioridade}
                metaTitulo={metaSelecionada?.titulo}
                isRecorrente={recorrenciaConfig?.tipo !== 'unica' && !!recorrenciaConfig}
              />
              
              {/* Tips */}
              <div className="mt-6 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-indigo-900 text-sm mb-1">
                      Dica do Goal Planner
                    </h4>
                    <p className="text-indigo-700 text-sm">
                      Tarefas com prioridade alta e bloco definido têm 3x mais chances de serem concluídas!
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
