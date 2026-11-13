import { FC, ReactNode, useEffect, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { useDownloader } from '../../hooks/useDownloader';
import { useImageControls } from '../../hooks/useImageControls';
import { useJsonHandler } from '../../hooks/useJsonHandler';
import { useNotifications } from '../../hooks/useNotifications';
import { getCodeDir } from '../../utils/tauriHelpers';
import { PageHeader, Panel, Switch, UploadIcon } from '../ui';

interface RowProps {
  title: string;
  description: string;
  children: ReactNode;
}

const Row: FC<RowProps> = ({ title, description, children }) => (
  <div className="flex items-center justify-between gap-8 py-4 first:pt-0 last:pb-0">
    <div>
      <p className="font-display text-lg font-semibold uppercase tracking-[0.06em] text-white">{title}</p>
      <p className="mt-0.5 max-w-md text-sm leading-relaxed text-ink-300">{description}</p>
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

export const ConfigPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { readConfigJSON, writeConfigJSON } = useJsonHandler();
  const { getImage } = useImageControls();
  const { downloadFiles, resetFiles } = useDownloader();

  const [autoServer, setAutoServer] = useState(false);
  const [teamImage, setTeamImage] = useState('');
  const [codeDir, setCodeDir] = useState('');
  const [working, setWorking] = useState<'download' | 'reset' | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  // Frees the previous blob URL when the logo is replaced and on unmount
  useEffect(() => {
    return () => {
      if (teamImage.startsWith('blob:')) URL.revokeObjectURL(teamImage);
    };
  }, [teamImage]);

  useEffect(() => {
    const initialize = async () => {
      const dir = await getCodeDir();
      setCodeDir(dir);

      if (dir) {
        setTeamImage(await getImage(`${dir}/images/Esports-Logo.png`));
      }

      try {
        setAutoServer(String(await readConfigJSON('autoServer')) === 'true');
      } catch (error) {
        console.warn('Failed to read autoServer:', error);
      }
    };

    initialize();
  }, []);

  const handleAutoServerChange = async (checked: boolean) => {
    setAutoServer(checked);

    try {
      await writeConfigJSON('autoServer', String(checked));
    } catch {
      setAutoServer(!checked);
      pushNotification('Could not save that setting', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    try {
      await invoke<string>('copy_image', new Uint8Array(await file.arrayBuffer()));

      if (codeDir) {
        setTeamImage(await getImage(`${codeDir}/images/Esports-Logo.png`));
      }

      pushNotification('Team logo updated', 'success');
    } catch (error) {
      console.error('Error uploading image:', error);
      pushNotification('Could not save the logo', 'error');
    }
  };

  const handleRedownload = async () => {
    setWorking('download');

    try {
      await downloadFiles();
      pushNotification('Overlays re-downloaded, your settings and logo were kept', 'success');
    } catch (error) {
      pushNotification(`Download failed: ${String(error)}`, 'error');
    } finally {
      setWorking(null);
    }
  };

  const handleReset = async () => {
    setConfirmReset(false);
    setWorking('reset');

    try {
      await resetFiles();
      // Everything on screen came from the old settings, so the app starts fresh
      window.location.reload();
    } catch (error) {
      pushNotification(`Reset failed: ${String(error)}`, 'error');
      setWorking(null);
    }
  };

  return (
    <>
      <PageHeader eyebrow="Preferences" title="Settings" />

      <div className="space-y-6">
        <Panel title="Team logo" bodyClassName="flex items-center gap-8 p-6">
          <div className="flex h-36 w-36 shrink-0 items-center justify-center border border-ink-600 bg-[repeating-conic-gradient(#16161c_0%_25%,#0c0c10_0%_50%)] bg-[length:16px_16px]">
            {teamImage && <img src={teamImage} alt="Team logo" className="max-h-full max-w-full object-contain p-2" />}
          </div>

          <div>
            <p className="max-w-md text-[15px] leading-relaxed text-ink-300">
              Shown on overlays that have a logo. A square PNG with a transparent background looks best.
            </p>
            <label className="btn btn-secondary mt-4 cursor-pointer focus-within:shadow-[inset_0_0_0_2px_#fff]">
              <UploadIcon size={16} /> Replace logo
              <input type="file" accept="image/png" onChange={handleImageUpload} className="sr-only" />
            </label>
          </div>
        </Panel>

        <Panel title="Startup">
          <Row
            title="Start server on launch"
            description="Turns the overlay server on when the app opens, so OBS is ready without a visit to the Server page."
          >
            <Switch checked={autoServer} onChange={handleAutoServerChange} label="Start the server on launch" />
          </Row>
        </Panel>

        <Panel title="Maintenance">
          <div className="divide-y divide-ink-600">
            <Row
              title="Re-download overlays"
              description="Fetches a fresh copy of every overlay. Your settings and team logo are kept."
            >
              <button onClick={handleRedownload} disabled={working !== null} className="btn btn-secondary">
                {working === 'download' ? 'Downloading...' : 'Re-download'}
              </button>
            </Row>

            <Row
              title="Reset everything"
              description="Restores default settings, the default logo and a clean set of overlays. This can't be undone."
            >
              {confirmReset ? (
                <div className="flex items-center gap-2">
                  <button onClick={handleReset} className="btn btn-primary">
                    Yes, reset
                  </button>
                  <button onClick={() => setConfirmReset(false)} className="btn btn-ghost">
                    Cancel
                  </button>
                </div>
              ) : (
                <button onClick={() => setConfirmReset(true)} disabled={working !== null} className="btn btn-danger">
                  {working === 'reset' ? 'Resetting...' : 'Reset'}
                </button>
              )}
            </Row>
          </div>
        </Panel>
      </div>
    </>
  );
};
