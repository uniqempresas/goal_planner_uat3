import { useParams, Link, useNavigate } from 'react-router';
import { Pencil, Target, CheckCircle2, Clock, Trash2, Plus, ArrowLeft } from 'lucide-react';
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
      <div className="p-4 sm:p-6 max-w-5xl mx-auto">
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
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-4 sm:mb-6">
        <Link to="/areas" className="hover:text-indigo-600">Áreas</Link>
        <span>/</span>
        <span className="text-slate-800 truncate">{area.nome}</span>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden flex flex-col gap-3 mb-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0"
              style={{ backgroundColor: (area.cor || '#6366f1') + '20' }}
            >
              {area.icone || '🎯'}
            </div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight truncate">{area.nome}</h1>
          </div>
          <div className="w-9 h-9 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="42" fill="none"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 * (1 - progresso / 100)}
                style={{ stroke: area.cor || '#6366f1' }}
                strokeWidth="8"
              />
            </svg>
          </div>
        </div>
        {area.descricao && (
          <p className="text-sm text-slate-500 line-clamp-2">{area.descricao}</p>
        )}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">{progresso}%</span>
          <div className="flex items-center gap-2">
            <Link to={`/areas/${area.id}/edit`}>
              <Button variant="outline" size="sm" className="h-9 w-9 p-0" aria-label="Editar área">
                <Pencil className="h-4 w-4" />
              </Button>
            </Link>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-9 w-9 p-0 text-red-600 hover:text-red-600 hover:bg-red-50 border-red-200" aria-label="Excluir área">
                  <Trash2 className="h-4 w-4" />
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
            <Link to="/metas/grandes/criar">
              <Button size="sm" className="h-9 px-3" style={{ backgroundColor: area.cor || '#6366f1' }}>
                <Plus className="h-4 w-4 mr-1" />
                Nova Meta
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:flex items-start justify-between gap-6 mb-6">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div
            className="w-20 h-20 rounded-xl flex items-center justify-center text-4xl shrink-0"
            style={{ backgroundColor: (area.cor || '#6366f1') + '20' }}
          >
            {area.icone || '🎯'}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-slate-800 leading-tight">{area.nome}</h1>
            {area.descricao && (
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">{area.descricao}</p>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
          <Link to="/metas/grandes/criar">
            <Button size="sm" style={{ backgroundColor: area.cor || '#6366f1' }}>
              <Plus className="h-4 w-4 mr-1" />
              Nova Meta
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6">
        <Card className="p-2 sm:p-4 flex flex-col items-center justify-center text-center">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[10px] sm:text-sm font-medium text-slate-500 hidden sm:block">Total de Metas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg sm:text-2xl font-bold text-slate-800">{totalMetas}</div>
          </CardContent>
        </Card>
        <Card className="p-2 sm:p-4 flex flex-col items-center justify-center text-center">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[10px] sm:text-sm font-medium text-slate-500 hidden sm:block">Metas Ativas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg sm:text-2xl font-bold text-slate-800">
              {metasDaArea.filter(m => m.status === 'ativa').length}
            </div>
          </CardContent>
        </Card>
        <Card className="p-2 sm:p-4 flex flex-col items-center justify-center text-center">
          <CardHeader className="p-0 pb-1 sm:pb-2">
            <CardTitle className="text-[10px] sm:text-sm font-medium text-slate-500 hidden sm:block">Metas Concluídas</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-lg sm:text-2xl font-bold text-slate-800">{metasConcluidas}</div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="mb-6 p-4 sm:p-6">
        <CardHeader className="p-0 pb-3">
          <CardTitle className="text-base sm:text-lg text-slate-700">Progresso Geral</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex items-center gap-4">
            <Progress value={progresso} className="flex-1 h-3" style={{ 
              '--progress-background': area.cor || '#6366f1' 
            } as React.CSSProperties} />
            <span className="text-base sm:text-lg font-semibold text-slate-800 min-w-[60px] text-right">{progresso}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Grandes Metas List */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold text-slate-800 mb-4">Grandes Metas</h2>
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
              const metaProgress = 0;
              return (
                <Link key={meta.id} to={`/metas/grandes/${meta.id}`} className="block">
                  <Card className="hover:border-slate-300 transition-colors active:scale-[0.99]">
                    <CardContent className="p-4 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <Badge variant="outline" className="font-semibold shrink-0">G</Badge>
                        <div className="min-w-0">
                          <h3 className="text-slate-800 font-medium truncate">{meta.title}</h3>
                          <p className="text-xs text-slate-400">Criada em {new Date(meta.created_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex-1 sm:w-24">
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                                style={{ 
                                width: `${metaProgress}%`, 
                                backgroundColor: meta.status === 'concluida' ? '#22c55e' : (area.cor || '#6366f1') 
                              }}
                            />
                          </div>
                        </div>
                        <span className="text-xs font-medium text-slate-500 min-w-[28px] text-right">{metaProgress}%</span>
                        {meta.status === 'concluida' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                        ) : (
                          <Clock className="h-5 w-5 text-slate-300 shrink-0" />
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}