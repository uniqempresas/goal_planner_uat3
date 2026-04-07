import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router';
import { useApp } from '../contexts/AppContext';
import { habitosService } from '../../../services/habitosService';
import type { Database } from '../../../lib/supabase';

type Habito = Database['public']['Tables']['habitos']['Row'];

export default function HabitoDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useApp();
  const navigate = useNavigate();
  const [habito, setHabito] = useState<Habito | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadHabito();
    }
  }, [id]);

  async function loadHabito() {
    if (!id) return;
    
    try {
      setLoading(true);
      const habitoData = await habitosService.getById(id);
      setHabito(habitoData);
    } catch (error) {
      console.error('Erro ao carregar hábito:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleToggleStreak() {
    if (!habito) return;
    
    try {
      const updated = await habitosService.toggleStreak(habito.id);
      setHabito(updated);
    } catch (error) {
      console.error('Erro ao atualizar streak:', error);
    }
  }

  async function handlePausar() {
    if (!habito) return;
    
    try {
      const updated = await habitosService.pausar(habito.id);
      setHabito(updated);
    } catch (error) {
      console.error('Erro ao pausar hábito:', error);
    }
  }

  async function handleContinuar() {
    if (!habito) return;
    
    try {
      const updated = await habitosService.continuar(habito.id);
      setHabito(updated);
    } catch (error) {
      console.error('Erro ao continuar hábito:', error);
    }
  }

  async function handleDelete() {
    if (!habito || !confirm('Tem certeza que deseja excluir este hábito?')) return;
    
    try {
      await habitosService.delete(habito.id);
      navigate('/habitos');
    } catch (error) {
      console.error('Erro ao excluir hábito:', error);
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }

  function getDiasSemanaLabel(dias: number[]) {
    const diasLabels = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'];
    return dias.map(d => diasLabels[d]).join(', ');
  }

  function getStatusBadge(status: string) {
    const badges: Record<string, { label: string; class: string }> = {
      ativa: { label: 'Ativo', class: 'bg-green-100 text-green-800' },
      pausada: { label: 'Pausado', class: 'bg-yellow-100 text-yellow-800' },
      concluida: { label: 'Concluído', class: 'bg-blue-100 text-blue-800' },
      expirada: { label: 'Expirado', class: 'bg-gray-100 text-gray-800' },
    };
    
    const badge = badges[status] || badges.ativa;
    
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${badge.class}`}>
        {badge.label}
      </span>
    );
  }

  function getBlocoLabel(bloco: string | null) {
    const labels: Record<string, string> = {
      'one-thing': 'One Thing',
      'manha': 'Manhã',
      'tarde': 'Tarde',
      'noite': 'Noite',
    };
    return bloco ? labels[bloco] : '-';
  }

  function getPrioridadeLabel(prioridade: string) {
    const labels: Record<string, string> = {
      'alta': 'Alta',
      'media': 'Média',
      'baixa': 'Baixa',
    };
    return labels[prioridade] || prioridade;
  }

  if (loading) {
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
          <Link to="/habitos" className="text-indigo-600 hover:text-indigo-700">
            Voltar para hábitos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <Link to="/habitos" className="text-indigo-600 hover:text-indigo-700 text-sm">
          ← Voltar para hábitos
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{habito.titulo}</h1>
            {getStatusBadge(habito.status)}
          </div>
          <div className="flex gap-2">
            <Link
              to={`/habitos/${habito.id}/editar`}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Editar
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-red-600 hover:text-red-700"
            >
              Excluir
            </button>
          </div>
        </div>

        {habito.descricao && (
          <p className="text-gray-600 mb-6">{habito.descricao}</p>
        )}

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-indigo-600">{habito.streak_atual}</div>
            <div className="text-sm text-indigo-600">Dias atuais</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="text-3xl font-bold text-amber-600">{habito.melhor_streak}</div>
            <div className="text-sm text-amber-600">Melhor streak</div>
          </div>
        </div>

        {/* Detalhes */}
        <div className="space-y-4">
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-500">Período</span>
            <span className="text-gray-900">
              {formatDate(habito.data_inicio)} - {formatDate(habito.data_fim)}
            </span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-500">Dias da semana</span>
            <span className="text-gray-900">{getDiasSemanaLabel(habito.dias_semana)}</span>
          </div>
          {habito.hora && (
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Horário</span>
              <span className="text-gray-900">{habito.hora}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-500">Bloco</span>
            <span className="text-gray-900">{getBlocoLabel(habito.bloco)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-100 pb-2">
            <span className="text-gray-500">Prioridade</span>
            <span className="text-gray-900">{getPrioridadeLabel(habito.prioridade)}</span>
          </div>
          {habito.ultima_conclusao && (
            <div className="flex justify-between border-b border-gray-100 pb-2">
              <span className="text-gray-500">Última conclusão</span>
              <span className="text-gray-900">{formatDate(habito.ultima_conclusao)}</span>
            </div>
          )}
        </div>

        {/* Ações */}
        <div className="flex gap-4 mt-6">
          {habito.status === 'ativa' && (
            <>
              <button
                onClick={handleToggleStreak}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                ✓ Marcar como feito hoje
              </button>
              <button
                onClick={handlePausar}
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50"
              >
                Pausar
              </button>
            </>
          )}
          {habito.status === 'pausada' && (
            <button
              onClick={handleContinuar}
              className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
            >
              Continuar Hábito
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
