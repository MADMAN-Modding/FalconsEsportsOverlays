import { FC, useState } from 'react';
import { useNotifications } from '../../hooks/useNotifications';
import { useServer } from '../../hooks/useServer';
import { OVERLAY_DIMENSIONS, OVERLAY_SERVER_URL } from '../../utils/constants';
import { PageHeader, Panel } from '../ui';

export const ServerPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { isServerRunning, startServer, stopServer } = useServer();
  const [busy, setBusy] = useState(false);

  const toggle = async () => {
    setBusy(true);

    try {
      const message = await (isServerRunning ? stopServer() : startServer());
      pushNotification(message, 'success');
    } catch (error) {
      pushNotification(String(error), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Stream output"
        title="Server"
        description="OBS loads the overlays from this server, so keep it running for the whole broadcast."
      />

      <div className="grid grid-cols-[1fr_320px] gap-6">
        <Panel bodyClassName="flex items-center justify-between gap-8 p-8">
          <div>
            <p className="label">Status</p>
            <div className="flex items-center gap-4">
              <span
                className={`h-4 w-4 ${isServerRunning ? 'animate-livePulse bg-signal' : 'bg-ink-500'}`}
                aria-hidden="true"
              />
              <p
                className={`font-display text-7xl font-bold uppercase leading-none tracking-tight ${
                  isServerRunning ? 'text-white' : 'text-ink-400'
                }`}
              >
                {isServerRunning ? 'Live' : 'Offline'}
              </p>
            </div>
            <p className="mt-4 font-mono text-sm text-ink-300">{OVERLAY_SERVER_URL}</p>
          </div>

          <button
            onClick={toggle}
            disabled={busy}
            className={`btn h-14 px-8 text-lg ${isServerRunning ? 'btn-secondary' : 'btn-primary'}`}
          >
            {busy ? 'Working...' : isServerRunning ? 'Stop server' : 'Start server'}
          </button>
        </Panel>

        <Panel title="Browser source">
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="label">URL</dt>
              <dd className="font-mono text-ink-100">{OVERLAY_SERVER_URL}</dd>
            </div>
            <div>
              <dt className="label">Size</dt>
              <dd className="font-mono text-ink-100">
                {OVERLAY_DIMENSIONS.width} × {OVERLAY_DIMENSIONS.height}
              </dd>
            </div>
          </dl>
          <p className="mt-4 border-t border-ink-600 pt-4 text-sm leading-relaxed text-ink-300">
            In OBS add a Browser source with these values. It updates by itself when you change something in Controls.
          </p>
        </Panel>
      </div>
    </>
  );
};
