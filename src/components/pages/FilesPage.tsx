import { FC, useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useJsonHandler } from '../../hooks/useJsonHandler';
import { getNameMap } from '../../utils/tauriHelpers';
import { useDownloader } from '../../hooks/useDownloader';
import { useOverlayHandler } from '../../hooks/useOverlayHandler';
import { useOverlayImages } from '../../hooks/useOverlayImages';
import deleteIcon from '../../images/delete.png';
import { invoke } from '@tauri-apps/api/core';

export const FilesPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { } = useJsonHandler();
  const { downloadOverlay, getDownloadStatus } = useDownloader();
  const { updateOverlayList, deleteOverlay } = useOverlayHandler();
  const { getMultipleOverlayImages, imageCache } = useOverlayImages();
  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  const [downloadStatus, setDownloadStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [codeDir, setCodeDir] = useState<string>('');

  useEffect(() => {
    const initialize = async () => {
      try {
        const names = await getNameMap();
        setNameMap(names);

        const status = await getDownloadStatus();
        setDownloadStatus(status);

        const code = await invoke<string>('get_code_dir');
        setCodeDir(code);

        setLoading(false);
      } catch (error) {
        console.error('Error initializing files page:', error);
        setLoading(false);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    // Load images for all downloaded overlays
    const loadImages = async () => {
      if (downloadStatus.length > 0 && codeDir) {
        const downloadedOverlays = downloadStatus
          .filter((item) => item.status === 'downloaded')
          .map((item) => item.overlay);

        if (downloadedOverlays.length > 0) {
          await getMultipleOverlayImages(downloadedOverlays, codeDir);
        }
      }
    };

    loadImages();
  }, [downloadStatus, codeDir, getMultipleOverlayImages]);

  const handleDownload = async (overlay: string) => {
    try {
      pushNotification(`Downloading ${nameMap[overlay] || overlay}...`);
      await downloadOverlay(overlay);
      await updateOverlayList();
      const status = await getDownloadStatus();
      setDownloadStatus(status);
      pushNotification(`Downloaded ${nameMap[overlay] || overlay}`);
    } catch (error: any) {
      pushNotification(`Download failed: ${error.message}`);
    }
  };

  const handleDelete = async (overlay: string) => {
    try {
      pushNotification(`Deleting ${nameMap[overlay] || overlay}...`);
      await deleteOverlay(overlay);
      const status = await getDownloadStatus();
      setDownloadStatus(status);
      pushNotification(`Deleted ${nameMap[overlay] || overlay}`);
    } catch (error: any) {
      pushNotification(`Delete failed: ${error.message}`);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloaded':
        return 'bg-green-500/20 border-green-600 text-green-300';
      case 'update-available':
        return 'bg-yellow-500/20 border-yellow-600 text-yellow-300';
      case 'not-downloaded':
        return 'bg-red-500/20 border-red-600 text-red-300';
      case 'deleted':
        return 'bg-red-500/20 border-red-600 text-red-300';
      default:
        return 'bg-purple-500/20 border-purple-600 text-purple-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'downloaded':
        return 'Downloaded';
      case 'update-available':
        return 'Update Available';
      case 'not-downloaded':
        return 'Not Downloaded';
      case 'deleted':
        return 'Deleted';
      default:
        return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center text-gray-100">Loading...</div>
      </div>
    );
  }
  return (
    <div className="max-w-6xl mx-auto px-4 py-12 text-gray-100">
      <div className="bg-gray-800 rounded-lg shadow-md shadow-black/30 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-100">Overlay Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...downloadStatus].sort((a, b) => {
            const aName = nameMap[a.overlay] || a.overlay;
            const bName = nameMap[b.overlay] || b.overlay;
            return aName.localeCompare(bName);
          }).map((item) => (
            <div key={item.overlay} className="border border-gray-700 rounded-lg p-4 hover:shadow-lg shadow-black/20 transition-shadow bg-gray-900 overflow-hidden">
              {/* Image or placeholder */}
              <div className="mb-4 h-40 bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
                {imageCache[item.overlay] && imageCache[item.overlay] !== 'images/missing.jpg' ? (
                  <img
                    src={imageCache[item.overlay]}
                    alt={nameMap[item.overlay] || item.overlay}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="mb-2 text-2xl">📁</div>
                    <span className="text-sm">{item.status === 'downloaded' ? 'Loading...' : 'Not downloaded'}</span>
                  </div>
                )}
              </div>

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="font-bold text-lg text-gray-100">{nameMap[item.overlay] || item.overlay}</p>
                  <p className="text-sm text-gray-400">
                    Local: {item.localVersion === null || item.localVersion === 'null' ? '0' : item.localVersion} | Available: {item.availableVersion}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(item.status)} whitespace-nowrap ml-2`}>
                  {getStatusText(item.status)}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(item.overlay)}
                  className="btn btn-primary flex-1"
                >
                  {item.status === 'downloaded' ? 'Re-download' : 'Download'}
                </button>
                <button
                  onClick={() => handleDelete(item.overlay)}
                  className="btn btn-danger p-2 hover:bg-red-600 transition-colors"
                  title="Delete"
                >
                  <img src={deleteIcon} alt="Delete" className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
