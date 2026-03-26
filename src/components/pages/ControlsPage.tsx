import { FC, useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useJsonHandler } from '../../hooks/useJsonHandler';
import { getOverlayStateJSON, useOverlayHandler } from '../../hooks/useOverlayHandler';
import { useOverlayImages } from '../../hooks/useOverlayImages';
import { getCodeDir, getNameMap } from '../../utils/tauriHelpers';
import { OVERLAY_KEYS } from '../../utils/constants';
import { invoke } from '@tauri-apps/api/core';
import './ControlsPage.css';
import { ColorPicker } from './ColorPicker';

export const ControlsPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { writeOverlayJSON } = useJsonHandler();
  let { overlays, updateOverlayList } = useOverlayHandler(true);
  const { getMultipleOverlayImages, imageCache } = useOverlayImages();
  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  const [codeDir, setCodeDir] = useState<string>('');

  const [state, setState] = useState({
    scoreLeft: '0',
    scoreRight: '0',
    playerNamesLeft: '',
    playerNamesRight: '',
    teamNameLeft: '', 
    teamNameRight: '',
    teamColorLeft: '#be0f32',
    teamColorRight: '#ffffff',
    winsLeft: 0,
    winsRight: 0,
    week: 1,
    currentOverlay: '',
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const names = await getNameMap();
        setNameMap(names);
        const code = await getCodeDir();
        setCodeDir(code);
        await updateOverlayList();
        const overlay = await invoke<string>('get_current_overlay');
        setState((prev) => ({
          ...prev,
          currentOverlay: overlay,
        }));

        const state = await getOverlayStateJSON();

        setState((prev) => ({
          ...prev,
          ...state,
        }));

      } catch (error) {
        console.error('Error initializing controls page:', error);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    // Load images for all overlays
    const loadImages = async () => {
      if (overlays.length > 0 && codeDir) {
        await getMultipleOverlayImages(overlays, codeDir);
      }
    };

    loadImages();
  }, [overlays, codeDir, getMultipleOverlayImages]);

  const handleStateChange = (key: string, value: string | number) => {
    setState((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleUpdateOverlay = async () => {
    try {
      for (const key of OVERLAY_KEYS) {
        const value = state[key as keyof typeof state];
        await writeOverlayJSON(key, String(value));
      }
      pushNotification('Overlays Updated');
    } catch (error) {
      pushNotification('Failed to update overlays');
    }
  };

  const handleSwapTeams = () => {
    setState((prev) => ({
      ...prev,
      scoreLeft: prev.scoreRight,
      scoreRight: prev.scoreLeft,
      playerNamesLeft: prev.playerNamesRight,
      playerNamesRight: prev.playerNamesLeft,
      teamNameLeft: prev.teamNameRight,
      teamNameRight: prev.teamNameLeft,
      teamColorLeft: prev.teamColorRight,
      teamColorRight: prev.teamColorLeft,
    }));
    pushNotification('Teams Swapped');
  };

  const handleUpdateWins = (team: 'Left' | 'Right', wins: number) => {
    const key = `wins${team}` as keyof typeof state;
    handleStateChange(key, wins);
    writeOverlayJSON(`wins${team}`, String(wins));
    pushNotification('Wins Updated');
  };

  const handleSwitchOverlay = (overlay: string) => {
    handleStateChange('currentOverlay', overlay);
    writeOverlayJSON('overlay', overlay);
    pushNotification(`Overlay Changed to ${nameMap[overlay] || overlay}`);
  };


  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div id="preview" className={showPreview ? 'active' : ''}>
        <button
          id="preview-button"
          onClick={() => setShowPreview(false)}
        >
          ×
        </button>
        <iframe
          id="preview-iframe"
          src="http://127.0.0.1:8080/"
          title="Overlay Preview"
        />
      </div>

      {/* Overlay Selector */}
      <div className="mb-8 bg-gray-800 rounded-lg shadow-md shadow-black/30 p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-100">Select Overlay</h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {overlays.map((overlay) => (
            <div key={overlay} className="flex flex-col items-center gap-2">
              <button
                onClick={() => handleSwitchOverlay(overlay)}
                className={`relative group rounded-lg transition-all overflow-hidden ${
                  state.currentOverlay === overlay
                    ? 'ring-4 ring-falcons-primary shadow-lg shadow-falcons-primary'
                    : 'hover:shadow-lg shadow-black/30'
                }`}
                title={nameMap[overlay] || overlay}
              >
                {imageCache[overlay] && imageCache[overlay] !== 'images/missing.jpg' ? (
                  <img
                    src={imageCache[overlay]}
                    alt={nameMap[overlay] || overlay}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-xs text-gray-500 text-center px-2">
                      {nameMap[overlay] || overlay}
                    </span>
                  </div>
                )} 
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs font-bold text-center px-2">
                    {nameMap[overlay] || overlay}
                  </span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        {/* Left Team */}
        <div className="bg-gray-800 rounded-lg shadow-md shadow-black/30 p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Left Team</h2>

          <div className="mb-4">
            <label className="label">Games Won</label>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((win) => (
                <button
                  key={win}
                  onClick={() => handleUpdateWins('Left', win)}
                  className={`py-2 rounded transition-colors ${
                    state.winsLeft === win
                      ? 'bg-falcons-primary text-white'
                      : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                  }`}
                >
                  {win}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="label">Score</label>
            <input
              type="number"
              value={state.scoreLeft}
              onChange={(e) => handleStateChange('scoreLeft', e.target.value)}
              className="input w-full text-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="label">Player Names</label>
            <textarea
              value={state.playerNamesLeft}
              onChange={(e) => handleStateChange('playerNamesLeft', e.target.value)}
              className="input w-full text-gray-900"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="label">Team Name</label>
            <textarea
              value={state.teamNameLeft}
              onChange={(e) => handleStateChange('teamNameLeft', e.target.value)}
              className="input w-full text-gray-900"
              rows={2}
            />
          </div>

          <div>
            <label className="label">Team Color</label>
            <ColorPicker
              value={state.teamColorLeft}
              onChange={(color) => {handleStateChange('teamColorLeft', color), writeOverlayJSON("teamColorLeft", color)}}
            />
          </div>
        </div>

        {/* Middle Section */}
        <div className="bg-gray-800 rounded-lg shadow-md shadow-black/30 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-100">Actions</h2>

            <div className="space-y-3">
              <button onClick={handleUpdateOverlay} className="btn btn-primary w-full">
                Update Overlay
              </button>

              <button onClick={handleSwapTeams} className="btn btn-secondary w-full">
                Swap Teams
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className="btn btn-secondary w-full"
              >
                {showPreview ? 'Hide Preview' : 'View Preview'}
              </button>
            </div>
          </div>

          <div>
            <label className="label">Week</label>
            <input
              type="number"
              value={state.week}
              onChange={(e) => handleStateChange('week', Number(e.target.value))}
              className="input w-full text-gray-900"
            />
          </div>
        </div>

        {/* Right Team */}
        <div className="bg-gray-800 rounded-lg shadow-md shadow-black/30 p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-100">Right Team</h2>

          <div className="mb-4">
            <label className="label">Games Won</label>
            <div className="grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((win) => (
                <button
                  key={win}
                  onClick={() => handleUpdateWins('Right', win)}
                  className={`py-2 rounded transition-colors ${
                    state.winsRight === win
                      ? 'bg-falcons-primary text-white'
                      : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
                  }`}
                >
                  {win}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="label">Score</label>
            <input
              type="number"
              value={state.scoreRight}
              onChange={(e) => handleStateChange('scoreRight', e.target.value)}
              className="input w-full text-gray-900"
            />
          </div>

          <div className="mb-4">
            <label className="label">Player Names</label>
            <textarea
              value={state.playerNamesRight}
              onChange={(e) => handleStateChange('playerNamesRight', e.target.value)}
              className="input w-full text-gray-900"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="label">Team Name</label>
            <textarea
              value={state.teamNameRight}
              onChange={(e) => handleStateChange('teamNameRight', e.target.value)}
              className="input w-full text-gray-900"
              rows={2}
            />
          </div>

          <div>
            <label className="label">Team Color</label>
            <ColorPicker
              value={state.teamColorRight}
              onChange={(color) => {handleStateChange('teamColorRight', color), writeOverlayJSON("teamColorRight", color)}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
