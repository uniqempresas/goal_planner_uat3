import { useNavigate, Link } from 'react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../components/ui/form';
import EmojiPicker from '../../components/forms/EmojiPicker';
import ColorPicker from '../../components/forms/ColorPicker';
import { areaFormSchema, type AreaFormSchema } from './areaFormSchema';

export default function AreaCreatePage() {
  const navigate = useNavigate();
  const { createArea } = useApp();

  const form = useForm<AreaFormSchema>({
    resolver: zodResolver(areaFormSchema),
    defaultValues: {
      name: '',
      emoji: '🎯',
      color: '#6366f1',
      description: '',
    },
  });

  const onSubmit = async (values: AreaFormSchema) => {
    try {
      const newArea = await createArea(values);
      navigate(`/areas/${newArea.id}`);
    } catch (error) {
      console.error('Erro ao criar área:', error);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/areas" className="hover:text-indigo-600">Áreas</Link>
        <span>/</span>
        <span className="text-slate-800">Criar</span>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/areas')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl text-slate-800">Criar Nova Área</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Área</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Nome */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome *</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Carreira, Saúde, Família" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Emoji */}
              <FormField
                control={form.control}
                name="emoji"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ícone (Emoji)</FormLabel>
                    <FormControl>
                      <EmojiPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Cor */}
              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <FormControl>
                      <ColorPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Descrição */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva os objetivos desta área de vida..." 
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
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/areas')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Criar Área
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
