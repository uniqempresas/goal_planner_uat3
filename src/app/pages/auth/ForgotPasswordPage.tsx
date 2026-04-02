import { useState } from 'react';
import { Link } from 'react-router';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    setLoading(false);
    setSent(true);
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Recuperar senha</h1>
        <p className="text-slate-400">Enviaremos um link de redefinição para seu e-mail</p>
      </div>

      <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-8">
        {sent ? (
          <div className="text-center py-4">
            <CheckCircle2 size={40} className="text-emerald-400 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">E-mail enviado!</h3>
            <p className="text-slate-400 text-sm mb-6">Verifique sua caixa de entrada e siga as instruções.</p>
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 text-sm transition-colors">
              Voltar ao login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm mb-2">E-mail cadastrado</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-700/50 border border-slate-600 text-white placeholder-slate-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="seu@email.com"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : null}
              {loading ? 'Enviando...' : 'Enviar link de recuperação'}
            </button>
          </form>
        )}
      </div>

      <p className="text-center text-slate-400 text-sm mt-6">
        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 transition-colors">
          ← Voltar ao login
        </Link>
      </p>
    </div>
  );
}
