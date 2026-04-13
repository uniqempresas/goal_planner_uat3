import { Layers } from 'lucide-react';
import { EmptyStateModern } from '../metas/EmptyStateModern';

interface AreaEmptyStateProps {
  onCreateFirst: () => void;
}

export function AreaEmptyState({ onCreateFirst }: AreaEmptyStateProps) {
  return (
    <EmptyStateModern
      title="Nenhuma área criada ainda"
      description="Crie áreas para organizar suas metas por dimensões de vida como Saúde, Carreira, Finanças e muito mais."
      actionLabel="Criar Primeira Área"
      actionHref="/areas/criar"
      color="#6366F1"
      bgColor="#EEF2FF"
    />
  );
}