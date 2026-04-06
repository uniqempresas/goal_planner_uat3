import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router';
import { ArrowLeft, Edit, CheckCircle, Calendar, Target, Star } from 'lucide-react';
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
      await loadMetas();
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
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
        <Button onClick={() => navigate(`/metas/${nivel}`)} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to={`/metas/${nivel}`} className="hover:text-indigo-600">
          {nivelLabels[nivel]}
        </Link>
        <span>/</span>
        <span className="text-slate-800">Detalhes</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/metas/${nivel}`)}>
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
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate(`/metas/${nivel}/${meta.id}/editar`)}>
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button variant={meta.status === 'ativa' ? 'default' : 'outline'} onClick={handleToggleStatus}>
            <CheckCircle className="w-4 h-4 mr-2" />
            {meta.status === 'ativa' ? 'Concluir' : 'Reativar'}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
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
                      to={`/metas/${getNextNivel(nivel)}/${sub.id}`}
                      className="flex items-center gap-2 p-2 rounded hover:bg-slate-50"
                    >
                      <Target className="w-4 h-4 text-slate-400" />
                      <span className="flex-1">{sub.titulo}</span>
                      <Badge variant="outline" className="text-xs">
                        {getNextNivelLabel(nivel)}
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
              onClick={() => navigate(`/metas/${getNextNivel(nivel)}/criar?parent=${meta.id}`)}
            >
              Adicionar Meta Filha
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
                      onChange={() => tarefasService.toggleCompleted(tarefa.id)}
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

function getNextNivelLabel(nivel: MetaNivel): string {
  switch (nivel) {
    case 'grande': return 'Anual';
    case 'anual': return 'Mensal';
    case 'mensal': return 'Semanal';
    case 'semanal': return 'Diária';
    case 'diaria': return 'Diária';
  }
}