import { z } from 'zod';

export const mensalMetaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200),
  area_id: z.string().uuid().nullable().optional(),
  descricao: z.string().max(2000).nullable().optional(),
  prazo: z.string().refine((date) => new Date(date) > new Date(), {
    message: 'Prazo deve ser uma data futura',
  }),
  parent_id: z.string().uuid().nullable().optional(),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']).default('normal'),
  smart_meta: z.string().max(200).nullable().optional(),
  smart_tarefa: z.string().max(500).nullable().optional(),
});

export type MensalMetaFormSchema = z.infer<typeof mensalMetaSchema>;
