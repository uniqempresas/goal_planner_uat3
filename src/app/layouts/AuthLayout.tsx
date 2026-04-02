import { Outlet, Link } from 'react-router';
import { Target } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-9 h-9 bg-indigo-500 rounded-xl flex items-center justify-center">
            <Target size={18} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg">Goal Planner</span>
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-slate-500 text-sm">
          "Você não pode realizar o extraordinário sem foco extraordinário."
        </p>
        <p className="text-slate-600 text-xs mt-1">— Gary Keller, A Única Coisa</p>
      </footer>
    </div>
  );
}
