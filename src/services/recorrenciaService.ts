import { supabase } from '../lib/supabase';
import type { Database, RecorrenciaConfig, TipoRecorrencia } from '../lib/supabase';
import { DIAS_SEMANA } from '../lib/supabase';

// Tipos do banco
type Tarefa = Database['public']['Tables']['tarefas']['Row'];
type TarefaInsert = Database['public']['Tables']['tarefas']['Insert'];

// ============================================
// CONSTANTES
// ============================================

/** Número de dias para gerar instâncias inicialmente */
const DIAS_GERACAO_INICIAL = 30;
/** Número de dias mínimo de "estoque" antes de gerar mais */
const DIAS_MINIMO_ESTOQUE = 15;
/** Número de dias para gerar no lazy loading */
const DIAS_LAZY_LOADING = 30;
/** Número máximo de ocorrências por vez */
const MAX_OCORRENCIAS_BATCH = 365;

// Dias da semana: 0=Seg, 6=Dom (formato usado internamente)
// JavaScript getDay(): 0=Dom, 1=Seg, ..., 6=Sab

// ============================================
// FUNÇÕES DE CÁLCULO DE DATAS
// ============================================

/**
 * Converte dia da semana do JavaScript (0=Dom) para nosso formato (0=Seg)
 */
function mapDiaSemanaJS(jsDay: number): number {
  return jsDay === 0 ? 6 : jsDay - 1;
}

/**
 * Converte dia da semana do nosso formato (0=Seg) para JavaScript (0=Dom)
 */
function mapDiaSemanaToJS(day: number): number {
  return day === 6 ? 0 : day + 1;
}

/**
 * Formata data para YYYY-MM-DD
 */
function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

/**
 * Calcula datas para recorrência semanal
 */
export function calcularDatasSemanal(
  dataInicio: string,
  diasSemana: number[],
  dataFim?: string,
  maxOcorrencias?: number
): string[] {
  const datas: string[] = [];
  const start = new Date(dataInicio);
  const end = dataFim ? new Date(dataFim) : null;
  const max = maxOcorrencias || MAX_OCORRENCIAS_BATCH;

  // Validar dias da semana
  if (!diasSemana || diasSemana.length === 0) {
    console.warn('[recorrencia] Nenhum dia da semana selecionado');
    return [];
  }

  let current = new Date(start);
  let count = 0;

  // Normalizar dias da semana para garantir ordenação
  const diasOrdenados = [...diasSemana].sort((a, b) => a - b);

  while ((!end || current <= end) && count < max) {
    const jsDay = current.getDay(); // 0=Dom, 1=Seg, ..., 6=Sab
    const mappedDay = mapDiaSemanaJS(jsDay); // 0=Seg, 6=Dom

    if (diasOrdenados.includes(mappedDay) && current >= start) {
      datas.push(formatDate(current));
      count++;
    }

    current.setDate(current.getDate() + 1);
  }

  console.log(`[recorrencia] Calculadas ${datas.length} datas semanais de ${dataInicio} até ${dataFim || 'sem limite'}`);
  return datas;
}

/**
 * Calcula datas para recorrência diária
 */
export function calcularDatasDiaria(
  dataInicio: string,
  dataFim?: string,
  maxOcorrencias?: number
): string[] {
  const datas: string[] = [];
  const start = new Date(dataInicio);
  const end = dataFim ? new Date(dataFim) : null;
  const max = maxOcorrencias || MAX_OCORRENCIAS_BATCH;

  let current = new Date(start);
  let count = 0;

  while ((!end || current <= end) && count < max) {
    datas.push(formatDate(current));
    current.setDate(current.getDate() + 1);
    count++;
  }

  console.log(`[recorrencia] Calculadas ${datas.length} datas diárias`);
  return datas;
}

/**
 * Calcula datas para recorrência a cada X dias
 */
export function calcularDatasIntervalo(
  dataInicio: string,
  intervaloDias: number,
  dataFim?: string,
  maxOcorrencias?: number
): string[] {
  const datas: string[] = [];
  const start = new Date(dataInicio);
  const end = dataFim ? new Date(dataFim) : null;
  const max = maxOcorrencias || MAX_OCORRENCIAS_BATCH;

  // Validar intervalo
  if (!intervaloDias || intervaloDias < 1) {
    console.warn('[recorrencia] Intervalo inválido:', intervaloDias);
    return [];
  }

  let current = new Date(start);
  let count = 0;

  while ((!end || current <= end) && count < max) {
    datas.push(formatDate(current));
    current.setDate(current.getDate() + intervaloDias);
    count++;
  }

  console.log(`[recorrencia] Calculadas ${datas.length} datas com intervalo de ${intervaloDias} dias`);
  return datas;
}

/**
 * Calcula datas para recorrência mensal
 */
export function calcularDatasMensal(
  dataInicio: string,
  diaMes: number,
  dataFim?: string,
  maxOcorrencias?: number
): string[] {
  const datas: string[] = [];
  const start = new Date(dataInicio);
  const end = dataFim ? new Date(dataFim) : null;
  const max = maxOcorrencias || 24; // 2 anos por padrão

  // Validar dia do mês
  if (!diaMes || diaMes < 1 || diaMes > 31) {
    console.warn('[recorrencia] Dia do mês inválido:', diaMes);
    return [];
  }

  // Iniciar no primeiro dia do mês de início
  let current = new Date(start.getFullYear(), start.getMonth(), diaMes);

  // Se a data calculada for anterior à data de início, avançar um mês
  if (current < start) {
    current.setMonth(current.getMonth() + 1);
  }

  let count = 0;
  while ((!end || current <= end) && count < max) {
    // Ajustar para o último dia do mês se necessário
    const ultimoDia = new Date(current.getFullYear(), current.getMonth() + 1, 0).getDate();
    const diaAjustado = Math.min(diaMes, ultimoDia);
    const dataAjustada = new Date(current.getFullYear(), current.getMonth(), diaAjustado);

    // Verificar se a data ajustada está dentro do limite
    if (end && dataAjustada > end) break;

    datas.push(formatDate(dataAjustada));
    current.setMonth(current.getMonth() + 1);
    count++;
  }

  console.log(`[recorrencia] Calculadas ${datas.length} datas mensais (dia ${diaMes})`);
  return datas;
}

/**
 * Calcula datas para recorrência anual
 */
export function calcularDatasAnual(
  dataInicio: string,
  mesAno: number,
  diaAno: number,
  dataFim?: string,
  maxOcorrencias?: number
): string[] {
  const datas: string[] = [];
  const start = new Date(dataInicio);
  const end = dataFim ? new Date(dataFim) : null;
  const max = maxOcorrencias || 10; // 10 anos por padrão

  // Validar mês e dia
  if (mesAno === undefined || mesAno < 0 || mesAno > 11) {
    console.warn('[recorrencia] Mês inválido:', mesAno);
    return [];
  }
  if (!diaAno || diaAno < 1 || diaAno > 31) {
    console.warn('[recorrencia] Dia inválido:', diaAno);
    return [];
  }

  // Iniciar no ano de início
  let current = new Date(start.getFullYear(), mesAno, diaAno);

  // Se a data calculada for anterior à data de início, avançar um ano
  if (current < start) {
    current.setFullYear(current.getFullYear() + 1);
  }

  let count = 0;
  while ((!end || current <= end) && count < max) {
    // Ajustar para o último dia do mês se necessário
    const ultimoDia = new Date(current.getFullYear(), mesAno + 1, 0).getDate();
    const diaAjustado = Math.min(diaAno, ultimoDia);
    const dataAjustada = new Date(current.getFullYear(), mesAno, diaAjustado);

    // Verificar se a data ajustada está dentro do limite
    if (end && dataAjustada > end) break;

    datas.push(formatDate(dataAjustada));
    current.setFullYear(current.getFullYear() + 1);
    count++;
  }

  console.log(`[recorrencia] Calculadas ${datas.length} datas anuais`);
  return datas;
}

/**
 * Calcula todas as datas de ocorrência baseado na configuração
 */
export function calcularDatas(
  config: RecorrenciaConfig,
  dataInicio: string,
  dataFim?: string,
  maxOcorrencias?: number
): string[] {
  console.log(`[recorrencia] Calculando datas para tipo: ${config.tipo}`);

  switch (config.tipo) {
    case 'diaria':
      return calcularDatasDiaria(
        dataInicio,
        dataFim || config.data_fim,
        maxOcorrencias || config.max_ocorrencias
      );

    case 'semanal':
      return calcularDatasSemanal(
        dataInicio,
        config.dias_semana || [],
        dataFim || config.data_fim,
        maxOcorrencias || config.max_ocorrencias
      );

    case 'mensal':
      return calcularDatasMensal(
        dataInicio,
        config.dia_mes || 1,
        dataFim || config.data_fim,
        maxOcorrencias || config.max_ocorrencias
      );

    case 'anual':
      return calcularDatasAnual(
        dataInicio,
        config.mes_ano || 0,
        config.dia_ano || 1,
        dataFim || config.data_fim,
        maxOcorrencias || config.max_ocorrencias
      );

    case 'intervalo_dias':
      return calcularDatasIntervalo(
        dataInicio,
        config.intervalo_dias || 1,
        dataFim || config.data_fim,
        maxOcorrencias || config.max_ocorrencias
      );

    case 'unica':
    default:
      return [dataInicio];
  }
}

// ============================================
// FUNÇÕES DE GERAÇÃO DE INSTÂNCIAS
// ============================================

/**
 * Cria uma instância de tarefa baseada na tarefa mãe
 */
function criarInstancia(tarefaMae: Tarefa, data: string): Omit<TarefaInsert, 'id' | 'created_at'> {
  return {
    user_id: tarefaMae.user_id,
    meta_id: tarefaMae.meta_id,
    titulo: tarefaMae.titulo,
    descricao: tarefaMae.descricao,
    data: data,
    hora: tarefaMae.hora,
    bloco: tarefaMae.bloco,
    prioridade: tarefaMae.prioridade,
    completed: false,
    recorrencia: 'nenhuma',
    parent_id: tarefaMae.id,
    is_template: false,
    recorrencia_config: null,
    data_fim_recorrencia: null,
  };
}

/**
 * Verifica se já existe uma instância para uma data específica
 */
async function verificarInstanciaExistente(
  parentId: string,
  data: string
): Promise<boolean> {
  const { data: existente, error } = await supabase
    .from('tarefas')
    .select('id')
    .eq('parent_id', parentId)
    .eq('data', data)
    .limit(1);

  if (error) {
    console.error('[recorrencia] Erro ao verificar instância existente:', error);
    return false;
  }

  return existente && existente.length > 0;
}

/**
 * Gera instâncias de uma tarefa recorrente
 */
export async function gerarInstancias(
  tarefaMae: Tarefa,
  diasParaFrente: number = DIAS_GERACAO_INICIAL
): Promise<Tarefa[]> {
  console.log(`[recorrencia] Gerando instâncias para tarefa ${tarefaMae.id} (${tarefaMae.titulo})`);

  // Verificar se tem configuração de recorrência
  if (!tarefaMae.recorrencia_config || tarefaMae.recorrencia_config.tipo === 'unica') {
    console.log('[recorrencia] Tarefa não é recorrente ou não tem configuração');
    return [];
  }

  // Calcular datas de geração
  const hoje = new Date();
  const dataInicio = formatDate(hoje);
  const dataFim = new Date(hoje);
  dataFim.setDate(dataFim.getDate() + diasParaFrente);

  // Calcular todas as datas
  const datas = calcularDatas(
    tarefaMae.recorrencia_config,
    dataInicio,
    formatDate(dataFim)
  );

  console.log(`[recorrencia] ${datas.length} datas calculadas`);

  // Criar instâncias (verificando duplicatas)
  const instanciasParaCriar: Omit<TarefaInsert, 'id' | 'created_at'>[] = [];

  for (const data of datas) {
    const existe = await verificarInstanciaExistente(tarefaMae.id, data);
    if (!existe) {
      instanciasParaCriar.push(criarInstancia(tarefaMae, data));
    } else {
      console.log(`[recorrencia] Instância para ${data} já existe, pulando`);
    }
  }

  console.log(`[recorrencia] ${instanciasParaCriar.length} instâncias novas para criar`);

  // Inserir em batch
  if (instanciasParaCriar.length > 0) {
    const { data: criadas, error } = await supabase
      .from('tarefas')
      .insert(instanciasParaCriar)
      .select();

    if (error) {
      console.error('[recorrencia] Erro ao criar instâncias:', error);
      throw error;
    }

    console.log(`[recorrencia] ${criadas?.length || 0} instâncias criadas com sucesso`);
    return criadas || [];
  }

  return [];
}

/**
 * Verifica se precisa gerar mais instâncias (lazy loading)
 */
export async function verificarEGerarNovasInstancias(
  tarefaMaeId: string,
  diasMinimos: number = DIAS_MINIMO_ESTOQUE
): Promise<boolean> {
  console.log(`[recorrencia] Verificando necessidade de novas instâncias para ${tarefaMaeId}`);

  // Buscar tarefa mãe
  const { data: tarefaMae, error: errorMae } = await supabase
    .from('tarefas')
    .select('*')
    .eq('id', tarefaMaeId)
    .eq('is_template', true)
    .single();

  if (errorMae || !tarefaMae) {
    console.error('[recorrencia] Tarefa mãe não encontrada:', errorMae);
    return false;
  }

  // Verificar se tem data fim e se já passou
  if (tarefaMae.data_fim_recorrencia) {
    const dataFim = new Date(tarefaMae.data_fim_recorrencia);
    const hoje = new Date();
    if (dataFim < hoje) {
      console.log('[recorrencia] Recorrência já terminou');
      return false;
    }
  }

  // Buscar última instância
  const { data: ultimasInstancias, error: errorInstancias } = await supabase
    .from('tarefas')
    .select('data')
    .eq('parent_id', tarefaMaeId)
    .order('data', { ascending: false })
    .limit(1);

  if (errorInstancias) {
    console.error('[recorrencia] Erro ao buscar última instância:', errorInstancias);
    return false;
  }

  // Se não tem instâncias, precisa gerar
  if (!ultimasInstancias || ultimasInstancias.length === 0) {
    console.log('[recorrencia] Nenhuma instância encontrada, gerando...');
    await gerarInstancias(tarefaMae, DIAS_GERACAO_INICIAL);
    return true;
  }

  // Verificar se precisa de mais instâncias
  const ultimaData = new Date(ultimasInstancias[0].data);
  const hoje = new Date();
  const dataLimite = new Date(hoje);
  dataLimite.setDate(dataLimite.getDate() + diasMinimos);

  if (ultimaData < dataLimite) {
    console.log(`[recorrencia] Última instância (${ultimasInstancias[0].data}) está próxima, gerando mais...`);
    await gerarInstancias(tarefaMae, DIAS_LAZY_LOADING);
    return true;
  }

  console.log('[recorrencia] Não precisa gerar novas instâncias');
  return false;
}

// ============================================
// FUNÇÕES DE EDIÇÃO
// ============================================

/**
 * Atualiza apenas uma instância específica
 */
export async function editarApenasEsta(
  instanciaId: string,
  dados: Partial<TarefaInsert>
): Promise<Tarefa> {
  console.log(`[recorrencia] Editando apenas instância ${instanciaId}`);

  const { data, error } = await supabase
    .from('tarefas')
    .update(dados)
    .eq('id', instanciaId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Atualiza a tarefa mãe e todas as instâncias futuras
 * Remove instâncias futuras antigas e regenera com novas regras
 */
export async function editarTodasFuturas(
  parentId: string,
  dadosMae: Partial<TarefaInsert>,
  novaConfig?: RecorrenciaConfig
): Promise<void> {
  console.log(`[recorrencia] Editando todas as futuras da tarefa ${parentId}`);

  const hoje = formatDate(new Date());

  // Atualizar tarefa mãe
  const updateData: Partial<TarefaInsert> = { ...dadosMae };
  if (novaConfig) {
    updateData.recorrencia_config = novaConfig;
  }

  const { error: errorUpdate } = await supabase
    .from('tarefas')
    .update(updateData)
    .eq('id', parentId);

  if (errorUpdate) throw errorUpdate;

  // Deletar instâncias futuras (a partir de hoje)
  const { error: errorDelete } = await supabase
    .from('tarefas')
    .delete()
    .eq('parent_id', parentId)
    .gte('data', hoje);

  if (errorDelete) throw errorDelete;

  // Buscar tarefa mãe atualizada
  const { data: tarefaMae, error: errorMae } = await supabase
    .from('tarefas')
    .select('*')
    .eq('id', parentId)
    .single();

  if (errorMae || !tarefaMae) {
    throw new Error('Tarefa mãe não encontrada após atualização');
  }

  // Regenerar instâncias
  await gerarInstancias(tarefaMae, DIAS_GERACAO_INICIAL);

  console.log('[recorrencia] Todas as futuras atualizadas com sucesso');
}

/**
 * Atualiza a tarefa mãe e TODAS as instâncias (passadas e futuras)
 */
export async function editarTodas(
  parentId: string,
  dadosMae: Partial<TarefaInsert>,
  novaConfig?: RecorrenciaConfig
): Promise<void> {
  console.log(`[recorrencia] Editando TODAS as instâncias da tarefa ${parentId}`);

  // Atualizar tarefa mãe
  const updateData: Partial<TarefaInsert> = { ...dadosMae };
  if (novaConfig) {
    updateData.recorrencia_config = novaConfig;
  }

  const { error: errorUpdate } = await supabase
    .from('tarefas')
    .update(updateData)
    .eq('id', parentId);

  if (errorUpdate) throw errorUpdate;

  // Atualizar todas as instâncias (exceto data e completed)
  const instanciaUpdate = {
    titulo: dadosMae.titulo,
    descricao: dadosMae.descricao,
    hora: dadosMae.hora,
    bloco: dadosMae.bloco,
    prioridade: dadosMae.prioridade,
    meta_id: dadosMae.meta_id,
  };

  const { error: errorUpdateInstancias } = await supabase
    .from('tarefas')
    .update(instanciaUpdate)
    .eq('parent_id', parentId);

  if (errorUpdateInstancias) throw errorUpdateInstancias;

  console.log('[recorrencia] Todas as instâncias atualizadas com sucesso');
}

// ============================================
// FUNÇÕES DE EXCLUSÃO
// ============================================

/**
 * Exclui apenas uma instância específica (soft delete via status ou delete físico)
 */
export async function excluirApenasEsta(instanciaId: string): Promise<void> {
  console.log(`[recorrencia] Excluindo apenas instância ${instanciaId}`);

  const { error } = await supabase
    .from('tarefas')
    .delete()
    .eq('id', instanciaId);

  if (error) throw error;
}

/**
 * Cancela recorrência a partir de uma data (define data_fim_recorrencia)
 */
export async function excluirTodasFuturas(
  parentId: string,
  aPartirDe?: string
): Promise<void> {
  const dataLimite = aPartirDe || formatDate(new Date());
  console.log(`[recorrencia] Cancelando futuras a partir de ${dataLimite}`);

  // Definir data fim na tarefa mãe
  const ontem = new Date(dataLimite);
  ontem.setDate(ontem.getDate() - 1);

  const { error: errorUpdate } = await supabase
    .from('tarefas')
    .update({ data_fim_recorrencia: formatDate(ontem) })
    .eq('id', parentId);

  if (errorUpdate) throw errorUpdate;

  // Deletar instâncias futuras
  const { error: errorDelete } = await supabase
    .from('tarefas')
    .delete()
    .eq('parent_id', parentId)
    .gte('data', dataLimite);

  if (errorDelete) throw errorDelete;

  console.log('[recorrencia] Futuras excluídas com sucesso');
}

/**
 * Exclui tarefa mãe e todas as instâncias
 */
export async function excluirTodas(parentId: string): Promise<void> {
  console.log(`[recorrencia] Excluindo tarefa mãe ${parentId} e todas as instâncias`);

  // Deletar todas as instâncias
  const { error: errorDeleteInstancias } = await supabase
    .from('tarefas')
    .delete()
    .eq('parent_id', parentId);

  if (errorDeleteInstancias) throw errorDeleteInstancias;

  // Deletar tarefa mãe
  const { error: errorDeleteMae } = await supabase
    .from('tarefas')
    .delete()
    .eq('id', parentId);

  if (errorDeleteMae) throw errorDeleteMae;

  console.log('[recorrencia] Tarefa e todas as instâncias excluídas');
}

// ============================================
// FUNÇÕES DE UTILIDADE
// ============================================

/**
 * Busca templates de recorrência ativos de um usuário
 */
export async function getTemplatesAtivos(userId: string): Promise<Tarefa[]> {
  const { data, error } = await supabase
    .from('tarefas')
    .select('*')
    .eq('user_id', userId)
    .eq('is_template', true)
    .is('data_fim_recorrencia', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[recorrencia] Erro ao buscar templates:', error);
    throw error;
  }

  return data || [];
}

/**
 * Busca instâncias de uma tarefa mãe
 */
export async function getInstancias(
  parentId: string,
  dataInicio?: string,
  dataFim?: string
): Promise<Tarefa[]> {
  let query = supabase
    .from('tarefas')
    .select('*')
    .eq('parent_id', parentId)
    .order('data', { ascending: true });

  if (dataInicio) {
    query = query.gte('data', dataInicio);
  }

  if (dataFim) {
    query = query.lte('data', dataFim);
  }

  const { data, error } = await query;

  if (error) {
    console.error('[recorrencia] Erro ao buscar instâncias:', error);
    throw error;
  }

  return data || [];
}

/**
 * Formata configuração de recorrência para exibição
 */
export function formatarRecorrencia(config: RecorrenciaConfig | null): string {
  if (!config || config.tipo === 'unica') {
    return '';
  }

  switch (config.tipo) {
    case 'diaria':
      return 'Todo dia';

    case 'semanal':
      if (!config.dias_semana || config.dias_semana.length === 0) {
        return 'Semanal';
      }
      if (config.dias_semana.length === 1) {
        const dia = DIAS_SEMANA.find(d => d.value === config.dias_semana![0]);
        return `Toda ${dia?.label || 'semana'}`;
      }
      if (config.dias_semana.length === 7) {
        return 'Todo dia';
      }
      return `${config.dias_semana.length}x por semana`;

    case 'mensal':
      return `Dia ${config.dia_mes} de cada mês`;

    case 'anual':
      const mes = config.mes_ano !== undefined ? config.mes_ano + 1 : 1;
      const dia = config.dia_ano || 1;
      return `Todo ano em ${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}`;

    case 'intervalo_dias':
      return `A cada ${config.intervalo_dias} dias`;

    default:
      return 'Recorrente';
  }
}

/**
 * Valida configuração de recorrência
 */
export function validarConfiguracao(config: RecorrenciaConfig): { valido: boolean; erro?: string } {
  if (!config.tipo) {
    return { valido: false, erro: 'Tipo de recorrência é obrigatório' };
  }

  switch (config.tipo) {
    case 'semanal':
      if (!config.dias_semana || config.dias_semana.length === 0) {
        return { valido: false, erro: 'Selecione pelo menos um dia da semana' };
      }
      if (config.dias_semana.some(d => d < 0 || d > 6)) {
        return { valido: false, erro: 'Dias da semana devem estar entre 0 (Seg) e 6 (Dom)' };
      }
      break;

    case 'mensal':
      if (config.dia_mes === undefined || config.dia_mes === null || config.dia_mes < 1 || config.dia_mes > 31) {
        return { valido: false, erro: 'Dia do mês deve estar entre 1 e 31' };
      }
      break;

    case 'anual':
      if (config.mes_ano === undefined || config.mes_ano < 0 || config.mes_ano > 11) {
        return { valido: false, erro: 'Mês deve estar entre 0 (Jan) e 11 (Dez)' };
      }
      if (!config.dia_ano || config.dia_ano < 1 || config.dia_ano > 31) {
        return { valido: false, erro: 'Dia deve estar entre 1 e 31' };
      }
      break;

    case 'intervalo_dias':
      if (!config.intervalo_dias || config.intervalo_dias < 1 || config.intervalo_dias > 365) {
        return { valido: false, erro: 'Intervalo deve ser entre 1 e 365 dias' };
      }
      break;
  }

  // Validar data fim
  if (config.data_fim && config.data_inicio) {
    const inicio = new Date(config.data_inicio);
    const fim = new Date(config.data_fim);
    if (fim <= inicio) {
      return { valido: false, erro: 'Data de término deve ser posterior à data de início' };
    }
  }

  return { valido: true };
}

// ============================================
// EXPORT DO SERVICE
// ============================================

export const recorrenciaService = {
  // Cálculo de datas
  calcularDatas,
  calcularDatasDiaria,
  calcularDatasSemanal,
  calcularDatasMensal,
  calcularDatasAnual,
  calcularDatasIntervalo,

  // Geração de instâncias
  gerarInstancias,
  verificarEGerarNovasInstancias,

  // Edição
  editarApenasEsta,
  editarTodasFuturas,
  editarTodas,

  // Exclusão
  excluirApenasEsta,
  excluirTodasFuturas,
  excluirTodas,

  // Utilidades
  getTemplatesAtivos,
  getInstancias,
  formatarRecorrencia,
  validarConfiguracao,
};

export default recorrenciaService;
