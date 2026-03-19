import { useState, useCallback } from 'react';
import { useImageControls } from './useImageControls';

export const useOverlayImages = () => {
  const { getImage, getImageArray } = useImageControls();
  const [imageCache, setImageCache] = useState<Record<string, string>>({});

  const getOverlayImageUrl = useCallback(
    async (overlay: string, codePath: string): Promise<string | null> => {
      // Check cache first
      if (imageCache[overlay]) {
        return imageCache[overlay];
      }

      try {
        const imagePath = `${codePath}/overlays/images/${overlay}.png`;
        const imageUrl = await getImage(imagePath);

        // Cache the result
        setImageCache((prev) => ({
          ...prev,
          [overlay]: imageUrl,
        }));

        return imageUrl;
      } catch (error) {
        console.warn(`Failed to get image for overlay ${overlay}:`, error);
        return null;
      }
    },
    [imageCache, getImage]
  );

  const getMultipleOverlayImages = useCallback(
    async (overlays: string[], codePath: string): Promise<Record<string, string>> => {
      const uncachedOverlays = overlays.filter((o) => !imageCache[o]);

      if (uncachedOverlays.length === 0) {
        return imageCache;
      }

      try {
        const imagePaths = uncachedOverlays.map(
          (overlay) => `${codePath}/overlays/images/${overlay}.png`
        );
        const imageUrls = await getImageArray(imagePaths);

        const newCache: Record<string, string> = { ...imageCache };
        uncachedOverlays.forEach((overlay, index) => {
          newCache[overlay] = imageUrls[index];
        });

        setImageCache(newCache);
        return newCache;
      } catch (error) {
        console.warn('Failed to get images for overlays:', error);
        return imageCache;
      }
    },
    [imageCache, getImageArray]
  );

  return {
    getOverlayImageUrl,
    getMultipleOverlayImages,
    imageCache,
  };
};
