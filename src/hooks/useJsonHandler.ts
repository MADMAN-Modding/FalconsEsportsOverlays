import { invoke } from '@tauri-apps/api/core';

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export const useJsonHandler = () => {
  // New typed versions that work with proper JSON values
  const readOverlayJSONValue = async (key: string): Promise<JsonValue> => {
    try {
      const value = await invoke<JsonValue>('read_overlay_json', { key });
      return value;
    } catch (error) {
      console.error(`Error reading overlay JSON key '${key}':`, error);
      throw error;
    }
  };

  const readConfigJSONValue = async (key: string): Promise<JsonValue> => {
    try {
      const value = await invoke<JsonValue>('read_config_json', { key });
      return value;
    } catch (error) {
      console.error(`Error reading config JSON key '${key}':`, error);
      throw error;
    }
  };

  const readCustomJSONValue = async (key: string): Promise<JsonValue> => {
    try {
      const value = await invoke<JsonValue>('read_custom_json', { key });
      return value;
    } catch (error) {
      console.error(`Error reading custom JSON key '${key}':`, error);
      throw error;
    }
  };

  const writeJSONValue = async (path: string, key: string, value: JsonValue): Promise<void> => {
    try {
      await invoke<void>('write_json_value', {
        path,
        json_key: key,
        value,
      });
    } catch (error) {
      console.error(`Error writing JSON key '${key}':`, error);
      throw error;
    }
  };

  // Legacy string-based versions for backward compatibility
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
    // New typed versions
    readOverlayJSONValue,
    readConfigJSONValue,
    readCustomJSONValue,
    writeJSONValue,
    // Legacy string versions
    readOverlayJSON,
    writeOverlayJSON,
    readConfigJSON,
    writeConfigJSON,
  };
};
