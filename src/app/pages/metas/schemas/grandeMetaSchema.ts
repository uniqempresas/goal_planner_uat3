import { z } from 'zod';

export const grandeMetaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200),
  area_id: z.string().uuid().nullable().optional(),
  descricao: z.string().max(2000).nullable().optional(),
  prazo: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Prazo deve ser uma data futura',
  }),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']).default('normal'),
  smart_objetivo: z.string().max(500).nullable().optional(),
  smart_iniciativa: z.string().max(500).nullable().optional(),
});

export type GrandeMetaFormSchema = z.infer<typeof grandeMetaSchema>;
