import { FC, ReactNode, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OVERLAY_DIMENSIONS, OVERLAY_SERVER_URL } from '../../utils/constants';
import { useDownloader } from '../../hooks/useDownloader';
import { useNotifications } from '../../hooks/useNotifications';
import { useServer } from '../../hooks/useServer';
import { PageHeader, ArrowRightIcon, CopyIcon } from '../ui';

interface StepProps {
  number: number;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

const Step: FC<StepProps> = ({ number, title, children, action }) => (
  <li className="grid grid-cols-[64px_1fr_auto] items-center gap-5 px-6 py-5">
    <span className="font-display text-5xl font-bold leading-none tabular-nums text-falcons-primary">
      {String(number).padStart(2, '0')}
    </span>

    <div className="min-w-0">
      <h2 className="font-display text-xl font-semibold uppercase tracking-[0.08em] text-white">{title}</h2>
      <div className="mt-1.5 text-[15px] leading-relaxed text-ink-300">{children}</div>
    </div>

    {action && <div className="shrink-0">{action}</div>}
  </li>
);

export const MainPage: FC = () => {
  const { isServerRunning, startServer } = useServer();
  const { getDownloadStatus } = useDownloader();
  const { pushNotification } = useNotifications();
  const [installed, setInstalled] = useState<number | null>(null);

  useEffect(() => {
    getDownloadStatus()
      .then((list) =>
        setInstalled(list.filter((item) => item.status === 'downloaded' || item.status === 'update-available').length)
      )
      .catch(() => setInstalled(0));
  }, [getDownloadStatus]);

  const handleStart = async () => {
    try {
      pushNotification(await startServer(), 'success');
    } catch (error) {
      pushNotification(String(error), 'error');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(OVERLAY_SERVER_URL);
      pushNotification('Browser source URL copied', 'success');
    } catch {
      pushNotification('Copy failed, select the URL and copy it by hand', 'error');
    }
  };

  const hasOverlays = (installed ?? 0) > 0;

  return (
    <>
      <PageHeader
        eyebrow="Broadcast setup"
        title="Start"
        description="Four steps from a fresh install to live graphics. Each one links to where it's done."
      />

      <ol className="panel divide-y divide-ink-600">
        <Step
          number={1}
          title="Install your overlays"
          action={
            <Link to="/files" className="btn btn-secondary">
              Overlays <ArrowRightIcon size={16} />
            </Link>
          }
        >
          {installed === null
            ? 'Checking what is installed...'
            : hasOverlays
              ? `${installed} installed. Add or update games on the Overlays page.`
              : 'Pick the games you broadcast. Only installed overlays appear in Controls.'}
        </Step>

        <Step
          number={2}
          title="Start the overlay server"
          action={
            isServerRunning ? (
              <Link to="/server" className="btn btn-secondary">
                Server <ArrowRightIcon size={16} />
              </Link>
            ) : (
              <button onClick={handleStart} className="btn btn-primary">
                Start server
              </button>
            )
          }
        >
          OBS loads the graphics from this app, so the server has to be running before you go live.
        </Step>

        <Step number={3} title="Add a browser source in OBS">
          <p>
            Use the address below, sized {OVERLAY_DIMENSIONS.width} × {OVERLAY_DIMENSIONS.height}.
          </p>
          <div className="mt-3 flex max-w-md items-stretch">
            <code className="flex-1 truncate border border-r-0 border-ink-600 bg-ink-900 px-3 py-2 font-mono text-sm text-ink-100">
              {OVERLAY_SERVER_URL}
            </code>
            <button
              onClick={handleCopy}
              className="flex w-11 items-center justify-center border border-ink-600 bg-ink-700 text-ink-100 transition-colors hover:bg-ink-600"
              aria-label="Copy URL"
              title="Copy URL"
            >
              <CopyIcon />
            </button>
          </div>
        </Step>

        <Step
          number={4}
          title="Run the match"
          action={
            <Link to="/controls" className="btn btn-secondary">
              Controls <ArrowRightIcon size={16} />
            </Link>
          }
        >
          Switch overlays, update names and scores, and push changes to the stream.
        </Step>
      </ol>
    </>
  );
};
