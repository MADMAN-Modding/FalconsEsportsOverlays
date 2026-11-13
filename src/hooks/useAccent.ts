import { useEffect } from 'react';
import { useJsonHandler } from './useJsonHandler';
import { applyAccent, isHexColor, rememberAccent } from '../utils/color';

// The saved config is the source of truth for the accent, the local copy only avoids a flash on launch
export const useAccent = () => {
  const { readConfigJSON } = useJsonHandler();

  useEffect(() => {
    readConfigJSON('appColor')
      .then((value) => {
        const color = String(value);

        if (isHexColor(color)) {
          applyAccent(color);
          rememberAccent(color);
        }
      })
      .catch(() => {});
  }, []);
};
