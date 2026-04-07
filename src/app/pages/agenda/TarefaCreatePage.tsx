import { useNavigate, Link, useSearchParams } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Target, Calendar, Clock, Repeat, Flag } from 'lucide-react';
import { useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { tarefaFormSchema, type TarefaFormSchema } from './tarefaFormSchema';

export default function TarefaCreatePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { createTarefa, grandesMetas, metasAnuais } = useApp();

  // Get params from URL
  const dataParam = searchParams.get('data');
  const blocoParam = searchParams.get('bloco');

  // Combine all metas for the select
  const allMetas = [
    ...grandesMetas.map(m => ({ id: m.id, titulo: m.titulo, nivel: 'Grande' })),
    ...metasAnuais.map(m => ({ id: m.id, titulo: m.titulo, nivel: 'Anual' })),
  ];

  const form = useForm<TarefaFormSchema>({
    resolver: zodResolver(tarefaFormSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      data: dataParam || new Date().toISOString().split('T')[0],
      hora: '',
      bloco: blocoParam as 'one-thing' | 'manha' | 'tarde' | 'noite' | undefined,
      prioridade: 'media',
      metaId: undefined,
      recorrencia: 'nenhuma',
    },
  });

  // Update form when params change
  useEffect(() => {
    if (dataParam) {
      form.setValue('data', dataParam);
    }
    if (blocoParam) {
      form.setValue('bloco', blocoParam as any);
    }
  }, [dataParam, blocoParam, form]);

  const onSubmit = async (values: TarefaFormSchema) => {
    try {
      await createTarefa({
        titulo: values.titulo,
        descricao: values.descricao,
        data: values.data,
        hora: values.hora || null,
        bloco: values.bloco || null,
        prioridade: values.prioridade,
        meta_id: values.metaId || null,
        recorrencia: values.recorrencia,
        completed: false,
      });
      navigate('/agenda/hoje');
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/agenda/hoje" className="hover:text-indigo-600">Agenda</Link>
        <span>/</span>
        <span className="text-slate-800">Criar Tarefa</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/agenda/hoje')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl text-slate-800">Nova Tarefa</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalhes da Tarefa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Título */}
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>O que precisa ser feito? *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Estudar React 1 hora" {...field} />
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
                        placeholder="Detalhes adicionais..." 
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

              {/* Data e Hora */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="data"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <Input type="date" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hora"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Clock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <Input type="time" className="pl-9" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Bloco */}
              <FormField
                control={form.control}
                name="bloco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bloco de Tempo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um bloco" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="one-thing">☀️ ONE Thing (Manhã)</SelectItem>
                        <SelectItem value="manha">🌅 Manhã</SelectItem>
                        <SelectItem value="tarde">☀️ Tarde</SelectItem>
                        <SelectItem value="noite">🌙 Noite</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Prioridade */}
              <FormField
                control={form.control}
                name="prioridade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a prioridade" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="alta">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-red-500" />
                            <span>Alta</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="media">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-amber-500" />
                            <span>Média</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="baixa">
                          <div className="flex items-center gap-2">
                            <Flag className="h-4 w-4 text-slate-400" />
                            <span>Baixa</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Meta Vinculada */}
              <FormField
                control={form.control}
                name="metaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vincular a uma Meta</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value || undefined}
                      value={field.value || undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma meta (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {allMetas.map(meta => (
                          <SelectItem key={meta.id} value={meta.id}>
                            <div className="flex items-center gap-2">
                              <Target className="h-4 w-4 text-indigo-500" />
                              <span>{meta.titulo}</span>
                              <span className="text-xs text-slate-400 ml-auto">({meta.nivel})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Recorrência */}
              <FormField
                control={form.control}
                name="recorrencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repetição</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a recorrência" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nenhuma">Não repetir</SelectItem>
                        <SelectItem value="diaria">Todo dia</SelectItem>
                        <SelectItem value="semanal">Toda semana</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/agenda/hoje')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Criar Tarefa
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
