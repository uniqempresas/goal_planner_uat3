import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { BookOpen, ArrowRight, Plus, Trash2, CheckCircle2, AlertTriangle } from 'lucide-react';
import { templatesService, type TemplateData } from '../../../services/templatesService';
import { useApp } from '../../contexts/AppContext';
import type { Database } from '../../../lib/supabase';

type Template = Database['public']['Tables']['templates']['Row'];

const templateDefaults: TemplateData[] = [
  {
    nome: 'Rotina Matinal',
    descricao: 'Hábitos matinais para começar o dia com energia',
    estrutura: {
      tipo: 'tarefas',
      itens: [
        { titulo: 'Acordar cedo', bloco: 'manha', prioridade: 'alta' },
        { titulo: 'Meditar 10 minutos', bloco: 'manha', prioridade: 'media' },
        { titulo: 'Tomar café da manhã saudável', bloco: 'manha', prioridade: 'media' },
        { titulo: 'Revisar metas do dia', bloco: 'manha', prioridade: 'alta' },
      ],
    },
  },
  {
    nome: 'Rotina Noturna',
    descricao: 'Hábitos para finalizar o dia com qualidade',
    estrutura: {
      tipo: 'tarefas',
      itens: [
        { titulo: 'Revisar conquistas do dia', bloco: 'noite', prioridade: 'media' },
        { titulo: 'Planejar amanhã', bloco: 'noite', prioridade: 'alta' },
        { titulo: 'Desconectar de telas', bloco: 'noite', prioridade: 'media' },
        { titulo: 'Leitura antes de dormir', bloco: 'noite', prioridade: 'baixa' },
      ],
    },
  },
  {
    nome: 'Dia de Trabalho Focado',
    descricao: 'Estrutura para um dia produtivo de deep work',
    estrutura: {
      tipo: 'tarefas',
      itens: [
        { titulo: 'ONE Thing - Tarefa mais importante', bloco: 'one-thing', prioridade: 'alta' },
        { titulo: 'Reunião de alinhamento', bloco: 'manha', prioridade: 'media' },
        { titulo: 'Bloco de foco profundo', bloco: 'manha', prioridade: 'alta' },
        { titulo: 'Responder emails', bloco: 'tarde', prioridade: 'baixa' },
        { titulo: 'Revisão de entregas', bloco: 'tarde', prioridade: 'media' },
      ],
    },
  },
];

export default function TemplatesListPage() {
  const { user } = useApp();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [aplicando, setAplicando] = useState<string | null>(null);
  const [mensagem, setMensagem] = useState<{ tipo: 'sucesso' | 'erro'; texto: string } | null>(null);
  const [showCriar, setShowCriar] = useState(false);
  const [novoTemplate, setNovoTemplate] = useState<TemplateData>({
    nome: '',
    descricao: '',
    estrutura: { tipo: 'tarefas', itens: [] },
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  async function loadTemplates() {
    try {
      setLoading(true);
      const data = await templatesService.getAll();
      
      // Se não houver templates, criar os padrões
      if (data.length === 0) {
        for (const template of templateDefaults) {
          await templatesService.create(template);
        }
        const templatesCriados = await templatesService.getAll();
        setTemplates(templatesCriados);
      } else {
        setTemplates(data);
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleAplicar(templateId: string) {
    if (!user) {
      setMensagem({ tipo: 'erro', texto: 'Usuário não autenticado' });
      return;
    }
    
    try {
      setAplicando(templateId);
      await templatesService.aplicarTemplate(templateId, user.id);
      setMensagem({ tipo: 'sucesso', texto: 'Template aplicado com sucesso!' });
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      console.error('Erro ao aplicar template:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao aplicar template' });
      setTimeout(() => setMensagem(null), 3000);
    } finally {
      setAplicando(null);
    }
  }

  async function handleDeletar(templateId: string) {
    if (!confirm('Tem certeza que deseja excluir este template?')) return;
    
    try {
      await templatesService.delete(templateId);
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      setMensagem({ tipo: 'sucesso', texto: 'Template excluído!' });
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      console.error('Erro ao excluir template:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao excluir template' });
      setTimeout(() => setMensagem(null), 3000);
    }
  }

  async function handleCriar(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      const criado = await templatesService.create(novoTemplate);
      setTemplates(prev => [...prev, criado]);
      setNovoTemplate({ nome: '', descricao: '', estrutura: { tipo: 'tarefas', itens: [] } });
      setShowCriar(false);
      setMensagem({ tipo: 'sucesso', texto: 'Template criado!' });
      setTimeout(() => setMensagem(null), 3000);
    } catch (error) {
      console.error('Erro ao criar template:', error);
      setMensagem({ tipo: 'erro', texto: 'Erro ao criar template' });
      setTimeout(() => setMensagem(null), 3000);
    }
  }

  function getItemCount(template: Template): number {
    const estrutura = template.estrutura as TemplateData['estrutura'];
    return estrutura?.itens?.length || 0;
  }

  function getTipoLabel(template: Template): string {
    const estrutura = template.estrutura as TemplateData['estrutura'];
    const tipos: Record<string, string> = {
      tarefas: 'Tarefas',
      metas: 'Metas',
      habitos: 'Hábitos',
    };
    return tipos[estrutura?.tipo] || 'Tarefas';
  }

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <BookOpen size={20} className="text-indigo-600" />
            <h1 className="text-slate-800">Templates</h1>
          </div>
          <button
            onClick={() => setShowCriar(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition-colors"
          >
            <Plus size={16} />
            Criar Template
          </button>
        </div>
        <p className="text-slate-500 text-sm">Modelos pré-configurados para agilizar sua produtividade.</p>
      </div>

      {mensagem && (
        <div className={`mb-4 p-3 rounded-lg flex items-center gap-2 ${
          mensagem.tipo === 'sucesso' 
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {mensagem.tipo === 'sucesso' ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {mensagem.texto}
        </div>
      )}

      {showCriar && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 mb-6">
          <h3 className="text-slate-800 text-sm font-medium mb-4">Criar Novo Template</h3>
          <form onSubmit={handleCriar} className="space-y-4">
            <div>
              <label className="block text-slate-600 text-sm mb-1">Nome</label>
              <input
                type="text"
                value={novoTemplate.nome}
                onChange={e => setNovoTemplate({ ...novoTemplate, nome: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm"
                placeholder="Ex: Minha Rotina Matinal"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 text-sm mb-1">Descrição</label>
              <textarea
                value={novoTemplate.descricao}
                onChange={e => setNovoTemplate({ ...novoTemplate, descricao: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm"
                rows={2}
                placeholder="Descreva o propósito deste template"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-indigo-700"
              >
                Criar
              </button>
              <button
                type="button"
                onClick={() => setShowCriar(false)}
                className="border border-slate-300 text-slate-600 px-4 py-2 rounded-lg text-sm hover:bg-slate-50"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
        <p className="text-indigo-700 text-sm">
          💡 <strong>Dica:</strong> Aplique templates para criar rapidamente conjuntos de tarefas. Útil para rotinas recorrentes!
        </p>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-2">Nenhum template criado</p>
          <p className="text-slate-400 text-sm">Crie seu primeiro template para agilizar suas rotinas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map(template => (
            <div
              key={template.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm p-5 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-slate-800 text-sm font-medium group-hover:text-indigo-600 transition-colors">
                    {template.nome}
                  </h3>
                  <span className="text-xs text-slate-400">{getTipoLabel(template)}</span>
                </div>
                <button
                  onClick={() => handleDeletar(template.id)}
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <p className="text-slate-400 text-xs leading-relaxed mb-4">
                {template.descricao || 'Sem descrição'}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-xs">{getItemCount(template)} itens</span>
                <button
                  onClick={() => handleAplicar(template.id)}
                  disabled={aplicando === template.id}
                  className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
                >
                  {aplicando === template.id ? (
                    <>
                      <div className="w-3 h-3 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" />
                      Aplicando...
                    </>
                  ) : (
                    <>
                      Aplicar
                      <ArrowRight size={13} />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Link 
          to="/agenda/hoje" 
          className="text-slate-500 hover:text-indigo-600 text-sm"
        >
          ← Voltar para Agenda
        </Link>
      </div>
    </div>
  );
}
