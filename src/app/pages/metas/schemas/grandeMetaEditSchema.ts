import { z } from 'zod';

export const grandeMetaEditSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200),
  area_id: z.string().uuid().nullable().optional(),
  descricao: z.string().max(2000).nullable().optional(),
  prazo: z.string().min(1, 'Prazo é obrigatório'),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']).default('normal'),
  smart_objetivo: z.string().max(500).nullable().optional(),
  smart_iniciativa: z.string().max(500).nullable().optional(),
  status: z.enum(['ativa', 'concluida', 'arquivada']).default('ativa'),
});

export type GrandeMetaEditFormSchema = z.infer<typeof grandeMetaEditSchema>;
