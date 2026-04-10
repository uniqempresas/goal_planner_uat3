import { describe, it, expect } from 'vitest';
import {
  calcularDatasDiaria,
  calcularDatasSemanal,
  calcularDatasMensal,
  calcularDatasAnual,
  calcularDatasIntervalo,
  validarConfiguracao,
  formatarRecorrencia,
} from '../recorrenciaService';
import type { RecorrenciaConfig } from '../../lib/supabase';

describe('recorrenciaService', () => {
  describe('calcularDatasDiaria', () => {
    it('deve calcular datas diárias corretamente', () => {
      const datas = calcularDatasDiaria('2026-04-10', '2026-04-15');
      expect(datas).toEqual(['2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13', '2026-04-14', '2026-04-15']);
    });

    it('deve respeitar data de início', () => {
      const datas = calcularDatasDiaria('2026-04-15', '2026-04-20');
      expect(datas[0]).toBe('2026-04-15');
      expect(datas).toHaveLength(6);
    });

    it('deve respeitar data de fim', () => {
      const datas = calcularDatasDiaria('2026-04-10', '2026-04-12');
      expect(datas).toHaveLength(3);
      expect(datas[datas.length - 1]).toBe('2026-04-12');
    });

    it('deve respeitar maxOcorrencias', () => {
      const datas = calcularDatasDiaria('2026-04-10', undefined, 5);
      expect(datas).toHaveLength(5);
    });
  });

  describe('calcularDatasSemanal', () => {
    it('deve calcular datas semanais corretamente (uma vez por semana)', () => {
      // Sexta-feira (4) por 3 semanas
      const datas = calcularDatasSemanal('2026-04-10', [4], '2026-04-30');
      expect(datas).toEqual(['2026-04-10', '2026-04-17', '2026-04-24']);
    });

    it('deve calcular múltiplos dias da semana', () => {
      // Segunda (0), Quarta (2), Sexta (4)
      const datas = calcularDatasSemanal('2026-04-06', [0, 2, 4], '2026-04-17');
      expect(datas).toEqual([
        '2026-04-06', // Seg
        '2026-04-08', // Qua
        '2026-04-10', // Sex
        '2026-04-13', // Seg
        '2026-04-15', // Qua
        '2026-04-17', // Sex
      ]);
    });

    it('deve retornar array vazio quando não há dias selecionados', () => {
      const datas = calcularDatasSemanal('2026-04-10', [], '2026-04-30');
      expect(datas).toEqual([]);
    });

    it('deve respeitar data de fim', () => {
      const datas = calcularDatasSemanal('2026-04-10', [4], '2026-04-15');
      expect(datas).toHaveLength(1);
    });
  });

  describe('calcularDatasIntervalo', () => {
    it('deve calcular intervalo de 3 dias corretamente', () => {
      const datas = calcularDatasIntervalo('2026-04-10', 3, '2026-04-20');
      expect(datas).toEqual(['2026-04-10', '2026-04-13', '2026-04-16', '2026-04-19']);
    });

    it('deve calcular intervalo diário (1 dia)', () => {
      const datas = calcularDatasIntervalo('2026-04-10', 1, '2026-04-15');
      expect(datas).toEqual(['2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13', '2026-04-14', '2026-04-15']);
    });

    it('deve retornar array vazio para intervalo inválido', () => {
      const datas = calcularDatasIntervalo('2026-04-10', 0, '2026-04-20');
      expect(datas).toEqual([]);
    });
  });

  describe('calcularDatasMensal', () => {
    it('deve calcular datas mensais corretamente', () => {
      const datas = calcularDatasMensal('2026-04-10', 15, '2026-07-20');
      expect(datas).toEqual(['2026-04-15', '2026-05-15', '2026-06-15', '2026-07-15']);
    });

    it('deve ajustar para último dia do mês se necessário', () => {
      // Fevereiro 2026 tem 28 dias
      const datas = calcularDatasMensal('2026-01-01', 31, '2026-04-01');
      expect(datas).toContain('2026-01-31');
      expect(datas).toContain('2026-02-28'); // Ajustado
      expect(datas).toContain('2026-03-31');
    });

    it('deve começar no mês seguinte se data de início for após o dia', () => {
      const datas = calcularDatasMensal('2026-04-20', 15, '2026-06-20');
      expect(datas[0]).toBe('2026-05-15'); // Primeira ocorrência em maio
    });
  });

  describe('calcularDatasAnual', () => {
    it('deve calcular datas anuais corretamente', () => {
      const datas = calcularDatasAnual('2026-01-01', 4, 15, '2028-12-31'); // 15 de maio (mês 4)
      expect(datas).toEqual(['2026-05-15', '2027-05-15', '2028-05-15']);
    });

    it('deve começar no ano seguinte se data de início for após a data', () => {
      const datas = calcularDatasAnual('2026-06-01', 4, 15, '2028-12-31'); // 15 de maio
      expect(datas[0]).toBe('2027-05-15'); // Primeira ocorrência em 2027
    });
  });

  describe('validarConfiguracao', () => {
    it('deve validar recorrência semanal com sucesso', () => {
      const config: RecorrenciaConfig = {
        tipo: 'semanal',
        dias_semana: [0, 2, 4],
      };
      const result = validarConfiguracao(config);
      expect(result.valido).toBe(true);
    });

    it('deve invalidar recorrência semanal sem dias', () => {
      const config: RecorrenciaConfig = {
        tipo: 'semanal',
        dias_semana: [],
      };
      const result = validarConfiguracao(config);
      expect(result.valido).toBe(false);
      expect(result.erro).toContain('pelo menos um dia');
    });

    it('deve validar recorrência mensal com sucesso', () => {
      const config: RecorrenciaConfig = {
        tipo: 'mensal',
        dia_mes: 15,
      };
      const result = validarConfiguracao(config);
      expect(result.valido).toBe(true);
    });

    it('deve invalidar recorrência mensal com dia inválido', () => {
      const config: RecorrenciaConfig = {
        tipo: 'mensal',
        dia_mes: 32,
      };
      const result = validarConfiguracao(config);
      expect(result.valido).toBe(false);
    });

    it('deve validar recorrência anual com sucesso', () => {
      const config: RecorrenciaConfig = {
        tipo: 'anual',
        mes_ano: 4,
        dia_ano: 15,
      };
      const result = validarConfiguracao(config);
      expect(result.valido).toBe(true);
    });

    it('deve validar recorrência de intervalo com sucesso', () => {
      const config: RecorrenciaConfig = {
        tipo: 'intervalo_dias',
        intervalo_dias: 3,
      };
      const result = validarConfiguracao(config);
      expect(result.valido).toBe(true);
    });

    it('deve invalidar intervalo muito grande', () => {
      const config: RecorrenciaConfig = {
        tipo: 'intervalo_dias',
        intervalo_dias: 400,
      };
      const result = validarConfiguracao(config);
      expect(result.valido).toBe(false);
    });

    it('deve invalidar data fim anterior a data início', () => {
      const config: RecorrenciaConfig = {
        tipo: 'diaria',
        data_inicio: '2026-04-15',
        data_fim: '2026-04-10',
      };
      const result = validarConfiguracao(config);
      expect(result.valido).toBe(false);
    });
  });

  describe('formatarRecorrencia', () => {
    it('deve retornar string vazia para recorrência nula', () => {
      expect(formatarRecorrencia(null)).toBe('');
    });

    it('deve retornar string vazia para tipo única', () => {
      const config: RecorrenciaConfig = { tipo: 'unica' };
      expect(formatarRecorrencia(config)).toBe('');
    });

    it('deve formatar recorrência diária', () => {
      const config: RecorrenciaConfig = { tipo: 'diaria' };
      expect(formatarRecorrencia(config)).toBe('Todo dia');
    });

    it('deve formatar recorrência semanal com um dia', () => {
      const config: RecorrenciaConfig = {
        tipo: 'semanal',
        dias_semana: [4], // Sexta
      };
      expect(formatarRecorrencia(config)).toBe('Toda Sexta');
    });

    it('deve formatar recorrência semanal com múltiplos dias', () => {
      const config: RecorrenciaConfig = {
        tipo: 'semanal',
        dias_semana: [0, 2, 4], // Seg, Qua, Sex
      };
      expect(formatarRecorrencia(config)).toBe('3x por semana');
    });

    it('deve formatar recorrência mensal', () => {
      const config: RecorrenciaConfig = {
        tipo: 'mensal',
        dia_mes: 15,
      };
      expect(formatarRecorrencia(config)).toBe('Dia 15 de cada mês');
    });

    it('deve formatar recorrência anual', () => {
      const config: RecorrenciaConfig = {
        tipo: 'anual',
        mes_ano: 4, // Maio
        dia_ano: 15,
      };
      expect(formatarRecorrencia(config)).toBe('Todo ano em 15/05');
    });

    it('deve formatar recorrência de intervalo', () => {
      const config: RecorrenciaConfig = {
        tipo: 'intervalo_dias',
        intervalo_dias: 3,
      };
      expect(formatarRecorrencia(config)).toBe('A cada 3 dias');
    });
  });
});
