import { NavLink } from 'react-router-dom';

export const Header = () => {
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? 'text-blue-600 font-semibold border-b-2 border-blue-600 pb-1 transition-colors'
      : 'text-gray-700 hover:text-blue-600 transition-colors pb-1';

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <NavLink to="/" className="text-xl font-bold text-blue-600">
              🍕 Food Store
            </NavLink>
            <div className="hidden md:flex gap-6">
              <NavLink to="/productos" className={navLinkClass}>
                Productos
              </NavLink>
              <NavLink to="/categorias" className={navLinkClass}>
                Categorías
              </NavLink>
              <NavLink to="/ingredientes" className={navLinkClass}>
                Ingredientes
              </NavLink>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
