import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import { useApp } from '../../contexts/AppContext';
import { tarefasService } from '../../../services/tarefasService';
import { recorrenciaService } from '../../../services/recorrenciaService';
import type { Database } from '../../../lib/supabase';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Target, CheckCircle2, Circle, AlertTriangle, Repeat } from 'lucide-react';

type Tarefa = Database['public']['Tables']['tarefas']['Row'];

export default function TarefaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useApp();
  const [tarefa, setTarefa] = useState<Tarefa | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteMode, setDeleteMode] = useState<'single' | 'series'>('single');

  useEffect(() => {
    if (!id || !user) return;
    
    tarefasService.getById(id).then(setTarefa).catch(console.error)
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleDelete = async () => {
    if (!id || !tarefa) return;
    
    try {
      if (deleteMode === 'series' && (tarefa.parent_id || tarefa.is_template)) {
        // Excluir toda a série
        const parentId = tarefa.parent_id || tarefa.id;
        await recorrenciaService.excluirTodas(parentId);
      } else {
        // Excluir apenas esta tarefa
        await tarefasService.delete(id);
      }
      navigate('/agenda/hoje');
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error);
      alert('Erro ao excluir tarefa. Tente novamente.');
    }
  };

  const isRecorrente = tarefa && (tarefa.parent_id !== null || tarefa.is_template === true);
  const isInstancia = tarefa && tarefa.parent_id !== null;

  if (loading) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/4"></div>
          <div className="h-8 bg-slate-200 rounded w-3/4"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!tarefa) {
    return (
      <div className="p-6 max-w-2xl mx-auto text-center">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-slate-800 mb-2">Tarefa não encontrada</h2>
        <p className="text-slate-500 mb-6">Esta tarefa pode ter sido excluída.</p>
        <Link to="/agenda/hoje" className="text-indigo-600 hover:text-indigo-700">
          Voltar para Agenda de Hoje
        </Link>
      </div>
    );
  }

  const priorityColors = {
    alta: 'text-red-600 bg-red-50',
    media: 'text-amber-600 bg-amber-50',
    baixa: 'text-slate-600 bg-slate-50',
  };

  const priorityLabels = {
    alta: 'Alta Prioridade',
    media: 'Média Prioridade',
    baixa: 'Baixa Prioridade',
  };

  const blockLabels = {
    'one-thing': 'ONE Thing',
    'manha': 'Manhã',
    'tarde': 'Tarde',
    'noite': 'Noite',
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <Link 
          to="/agenda/hoje" 
          className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 mb-4"
        >
          <ArrowLeft size={16} />
          Voltar para Agenda de Hoje
        </Link>
      </div>

      {/* Card Principal */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {/* Status Header */}
        <div className={`px-6 py-4 border-b ${tarefa.completed ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tarefa.completed ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              ) : (
                <Circle className="w-6 h-6 text-slate-300" />
              )}
              <span className={`font-medium ${tarefa.completed ? 'text-emerald-700' : 'text-slate-700'}`}>
                {tarefa.completed ? 'Concluída' : 'Pendente'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={`/agenda/tarefas/${tarefa.id}/editar`}
                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              >
                <Edit size={18} />
              </Link>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 space-y-6">
          {/* Título */}
          <div>
            <h1 className={`text-2xl font-semibold ${tarefa.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
              {tarefa.titulo}
            </h1>
            {isRecorrente && (
              <div className="flex items-center gap-2 mt-2 text-indigo-600">
                <Repeat size={16} />
                <span className="text-sm font-medium">
                  {isInstancia ? 'Tarefa recorrente (instância)' : 'Tarefa recorrente'}
                </span>
              </div>
            )}
          </div>

          {/* Descrição */}
          {tarefa.descricao && (
            <div>
              <p className="text-slate-600">{tarefa.descricao}</p>
            </div>
          )}

          {/* Metadados */}
          <div className="grid grid-cols-2 gap-4">
            {/* Data */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <Calendar className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Data</p>
                <p className="text-sm font-medium text-slate-700">
                  {new Date(tarefa.data).toLocaleDateString('pt-BR', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            {/* Hora */}
            {tarefa.hora && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Clock className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">Horário</p>
                  <p className="text-sm font-medium text-slate-700">{tarefa.hora}</p>
                </div>
              </div>
            )}

            {/* Bloco */}
            {tarefa.bloco && (
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <div className="w-5 h-5 flex items-center justify-center">
                  {tarefa.bloco === 'one-thing' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                  ) : (
                    <Clock className="w-4 h-4 text-slate-400" />
                  )}
                </div>
                <div>
                  <p className="text-xs text-slate-400">Bloco</p>
                  <p className="text-sm font-medium text-slate-700">
                    {blockLabels[tarefa.bloco as keyof typeof blockLabels] || tarefa.bloco}
                  </p>
                </div>
              </div>
            )}

            {/* Prioridade */}
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
              <AlertTriangle className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs text-slate-400">Prioridade</p>
                <p className={`text-sm font-medium px-2 py-0.5 rounded-full inline-block ${priorityColors[tarefa.prioridade]}`}>
                  {priorityLabels[tarefa.prioridade]}
                </p>
              </div>
            </div>
          </div>

          {/* Meta Vinculada */}
          {tarefa.meta_id && (
            <div>
              <p className="text-xs text-slate-400 mb-2">Meta Vinculada</p>
              <Link 
                to={`/metas/${tarefa.nivel}/${tarefa.meta_id}`}
                className="flex items-center gap-3 p-3 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors"
              >
                <Target className="w-5 h-5 text-indigo-500" />
                <span className="text-sm font-medium text-indigo-700">Ver Meta</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-slate-800 mb-2">
              {isRecorrente ? 'Excluir Tarefa Recorrente' : 'Excluir Tarefa?'}
            </h3>
            
            {isRecorrente ? (
              <div className="space-y-4">
                <p className="text-slate-500">
                  Esta é uma tarefa recorrente. Como você deseja excluir?
                </p>
                
                <div className="space-y-3">
                  <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    deleteMode === 'single' ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="deleteMode"
                      value="single"
                      checked={deleteMode === 'single'}
                      onChange={() => setDeleteMode('single')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-slate-700">Apenas esta tarefa</p>
                      <p className="text-sm text-slate-500">
                        {isInstancia 
                          ? 'Exclui apenas esta instância. As outras tarefas da recorrência continuarão.'
                          : 'Exclui apenas esta tarefa.'}
                      </p>
                    </div>
                  </label>
                  
                  <label className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    deleteMode === 'series' ? 'border-red-500 bg-red-50' : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input
                      type="radio"
                      name="deleteMode"
                      value="series"
                      checked={deleteMode === 'series'}
                      onChange={() => setDeleteMode('series')}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-slate-700">Toda a série</p>
                      <p className="text-sm text-slate-500">
                        Exclui esta tarefa e todas as outras instâncias da recorrência.
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            ) : (
              <p className="text-slate-500 mb-6">
                Esta ação não pode ser desfeita. A tarefa "{tarefa.titulo}" será excluída permanentemente.
              </p>
            )}
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDeleteMode('single');
                }}
                className="flex-1 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  deleteMode === 'series' 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                {deleteMode === 'series' ? 'Excluir Série' : 'Excluir'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
