export type MetaNivel = 'grande' | 'anual' | 'mensal' | 'semanal' | 'diaria';

export type MetaStatus = 'ativa' | 'concluida' | 'atrasada' | 'critica' | 'backlog';

export type ViewMode = 'compacto' | 'normal' | 'detalhado';

export type GroupByOption = 'nenhum' | 'area' | 'data' | 'prioridade';

export interface Area {
  id: string;
  nome: string;
  icone?: string;
  cor?: string;
}

export interface Meta {
  id: string;
  user_id: string;
  area_id: string | null;
  parent_id: string | null;
  nivel: MetaNivel;
  titulo: string;
  descricao: string | null;
  status: 'ativa' | 'concluida' | 'arquivada';
  one_thing: boolean;
  prioridade?: 'normal' | 'prioritaria' | 'one_thing';
  focusing_question: string | null;
  prazo?: string | null;
  smart_objetivo?: string;
  smart_especifico?: string;
  smart_mensuravel?: string;
  smart_alcancavel?: string;
  smart_relevante?: string;
  smart_temporizado?: string;
  metricas?: {
    progresso_manual?: number;
    [key: string]: unknown;
  };
  created_at: string;
  updated_at: string;
  areas?: Area;
}

export interface MetaNode extends Meta {
  children?: MetaNode[];
  computedProgress: number;
  computedStatus: MetaStatus;
}

export interface FilterState {
  status: 'ativas' | 'concluidas' | 'atrasadas' | 'todas';
  searchQuery: string;
  areaId?: string;
  oneThingOnly?: boolean;
}

export interface PersistedState {
  expandedNodes: string[];
  viewMode: ViewMode;
  filters: FilterState;
  lastVisited: string;
}

export interface FilterCriteria {
  status?: 'ativas' | 'concluidas' | 'atrasadas' | 'todas';
  searchQuery?: string;
  areaId?: string;
  oneThingOnly?: boolean;
}

export type GroupedMetas = Record<string, MetaNode[]>;
