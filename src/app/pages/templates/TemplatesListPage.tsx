import { BookOpen, ArrowRight } from 'lucide-react';

const templates = [
  {
    id: 't1',
    title: 'Saúde e Fitness',
    description: 'Hierarquia completa de metas para transformação física: perda de peso, corrida, alimentação.',
    emoji: '💪',
    color: '#10B981',
    bgColor: '#ECFDF5',
    level: 'G → D',
    items: 8,
  },
  {
    id: 't2',
    title: 'Carreira Técnica',
    description: 'Metas para se tornar referência em tecnologia: blog, open source, conferências.',
    emoji: '🚀',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    level: 'G → S',
    items: 12,
  },
  {
    id: 't3',
    title: 'Liberdade Financeira',
    description: 'Hierarquia para construir patrimônio, renda passiva e controle financeiro.',
    emoji: '💰',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    level: 'G → M',
    items: 9,
  },
  {
    id: 't4',
    title: 'Hábitos de Alto Impacto',
    description: 'Rotina matinal e noturna baseada nos princípios de alto desempenho.',
    emoji: '⚡',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    level: 'D',
    items: 7,
  },
  {
    id: 't5',
    title: 'Desenvolvimento Pessoal',
    description: 'Leitura, aprendizados, meditação e crescimento contínuo.',
    emoji: '📚',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    level: 'A → M',
    items: 6,
  },
  {
    id: 't6',
    title: 'Família Presente',
    description: 'Tempo de qualidade, presença consciente e fortalecimento de vínculos.',
    emoji: '❤️',
    color: '#EF4444',
    bgColor: '#FEF2F2',
    level: 'A → S',
    items: 5,
  },
];

export default function TemplatesListPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <BookOpen size={20} className="text-indigo-600" />
          <h1 className="text-slate-800">Templates</h1>
        </div>
        <p className="text-slate-500 text-sm">Modelos pré-configurados para começar sua hierarquia de metas rapidamente.</p>
      </div>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
        <p className="text-indigo-700 text-sm">
          💡 <strong>Dica:</strong> Use os templates como ponto de partida e personalize conforme sua realidade. Cada template inclui metas nos níveis indicados.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map(template => (
          <div
            key={template.id}
            className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm p-5 transition-all group cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ backgroundColor: template.bgColor }}
              >
                {template.emoji}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: template.bgColor, color: template.color }}>
                  {template.level}
                </span>
              </div>
            </div>

            <h3 className="text-slate-800 text-sm font-medium mb-1.5 group-hover:text-indigo-600 transition-colors">{template.title}</h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">{template.description}</p>

            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-xs">{template.items} metas incluídas</span>
              <button
                className="flex items-center gap-1.5 text-sm font-medium transition-colors"
                style={{ color: template.color }}
              >
                Usar template
                <ArrowRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
