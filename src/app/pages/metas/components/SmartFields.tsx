import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ChevronDown, ChevronUp, Lightbulb } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../../../components/ui/form';
import { Button } from '../../../components/ui/button';
import type { MetaNivel } from '../../types';
import { cn } from '../../../components/ui/utils';

interface SmartFieldsProps {
  nivel: MetaNivel;
}

const smartFieldsConfig: Record<MetaNivel, { label: string; description: string; fields: { name: string; label: string; placeholder: string; type: 'input' | 'textarea' }[] }> = {
  grande: {
    label: 'Campos SMART (Grande Meta)',
    description: 'Defina objetivos específicos e mensuráveis para sua Grande Meta',
    fields: [
      { name: 'smart_objetivo', label: 'Objetivo SMART', placeholder: 'Ex: Alcançar 1M de faturamento', type: 'textarea' },
      { name: 'smart_especifico', label: 'Meta Específica', placeholder: 'Ex: Aumentar vendas', type: 'input' },
      { name: 'smart_mensuravel', label: 'Meta Mensurável', placeholder: 'Ex: 50% de crescimento', type: 'input' },
      { name: 'smart_alcancavel', label: 'Meta Alcançável', placeholder: 'Ex: Com investimento de R$10k', type: 'input' },
      { name: 'smart_relevante', label: 'Meta Relevante', placeholder: 'Por que isso é importante?', type: 'textarea' },
      { name: 'smart_temporizado', label: 'Prazo', placeholder: 'Ex: Em 12 meses', type: 'input' },
    ],
  },
  anual: {
    label: 'Campos SMART (Meta Anual)',
    description: 'Defina KPIs e resultados-chave para sua Meta Anual',
    fields: [
      { name: 'smart_objetivo', label: 'Objetivo Principal', placeholder: 'O que você quer alcançar?', type: 'textarea' },
      { name: 'smart_especifico', label: 'Meta Específica', placeholder: 'Detalhe o que será feito', type: 'input' },
      { name: 'smart_mensuravel', label: 'Indicador (KPI)', placeholder: 'Como será medido?', type: 'input' },
      { name: 'smart_mensuravel', label: 'Resultado-Chave', placeholder: 'Qual resultado esperado?', type: 'textarea' },
    ],
  },
  mensal: {
    label: 'Campos SMART (Meta Mensal)',
    description: 'Defina a meta do mês e tarefas críticas',
    fields: [
      { name: 'smart_objetivo', label: 'Meta do Mês', placeholder: 'O que será entregue este mês?', type: 'textarea' },
      { name: 'smart_especifico', label: 'Tarefa Crítica', placeholder: 'Qual tarefa é fundamental?', type: 'input' },
      { name: 'smart_mensuravel', label: 'Critério de Conclusão', placeholder: 'Como saberemos que foi concluído?', type: 'input' },
    ],
  },
  semanal: {
    label: 'Campos SMART (Meta Semanal)',
    description: 'Defina entregas e ações prioritárias da semana',
    fields: [
      { name: 'smart_objetivo', label: 'Entrega da Semana', placeholder: 'O que será entregue?', type: 'textarea' },
      { name: 'smart_especifico', label: 'Ação Prioritária', placeholder: 'Qual ação trará maior impacto?', type: 'input' },
    ],
  },
  diaria: {
    label: 'Campos SMART (Meta Diária)',
    description: 'Definachecklist de tarefas do dia',
    fields: [
      { name: 'smart_objetivo', label: 'Checklist do Dia', placeholder: 'Liste as tarefas (uma por linha)', type: 'textarea' },
    ],
  },
};

export function SmartFields({ nivel }: SmartFieldsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const form = useFormContext();
  const config = smartFieldsConfig[nivel];

  // Filter out duplicate field names
  const uniqueFields = config.fields.filter((field, index, self) => 
    index === self.findIndex(f => f.name === field.name)
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <Button
          type="button"
          variant="ghost"
          className="w-full justify-between font-normal hover:bg-transparent"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base">{config.label}</CardTitle>
          </div>
          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        <CardDescription className={cn("mt-2", isOpen ? "block" : "hidden")}>
          {config.description}
        </CardDescription>
      </CardHeader>
      
      {isOpen && (
        <CardContent className="space-y-4">
          {uniqueFields.map((field) => (
            <FormField
              key={field.name}
              control={form.control}
              name={field.name}
              render={({ field: formField }) => (
                <FormItem>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    {field.type === 'textarea' ? (
                      <Textarea
                        placeholder={field.placeholder}
                        className="resize-none"
                        rows={3}
                        {...formField}
                        value={formField.value || ''}
                      />
                    ) : (
                      <Input
                        placeholder={field.placeholder}
                        {...formField}
                        value={formField.value || ''}
                      />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </CardContent>
      )}
    </Card>
  );
}
