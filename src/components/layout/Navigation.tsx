import { FC } from 'react';
import { Link, useLocation } from 'react-router-dom';
import esportsLogo from '../../images/Esports-Logo.png';

export const Navigation: FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path ? 'bg-falcons-primary text-white' : 'text-gray-300 hover:bg-gray-700';

  return (
    <nav className="bg-gray-900 shadow-md shadow-black/30">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <img src={esportsLogo} alt="Falcons" className="w-8 h-8 rounded" />
            <h1 className="text-2xl font-bold text-falcons-primary">Falcons Overlays</h1>
          </div>

          <div className="flex items-center gap-1">
            <Link
              to="/"
              className={`px-4 py-2 rounded-md text-gray-100 transition-colors ${isActive('/')}`}
              title="Home"
            >
              Home
            </Link>
            <Link
              to="/controls"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/controls')}`}
              title="Controls"
            >
              Controls
            </Link>
            <Link
              to="/config"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/config')}`}
              title="Configuration"
            >
              Config
            </Link>
            <Link
              to="/server"
              className={`px-4 py-2 rounded-md transition-colors ${isActive('/server')}`}
              title="Server"
            >
              Server
            </Link>
            <Link
              to="/files"
              className={`px-4 py-2 rounded-md text-gray-100 transition-colors ${isActive('/files')}`}
              title="Files"
            >
              Files
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};
