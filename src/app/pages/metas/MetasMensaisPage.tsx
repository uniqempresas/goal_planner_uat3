import { useApp } from '../../contexts/AppContext';
import { MetasListPageModern } from './MetasListPageModern';

export default function MetasMensaisPage() {
  const { metasMensais } = useApp();
  return (
    <MetasListPageModern
      level="mensal"
      metas={metasMensais}
      createPath="/metas/mensal/criar"
      title="Metas Mensais"
      subtitle="O foco deste mês para avançar nas metas anuais."
      focusingQuestion='Qual é a ÚNICA coisa que posso fazer este mês, de tal forma que minha meta anual fique mais próxima?'
    />
  );
}
