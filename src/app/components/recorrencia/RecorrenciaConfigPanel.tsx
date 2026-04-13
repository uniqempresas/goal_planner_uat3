import { useState, useEffect } from 'react';
import { RecorrenciaConfig, TipoRecorrencia, TIPOS_RECORRENCIA, DIAS_SEMANA } from '../../../lib/supabase';
import { validarConfiguracao } from '../../../services/recorrenciaService';
import { DiasSemanaSelector } from './DiasSemanaSelector';
import { cn } from '../../components/ui/utils';
import { Calendar, Clock, Repeat, AlertCircle } from 'lucide-react';

interface RecorrenciaConfigPanelProps {
  config: Partial<RecorrenciaConfig>;
  dataInicio: string;
  onChange: (config: RecorrenciaConfig | null) => void;
  disabled?: boolean;
}

/**
 * Painel completo de configuração de recorrência
 * Renderiza controles específicos baseado no tipo selecionado
 */
export function RecorrenciaConfigPanel({
  config,
  dataInicio,
  onChange,
  disabled,
}: RecorrenciaConfigPanelProps) {
  const [erro, setErro] = useState<string | null>(null);

  // Atualizar config quando tipo muda
  const handleTipoChange = (tipo: TipoRecorrencia) => {
    if (tipo === 'unica') {
      onChange(null);
      setErro(null);
      return;
    }

    const novaConfig: RecorrenciaConfig = {
      tipo,
      data_inicio: dataInicio,
    };

    // Valores padrão por tipo
    switch (tipo) {
      case 'semanal':
        novaConfig.dias_semana = [];
        break;
      case 'mensal':
        // Garantir que o dia seja um número válido entre 1-31
        const diaDoMes = parseInt(dataInicio.split('-')[2]);
        novaConfig.dia_mes = (diaDoMes >= 1 && diaDoMes <= 31) ? diaDoMes : 1;
        break;
      case 'anual':
        novaConfig.mes_ano = parseInt(dataInicio.split('-')[1]) - 1 || 0;
        const diaAno = parseInt(dataInicio.split('-')[2]);
        novaConfig.dia_ano = (diaAno >= 1 && diaAno <= 31) ? diaAno : 1;
        break;
      case 'intervalo_dias':
        novaConfig.intervalo_dias = 2;
        break;
    }

    onChange(novaConfig);
    setErro(null);
  };

  // Validar quando config muda
  useEffect(() => {
    if (config && config.tipo && config.tipo !== 'unica') {
      const validacao = validarConfiguracao(config as RecorrenciaConfig);
      setErro(validacao.valido ? null : validacao.erro || null);
    } else {
      setErro(null);
    }
  }, [config]);

  const tipoAtual = config?.tipo || 'unica';

  return (
    <div className="space-y-4">
      {/* Seleção do tipo de recorrência */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          <Repeat className="inline w-4 h-4 mr-1" />
          Frequência
        </label>
        <select
          value={tipoAtual}
          onChange={(e) => handleTipoChange(e.target.value as TipoRecorrencia)}
          disabled={disabled}
          className={cn(
            "w-full px-3 py-2 border rounded-lg text-sm",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
            "border-slate-200 bg-white text-slate-700",
            disabled && "opacity-50 cursor-not-allowed bg-slate-50"
          )}
        >
          {TIPOS_RECORRENCIA.map((tipo) => (
            <option key={tipo.value} value={tipo.value}>
              {tipo.label}
            </option>
          ))}
        </select>
      </div>

      {/* Configurações específicas por tipo */}
      {tipoAtual === 'semanal' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Dias da semana
          </label>
          <DiasSemanaSelector
            selected={config?.dias_semana || []}
            onChange={(dias) =>
              onChange({ ...(config as RecorrenciaConfig), dias_semana: dias })
            }
            disabled={disabled}
          />
          {config?.dias_semana?.length === 0 && (
            <p className="text-xs text-slate-400">Selecione pelo menos um dia</p>
          )}
        </div>
      )}

      {tipoAtual === 'mensal' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            <Calendar className="inline w-4 h-4 mr-1" />
            Dia do mês
          </label>
          <input
            type="number"
            min={1}
            max={31}
            value={config?.dia_mes || 1}
            onChange={(e) =>
              onChange({
                ...(config as RecorrenciaConfig),
                dia_mes: parseInt(e.target.value) || 1,
              })
            }
            disabled={disabled}
            className={cn(
              "w-full px-3 py-2 border rounded-lg text-sm",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
              "border-slate-200 bg-white",
              disabled && "opacity-50 cursor-not-allowed bg-slate-50"
            )}
          />
          <p className="text-xs text-slate-400">
            Será ajustado automaticamente para o último dia do mês se necessário
          </p>
        </div>
      )}

      {tipoAtual === 'anual' && (
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Mês</label>
            <select
              value={config?.mes_ano || 0}
              onChange={(e) =>
                onChange({
                  ...(config as RecorrenciaConfig),
                  mes_ano: parseInt(e.target.value),
                })
              }
              disabled={disabled}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-sm",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                "border-slate-200 bg-white",
                disabled && "opacity-50 cursor-not-allowed bg-slate-50"
              )}
            >
              {[
                'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
              ].map((mes, index) => (
                <option key={index} value={index}>
                  {mes}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Dia</label>
            <input
              type="number"
              min={1}
              max={31}
              value={config?.dia_ano || 1}
              onChange={(e) =>
                onChange({
                  ...(config as RecorrenciaConfig),
                  dia_ano: parseInt(e.target.value) || 1,
                })
              }
              disabled={disabled}
              className={cn(
                "w-full px-3 py-2 border rounded-lg text-sm",
                "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
                "border-slate-200 bg-white",
                disabled && "opacity-50 cursor-not-allowed bg-slate-50"
              )}
            />
          </div>
        </div>
      )}

      {tipoAtual === 'intervalo_dias' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            <Clock className="inline w-4 h-4 mr-1" />
            Repetir a cada quantos dias?
          </label>
          <input
            type="number"
            min={1}
            max={365}
            value={config?.intervalo_dias || 2}
            onChange={(e) =>
              onChange({
                ...(config as RecorrenciaConfig),
                intervalo_dias: parseInt(e.target.value) || 1,
              })
            }
            disabled={disabled}
            className={cn(
              "w-full px-3 py-2 border rounded-lg text-sm",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
              "border-slate-200 bg-white",
              disabled && "opacity-50 cursor-not-allowed bg-slate-50"
            )}
          />
        </div>
      )}

      {/* Data fim (opcional para todos os tipos exceto única) */}
      {tipoAtual !== 'unica' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">
            Repetir até (opcional)
          </label>
          <input
            type="date"
            value={config?.data_fim || ''}
            onChange={(e) =>
              onChange({
                ...(config as RecorrenciaConfig),
                data_fim: e.target.value || undefined,
              })
            }
            disabled={disabled}
            min={dataInicio}
            className={cn(
              "w-full px-3 py-2 border rounded-lg text-sm",
              "focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500",
              "border-slate-200 bg-white",
              disabled && "opacity-50 cursor-not-allowed bg-slate-50"
            )}
          />
          <p className="text-xs text-slate-400">
            Deixe em branco para repetir indefinidamente
          </p>
        </div>
      )}

      {/* Mensagem de erro */}
      {erro && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{erro}</span>
        </div>
      )}

      {/* Preview */}
      {tipoAtual !== 'unica' && !erro && config && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-sm text-indigo-700">
          <p className="font-medium">Resumo:</p>
          <p>{getResumoRecorrencia(config, dataInicio)}</p>
        </div>
      )}
    </div>
  );
}

/**
 * Gera um texto descritivo da recorrência configurada
 */
function getResumoRecorrencia(config: Partial<RecorrenciaConfig>, dataInicio: string): string {
  const dataFormatada = new Date(dataInicio).toLocaleDateString('pt-BR');
  let texto = `A partir de ${dataFormatada}`;

  switch (config.tipo) {
    case 'diaria':
      texto += ', toda' + (config.data_fim ? ' até ' + new Date(config.data_fim).toLocaleDateString('pt-BR') : '');
      break;
    case 'semanal':
      if (config.dias_semana && config.dias_semana.length > 0) {
        const dias = config.dias_semana
          .map((d) => DIAS_SEMANA.find((ds) => ds.value === d)?.label)
          .filter(Boolean)
          .join(', ');
        texto += `, toda ${dias}`;
      }
      break;
    case 'mensal':
      texto += `, todo dia ${config.dia_mes}`;
      break;
    case 'anual':
      const mes = config.mes_ano !== undefined
        ? ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'][config.mes_ano]
        : '';
      texto += `, todo dia ${config.dia_ano}/${mes}`;
      break;
    case 'intervalo_dias':
      texto += `, a cada ${config.intervalo_dias} dias`;
      break;
  }

  if (config.data_fim) {
    texto += ` até ${new Date(config.data_fim).toLocaleDateString('pt-BR')}`;
  }

  return texto;
}

export default RecorrenciaConfigPanel;
