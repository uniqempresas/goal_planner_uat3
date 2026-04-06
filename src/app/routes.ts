import { createBrowserRouter, redirect } from 'react-router';

// Lazy-loaded layouts
import { AppLayout } from './layouts/AppLayout';
import { AuthLayout } from './layouts/AuthLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

import DashboardPage from './pages/DashboardPage';
import AreasListPage from './pages/areas/AreasListPage';
import AreaDetailPage from './pages/areas/AreaDetailPage';
import AreaEditPage from './pages/areas/AreaEditPage';

import GrandesMetasPage from './pages/metas/GrandesMetasPage';
import MetasAnuaisPage from './pages/metas/MetasAnuaisPage';
import MetasMensaisPage from './pages/metas/MetasMensaisPage';
import MetasSemanaisPage from './pages/metas/MetasSemanaisPage';
import MetasDiariasPage from './pages/metas/MetasDiariasPage';

import AgendaHojePage from './pages/agenda/AgendaHojePage';
import AgendaSemanaPage from './pages/agenda/AgendaSemanaPage';

import TemplatesListPage from './pages/templates/TemplatesListPage';
import ConquistasPage from './pages/ConquistasPage';
import RevisaoSemanalPage from './pages/revisoes/RevisaoSemanalPage';
import RevisaoMensalPage from './pages/revisoes/RevisaoMensalPage';
import ConfiguracoesPage from './pages/configuracoes/ConfiguracoesPage';
import ConfiguracoesPerfilPage from './pages/configuracoes/ConfiguracoesPerfilPage';
import ConfiguracoesGeralPage from './pages/configuracoes/ConfiguracoesGeralPage';
import ConfiguracoesSegurancaPage from './pages/configuracoes/ConfiguracoesSegurancaPage';
import ConfiguracoesNotificacoesPage from './pages/configuracoes/ConfiguracoesNotificacoesPage';

import PlaceholderPage from './pages/PlaceholderPage';

export const router = createBrowserRouter([
  // Public routes
  {
    path: '/',
    Component: LandingPage,
  },
  {
    Component: AuthLayout,
    children: [
      { path: '/login', Component: LoginPage },
      { path: '/register', Component: RegisterPage },
      { path: '/forgot-password', Component: ForgotPasswordPage },
    ],
  },

  // Protected routes (app layout)
  {
    Component: AppLayout,
    children: [
      { path: '/dashboard', Component: DashboardPage },

      // Áreas
      { path: '/areas', Component: AreasListPage },
      { path: '/areas/:id', Component: AreaDetailPage },
      { path: '/areas/:id/edit', Component: AreaEditPage },

      // Metas
      { path: '/metas', loader: () => redirect('/metas/grandes') },
      { path: '/metas/grandes', Component: GrandesMetasPage },
      { path: '/metas/grandes/criar', Component: PlaceholderPage },
      { path: '/metas/grandes/:id', Component: PlaceholderPage },
      { path: '/metas/grandes/:id/editar', Component: PlaceholderPage },

      { path: '/metas/anual', Component: MetasAnuaisPage },
      { path: '/metas/anual/criar', Component: PlaceholderPage },
      { path: '/metas/anual/:id', Component: PlaceholderPage },
      { path: '/metas/anual/:id/editar', Component: PlaceholderPage },

      { path: '/metas/mensal', Component: MetasMensaisPage },
      { path: '/metas/mensal/criar', Component: PlaceholderPage },
      { path: '/metas/mensal/:id', Component: PlaceholderPage },
      { path: '/metas/mensal/:id/editar', Component: PlaceholderPage },

      { path: '/metas/semanal', Component: MetasSemanaisPage },
      { path: '/metas/semanal/criar', Component: PlaceholderPage },
      { path: '/metas/semanal/:id', Component: PlaceholderPage },
      { path: '/metas/semanal/:id/editar', Component: PlaceholderPage },

      { path: '/metas/diaria', Component: MetasDiariasPage },
      { path: '/metas/diaria/criar', Component: PlaceholderPage },
      { path: '/metas/diaria/:id', Component: PlaceholderPage },
      { path: '/metas/diaria/:id/editar', Component: PlaceholderPage },

      // Agenda
      { path: '/agenda', loader: () => redirect('/agenda/hoje') },
      { path: '/agenda/hoje', Component: AgendaHojePage },
      { path: '/agenda/semana', Component: AgendaSemanaPage },
      { path: '/agenda/tarefas/criar', Component: PlaceholderPage },
      { path: '/agenda/tarefas/:id/editar', Component: PlaceholderPage },

      // Templates
      { path: '/templates', Component: TemplatesListPage },
      { path: '/templates/:id', Component: PlaceholderPage },

      // Revisões
      { path: '/revisoes', loader: () => redirect('/revisoes/semanal') },
      { path: '/revisoes/semanal', Component: RevisaoSemanalPage },
      { path: '/revisoes/mensal', Component: RevisaoMensalPage },

      // Conquistas
      { path: '/conquistas', Component: ConquistasPage },

      // Configurações
      {
        path: '/configuracoes',
        Component: ConfiguracoesPage,
        children: [
          { index: true, loader: () => redirect('/configuracoes/perfil') },
          { path: 'perfil', Component: ConfiguracoesPerfilPage },
          { path: 'geral', Component: ConfiguracoesGeralPage },
          { path: 'seguranca', Component: ConfiguracoesSegurancaPage },
          { path: 'notificacoes', Component: ConfiguracoesNotificacoesPage },
        ],
      },
    ],
  },
]);
