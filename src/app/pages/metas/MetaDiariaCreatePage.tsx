import { useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Calendar, 
  Target, 
  ChevronLeft, 
  ChevronRight,
  Check,
  ArrowRight,
  Lightbulb,
  Star,
  TrendingUp,
  Sun
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { metasService, type MetaNivel } from '../../../services/metasService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { MetaParentSelector } from './components/MetaParentSelector';
import { HierarchyTreePreview } from './components/HierarchyTreePreview';
import { SmartFields } from './components/SmartFields';
import { MetaWizardStepIndicator } from '../../components/metas/MetaWizardStepIndicator';
import { MetaPreviewCard } from '../../components/metas/MetaPreviewCard';
import { AreaVidaSelector } from '../../components/metas/AreaVidaSelector';
import { diariaMetaSchema, type DiariaMetaFormSchema } from './schemas/diariaMetaSchema';
import type { Meta } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// ==========================================
// CONFIGURAÇÃO DO TEMA
// ==========================================
const THEME = {
  primary: '#EC4899',
  gradient: 'from-rose-500 to-pink-600',
  bg: 'bg-rose-50',
  text: 'text-rose-700',
  emoji: '☀️',
  lightGradient: 'from-slate-50 to-rose-50/30',
};

const NIVEL_LABEL = 'Meta Diária';
const NIVEL: MetaNivel = 'diaria';

// ==========================================
// TIPOS
// ==========================================
type Step = 1 | 2 | 3;
type Prioridade = 'normal' | 'prioritaria' | 'one_thing';

// ==========================================
// COMPONENTE PRINCIPAL
// ==========================================
export default function MetaDiariaCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, areas, loadMetas } = useApp();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parentMeta, setParentMeta] = useState<Meta | null>(null);
  const [ancestors, setAncestors] = useState<Meta[]>([]);

  const paiParam = searchParams.get('pai');
  const today = format(new Date(), 'yyyy-MM-dd');

  const form = useForm<DiariaMetaFormSchema>({
    resolver: zodResolver(diariaMetaSchema),
    defaultValues: {
      titulo: '',
      area_id: null,
      descricao: null,
      parent_id: paiParam,
      focusing_question: null,
      prioridade: 'normal',
      smart_objetivo: undefined,
    },
  });

  // Carregar meta pai se existir
  useEffect(() => {
    async function loadParentMeta() {
      if (paiParam && user) {
        try {
          const meta = await metasService.getById(paiParam);
          if (meta) {
            setParentMeta(meta);
            form.setValue('parent_id', meta.id);
            const ancestorsList = await metasService.getMetaAncestors(meta.id);
            setAncestors(ancestorsList);
          }
        } catch (error) {
          console.error('Erro ao carregar meta pai:', error);
        }
      }
    }
    loadParentMeta();
  }, [paiParam, user]);

  // Validação em tempo real
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
        if (prioridade === 'one_thing' && !parentId) {
          setError('ONE Thing precisa estar vinculada a uma meta pai');
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

  const handleParentSelect = async (metaId: string | null) => {
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
  };

  const onSubmit = async (values: DiariaMetaFormSchema) => {
    if (!user) return;

    try {
      setLoading(true);
      await metasService.create(user.id, {
        titulo: values.titulo,
        descricao: values.descricao || null,
        area_id: values.area_id || null,
        nivel: NIVEL,
        parent_id: values.parent_id || null,
        prazo: today, // Meta diária sempre para hoje
        focusing_question: values.focusing_question || null,
        one_thing: values.prioridade === 'one_thing',
        smart_objetivo: values.smart_objetivo || null,
        status: 'ativa',
      });

      await loadMetas();
      navigate('/metas/diaria');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao criar meta:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const prioridadeOptions: { value: Prioridade; label: string; emoji: string; desc: string }[] = [
    { value: 'normal', label: 'Normal', emoji: '⚪', desc: 'Meta comum do dia a dia' },
    { value: 'prioritaria', label: 'Prioritária', emoji: '⭐', desc: 'Meta importante que precisa de atenção' },
    { value: 'one_thing', label: 'ONE Thing', emoji: '🔥', desc: 'Sua única prioridade absoluta' },
  ];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${THEME.lightGradient}`}>
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <span className="text-4xl">{THEME.emoji}</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-slate-900">
              Criar {NIVEL_LABEL}
            </h1>
          </div>
          <p className="text-slate-600">
            Defina o que você precisa conquistar hoje em 3 passos
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-rose-600 text-sm font-medium">
            <Sun className="w-4 h-4" />
            <span>{format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}</span>
          </div>
        </motion.div>

        {/* Stepper */}
        <MetaWizardStepIndicator currentStep={currentStep} themeColor={THEME.primary} />

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
                            Comece definindo o básico da sua meta de hoje
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
                                    placeholder="Ex: Completar tarefa prioritária"
                                    {...field}
                                    onBlur={() => setTouched(prev => ({ ...prev, titulo: true }))}
                                    className={`pl-12 border-2 transition-all ${
                                      field.value?.trim() && touched.titulo
                                        ? 'border-emerald-400'
                                        : 'border-slate-200 focus:border-rose-500'
                                    }`}
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
                                  placeholder="Descreva os detalhes desta meta..."
                                  className="resize-none border-2 border-slate-200 focus:border-rose-500 transition-all"
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
                          themeColor={THEME.primary}
                        />

                        {/* Data de hoje (readonly) */}
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

                        {/* Focusing Question Card */}
                        <Card className={`bg-gradient-to-br ${THEME.gradient} border-0 text-white`}>
                          <CardContent className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                              <TrendingUp className="w-5 h-5 text-white/80" />
                              <span className="text-white/80 text-sm font-medium uppercase tracking-wide">
                                Focusing Question · {NIVEL_LABEL}
                              </span>
                            </div>
                            <FormField
                              control={form.control}
                              name="focusing_question"
                              render={({ field }) => (
                                <FormItem className="m-0">
                                  <FormControl>
                                    <Input
                                      placeholder="Qual é a ÚNICA coisa que posso fazer hoje..."
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
                                      ? 'border-rose-500 bg-rose-50 shadow-lg'
                                      : 'border-slate-200 hover:border-slate-300 bg-white'
                                  }`}
                                >
                                  <span className="text-2xl">{option.emoji}</span>
                                  <div>
                                    <p className={`font-semibold ${isSelected ? 'text-rose-700' : 'text-slate-800'}`}>
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
                        <MetaParentSelector
                          nivel={NIVEL}
                          onSelect={handleParentSelect}
                          selectedId={form.watch('parent_id')}
                        />

                        {/* Hierarchy Preview */}
                        {(parentMeta || ancestors.length > 0) && (
                          <div className="mt-4">
                            <HierarchyTreePreview
                              ancestors={ancestors}
                              currentLevel={NIVEL}
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
                            Defina critérios SMART e revise sua meta
                          </p>
                        </div>

                        {/* Campos SMART */}
                        <SmartFields nivel={NIVEL} />

                        {/* Submit */}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          disabled={loading}
                          className={`w-full py-4 bg-gradient-to-r ${THEME.gradient} text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
                        >
                          {loading ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Criando meta...
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-5 h-5" />
                              Criar {NIVEL_LABEL}
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
                    onClick={currentStep === 1 ? () => navigate('/metas/diaria') : prevStep}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-slate-600 hover:bg-slate-200 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    {currentStep === 1 ? 'Voltar' : 'Anterior'}
                  </button>
                  
                  {currentStep < 3 && (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="flex items-center gap-2 px-6 py-2 bg-rose-600 text-white rounded-lg font-medium hover:bg-rose-700 transition-colors"
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
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                Preview da meta
              </p>
              <MetaPreviewCard
                titulo={form.watch('titulo')}
                descricao={form.watch('descricao') || undefined}
                nivel={NIVEL}
                prazo={today}
                areaId={form.watch('area_id')}
                parentMeta={parentMeta ? { titulo: parentMeta.titulo, nivel: parentMeta.nivel } : null}
                isOneThing={form.watch('prioridade') === 'one_thing'}
                theme={THEME}
              />
              
              {/* Tips */}
              <div className="mt-6 p-4 bg-rose-50 rounded-xl border border-rose-100">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 h-4 text-rose-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-rose-900 text-sm mb-1">
                      Dica do Goal Planner
                    </h4>
                    <p className="text-rose-700 text-sm">
                      Metas diárias devem ser pequenas e acionáveis. O ideal é completar sua meta diária até o meio-dia.
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
