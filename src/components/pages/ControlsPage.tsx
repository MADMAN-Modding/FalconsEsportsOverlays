import { FC, useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useJsonHandler } from '../../hooks/useJsonHandler';
import { useOverlayHandler } from '../../hooks/useOverlayHandler';
import { getNameMap } from '../../utils/tauriHelpers';
import { OVERLAY_KEYS } from '../../utils/constants';

export const ControlsPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { writeOverlayJSON } = useJsonHandler();
  const { overlays, updateOverlayList } = useOverlayHandler();
  const [nameMap, setNameMap] = useState<Record<string, string>>({});

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
    currentOverlay: 'ssbu',
  });

  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      try {
        const names = await getNameMap();
        setNameMap(names);
        await updateOverlayList();
      } catch (error) {
        console.error('Error initializing controls page:', error);
      }
    };

    initialize();
  }, []);

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
      {showPreview && (
        <div className="mb-8 bg-gray-800 rounded-lg shadow-md shadow-black/30 overflow-hidden">
          <div className="flex justify-between items-center p-4 bg-gray-700 border-b border-gray-600">
            <h3 className="font-bold text-gray-100">Preview</h3>
            <button
              onClick={() => setShowPreview(false)}
              className="text-gray-200 hover:text-white"
            >
              Close
            </button>
          </div>
          <iframe
            src="http://127.0.0.1:8080/"
            className="w-full h-96 border-0"
            title="Overlay Preview"
          />
        </div>
      )}

      {/* Overlay Selector */}
      <div className="mb-8 bg-gray-800 rounded-lg shadow-md shadow-black/30 p-6">
        <h2 className="text-lg font-bold mb-4 text-gray-100">Select Overlay</h2>
        <div className="flex flex-wrap gap-2">
          {overlays.map((overlay) => (
            <button
              key={overlay}
              onClick={() => handleSwitchOverlay(overlay)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                state.currentOverlay === overlay
                  ? 'bg-falcons-primary text-white'
                  : 'bg-gray-700 text-gray-100 hover:bg-gray-600'
              }`}
            >
              {nameMap[overlay] || overlay}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              className="input w-full"
            />
          </div>

          <div className="mb-4">
            <label className="label">Player Names</label>
            <textarea
              value={state.playerNamesLeft}
              onChange={(e) => handleStateChange('playerNamesLeft', e.target.value)}
              className="input w-full"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="label">Team Name</label>
            <textarea
              value={state.teamNameLeft}
              onChange={(e) => handleStateChange('teamNameLeft', e.target.value)}
              className="input w-full"
              rows={2}
            />
          </div>

          <div>
            <label className="label">Team Color</label>
            <input
              type="color"
              value={state.teamColorLeft}
              onChange={(e) => handleStateChange('teamColorLeft', e.target.value)}
              className="color-input"
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
              className="input w-full"
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
              className="input w-full"
            />
          </div>

          <div className="mb-4">
            <label className="label">Player Names</label>
            <textarea
              value={state.playerNamesRight}
              onChange={(e) => handleStateChange('playerNamesRight', e.target.value)}
              className="input w-full"
              rows={3}
            />
          </div>

          <div className="mb-4">
            <label className="label">Team Name</label>
            <textarea
              value={state.teamNameRight}
              onChange={(e) => handleStateChange('teamNameRight', e.target.value)}
              className="input w-full"
              rows={2}
            />
          </div>

          <div>
            <label className="label">Team Color</label>
            <input
              type="color"
              value={state.teamColorRight}
              onChange={(e) => handleStateChange('teamColorRight', e.target.value)}
              className="color-input"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
