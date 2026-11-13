import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FC, ReactNode, useEffect, useState } from 'react';
import { useNotifications } from './hooks/useNotifications';
import { useJsonHandler } from './hooks/useJsonHandler';
import { useTheme } from './hooks/useTheme';
import { useAccent } from './hooks/useAccent';
import { getLaunchJSON, setupOverlays, checkForUpdates, getUpdateMessage } from './utils/tauriHelpers';
import { MainLayout } from './components/layout/MainLayout';
import { MainPage } from './components/pages/MainPage';
import { ControlsPage } from './components/pages/ControlsPage';
import { ConfigPage } from './components/pages/ConfigPage';
import { ServerPage } from './components/pages/ServerPage';
import { FilesPage } from './components/pages/FilesPage';
import esportsLogo from './images/Esports-Logo.png';
import './App.css';
import { getServerState, startServer } from './hooks/useServer';

const MAX_INIT_ATTEMPTS = 3;

const Splash: FC<{ title: string; children: ReactNode }> = ({ title, children }) => (
  <div className="flex min-h-screen items-center justify-center bg-ink-950 p-8">
    <div className="w-full max-w-sm text-center">
      <img src={esportsLogo} alt="" className="mx-auto mb-6 h-16 w-16 object-contain" />
      <h1 className="font-display text-4xl font-bold uppercase tracking-wide text-white">{title}</h1>
      {children}
    </div>
  </div>
);

function App() {
  const { pushNotification } = useNotifications();
  const { readConfigJSON } = useJsonHandler();
  useTheme();
  useAccent();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initFailed, setInitFailed] = useState(false);
  const [initRun, setInitRun] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const initializeApp = async () => {
      for (let attempt = 1; attempt <= MAX_INIT_ATTEMPTS; attempt++) {
        try {
          await getLaunchJSON();
          await setupOverlays();

          // Check if auto-update is enabled
          const autoUpdate = await readConfigJSON('autoUpdate');
          if (autoUpdate === 'true') {
            // Implement auto-update logic if needed
          }

          // Check if auto-start server is enabled
          const autoServer = await readConfigJSON('autoServer');
          if (autoServer == true && await getServerState() == false) {
            pushNotification("Starting server...");
            await startServer()
          }

          if (await checkForUpdates()) {
            pushNotification("Update available: " + await getUpdateMessage());
          };

          if (!cancelled) setIsInitialized(true);
          return;
        } catch (error) {
          console.error('Error initializing app:', error);

          if (attempt === MAX_INIT_ATTEMPTS) {
            pushNotification('Error initializing application', 'error');
            if (!cancelled) setInitFailed(true);
            return;
          }

          await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
          if (cancelled) return;
        }
      }
    };

    setInitFailed(false);
    initializeApp();

    return () => {
      cancelled = true;
    };
  }, [initRun]);

  if (initFailed) {
    return (
      <Splash title="Couldn't start">
        <p className="mt-3 text-ink-300">Check your network connection and try again.</p>
        <button className="btn btn-primary mt-6" onClick={() => setInitRun((n) => n + 1)}>
          Retry
        </button>
      </Splash>
    );
  }

  if (!isInitialized) {
    return (
      <Splash title="Starting up">
        <p className="mt-3 text-ink-300">Checking for overlay updates. This needs a network connection.</p>
        <div className="mx-auto mt-6 h-0.5 w-40 overflow-hidden bg-ink-700" aria-hidden="true">
          <div className="h-full w-1/2 animate-livePulse bg-falcons-primary" />
        </div>
      </Splash>
    );
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/controls" element={<ControlsPage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/server" element={<ServerPage />} />
          <Route path="/files" element={<FilesPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
