import { FC } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useServer } from '../../hooks/useServer';

export const ServerPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { isServerRunning, startServer, stopServer } = useServer();

  const handleStartServer = async () => {
    try {
      const message = await startServer();
      pushNotification(message);
    } catch (error: any) {
      pushNotification(`Error: ${error.message}`);
    }
  };

  const handleStopServer = async () => {
    try {
      const message = await stopServer();
      pushNotification(message);
    } catch (error: any) {
      pushNotification(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-gray-100">
      <div className="bg-gray-800 rounded-lg shadow-md shadow-black/30 p-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Server Control</h1>

        <div className="flex flex-col items-center gap-8">
          <div className="text-center">
            <div
              className={`w-40 h-40 rounded-lg flex items-center justify-center text-white text-2xl font-bold transition-all ${ isServerRunning ? 'bg-green-500' : 'bg-red-500'
              }`}
            >
              {isServerRunning ? 'Server ON' : 'Server OFF'}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleStartServer}
              disabled={isServerRunning}
              className="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Start Server
            </button>
            <button
              onClick={handleStopServer}
              disabled={!isServerRunning}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Stop Server
            </button>
          </div>

          <div className="mt-8 p-4 bg-blue-900/20 rounded-lg border-l-4 border-blue-500">
            <p className="text-sm text-gray-200">
              The server is used to stream the overlay to OBS. Make sure the server is running before starting a stream.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
