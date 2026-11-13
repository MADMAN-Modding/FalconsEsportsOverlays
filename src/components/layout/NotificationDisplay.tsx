import { FC } from 'react';
import parse from 'html-react-parser';
import { useNotifications } from '../../hooks/useNotifications';
import { NotificationKind } from '../../types';

const KINDS: Record<NotificationKind, { label: string; accent: string; text: string }> = {
  info: { label: 'Info', accent: 'border-l-ink-300', text: 'text-ink-300' },
  success: { label: 'Done', accent: 'border-l-signal', text: 'text-signal' },
  error: { label: 'Error', accent: 'border-l-danger', text: 'text-danger' },
};

export const NotificationDisplay: FC = () => {
  const { notifications, dismissNotification } = useNotifications();

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2" role="status" aria-live="polite">
      {notifications.map((notification) => {
        const kind = KINDS[notification.kind];

        return (
          <button
            key={notification.id}
            type="button"
            onClick={() => dismissNotification(notification.id)}
            className={`pointer-events-auto min-w-[260px] max-w-[420px] animate-toastIn border border-l-[3px] border-ink-600 ${kind.accent} bg-ink-850 px-4 py-3 text-left shadow-lg shadow-black/60`}
          >
            <span className={`block font-display text-[12px] font-semibold uppercase tracking-[0.18em] ${kind.text}`}>
              {kind.label}
            </span>
            {/* Update messages arrive as HTML with their own link colours, which don't suit a dark panel */}
            <span className="block text-[15px] text-ink-100 [&_a]:!text-white [&_a]:underline">{parse(notification.text)}</span>
          </button>
        );
      })}
    </div>
  );
};
