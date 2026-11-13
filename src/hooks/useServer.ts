import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { invoke } from '@tauri-apps/api/core';

// Server state is shared, so the sidebar and the Server page always agree
let running = false;
const listeners = new Set<() => void>();

const setRunning = (value: boolean) => {
  if (running === value) return;

  running = value;
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export async function getServerState(): Promise<boolean> {
  try {
    const status = await invoke<boolean>('is_server_running');
    setRunning(status);
    return status;
  } catch (error) {
    console.error('Error getting server status:', error);
    return false;
  }
}

export async function startServer(): Promise<string> {
  try {
    const message = await invoke<string>('run_server');
    setRunning(true);
    return message;
  } catch (error) {
    console.error('Error starting server:', error);
    throw error;
  }
}

export async function stopServer(): Promise<string> {
  try {
    const message = await invoke<string>('stop_server');
    setRunning(false);
    return message;
  } catch (error) {
    console.error('Error stopping server:', error);
    throw error;
  }
}

export const useServer = () => {
  const isServerRunning = useSyncExternalStore(subscribe, () => running);

  const refreshServerStatus = useCallback(async (): Promise<void> => {
    await getServerState();
  }, []);

  useEffect(() => {
    refreshServerStatus();
  }, [refreshServerStatus]);

  return {
    isServerRunning,
    startServer,
    stopServer,
    refreshServerStatus,
  };
};
