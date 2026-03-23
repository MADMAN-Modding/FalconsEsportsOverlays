import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useNotifications } from './hooks/useNotifications';
import { useJsonHandler } from './hooks/useJsonHandler';
import { useTheme } from './hooks/useTheme';
import { getNameMap, getLaunchJSON, setupOverlays, checkForUpdates, getUpdateMessage } from './utils/tauriHelpers';
import { Navigation } from './components/layout/Navigation';
import { NotificationDisplay } from './components/layout/NotificationDisplay';
import { MainLayout } from './components/layout/MainLayout';
import { MainPage } from './components/pages/MainPage';
import { ControlsPage } from './components/pages/ControlsPage';
import { ConfigPage } from './components/pages/ConfigPage';
import { ServerPage } from './components/pages/ServerPage';
import { FilesPage } from './components/pages/FilesPage';
import './App.css';
import { getServerState, startServer } from './hooks/useServer';

function App() {
  const { notifications, pushNotification } = useNotifications();
  const { readConfigJSON } = useJsonHandler();
  useTheme();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await getLaunchJSON();
        await getNameMap();
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
          console.log(await getUpdateMessage())
          pushNotification("Update available: " + await getUpdateMessage());
        };
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        pushNotification('Error initializing application');
        initializeApp();
      }
    };

    initializeApp();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-100">Loading...</h1>
          <p className="text-gray-300">Initializing Falcons Esports Overlays Controller, this step requires a network connection (which you should have for streaming anyways)</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <MainLayout>
        <Navigation />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/controls" element={<ControlsPage />} />
          <Route path="/config" element={<ConfigPage />} />
          <Route path="/server" element={<ServerPage />} />
          <Route path="/files" element={<FilesPage />} />
        </Routes>
        <NotificationDisplay notifications={notifications} />
      </MainLayout>
    </Router>
  );
}

export default App;
