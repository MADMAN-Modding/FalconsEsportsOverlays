import { useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { getCodeDir } from '../utils/tauriHelpers';

const missingImage = 'images/missing.jpg';

const toBlobURL = (bytes: BlobPart): string =>
  URL.createObjectURL(new Blob([bytes], { type: 'image/png' }));

export const useImageControls = () => {
  const getImage = useCallback(async (path: string): Promise<string> => {
    try {
      const bytes = await invoke<ArrayBuffer>('get_image_bytes', {
        imagePath: path,
      });

      if (!bytes || bytes.byteLength === 0) {
        return missingImage;
      }

      return toBlobURL(bytes);
    } catch (error) {
      console.error('Error loading image:', error);
      return missingImage;
    }
  }, []);

  // The backend packs every image into one buffer: u32 count, then a u32 length and the bytes per image
  const getImageArray = useCallback(async (paths: string[]): Promise<string[]> => {
    try {
      const buffer = await invoke<ArrayBuffer>('get_image_vec_bytes', {
        imagePaths: paths,
      });

      const view = new DataView(buffer);
      const count = view.getUint32(0, true);
      const urls: string[] = [];
      let offset = 4;

      for (let i = 0; i < count; i++) {
        const length = view.getUint32(offset, true);
        offset += 4;

        // A length of 0 means the image is missing
        urls.push(length === 0 ? missingImage : toBlobURL(new Uint8Array(buffer, offset, length)));
        offset += length;
      }

      return urls;
    } catch (error) {
      console.error('Error loading images:', error);
      return paths.map(() => missingImage);
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
