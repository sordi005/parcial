interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  isPending?: boolean;
}

export const ConfirmDialog = ({ message, onConfirm, onCancel, isPending }: Props) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg max-w-sm w-full mx-4 shadow-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar acción</h3>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          onClick={onCancel}
          disabled={isPending}
          className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium disabled:opacity-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 font-medium disabled:bg-gray-400 transition-colors"
        >
          {isPending ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  </div>
);
