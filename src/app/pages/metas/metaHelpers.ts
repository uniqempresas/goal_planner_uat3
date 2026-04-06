// Helper to transform database meta to mock format for display
export function transformMeta(dbMeta: Database['public']['Tables']['metas']['Row']): Partial<Meta> {
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
    progress: 0, // Calculate based on children
    prazo: new Date().toISOString(), // Default
    focusingQuestion: dbMeta.focusing_question || '',
    isOneThing: dbMeta.one_thing,
    smart: undefined, // Not implemented yet
    createdAt: dbMeta.created_at,
  };
}
