import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-xl font-bold text-blue-600">
              🍕 Food Store
            </Link>
            <div className="hidden md:flex gap-6">
              <Link 
                to="/productos" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Productos
              </Link>
              <Link 
                to="/categorias" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Categorías
              </Link>
              <Link 
                to="/ingredientes" 
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Ingredientes
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
