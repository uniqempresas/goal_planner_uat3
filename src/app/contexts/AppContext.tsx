import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { areasService } from '../../services/areasService';
import { metasService, type MetaNivel } from '../../services/metasService';
import { tarefasService } from '../../services/tarefasService';
import { habitosService } from '../../services/habitosService';
import { recorrenciaService } from '../../services/recorrenciaService';
import type { Database } from '../../lib/supabase';
import { mapTarefasToUI, mapTarefaToUI, type TarefaUI } from '../../lib/mapeamento';

type User = {
  id: string;
  email: string;
  name: string;
} | null;

type Area = Database['public']['Tables']['areas']['Row'];
type Meta = Database['public']['Tables']['metas']['Row'];
type Tarefa = Database['public']['Tables']['tarefas']['Row'];
type Habito = Database['public']['Tables']['habitos']['Row'];

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

  tarefasHoje: TarefaUI[];
  loadTarefas: (data?: string) => Promise<void>;
  toggleTarefa: (id: string) => Promise<void>;
  createTarefa: (tarefa: Omit<Tarefa, 'id' | 'user_id' | 'created_at'>) => Promise<Tarefa>;
  updateTarefa: (id: string, tarefa: Partial<Tarefa>) => Promise<Tarefa>;
  deleteTarefa: (id: string) => Promise<void>;

  habitosHoje: Habito[];
  loadHabitos: () => Promise<void>;
  toggleHabitoStreak: (id: string) => Promise<void>;

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
  const [tarefasHoje, setTarefasHoje] = useState<TarefaUI[]>([]);
  const [habitosHoje, setHabitosHoje] = useState<Habito[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({
    tarefasTotal: 0,
    tarefasConcluidas: 0,
    metasConcluidas: 0,
    sequenciaDias: 0,
    produtividade: 0,
  });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Calcular weeklyStats dinamicamente baseado nas tarefasHoje
  useEffect(() => {
    const total = tarefasHoje.length;
    const concluidas = tarefasHoje.filter(t => t.completed).length;
    const produtividade = total > 0 ? Math.round((concluidas / total) * 100) : 0;
    
    // Para sequenciaDias, usar um valor baseado no histórico ou mock por enquanto
    // TODO: Implementar cálculo real de sequência baseado no histórico de tarefas
    const sequenciaDias = concluidas > 0 ? Math.floor(Math.random() * 5) + 1 : 0; // Mock temporário
    
    setWeeklyStats({
      tarefasTotal: total,
      tarefasConcluidas: concluidas,
      metasConcluidas: 0, // TODO: calcular metas concluídas
      sequenciaDias,
      produtividade,
    });
  }, [tarefasHoje]);

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
      // Usar data local (não UTC) para evitar problemas de fuso horário
      const hojeLocal = new Date();
      const dataLocal = `${hojeLocal.getFullYear()}-${String(hojeLocal.getMonth() + 1).padStart(2, '0')}-${String(hojeLocal.getDate()).padStart(2, '0')}`;
      const dataParam = data || dataLocal;
      
      // Carregar tarefas normais (excluindo templates)
      const tarefasNormais = await tarefasService.getTarefasDoDia(user.id, dataParam);
      
      // Carregar instâncias de recorrentes
      const instanciasRecorrentes = await tarefasService.getInstanciasRecorrentesDoDia(user.id, dataParam);
      
      // Combinar tarefas removendo duplicatas (baseado no ID)
      const tarefasMap = new Map<string, Tarefa>();
      [...tarefasNormais, ...instanciasRecorrentes].forEach(tarefa => {
        tarefasMap.set(tarefa.id, tarefa);
      });
      const todasTarefas = Array.from(tarefasMap.values());
      
      // Mapear para UI
      const tarefasMapeadas = mapTarefasToUI(todasTarefas);
      setTarefasHoje(tarefasMapeadas);
      
      // Lazy loading: verificar se precisa gerar mais instâncias
      const templates = await tarefasService.getTemplatesAtivos(user.id);
      for (const template of templates) {
        try {
          await recorrenciaService.verificarEGerarNovasInstancias(template.id);
        } catch (err) {
          console.error(`[AppContext] Erro ao verificar instâncias do template ${template.id}:`, err);
        }
      }
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
    }
  }, [user]);

  const loadHabitos = useCallback(async () => {
    if (!user) return;
    try {
      await habitosService.verificarExpirados(user.id);
      const habitos = await habitosService.getAtivosHoje(user.id);
      setHabitosHoje(habitos);
    } catch (error) {
      console.error('Erro ao carregar hábitos:', error);
    }
  }, [user]);

  const createTarefa = useCallback(async (tarefa: Omit<Tarefa, 'id' | 'user_id' | 'created_at'>) => {
    if (!user) throw new Error('Usuário não autenticado');
    const newTarefa = await tarefasService.create(user.id, tarefa);
    const tarefaMapeada = mapTarefaToUI(newTarefa);
    setTarefasHoje(prev => [...prev, tarefaMapeada]);
    return newTarefa;
  }, [user]);

  const toggleTarefa = useCallback(async (id: string) => {
    const updated = await tarefasService.toggleCompleted(id);
    const tarefaMapeada = mapTarefaToUI(updated);
    setTarefasHoje(prev => prev.map(t => t.id === id ? tarefaMapeada : t));
  }, []);

  const toggleHabitoStreak = useCallback(async (id: string) => {
    try {
      await habitosService.toggleStreak(id);
      
      // Atualizar o estado local diretamente para refletir a mudança imediatamente
      // Usar data local (não UTC) para evitar problemas de fuso horário
      const hojeObj = new Date();
      const hoje = `${hojeObj.getFullYear()}-${String(hojeObj.getMonth() + 1).padStart(2, '0')}-${String(hojeObj.getDate()).padStart(2, '0')}`;
      setHabitosHoje(prev => prev.map(h => {
        if (h.id === id) {
          return {
            ...h,
            ultima_conclusao: h.ultima_conclusao === hoje ? null : hoje,
            streak_atual: h.ultima_conclusao === hoje 
              ? Math.max(0, h.streak_atual - 1) 
              : h.streak_atual + 1
          };
        }
        return h;
      }));
      
      // Também recarrega para garantir consistência com o banco
      loadHabitos();
    } catch (error) {
      console.error('Erro ao atualizar streak:', error);
    }
  }, [loadHabitos]);

  const updateTarefa = useCallback(async (id: string, tarefa: Partial<Tarefa>) => {
    const updated = await tarefasService.update(id, tarefa);
    const tarefaMapeada = mapTarefaToUI(updated);
    setTarefasHoje(prev => prev.map(t => t.id === id ? tarefaMapeada : t));
    return updated;
  }, []);

  const deleteTarefa = useCallback(async (id: string) => {
    await tarefasService.delete(id);
    setTarefasHoje(prev => prev.filter(t => t.id !== id));
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
    setHabitosHoje([]);
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
      loadHabitos();
    }
  }, [user, loadAreas, loadMetas, loadTarefas, loadHabitos]);

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
      updateTarefa,
      deleteTarefa,
      habitosHoje,
      loadHabitos,
      toggleHabitoStreak,
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
