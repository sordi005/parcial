import { useState } from 'react';
import { useIngredientes, useCreateIngrediente, useUpdateIngrediente, useDeleteIngrediente } from '../hooks/useIngredientes';
import { IngredienteModal } from '../components/ingredientes/IngredienteModal';
import type { IngredienteCreate, IngredienteUpdate } from '../types';

export const IngredientesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIngredienteId, setSelectedIngredienteId] = useState<number | null>(null);

  const { data: ingredientes, isLoading, error } = useIngredientes();
  const createMutation = useCreateIngrediente();
  const updateMutation = useUpdateIngrediente();
  const deleteMutation = useDeleteIngrediente();

  const selectedIngrediente = ingredientes?.find((i) => i.id === selectedIngredienteId);

  const handleCreate = async (formData: IngredienteCreate | IngredienteUpdate) => {
    if (selectedIngredienteId) {
      await updateMutation.mutateAsync({
        id: selectedIngredienteId,
        data: formData as IngredienteUpdate,
      });
    } else {
      await createMutation.mutateAsync(formData as IngredienteCreate);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este ingrediente?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      }
    }
  };

  const handleOpenModal = (id?: number) => {
    setSelectedIngredienteId(id || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedIngredienteId(null);
  };

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error instanceof Error ? error.message : 'Error desconocido'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Ingredientes</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          + Nuevo Ingrediente
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 py-8">Cargando ingredientes...</div>
      ) : ingredientes && ingredientes.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Unidad</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Stock</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Mínimo</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {ingredientes.map((ingrediente) => (
                <tr key={ingrediente.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-900">{ingrediente.id}</td>
                  <td className="px-6 py-3 text-gray-900 font-medium">{ingrediente.nombre}</td>
                  <td className="px-6 py-3 text-gray-600">{ingrediente.unidad_medida}</td>
                  <td className="px-6 py-3 text-gray-900">
                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      ingrediente.stock_actual < ingrediente.stock_minimo
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {ingrediente.stock_actual}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{ingrediente.stock_minimo}</td>
                  <td className="px-6 py-3 space-x-2">
                    <button
                      onClick={() => handleOpenModal(ingrediente.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(ingrediente.id)}
                      disabled={deleteMutation.isPending}
                      className="text-red-600 hover:text-red-800 font-medium disabled:text-gray-400"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          No hay ingredientes creados. ¡Crea uno nuevo!
        </div>
      )}

      {isModalOpen && (
        <IngredienteModal
          onClose={handleCloseModal}
          onSubmit={handleCreate}
          initialData={selectedIngrediente}
        />
      )}
    </div>
  );
};
