import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { DownloadInfo, useDownloader } from '../../hooks/useDownloader';
import { useJsonHandler } from '../../hooks/useJsonHandler';
import { useNotifications } from '../../hooks/useNotifications';
import { useOverlayHandler } from '../../hooks/useOverlayHandler';
import { useOverlayImages } from '../../hooks/useOverlayImages';
import { getCodeDir, getNameMap } from '../../utils/tauriHelpers';
import { PageHeader, Switch, DownloadIcon, TrashIcon, XIcon } from '../ui';

const isInstalled = (item: DownloadInfo) => item.status === 'downloaded' || item.status === 'update-available';

const initials = (name: string) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase();

const versionText = (item: DownloadInfo) => {
  const local = item.localVersion === null || item.localVersion === 'null' ? 0 : item.localVersion;

  if (item.status === 'update-available') return `v${local} → v${item.availableVersion}`;
  if (item.status === 'downloaded') return `v${local}`;
  return `v${item.availableVersion}`;
};

interface SectionProps {
  title: string;
  count: number;
  children: ReactNode;
}

const Section: FC<SectionProps> = ({ title, count, children }) => (
  <section className="mb-8">
    <h2 className="mb-3 flex items-baseline gap-2 font-display text-[15px] font-semibold uppercase tracking-[0.16em] text-ink-300">
      {title}
      <span className="font-mono text-xs text-ink-500">{count}</span>
    </h2>
    <ul className="panel divide-y divide-ink-600">{children}</ul>
  </section>
);

export const FilesPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { writeConfigJSON } = useJsonHandler();
  const { downloadOverlay, getDownloadStatus } = useDownloader();
  const { updateOverlayList, deleteOverlay } = useOverlayHandler(false);
  const { getMultipleOverlayImages, imageCache } = useOverlayImages();

  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<DownloadInfo[]>([]);
  const [available, setAvailable] = useState<Set<string> | null>(null);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({});
  const [codeDir, setCodeDir] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<Record<string, boolean>>({});
  const [confirming, setConfirming] = useState<string | null>(null);

  const nameOf = useCallback((overlay: string) => nameMap[overlay] || overlay, [nameMap]);

  const refresh = useCallback(async () => {
    const list = await getDownloadStatus();
    setStatus(list);

    const installed = list.filter(isInstalled).map((item) => item.overlay);
    const states = await invoke<Record<string, boolean>>('get_overlays_enabled', { overlays: installed });
    setEnabled(states);
  }, [getDownloadStatus]);

  useEffect(() => {
    const initialize = async () => {
      try {
        const [names, dir] = await Promise.all([getNameMap(), getCodeDir()]);
        setNameMap(names);
        setCodeDir(dir);
        await refresh();
      } catch (error) {
        console.error('Error initializing overlays page:', error);
      } finally {
        setLoading(false);
      }

      // Without the list every overlay is treated as installable
      invoke<string[]>('get_available_overlays')
        .then((names) => setAvailable(new Set(names)))
        .catch(() => setAvailable(null));
    };

    initialize();
  }, [refresh]);

  useEffect(() => {
    const installed = status.filter(isInstalled).map((item) => item.overlay);

    if (installed.length > 0 && codeDir) {
      getMultipleOverlayImages(installed, codeDir);
    }
  }, [status, codeDir, getMultipleOverlayImages]);

  const run = async (overlay: string, task: () => Promise<void>, failure: string) => {
    setBusy((prev) => ({ ...prev, [overlay]: true }));

    try {
      await task();
    } catch (error) {
      pushNotification(`${failure}: ${String((error as Error)?.message ?? error)}`, 'error');
    } finally {
      setBusy((prev) => ({ ...prev, [overlay]: false }));
    }
  };

  const install = (overlay: string) =>
    run(
      overlay,
      async () => {
        const wasInstalled = status.some((item) => item.overlay === overlay && isInstalled(item));

        await downloadOverlay(overlay);

        // A new overlay should be usable straight away, not hidden until it's switched on elsewhere
        if (!wasInstalled) await writeConfigJSON(`${overlay}Checked`, 'true');

        await updateOverlayList();
        await refresh();
        pushNotification(`${nameOf(overlay)} installed`, 'success');
      },
      `Could not install ${nameOf(overlay)}`
    );

  const remove = (overlay: string) => {
    setConfirming(null);

    return run(
      overlay,
      async () => {
        await deleteOverlay(overlay);
        await refresh();
        pushNotification(`${nameOf(overlay)} removed`, 'success');
      },
      `Could not remove ${nameOf(overlay)}`
    );
  };

  const toggleEnabled = async (overlay: string, value: boolean) => {
    setEnabled((prev) => ({ ...prev, [overlay]: value }));

    try {
      await writeConfigJSON(`${overlay}Checked`, String(value));
    } catch {
      setEnabled((prev) => ({ ...prev, [overlay]: !value }));
      pushNotification('Could not save that change', 'error');
    }
  };

  const updateAll = async () => {
    for (const item of status.filter((entry) => entry.status === 'update-available')) {
      await install(item.overlay);
    }
  };

  const { installed, installable, soon } = useMemo(() => {
    const byName = (a: DownloadInfo, b: DownloadInfo) => nameOf(a.overlay).localeCompare(nameOf(b.overlay));
    const rest = status.filter((item) => !isInstalled(item));
    const canInstall = (item: DownloadInfo) => available === null || available.has(item.overlay);

    return {
      installed: status.filter(isInstalled).sort(byName),
      installable: rest.filter(canInstall).sort(byName),
      soon: rest.filter((item) => !canInstall(item)).sort(byName),
    };
  }, [status, available, nameOf]);

  const updates = installed.filter((item) => item.status === 'update-available').length;

  if (loading) {
    return <p className="py-16 text-center font-mono text-sm text-ink-400">Loading overlays...</p>;
  }

  const renderRow = (item: DownloadInfo, kind: 'installed' | 'installable' | 'soon') => {
    const name = nameOf(item.overlay);
    const image = imageCache[item.overlay];
    const hasImage = kind === 'installed' && image && image !== 'images/missing.jpg';
    const working = busy[item.overlay];

    return (
      <li
        key={item.overlay}
        className={`grid grid-cols-[64px_1fr_168px_104px_96px] items-center gap-5 px-5 py-4 ${kind === 'soon' ? 'opacity-50' : ''}`}
        aria-disabled={kind === 'soon'}
      >
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden border border-ink-600 bg-ink-900">
          {hasImage ? (
            <img src={image} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="font-display text-xl font-bold tracking-wider text-ink-500">{initials(name)}</span>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <h3 className="truncate font-display text-xl font-semibold uppercase tracking-[0.06em] text-white">{name}</h3>
            {item.status === 'update-available' && <span className="tag tag-warn">Update</span>}
            {kind === 'soon' && <span className="tag tag-off">Coming soon</span>}
          </div>
          <p className="mt-0.5 font-mono text-xs text-ink-400">{kind === 'soon' ? 'Not published yet' : versionText(item)}</p>
        </div>

        <div className="flex justify-end">
          {kind === 'installed' && (
            <label className="flex items-center gap-2.5 text-sm text-ink-300">
              <span className="font-display text-[13px] uppercase tracking-[0.12em]">In controls</span>
              <Switch
                checked={enabled[item.overlay] ?? false}
                onChange={(value) => toggleEnabled(item.overlay, value)}
                label={`Show ${name} in Controls`}
              />
            </label>
          )}
        </div>

        <div className="flex justify-end">
          {kind === 'installable' && (
            <button onClick={() => install(item.overlay)} disabled={working} className="btn btn-primary">
              <DownloadIcon size={16} /> {working ? 'Installing...' : 'Install'}
            </button>
          )}

          {kind === 'installed' && item.status === 'update-available' && (
            <button onClick={() => install(item.overlay)} disabled={working} className="btn btn-primary">
              {working ? 'Updating...' : 'Update'}
            </button>
          )}
        </div>

        <div className="flex justify-end">
          {kind === 'installed' &&
            (confirming === item.overlay ? (
              <div className="flex items-center gap-1">
                <button onClick={() => remove(item.overlay)} className="btn btn-danger btn-sm">
                  Remove
                </button>
                <button
                  onClick={() => setConfirming(null)}
                  className="btn btn-ghost btn-sm btn-icon"
                  aria-label="Cancel"
                >
                  <XIcon size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(item.overlay)}
                disabled={working}
                className="btn btn-ghost btn-sm btn-icon"
                aria-label={`Remove ${name}`}
                title="Remove"
              >
                <TrashIcon size={16} />
              </button>
            ))}
        </div>
      </li>
    );
  };

  return (
    <>
      <PageHeader
        eyebrow="Library"
        title="Overlays"
        description="Install the games you broadcast. Installed overlays can be switched on for Controls."
        actions={
          updates > 0 ? (
            <button onClick={updateAll} className="btn btn-primary">
              Update all ({updates})
            </button>
          ) : undefined
        }
      />

      {installed.length > 0 && (
        <Section title="Installed" count={installed.length}>
          {installed.map((item) => renderRow(item, 'installed'))}
        </Section>
      )}

      {installable.length > 0 && (
        <Section title="Available" count={installable.length}>
          {installable.map((item) => renderRow(item, 'installable'))}
        </Section>
      )}

      {soon.length > 0 && (
        <Section title="Coming soon" count={soon.length}>
          {soon.map((item) => renderRow(item, 'soon'))}
        </Section>
      )}

      {status.length === 0 && (
        <p className="panel px-6 py-10 text-center text-ink-300">
          The overlay list couldn't be loaded. Check your connection and reopen the app.
        </p>
      )}
    </>
  );
};
