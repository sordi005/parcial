import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductos } from '../hooks/useProductos';
import { useCategorias } from '../hooks/useCategorias';
import { ProductoModal } from '../components/productos/ProductoModal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { Toast } from '../components/ui/Toast';
import type { ProductoCreate, ProductoUpdate } from '../types';

export const ProductosPage = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductoId, setSelectedProductoId] = useState<number | null>(null);
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | undefined>();
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  const { list: productosList, create, update, remove } = useProductos(selectedCategoriaId);
  const { list: categoriasList } = useCategorias();
  const { data: productos, isLoading, error } = productosList;
  const { data: categorias } = categoriasList;

  const selectedProducto = productos?.find((p) => p.id === selectedProductoId);

  const handleCreate = async (formData: ProductoCreate | ProductoUpdate) => {
    if (selectedProductoId) {
      await update.mutateAsync({
        id: selectedProductoId,
        data: formData as ProductoUpdate,
      });
    } else {
      await create.mutateAsync(formData as ProductoCreate);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!confirmId) return;
    try {
      await remove.mutateAsync(confirmId);
      setConfirmId(null);
    } catch (err) {
      setConfirmId(null);
      setToast({ message: err instanceof Error ? err.message : 'Error desconocido', type: 'error' });
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
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-6 py-3 text-left font-semibold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Precio</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Disponible</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Categorías</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Ingredientes</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-900">{producto.id}</td>
                  <td className="px-6 py-3 text-gray-900 font-medium">{producto.nombre}</td>
                  <td className="px-6 py-3 text-gray-900">
                    ${Number(producto.precio).toFixed(2)}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      producto.disponible
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {producto.disponible ? 'Sí' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {producto.categorias.length > 0
                      ? producto.categorias.map((c) => c.nombre).join(', ')
                      : '-'}
                  </td>
                  <td className="px-6 py-3 text-gray-600">
                    {producto.ingredientes.length}
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    <button
                      onClick={() => navigate(`/productos/${producto.id}`)}
                      className="text-purple-600 hover:text-purple-800 font-medium"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleOpenModal(producto.id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmId(producto.id)}
                      className="text-red-600 hover:text-red-800 font-medium"
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

      {confirmId && (
        <ConfirmDialog
          message="¿Estás seguro de que deseas eliminar este producto?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmId(null)}
          isPending={remove.isPending}
        />
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
