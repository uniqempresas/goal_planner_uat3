import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { metasService, type MetaNivel } from '@/services/metasService';
import { useApp } from '@/app/contexts/AppContext';
import { Button } from '@/app/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { cn } from '@/app/components/ui/utils';

interface MetaParentSelectorProps {
  nivel: MetaNivel;
  onSelect: (metaId: string | null) => void;
  selectedId?: string;
}

const nivelPaiMap: Record<MetaNivel, MetaNivel | null> = {
  grande: null,
  anual: 'grande',
  mensal: 'anual',
  semanal: 'mensal',
  diaria: 'semanal',
};

const nivelLabels: Record<MetaNivel, string> = {
  grande: 'Grande Meta',
  anual: 'Meta Anual',
  mensal: 'Meta Mensal',
  semanal: 'Meta Semanal',
  diaria: 'Meta Diária',
};

function getNivelPath(nivel: MetaNivel): string {
  switch (nivel) {
    case 'grande': return 'grandes';
    case 'anual': return 'anuais';
    case 'mensal': return 'mensais';
    case 'semanal': return 'semanais';
    case 'diaria': return 'diarias';
  }
}

export function MetaParentSelector({ nivel, onSelect, selectedId }: MetaParentSelectorProps) {
  const { user } = useApp();
  const [metasPai, setMetasPai] = useState<Awaited<ReturnType<typeof metasService.getMetasByNivel>>>([]);
  const [loading, setLoading] = useState(true);

  const nivelPai = nivelPaiMap[nivel];

  useEffect(() => {
    async function loadMetas() {
      if (!user || !nivelPai) {
        setLoading(false);
        return;
      }

      try {
        const metas = await metasService.getMetasByNivel(user.id, nivelPai);
        setMetasPai(metas);
      } catch (error) {
        console.error('Erro ao carregar metas pai:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMetas();
  }, [user, nivelPai]);

  if (!nivelPai) {
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Selecione a Meta Pai (Opcional)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-slate-500 text-sm">Carregando...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Selecione a Meta Pai (Opcional)</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Opção "Nenhuma" */}
        <div
          onClick={() => onSelect(null)}
          className={cn(
            'cursor-pointer rounded-lg border-2 p-4 transition-all',
            selectedId === null || selectedId === undefined
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          )}
        >
          <p className="font-medium text-slate-700">Nenhuma meta pai</p>
          <p className="text-sm text-slate-500">Criar como meta independente</p>
        </div>

        {/* Cards de metas */}
        {metasPai.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-slate-500 mb-4">
              Nenhuma {nivelLabels[nivelPai]} disponível.
            </p>
            <Button asChild variant="outline">
              <Link to={`/metas/${getNivelPath(nivelPai)}/criar`}>
                Criar Nova {nivelLabels[nivelPai]}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metasPai.map((meta) => (
              <div
                key={meta.id}
                onClick={() => onSelect(meta.id)}
                className={cn(
                  'cursor-pointer rounded-lg border-2 p-4 transition-all',
                  selectedId === meta.id
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                )}
              >
                <p className="font-medium text-slate-800 truncate">{meta.titulo}</p>
                {meta.focusing_question && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                    {meta.focusing_question}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  {meta.one_thing && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
                      ONE Thing
                    </span>
                  )}
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full',
                    meta.status === 'ativa' 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-600'
                  )}>
                    {meta.status === 'ativa' ? 'Ativa' : meta.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
