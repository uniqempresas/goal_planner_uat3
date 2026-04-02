import { Link } from 'react-router';
import { Target, ChevronRight, Star, Zap, TrendingUp, Calendar, CheckCircle2, ArrowRight, Mountain } from 'lucide-react';

const features = [
  {
    icon: <Mountain size={22} className="text-indigo-400" />,
    title: 'Hierarquia G → A → M → S → D',
    description: 'Grandes Metas (3 anos) → Anuais → Mensais → Semanais → Diárias. Cada ação conectada a um propósito maior.',
  },
  {
    icon: <Star size={22} className="text-amber-400 fill-amber-400" />,
    title: 'ONE Thing Diária',
    description: 'Identifique a única tarefa que, se feita hoje, tornará tudo o mais fácil ou desnecessário.',
  },
  {
    icon: <Calendar size={22} className="text-emerald-400" />,
    title: 'Time Blocking Inteligente',
    description: '7 blocos de tempo: Atrasadas, Manhã, Tarde, Noite, Hábitos, Recorrentes e ONE Thing.',
  },
  {
    icon: <Zap size={22} className="text-purple-400" />,
    title: 'Domino Effect',
    description: 'Visualize como suas metas pequenas alimentam as grandes, criando o efeito dominó do sucesso.',
  },
  {
    icon: <TrendingUp size={22} className="text-cyan-400" />,
    title: 'Framework SMART',
    description: 'Metas Específicas, Mensuráveis, Atingíveis, Relevantes e Temporais com métricas customizáveis.',
  },
  {
    icon: <CheckCircle2 size={22} className="text-rose-400" />,
    title: 'Focusing Question',
    description: '"Qual é a ÚNICA coisa que posso fazer..." em cada nível da hierarquia de metas.',
  },
];

const hierarchy = [
  { level: 'G', label: 'Grande Meta', period: '3 Anos', color: 'bg-indigo-600', desc: '"Onde quero estar em 3 anos?"', width: 'w-full' },
  { level: 'A', label: 'Meta Anual', period: '1 Ano', color: 'bg-violet-600', desc: '"O que devo conquistar este ano?"', width: 'w-5/6' },
  { level: 'M', label: 'Meta Mensal', period: '1 Mês', color: 'bg-cyan-600', desc: '"O que farei este mês para avançar?"', width: 'w-4/6' },
  { level: 'S', label: 'Meta Semanal', period: '1 Semana', color: 'bg-emerald-600', desc: '"Qual é meu foco desta semana?"', width: 'w-3/6' },
  { level: 'D', label: 'Meta Diária', period: '1 Dia', color: 'bg-amber-500', desc: '"Qual é minha ONE Thing hoje?"', width: 'w-2/6' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Target size={16} className="text-white" />
            </div>
            <span className="font-semibold text-white">Goal Planner</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-slate-300 hover:text-white text-sm transition-colors"
            >
              Entrar
            </Link>
            <Link
              to="/register"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 rounded-full px-4 py-1.5 mb-8">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-indigo-300 text-sm">Baseado em "A Única Coisa" de Gary Keller</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 text-white">
            Materialize sua{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              estratégia de vida
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl mb-4 max-w-2xl mx-auto">
            Cada ação diária conectada a um propósito maior. Da tarefa de hoje à grande meta de 3 anos.
          </p>

          <div className="bg-slate-800/60 border border-amber-500/30 rounded-2xl p-6 mb-10 max-w-2xl mx-auto">
            <p className="text-amber-400 text-sm font-medium mb-2 flex items-center gap-2 justify-center">
              <Star size={14} className="fill-amber-400" />
              Focusing Question
            </p>
            <p className="text-white text-lg md:text-xl italic">
              "Qual é a <strong>ÚNICA coisa</strong> que posso fazer agora, de tal forma que tudo o mais se torne mais fácil ou desnecessário?"
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3.5 rounded-xl font-medium transition-all"
            >
              Começar agora — é grátis
              <ArrowRight size={18} />
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-slate-300 hover:text-white border border-slate-600 hover:border-slate-400 px-8 py-3.5 rounded-xl font-medium transition-all"
            >
              Ver demo
              <ChevronRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Hierarchy Visualization */}
      <section className="py-20 px-6 bg-slate-800/30">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">A Hierarquia de Metas</h2>
            <p className="text-slate-400">
              Da visão de 3 anos para a ação de hoje. Cada nível se conecta ao anterior criando o efeito dominó.
            </p>
          </div>

          <div className="space-y-3">
            {hierarchy.map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`${item.width} flex items-center gap-4 ${item.color} bg-opacity-20 border border-white/10 rounded-xl p-4 transition-all hover:border-white/20`}
                  style={{ background: `${item.color.replace('bg-', '').includes('indigo') ? 'rgba(79,70,229,0.15)' : item.color.replace('bg-', '').includes('violet') ? 'rgba(124,58,237,0.15)' : item.color.replace('bg-', '').includes('cyan') ? 'rgba(8,145,178,0.15)' : item.color.replace('bg-', '').includes('emerald') ? 'rgba(5,150,105,0.15)' : 'rgba(245,158,11,0.15)'}` }}
                >
                  <div className={`${item.color} w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-white`}>
                    {item.level}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium">{item.label}</span>
                      <span className="text-slate-400 text-sm">· {item.period}</span>
                    </div>
                    <p className="text-slate-400 text-sm truncate">{item.desc}</p>
                  </div>
                </div>
                {i < hierarchy.length - 1 && (
                  <div className="text-slate-600 text-lg flex-1 flex items-center">
                    <div className="h-8 w-px bg-slate-600 ml-5" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-white mb-4">Tudo que você precisa para focar no que importa</h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Uma metodologia comprovada traduzida em uma ferramenta prática para uso diário.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 hover:border-slate-600 transition-all"
              >
                <div className="w-11 h-11 bg-slate-700/60 rounded-xl flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/60 border border-indigo-500/30 rounded-3xl p-12">
            <Target size={40} className="text-indigo-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Qual é a sua Única Coisa?
            </h2>
            <p className="text-slate-300 mb-8">
              Comece hoje. Defina suas grandes metas, crie sua hierarquia e descubra a única ação que muda tudo.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-medium transition-all text-lg"
            >
              Começar minha jornada
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center">
        <p className="text-slate-500 text-sm">
          © 2026 Goal Planner · Baseado na metodologia de Gary Keller
        </p>
      </footer>
    </div>
  );
}
