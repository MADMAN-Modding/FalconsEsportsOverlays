import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Navigation: FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'bg-falcons-primary text-white' : 'text-gray-700 hover:bg-gray-100';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-falcons-primary">Falcons Overlays</h1>
          </div>

          <div className="flex gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/')}`}
            >
              Home
            </Link>
            <Link
              to="/controls"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/controls')}`}
            >
              Controls
            </Link>
            <Link
              to="/config"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/config')}`}
            >
              Config
            </Link>
            <Link
              to="/server"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/server')}`}
            >
              Server
            </Link>
            <Link
              to="/files"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/files')}`}
            >
              Files
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
