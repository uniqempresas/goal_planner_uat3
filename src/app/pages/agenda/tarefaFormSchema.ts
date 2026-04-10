import { z } from 'zod';
import type { RecorrenciaConfig } from '../../../lib/supabase';

export const recorrenciaConfigSchema = z.object({
  tipo: z.enum(['unica', 'diaria', 'semanal', 'mensal', 'anual', 'intervalo_dias']),
  dias_semana: z.array(z.number().min(0).max(6)).optional(),
  dia_mes: z.number().min(1).max(31).optional(),
  mes_ano: z.number().min(0).max(11).optional(),
  dia_ano: z.number().min(1).max(31).optional(),
  intervalo_dias: z.number().min(1).max(365).optional(),
  data_inicio: z.string().optional(),
  data_fim: z.string().optional(),
  max_ocorrencias: z.number().optional(),
}) satisfies z.ZodType<Partial<RecorrenciaConfig>>;

export const tarefaFormSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  data: z.string().min(1, 'Data é obrigatória'), // YYYY-MM-DD
  hora: z.string().optional(),
  bloco: z.enum(['one-thing', 'manha', 'tarde', 'noite']).optional(),
  prioridade: z.enum(['alta', 'media', 'baixa']).default('media'),
  metaId: z.string().optional().nullable(),
  recorrencia: z.enum(['nenhuma', 'diaria', 'semanal']).default('nenhuma'),
  // Novo campo para configuração de recorrência
  recorrenciaConfig: recorrenciaConfigSchema.nullable().optional(),
});

export type TarefaFormSchema = z.infer<typeof tarefaFormSchema>;
