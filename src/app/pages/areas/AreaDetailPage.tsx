import { useParams, Link, useNavigate } from 'react-router';
import { ArrowLeft, Pencil, Target, CheckCircle2, Clock, Trash2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../components/ui/alert-dialog';

export default function AreaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getAreaById, grandesMetas, deleteArea } = useApp();

  const area = getAreaById(id || '');

  if (!area) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/areas')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl text-slate-800">Área não encontrada</h1>
        </div>
        <Card>
          <CardContent className="py-10 text-center text-slate-500">
            A área que você está procurando não existe ou foi removida.
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter metas by area
  const metasDaArea = grandesMetas.filter(m => m.area_id === area.id);

  // Calculate progress
  const totalMetas = metasDaArea.length;
  const metasConcluidas = metasDaArea.filter(m => m.status === 'concluida').length;
  const progresso = totalMetas > 0 ? Math.round((metasConcluidas / totalMetas) * 100) : 0;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/areas" className="hover:text-indigo-600">Áreas</Link>
        <span>/</span>
        <span className="text-slate-800">{area.nome}</span>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start gap-6 mb-8">
        <div
          className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl shrink-0"
          style={{ backgroundColor: (area.cor || '#6366f1') + '20' }}
        >
          {area.icone || '🎯'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-800">{area.nome}</h1>
            <Link to={`/areas/${area.id}/edit`}>
              <Button variant="outline" size="sm" className="gap-2">
                <Pencil className="h-4 w-4" />
                Editar
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2 text-red-600 hover:text-red-600 hover:bg-red-50 border-red-200">
                  <Trash2 className="h-4 w-4" />
                  Excluir
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Excluir Área</AlertDialogTitle>
                  <AlertDialogDescription>
                    Tem certeza que deseja excluir a área "{area.nome}"? Esta ação não pode ser desfeita e todas as metas vinculadas a esta área ficarão órfãs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={async () => {
                      try {
                        await deleteArea(id!);
                        navigate('/areas');
                      } catch (error) {
                        console.error('Erro ao excluir área:', error);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    Excluir
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
          {area.descricao && (
            <p className="text-slate-500 mb-4 max-w-2xl">{area.descricao}</p>
          )}
          <Button variant="ghost" size="sm" onClick={() => navigate('/areas')} className="gap-1 p-0 hover:bg-transparent hover:text-indigo-600">
            <ArrowLeft className="h-4 w-4" />
            Voltar para Áreas
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total de Metas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalMetas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Metas Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {metasDaArea.filter(m => m.status === 'ativa').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Metas Concluídas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{metasConcluidas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-700">Progresso Geral</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={progresso} className="flex-1 h-3" style={{ 
              '--progress-background': area.cor || '#6366f1' 
            } as React.CSSProperties} />
            <span className="text-lg font-semibold text-slate-800 min-w-[60px] text-right">{progresso}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Grandes Metas List */}
      <div>
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Grandes Metas</h2>
        {metasDaArea.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-slate-500">
              <Target className="h-10 w-10 mx-auto mb-3 text-slate-300" />
              <p>Nenhuma grande meta vinculada a esta área ainda.</p>
              <Link to="/metas/grandes/criar">
                <Button variant="outline" className="mt-4">
                  Criar Grande Meta
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {metasDaArea.map((meta) => {
              const metaProgress = meta.progress || 0;
              return (
                <Card key={meta.id} className="hover:border-slate-300 transition-colors">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="font-semibold">G</Badge>
                      <div>
                        <h3 className="text-slate-800 font-medium">{meta.title}</h3>
                        <p className="text-xs text-slate-400">Criada em {new Date(meta.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full" 
                              style={{ 
                              width: `${metaProgress}%`, 
                              backgroundColor: meta.status === 'concluida' ? '#22c55e' : (area.cor || '#6366f1') 
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-medium text-slate-500">{metaProgress}%</span>
                      {meta.status === 'concluida' ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <Clock className="h-5 w-5 text-slate-300" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}