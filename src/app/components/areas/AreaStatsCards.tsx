import { Layers, Target, TrendingUp } from 'lucide-react';
import { StatsCard } from '../metas/StatsCard';

interface AreaUI {
  id: string;
  nome: string;
  icone: string;
  descricao: string;
  cor: string | null;
  progress: number;
  metasCount: number;
  metasConcluidas: number;
  createdAt: string;
}

interface AreaStatsCardsProps {
  areas: AreaUI[];
}

export function AreaStatsCards({ areas }: AreaStatsCardsProps) {
  const totalAreas = areas.length;
  const activeAreas = areas.filter(a => a.metasCount > 0).length;
  const avgProgress = totalAreas > 0 
    ? Math.round(areas.reduce((acc, a) => acc + (a.progress || 0), 0) / totalAreas)
    : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <StatsCard
        icon={Layers}
        value={totalAreas}
        label="Total de Áreas"
        color="#6366F1"
        bgColor="#EEF2FF"
        delay={0}
      />
      <StatsCard
        icon={Target}
        value={activeAreas}
        label="Áreas Ativas"
        color="#8B5CF6"
        bgColor="#F3E8FF"
        delay={0.1}
      />
      <StatsCard
        icon={TrendingUp}
        value={`${avgProgress}%`}
        label="Média de Progresso"
        color="#10B981"
        bgColor="#D1FAE5"
        delay={0.2}
      />
    </div>
  );
}