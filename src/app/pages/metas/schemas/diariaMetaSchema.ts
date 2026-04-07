import { z } from 'zod';

export const diariaMetaSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200),
  descricao: z.string().max(2000).nullable().optional(),
  parent_id: z.string().uuid().nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']).default('normal'),
  smart_checklist: z.array(z.string()).optional().default([]),
});

export type DiariaMetaFormSchema = z.infer<typeof diariaMetaSchema>;
