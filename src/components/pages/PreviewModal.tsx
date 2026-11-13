import { FC, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useServer } from '../../hooks/useServer';
import { OVERLAY_DIMENSIONS, OVERLAY_SERVER_URL } from '../../utils/constants';
import { XIcon } from '../ui';

interface PreviewModalProps {
  onClose: () => void;
}

// The overlay is a fixed 1920x1080 page, so it's scaled to whatever width the window gives it
export const PreviewModal: FC<PreviewModalProps> = ({ onClose }) => {
  const { isServerRunning } = useServer();
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const element = frameRef.current;
    if (!element) return;

    const observer = new ResizeObserver(() => setScale(element.clientWidth / OVERLAY_DIMENSIONS.width));
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 p-8"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Overlay preview"
    >
      <div className="panel w-full max-w-[1180px]">
        <header className="panel-header">
          <h2 className="panel-title">Live preview</h2>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-ink-400">
              {OVERLAY_DIMENSIONS.width} × {OVERLAY_DIMENSIONS.height}
            </span>
            <button onClick={onClose} className="btn btn-ghost btn-sm btn-icon" aria-label="Close preview">
              <XIcon size={16} />
            </button>
          </div>
        </header>

        <div ref={frameRef} className="relative aspect-video w-full overflow-hidden bg-black">
          {isServerRunning ? (
            <iframe
              title="Overlay preview"
              src={`${OVERLAY_SERVER_URL}/`}
              className="absolute left-0 top-0 border-0"
              style={{
                width: OVERLAY_DIMENSIONS.width,
                height: OVERLAY_DIMENSIONS.height,
                transform: `scale(${scale})`,
                transformOrigin: 'top left',
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center">
              <p className="font-display text-3xl font-bold uppercase tracking-wide text-ink-300">Server is off</p>
              <p className="text-ink-400">The preview comes from the overlay server.</p>
              <Link to="/server" className="btn btn-primary mt-2" onClick={onClose}>
                Open server
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
