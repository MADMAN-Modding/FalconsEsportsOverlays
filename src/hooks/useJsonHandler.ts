import { invoke } from '@tauri-apps/api/core';

export const useJsonHandler = () => {
  const readOverlayJSON = async (key: string): Promise<string> => {
    try {
      const value = await invoke<string>('read_overlay_json', { key });
      return value;
    } catch (error) {
      console.error('Error reading overlay JSON:', error);
      throw error;
    }
  };

  const writeOverlayJSON = async (key: string, value: string): Promise<void> => {
    try {
      const jsonPath = await invoke<string>('get_overlay_json_path');
      await invoke('write_json', {
        path: jsonPath,
        jsonKey: key,
        value: value,
      });
    } catch (error) {
      console.error('Error writing overlay JSON:', error);
      throw error;
    }
  };

  const readConfigJSON = async (key: string): Promise<string> => {
    try {
      const value = await invoke<string>('read_config_json', { key });
      return value;
    } catch (error) {
      console.error('Error reading config JSON:', error);
      throw error;
    }
  };

  const writeConfigJSON = async (key: string, value: string): Promise<void> => {
    try {
      const jsonPath = await invoke<string>('get_config_json_path');
      await invoke('write_json', {
        path: jsonPath,
        jsonKey: key,
        value: value,
      });
    } catch (error) {
      console.error('Error writing config JSON:', error);
      throw error;
    }
  };

  return {
    readOverlayJSON,
    writeOverlayJSON,
    readConfigJSON,
    writeConfigJSON,
  };
};
