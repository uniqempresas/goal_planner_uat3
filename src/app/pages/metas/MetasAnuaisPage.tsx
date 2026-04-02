import { useApp } from '../../contexts/AppContext';
import { MetasListPage } from './MetasListPage';

export default function MetasAnuaisPage() {
  const { metasAnuais } = useApp();
  return (
    <MetasListPage
      level="A"
      metas={metasAnuais}
      createPath="/metas/anual/criar"
      title="Metas Anuais"
      subtitle="O que você precisa conquistar este ano para avançar nas grandes metas?"
      focusingQuestion='"Qual é a ÚNICA coisa que posso fazer este ano, de tal forma que avance significativamente em direção à minha grande meta?"'
    />
  );
}
