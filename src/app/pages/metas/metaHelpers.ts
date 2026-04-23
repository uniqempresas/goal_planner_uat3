import { metasService } from '../../../services/metasService';

// Helper to transform database meta to display format
export async function transformMeta(dbMeta: Database['public']['Tables']['metas']['Row']): Promise<Partial<Meta>> {
  // Calcular progresso real baseado nas tarefas vinculadas
  const progressoReal = await metasService.calcularProgresso(dbMeta.id);
  
  return {
    id: dbMeta.id,
    title: dbMeta.titulo,
    description: dbMeta.descricao || '',
    level: dbMeta.nivel === 'grande' ? 'G' : 
           dbMeta.nivel === 'anual' ? 'A' : 
           dbMeta.nivel === 'mensal' ? 'M' : 
           dbMeta.nivel === 'semanal' ? 'S' : 'D',
    areaId: dbMeta.area_id || '',
    parentId: dbMeta.parent_id,
    status: dbMeta.status === 'ativa' ? 'active' : 
            dbMeta.status === 'concluida' ? 'completed' : 
            dbMeta.status === 'arquivada' ? 'paused' : 'not_started',
    progress: dbMeta.status === 'concluida' ? 100 : progressoReal, // 100% se concluída, senão progresso real
    prazo: dbMeta.prazo || new Date().toISOString().split('T')[0], // Usar prazo do banco ou data atual
    focusingQuestion: dbMeta.focusing_question || '',
    isOneThing: dbMeta.one_thing,
    smart: undefined, // Not implemented yet
    createdAt: dbMeta.created_at,
  };
}

// Versão síncrona para quando o progresso já é conhecido
export function transformMetaSync(
  dbMeta: Database['public']['Tables']['metas']['Row'], 
  progresso: number = 0
): Partial<Meta> {
  return {
    id: dbMeta.id,
    title: dbMeta.titulo,
    description: dbMeta.descricao || '',
    level: dbMeta.nivel === 'grande' ? 'G' : 
           dbMeta.nivel === 'anual' ? 'A' : 
           dbMeta.nivel === 'mensal' ? 'M' : 
           dbMeta.nivel === 'semanal' ? 'S' : 'D',
    areaId: dbMeta.area_id || '',
    parentId: dbMeta.parent_id,
    status: dbMeta.status === 'ativa' ? 'active' : 
            dbMeta.status === 'concluida' ? 'completed' : 
            dbMeta.status === 'arquivada' ? 'paused' : 'not_started',
    progress: dbMeta.status === 'concluida' ? 100 : progresso,
    prazo: dbMeta.prazo || new Date().toISOString().split('T')[0],
    focusingQuestion: dbMeta.focusing_question || '',
    isOneThing: dbMeta.one_thing,
    smart: undefined,
    createdAt: dbMeta.created_at,
  };
}
