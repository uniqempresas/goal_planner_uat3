import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Calendar, 
  Target, 
  ChevronLeft, 
  ArrowRight,
  TrendingUp,
  Mountain,
  Sun,
  Save,
  X
} from 'lucide-react';
import { z } from 'zod';
import { useApp } from '../../contexts/AppContext';
import { metasService, type MetaNivel } from '../../../services/metasService';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { MetaParentSelector } from './components/MetaParentSelector';
import { HierarchyTreePreview } from './components/HierarchyTreePreview';
import { SmartFields } from './components/SmartFields';
import { MetaWizardStepIndicator } from '../../components/metas/MetaWizardStepIndicator';
import { MetaPreviewCard } from '../../components/metas/MetaPreviewCard';
import { AreaVidaSelector } from '../../components/metas/AreaVidaSelector';
import type { Meta } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ==========================================
// CONFIGURAÇÕES DE TEMA POR NÍVEL
// ==========================================
const themes: Record<MetaNivel, {
  primary: string;
  gradient: string;
  bg: string;
  text: string;
  emoji: string;
  lightGradient: string;
  label: string;
  hasParent: boolean;
  quickDateOptions: { label: string; value: number }[];
}> = {
  grande: {
    primary: '#4169E1',
    gradient: 'from-blue-600 to-indigo-700',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    emoji: '🏔️',
    lightGradient: 'from-slate-50 to-blue-50/30',
    label: 'Grande Meta',
    hasParent: false,
    quickDateOptions: [
      { label: '1 ano', value: 365 },
      { label: '2 anos', value: 730 },
      { label: '3 anos', value: 1095 },
      { label: '5 anos', value: 1825 },
    ],
  },
  anual: {
    primary: '#6366F1',
    gradient: 'from-indigo-500 to-violet-600',
    bg: 'bg-indigo-50',
    text: 'text-indigo-700',
    emoji: '📅',
    lightGradient: 'from-slate-50 to-indigo-50/30',
    label: 'Meta Anual',
    hasParent: true,
    quickDateOptions: [
      { label: '30 dias', value: 30 },
      { label: '60 dias', value: 60 },
      { label: '90 dias', value: 90 },
      { label: '6 meses', value: 180 },
    ],
  },
  mensal: {
    primary: '#10B981',
    gradient: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    emoji: '🗓️',
    lightGradient: 'from-slate-50 to-emerald-50/30',
    label: 'Meta Mensal',
    hasParent: true,
    quickDateOptions: [
      { label: '7 dias', value: 7 },
      { label: '15 dias', value: 15 },
      { label: '30 dias', value: 30 },
      { label: '60 dias', value: 60 },
    ],
  },
  semanal: {
    primary: '#F59E0B',
    gradient: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    emoji: '📆',
    lightGradient: 'from-slate-50 to-amber-50/30',
    label: 'Meta Semanal',
    hasParent: true,
    quickDateOptions: [
      { label: '3 dias', value: 3 },
      { label: '5 dias', value: 5 },
      { label: '7 dias', value: 7 },
      { label: '14 dias', value: 14 },
    ],
  },
  diaria: {
    primary: '#EC4899',
    gradient: 'from-rose-500 to-pink-600',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    emoji: '☀️',
    lightGradient: 'from-slate-50 to-rose-50/30',
    label: 'Meta Diária',
    hasParent: true,
    quickDateOptions: [],
  },
};

// ==========================================
// SCHEMA UNIFICADO DE EDIÇÃO
// ==========================================
const editMetaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200),
  area_id: z.string().uuid().nullable().optional(),
  descricao: z.string().max(2000).nullable().optional(),
  prazo: z.string().nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']).default('normal'),
  smart_objetivo: z.string().max(500).nullable().optional(),
  smart_especifico: z.string().max(500).nullable().optional(),
  smart_mensuravel: z.string().max(500).nullable().optional(),
  smart_alcancavel: z.string().max(500).nullable().optional(),
  smart_relevante: z.string().max(500).nullable().optional(),
  smart_temporizado: z.string().max(500).nullable().optional(),

  status: z.enum(['ativa', 'concluida', 'arquivada']).default('ativa'),
});

type EditMetaFormSchema = z.infer<typeof editMetaSchema>;

// ==========================================
// TIPOS
// ==========================================
type Step = 1 | 2 | 3;
type Prioridade = 'normal' | 'prioritaria' | 'one_thing';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function MetaEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { user, loadMetas } = useApp();
  
  const [meta, setMeta] = useState<Meta | null>(null);
  const [metaNivel, setMetaNivel] = useState<MetaNivel | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parentMeta, setParentMeta] = useState<Meta | null>(null);
  const [ancestors, setAncestors] = useState<Meta[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const id = params.id;
  const nivelFromUrl = params.nivel as MetaNivel | undefined;

  const theme = metaNivel ? themes[metaNivel] : themes.grande;

  const form = useForm<EditMetaFormSchema>({
    resolver: zodResolver(editMetaSchema),
    defaultValues: {
      titulo: '',
      area_id: null,
      descricao: null,
      prazo: null,
      parent_id: null,
      focusing_question: null,
      prioridade: 'normal',
      status: 'ativa',
    },
  });

  // Carregar meta existente
  useEffect(() => {
    async function loadMeta() {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await metasService.getById(id);
        if (data) {
          setMeta(data);
          const detectedNivel = data.nivel as MetaNivel;
          setMetaNivel(detectedNivel);
          
          // Converter one_thing (boolean) para prioridade (enum)
          const prioridade: Prioridade = data.one_thing 
            ? 'one_thing' 
            : (data.prioridade as Prioridade) || 'normal';
          
          // Resetar formulário com dados da meta
          form.reset({
            titulo: data.titulo,
            area_id: data.area_id,
            descricao: data.descricao,
            prazo: data.prazo,
            parent_id: data.parent_id,
            focusing_question: data.focusing_question,
            prioridade: prioridade,
            smart_objetivo: data.smart_objetivo,
            smart_especifico: data.smart_especifico,
            smart_mensuravel: data.smart_mensuravel,
            smart_alcancavel: data.smart_alcancavel,
            smart_relevante: data.smart_relevante,
            smart_temporizado: data.smart_temporizado,

            status: data.status,
          });

          // Carregar meta pai e ancestrais
          if (data.parent_id) {
            try {
              const parent = await metasService.getById(data.parent_id);
              if (parent) {
                setParentMeta(parent);
                const ancestorsList = await metasService.getMetaAncestors(parent.id);
                setAncestors(ancestorsList);
              }
            } catch (err) {
              console.error('Erro ao carregar meta pai:', err);
            }
          }
        }
      } catch (err) {
        console.error('Erro ao carregar meta:', err);
        setError('Erro ao carregar meta. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
    
    loadMeta();
  }, [id, form]);

  const handleParentSelect = useCallback(async (metaId: string | null) => {
    form.setValue('parent_id', metaId);
    
    if (metaId) {
      try {
        const meta = await metasService.getById(metaId);
        if (meta) {
          setParentMeta(meta);
          const ancestorsList = await metasService.getMetaAncestors(meta.id);
          setAncestors(ancestorsList);
        }
      } catch (error) {
        console.error('Erro ao carregar meta pai:', error);
      }
    } else {
      setParentMeta(null);
      setAncestors([]);
    }
  }, [form]);

  const validateStep = (step: Step): boolean => {
    setError(null);
    
    switch (step) {
      case 1: {
        const titulo = form.getValues('titulo');
        if (!titulo?.trim()) {
          setError('O título da meta é obrigatório');
          return false;
        }
        if (titulo.length < 3) {
          setError('O título deve ter pelo menos 3 caracteres');
          return false;
        }
        return true;
      }
      case 2: {
        const prioridade = form.getValues('prioridade');
        const parentId = form.getValues('parent_id');
        if (prioridade === 'one_thing' && metaNivel !== 'grande' && !parentId) {
          setError('ONE Thing precisa estar vinculada a uma meta pai');
          return false;
        }
        if (metaNivel === 'diaria' && !parentId) {
          setError('Meta diária deve ter uma meta pai');
          return false;
        }
        return true;
      }
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

  const setQuickDate = (days: number) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    form.setValue('prazo', date.toISOString().split('T')[0]);
  };

  const onSubmit = async (values: EditMetaFormSchema) => {
    if (!id || !metaNivel) return;

    try {
      setSaving(true);
      setError(null);

      const updateData: Record<string, unknown> = {
        titulo: values.titulo,
        descricao: values.descricao || null,
        area_id: values.area_id || null,
        prazo: values.prazo || null,
        parent_id: values.parent_id || null,
        focusing_question: values.focusing_question || null,
        one_thing: values.prioridade === 'one_thing',
        prioridade: values.prioridade,
        status: values.status,
      };

      // Adicionar campos SMART de acordo com o nível
      if (values.smart_objetivo !== undefined) updateData.smart_objetivo = values.smart_objetivo || null;
      if (values.smart_especifico !== undefined) updateData.smart_especifico = values.smart_especifico || null;
      if (values.smart_mensuravel !== undefined) updateData.smart_mensuravel = values.smart_mensuravel || null;
      if (values.smart_alcancavel !== undefined) updateData.smart_alcancavel = values.smart_alcancavel || null;
      if (values.smart_relevante !== undefined) updateData.smart_relevante = values.smart_relevante || null;
      if (values.smart_temporizado !== undefined) updateData.smart_temporizado = values.smart_temporizado || null;


      await metasService.update(id, updateData);
      await loadMetas();
      
      // Navegar de volta para os detalhes
      const nivelPath = metaNivel === 'grande' ? 'grandes' 
        : metaNivel === 'anual' ? 'anuais'
        : metaNivel === 'mensal' ? 'mensais'
        : metaNivel === 'semanal' ? 'semanais'
        : 'diarias';
      
      navigate(`/metas/${nivelPath}/${id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido ao salvar';
      console.error('Erro ao atualizar meta:', message);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const prioridadeOptions: { value: Prioridade; label: string; emoji: string; desc: string }[] = [
    { value: 'normal', label: 'Normal', emoji: '⚪', desc: 'Meta comum do dia a dia' },
    { value: 'prioritaria', label: 'Prioritária', emoji: '⭐', desc: 'Meta importante que precisa de atenção' },
    { value: 'one_thing', label: 'ONE Thing', emoji: '🔥', desc: 'Sua única prioridade absoluta' },
  ];

  const getReturnPath = () => {
    if (!metaNivel) return '/metas';
    switch (metaNivel) {
      case 'grande': return '/metas/grandes';
      case 'anual': return '/metas/anuais';
      case 'mensal': return '/metas/mensais';
      case 'semanal': return '/metas/semanais';
      case 'diaria': return '/metas/diarias';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${theme.lightGradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Carregando meta...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!meta || !metaNivel) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-600 mb-4">Meta não encontrada</p>
          <button
            onClick={() => navigate('/metas')}
            className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const today = format(new Date(), 'yyyy-MM-dd');

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme.lightGradient}`}>
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">{theme.emoji}</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Editar {theme.label}
            </h1>
          </div>
          <p className="text-slate-600">
            Atualize os detalhes da sua meta em 3 passos
          </p>
          {metaNivel === 'diaria' && (
            <div className="flex items-center justify-center gap-2 mt-2 text-rose-600 text-sm font-medium">
              <Sun className="w-4 h-4" />
              <span>{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</span>
            </div>
          )}
        </motion.div>

        {/* Stepper */}
        <MetaWizardStepIndicator currentStep={currentStep} themeColor={theme.primary} />

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
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="p-6 lg:p-8">
                  <AnimatePresence mode="wait">
                    {/* PASSO 1: Essenciais */}
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
                            Informações Essenciais
                          </h2>
                          <p className="text-slate-500 text-sm">
                            Edite os dados principais da sua meta
                          </p>
                        </div>

                        {/* Título */}
                        <FormField
                          control={form.control}
                          name="titulo"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Título da Meta *</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="Ex: Construir empresa de $1M"
                                    {...field}
                                    onBlur={() => setTouched(prev => ({ ...prev, titulo: true }))}
                                    className={`pl-12 border-2 transition-all ${
                                      field.value?.trim() && touched.titulo
                                        ? 'border-emerald-400'
                                        : 'border-slate-200'
                                    }`}
                                    style={{
                                      borderColor: field.value?.trim() && touched.titulo ? undefined : undefined
                                    }}
                                  />
                                  <Target className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
                                    field.value?.trim() ? 'text-emerald-500' : 'text-slate-400'
                                  }`} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Descrição */}
                        <FormField
                          control={form.control}
                          name="descricao"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-slate-700">Descrição</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Descreva sua meta..."
                                  className="resize-none border-2 border-slate-200 focus:border-blue-500 transition-all"
                                  rows={3}
                                  {...field}
                                  value={field.value || ''}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Área de Vida */}
                        <AreaVidaSelector
                          selectedId={form.watch('area_id')}
                          onSelect={(areaId) => form.setValue('area_id', areaId)}
                          themeColor={theme.primary}
                        />

                        {/* Prazo (não mostrar para diária como input editável) */}
                        {metaNivel !== 'diaria' && (
                          <FormField
                            control={form.control}
                            name="prazo"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-slate-700">Prazo *</FormLabel>
                                <FormControl>
                                  <div className="relative">
                                    <Input
                                      type="date"
                                      {...field}
                                      value={field.value || ''}
                                      className="border-2 border-slate-200 focus:border-blue-500 transition-all"
                                    />
                                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        )}

                        {/* Quick date buttons */}
                        {metaNivel !== 'diaria' && theme.quickDateOptions.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {theme.quickDateOptions.map((opt) => (
                              <button
                                key={opt.value}
                                type="button"
                                onClick={() => setQuickDate(opt.value)}
                                className="px-3 py-1.5 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 rounded-lg text-sm font-medium transition-colors"
                                style={{
                                  backgroundColor: undefined,
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = `${theme.primary}15`;
                                  e.currentTarget.style.color = theme.primary;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = '';
                                  e.currentTarget.style.color = '';
                                }}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        )}

                        {/* Data de hoje para diária */}
                        {metaNivel === 'diaria' && (
                          <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                            <div className="flex items-center gap-3">
                              <Sun className="w-5 h-5 text-rose-500" />
                              <div>
                                <p className="text-sm font-medium text-rose-800">Meta para hoje</p>
                                <p className="text-xs text-rose-600">
                                  {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* PASSO 2: ONE Thing & Foco */}
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
                            ONE Thing & Foco
                          </h2>
                          <p className="text-slate-500 text-sm">
                            Defina a prioridade e conexão com metas superiores
                          </p>
                        </div>

                        {/* Info card para Grande Meta */}
                        {metaNivel === 'grande' && (
                          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex items-start gap-3">
                              <Mountain className="w-5 h-5 text-blue-600 mt-0.5" />
                              <div>
                                <p className="font-medium text-blue-800">Grande Meta é o topo da hierarquia</p>
                                <p className="text-sm text-blue-600 mt-1">
                                  Grandes metas não precisam de meta pai. Elas são a fundação sobre a qual todas as outras metas serão construídas.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Focusing Question Card */}
                        <Card className={`bg-gradient-to-br ${theme.gradient} border-0 text-white`}>
                          <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-5 h-5 text-white/80" />
                              <span className="text-white/80 text-sm font-medium uppercase tracking-wide">
                                Focusing Question · {theme.label}
                              </span>
                            </div>
                            <FormField
                              control={form.control}
                              name="focusing_question"
                              render={({ field }) => (
                                <FormItem className="m-0">
                                  <FormControl>
                                    <Input
                                      placeholder={`Qual é a ÚNICA coisa que posso fazer ${metaNivel === 'grande' ? 'nos próximos anos' : metaNivel === 'anual' ? 'este ano' : metaNivel === 'mensal' ? 'este mês' : metaNivel === 'semanal' ? 'esta semana' : 'hoje'}...`}
                                      {...field}
                                      value={field.value || ''}
                                      className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white focus:ring-white/20"
                                    />
                                  </FormControl>
                                  <FormMessage className="text-white/80" />
                                </FormItem>
                              )}
                            />
                          </CardContent>
                        </Card>

                        {/* Prioridade */}
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-slate-700">
                            Nível de Prioridade
                          </label>
                          <div className="grid grid-cols-1 gap-3">
                            {prioridadeOptions.map((option) => {
                              const isSelected = form.watch('prioridade') === option.value;
                              return (
                                <motion.button
                                  key={option.value}
                                  type="button"
                                  whileHover={{ scale: 1.02, y: -2 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => form.setValue('prioridade', option.value)}
                                  className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 ${
                                    isSelected
                                      ? 'shadow-lg'
                                      : 'border-slate-200 hover:border-slate-300 bg-white'
                                  }`}
                                  style={{
                                    borderColor: isSelected ? theme.primary : undefined,
                                    backgroundColor: isSelected ? `${theme.primary}10` : undefined,
                                  }}
                                >
                                  <span className="text-2xl">{option.emoji}</span>
                                  <div>
                                    <p className="font-semibold" style={{ color: isSelected ? theme.primary : '#1e293b' }}>
                                      {option.label}
                                    </p>
                                    <p className="text-sm text-slate-500">{option.desc}</p>
                                  </div>
                                </motion.button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Meta Pai */}
                        {theme.hasParent && (
                          <MetaParentSelector
                            nivel={metaNivel}
                            onSelect={handleParentSelect}
                            selectedId={form.watch('parent_id')}
                          />
                        )}

                        {/* Hierarchy Preview */}
                        {(parentMeta || ancestors.length > 0) && (
                          <div className="mt-4">
                            <HierarchyTreePreview
                              ancestors={ancestors}
                              currentLevel={metaNivel}
                              currentTitle={form.watch('titulo') || undefined}
                            />
                          </div>
                        )}
                      </motion.div>
                    )}

                    {/* PASSO 3: Framework & Review */}
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
                            Framework & Revisão
                          </h2>
                          <p className="text-slate-500 text-sm">
                            Revise critérios SMART e finalize as alterações
                          </p>
                        </div>

                        {/* Campos SMART */}
                        <SmartFields nivel={metaNivel} />

                        {/* Status */}
                        <div className="space-y-3">
                          <label className="block text-sm font-semibold text-slate-700">
                            Status da Meta
                          </label>
                          <div className="grid grid-cols-3 gap-3">
                            {(['ativa', 'concluida', 'arquivada'] as const).map((status) => {
                              const isSelected = form.watch('status') === status;
                              const statusConfig = {
                                ativa: { label: 'Ativa', color: '#10B981', bg: '#10B98115' },
                                concluida: { label: 'Concluída', color: '#3B82F6', bg: '#3B82F615' },
                                arquivada: { label: 'Arquivada', color: '#6B7280', bg: '#6B728015' },
                              };
                              const config = statusConfig[status];
                              
                              return (
                                <motion.button
                                  key={status}
                                  type="button"
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => form.setValue('status', status)}
                                  className="p-3 rounded-xl border-2 transition-all text-center"
                                  style={{
                                    borderColor: isSelected ? config.color : '#e2e8f0',
                                    backgroundColor: isSelected ? config.bg : 'white',
                                  }}
                                >
                                  <p className="font-semibold text-sm" style={{ color: isSelected ? config.color : '#374151' }}>
                                    {config.label}
                                  </p>
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
                          disabled={saving}
                          className={`w-full py-4 bg-gradient-to-r ${theme.gradient} text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                        >
                          {saving ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Salvando alterações...
                            </>
                          ) : (
                            <>
                              <Save className="w-5 h-5" />
                              Salvar Alterações
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
                    onClick={currentStep === 1 ? () => navigate(getReturnPath()) : prevStep}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {currentStep === 1 ? 'Voltar' : 'Anterior'}
                  </button>
                  
                  {currentStep < 3 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 px-6 py-2 text-white rounded-lg font-medium hover:opacity-90 transition-colors"
                      style={{ backgroundColor: theme.primary }}
                    >
                      Continuar
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </Form>
          </motion.div>

          {/* Preview (Desktop) */}
          <div className="hidden lg:block sticky top-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Preview da meta
                </p>
                <button
                  onClick={() => navigate(getReturnPath())}
                  className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>
              <MetaPreviewCard
                titulo={form.watch('titulo')}
                descricao={form.watch('descricao') || undefined}
                nivel={metaNivel}
                prazo={metaNivel === 'diaria' ? today : (form.watch('prazo') || undefined)}
                areaId={form.watch('area_id')}
                parentMeta={parentMeta ? { titulo: parentMeta.titulo, nivel: parentMeta.nivel } : null}
                isOneThing={form.watch('prioridade') === 'one_thing'}
                theme={theme}
              />
              
              {/* Tips */}
              <div className={`mt-6 p-4 ${theme.bg} rounded-xl border`} style={{ borderColor: `${theme.primary}20` }}>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${theme.primary}15` }}>
                    <Target className="w-4 h-4" style={{ color: theme.primary }} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-1" style={{ color: theme.primary }}>
                      Dica do Goal Planner
                    </h4>
                    <p className="text-sm opacity-80" style={{ color: theme.primary }}>
                      {metaNivel === 'grande' && 'Grandes Metas são sua visão de longo prazo. Seja ambicioso, mas realista.'}
                      {metaNivel === 'anual' && 'Metas anuais devem ser ambiciosas mas alcançáveis. Foque no que realmente importa.'}
                      {metaNivel === 'mensal' && 'Metas mensais são pedras angulares. Foque em 1-3 metas mensais importantes.'}
                      {metaNivel === 'semanal' && 'Metas semanais são curtas e acionáveis. Foque em entregas concretas.'}
                      {metaNivel === 'diaria' && 'Metas diárias devem ser pequenas e acionáveis. O ideal é completar até o meio-dia.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Impacto */}
              <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <h4 className="font-semibold text-slate-700 text-sm mb-2">
                  Informações
                </h4>
                <div className="space-y-1 text-sm text-slate-500">
                  <p>Criada em: {meta?.created_at ? format(new Date(meta.created_at), 'dd/MM/yyyy') : '-'}</p>
                  <p>Última atualização: {meta?.updated_at ? format(new Date(meta.updated_at), 'dd/MM/yyyy') : '-'}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
