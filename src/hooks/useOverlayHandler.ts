import { useState, useCallback } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { OverlayState, RawOverlayState } from '../types';

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
  const state = await invoke<RawOverlayState>('get_overlay_state');

  console.log(state.week)

  let newState: OverlayState = mapState(state);

  console.log(newState.week);

  return newState;
}

const stripQuotes = (value: unknown): string =>
  String(value).replace(/"/g, '');

const mapState = (state: RawOverlayState): OverlayState => ({
  overlay: stripQuotes(state.overlay),
  playerNamesLeft: stripQuotes(state.player_names_left),
  playerNamesRight: stripQuotes(state.player_names_right),
  teamNameLeft: stripQuotes(state.team_name_left),
  teamNameRight: stripQuotes(state.team_name_right),
  teamColorLeft: stripQuotes(state.team_color_left),
  teamColorRight: stripQuotes(state.team_color_right),
  scoreLeft: stripQuotes(state.score_left),
  scoreRight: stripQuotes(state.score_right),
  winsLeft: parseInt(stripQuotes(state.wins_left)),
  winsRight: parseInt(stripQuotes(state.wins_right)),
  week: parseInt(stripQuotes(state.week)),
});