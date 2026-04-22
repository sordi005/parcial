import { useParams, useNavigate } from 'react-router-dom';
import { useProducto } from '../hooks/useProductos';

export const ProductoDetallePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: producto, isLoading, error } = useProducto(id ? parseInt(id) : undefined);

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error: {error instanceof Error ? error.message : 'Error desconocido'}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Cargando...</div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Producto no encontrado</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/productos')}
        className="text-blue-600 hover:text-blue-800 font-medium mb-6"
      >
        ← Volver a Productos
      </button>

      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">{producto.nombre}</h1>
            {producto.descripcion && (
              <p className="text-lg text-gray-600 mt-2">{producto.descripcion}</p>
            )}
          </div>
          <span className={`text-lg font-semibold px-4 py-2 rounded ${
            producto.disponible
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {producto.disponible ? '✓ Disponible' : '✗ No disponible'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <p className="text-sm font-semibold text-gray-600 mb-2">PRECIO</p>
            <p className="text-4xl font-bold text-blue-600">${typeof producto.precio === 'string' ? parseFloat(producto.precio).toFixed(2) : producto.precio.toFixed(2)}</p>
          </div>

          <div className="bg-purple-50 rounded-lg p-6">
            <p className="text-sm font-semibold text-gray-600 mb-2">CATEGORÍAS</p>
            <p className="text-2xl font-bold text-purple-600">{producto.categorias.length}</p>
          </div>

          <div className="bg-green-50 rounded-lg p-6">
            <p className="text-sm font-semibold text-gray-600 mb-2">INGREDIENTES</p>
            <p className="text-2xl font-bold text-green-600">{producto.ingredientes.length}</p>
          </div>
        </div>

        {/* Categorías */}
        {producto.categorias.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Categorías</h2>
            <div className="flex flex-wrap gap-2">
              {producto.categorias.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium"
                >
                  {cat.nombre}
                  {cat.descripcion && (
                    <p className="text-xs text-blue-700 mt-1">{cat.descripcion}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ingredientes */}
        {producto.ingredientes.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredientes</h2>
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-200 border-b border-gray-300">
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">Ingrediente</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">Cantidad</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-800">Unidad</th>
                  </tr>
                </thead>
                <tbody>
                  {producto.ingredientes.map((ing) => (
                    <tr
                      key={ing.ingrediente_id}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="px-6 py-3 text-gray-900 font-medium">{ing.nombre}</td>
                      <td className="px-6 py-3 text-gray-900">{ing.cantidad}</td>
                      <td className="px-6 py-3 text-gray-600">{ing.unidad_medida}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500">
          Creado: {new Date(producto.created_at).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};
