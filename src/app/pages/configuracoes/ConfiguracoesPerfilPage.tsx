import { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { Camera, Save, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

export default function ConfiguracoesPerfilPage() {
  const { user } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      loadProfile();
    }
  }, [user]);

  async function loadProfile() {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser?.user_metadata?.bio) {
        setBio(authUser.user_metadata.bio);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      // Atualizar nome no metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          name,
          bio 
        }
      });

      if (updateError) throw updateError;

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err: any) {
      console.error('Erro ao salvar perfil:', err);
      setError(err.message || 'Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <p className="text-slate-500">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <h2 className="text-slate-800 mb-6">Informações do Perfil</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
            {name.charAt(0).toUpperCase()}
          </div>
          <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-700 rounded-full flex items-center justify-center text-white hover:bg-slate-600 transition-colors cursor-pointer">
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="text-slate-700 text-sm font-medium">{name}</p>
          <p className="text-slate-400 text-xs mt-0.5">{email}</p>
          <p className="text-slate-400 text-xs mt-0.5">Usuário ativo</p>
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
            disabled
            className="w-full bg-slate-100 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-500 cursor-not-allowed"
          />
          <p className="text-xs text-slate-400 mt-1">O e-mail não pode ser alterado</p>
        </div>

        <div>
          <label className="block text-slate-600 text-sm mb-1.5">Bio</label>
          <textarea
            value={bio}
            onChange={e => setBio(e.target.value)}
            rows={3}
            placeholder="Fale um pouco sobre você..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:border-indigo-400 transition-colors"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={saving}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-2 ${
              saved
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Salvando...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 size={16} />
                Salvo!
              </>
            ) : (
              <>
                <Save size={16} />
                Salvar alterações
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
