import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
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
  Flame,
  Trophy,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { habitosService } from '../../../services/habitosService';
import { format, addDays, startOfWeek, addWeeks } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ==========================================
// TIPOS E CONSTANTES
// ==========================================

type Step = 1 | 2 | 3;
type Bloco = 'one-thing' | 'manha' | 'tarde' | 'noite' | null;
type Prioridade = 'alta' | 'media' | 'baixa';

interface HabitTemplate {
  icon: string;
  titulo: string;
  descricao: string;
  bloco: Bloco;
  hora: string;
  diasSemana: number[];
}

const DIAS_SEMANA = [
  { value: 0, label: 'S', fullLabel: 'Segunda', color: 'from-blue-500 to-blue-600' },
  { value: 1, label: 'T', fullLabel: 'Terça', color: 'from-indigo-500 to-indigo-600' },
  { value: 2, label: 'Q', fullLabel: 'Quarta', color: 'from-violet-500 to-violet-600' },
  { value: 3, label: 'Q', fullLabel: 'Quinta', color: 'from-purple-500 to-purple-600' },
  { value: 4, label: 'S', fullLabel: 'Sexta', color: 'from-fuchsia-500 to-fuchsia-600' },
  { value: 5, label: 'S', fullLabel: 'Sábado', color: 'from-pink-500 to-rose-500' },
  { value: 6, label: 'D', fullLabel: 'Domingo', color: 'from-rose-500 to-red-500' },
];

const BLOCOS = [
  { value: 'one-thing', label: 'One Thing', icon: Target, color: 'from-amber-500 to-orange-500', desc: 'Sua prioridade máxima' },
  { value: 'manha', label: 'Manhã', icon: Sunrise, color: 'from-orange-400 to-amber-500', desc: '6h - 12h' },
  { value: 'tarde', label: 'Tarde', icon: Sun, color: 'from-sky-400 to-blue-500', desc: '12h - 18h' },
  { value: 'noite', label: 'Noite', icon: Moon, color: 'from-indigo-500 to-violet-600', desc: '18h - 22h' },
] as const;

const PRIORIDADES = [
  { value: 'alta', label: 'Alta', color: 'from-rose-500 to-red-600', bg: 'bg-rose-500' },
  { value: 'media', label: 'Média', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-500' },
  { value: 'baixa', label: 'Baixa', color: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500' },
] as const;

const TEMPLATES: HabitTemplate[] = [
  { icon: '🏃', titulo: 'Corrida 5km', descricao: 'Manter a forma física', bloco: 'manha', hora: '06:00', diasSemana: [0, 2, 4] },
  { icon: '📚', titulo: 'Leitura 20min', descricao: 'Ler livro atual', bloco: 'noite', hora: '21:00', diasSemana: [0, 1, 2, 3, 4, 5, 6] },
  { icon: '💧', titulo: 'Beber 2L água', descricao: 'Manter hidratação', bloco: 'tarde', hora: '14:00', diasSemana: [0, 1, 2, 3, 4, 5, 6] },
  { icon: '🧘', titulo: 'Meditação', descricao: 'Mindfulness diário', bloco: 'one-thing', hora: '07:00', diasSemana: [0, 1, 2, 3, 4, 5, 6] },
  { icon: '💪', titulo: 'Musculação', descricao: 'Treino na academia', bloco: 'tarde', hora: '18:00', diasSemana: [0, 2, 4] },
  { icon: '🎸', titulo: 'Praticar violão', descricao: '30 minutos de prática', bloco: 'noite', hora: '20:00', diasSemana: [1, 3, 5] },
  { icon: '🌱', titulo: 'Cuidar das plantas', descricao: 'Regar e cuidar', bloco: 'manha', hora: '08:00', diasSemana: [2, 5] },
  { icon: '✍️', titulo: 'Journaling', descricao: 'Escrever reflexões', bloco: 'one-thing', hora: '06:30', diasSemana: [0, 1, 2, 3, 4, 5, 6] },
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

interface HabitPreviewProps {
  titulo: string;
  descricao: string;
  diasSemana: number[];
  hora: string;
  bloco: Bloco;
  prioridade: Prioridade;
}

function HabitPreview({ titulo, descricao, diasSemana, hora, bloco, prioridade }: HabitPreviewProps) {
  const prioridadeConfig = PRIORIDADES.find(p => p.value === prioridade);
  
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
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900">
              {titulo || 'Seu Novo Hábito'}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {descricao || 'Adicione uma descrição para lembrar o propósito'}
            </p>
          </div>
        </div>

        {/* Dias da semana visual */}
        <div className="flex gap-1 mb-4">
          {DIAS_SEMANA.map((dia) => {
            const isSelected = diasSemana.includes(dia.value);
            return (
              <div
                key={dia.value}
                className={`flex-1 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${dia.color} text-white shadow-md`
                    : 'bg-slate-100 text-slate-300'
                }`}
              >
                {dia.label}
              </div>
            );
          })}
        </div>

        {/* Info row */}
        <div className="flex items-center gap-4 text-sm">
          {hora && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="w-4 h-4" />
              <span>{hora}</span>
            </div>
          )}
          {bloco && (
            <div className="flex items-center gap-1.5 text-slate-600">
              <Zap className="w-4 h-4" />
              <span className="capitalize">{bloco === 'one-thing' ? 'One Thing' : bloco}</span>
            </div>
          )}
          <div className="flex items-center gap-1.5 text-slate-600 ml-auto">
            <Flame className="w-4 h-4 text-orange-500" />
            <span className="font-semibold text-orange-600">0 dias</span>
          </div>
        </div>

        {/* Gamification teaser */}
        <div className="mt-4 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Trophy className="w-4 h-4" />
            <span>Complete 7 dias para desbloquear a primeira conquista!</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================

export default function HabitoCreatePage() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dataFim, setDataFim] = useState(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
  const [hora, setHora] = useState('');
  const [bloco, setBloco] = useState<Bloco>(null);
  const [prioridade, setPrioridade] = useState<Prioridade>('media');
  const [diasSemana, setDiasSemana] = useState<number[]>([]);

  // Validação em tempo real
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const toggleDia = (dia: number) => {
    setDiasSemana(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia)
        : [...prev, dia].sort()
    );
  };

  const aplicarTemplate = (template: HabitTemplate) => {
    setTitulo(template.titulo);
    setDescricao(template.descricao);
    setBloco(template.bloco);
    setHora(template.hora);
    setDiasSemana(template.diasSemana);
  };

  const validateStep = (step: Step): boolean => {
    setError(null);
    
    switch (step) {
      case 1:
        if (!titulo.trim()) {
          setError('Dê um nome ao seu hábito para começar!');
          return false;
        }
        return true;
      case 2:
        if (diasSemana.length === 0) {
          setError('Selecione pelo menos um dia da semana');
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(3)) return;

    if (!user) {
      setError('Usuário não autenticado');
      return;
    }

    try {
      setLoading(true);
      
      await habitosService.create(user.id, {
        titulo,
        descricao: descricao || null,
        data_inicio: dataInicio,
        data_fim: dataFim,
        dias_semana: diasSemana,
        hora: hora || null,
        bloco,
        meta_id: null,
        prioridade,
        status: 'ativa',
        streak_atual: 0,
        melhor_streak: 0,
        ultima_conclusao: null,
        frequencia_tipo: 'dias_especificos',
        frequencia_dias: 1,
      });

      // Animação de sucesso antes de navegar
      navigate('/habitos');
    } catch (err: any) {
      console.error('Erro ao criar hábito:', err);
      setError(err.message || 'Erro ao criar hábito');
    } finally {
      setLoading(false);
    }
  }

  // Sugestão de datas inteligentes
  const quickDateOptions = [
    { label: '30 dias', value: 30 },
    { label: '60 dias', value: 60 },
    { label: '90 dias', value: 90 },
    { label: '6 meses', value: 180 },
  ];

  const setQuickDate = (days: number) => {
    setDataFim(format(addDays(new Date(dataInicio), days), 'yyyy-MM-dd'));
  };

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
            Criar Novo Hábito
          </h1>
          <p className="text-slate-600">
            Construa uma nova rotina em 3 passos simples
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
                <span className="text-rose-600 font-bold">!</span>
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
                  {/* PASSO 1: Definição do Hábito */}
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
                          Qual hábito você quer construir?
                        </h2>
                        <p className="text-slate-500 text-sm">
                          Comece com algo simples e mensurável
                        </p>
                      </div>

                      {/* Templates rápidos */}
                      <div className="bg-slate-50 rounded-xl p-4">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                          Sugestões rápidas
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                          {TEMPLATES.slice(0, 8).map((template, idx) => (
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
                          Nome do hábito *
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
                            placeholder="Ex: Meditar 10 minutos"
                            maxLength={200}
                          />
                          <Sparkles className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                            titulo.trim() ? 'text-emerald-500' : 'text-slate-400'
                          }`} />
                        </div>
                        {touched.titulo && !titulo.trim() && (
                          <p className="mt-1 text-sm text-rose-500">O nome do hábito é obrigatório</p>
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
                          placeholder="Por que este hábito é importante para você?"
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* PASSO 2: Frequência e Horário */}
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
                          Quando você vai praticar?
                        </h2>
                        <p className="text-slate-500 text-sm">
                          Defina os dias e horários que funcionam para você
                        </p>
                      </div>

                      {/* Dias da semana */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Dias da semana *
                        </label>
                        <div className="grid grid-cols-7 gap-2">
                          {DIAS_SEMANA.map((dia) => {
                            const isSelected = diasSemana.includes(dia.value);
                            return (
                              <motion.button
                                key={dia.value}
                                whileTap={{ scale: 0.9 }}
                                type="button"
                                onClick={() => toggleDia(dia.value)}
                                className={`aspect-square rounded-xl flex flex-col items-center justify-center transition-all ${
                                  isSelected
                                    ? `bg-gradient-to-br ${dia.color} text-white shadow-lg`
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                <span className="text-lg font-bold">{dia.label}</span>
                                <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                                  {dia.fullLabel.slice(0, 3)}
                                </span>
                              </motion.button>
                            );
                          })}
                        </div>
                        <p className="mt-2 text-sm text-slate-500">
                          {diasSemana.length === 0 
                            ? 'Selecione pelo menos um dia'
                            : `${diasSemana.length} dia${diasSemana.length > 1 ? 's' : ''} selecionado${diasSemana.length > 1 ? 's' : ''}`
                          }
                        </p>
                      </div>

                      {/* Período */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Data início
                          </label>
                          <input
                            type="date"
                            value={dataInicio}
                            onChange={(e) => setDataInicio(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Data fim
                          </label>
                          <input
                            type="date"
                            value={dataFim}
                            onChange={(e) => setDataFim(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-indigo-500 outline-none"
                          />
                        </div>
                      </div>

                      {/* Quick date buttons */}
                      <div className="flex flex-wrap gap-2">
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
                      </div>
                    </motion.div>
                  )}

                  {/* PASSO 3: Configurações */}
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
                          Como este hábito se encaixa no seu dia?
                        </h2>
                        <p className="text-slate-500 text-sm">
                          Escolha o bloco e prioridade
                        </p>
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

                      {/* Prioridade */}
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-3">
                          Prioridade
                        </label>
                        <div className="flex gap-3">
                          {PRIORIDADES.map((option) => {
                            const isSelected = prioridade === option.value;
                            return (
                              <motion.button
                                key={option.value}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                onClick={() => setPrioridade(option.value)}
                                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all ${
                                  isSelected
                                    ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                {option.label}
                              </motion.button>
                            );
                          })}
                        </div>
                      </div>

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
                            Criando seu hábito...
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-5 h-5" />
                            Criar Hábito
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
                Preview do seu hábito
              </p>
              <HabitPreview
                titulo={titulo}
                descricao={descricao}
                diasSemana={diasSemana}
                hora={hora}
                bloco={bloco}
                prioridade={prioridade}
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
                      Hábitos começam pequenos! Consistência é mais importante que intensidade nos primeiros 30 dias.
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
