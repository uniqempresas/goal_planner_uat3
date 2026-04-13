import { Mountain, Calendar, CalendarDays, CalendarCheck, CheckSquare } from 'lucide-react';
import type { MetaNivel, MetaStatus } from '../types';

export const levelIcons: Record<MetaNivel, typeof Mountain> = {
  'grande': Mountain,
  'anual': Calendar,
  'mensal': CalendarDays,
  'semanal': CalendarCheck,
  'diaria': CheckSquare,
};

export const levelLabels: Record<MetaNivel, string> = {
  'grande': 'Grande Meta',
  'anual': 'Meta Anual',
  'mensal': 'Meta Mensal',
  'semanal': 'Meta Semanal',
  'diaria': 'Meta Diária',
};

export const levelColors: Record<MetaNivel, { bg: string; text: string; border: string; icon: string }> = {
  'grande': { 
    bg: 'bg-violet-50', 
    text: 'text-violet-700', 
    border: 'border-violet-200',
    icon: 'text-violet-600'
  },
  'anual': { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    border: 'border-blue-200',
    icon: 'text-blue-600'
  },
  'mensal': { 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    border: 'border-emerald-200',
    icon: 'text-emerald-600'
  },
  'semanal': { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    border: 'border-amber-200',
    icon: 'text-amber-600'
  },
  'diaria': { 
    bg: 'bg-rose-50', 
    text: 'text-rose-700', 
    border: 'border-rose-200',
    icon: 'text-rose-600'
  },
};

export const statusColors: Record<MetaStatus, { bg: string; text: string; bar: string; badge: string }> = {
  'ativa': { 
    bg: 'bg-emerald-50', 
    text: 'text-emerald-700', 
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 border-emerald-200'
  },
  'atrasada': { 
    bg: 'bg-amber-50', 
    text: 'text-amber-700', 
    bar: 'bg-amber-500',
    badge: 'bg-amber-100 text-amber-700 border-amber-200'
  },
  'critica': { 
    bg: 'bg-red-50', 
    text: 'text-red-700', 
    bar: 'bg-red-500',
    badge: 'bg-red-100 text-red-700 border-red-200'
  },
  'concluida': { 
    bg: 'bg-slate-50', 
    text: 'text-slate-600', 
    bar: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-600 border-slate-200'
  },
  'backlog': { 
    bg: 'bg-blue-50', 
    text: 'text-blue-700', 
    bar: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 border-blue-200'
  },
};

export const statusLabels: Record<MetaStatus, string> = {
  'ativa': 'Em dia',
  'atrasada': 'Atrasada',
  'critica': 'Crítica',
  'concluida': 'Concluída',
  'backlog': 'Backlog',
};

export const filterTabs = [
  { key: 'ativas', label: 'Ativas', color: 'text-emerald-600' },
  { key: 'concluidas', label: 'Concluídas', color: 'text-slate-600' },
  { key: 'atrasadas', label: 'Atrasadas', color: 'text-amber-600' },
  { key: 'todas', label: 'Todas', color: 'text-indigo-600' },
] as const;
