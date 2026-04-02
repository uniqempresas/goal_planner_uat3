import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router';
import { User, Shield, Settings, Bell } from 'lucide-react';

const tabs = [
  { label: 'Perfil', path: '/configuracoes/perfil', icon: <User size={15} /> },
  { label: 'Segurança', path: '/configuracoes/seguranca', icon: <Shield size={15} /> },
  { label: 'Geral', path: '/configuracoes/geral', icon: <Settings size={15} /> },
  { label: 'Notificações', path: '/configuracoes/notificacoes', icon: <Bell size={15} /> },
];

export default function ConfiguracoesPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-slate-800 mb-1">Configurações</h1>
        <p className="text-slate-500 text-sm">Personalize sua experiência no Goal Planner.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6 overflow-x-auto">
        {tabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-white text-slate-800 shadow-sm font-medium'
                  : 'text-slate-500 hover:text-slate-700'
              }`
            }
          >
            {tab.icon}
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  );
}
