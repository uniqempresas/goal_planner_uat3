import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { areasService } from '../../services/areasService';
import { metasService, type MetaNivel } from '../../services/metasService';
import { tarefasService } from '../../services/tarefasService';
import type { Database } from '../../lib/supabase';

type User = {
  id: string;
  email: string;
  name: string;
} | null;

interface Area extends Database['public']['Tables']['areas']['Row'] {}
interface Meta extends Database['public']['Tables']['metas']['Row'] {}
interface Tarefa extends Database['public']['Tables']['tarefas']['Row'] {}

interface WeeklyStats {
  tarefasTotal: number;
  tarefasConcluidas: number;
  metasConcluidas: number;
  sequenciaDias: number;
  produtividade: number;
}

interface AppContextType {
  isAuthenticated: boolean;
  user: User;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;

  areas: Area[];
  loadAreas: () => Promise<void>;
  createArea: (area: Omit<Area, 'id' | 'user_id' | 'created_at'>) => Promise<Area>;
  updateArea: (id: string, area: Partial<Area>) => Promise<Area>;
  deleteArea: (id: string) => Promise<void>;

  grandesMetas: Meta[];
  metasAnuais: Meta[];
  metasMensais: Meta[];
  metasSemanais: Meta[];
  metasDiarias: Meta[];
  loadMetas: () => Promise<void>;
  getMetaById: (id: string) => Meta | undefined;

  tarefasHoje: Tarefa[];
  loadTarefas: (data?: string) => Promise<void>;
  toggleTarefa: (id: string) => Promise<void>;
  createTarefa: (tarefa: Omit<Tarefa, 'id' | 'user_id' | 'created_at'>) => Promise<Tarefa>;

  weeklyStats: WeeklyStats;
  getAreaById: (id: string) => Area | undefined;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const [areas, setAreas] = useState<Area[]>([]);
  const [grandesMetas, setGrandesMetas] = useState<Meta[]>([]);
  const [metasAnuais, setMetasAnuais] = useState<Meta[]>([]);
  const [metasMensais, setMetasMensais] = useState<Meta[]>([]);
  const [metasSemanais, setMetasSemanais] = useState<Meta[]>([]);
  const [metasDiarias, setMetasDiarias] = useState<Meta[]>([]);
  const [tarefasHoje, setTarefasHoje] = useState<Tarefa[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    tarefasTotal: 0,
    tarefasConcluidas: 0,
    metasConcluidas: 0,
    sequenciaDias: 0,
    produtividade: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const loadAreas = useCallback(async () => {
    if (!user) return;
    try {
      const data = await areasService.getAll(user.id);
      setAreas(data);
    } catch (error) {
      console.error('Erro ao carregar áreas:', error);
    }
  }, [user]);

  const createArea = useCallback(async (area: Omit<Area, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    const newArea = await areasService.create(user.id, area);
    setAreas(prev => [newArea, ...prev]);
    return newArea;
  }, [user]);

  const updateArea = useCallback(async (id: string, area: Partial<Area>) => {
    const updated = await areasService.update(id, area);
    setAreas(prev => prev.map(a => a.id === id ? updated : a));
    return updated;
  }, []);

  const deleteArea = useCallback(async (id: string) => {
    await areasService.delete(id);
    setAreas(prev => prev.filter(a => a.id !== id));
  }, []);

  const loadMetas = useCallback(async () => {
    if (!user) return;
    try {
      const [grandes, anual, mensal, semanal, diaria] = await Promise.all([
        metasService.getByNivel(user.id, 'grande'),
        metasService.getByNivel(user.id, 'anual'),
        metasService.getByNivel(user.id, 'mensal'),
        metasService.getByNivel(user.id, 'semanal'),
        metasService.getByNivel(user.id, 'diaria'),
      ]);
      setGrandesMetas(grandes);
      setMetasAnuais(anual);
      setMetasMensais(mensal);
      setMetasSemanais(semanal);
      setMetasDiarias(diaria);
    } catch (error) {
      console.error('Erro ao carregar metas:', error);
    }
  }, [user]);

  const loadTarefas = useCallback(async (data?: string) => {
    if (!user) return;
    try {
      const dataParam = data || new Date().toISOString().split('T')[0];
      const tarefas = await tarefasService.getByData(user.id, dataParam);
      setTarefasHoje(tarefas);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }, [user]);

  const createTarefa = useCallback(async (tarefa: Omit<Tarefa, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    const newTarefa = await tarefasService.create(user.id, tarefa);
    setTarefasHoje(prev => [...prev, newTarefa]);
    return newTarefa;
  }, [user]);

  const toggleTarefa = useCallback(async (id: string) => {
    const updated = await tarefasService.toggleCompleted(id);
    setTarefasHoje(prev => prev.map(t => t.id === id ? updated : t));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    setUser({
      id: data.user.id,
      email: data.user.email || '',
      name: data.user.user_metadata?.name || email.split('@')[0],
    });
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAuthenticated(false);
    setAreas([]);
    setGrandesMetas([]);
    setMetasAnuais([]);
    setMetasMensais([]);
    setMetasSemanais([]);
    setMetasDiarias([]);
    setTarefasHoje([]);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });
    if (error) throw error;
    if (data.user) {
      setUser({
        id: data.user.id,
        email: data.user.email || '',
        name: name || email.split('@')[0],
      });
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
        });
        setIsAuthenticated(true);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
        });
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadAreas();
      loadMetas();
      loadTarefas();
    }
  }, [user, loadAreas, loadMetas, loadTarefas]);

  const allMetas = [...grandesMetas, ...metasAnuais, ...metasMensais, ...metasSemanais, ...metasDiarias];
  const getMetaById = (id: string) => allMetas.find(m => m.id === id);
  const getAreaById = (id: string) => areas.find(a => a.id === id);

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      user,
      loading,
      login,
      logout,
      register,
      areas,
      loadAreas,
      createArea,
      updateArea,
      deleteArea,
      grandesMetas,
      metasAnuais,
      metasMensais,
      metasSemanais,
      metasDiarias,
      loadMetas,
      getMetaById,
      tarefasHoje,
      loadTarefas,
      toggleTarefa,
      createTarefa,
      weeklyStats,
      getAreaById,
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