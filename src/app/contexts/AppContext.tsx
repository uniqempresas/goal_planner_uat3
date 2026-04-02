import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  mockUser,
  mockAreas,
  mockGrandesMetas,
  mockMetasAnuais,
  mockMetasMensais,
  mockMetasSemanais,
  mockMetasDiarias,
  mockTarefasHoje,
  mockWeeklyStats,
  type User,
  type Area,
  type Meta,
  type Tarefa,
  type WeeklyStats,
} from '../data/mockData';

interface AppContextType {
  // Auth
  isAuthenticated: boolean;
  user: User;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;

  // Areas
  areas: Area[];

  // Metas
  grandesMetas: Meta[];
  metasAnuais: Meta[];
  metasMensais: Meta[];
  metasSemanais: Meta[];
  metasDiarias: Meta[];
  getMetaById: (id: string) => Meta | undefined;
  getAreaById: (id: string) => Area | undefined;

  // Tarefas
  tarefasHoje: Tarefa[];
  toggleTarefa: (id: string) => void;

  // Stats
  weeklyStats: WeeklyStats;

  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Default to authenticated for demo
  const [user] = useState<User>(mockUser);
  const [areas] = useState<Area[]>(mockAreas);
  const [grandesMetas] = useState<Meta[]>(mockGrandesMetas);
  const [metasAnuais] = useState<Meta[]>(mockMetasAnuais);
  const [metasMensais] = useState<Meta[]>(mockMetasMensais);
  const [metasSemanais] = useState<Meta[]>(mockMetasSemanais);
  const [metasDiarias] = useState<Meta[]>(mockMetasDiarias);
  const [tarefasHoje, setTarefasHoje] = useState<Tarefa[]>(mockTarefasHoje);
  const [weeklyStats] = useState<WeeklyStats>(mockWeeklyStats);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const login = useCallback(async (_email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  const register = useCallback(async (_name: string, _email: string, _password: string) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsAuthenticated(true);
  }, []);

  const toggleTarefa = useCallback((id: string) => {
    setTarefasHoje(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    );
  }, []);

  const allMetas = [...grandesMetas, ...metasAnuais, ...metasMensais, ...metasSemanais, ...metasDiarias];
  const getMetaById = (id: string) => allMetas.find(m => m.id === id);
  const getAreaById = (id: string) => areas.find(a => a.id === id);

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      register,
      areas,
      grandesMetas,
      metasAnuais,
      metasMensais,
      metasSemanais,
      metasDiarias,
      getMetaById,
      getAreaById,
      tarefasHoje,
      toggleTarefa,
      weeklyStats,
      sidebarOpen,
      setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
