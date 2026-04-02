import { useApp } from '../../contexts/AppContext';
import { MetasListPage } from './MetasListPage';

export default function MetasDiariasPage() {
  const { metasDiarias } = useApp();
  return (
    <MetasListPage
      level="D"
      metas={metasDiarias}
      createPath="/metas/diaria/criar"
      title="Metas Diárias"
      subtitle="Sua ONE Thing de hoje. A tarefa que, se feita, tornará tudo o mais desnecessário."
      focusingQuestion='"Qual é a ÚNICA coisa que posso fazer hoje, de tal forma que minha meta semanal avance de forma decisiva?"'
    />
  );
}
