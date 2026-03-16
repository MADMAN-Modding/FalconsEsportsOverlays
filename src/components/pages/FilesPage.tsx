import { FC, useState, useEffect } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useJsonHandler } from '../../hooks/useJsonHandler';
import { getNameMap } from '../../utils/tauriHelpers';
import { useDownloader } from '../../hooks/useDownloader';
import { useOverlayHandler } from '../../hooks/useOverlayHandler';

export const FilesPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { } = useJsonHandler();
  const { downloadOverlay, getDownloadStatus } = useDownloader();
  const { updateOverlayList } = useOverlayHandler();
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'downloaded':
        return 'bg-green-500';
      case 'update-available':
        return 'bg-yellow-500';
      case 'not-downloaded':
        return 'bg-red-500';
      case 'deleted':
        return 'bg-gray-500';
      default:
        return 'bg-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold mb-8">Overlay Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {downloadStatus.map((item) => (
            <div key={item.overlay} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="font-bold text-lg">{nameMap[item.overlay] || item.overlay}</p>
                  <p className="text-sm text-gray-600">
                    Local: {item.localVersion} | Available: {item.availableVersion}
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-full ${getStatusColor(item.status)}`}></div>
              </div>

              <button
                onClick={() => handleDownload(item.overlay)}
                className="btn btn-primary w-full"
              >
                {item.status === 'downloaded' ? 'Re-download' : 'Download'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
