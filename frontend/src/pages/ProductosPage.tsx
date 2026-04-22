import { useState } from 'react';
import { useProductos, useCreateProducto, useUpdateProducto, useDeleteProducto } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { ProductoModal } from '../components/productos/ProductoModal';
import { ProductoCard } from '../components/productos/ProductoCard';
import type { ProductoCreate, ProductoUpdate } from '../types';

export const ProductosPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductoId, setSelectedProductoId] = useState<number | null>(null);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | undefined>();

  const { data: productos, isLoading, error } = useProductos(selectedCategoriaId);
  const { data: categorias } = useCategorias();
  const createMutation = useCreateProducto();
  const updateMutation = useUpdateProducto();
  const deleteMutation = useDeleteProducto();

  const selectedProducto = productos?.find((p) => p.id === selectedProductoId);

  const handleCreate = async (formData: ProductoCreate | ProductoUpdate) => {
    if (selectedProductoId) {
      await updateMutation.mutateAsync({
        id: selectedProductoId,
        data: formData as ProductoUpdate,
      });
    } else {
      await createMutation.mutateAsync(formData as ProductoCreate);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteMutation.mutateAsync(id);
      } catch (err) {
        alert(`Error: ${err instanceof Error ? err.message : 'Error desconocido'}`);
      }
    }
  };

  const handleOpenModal = (id?: number) => {
    setSelectedProductoId(id || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProductoId(null);
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
        <h1 className="text-3xl font-bold">Productos</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium"
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Filtro de categorías */}
      {categorias && categorias.length > 0 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategoriaId(undefined)}
            className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
              selectedCategoriaId === undefined
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            Todos
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategoriaId(cat.id)}
              className={`px-4 py-2 rounded-full font-medium transition-colors whitespace-nowrap ${
                selectedCategoriaId === cat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-gray-500 py-8">Cargando productos...</div>
      ) : productos && productos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {productos.map((producto) => (
            <ProductoCard
              key={producto.id}
              producto={producto}
              onEdit={() => handleOpenModal(producto.id)}
              onDelete={() => handleDelete(producto.id)}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-8 text-center text-gray-500">
          No hay productos creados. ¡Crea uno nuevo!
        </div>
      )}

      {isModalOpen && (
        <ProductoModal
          onClose={handleCloseModal}
          onSubmit={handleCreate}
          initialData={selectedProducto}
        />
      )}
    </div>
  );
};
