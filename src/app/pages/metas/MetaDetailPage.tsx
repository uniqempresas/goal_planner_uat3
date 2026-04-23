import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { ArrowLeft, Edit, CheckCircle, Calendar, Target, Star, Trash2, TrendingUp } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { metasService, type MetaNivel } from '../../../services/metasService';
import { tarefasService } from '../../../services/tarefasService';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import type { Database } from '../../../lib/supabase';

type Meta = Database['public']['Tables']['metas']['Row'];
type Tarefa = Database['public']['Tables']['tarefas']['Row'];

const nivelLabels: Record<MetaNivel, string> = {
  grande: 'Grandes Metas',
  anual: 'Metas Anuais',
  mensal: 'Metas Mensais',
  semanal: 'Metas Semanais',
  diaria: 'Metas Diárias',
};

export default function MetaDetailPage() {
  const navigate = useNavigate();
  const params = useParams();
  const { getAreaById, loadMetas } = useApp();
  
  const [meta, setMeta] = useState<Meta | null>(null);
  const [submetas, setSubmetas] = useState<Meta[]>([]);
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [progresso, setProgresso] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const nivel = (params.nivel as MetaNivel) || 'grande';
  const id = params.id;

  useEffect(() => {
    async function loadData() {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const [metaData, subMetaData, tarefasData] = await Promise.all([
          metasService.getById(id),
          metasService.getByParentId(id),
          tarefasService.getByMetaId(id),
        ]);
        
        if (!metaData) {
          setError('Meta não encontrada');
          return;
        }
        
        setMeta(metaData);
        setSubmetas(subMetaData);
        setTarefas(tarefasData);
        
        // Calcular progresso real
        const progressoCalculado = await metasService.calcularProgresso(id);
        setProgresso(progressoCalculado);
      } catch (err) {
        console.error('Erro ao carregar meta:', err);
        setError('Erro ao carregar meta');
      } finally {
        setLoading(false);
      }
    }
    
    loadData();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!meta) return;
    
    try {
      const updated = await metasService.toggleStatus(meta.id);
      setMeta(updated);
      
      // Recalcular progresso após mudança de status
      const novoProgresso = await metasService.calcularProgresso(meta.id);
      setProgresso(novoProgresso);
      
      await loadMetas();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  };

  const handleDelete = async () => {
    if (!meta) return;

    if (!confirm('Tem certeza que deseja excluir esta meta?\n\nIsso também excluirá todas as metas filhas vinculadas. Esta ação não pode ser desfeita.')) {
      return;
    }

    try {
      await metasService.delete(meta.id);
      await loadMetas();
      navigate(`/metas/${nivel === 'grande' ? 'grandes' : nivel}`);
    } catch (err) {
      console.error('Erro ao excluir meta:', err);
      alert('Erro ao excluir meta. Tente novamente.');
    }
  };

  const handleToggleTarefa = async (tarefaId: string) => {
    try {
      const updated = await tarefasService.toggleCompleted(tarefaId);
      setTarefas(prev => prev.map(t => t.id === tarefaId ? updated : t));

      // Recalcular progresso da meta após concluir/desmarcar tarefa
      if (meta) {
        const novoProgresso = await metasService.calcularProgresso(meta.id);
        setProgresso(novoProgresso);
      }
    } catch (err) {
      console.error('Erro ao atualizar tarefa:', err);
    }
  };

  const area = meta?.area_id ? getAreaById(meta.area_id) : null;

  if (loading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (error || !meta) {
    return (
      <div className="p-6">
        <p className="text-red-500">{error || 'Meta não encontrada'}</p>
        <Button onClick={() => navigate(`/metas/${nivel === 'grande' ? 'grandes' : nivel}`)} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to={`/metas/${nivel === 'grande' ? 'grandes' : nivel}`} className="hover:text-indigo-600">
          {nivelLabels[nivel]}
        </Link>
        <span>/</span>
        <span className="text-slate-800">Detalhes</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/metas/${nivel === 'grande' ? 'grandes' : nivel}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl text-slate-800">{meta.titulo}</h1>
            <div className="flex items-center gap-2 mt-1">
              {area && (
                <Badge variant="outline" className="text-xs">
                  {area.emoji} {area.name}
                </Badge>
              )}
              <Badge variant={meta.status === 'ativa' ? 'default' : 'secondary'}>
                {meta.status === 'ativa' ? 'Ativa' : meta.status === 'concluida' ? 'Concluída' : 'Arquivada'}
              </Badge>
              {meta.one_thing && (
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  <Star className="w-3 h-3 mr-1" /> ONE Thing
                </Badge>
              )}
              {/* Progresso Badge */}
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  progresso === 100 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : progresso >= 50 
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <TrendingUp className="w-3 h-3 mr-1" />
                {progresso}% completo
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/metas/${nivel === 'grande' ? 'grandes' : nivel}/${meta.id}/editar`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={handleDelete}>
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir
          </Button>
          <Button variant={meta.status === 'ativa' ? 'default' : 'outline'} onClick={handleToggleStatus}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {meta.status === 'ativa' ? 'Concluir' : 'Reativar'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Progresso */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Progresso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barra de progresso */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">
                  {tarefas.length === 0 
                    ? 'Sem tarefas vinculadas' 
                    : `${tarefas.filter(t => t.completed).length} de ${tarefas.length} tarefas concluídas`
                  }
                </span>
                <span className="font-bold" style={{ 
                  color: progresso === 100 ? '#10b981' : progresso >= 50 ? '#3b82f6' : '#6366f1' 
                }}>
                  {progresso}%
                </span>
              </div>
              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${progresso}%`,
                    backgroundColor: progresso === 100 ? '#10b981' : progresso >= 50 ? '#3b82f6' : '#6366f1'
                  }}
                />
              </div>
            </div>
            
            {/* Status do progresso */}
            {progresso === 100 && meta.status !== 'concluida' && (
              <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg text-sm">
                <strong>Parabéns!</strong> Todas as tarefas foram concluídas. 
                Que tal marcar esta meta como concluída?
              </div>
            )}
            {progresso === 0 && tarefas.length > 0 && (
              <div className="p-3 bg-slate-50 text-slate-600 rounded-lg text-sm">
                Comece concluindo suas tarefas para avançar no progresso desta meta.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {meta.descricao && (
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Descrição</h3>
                <p className="text-slate-800">{meta.descricao}</p>
              </div>
            )}
            
            {meta.focusing_question && (
              <div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">Focusing Question</h3>
                <p className="text-slate-800 italic">"{meta.focusing_question}"</p>
              </div>
            )}
            
            <div className="flex items-center gap-4 text-sm text-slate-500">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Criada em {new Date(meta.created_at).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submetas */}
        <Card>
          <CardHeader>
            <CardTitle>Metas Filhas</CardTitle>
          </CardHeader>
          <CardContent>
            {submetas.length > 0 ? (
              <ul className="space-y-2">
                {submetas.map((sub) => (
                  <li key={sub.id}>
                    <Link 
                      to={`/metas/${getNextNivel(meta.nivel || nivel)}/${sub.id}`}
                      className="flex items-center gap-2 p-2 rounded hover:bg-slate-50"
                    >
                      <Target className="w-4 h-4 text-slate-400" />
                      <span className="flex-1">{sub.titulo}</span>
                      <Badge variant="outline" className="text-xs">
                        {getNextNivelLabel(meta.nivel || nivel)}
                      </Badge>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Nenhuma meta filha vinculada</p>
            )}
            <Button 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => {
                const nivelParaNavegar = meta.nivel || nivel;
                navigate(`/metas/${getNextNivelPath(nivelParaNavegar)}/criar?pai=${meta.id}`);
              }}
            >
              Criar Meta Filha
            </Button>
          </CardContent>
        </Card>

        {/* Tarefas */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tarefas Vinculadas</CardTitle>
          </CardHeader>
          <CardContent>
            {tarefas.length > 0 ? (
              <ul className="space-y-2">
                {tarefas.map((tarefa) => (
                  <li key={tarefa.id} className="flex items-center gap-3 p-2 border rounded">
                    <input 
                      type="checkbox" 
                      checked={tarefa.completed}
                      onChange={() => handleToggleTarefa(tarefa.id)}
                      className="rounded"
                    />
                    <span className={tarefa.completed ? 'line-through text-slate-400' : ''}>
                      {tarefa.titulo}
                    </span>
                    <span className="ml-auto text-xs text-slate-500">
                      {tarefa.data}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">Nenhuma tarefa vinculada</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getNextNivel(nivel: MetaNivel): MetaNivel {
  switch (nivel) {
    case 'grande': return 'anual';
    case 'anual': return 'mensal';
    case 'mensal': return 'semanal';
    case 'semanal': return 'diaria';
    case 'diaria': return 'diaria';
  }
}

function getNextNivelPath(nivel: MetaNivel): string {
  switch (nivel) {
    case 'grande': return 'anuais';
    case 'anual': return 'mensais';
    case 'mensal': return 'semanais';
    case 'semanal': return 'diarias';
    case 'diaria': return 'diarias';
  }
}

function getNextNivelLabel(nivel: MetaNivel): string {
  switch (nivel) {
    case 'grande': return 'Anual';
    case 'anual': return 'Mensal';
    case 'mensal': return 'Semanal';
    case 'semanal': return 'Diária';
    case 'diaria': return 'Diária';
  }
}