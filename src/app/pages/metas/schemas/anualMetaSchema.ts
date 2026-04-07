import { z } from 'zod';

export const anualMetaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200),
  area_id: z.string().uuid().nullable().optional(),
  descricao: z.string().max(2000).nullable().optional(),
  prazo: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Prazo deve ser uma data futura',
  }),
  parent_id: z.string().uuid().nullable().optional(),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']).default('normal'),
  smart_kpi: z.string().max(100).nullable().optional(),
  smart_resultado: z.string().max(500).nullable().optional(),
});

export type AnualMetaFormSchema = z.infer<typeof anualMetaSchema>;
