export type MetaNivel = 'grande' | 'anual' | 'mensal' | 'semanal' | 'diaria';

export type Prioridade = 'normal' | 'prioritaria' | 'one_thing';

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
  prioridade?: Prioridade;
  focusing_question: string | null;
  // Campos SMART (nomes do banco)
  smart_objetivo?: string;
  smart_especifico?: string;
  smart_mensuravel?: string;
  smart_alcancavel?: string;
  smart_relevante?: string;
  smart_temporizado?: string;
  metricas?: Record<string, unknown>;
  // Timestamps
  created_at: string;
  updated_at: string;
}

// Tipo para o formulário (sem campos automáticos)
export type MetaFormBase = {
  titulo: string;
  area_id: string | null;
  descricao: string | null;
  parent_id: string | null;
  prioridade: Prioridade;
  focusing_question: string | null;
};

export type GrandeMetaForm = MetaFormBase & {
  nivel: 'grande';
  prazo: string;
  smart_objetivo?: string;
  smart_especifico?: string;
  smart_mensuravel?: string;
  smart_alcancavel?: string;
  smart_relevante?: string;
  smart_temporizado?: string;
};

export type AnualMetaForm = MetaFormBase & {
  nivel: 'anual';
  prazo: string;
  smart_objetivo?: string;
  smart_especifico?: string;
  smart_mensuravel?: string;
  smart_alcancavel?: string;
  smart_relevante?: string;
  smart_temporizado?: string;
};

export type MensalMetaForm = MetaFormBase & {
  nivel: 'mensal';
  prazo: string;
  smart_objetivo?: string;
  smart_especifico?: string;
  smart_mensuravel?: string;
  smart_alcancavel?: string;
  smart_relevante?: string;
  smart_temporizado?: string;
};

export type SemanalMetaForm = MetaFormBase & {
  nivel: 'semanal';
  prazo: string;
  smart_objetivo?: string;
  smart_especifico?: string;
  smart_mensuravel?: string;
  smart_alcancavel?: string;
  smart_relevante?: string;
  smart_temporizado?: string;
};

export type DiariaMetaForm = MetaFormBase & {
  nivel: 'diaria';
  prazo: string;
  smart_objetivo?: string;
  smart_especifico?: string;
  smart_mensuravel?: string;
  smart_alcancavel?: string;
  smart_relevante?: string;
  smart_temporizado?: string;
};

export type AnyMetaForm = GrandeMetaForm | AnualMetaForm | MensalMetaForm | SemanalMetaForm | DiariaMetaForm;
