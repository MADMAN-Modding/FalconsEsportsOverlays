import { FC, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getVersion } from '@tauri-apps/api/app';
import esportsLogo from '../../images/Esports-Logo.png';
import { useServer } from '../../hooks/useServer';
import { CogIcon, DashboardIcon, LayersIcon, ServerIcon, SlidersIcon } from '../ui';
import { OVERLAY_SERVER_PORT } from '../../utils/constants';

const ITEMS = [
  { to: '/', label: 'Start', icon: DashboardIcon },
  { to: '/files', label: 'Overlays', icon: LayersIcon },
  { to: '/server', label: 'Server', icon: ServerIcon },
  { to: '/controls', label: 'Controls', icon: SlidersIcon },
  { to: '/config', label: 'Settings', icon: CogIcon },
];

export const Navigation: FC = () => {
  const { isServerRunning } = useServer();
  const [version, setVersion] = useState('');

  useEffect(() => {
    getVersion().then(setVersion).catch(() => setVersion(''));
  }, []);

  return (
    <nav className="flex w-56 shrink-0 flex-col border-r border-ink-600 bg-ink-950" aria-label="Main">
      <div className="flex items-center gap-3 border-b border-ink-600 px-5 py-5">
        <img src={esportsLogo} alt="" className="h-10 w-10 object-contain" />
        <div className="leading-none">
          <p className="font-display text-[22px] font-bold uppercase tracking-[0.06em] text-white">Falcons</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-400">Overlay control</p>
        </div>
      </div>

      <ul className="flex-1 py-3">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `relative flex h-11 items-center gap-3 px-5 font-display text-[17px] font-medium uppercase tracking-[0.1em] transition-colors ${
                  isActive
                    ? 'bg-ink-800 text-white before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:bg-falcons-primary'
                    : 'text-ink-300 hover:bg-ink-850 hover:text-white'
                }`
              }
            >
              <Icon />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="border-t border-ink-600 p-4">
        <NavLink
          to="/server"
          className="flex items-center gap-3 border border-ink-600 bg-ink-900 px-3 py-2.5 transition-colors hover:border-ink-500"
        >
          <span
            className={`h-2.5 w-2.5 shrink-0 ${isServerRunning ? 'animate-livePulse bg-signal' : 'bg-ink-500'}`}
            aria-hidden="true"
          />
          <span className="leading-tight">
            <span className={`block font-display text-[15px] font-semibold uppercase tracking-[0.12em] ${isServerRunning ? 'text-signal' : 'text-ink-300'}`}>
              {isServerRunning ? 'Server live' : 'Server off'}
            </span>
            <span className="block font-mono text-[11px] text-ink-400">:{OVERLAY_SERVER_PORT}</span>
          </span>
        </NavLink>
        {version && <p className="mt-3 text-center font-mono text-[11px] text-ink-500">v{version}</p>}
      </div>
    </nav>
  );
};
