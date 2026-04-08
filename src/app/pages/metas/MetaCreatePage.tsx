import { useNavigate, Link, useParams } from 'react-router';
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

const nivelLabels: Record<MetaNivel, string> = {
  grande: 'Grandes Metas',
  anual: 'Metas Anuais',
  mensal: 'Metas Mensais',
  semanal: 'Metas Semanais',
  diaria: 'Metas Diárias',
};

export default function MetaCreatePage() {
  const navigate = useNavigate();
  const params = useParams();
  const { user, areas, loadMetas } = useApp();

  const nivel = (params.nivel as MetaNivel) || 'grande';

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

  // Helper para obter o caminho correto da lista (grande -> grandes)
  const getListPath = (n: MetaNivel) => n === 'grande' ? 'grandes' : n;

  const onSubmit = async (values: MetaFormSchema) => {
    if (!user) return;
    
    try {
      const nivelValue = values.nivel || nivel;
      
      await metasService.create(user.id, {
        titulo: values.titulo,
        descricao: values.descricao || null,
        area_id: values.area_id || null,
        nivel: nivelValue,
        one_thing: values.one_thing,
        focusing_question: values.focusing_question || null,
        status: values.status,
      });
      
      await loadMetas();
      // Navigate to the list page
      navigate(`/metas/${getListPath(nivelValue)}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('Erro ao criar meta:', message);
    }
  };

  const handleNivelChange = (value: string) => {
    form.setValue('nivel', value as MetaNivel);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to={`/metas/${getListPath(nivel)}`} className="hover:text-indigo-600">
          {nivelLabels[nivel]}
        </Link>
        <span>/</span>
        <span className="text-slate-800">Criar</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate(`/metas/${getListPath(nivel)}`)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl text-slate-800">Criar Nova Meta</h1>
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/metas/${getListPath(nivel)}`)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Criar Meta
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}