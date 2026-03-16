import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';

export interface DownloadableOverlay {
  name: string;
  displayName: string;
}

export interface DownloadInfo {
  overlay: string;
  availableVersion: number | string;
  localVersion: number | string;
  status: 'downloaded' | 'update-available' | 'not-downloaded' | 'deleted';
}

export const useDownloader = () => {
  const [downloadableOverlays] = useState<DownloadInfo[]>([]);
  const [downloadProgress, setDownloadProgress] = useState<number>(0);

  const downloadFiles = useCallback(async (): Promise<void> => {
    try {
      await invoke('download_and_extract', { preserve: true });
      setDownloadProgress(100);
    } catch (error) {
      console.error('Error downloading files:', error);
      throw error;
    }
  }, []);

  const resetFiles = useCallback(async (): Promise<void> => {
    try {
      await invoke('reset_overlays');
    } catch (error) {
      console.error('Error resetting files:', error);
      throw error;
    }
  }, []);

  const downloadOverlay = useCallback(async (overlay: string): Promise<void> => {
    try {
      await invoke('download_selected_overlay', { overlay });
    } catch (error) {
      console.error('Error downloading overlay:', error);
      throw error;
    }
  }, []);

  const getDownloadStatus = useCallback(async (): Promise<DownloadInfo[]> => {
    try {
      const versions = await invoke<Record<string, number | string>>('get_versions');
      const localVersions = await invoke<Record<string, number | string | null>>('get_local_versions');

      const statusList: DownloadInfo[] = [];

      for (const overlay in versions) {
        const available = versions[overlay];
        const local = localVersions[overlay];

        let status: 'downloaded' | 'update-available' | 'not-downloaded' | 'deleted';

        if (local === available) {
          status = 'downloaded';
        } else if (local === 'null' || local === null || local === -2) {
          status = 'not-downloaded';
        } else if ((local as number) < (available as number)) {
          status = 'update-available';
        } else {
          status = 'deleted';
        }

        statusList.push({
          overlay,
          availableVersion: available,
          localVersion: local || 'null',
          status,
        });
      }

      return statusList;
    } catch (error) {
      console.error('Error getting download status:', error);
      throw error;
    }
  }, []);

  return {
    downloadableOverlays,
    downloadProgress,
    downloadFiles,
    resetFiles,
    downloadOverlay,
    getDownloadStatus,
  };
};
