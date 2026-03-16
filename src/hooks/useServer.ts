import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export const useServer = () => {
  const [isServerRunning, setIsServerRunning] = useState(false);

  const startServer = useCallback(async (): Promise<string> => {
    try {
      const message = await invoke<string>('run_server');
      setIsServerRunning(true);
      return message;
    } catch (error) {
      console.error('Error starting server:', error);
      throw error;
    }
  }, []);

  const stopServer = useCallback(async (): Promise<string> => {
    try {
      const message = await invoke<string>('stop_server');
      setIsServerRunning(false);
      return message;
    } catch (error) {
      console.error('Error stopping server:', error);
      throw error;
    }
  }, []);

  return {
    isServerRunning,
    startServer,
    stopServer,
  };
};
