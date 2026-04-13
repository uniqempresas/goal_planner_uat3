import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Calendar, LayoutDashboard } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { pageTransition } from '../components/metas/animations';
import {
  OneThingBanner,
  DashboardStats,
  GrandesMetasWidget,
  AreasWidget,
  MetasAnuaisWidget,
  DashboardEmptyState,
  FocusingQuestionCard,
} from '../components/dashboard';

export default function DashboardPage() {
  const { user } = useApp();

  // Format date
  const today = new Date();
  const todayFormatted = today.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <motion.div
      variants={pageTransition}
      initial="hidden"
      animate="visible"
      className="min-h-screen bg-slate-50"
    >
      {/* Sticky Header */}
      <motion.header
        className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-200"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Logo + Greeting */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <LayoutDashboard size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-slate-800 text-xl font-bold">
                  Olá, {user?.name?.split(' ')[0] ?? 'Visitante'} 👋
                </h1>
                <p className="text-slate-500 text-sm capitalize">
                  {todayFormatted}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Link
                to="/agenda/hoje"
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:shadow-lg hover:shadow-indigo-600/30"
              >
                <Calendar size={16} />
                Ver Agenda de Hoje
              </Link>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* ONE Thing Banner */}
        <OneThingBanner />

        {/* Stats Cards */}
        <DashboardStats />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Grandes Metas */}
          <div className="lg:col-span-2">
            <GrandesMetasWidget />
          </div>

          {/* Right Column - Widgets */}
          <div className="space-y-5">
            {/* Áreas de Vida */}
            <AreasWidget />

            {/* Metas Anuais */}
            <MetasAnuaisWidget />

            {/* Focusing Question */}
            <FocusingQuestionCard />
          </div>
        </div>
      </main>
    </motion.div>
  );
}