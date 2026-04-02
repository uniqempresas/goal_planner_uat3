import { useLocation, Link } from 'react-router';
import { Construction, ArrowLeft } from 'lucide-react';

export default function PlaceholderPage({ title }: { title?: string }) {
  const location = useLocation();
  const pageTitle = title || location.pathname.split('/').pop()?.replace(/-/g, ' ') || 'Página';

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
      <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-5">
        <Construction size={28} className="text-indigo-500" />
      </div>
      <h2 className="text-slate-700 mb-2 capitalize">{pageTitle}</h2>
      <p className="text-slate-400 text-sm max-w-xs mb-6">
        Esta página está sendo construída. Em breve estará disponível com todas as funcionalidades.
      </p>
      <Link
        to={-1 as unknown as string}
        onClick={(e) => { e.preventDefault(); window.history.back(); }}
        className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 text-sm transition-colors cursor-pointer"
      >
        <ArrowLeft size={15} />
        Voltar
      </Link>
    </div>
  );
}
