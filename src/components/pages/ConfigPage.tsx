import { FC, useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useJsonHandler } from '../../hooks/useJsonHandler';
import { useImageControls } from '../../hooks/useImageControls';
import { useObsHandler } from '../../hooks/useObsHandler';
import { getNameMap } from '../../utils/tauriHelpers';

export const ConfigPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { readConfigJSON, writeConfigJSON } = useJsonHandler();
  const { } = useImageControls();
  const { getSceneCollectionList, getScenes } = useObsHandler();

  const [appColor, setAppColor] = useState('#bf0f35');
  const [columnColor, setColumnColor] = useState('#000000');
  const [autoServer, setAutoServer] = useState(false);
  const [teamImage] = useState<string>('');
  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  const [sceneCollections, setSceneCollections] = useState<string[]>([]);
  const [scenes, setScenes] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('Select a Scene Collection');
  const [selectedScene, setSelectedScene] = useState('Select a Scene');
  const [enabledSports, setEnabledSports] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const names = await getNameMap();
        setNameMap(names);

        const appColorValue = await readConfigJSON('appColor');
        setAppColor(appColorValue);

        const columnColorValue = await readConfigJSON('columnColor');
        setColumnColor(columnColorValue);

        const autoServerValue = await readConfigJSON('autoServer');
        setAutoServer(autoServerValue === 'true');

        const collections = await getSceneCollectionList();
        setSceneCollections(collections);

        // Load enabled sports
        const sportStates: Record<string, boolean> = {};
        for (const overlay of Object.keys(names)) {
          const value = await readConfigJSON(`${overlay}Checked`);
          sportStates[overlay] = value !== 'false';
        }
        setEnabledSports(sportStates);

        setLoading(false);
      } catch (error) {
        console.error('Error initializing config page:', error);
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleAppColorChange = async (color: string) => {
    if (color === '#ffffff') {
      pushNotification("Don't set the color to white...");
      return;
    }

    setAppColor(color);
    await writeConfigJSON('appColor', color);
    pushNotification(`Color Updated to ${color}`);
  };

  const handleColumnColorChange = async (color: string) => {
    setColumnColor(color);
    await writeConfigJSON('columnColor', color);
    pushNotification(`Column Color Updated to ${color}`);
  };

  const handleAutoServerChange = async (checked: boolean) => {
    setAutoServer(checked);
    await writeConfigJSON('autoServer', checked.toString());
  };

  const handleSportToggle = async (overlay: string, checked: boolean) => {
    const newState = { ...enabledSports, [overlay]: checked };
    setEnabledSports(newState);
    await writeConfigJSON(`${overlay}Checked`, checked.toString());
  };

  const handleCollectionChange = async (collection: string) => {
    setSelectedCollection(collection);
    if (collection !== 'Select a Scene Collection') {
      const sceneList = await getScenes(collection);
      setScenes(sceneList);
    } else {
      setScenes([]);
    }
    setSelectedScene('Select a Scene');
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // TODO: Implement image upload to Tauri backend
      pushNotification('Image upload feature coming soon');
    } catch (error) {
      pushNotification('Failed to upload image');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Configuration</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Appearance Column */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Appearance</h2>

          <div className="mb-6">
            <img
              src={teamImage}
              alt="Team Logo"
              className="w-full h-40 object-contain rounded-lg mb-4 bg-gray-100"
            />
            <label className="label">Set a logo for your team:</label>
            <input
              type="file"
              accept="image/png"
              onChange={handleImageUpload}
              className="w-full"
            />
          </div>

          <div className="mb-4">
            <label className="label">App Color</label>
            <input
              type="color"
              value={appColor}
              onChange={(e) => handleAppColorChange(e.target.value)}
              className="color-input"
            />
          </div>

          <div>
            <label className="label">Column Color</label>
            <input
              type="color"
              value={columnColor}
              onChange={(e) => handleColumnColorChange(e.target.value)}
              className="color-input"
            />
          </div>
        </div>

        {/* Enabled Sports Column */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Enabled Sports</h2>

          <div className="space-y-3">
            {Object.entries(nameMap).map(([overlay, displayName]) => (
              <div key={overlay} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={overlay}
                  checked={enabledSports[overlay] || false}
                  onChange={(e) => handleSportToggle(overlay, e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor={overlay} className="cursor-pointer">
                  {displayName}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Other Settings Column */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Other Settings</h2>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <input
                type="checkbox"
                id="autoServer"
                checked={autoServer}
                onChange={(e) => handleAutoServerChange(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="autoServer" className="cursor-pointer">
                Auto Start Server
              </label>
            </div>
          </div>

          <h3 className="text-lg font-bold mb-3">Inject OBS Scene</h3>

          <div className="mb-4">
            <label className="label">Select a Scene Collection:</label>
            <select
              value={selectedCollection}
              onChange={(e) => handleCollectionChange(e.target.value)}
              className="input w-full"
            >
              <option>Select a Scene Collection</option>
              {sceneCollections.map((collection) => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="label">Select a Scene</label>
            <select
              value={selectedScene}
              onChange={(e) => setSelectedScene(e.target.value)}
              className="input w-full"
            >
              <option>Select a Scene</option>
              {scenes.map((scene) => (
                <option key={scene} value={scene}>
                  {scene}
                </option>
              ))}
            </select>
          </div>

          <button className="btn btn-primary w-full">Inject</button>
        </div>
      </div>
    </div>
  );
};
