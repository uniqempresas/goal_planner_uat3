import { Outlet, NavLink, useNavigate } from 'react-router';
import {
  LayoutDashboard, Target, Calendar, Trophy, Settings,
  Layers, BookOpen, ClipboardCheck, ChevronDown, ChevronRight,
  Star, LogOut, User as UserIcon, Menu, X, Sun, CalendarRange,
  Mountain, CalendarDays, CalendarCheck, CheckSquare, TrendingUp,
  Eye,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

interface NavGroup {
  title: string;
  icon: React.ReactNode;
  basePath: string;
  children?: { label: string; path: string; icon?: React.ReactNode }[];
}

const navGroups: NavGroup[] = [
  {
    title: 'Dashboard',
    icon: <LayoutDashboard size={18} />,
    basePath: '/dashboard',
  },
  {
    title: 'Áreas de Vida',
    icon: <Layers size={18} />,
    basePath: '/areas',
  },
  {
    title: 'Metas',
    icon: <Target size={18} />,
    basePath: '/metas',
    children: [
      { label: 'Grandes', path: '/metas/grandes', icon: <Mountain size={15} /> },
      { label: 'Anuais', path: '/metas/anuais', icon: <CalendarDays size={15} /> },
      { label: 'Mensais', path: '/metas/mensais', icon: <CalendarCheck size={15} /> },
      { label: 'Semanais', path: '/metas/semanais', icon: <CalendarRange size={15} /> },
      { label: 'Diárias', path: '/metas/diarias', icon: <CheckSquare size={15} /> },
    ],
  },
  {
    title: 'Agenda',
    icon: <Calendar size={18} />,
    basePath: '/agenda',
    children: [
      { label: 'Hoje', path: '/agenda/hoje', icon: <Sun size={15} /> },
      { label: 'Semana', path: '/agenda/semana', icon: <CalendarRange size={15} /> },
      { label: 'Hábitos', path: '/habitos', icon: <Star size={15} /> },
    ],
  },
  {
    title: 'Visão Holística',
    icon: <Eye size={18} />,
    basePath: '/visao-holistica',
  },
  {
    title: 'Templates',
    icon: <BookOpen size={18} />,
    basePath: '/templates',
  },
  {
    title: 'Revisões',
    icon: <ClipboardCheck size={18} />,
    basePath: '/revisoes',
    children: [
      { label: 'Semanal', path: '/revisoes/semanal' },
      { label: 'Mensal', path: '/revisoes/mensal' },
    ],
  },
  {
    title: 'Conquistas',
    icon: <Trophy size={18} />,
    basePath: '/conquistas',
  },
  {
    title: 'Configurações',
    icon: <Settings size={18} />,
    basePath: '/configuracoes',
  },
];

function NavItem({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = !!group.children;

  if (!hasChildren) {
    return (
      <NavLink
        to={group.basePath}
        className={({ isActive }) =>
          `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group cursor-pointer ${
            isActive
              ? 'bg-indigo-600 text-white'
              : 'text-slate-300 hover:bg-slate-700/60 hover:text-white'
          }`
        }
        title={collapsed ? group.title : undefined}
      >
        <span className="shrink-0">{group.icon}</span>
        {!collapsed && <span className="text-sm">{group.title}</span>}
      </NavLink>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-slate-700/60 hover:text-white transition-all duration-150 cursor-pointer"
        title={collapsed ? group.title : undefined}
      >
        <span className="shrink-0">{group.icon}</span>
        {!collapsed && (
          <>
            <span className="text-sm flex-1 text-left">{group.title}</span>
            {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </>
        )}
      </button>

      {!collapsed && expanded && (
        <div className="ml-4 mt-0.5 space-y-0.5 border-l border-slate-700 pl-3">
          {group.children!.map(child => (
            <NavLink
              key={child.path}
              to={child.path}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-indigo-600/80 text-white'
                    : 'text-slate-400 hover:bg-slate-700/40 hover:text-slate-200'
                }`
              }
            >
              {child.icon && <span className="shrink-0">{child.icon}</span>}
              <span>{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

export function AppLayout() {
  const { user, logout, sidebarOpen, setSidebarOpen, loading, isAuthenticated, weeklyStats, tarefasHoje, metasDiarias } = useApp();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const collapsed = !sidebarOpen;

  // Data dinâmica formatada
  const today = new Date();
  const dateFormatted = today.toLocaleDateString('pt-BR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric' 
  });

  // ONE Thing de hoje: busca em tarefas (bloco one-thing) ou metas diárias (one_thing)
  const oneThingTarefa = tarefasHoje.find(t => t.isOneThing);
  const oneThingMeta = metasDiarias.find(m => m.one_thing);
  const oneThingText = oneThingTarefa?.title || oneThingMeta?.titulo || null;

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-500 text-sm">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 p-4 border-b border-slate-700/50 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shrink-0">
          <Target size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div>
            <div className="text-white font-semibold text-sm leading-tight">Goal Planner</div>
            <div className="text-slate-400 text-xs">A Única Coisa</div>
          </div>
        )}
      </div>

      {/* ONE Thing Highlight */}
      {!collapsed && (
        <NavLink
          to="/agenda/hoje"
          className={({ isActive }) =>
            `mx-3 mt-3 p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-lg block transition-colors ${isActive ? 'bg-amber-500/20' : 'hover:bg-amber-500/15'}`
          }
        >
          <div className="flex items-center gap-2 mb-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-amber-400 text-xs font-medium">ONE Thing Hoje</span>
          </div>
          <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
            {oneThingText || 'Nenhuma ONE Thing definida ainda'}
          </p>
        </NavLink>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto mt-2">
        {navGroups.map(group => (
          <NavItem key={group.basePath} group={group} collapsed={collapsed} />
        ))}
      </nav>

      {/* User Profile */}
      <div className={`p-3 border-t border-slate-700/50 ${collapsed ? 'flex justify-center' : ''}`}>
        {collapsed ? (
          <button
            onClick={handleLogout}
            className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-slate-300 hover:text-white"
            title={user?.name || 'Usuário'}
          >
            <UserIcon size={15} />
          </button>
        ) : (
            <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-medium shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">{user?.name || 'Usuário'}</div>
              <div className="text-slate-400 text-xs truncate">{user?.email || ''}</div>
            </div>
            <button
              onClick={handleLogout}
              className="text-slate-400 hover:text-white transition-colors p-1 rounded cursor-pointer"
              title="Sair"
            >
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-slate-900 transition-all duration-300 ease-in-out shrink-0 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-64 bg-slate-900 flex flex-col z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-4 h-14 flex items-center gap-3 shrink-0">
          {/* Desktop collapse toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu size={18} />
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Menu size={18} />
          </button>

          {/* Logo on mobile */}
          <div className="md:hidden flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Target size={14} className="text-white" />
            </div>
            <span className="text-slate-800 font-semibold text-sm">Goal Planner</span>
          </div>

          <div className="flex-1" />

          {/* Header Right */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              <Star size={13} className="text-amber-500 fill-amber-500" />
              <span className="text-amber-700 text-xs font-medium">{weeklyStats?.sequenciaDias || 0} dias seguidos</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600 text-sm">
              <TrendingUp size={15} className="text-indigo-500" />
              <span className="hidden sm:inline text-slate-500 text-xs">{dateFormatted}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
