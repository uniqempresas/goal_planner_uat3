// ============================================================
// Goal Planner - Mock Data e Configurações
// ============================================================

export interface Area {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  description: string;
  progress: number;
  metasCount: number;
}

export interface SmartMetric {
  id: string;
  key: string;
  target: number;
  current: number;
  unit: string;
}

export interface SmartData {
  specific?: string;
  measurable?: SmartMetric[];
  achievable?: string;
  relevant?: string;
  timeBound?: { start: string; end: string };
}

export type MetaLevel = 'G' | 'A' | 'M' | 'S' | 'D';
export type MetaStatus = 'active' | 'completed' | 'paused' | 'not_started';

export interface Meta {
  id: string;
  title: string;
  description: string;
  level: MetaLevel;
  areaId: string;
  parentId?: string;
  childrenIds?: string[];
  status: MetaStatus;
  progress: number;
  prazo: string;
  focusingQuestion?: string;
  isOneThing?: boolean;
  smart?: SmartData;
  createdAt: string;
}

export type TimeBlock = 'atrasadas' | 'manha' | 'tarde' | 'noite' | 'habitos' | 'recorrentes' | 'oneThing';

export interface Tarefa {
  id: string;
  title: string;
  block: TimeBlock;
  metaId?: string;
  completed: boolean;
  date: string;
  hora?: string;
  isOneThing?: boolean;
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedAt: string;
}

export interface WeeklyStats {
  completedTasks: number;
  totalTasks: number;
  completedHabits: number;
  totalHabits: number;
  streakDays: number;
  focusHours: number;
}

// ============================================================
// Configurações de Emojis e Cores para Áreas
// ============================================================

export const availableEmojis = [
  // Saúde & Bem-estar (15)
  '💪', '🏃', '🧘', '🥗', '💊', '🏋️', '🚴', '🏊', '💤', '🩺', '🌱', '🍎', '🥑', '🥤', '🧃',
  // Carreira & Negócios (20)
  '🚀', '💼', '📈', '🎯', '💻', '⚡', '🏆', '📊', '🔧', '💡', '📱', '🎓', '👔', '💼', '🏢', '📅', '📋', '✅', '📌', '🔖',
  // Finanças (15)
  '💰', '💵', '💎', '🏦', '📉', '📈', '💸', '🤑', '💳', '🏛️', '💲', '💱', '💹', '🏧', '💲',
  // Família & Relacionamentos (20)
  '❤️', '👨‍👩‍👧‍👦', '💑', '🤝', '🗣️', '🏠', '👶', '🎎', '💕', '🌹', '💌', '💒', '🧑‍🤝‍🧑', '👨‍👩‍👧', '👨‍👩‍👧‍👦', '👨‍👩‍👦‍👦', '👩‍👩‍👧', '👩‍👩‍👦', '🎁', '🎀',
  // Desenvolvimento Pessoal (20)
  '📚', '🎓', '✨', '🧠', '🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '📝', '📖', '🔍', '💭', '🤔', '💡', '🧩', '🎲', '🧮', '📐',
  // Espiritualidade (20)
  '🧘', '🙏', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '🕊️', '🌟', '✨', '💫', '🔮', '📿', '🏛️', '⛪', '🕌', '🕍',
  // Lazer & Diversão (20)
  '🎮', '🎬', '🎵', '🎨', '🏖️', '✈️', '🎉', '🎊', '🎁', '🎄', '🎆', '🎇', '🧸', '🎈', '🎠', '🎡', '🎢', '🏰', '🏯', '🌅',
  // Social & Comunidade (15)
  '🤝', '🌍', '👥', '🗳️', '🏛️', '🎗️', '💝', '🌟', '⭐', '🔥', '🌈', '☀️', '🌙', '⭐', '✨',
  // Esportes & Atividades (20)
  '⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '⛳', '🏹', '🎣', '🥊',
  // Natureza & Animais (20)
  '🌳', '🌲', '🌴', '🌵', '🌷', '🌸', '🌹', '🌺', '🌻', '🌼', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🐶', '🐱', '🐭', '🐹',
  // Comida & Bebida (20)
  '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍈', '🍒', '🍑', '🍍', '🥝', '🍅', '🍆', '🥑', '🍳', '🥐', '🍞',
  // Viagem & Lugares (20)
  '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛵', '🏍️', '🛺', '🚲', '🛴', '🚂', '✈️',
  // Objetos & Ferramentas (20)
  '⌚', '📱', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️',
  // Símbolos & Sinais (20)
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️',
];

export const availableColors = [
  // Verdes (8)
  { name: 'Esmeralda', value: '#10B981', bgColor: '#ECFDF5' },
  { name: 'Verde', value: '#22C55E', bgColor: '#DCFCE7' },
  { name: 'Lima', value: '#84CC16', bgColor: '#F7FEE7' },
  { name: 'Verde Escuro', value: '#15803D', bgColor: '#DCFCE7' },
  { name: 'Teal', value: '#14B8A6', bgColor: '#F0FDFA' },
  { name: 'Turquesa', value: '#2DD4BF', bgColor: '#CCFBF1' },
  { name: 'Verde Menta', value: '#6EE7B7', bgColor: '#D1FAE5' },
  { name: 'Verde Musgo', value: '#65A30D', bgColor: '#ECFCCB' },
  // Azuis (10)
  { name: 'Azul', value: '#3B82F6', bgColor: '#EFF6FF' },
  { name: 'Índigo', value: '#6366F1', bgColor: '#EEF2FF' },
  { name: 'Violeta', value: '#8B5CF6', bgColor: '#F5F3FF' },
  { name: 'Roxo', value: '#A855F7', bgColor: '#FAF5FF' },
  { name: 'Ciano', value: '#06B6D4', bgColor: '#ECFEFF' },
  { name: 'Celeste', value: '#0EA5E9', bgColor: '#F0F9FF' },
  { name: 'Azul Royal', value: '#4169E1', bgColor: '#E0E7FF' },
  { name: 'Azul Marinho', value: '#1E40AF', bgColor: '#DBEAFE' },
  { name: 'Azul Claro', value: '#60A5FA', bgColor: '#EFF6FF' },
  { name: 'Azul Bebê', value: '#93C5FD', bgColor: '#DBEAFE' },
  // Vermelhos e Laranjas (12)
  { name: 'Vermelho', value: '#EF4444', bgColor: '#FEF2F2' },
  { name: 'Rosa', value: '#EC4899', bgColor: '#FDF2F8' },
  { name: 'Laranja', value: '#F97316', bgColor: '#FFF7ED' },
  { name: 'Âmbar', value: '#F59E0B', bgColor: '#FFFBEB' },
  { name: 'Amarelo', value: '#EAB308', bgColor: '#FEFCE8' },
  { name: 'Coral', value: '#FF6B6B', bgColor: '#FFE4E6' },
  { name: 'Salmão', value: '#FA8072', bgColor: '#FFE4E1' },
  { name: 'Tomate', value: '#FF6347', bgColor: '#FFE4E1' },
  { name: 'Laranja Escuro', value: '#EA580C', bgColor: '#FFF7ED' },
  { name: 'Dourado', value: '#FBBF24', bgColor: '#FEF3C7' },
  { name: 'Mostarda', value: '#CA8A04', bgColor: '#FEF9C3' },
  { name: 'Marrom', value: '#92400E', bgColor: '#FFFBEB' },
  // Neutros (10)
  { name: 'Slate', value: '#64748B', bgColor: '#F8FAFC' },
  { name: 'Zinc', value: '#71717A', bgColor: '#FAFAFA' },
  { name: 'Stone', value: '#78716C', bgColor: '#FAFAF9' },
  { name: 'Cinza', value: '#6B7280', bgColor: '#F3F4F6' },
  { name: 'Grafite', value: '#374151', bgColor: '#F9FAFB' },
  { name: 'Preto', value: '#111827', bgColor: '#F3F4F6' },
  { name: 'Branco', value: '#F9FAFB', bgColor: '#FFFFFF' },
  { name: 'Creme', value: '#FEF3C7', bgColor: '#FFFBEB' },
  { name: 'Bege', value: '#D4C4B0', bgColor: '#FAF7F2' },
  { name: 'Cáqui', value: '#C3B091', bgColor: '#F5F5DC' },
  // Cores Especiais (10)
  { name: 'Roxo Escuro', value: '#581C87', bgColor: '#F3E8FF' },
  { name: 'Magenta', value: '#C026D3', bgColor: '#FAE8FF' },
  { name: 'Fúcsia', value: '#D946EF', bgColor: '#FAE8FF' },
  { name: 'Rosa Claro', value: '#F9A8D4', bgColor: '#FDF2F8' },
  { name: 'Lavanda', value: '#A78BFA', bgColor: '#EDE9FE' },
  { name: 'Ameixa', value: '#9333EA', bgColor: '#F3E8FF' },
  { name: 'Vinho', value: '#991B1B', bgColor: '#FEF2F2' },
  { name: 'Bordô', value: '#7F1D1D', bgColor: '#FEF2F2' },
  { name: 'Menta', value: '#6EE7B7', bgColor: '#D1FAE5' },
  { name: 'Oliva', value: '#65A30D', bgColor: '#ECFCCB' },
];

// ============================================================
// Mock Data
// ============================================================

export const mockUser: User = {
  id: 'u1',
  name: 'João Silva',
  email: 'joao@email.com',
  joinedAt: '2025-01-01',
};

export const mockAreas: Area[] = [
  {
    id: 'a1',
    name: 'Saúde e Bem-estar',
    emoji: '💪',
    color: '#10B981',
    bgColor: '#ECFDF5',
    description: 'Cuidar do corpo e da mente para ter energia e vitalidade.',
    progress: 65,
    metasCount: 4,
  },
  {
    id: 'a2',
    name: 'Carreira e Negócios',
    emoji: '🚀',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    description: 'Crescimento profissional, projetos e construção da carreira.',
    progress: 42,
    metasCount: 6,
  },
  {
    id: 'a3',
    name: 'Finanças',
    emoji: '💰',
    color: '#F59E0B',
    bgColor: '#FFFBEB',
    description: 'Liberdade financeira, investimentos e patrimônio.',
    progress: 35,
    metasCount: 3,
  },
  {
    id: 'a4',
    name: 'Família e Relacionamentos',
    emoji: '❤️',
    color: '#EF4444',
    bgColor: '#FEF2F2',
    description: 'Conexões que importam e presença nas relações.',
    progress: 78,
    metasCount: 2,
  },
  {
    id: 'a5',
    name: 'Desenvolvimento Pessoal',
    emoji: '📚',
    color: '#8B5CF6',
    bgColor: '#F5F3FF',
    description: 'Aprendizado contínuo, habilidades e crescimento pessoal.',
    progress: 55,
    metasCount: 5,
  },
  {
    id: 'a6',
    name: 'Espiritualidade',
    emoji: '🧘',
    color: '#06B6D4',
    bgColor: '#ECFEFF',
    description: 'Propósito, valores e conexão com algo maior.',
    progress: 48,
    metasCount: 2,
  },
];

export const mockGrandesMetas: Meta[] = [
  {
    id: 'g1',
    title: 'Alcançar Liberdade Financeira',
    description: 'Construir patrimônio de R$1M e renda passiva de R$10k/mês até dezembro de 2027.',
    level: 'G',
    areaId: 'a3',
    childrenIds: ['ag1', 'ag2'],
    status: 'active',
    progress: 35,
    prazo: '2027-12-31',
    focusingQuestion: 'Qual é a ÚNICA coisa que posso fazer para alcançar liberdade financeira nos próximos 3 anos, de tal forma que tudo se torne mais fácil ou desnecessário?',
    isOneThing: true,
    smart: {
      specific: 'Construir patrimônio de R$1.000.000 e gerar renda passiva de R$10.000/mês através de investimentos diversificados.',
      measurable: [
        { id: 'm1', key: 'patrimônio', target: 1000000, current: 350000, unit: 'R$' },
        { id: 'm2', key: 'renda passiva', target: 10000, current: 2800, unit: 'R$/mês' },
      ],
      achievable: 'Aumentar renda ativa em 50%, reduzir despesas em 20% e investir 30% do salário mensalmente.',
      relevant: 'Liberdade para escolher como gastar meu tempo, sem depender de um emprego.',
      timeBound: { start: '2025-01-01', end: '2027-12-31' },
    },
    createdAt: '2025-01-15',
  },
  {
    id: 'g2',
    title: 'Me Tornar Referência em Desenvolvimento de Software',
    description: 'Ser reconhecido como especialista em arquitetura de software e liderar um time técnico de alto impacto.',
    level: 'G',
    areaId: 'a2',
    childrenIds: ['ag3'],
    status: 'active',
    progress: 42,
    prazo: '2027-06-30',
    focusingQuestion: 'Qual é a ÚNICA coisa que posso fazer para me tornar referência em dev, de tal forma que oportunidades venham até mim?',
    smart: {
      specific: 'Publicar 3 artigos técnicos por mês, contribuir para 5 projetos open source relevantes e falar em 2 conferências por ano.',
      measurable: [
        { id: 'm3', key: 'seguidores técnicos', target: 10000, current: 2400, unit: 'seguidores' },
        { id: 'm4', key: 'artigos publicados', target: 50, current: 18, unit: 'artigos' },
      ],
      achievable: 'Dedicar 2h/dia para criação de conteúdo técnico e open source.',
      relevant: 'Reconhecimento que abre portas para projetos maiores e melhor remuneração.',
      timeBound: { start: '2025-01-01', end: '2027-06-30' },
    },
    createdAt: '2025-01-15',
  },
  {
    id: 'g3',
    title: 'Transformar Minha Saúde Completamente',
    description: 'Atingir condicionamento físico de alto nível: correr maratona, ter 15% de gordura corporal e energia para o dia.',
    level: 'G',
    areaId: 'a1',
    childrenIds: ['ag4'],
    status: 'active',
    progress: 65,
    prazo: '2026-12-31',
    focusingQuestion: 'Qual é a ÚNICA coisa que posso fazer pela minha saúde hoje que tornará todas as outras metas mais fáceis de alcançar?',
    smart: {
      specific: 'Correr uma maratona (42km), manter 15% de gordura corporal e dormir 7-8h por noite consistentemente.',
      measurable: [
        { id: 'm5', key: 'gordura corporal', target: 15, current: 22, unit: '%' },
        { id: 'm6', key: 'km corridos/semana', target: 30, current: 18, unit: 'km' },
      ],
      achievable: 'Seguir plano de treino de 5x/semana e dieta de 80% clean eating.',
      relevant: 'Saúde é a base de tudo — sem energia, nenhuma outra meta é alcançável.',
      timeBound: { start: '2025-01-01', end: '2026-12-31' },
    },
    createdAt: '2025-01-15',
  },
];

export const mockMetasAnuais: Meta[] = [
  {
    id: 'ag1',
    title: 'Aumentar Patrimônio em R$150k',
    description: 'Crescer o patrimônio através de aportes mensais e rentabilidade dos investimentos.',
    level: 'A',
    areaId: 'a3',
    parentId: 'g1',
    childrenIds: ['ma1', 'ma2'],
    status: 'active',
    progress: 58,
    prazo: '2025-12-31',
    focusingQuestion: 'Qual é a ÚNICA ação financeira que posso fazer este ano para garantir R$150k de crescimento patrimonial?',
    smart: {
      specific: 'Aportar R$5k/mês em investimentos diversificados e manter rentabilidade acima do CDI.',
      measurable: [
        { id: 'am1', key: 'aporte mensal', target: 5000, current: 4200, unit: 'R$' },
        { id: 'am2', key: 'crescimento total', target: 150000, current: 87000, unit: 'R$' },
      ],
      achievable: 'Cortar R$1.200/mês em gastos desnecessários + bônus do trabalho.',
      relevant: 'Base para liberdade financeira em 3 anos.',
      timeBound: { start: '2025-01-01', end: '2025-12-31' },
    },
    createdAt: '2025-01-20',
  },
  {
    id: 'ag2',
    title: 'Criar Primeira Fonte de Renda Passiva',
    description: 'Lançar um produto digital que gere R$2k/mês de forma recorrente.',
    level: 'A',
    areaId: 'a3',
    parentId: 'g1',
    status: 'active',
    progress: 20,
    prazo: '2025-12-31',
    focusingQuestion: 'Qual produto digital posso criar que resolva o maior problema do meu público-alvo?',
    smart: {
      specific: 'Criar e lançar um curso online sobre arquitetura de software que gere R$2k/mês.',
      measurable: [
        { id: 'am3', key: 'alunos', target: 200, current: 0, unit: 'alunos' },
        { id: 'am4', key: 'receita mensal', target: 2000, current: 0, unit: 'R$/mês' },
      ],
      achievable: 'Gravar 40 aulas de 20min nos próximos 4 meses.',
      relevant: 'Renda passiva é o primeiro passo para independência financeira.',
      timeBound: { start: '2025-03-01', end: '2025-12-31' },
    },
    createdAt: '2025-02-01',
  },
  {
    id: 'ag3',
    title: 'Lançar Blog Técnico com 5k Leitores/Mês',
    description: 'Criar conteúdo técnico de qualidade que construa audiência e reputação.',
    level: 'A',
    areaId: 'a2',
    parentId: 'g2',
    status: 'active',
    progress: 45,
    prazo: '2025-12-31',
    focusingQuestion: 'Qual tema técnico posso explorar que ninguém está cobrindo bem no Brasil?',
    smart: {
      specific: 'Publicar 3 artigos técnicos por semana e alcançar 5.000 leitores mensais únicos.',
      measurable: [
        { id: 'am5', key: 'leitores/mês', target: 5000, current: 2200, unit: 'leitores' },
        { id: 'am6', key: 'artigos publicados', target: 48, current: 22, unit: 'artigos' },
      ],
      achievable: 'Dedicar 1h30/dia para escrita técnica.',
      relevant: 'Base para construção de audiência e autoridade técnica.',
      timeBound: { start: '2025-01-01', end: '2025-12-31' },
    },
    createdAt: '2025-01-20',
  },
  {
    id: 'ag4',
    title: 'Correr Meia Maratona em Novembro',
    description: 'Completar 21km em menos de 2h30 na corrida de novembro.',
    level: 'A',
    areaId: 'a1',
    parentId: 'g3',
    status: 'active',
    progress: 70,
    prazo: '2025-11-30',
    focusingQuestion: 'Qual é o treino que, se eu fizer consistentemente, me garantirá cruzar a linha de chegada forte?',
    smart: {
      specific: 'Completar meia maratona (21km) com pace médio de 7min/km.',
      measurable: [
        { id: 'am7', key: 'km longão semanal', target: 21, current: 16, unit: 'km' },
        { id: 'am8', key: 'pace atual', target: 7, current: 7.8, unit: 'min/km' },
      ],
      achievable: 'Seguir plano de 4 treinos por semana com longão aos finais de semana.',
      relevant: 'Prova de disciplina e base para maratona completa em 2027.',
      timeBound: { start: '2025-01-01', end: '2025-11-30' },
    },
    createdAt: '2025-01-20',
  },
];

export const mockMetasMensais: Meta[] = [
  {
    id: 'ma1',
    title: 'Otimizar Carteira de Investimentos',
    description: 'Rebalancear portfólio para aumentar exposição em FIIs.',
    level: 'M',
    areaId: 'a3',
    parentId: 'ag1',
    status: 'active',
    progress: 60,
    prazo: '2025-03-31',
    focusingQuestion: 'Qual é o único rebalanceamento que aumentará minha renda passiva este mês?',
    createdAt: '2025-03-01',
  },
  {
    id: 'ma2',
    title: 'Eliminar R$800 em Gastos Supérfluos',
    description: 'Auditar todos os gastos e cancelar assinaturas desnecessárias.',
    level: 'M',
    areaId: 'a3',
    parentId: 'ag1',
    status: 'active',
    progress: 75,
    prazo: '2025-03-31',
    focusingQuestion: 'Qual gasto posso cortar hoje sem impactar minha qualidade de vida?',
    createdAt: '2025-03-01',
  },
  {
    id: 'ma3',
    title: 'Publicar 12 Artigos Técnicos',
    description: '3 artigos por semana sobre arquitetura de software e React.',
    level: 'M',
    areaId: 'a2',
    parentId: 'ag3',
    status: 'active',
    progress: 42,
    prazo: '2025-03-31',
    focusingQuestion: 'Qual tópico técnico, se eu escrever sobre ele, trará mais valor para os leitores este mês?',
    createdAt: '2025-03-01',
  },
  {
    id: 'ma4',
    title: 'Completar Longão de 18km',
    description: 'Preparação para meia maratona: completar corrida de 18km no final do mês.',
    level: 'M',
    areaId: 'a1',
    parentId: 'ag4',
    status: 'active',
    progress: 80,
    prazo: '2025-03-29',
    focusingQuestion: 'Qual ajuste no treino me dará mais confiança para o longão de 18km?',
    isOneThing: true,
    createdAt: '2025-03-01',
  },
];

export const mockMetasSemanais: Meta[] = [
  {
    id: 'ms1',
    title: 'Escrever 3 Artigos Técnicos',
    description: 'Publicar artigos sobre React Server Components, TypeScript avançado e Clean Architecture.',
    level: 'S',
    areaId: 'a2',
    parentId: 'ma3',
    status: 'active',
    progress: 33,
    prazo: '2025-03-28',
    focusingQuestion: 'Qual artigo, se publicado hoje, causará maior impacto na minha audiência?',
    createdAt: '2025-03-24',
  },
  {
    id: 'ms2',
    title: 'Treinar 4x e Longão de 16km',
    description: '3 treinos de ritmo + 1 treino de força + longão de 16km no sábado.',
    level: 'S',
    areaId: 'a1',
    parentId: 'ma4',
    status: 'active',
    progress: 50,
    prazo: '2025-03-29',
    focusingQuestion: 'Qual treino desta semana é o mais crítico para minha evolução?',
    isOneThing: true,
    createdAt: '2025-03-24',
  },
  {
    id: 'ms3',
    title: 'Revisar e Aportar R$4.200',
    description: 'Verificar saldo da conta, executar aportes em renda fixa e renda variável.',
    level: 'S',
    areaId: 'a3',
    parentId: 'ma1',
    status: 'active',
    progress: 0,
    prazo: '2025-03-28',
    focusingQuestion: 'Qual aporte terá melhor relação risco/retorno esta semana?',
    createdAt: '2025-03-24',
  },
];

export const mockMetasDiarias: Meta[] = [
  {
    id: 'md1',
    title: 'Escrever Artigo sobre React Server Components',
    description: 'Redigir 1.500 palavras sobre RSC para o blog técnico.',
    level: 'D',
    areaId: 'a2',
    parentId: 'ms1',
    status: 'active',
    progress: 0,
    prazo: '2025-03-28',
    focusingQuestion: 'Qual é o ÚNICO insight sobre RSC que mudará a visão do leitor?',
    isOneThing: true,
    createdAt: '2025-03-28',
  },
  {
    id: 'md2',
    title: 'Treino de Corrida — Pace 7:30/km por 8km',
    description: 'Treino intervalado: 2km aquecimento + 4x1km ritmo + 2km regenerativo.',
    level: 'D',
    areaId: 'a1',
    parentId: 'ms2',
    status: 'active',
    progress: 0,
    prazo: '2025-03-28',
    focusingQuestion: 'Como este treino me aproxima 1 passo da meia maratona?',
    createdAt: '2025-03-28',
  },
];

export const mockTarefasHoje: Tarefa[] = [
  // ONE Thing
  {
    id: 't0',
    title: 'Escrever artigo completo sobre React Server Components',
    block: 'oneThing',
    metaId: 'md1',
    completed: false,
    date: '2025-03-28',
    hora: '08:00',
    isOneThing: true,
    priority: 'high',
    notes: 'Foco total. Sem distrações. Este é o trabalho mais importante do dia.',
  },
  // Atrasadas
  {
    id: 't1',
    title: 'Responder emails de parceria do blog',
    block: 'atrasadas',
    metaId: 'ag3',
    completed: false,
    date: '2025-03-26',
    priority: 'medium',
  },
  {
    id: 't2',
    title: 'Revisar pull request do projeto open source',
    block: 'atrasadas',
    metaId: 'ag3',
    completed: false,
    date: '2025-03-25',
    priority: 'low',
  },
  // Manhã
  {
    id: 't3',
    title: 'Revisar e publicar artigo sobre TypeScript',
    block: 'manha',
    metaId: 'ms1',
    completed: true,
    date: '2025-03-28',
    hora: '10:30',
    priority: 'high',
  },
  {
    id: 't4',
    title: 'Reunião de alinhamento com mentor técnico',
    block: 'manha',
    completed: false,
    date: '2025-03-28',
    hora: '11:00',
    priority: 'medium',
  },
  // Tarde
  {
    id: 't5',
    title: 'Responder comentários dos artigos do blog',
    block: 'tarde',
    metaId: 'ag3',
    completed: false,
    date: '2025-03-28',
    hora: '14:00',
    priority: 'low',
  },
  {
    id: 't6',
    title: 'Treino de corrida — pace 7:30/km por 8km',
    block: 'tarde',
    metaId: 'md2',
    completed: false,
    date: '2025-03-28',
    hora: '17:00',
    priority: 'high',
  },
  // Noite
  {
    id: 't7',
    title: 'Planejar semana seguinte (revisão semanal)',
    block: 'noite',
    completed: false,
    date: '2025-03-28',
    hora: '20:00',
    priority: 'high',
  },
  {
    id: 't8',
    title: 'Leitura — "A Única Coisa" cap. 12',
    block: 'noite',
    completed: true,
    date: '2025-03-28',
    hora: '21:00',
    priority: 'medium',
  },
  // Hábitos
  {
    id: 't9',
    title: 'Meditação (10min)',
    block: 'habitos',
    completed: true,
    date: '2025-03-28',
    priority: 'high',
  },
  {
    id: 't10',
    title: 'Hidratação (2L de água)',
    block: 'habitos',
    completed: false,
    date: '2025-03-28',
    priority: 'medium',
  },
  {
    id: 't11',
    title: 'Gratidão no diário',
    block: 'habitos',
    completed: false,
    date: '2025-03-28',
    priority: 'low',
  },
  {
    id: 't12',
    title: 'Cold shower',
    block: 'habitos',
    completed: true,
    date: '2025-03-28',
    priority: 'medium',
  },
  // Recorrentes
  {
    id: 't13',
    title: 'Verificar portfólio de investimentos',
    block: 'recorrentes',
    metaId: 'ms3',
    completed: false,
    date: '2025-03-28',
    notes: 'Recorrente: toda sexta-feira',
    priority: 'medium',
  },
  {
    id: 't14',
    title: 'Backup semanal do notebook',
    block: 'recorrentes',
    completed: false,
    date: '2025-03-28',
    notes: 'Recorrente: toda sexta-feira',
    priority: 'low',
  },
];

export const mockWeeklyStats: WeeklyStats = {
  completedTasks: 23,
  totalTasks: 31,
  completedHabits: 18,
  totalHabits: 24,
  streakDays: 14,
  focusHours: 16,
};

export const levelConfig: Record<MetaLevel, { label: string; color: string; bgColor: string; textColor: string; description: string }> = {
  G: {
    label: 'Grande Meta',
    description: '3 Anos',
    color: '#4F46E5',
    bgColor: '#EEF2FF',
    textColor: '#4338CA',
  },
  A: {
    label: 'Meta Anual',
    description: '1 Ano',
    color: '#7C3AED',
    bgColor: '#F5F3FF',
    textColor: '#6D28D9',
  },
  M: {
    label: 'Meta Mensal',
    description: '1 Mês',
    color: '#0891B2',
    bgColor: '#ECFEFF',
    textColor: '#0E7490',
  },
  S: {
    label: 'Meta Semanal',
    description: '1 Semana',
    color: '#059669',
    bgColor: '#ECFDF5',
    textColor: '#047857',
  },
  D: {
    label: 'Meta Diária',
    description: '1 Dia',
    color: '#D97706',
    bgColor: '#FFFBEB',
    textColor: '#B45309',
  },
};

export const blockConfig: Record<TimeBlock, { label: string; icon: string; color: string; bgColor: string; borderColor: string }> = {
  oneThing: {
    label: '⭐ ONE Thing',
    icon: '⭐',
    color: '#92400E',
    bgColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  atrasadas: {
    label: 'Tarefas Atrasadas',
    icon: '⚠️',
    color: '#991B1B',
    bgColor: '#FEF2F2',
    borderColor: '#EF4444',
  },
  manha: {
    label: 'Manhã',
    icon: '🌅',
    color: '#92400E',
    bgColor: '#FFFBEB',
    borderColor: '#F59E0B',
  },
  tarde: {
    label: 'Tarde',
    icon: '☀️',
    color: '#0C4A6E',
    bgColor: '#F0F9FF',
    borderColor: '#0EA5E9',
  },
  noite: {
    label: 'Noite',
    icon: '🌙',
    color: '#3730A3',
    bgColor: '#EEF2FF',
    borderColor: '#6366F1',
  },
  habitos: {
    label: 'Hábitos',
    icon: '🔄',
    color: '#065F46',
    bgColor: '#ECFDF5',
    borderColor: '#10B981',
  },
  recorrentes: {
    label: 'Tarefas Recorrentes',
    icon: '📅',
    color: '#4C1D95',
    bgColor: '#F5F3FF',
    borderColor: '#8B5CF6',
  },
};
