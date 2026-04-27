import { z } from 'zod';

export const semanalMetaEditSchema = z.object({
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres').max(200),
  area_id: z.string().uuid().nullable().optional(),
  descricao: z.string().max(2000).nullable().optional(),
  prazo: z.string().min(1, 'Prazo é obrigatório'),
  parent_id: z.string().uuid().nullable().optional(),
  focusing_question: z.string().max(300).nullable().optional(),
  prioridade: z.enum(['normal', 'prioritaria', 'one_thing']).default('normal'),
  smart_entrega: z.string().max(500).nullable().optional(),
  smart_acao: z.string().max(500).nullable().optional(),
  status: z.enum(['ativa', 'concluida', 'arquivada']).default('ativa'),
});

export type SemanalMetaEditFormSchema = z.infer<typeof semanalMetaEditSchema>;
