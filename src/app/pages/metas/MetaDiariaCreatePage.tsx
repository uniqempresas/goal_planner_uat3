import { useNavigate, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { metasService } from '../../../services/metasService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { MetaParentSelector } from './components/MetaParentSelector';
import { HierarchyTreePreview } from './components/HierarchyTreePreview';
import { PrioritySelector } from './components/PrioritySelector';
import { SmartFields } from './components/SmartFields';
import { diariaMetaSchema, type DiariaMetaFormSchema } from './schemas/diariaMetaSchema';
import type { Meta } from '../types';

const nivelLabel = 'Meta Diária';

export default function MetaDiariaCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loadMetas } = useApp();
  const [parentMeta, setParentMeta] = useState<Meta | null>(null);
  const [ancestors, setAncestors] = useState<Meta[]>([]);
  const [checklistItems, setChecklistItems] = useState<string[]>([]);

  const paiParam = searchParams.get('pai');

  const form = useForm<DiariaMetaFormSchema>({
    resolver: zodResolver(diariaMetaSchema),
    defaultValues: {
      titulo: '',
      descricao: null,
      parent_id: paiParam,
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
            
            // Carregar ancestors
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

  const onSubmit = async (values: DiariaMetaFormSchema) => {
    if (!user) return;

    try {
      await metasService.create(user.id, {
        titulo: values.titulo,
        descricao: values.descricao || null,
        nivel: 'diaria',
        parent_id: values.parent_id || null,
        one_thing: values.prioridade === 'one_thing',
        smart_objetivo: values.smart_objetivo || null,
        status: 'ativa',
      });

      await loadMetas();
      navigate('/metas/diaria');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao criar meta:', message);
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

  const addChecklistItem = () => {
    setChecklistItems([...checklistItems, '']);
  };

  const updateChecklistItem = (index: number, value: string) => {
    const newItems = [...checklistItems];
    newItems[index] = value;
    setChecklistItems(newItems);
  };

  const removeChecklistItem = (index: number) => {
    setChecklistItems(checklistItems.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <ArrowLeft className="h-4 w-4" />
        <span>{nivelLabel}</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/metas/diaria')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-slate-800">Criar {nivelLabel}</h1>
      </div>

      {/* Hierarchy Preview */}
      {(parentMeta || ancestors.length > 0) && (
        <div className="mb-6">
          <HierarchyTreePreview
            ancestors={ancestors}
            currentLevel="diaria"
            currentTitle={form.watch('titulo') || undefined}
          />
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle>Informações da {nivelLabel}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Título */}
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Executar tarefa X" {...field} />
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
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva os detalhes desta meta..."
                        className="resize-none"
                        rows={3}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Meta Pai */}
          <MetaParentSelector
            nivel="diaria"
            onSelect={handleParentSelect}
            selectedId={form.watch('parent_id')}
          />

          {/* Prioridade */}
          <Card>
            <CardHeader>
              <CardTitle>Prioridade</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="prioridade"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <PrioritySelector
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Campos SMART */}
          <SmartFields nivel="diaria" />

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/metas/diaria')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Criar {nivelLabel}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
