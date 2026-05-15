import { useState } from 'react';
import { useCategorias, useCreateCategoria, useUpdateCategoria, useDeleteCategoria } from '../hooks/useCategorias';
import { CategoriaModal } from '../components/categorias/CategoriaModal';
import type { CategoriaCreate, CategoriaUpdate } from '../types';

export const CategoriasPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | null>(null);

  const { data: categorias, isLoading, error } = useCategorias();
  const createMutation = useCreateCategoria();
  const updateMutation = useUpdateCategoria();
  const deleteMutation = useDeleteCategoria();

  const selectedCategoria = categorias?.find((c) => c.id === selectedCategoriaId);

  const handleCreate = async (formData: CategoriaCreate | CategoriaUpdate) => {
    if (selectedCategoriaId) {
      await updateMutation.mutateAsync({
        id: selectedCategoriaId,
        data: formData as CategoriaUpdate,
      });
    } else {
      await createMutation.mutateAsync(formData as CategoriaCreate);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      }
    }
  };

  const handleOpenModal = (id?: number) => {
    setSelectedCategoriaId(id || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoriaId(null);
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
        <h1 className="text-3xl font-bold">Categorías</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          + Nueva Categoría
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-gray-500 py-8">Cargando categorías...</div>
      ) : categorias && categorias.length > 0 ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Padre</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Subcats</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Descripción</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-900">{categoria.id}</td>
                  <td className="px-6 py-3 text-gray-900 font-medium">{categoria.nombre}</td>
                  <td className="px-6 py-3 text-gray-600">
                    {categoria.parent_id ?? '—'}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {categoria.subcategorias?.length ?? 0}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {categoria.descripcion || '-'}
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    <button
                      onClick={() => handleOpenModal(categoria.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(categoria.id)}
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
          No hay categorías creadas. ¡Crea una nueva!
        </div>
      )}

      {isModalOpen && (
        <CategoriaModal
          onClose={handleCloseModal}
          onSubmit={handleCreate}
          initialData={selectedCategoria}
        />
      )}
    </div>
  );
};
