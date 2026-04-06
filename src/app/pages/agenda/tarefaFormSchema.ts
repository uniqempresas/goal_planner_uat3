import { z } from 'zod';

export const tarefaFormSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório'),
  descricao: z.string().optional(),
  data: z.string().min(1, 'Data é obrigatória'), // YYYY-MM-DD
  hora: z.string().optional(),
  bloco: z.enum(['one-thing', 'manha', 'tarde', 'noite']).optional(),
  prioridade: z.enum(['alta', 'media', 'baixa']).default('media'),
  metaId: z.string().optional().nullable(),
  recorrencia: z.enum(['nenhuma', 'diaria', 'semanal']).default('nenhuma'),
});

export type TarefaFormSchema = z.infer<typeof tarefaFormSchema>;
