import { useApp } from '../../contexts/AppContext';
import { MetasListPage } from './MetasListPage';

export default function MetasSemanaisPage() {
  const { metasSemanais } = useApp();
  return (
    <MetasListPage
      level="S"
      metas={metasSemanais}
      createPath="/metas/semanal/criar"
      title="Metas Semanais"
      subtitle="Seu foco desta semana. O que tornará esta semana um sucesso?"
      focusingQuestion='"Qual é a ÚNICA coisa que posso fazer esta semana, de tal forma que minha meta mensal avance com clareza?"'
    />
  );
}
