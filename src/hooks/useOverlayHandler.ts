import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export const useOverlayHandler = () => {
  const [overlays, setOverlays] = useState<string[]>([]);

  const updateOverlayList = useCallback(async (): Promise<void> => {
    try {
      const list = await invoke<string[]>('get_overlays_list');
      setOverlays(list);
    } catch (error) {
      console.error('Error updating overlay list:', error);
      throw error;
    }
  }, []);

  const deleteOverlay = useCallback(
    async (overlay: string): Promise<void> => {
      try {
        await invoke('delete_selected_overlay', { overlay });
        await updateOverlayList();
      } catch (error) {
        console.error('Error deleting overlay:', error);
        throw error;
      }
    },
    [updateOverlayList]
  );

  return {
    overlays,
    updateOverlayList,
    deleteOverlay,
  };
};
