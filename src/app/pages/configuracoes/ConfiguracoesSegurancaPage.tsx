import { useState } from 'react';
import { Eye, EyeOff, Save, CheckCircle2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function ConfiguracoesSegurancaPage() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!current || !newPass || !confirm) {
      setError('Preencha todos os campos');
      return;
    }

    if (newPass.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (newPass !== confirm) {
      setError('As senhas não coincidem');
      return;
    }

    setSaving(true);

    try {
      // Atualizar senha no Supabase
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPass
      });

      if (updateError) throw updateError;

      setSaved(true);
      setCurrent('');
      setNewPass('');
      setConfirm('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error('Erro ao alterar senha:', err);
      setError(err.message || 'Erro ao alterar senha. Verifique sua senha atual.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-slate-800 mb-6">Segurança</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {saved && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm flex items-center gap-2">
          <CheckCircle2 size={16} />
          Senha alterada com sucesso!
        </div>
      )}

      <form className="space-y-5 max-w-sm" onSubmit={handleSubmit}>
        <div>
          <label className="block text-slate-600 text-sm mb-1.5">Senha atual</label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={current}
              onChange={e => setCurrent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 pr-10 focus:outline-none focus:border-indigo-400 transition-colors"
              placeholder="Digite sua senha atual"
            />
            <button 
              type="button" 
              onClick={() => setShow(s => !s)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600"
            >
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
            placeholder="Mínimo 6 caracteres"
          />
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-1.5">Confirmar nova senha</label>
          <input
            type="password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
            placeholder="Digite novamente a nova senha"
          />
        </div>

        <button 
          type="submit" 
          disabled={saving}
          className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Alterando...
            </>
          ) : (
            <>
              <Save size={16} />
              Alterar senha
            </>
          )}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <h3 className="text-slate-700 text-sm font-medium mb-3">Sessões ativas</h3>
        <p className="text-slate-500 text-sm">
          Você está atualmente logado neste dispositivo.
        </p>
        <button 
          onClick={async () => {
            await supabase.auth.signOut({ scope: 'global' });
            window.location.href = '/login';
          }}
          className="mt-3 text-red-600 hover:text-red-700 text-sm font-medium"
        >
          Encerrar todas as sessões
        </button>
      </div>
    </div>
  );
}
