import { useState } from 'react';

export default function ConfiguracoesGeralPage() {
  const [startOfWeek, setStartOfWeek] = useState('segunda');
  const [theme, setTheme] = useState('light');
  const [focusMode, setFocusMode] = useState(true);
  const [dailyReminder, setDailyReminder] = useState('08:00');

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">
      <h2 className="text-slate-800">Configurações Gerais</h2>

      <div>
        <label className="block text-slate-600 text-sm mb-2">Início da semana</label>
        <select
          value={startOfWeek}
          onChange={e => setStartOfWeek(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 cursor-pointer"
        >
          <option value="segunda">Segunda-feira</option>
          <option value="domingo">Domingo</option>
        </select>
      </div>

      <div>
        <label className="block text-slate-600 text-sm mb-2">Horário do lembrete diário</label>
        <input
          type="time"
          value={dailyReminder}
          onChange={e => setDailyReminder(e.target.value)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:border-indigo-400"
        />
        <p className="text-slate-400 text-xs mt-1">Lembrete para definir sua ONE Thing do dia</p>
      </div>

      <div className="flex items-center justify-between py-3 border-b border-slate-100">
        <div>
          <p className="text-slate-700 text-sm font-medium">Modo Foco</p>
          <p className="text-slate-400 text-xs">Esconde distrações durante a ONE Thing</p>
        </div>
        <button
          onClick={() => setFocusMode(f => !f)}
          className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${focusMode ? 'bg-indigo-600' : 'bg-slate-200'}`}
        >
          <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${focusMode ? 'left-6' : 'left-1'}`} />
        </button>
      </div>

      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
        Salvar configurações
      </button>
    </div>
  );
}
