import { invoke } from '@tauri-apps/api/core';

export const getNameMap = async (): Promise<Record<string, string>> => {
  try {
    const nameMap = await invoke<Record<string, string>>('get_name_map');
    return nameMap;
  } catch (error) {
    console.error('Error getting name map:', error);
    return {};
  }
};

export const getOverlaysList = async (): Promise<string[]> => {
  try {
    const overlays = await invoke<string[]>('get_overlays_list');
    return overlays;
  } catch (error) {
    console.error('Error getting overlays list:', error);
    return [];
  }
};

export const checkForUpdates = async (): Promise<boolean> => {
  try {
    await invoke('check_for_updates');
    return true;
  } catch (error) {
    console.error('Error checking for updates:', error);
    return false;
  }
};

export const setupOverlays = async (): Promise<void> => {
  try {
    await invoke('setup_overlays');
  } catch (error) {
    console.error('Error setting up overlays:', error);
  }
};

export const getCodeDir = async (): Promise<string> => {
  try {
    const codeDir = await invoke<string>('get_code_dir');
    return codeDir;
  } catch (error) {
    console.error('Error getting code directory:', error);
    return '';
  }
};

export const getLaunchJSON = async (): Promise<any> => {
  try {
    const launchJson = await invoke('get_launch_json');
    return launchJson;
  } catch (error) {
    console.error('Error getting launch JSON:', error);
    return null;
  }
};
