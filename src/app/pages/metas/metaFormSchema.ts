import { z } from 'zod';

export const metaFormSchema = z.object({
  titulo: z.string().min(1, 'Título é obrigatório').max(200),
  descricao: z.string().max(1000).optional().default(''),
  area_id: z.string().optional(),
  one_thing: z.boolean().optional().default(false),
  focusing_question: z.string().max(500).optional().default(''),
  status: z.enum(['ativa', 'concluida', 'arquivada']).default('ativa'),
});

export type MetaFormSchema = z.infer<typeof metaFormSchema>;