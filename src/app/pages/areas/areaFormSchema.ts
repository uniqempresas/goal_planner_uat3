import { z } from 'zod';

export const areaFormSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(100),
  emoji: z.string().optional().default('🎯'),
  color: z.string().regex(/^#/).default('#6366f1'),
  description: z.string().max(500).optional().default(''),
});

export type AreaFormSchema = z.infer<typeof areaFormSchema>;