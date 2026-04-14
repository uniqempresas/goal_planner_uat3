import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import type { Database } from '../../../lib/supabase';
import { tarefasService } from '../../../services/tarefasService';
import { tarefaItensService } from '../../../services/tarefaItensService';
import { recorrenciaService } from '../../../services/recorrenciaService';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Target, CheckCircle2, Circle, AlertTriangle, Flag, Repeat, ListChecks } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { RecorrenciaEditModal } from '../../components/recorrencia/RecorrenciaEditModal';
import { formatarRecorrencia } from '../../../services/recorrenciaService';
import { TarefaItensList } from '../../components/agenda/TarefaItensList';
import type { TarefaItemUI } from '../../../lib/mapeamento';

type Tarefa = Database['public']['Tables']['tarefas']['Row'];

const tarefaEditSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  data: z.string().min(1, 'Data é obrigatória'),
  hora: z.string().optional(),
  bloco: z.enum(['one-thing', 'manha', 'tarde', 'noite']).optional(),
  prioridade: z.enum(['alta', 'media', 'baixa']),
  metaId: z.string().optional().nullable(),
  recorrencia: z.enum(['nenhuma', 'diaria', 'semanal']),
});

type TarefaEditForm = z.infer<typeof tarefaEditSchema>;

export default function TarefaEditPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, metasSemanais, metasMensais, loadTarefas } = useApp();
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Estados para recorrência
  const [isInstanciaRecorrente, setIsInstanciaRecorrente] = useState(false);
  const [tarefaMae, setTarefaMae] = useState<Tarefa | null>(null);
  const [showRecorrenciaModal, setShowRecorrenciaModal] = useState(false);
  const [modalMode, setModalMode] = useState<'edit' | 'delete'>('edit');

  // Estados para itens da tarefa
  const [itens, setItens] = useState<TarefaItemUI[]>([]);
  const [loadingItens, setLoadingItens] = useState(false);

  const metasSemanaisOptions = metasSemanais.map(m => ({ id: m.id, titulo: m.titulo, nivel: 'Semanal' }));
  const metasMensaisOptions = metasMensais.map(m => ({ id: m.id, titulo: m.titulo, nivel: 'Mensal' }));
  const allMetas = [...metasSemanaisOptions, ...metasMensaisOptions];

  const form = useForm<TarefaEditForm>({
    resolver: zodResolver(tarefaEditSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      data: new Date().toISOString().split('T')[0],
      hora: '',
      bloco: undefined,
      prioridade: 'media',
      metaId: undefined,
      recorrencia: 'nenhuma',
    },
  });

  useEffect(() => {
    if (!id || !user) return;
    
    const carregarTarefa = async () => {
      try {
        const t = await tarefasService.getById(id);
        setTarefa(t);
        
        if (t) {
          form.reset({
            titulo: t.titulo,
            descricao: t.descricao || '',
            data: t.data,
            hora: t.hora || '',
            bloco: t.bloco as 'one-thing' | 'manha' | 'tarde' | 'noite' | undefined,
            prioridade: t.prioridade,
            metaId: t.meta_id || undefined,
            recorrencia: t.recorrencia,
          });

          // Carregar itens da tarefa
          setLoadingItens(true);
          try {
            const itensData = await tarefaItensService.getByTarefaId(id);
            // Mapear para formato UI
            setItens(itensData.map(i => ({
              id: i.id,
              tarefaId: i.tarefa_id,
              nome: i.nome,
              ordem: i.ordem,
              completed: i.completed,
            })));
          } catch (err) {
            console.error('Erro ao carregar itens:', err);
          } finally {
            setLoadingItens(false);
          }
        
          // Verificar se é instância de recorrente
          const isInstancia = await tarefasService.isInstanciaRecorrente(id);
          setIsInstanciaRecorrente(isInstancia);

          if (isInstancia) {
            const parent = await tarefasService.getParentPorInstancia(id);
            setTarefaMae(parent);
          }
        }
      } catch (error) {
        console.error('Erro ao carregar tarefa:', error);
      } finally {
        setLoading(false);
      }
    };

    carregarTarefa();
  }, [id, user, form]);

  // Handlers para itens
  const handleToggleItem = async (itemId: string) => {
    try {
      await tarefaItensService.toggle(itemId);
      // Atualizar estado local
      setItens(prev => prev.map(item => 
        item.id === itemId ? { ...item, completed: !item.completed } : item
      ));
    } catch (err) {
      console.error('Erro ao toggle item:', err);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    try {
      await tarefaItensService.delete(itemId);
      setItens(prev => prev.filter(item => item.id !== itemId));
    } catch (err) {
      console.error('Erro ao excluir item:', err);
    }
  };

  const handleAddItem = async (nome: string) => {
    if (!id) return;
    try {
      const novoItem = await tarefaItensService.create({
        tarefa_id: id,
        nome,
      });
      setItens(prev => [...prev, {
        id: novoItem.id,
        tarefaId: novoItem.tarefa_id,
        nome: novoItem.nome,
        ordem: novoItem.ordem,
        completed: novoItem.completed,
      }]);
    } catch (err) {
      console.error('Erro ao adicionar item:', err);
    }
  };

  const handleSubmitNormal = async (values: TarefaEditForm) => {
    if (!id) return;
    setSaving(true);
    try {
      await tarefasService.update(id, {
        titulo: values.titulo,
        descricao: values.descricao || null,
        data: values.data,
        hora: values.hora || null,
        bloco: values.bloco || null,
        prioridade: values.prioridade,
        meta_id: values.metaId || null,
        recorrencia: values.recorrencia,
      });
      navigate(`/agenda/tarefas/${id}`);
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = async (values: TarefaEditForm) => {
    // Se é instância de recorrente, mostrar modal
    if (isInstanciaRecorrente) {
      setModalMode('edit');
      setShowRecorrenciaModal(true);
      return;
    }

    // Edição normal
    await handleSubmitNormal(values);
  };

  const handleDeleteClick = () => {
    if (isInstanciaRecorrente) {
      setModalMode('delete');
      setShowRecorrenciaModal(true);
      return;
    }
    setShowDeleteConfirm(true);
  };

  const handleDeleteNormal = async () => {
    if (!id) return;
    await tarefasService.delete(id);
    navigate('/agenda/hoje');
  };

  // Handlers para recorrência
  const handleEditEsta = async () => {
    if (!id) return;
    const values = form.getValues();
    await tarefasService.update(id, {
      titulo: values.titulo,
      descricao: values.descricao || null,
      data: values.data,
      hora: values.hora || null,
      bloco: values.bloco || null,
      prioridade: values.prioridade,
      meta_id: values.metaId || null,
    });
    await loadTarefas();
    navigate(`/agenda/tarefas/${id}`);
  };

  const handleEditFuturas = async () => {
    if (!tarefaMae?.id) return;
    const values = form.getValues();
    await recorrenciaService.editarTodasFuturas(tarefaMae.id, {
      titulo: values.titulo,
      descricao: values.descricao || null,
      hora: values.hora || null,
      bloco: values.bloco || null,
      prioridade: values.prioridade,
      meta_id: values.metaId || null,
    });
    await loadTarefas();
    navigate(`/agenda/tarefas/${id}`);
  };

  const handleEditTodas = async () => {
    if (!tarefaMae?.id) return;
    const values = form.getValues();
    await recorrenciaService.editarTodas(tarefaMae.id, {
      titulo: values.titulo,
      descricao: values.descricao || null,
      hora: values.hora || null,
      bloco: values.bloco || null,
      prioridade: values.prioridade,
      meta_id: values.metaId || null,
    });
    await loadTarefas();
    navigate(`/agenda/tarefas/${id}`);
  };

  const handleDeleteEsta = async () => {
    if (!id) return;
    await recorrenciaService.excluirApenasEsta(id);
    await loadTarefas();
    navigate('/agenda/hoje');
  };

  const handleDeleteFuturas = async () => {
    if (!tarefaMae?.id || !tarefa) return;
    await recorrenciaService.excluirTodasFuturas(tarefaMae.id, tarefa.data);
    await loadTarefas();
    navigate('/agenda/hoje');
  };

  const handleDeleteTodas = async () => {
    if (!tarefaMae?.id) return;
    await recorrenciaService.excluirTodas(tarefaMae.id);
    await loadTarefas();
    navigate('/agenda/hoje');
  };

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!tarefa) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Tarefa não encontrada</h2>
        <p className="text-slate-500 mb-6">Esta tarefa pode ter sido excluída.</p>
        <Link to="/agenda/hoje" className="text-indigo-600 hover:text-indigo-700">
          Voltar para Agenda de Hoje
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/agenda/hoje" className="hover:text-indigo-600">Agenda</Link>
        <span>/</span>
        <Link to={`/agenda/tarefas/${id}`} className="hover:text-indigo-600">Tarefa</Link>
        <span>/</span>
        <span className="text-slate-800">Editar</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/agenda/tarefas/${id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl text-slate-800">Editar Tarefa</h1>
      </div>

      {/* Badge de recorrência */}
      {isInstanciaRecorrente && tarefaMae?.recorrencia_config && (
        <div className="mb-6 flex items-center gap-2 p-3 bg-purple-50 border border-purple-100 rounded-lg">
          <Repeat className="w-4 h-4 text-purple-600" />
          <span className="text-sm text-purple-700">
            Tarefa recorrente: {formatarRecorrencia(tarefaMae.recorrencia_config)}
          </span>
        </div>
      )}

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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                    <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
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
                        {metasSemanaisOptions.length > 0 && (
                          <>
                            <SelectLabel>Metas Semanais</SelectLabel>
                            {metasSemanaisOptions.map(meta => (
                              <SelectItem key={meta.id} value={meta.id}>
                                <div className="flex items-center gap-2">
                                  <Target className="h-4 w-4 text-indigo-500" />
                                  <span>{meta.titulo}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </>
                        )}
                        {metasMensaisOptions.length > 0 && (
                          <>
                            <SelectLabel>Metas Mensais</SelectLabel>
                            {metasMensaisOptions.map(meta => (
                              <SelectItem key={meta.id} value={meta.id}>
                                <div className="flex items-center gap-2">
                                  <Target className="h-4 w-4 text-indigo-500" />
                                  <span>{meta.titulo}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Itens da Tarefa (Checklist) */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-indigo-500" />
                Itens da Tarefa
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loadingItens ? (
                <div className="text-slate-400 text-sm">Carregando itens...</div>
              ) : (
                <TarefaItensList
                  itens={itens}
                  onToggle={handleToggleItem}
                  onDelete={handleDeleteItem}
                  onAdd={handleAddItem}
                />
              )}
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              type="button" 
              variant="destructive"
              onClick={handleDeleteClick}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate(`/agenda/tarefas/${id}`)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </form>
      </Form>

      {/* Delete Confirmation Modal (para tarefas normais) */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Excluir Tarefa?</h3>
            <p className="text-slate-500 mb-6">
              Esta ação não pode ser desfeita. A tarefa "{tarefa?.titulo}" será excluída permanentemente.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteNormal}
                className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Recorrência */}
      <RecorrenciaEditModal
        isOpen={showRecorrenciaModal}
        onClose={() => setShowRecorrenciaModal(false)}
        onEditEsta={handleEditEsta}
        onEditFuturas={handleEditFuturas}
        onEditTodas={handleEditTodas}
        onDeleteEsta={handleDeleteEsta}
        onDeleteFuturas={handleDeleteFuturas}
        onDeleteTodas={handleDeleteTodas}
        tarefaTitulo={tarefa?.titulo || ''}
        mode={modalMode}
      />
    </div>
  );
}
