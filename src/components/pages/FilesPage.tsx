import { FC, useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useJsonHandler } from '../../hooks/useJsonHandler';
import { getNameMap } from '../../utils/tauriHelpers';
import { useDownloader } from '../../hooks/useDownloader';
import { useOverlayHandler } from '../../hooks/useOverlayHandler';
import deleteIcon from '../../images/delete.png';

export const FilesPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { } = useJsonHandler();
  const { downloadOverlay, getDownloadStatus } = useDownloader();
  const { updateOverlayList, deleteOverlay } = useOverlayHandler();
  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  const [downloadStatus, setDownloadStatus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      try {
        const names = await getNameMap();
        setNameMap(names);

        const status = await getDownloadStatus();
        setDownloadStatus(status);

        setLoading(false);
      } catch (error) {
        console.error('Error initializing files page:', error);
        setLoading(false);
      }
    };

    initialize();
  }, []);

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
        return 'bg-green-500';
      case 'update-available':
        return 'bg-yellow-500';
      case 'not-downloaded':
        return 'bg-red-500';
      case 'deleted':
        return 'bg-red-500';
      default:
        return 'bg-purple-500';
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
            <div key={item.overlay} className="border border-gray-700 rounded-lg p-4 hover:shadow-lg shadow-black/20 transition-shadow bg-gray-900">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-lg text-gray-100">{nameMap[item.overlay] || item.overlay}</p>
                  <p className="text-sm text-gray-300">
                    Local: {item.localVersion === null || item.localVersion === 'null' ? '0' : item.localVersion} | Available: {item.availableVersion}
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-full ${getStatusColor(item.status)}`}></div>
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
                  className="btn btn-danger p-2"
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
