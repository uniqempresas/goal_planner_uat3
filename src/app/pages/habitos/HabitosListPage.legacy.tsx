import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { habitosService } from '../../../services/habitosService';
import type { Database } from '../../../lib/supabase';

type Habito = Database['public']['Tables']['habitos']['Row'];

/**
 * VERSÃO ANTIGA - BACKUP
 * Esta é a versão original da página de hábitos antes da modernização.
 * Mantida para referência e rollback se necessário.
 * 
 * Para usar a versão moderna, utilize HabitosListPage.tsx atualizado
 */

export default function HabitosListPageLegacy() {
  const { user } = useApp();
  const navigate = useNavigate();
  const [habitos, setHabitos] = useState<Habito[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'todos' | 'ativos' | 'pausados' | 'concluidos'>('todos');

  useEffect(() => {
    if (user) {
      loadHabitos();
    }
  }, [user, filter]);

  async function loadHabitos() {
    if (!user) return;
    
    try {
      setLoading(true);
      let habitosData: Habito[];
      
      switch (filter) {
        case 'ativos':
          habitosData = await habitosService.getAtivos(user.id);
          break;
        default:
          habitosData = await habitosService.getAll(user.id);
      }
      
      setHabitos(habitosData);
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir este hábito?')) return;
    
    try {
      await habitosService.delete(id);
      loadHabitos();
    } catch (error) {
      console.error('Erro ao excluir hábito:', error);
    }
  }

  async function handleTogglePausar(habito: Habito) {
    try {
      if (habito.status === 'ativa') {
        await habitosService.pausar(habito.id);
      } else {
        await habitosService.continuar(habito.id);
      }
      loadHabitos();
    } catch (error) {
      console.error('Erro ao pausar/continuar hábito:', error);
    }
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
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badge.class}`}>
        {badge.label}
      </span>
    );
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  }

  function getDiasSemanaLabel(dias: number[]) {
    const diasLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    return dias.map(d => diasLabels[d]).join(', ');
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hábitos</h1>
          <p className="text-gray-600">Gerencie seus hábitos diários</p>
        </div>
        <Link
          to="/habitos/criar"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          + Novo Hábito
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 mb-6">
        {(['todos', 'ativos', 'pausados', 'concluidos'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {f === 'todos' ? 'Todos' : f === 'ativos' ? 'Ativos' : f === 'pausados' ? 'Pausados' : 'Concluídos'}
          </button>
        ))}
      </div>

      {/* Lista de Hábitos */}
      {habitos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 mb-4">Nenhum hábito encontrado</p>
          <Link
            to="/habitos/criar"
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            Criar primeiro hábito
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {habitos.map((habito) => (
            <div
              key={habito.id}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{habito.titulo}</h3>
                    {getStatusBadge(habito.status)}
                  </div>
                  
                  {habito.descricao && (
                    <p className="text-gray-600 text-sm mb-2">{habito.descricao}</p>
                  )}
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>
                      <strong>Período:</strong> {formatDate(habito.data_inicio)} - {formatDate(habito.data_fim)}
                    </span>
                    <span>
                      <strong>Dias:</strong> {getDiasSemanaLabel(habito.dias_semana)}
                    </span>
                    {habito.hora && (
                      <span>
                        <strong>Horário:</strong> {habito.hora}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-4 mt-3">
                    <div className="bg-indigo-50 px-3 py-1 rounded">
                      <span className="text-indigo-700 font-semibold">{habito.streak_atual}</span>
                      <span className="text-indigo-600 text-sm"> dias atuais</span>
                    </div>
                    <div className="bg-amber-50 px-3 py-1 rounded">
                      <span className="text-amber-700 font-semibold">{habito.melhor_streak}</span>
                      <span className="text-amber-600 text-sm"> melhor streak</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleTogglePausar(habito)}
                    className="text-gray-600 hover:text-gray-900 px-3 py-1 text-sm"
                  >
                    {habito.status === 'ativa' ? 'Pausar' : 'Continuar'}
                  </button>
                  <Link
                    to={`/habitos/${habito.id}`}
                    className="text-indigo-600 hover:text-indigo-700 px-3 py-1 text-sm"
                  >
                    Ver
                  </Link>
                  <Link
                    to={`/habitos/${habito.id}/editar`}
                    className="text-gray-600 hover:text-gray-900 px-3 py-1 text-sm"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(habito.id)}
                    className="text-red-600 hover:text-red-700 px-3 py-1 text-sm"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
