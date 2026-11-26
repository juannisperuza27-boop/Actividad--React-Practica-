import { NavLink } from 'react-router';
import { FaGuitar, FaHeart } from 'react-icons/fa';

export default function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'bg-amber-500 text-slate-950 font-semibold px-3 py-2 rounded-md transition-colors'
      : 'text-slate-200 hover:bg-slate-800 hover:text-white px-3 py-2 rounded-md transition-colors';

  return (
    <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between min-h-16 py-2 gap-3">
          {/* Logo / Marca */}
          <NavLink to="/" className="flex items-center gap-2 text-amber-400 font-bold text-xl">
            <FaGuitar className="text-2xl" />
            <span>SoundVault</span>
          </NavLink>

          {/* Enlaces de navegación */}
          <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base">
            <NavLink to="/" end className={linkClass}>
              Inicio
            </NavLink>
            <NavLink to="/products" className={linkClass}>
              Catálogo
            </NavLink>
            <NavLink to="/favorites" className={linkClass}>
              <span className="inline-flex items-center gap-1.5">
                <FaHeart className="text-rose-400" />
                Favoritos
              </span>
            </NavLink>
            <NavLink to="/add-product" className={linkClass}>
              + Publicar Equipo
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}