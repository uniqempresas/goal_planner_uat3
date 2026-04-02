import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function ConfiguracoesSegurancaPage() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-slate-800 mb-6">Segurança</h2>
      <form className="space-y-5 max-w-sm" onSubmit={e => e.preventDefault()}>
        <div>
          <label className="block text-slate-600 text-sm mb-1.5">Senha atual</label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={current}
              onChange={e => setCurrent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 pr-10 focus:outline-none focus:border-indigo-400 transition-colors"
            />
            <button type="button" onClick={() => setShow(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer">
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>
        <div>
          <label className="block text-slate-600 text-sm mb-1.5">Nova senha</label>
          <input
            type="password"
            value={newPass}
            onChange={e => setNewPass(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
            placeholder="Mínimo 8 caracteres"
          />
        </div>
        <div>
          <label className="block text-slate-600 text-sm mb-1.5">Confirmar nova senha</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>
        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer">
          Alterar senha
        </button>
      </form>
    </div>
  );
}
