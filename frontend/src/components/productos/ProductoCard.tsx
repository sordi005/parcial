import { Link } from 'react-router-dom';
import type { Producto } from '../../types';

interface Props {
  producto: Producto;
  onEdit: () => void;
  onDelete: () => void;
  isDeleting?: boolean;
}

export const ProductoCard = ({ producto, onEdit, onDelete, isDeleting = false }: Props) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{producto.nombre}</h3>
            {producto.descripcion && (
              <p className="text-sm text-gray-600 mt-1">{producto.descripcion}</p>
            )}
          </div>
          <span className={`text-sm font-semibold px-3 py-1 rounded ${
            producto.disponible
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {producto.disponible ? 'Disponible' : 'No disponible'}
          </span>
        </div>

        <div className="my-3">
          <p className="text-2xl font-bold text-blue-600">${producto.precio.toFixed(2)}</p>
        </div>

        {producto.categorias.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">Categorías:</p>
            <div className="flex flex-wrap gap-1">
              {producto.categorias.map((cat) => (
                <span
                  key={cat.id}
                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {cat.nombre}
                </span>
              ))}
            </div>
          </div>
        )}

        {producto.ingredientes.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-semibold text-gray-600 mb-1">Ingredientes:</p>
            <div className="bg-gray-50 rounded p-2 max-h-24 overflow-y-auto">
              <ul className="text-xs text-gray-700 space-y-1">
                {producto.ingredientes.map((ing) => (
                  <li key={ing.ingrediente_id}>
                    {ing.nombre}: {ing.cantidad} {ing.unidad_medida}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Link
            to={`/productos/${producto.id}`}
            className="flex-1 text-center bg-blue-50 text-blue-600 px-3 py-2 rounded hover:bg-blue-100 transition-colors font-medium text-sm"
          >
            Ver detalle
          </Link>
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-2"
          >
            Editar
          </button>
          <button
            onClick={onDelete}
            disabled={isDeleting}
            className="text-red-600 hover:text-red-800 font-medium text-sm px-3 py-2 disabled:text-gray-400"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};
