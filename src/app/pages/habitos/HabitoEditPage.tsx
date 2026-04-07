import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { habitosService } from '../../../services/habitosService';
import type { Database } from '../../../lib/supabase';

type Habito = Database['public']['Tables']['habitos']['Row'];

export default function HabitoEditPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [habito, setHabito] = useState<Habito | null>(null);

  // Form state
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');
  const [hora, setHora] = useState('');
  const [bloco, setBloco] = useState<'one-thing' | 'manha' | 'tarde' | 'noite' | null>(null);
  const [prioridade, setPrioridade] = useState<'alta' | 'media' | 'baixa'>('media');
  const [diasSemana, setDiasSemana] = useState<number[]>([]);
  const [metaId, setMetaId] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadHabito();
    }
  }, [id]);

  async function loadHabito() {
    if (!id) return;
    
    try {
      setInitialLoading(true);
      const habitoData = await habitosService.getById(id);
      if (habitoData) {
        setHabito(habitoData);
        setTitulo(habitoData.titulo);
        setDescricao(habitoData.descricao || '');
        setDataInicio(habitoData.data_inicio);
        setDataFim(habitoData.data_fim);
        setHora(habitoData.hora || '');
        setBloco(habitoData.bloco);
        setPrioridade(habitoData.prioridade);
        setDiasSemana(habitoData.dias_semana);
        setMetaId(habitoData.meta_id);
      }
    } catch (error) {
      console.error('Erro ao carregar hábito:', error);
    } finally {
      setInitialLoading(false);
    }
  }

  const diasOptions = [
    { value: 0, label: 'Segunda' },
    { value: 1, label: 'Terça' },
    { value: 2, label: 'Quarta' },
    { value: 3, label: 'Quinta' },
    { value: 4, label: 'Sexta' },
    { value: 5, label: 'Sábado' },
    { value: 6, label: 'Domingo' },
  ];

  const toggleDia = (dia: number) => {
    setDiasSemana(prev => 
      prev.includes(dia) 
        ? prev.filter(d => d !== dia)
        : [...prev, dia]
    );
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Validações
    if (!titulo.trim()) {
      setError('Título é obrigatório');
      return;
    }
    if (!dataInicio || !dataFim) {
      setError('Período é obrigatório');
      return;
    }
    if (diasSemana.length === 0) {
      setError('Selecione pelo menos um dia');
      return;
    }

    if (!id) {
      setError('ID do hábito não encontrado');
      return;
    }

    try {
      setLoading(true);
      
      await habitosService.update(id, {
        titulo,
        descricao: descricao || null,
        data_inicio: dataInicio,
        data_fim: dataFim,
        dias_semana: diasSemana,
        hora: hora || null,
        bloco,
        meta_id: metaId,
        prioridade,
      });

      navigate(`/habitos/${id}`);
    } catch (err: any) {
      console.error('Erro ao atualizar hábito:', err);
      setError(err.message || 'Erro ao atualizar hábito');
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!habito) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">Hábito não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Editar Hábito</h1>
        <p className="text-gray-600">Atualize os dados do seu hábito</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título do Hábito *
          </label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Ex: Meditar 10 minutos"
            maxLength={200}
          />
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição
          </label>
          <textarea
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
            placeholder="Detalhes adicionais sobre o hábito..."
          />
        </div>

        {/* Período */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início *
            </label>
            <input
              type="date"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim *
            </label>
            <input
              type="date"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Dias da Semana */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dias da Semana *
          </label>
          <div className="flex flex-wrap gap-2">
            {diasOptions.map((dia) => (
              <button
                key={dia.value}
                type="button"
                onClick={() => toggleDia(dia.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  diasSemana.includes(dia.value)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {dia.label}
              </button>
            ))}
          </div>
        </div>

        {/* Horário */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Horário (opcional)
          </label>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Bloco */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bloco do Dia
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: null, label: 'Nenhum' },
              { value: 'one-thing', label: 'One Thing' },
              { value: 'manha', label: 'Manhã' },
              { value: 'tarde', label: 'Tarde' },
              { value: 'noite', label: 'Noite' },
            ].map((option) => (
              <button
                key={option.value || 'none'}
                type="button"
                onClick={() => setBloco(option.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  bloco === option.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prioridade */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioridade
          </label>
          <div className="flex gap-2">
            {[
              { value: 'alta', label: 'Alta', color: 'red' },
              { value: 'media', label: 'Média', color: 'yellow' },
              { value: 'baixa', label: 'Baixa', color: 'green' },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setPrioridade(option.value as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  prioridade === option.value
                    ? `bg-${option.color}-600 text-white`
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Botões */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Salvando...' : 'Salvar Alterações'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/habitos/${id}`)}
            className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
