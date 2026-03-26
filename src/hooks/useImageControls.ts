import { useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCodeDir } from '../utils/tauriHelpers';

export const useImageControls = () => {
  const getImage = useCallback(async (path: string): Promise<string> => {
    try {
      const bytes = await invoke<number[]>('get_image_bytes', {
        imagePath: path,
      });

      if (!bytes) {
        return 'images/missing.jpg';
      }

      const uint8Array = new Uint8Array(bytes);
      const blob = new Blob([uint8Array], { type: 'image/png' });
      const imageURL = URL.createObjectURL(blob);

      return imageURL;
    } catch (error) {
      console.error('Error loading image:', error);
      return 'images/missing.jpg';
    }
  }, []);

  const getImageArray = useCallback(async (paths: string[]): Promise<string[]> => {
    try {
      const bytes = await invoke<number[][]>('get_image_vec_bytes', {
        imagePaths: paths,
      });

      const urls: string[] = [];

      for (let i = 0; i < bytes.length; i++) {
        if (bytes[i][0] === 0) {
          urls.push('images/missing.jpg');
        } else {
          const uint8Array = new Uint8Array(bytes[i]);
          const blob = new Blob([uint8Array], { type: 'image/png' });
          urls.push(URL.createObjectURL(blob));
        }
      }

      return urls;
    } catch (error) {
      console.error('Error loading images:', error);
      return paths.map(() => 'images/missing.jpg');
    }
  }, []);

  const readFile = useCallback((file: File): Promise<ArrayBuffer> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        if (e.target?.result) {
          resolve(e.target.result as ArrayBuffer);
        }
      });
      reader.addEventListener('error', reject);
      reader.readAsArrayBuffer(file);
    });
  }, []);

  const genURLS = useCallback(async (overlays: string[]): Promise<string[]> => {
    try {
      const paths: string[] = [];
      const codeDir = await getCodeDir();
      
      overlays.forEach((overlay) => {
        paths.push(`${codeDir}/overlays/images/${overlay}.png`);
      });

      const urls = await getImageArray(paths);
      return urls;
    } catch (error) {
      console.error('Error generating URLs:', error);
      throw error;
    }
  }, [getImageArray]);

  return {
    getImage,
    getImageArray,
    readFile,
    genURLS,
  };
};
