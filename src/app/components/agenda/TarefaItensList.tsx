import { useState } from 'react';
import { Check, Plus, Trash2 } from 'lucide-react';
import type { TarefaItemUI } from '../../../lib/mapeamento';

interface TarefaItensListProps {
  itens: TarefaItemUI[];
  onToggle: (itemId: string) => void;
  onDelete: (itemId: string) => void;
  onAdd: (nome: string) => void;
  disabled?: boolean;
}

export function TarefaItensList({ 
  itens, 
  onToggle, 
  onDelete, 
  onAdd,
  disabled = false 
}: TarefaItensListProps) {
  const [newItemName, setNewItemName] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = itens.filter(i => i.completed).length;

  const handleAddItem = () => {
    if (newItemName.trim()) {
      onAdd(newItemName.trim());
      setNewItemName('');
      setIsAdding(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem();
    } else if (e.key === 'Escape') {
      setNewItemName('');
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Header com progresso */}
      {itens.length > 0 && (
        <div className="flex items-center justify-between text-sm">
          <span className="text-slate-600">Itens</span>
          <span className="text-slate-500">
            {completedCount}/{itens.length} concluídos
          </span>
        </div>
      )}

      {/* Lista de itens */}
      <div className="space-y-2">
        {itens.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-2 p-2 rounded-lg border transition-colors ${
              item.completed 
                ? 'bg-emerald-50 border-emerald-200' 
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            {/* Checkbox */}
            <button
              onClick={() => onToggle(item.id)}
              disabled={disabled}
              className={`flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors ${
                item.completed 
                  ? 'bg-emerald-500 border-emerald-500' 
                  : 'border-slate-300 hover:border-slate-400'
              }`}
            >
              {item.completed && <Check className="w-3 h-3 text-white" />}
            </button>

            {/* Nome do item */}
            <span className={`flex-1 text-sm ${item.completed ? 'text-emerald-700 line-through' : 'text-slate-700'}`}>
              {item.nome}
            </span>

            {/* Botão de excluir */}
            <button
              onClick={() => onDelete(item.id)}
              disabled={disabled}
              className="text-slate-400 hover:text-red-500 transition-colors p-1"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Adicionar novo item */}
      {isAdding ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Nome do item..."
            className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            autoFocus
          />
          <button
            onClick={handleAddItem}
            disabled={!newItemName.trim()}
            className="px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adicionar
          </button>
          <button
            onClick={() => { setNewItemName(''); setIsAdding(false); }}
            className="px-3 py-2 text-slate-600 text-sm hover:text-slate-800"
          >
            Cancelar
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          disabled={disabled}
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar item
        </button>
      )}
    </div>
  );
}