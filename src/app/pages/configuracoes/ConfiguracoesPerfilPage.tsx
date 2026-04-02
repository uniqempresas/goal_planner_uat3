import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Camera } from 'lucide-react';

export default function ConfiguracoesPerfilPage() {
  const { user } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [bio, setBio] = useState('Focado em construir uma vida estratégica baseada em "A Única Coisa".');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-slate-800 mb-6">Informações do Perfil</h2>

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-600 transition-colors cursor-pointer">
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="text-slate-700 text-sm font-medium">{user.name}</p>
          <p className="text-slate-400 text-xs mt-0.5">{user.email}</p>
          <p className="text-slate-400 text-xs mt-0.5">Membro desde {new Date(user.joinedAt).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        <div>
          <label className="block text-slate-600 text-sm mb-1.5">Nome completo</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-1.5">E-mail</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {saved ? '✓ Salvo!' : 'Salvar alterações'}
          </button>
        </div>
      </form>
    </div>
  );
}
