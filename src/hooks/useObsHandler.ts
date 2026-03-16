import { useState, useCallback, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';

export const useObsHandler = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const pendingResponsesRef = useRef<Map<string, (status: any) => void>>(new Map());

  const getSceneCollectionList = useCallback(async (): Promise<string[]> => {
    try {
      const scenes = await invoke<string[]>('get_scene_collection');
      return scenes;
    } catch (error) {
      console.error('Error getting scene collection list:', error);
      throw error;
    }
  }, []);

  const getScenes = useCallback(async (collection: string): Promise<string[]> => {
    try {
      const scenes = await invoke<string[]>('get_scenes', { collection });
      return scenes;
    } catch (error) {
      console.error('Error getting scenes:', error);
      throw error;
    }
  }, []);

  const connectWebSocket = useCallback(async (): Promise<void> => {
    try {
      const password = await invoke<string>('get_ws_password');
      const socket = new WebSocket('ws://localhost:4455');

      socket.addEventListener('open', () => {
        console.log('WebSocket opened');
        setIsConnected(true);
      });

      socket.addEventListener('message', async (event) => {
        const msg = JSON.parse(event.data);

        if (msg.op === 0) {
          // Authentication required
          const { computeAuth } = await importWebSocketAuth();
          const auth = await computeAuth(
            password,
            msg.d.authentication.salt as string,
            msg.d.authentication.challenge as string
          );

          socket.send(
            JSON.stringify({
              op: 1,
              d: {
                rpcVersion: 1,
                authentication: auth,
              },
            })
          );
        }

        if (msg.op === 2) {
          console.log('Successfully identified with OBS WebSocket');
        }

        if (msg.op === 7) {
          const { requestId, requestStatus } = msg.d;
          const handler = pendingResponsesRef.current.get(requestId);
          if (handler) {
            handler(requestStatus);
            pendingResponsesRef.current.delete(requestId);
          }
        }
      });

      socket.addEventListener('error', () => {
        console.error('WebSocket error');
        setIsConnected(false);
      });

      socket.addEventListener('close', () => {
        console.log('WebSocket closed');
        setIsConnected(false);
      });

      socketRef.current = socket;
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
      throw error;
    }
  }, []);

  const injectOBSScene = useCallback(
    async (sceneCollection: string, scene: string): Promise<void> => {
      try {
        if (sceneCollection === 'Select a Scene Collection' || scene === 'Select a Scene') {
          throw new Error('Invalid Selection');
        }

        await invoke('inject');
        await connectWebSocket();
        await makeBrowser();
      } catch (error) {
        console.error('Error injecting OBS scene:', error);
        throw error;
      }
    },
    [connectWebSocket]
  );

  const makeBrowser = useCallback(async (): Promise<void> => {
    // This would be implemented based on the OBS WebSocket API
    // Placeholder for now
    console.log('Making browser source');
  }, []);

  return {
    isConnected,
    getSceneCollectionList,
    getScenes,
    connectWebSocket,
    injectOBSScene,
  };
};

// Helper to import WebSocket auth computation
async function importWebSocketAuth(): Promise<any> {
  // This would need to be implemented based on the actual library
  // Placeholder for now
  return {
    computeAuth: async (_password: string, _salt: string, _challenge: string) => {
      // Implementation needed
      return {};
    },
  };
}
