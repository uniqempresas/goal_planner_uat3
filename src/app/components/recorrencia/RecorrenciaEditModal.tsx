import { useState } from 'react';
import { X, AlertTriangle, Calendar, Trash2, Edit3 } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface RecorrenciaEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditEsta: () => void;
  onEditFuturas: () => void;
  onEditTodas: () => void;
  onDeleteEsta: () => void;
  onDeleteFuturas: () => void;
  onDeleteTodas: () => void;
  tarefaTitulo: string;
  mode: 'edit' | 'delete';
}

/**
 * Modal para escolher opções de edição/exclusão de tarefas recorrentes
 * Permite ao usuário escolher entre: apenas esta, todas as futuras, ou todas as instâncias
 */
export function RecorrenciaEditModal({
  isOpen,
  onClose,
  onEditEsta,
  onEditFuturas,
  onEditTodas,
  onDeleteEsta,
  onDeleteFuturas,
  onDeleteTodas,
  tarefaTitulo,
  mode,
}: RecorrenciaEditModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'esta' | 'futuras' | 'todas' | null>(null);

  if (!isOpen) return null;

  const handleAction = async () => {
    if (!selectedOption) return;

    setLoading(true);
    try {
      if (mode === 'edit') {
        switch (selectedOption) {
          case 'esta':
            await onEditEsta();
            break;
          case 'futuras':
            await onEditFuturas();
            break;
          case 'todas':
            await onEditTodas();
            break;
        }
      } else {
        switch (selectedOption) {
          case 'esta':
            await onDeleteEsta();
            break;
          case 'futuras':
            await onDeleteFuturas();
            break;
          case 'todas':
            await onDeleteTodas();
            break;
        }
      }
      onClose();
    } catch (error) {
      console.error('[RecorrenciaEditModal] Erro ao executar ação:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDelete = mode === 'delete';
  const title = isDelete ? 'Excluir Tarefa Recorrente' : 'Editar Tarefa Recorrente';
  const description = isDelete
    ? 'Esta é uma tarefa recorrente. O que você deseja excluir?'
    : 'Esta é uma tarefa recorrente. O que você deseja editar?';
  const buttonText = isDelete ? 'Excluir' : 'Salvar Alterações';
  const buttonVariant = isDelete ? 'destructive' : 'default';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              isDelete ? 'bg-red-100' : 'bg-indigo-100'
            }`}>
              {isDelete ? (
                <Trash2 className={`w-5 h-5 ${isDelete ? 'text-red-600' : 'text-indigo-600'}`} />
              ) : (
                <Edit3 className="w-5 h-5 text-indigo-600" />
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
              <p className="text-sm text-slate-500">{tarefaTitulo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-3 mb-6 p-3 bg-amber-50 border border-amber-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-sm text-amber-700">{description}</p>
          </div>

          <div className="space-y-3">
            {/* Opção: Apenas esta */}
            <button
              onClick={() => setSelectedOption('esta')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                selectedOption === 'esta'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOption === 'esta' ? 'border-indigo-500' : 'border-slate-300'
              }`}>
                {selectedOption === 'esta' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">Apenas esta instância</p>
                <p className="text-sm text-slate-500">
                  {isDelete
                    ? 'Exclui apenas a tarefa desta data específica'
                    : 'Edita apenas a tarefa desta data específica'}
                </p>
              </div>
            </button>

            {/* Opção: Esta e todas as futuras */}
            <button
              onClick={() => setSelectedOption('futuras')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                selectedOption === 'futuras'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOption === 'futuras' ? 'border-indigo-500' : 'border-slate-300'
              }`}>
                {selectedOption === 'futuras' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">Esta e todas as futuras</p>
                <p className="text-sm text-slate-500">
                  {isDelete
                    ? 'Cancela a recorrência a partir desta data'
                    : 'Altera a regra de recorrência a partir desta data'}
                </p>
              </div>
            </button>

            {/* Opção: Todas as instâncias */}
            <button
              onClick={() => setSelectedOption('todas')}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                selectedOption === 'todas'
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedOption === 'todas' ? 'border-indigo-500' : 'border-slate-300'
              }`}>
                {selectedOption === 'todas' && (
                  <div className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-slate-800">Todas as instâncias</p>
                <p className="text-sm text-slate-500">
                  {isDelete
                    ? 'Exclui a série completa de tarefas recorrentes'
                    : 'Altera todas as instâncias, incluindo passadas e futuras'}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-slate-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            variant={buttonVariant}
            onClick={handleAction}
            disabled={!selectedOption || loading}
            className="flex-1"
          >
            {loading ? 'Processando...' : buttonText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RecorrenciaEditModal;
