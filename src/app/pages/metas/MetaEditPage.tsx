import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { metasService, type MetaNivel } from '../../../services/metasService';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Checkbox } from '../../components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import { metaFormSchema, type MetaFormSchema } from './metaFormSchema';
import type { Database } from '../../../lib/supabase';

type Meta = Database['public']['Tables']['metas']['Row'];

const nivelLabels: Record<MetaNivel, string> = {
  grande: 'Grandes Metas',
  anual: 'Metas Anuais',
  mensal: 'Metas Mensais',
  semanal: 'Metas Semanais',
  diaria: 'Metas Diárias',
};

export default function MetaEditPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { areas, loadMetas } = useApp();
  
  const [meta, setMeta] = useState<Meta | null>(null);
  const [loading, setLoading] = useState(true);

  const nivel = (params.nivel as MetaNivel) || 'grande';
  const id = params.id;

  useEffect(() => {
    async function loadMeta() {
      if (!id) return;
      
      try {
        setLoading(true);
        const data = await metasService.getById(id);
        setMeta(data);
      } catch (err) {
        console.error('Erro ao carregar meta:', err);
      } finally {
        setLoading(false);
      }
    }
    
    loadMeta();
  }, [id]);

  const form = useForm<MetaFormSchema>({
    resolver: zodResolver(metaFormSchema),
    defaultValues: {
      titulo: '',
      descricao: '',
      area_id: '',
      nivel: nivel,
      one_thing: false,
      focusing_question: '',
      status: 'ativa',
    },
  });

  // Pre-populate form when meta is loaded
  useEffect(() => {
    if (meta) {
      form.reset({
        titulo: meta.titulo,
        descricao: meta.descricao || '',
        area_id: meta.area_id || '',
        nivel: meta.nivel,
        one_thing: meta.one_thing,
        focusing_question: meta.focusing_question || '',
        status: meta.status,
      });
    }
  }, [meta, form]);

  const onSubmit = async (values: MetaFormSchema) => {
    if (!id) return;
    
    try {
      await metasService.update(id, {
        titulo: values.titulo,
        descricao: values.descricao || null,
        area_id: values.area_id || null,
        nivel: values.nivel,
        one_thing: values.one_thing,
        focusing_question: values.focusing_question || null,
        status: values.status,
      });
      
      await loadMetas();
      navigate(`/metas/${nivel}/${id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao atualizar meta:', message);
    }
  };

  const handleNivelChange = (value: string) => {
    form.setValue('nivel', value as MetaNivel);
  };

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!meta) {
    return (
      <div className="p-6">
        <p className="text-red-500">Meta não encontrada</p>
        <Button onClick={() => navigate(`/metas/${nivel}`)} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to={`/metas/${nivel}`} className="hover:text-indigo-600">
          {nivelLabels[nivel]}
        </Link>
        <span>/</span>
        <Link to={`/metas/${nivel}/${id}`} className="hover:text-indigo-600">
          {meta.titulo}
        </Link>
        <span>/</span>
        <span className="text-slate-800">Editar</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/metas/${nivel}/${id}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl text-slate-800">Editar Meta</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Meta</CardTitle>
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
                      <Input placeholder="Ex: Executar projeto X" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Nível */}
              <FormField
                control={form.control}
                name="nivel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível</FormLabel>
                    <Select onValueChange={handleNivelChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="grande">Grande Meta</SelectItem>
                        <SelectItem value="anual">Meta Anual</SelectItem>
                        <SelectItem value="mensal">Meta Mensal</SelectItem>
                        <SelectItem value="semanal">Meta Semanal</SelectItem>
                        <SelectItem value="diaria">Meta Diária</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Área */}
              <FormField
                control={form.control}
                name="area_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma área (opcional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {areas.map((area) => (
                          <SelectItem key={area.id} value={area.id}>
                            {area.icone} {area.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                        rows={4}
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ONE Thing */}
              <FormField
                control={form.control}
                name="one_thing"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox 
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        Definir como ONE Thing
                      </FormLabel>
                      <p className="text-sm text-slate-500">
                        Esta será sua prioridade principal para este nível
                      </p>
                    </div>
                  </FormItem>
                )}
              />

              {/* Focusing Question */}
              <FormField
                control={form.control}
                name="focusing_question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Focusing Question</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Ex: Como posso avançar no projeto X hoje?" 
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ativa">Ativa</SelectItem>
                        <SelectItem value="concluida">Concluída</SelectItem>
                        <SelectItem value="arquivada">Arquivada</SelectItem>
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
              onClick={() => navigate(`/metas/${nivel}/${id}`)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}