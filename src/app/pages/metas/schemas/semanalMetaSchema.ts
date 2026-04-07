import { z } from 'zod';

export const semanalMetaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200),
  area_id: z.string().uuid().nullable().optional(),
  descricao: z.string().max(2000).nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']).default('normal'),
  smart_entrega: z.string().max(500).nullable().optional(),
  smart_acao: z.string().max(500).nullable().optional(),
});

export type SemanalMetaFormSchema = z.infer<typeof semanalMetaSchema>;
