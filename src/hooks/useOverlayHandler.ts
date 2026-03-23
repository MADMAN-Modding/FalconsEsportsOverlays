import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { OverlayState } from '../types';

export const useOverlayHandler = (enabledOnly: boolean) => {
  const [overlays, setOverlays] = useState<string[]>([]);

  const updateOverlayList = useCallback(async (): Promise<void> => {
    try {
      let list = await invoke<string[]>('get_overlays_list');

      if (enabledOnly) {
        let enabledOverlays = [];

        for (let overlay of list) {
          if (await invoke<boolean>('get_overlay_enabled', { overlay })) {
            enabledOverlays.push(overlay);
          }
        }
        list = enabledOverlays
      }

      setOverlays(list);
    } catch (error) {
      console.error('Error updating overlay list:', error);
      throw error;
    }
  }, [enabledOnly]);

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

export async function getOverlayStateJSON(): Promise<OverlayState> {

    const state = await invoke<OverlayState>('get_overlay_state');

    console.log("Raw overlay state from backend: ", state);


    let newState: OverlayState = {
      overlay: "",
      playerNamesLeft: "",
      playerNamesRight: "",
      scoreLeft: "",
      scoreRight: "",
      teamNameLeft: "",
      teamNameRight: "",
      teamColorLeft: "",
      teamColorRight: "",
      winsLeft: 0,
      winsRight: 0,
      week: 0,
    };

    newState.overlay = state["overlay"].replace("\"", '').replace("\"", '');
    newState.playerNamesLeft = state["player_names_left"].replace("\"", '').replace("\"", '');
    newState.playerNamesRight = state["player_names_right"].replace("\"", '').replace("\"", '');
    newState.teamNameLeft = state["team_name_left"].replace("\"", '').replace("\"", '');
    newState.teamNameRight = state["team_name_right"].replace("\"", '').replace("\"", '');
    newState.teamColorLeft = state["team_color_left"].replace("\"", '').replace("\"", '');
    newState.teamColorRight = state["team_color_right"].replace("\"", '').replace("\"", '');
    newState.winsLeft = parseInt(state["wins_left"].toString().replace("\"", '').replace("\"", '')) || 0;
    newState.winsRight = parseInt(state["wins_right"].toString().replace("\"", '').replace("\"", '')) || 0;
    newState.week = parseInt(state["week"].toString().replace("\"", '').replace("\"", '')) || 0;
    newState.scoreLeft = state["score_left"].replace("\"", '').replace("\"", '');
    newState.scoreRight = state["score_right"].replace("\"", '').replace("\"", '');

    return newState;  
}