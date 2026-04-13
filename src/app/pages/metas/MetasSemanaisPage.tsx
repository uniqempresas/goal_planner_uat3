import { useApp } from '../../contexts/AppContext';
import { MetasListPageModern } from './MetasListPageModern';

export default function MetasSemanaisPage() {
  const { metasSemanais } = useApp();
  return (
    <MetasListPageModern
      level="semanal"
      metas={metasSemanais}
      createPath="/metas/semanais/criar"
      title="Metas Semanais"
      subtitle="Seu foco desta semana. O que tornará esta semana um sucesso?"
      focusingQuestion='Qual é a ÚNICA coisa que posso fazer esta semana, de tal forma que minha meta mensal avance com clareza?'
    />
  );
}
