import { FC, useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useJsonHandler } from '../../hooks/useJsonHandler';
import { useImageControls } from '../../hooks/useImageControls';
import { useObsHandler } from '../../hooks/useObsHandler';
import { useDownloader } from '../../hooks/useDownloader';
import { getCodeDir, getNameMap } from '../../utils/tauriHelpers';
import { invoke } from '@tauri-apps/api/core';

export const ConfigPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { readConfigJSON, writeConfigJSON } = useJsonHandler();
  const { getImage } = useImageControls();
  const { getSceneCollectionList, getScenes } = useObsHandler();
  const { getDownloadStatus } = useDownloader();

  const [_appColor, setAppColor] = useState('#bf0f35');
  const [_columnColor, setColumnColor] = useState('#000000');
  const [autoServer, setAutoServer] = useState(false);
  const [teamImage, setTeamImage] = useState<string>('');
  const [codeDir, setCodeDir] = useState<string>('');
  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  const [sceneCollections, setSceneCollections] = useState<string[]>([]);
  const [scenes, setScenes] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState('Select a Scene Collection');
  const [selectedScene, setSelectedScene] = useState('Select a Scene');
  const [enabledSports, setEnabledSports] = useState<Record<string, boolean>>({});
  const [downloadStatus, setDownloadStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        // Step 0: Load code directory
        let dir = '';
        try {
          dir = await getCodeDir();
          setCodeDir(dir);
        } catch (e) {
          console.warn('Failed to load code directory:', e);
        }

        // Step 0.5: Load team logo
        if (dir) {
          try {
            const imagePath = `${dir}/images/Esports-Logo.png`;
            const imageUrl = await getImage(imagePath);
            setTeamImage(imageUrl);
          } catch (e) {
            console.warn('Failed to load team image:', e);
          }
        }

        // Step 1: Load name map
        try {
          const names = await getNameMap();
          setNameMap(names);
        } catch (e) {
          console.warn('Failed to load name map:', e);
          setNameMap({});
        }

        // Step 2: Load color settings
        try {
          const appColorValue = await readConfigJSON('appColor');
          if (appColorValue && appColorValue !== 'null' && appColorValue !== '{}') {
            setAppColor(appColorValue.toString());
          } else {
            setAppColor('#bf0f35');
          }
        } catch (e) {
          console.warn('Failed to read appColor:', e);
          setAppColor('#bf0f35');
        }

        try {
          const columnColorValue = await readConfigJSON('columnColor');
          if (columnColorValue && columnColorValue !== 'null' && columnColorValue !== '{}') {
            setColumnColor(columnColorValue.toString());
          } else {
            setColumnColor('#000000');
          }
        } catch (e) {
          console.warn('Failed to read columnColor:', e);
          setColumnColor('#000000');
        }

        // Step 3: Load auto server setting
        try {
          const autoServerValue = await readConfigJSON('autoServer');
          setAutoServer(autoServerValue?.toString() === 'true');
        } catch (e) {
          console.warn('Failed to read autoServer:', e);
          setAutoServer(false);
        }

        // Step 4: Load scene collections
        try {
          const collections = await getSceneCollectionList();
          setSceneCollections(collections);
        } catch (e) {
          console.warn('Failed to load scene collections:', e);
          setSceneCollections([]);
        }

        // Step 5: Get download status
        try {
          const status = await getDownloadStatus();
          setDownloadStatus(status);
        } catch (e) {
          console.warn('Failed to get download status:', e);
          setDownloadStatus([]);
        }

        // Step 6: Load enabled sports
        try {
          const names = await getNameMap();
          const sportStates: Record<string, boolean> = {};
          const sortedOverlays = Object.keys(names).sort();
          
          for (const overlay of sortedOverlays) {
            try {
              const enabled = await invoke<boolean>('get_overlay_enabled', { overlay });
              sportStates[overlay] = enabled;
            } catch (e) {
              console.warn(`Failed to check if ${overlay} is enabled:`, e);
              sportStates[overlay] = false;
            }
          }
          setEnabledSports(sportStates);
        } catch (e) {
          console.warn('Failed to load enabled sports:', e);
          setEnabledSports({});
        }
      } catch (error) {
        console.error('Unexpected error during config page initialization:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  // const handleAppColorChange = async (color: string) => {
  //   if (color === '#ffffff') {
  //     pushNotification("Don't set the color to white...");
  //     return;
  //   }

  //   setAppColor(color);
  //   await writeConfigJSON('appColor', color);
  //   pushNotification(`Color Updated to ${color}`);
  // };

  // const handleColumnColorChange = async (color: string) => {
  //   setColumnColor(color);

  //   await writeConfigJSON('columnColor', color);
  //   pushNotification(`Column Color Updated to ${color}`);
  // };

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
      // Read file as array buffer
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const bytes = Array.from(new Uint8Array(arrayBuffer));
        
        // Send to backend
        try {
          await invoke<string>('copy_image', {
            bytes: bytes,
          });
          
          // Reload the team image from the backend
          if (codeDir) {
            const imagePath = `${codeDir}/images/Esports-Logo.png`;
            const imageUrl = await getImage(imagePath);
            setTeamImage(imageUrl);
          }
          
          pushNotification('Team logo updated successfully');
        } catch (error) {
          pushNotification('Failed to upload image to server');
          console.error('Error uploading image:', error);
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (error) {
      pushNotification('Failed to process image');
      console.error('Error processing image:', error);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-gray-100">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-gray-100">
      <h1 className="text-3xl font-bold mb-8">Configuration</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Appearance Column */}
        <div className="bg-gray-800 rounded-lg shadow-md shadow-black/30 p-6">
          <h2 className="text-xl font-bold mb-4">Appearance</h2>

          <div className="mb-6">
            <img
              src={teamImage}
              alt="Team Logo"
              className="w-full h-40 object-contain rounded-lg mb-4 bg-gray-700"
            />
            <label className="label">Set a logo for your team:</label>
            <label className="w-full px-4 py-2 bg-gray-700 rounded border border-gray-600 cursor-pointer hover:bg-gray-600 transition-colors block text-center">
              <span>Choose a PNG file</span>
              <input
                type="file"
                accept="image/png"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* <div className="mb-4">
            <label className="label">App Color</label>
            <ColorPicker
              value={appColor}
              onChange={(value) => handleAppColorChange(value)}
            />
          </div>

          <div>
            <label className="label">Accent Color</label>
            <ColorPicker
              value={columnColor}
              onChange={(value) => handleColumnColorChange(value)}
            />
          </div> */}
        </div>

        {/* Enabled Sports Column */}
        <div className="bg-gray-800 rounded-lg shadow-md shadow-black/30 p-6">
          <h2 className="text-xl font-bold mb-4">Enabled Sports</h2>

          <div className="space-y-3">
            {Object.entries(nameMap)
              .sort(([, nameA], [, nameB]) => nameA.localeCompare(nameB))
              .filter(([overlay]) => {
                const status = downloadStatus.find((d) => d.overlay === overlay);
                return status && (status.status === 'downloaded' || status.status === 'update-available');
              })
              .map(([overlay, displayName]) => (
              <div key={overlay} className="flex items-center gap-2 p-2 rounded hover:bg-gray-700 transition-colors">
                <input
                  type="checkbox"
                  id={overlay}
                  checked={enabledSports[overlay] || false}
                  onChange={(e) => handleSportToggle(overlay, e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
                <label htmlFor={overlay} className="cursor-pointer flex-1">
                  {displayName}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Other Settings Column */}
        <div className="bg-gray-800 rounded-lg shadow-md shadow-black/30 p-6">
          <h2 className="text-xl font-bold mb-4">Other Settings</h2>

          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4 p-2 rounded hover:bg-gray-700 transition-colors cursor-pointer">
              <input
                type="checkbox"
                id="autoServer"
                checked={autoServer}
                onChange={(e) => handleAutoServerChange(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
              <label htmlFor="autoServer" className="cursor-pointer flex-1">
                Auto Start Server
              </label>
            </div>
          </div>

          {/* <h3 className="text-lg font-bold mb-3">Inject OBS Scene</h3>

          <div className="mb-4">
            <label className="label">Select a Scene Collection:</label>
            <select
              value={selectedCollection}
              onChange={(e) => handleCollectionChange(e.target.value)}
              className="input w-full text-gray-900"
            >
              <option>Select a Scene Collection</option>
              {sceneCollections.map((collection) => (
                <option key={collection} value={collection}>
                  {collection}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4 ">
            <label className="label">Select a Scene</label>
            <select
              value={selectedScene}
              onChange={(e) => setSelectedScene(e.target.value)}
              className="input w-full text-gray-900"
            >
              <option>Select a Scene</option>
              {scenes.map((scene) => (
                <option key={scene} value={scene}>
                  {scene}
                </option>
              ))}
            </select>
          </div> */}

          {/* <button className="btn btn-primary w-full">Inject</button> */}
        </div>
      </div>
    </div>
  );
};
