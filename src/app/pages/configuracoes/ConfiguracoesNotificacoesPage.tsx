import { useState } from 'react';

const notifs = [
  { id: 'n1', label: 'Lembrete da ONE Thing', desc: 'Notificação diária para definir sua prioridade', default: true },
  { id: 'n2', label: 'Check-in de hábitos', desc: 'Lembrete para marcar seus hábitos diários', default: true },
  { id: 'n3', label: 'Revisão semanal', desc: 'Lembrete toda segunda-feira para fazer a revisão', default: true },
  { id: 'n4', label: 'Revisão mensal', desc: 'Lembrete no último dia do mês', default: false },
  { id: 'n5', label: 'Metas com prazo próximo', desc: 'Aviso quando uma meta estiver próxima do prazo', default: true },
  { id: 'n6', label: 'Conquistas desbloqueadas', desc: 'Notificação ao desbloquear uma conquista', default: true },
];

export default function ConfiguracoesNotificacoesPage() {
  const [enabled, setEnabled] = useState<Set<string>>(
    new Set(notifs.filter(n => n.default).map(n => n.id))
  );

  const toggle = (id: string) => setEnabled(prev => {
    const n = new Set(prev);
    n.has(id) ? n.delete(id) : n.add(id);
    return n;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-slate-800 mb-2">Notificações</h2>
      <p className="text-slate-500 text-sm mb-6">Escolha quais lembretes você quer receber.</p>

      <div className="space-y-4">
        {notifs.map(notif => (
          <div key={notif.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div>
              <p className="text-slate-700 text-sm font-medium">{notif.label}</p>
              <p className="text-slate-400 text-xs mt-0.5">{notif.desc}</p>
            </div>
            <button
              onClick={() => toggle(notif.id)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${enabled.has(notif.id) ? 'bg-indigo-600' : 'bg-slate-200'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${enabled.has(notif.id) ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        ))}
      </div>

      <button className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
        Salvar preferências
      </button>
    </div>
  );
}
