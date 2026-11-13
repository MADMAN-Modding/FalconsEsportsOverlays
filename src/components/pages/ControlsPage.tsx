import { FC, ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { invoke } from '@tauri-apps/api/core';
import { useNotifications } from '../../hooks/useNotifications';
import { useJsonHandler } from '../../hooks/useJsonHandler';
import { getOverlayStateJSON, useOverlayHandler } from '../../hooks/useOverlayHandler';
import { useOverlayImages } from '../../hooks/useOverlayImages';
import { getCodeDir, getNameMap } from '../../utils/tauriHelpers';
import { OVERLAY_KEYS } from '../../utils/constants';
import { ColorPicker } from './ColorPicker';
import { PreviewModal } from './PreviewModal';
import { PageHeader, Panel, Field, Segmented, Stepper, EyeIcon, SwapIcon } from '../ui';

type Side = 'Left' | 'Right';

interface MatchState {
  scoreLeft: string;
  scoreRight: string;
  playerNamesLeft: string;
  playerNamesRight: string;
  teamNameLeft: string;
  teamNameRight: string;
  teamColorLeft: string;
  teamColorRight: string;
  winsLeft: number;
  winsRight: number;
  week: number;
  currentOverlay: string;
}

interface TeamPanelProps {
  side: Side;
  state: MatchState;
  onText: (key: string, value: string) => void;
  onWins: (side: Side, wins: number) => void;
  onColor: (side: Side, color: string) => void;
}

const TeamPanel: FC<TeamPanelProps> = ({ side, state, onText, onWins, onColor }) => {
  const key = (name: string) => `${name}${side}` as keyof MatchState;
  const lower = side.toLowerCase();

  return (
    <div className="panel">
      {/* The team's colour runs along the top so it's clear whose panel this is */}
      <div className="h-1.5" style={{ backgroundColor: state[key('teamColor')] as string }} />

      <div className="panel-header">
        <h2 className="panel-title">{side} team</h2>
      </div>

      <div className="space-y-5 p-5">
        <Field label="Team name" htmlFor={`${lower}-team`}>
          <textarea
            id={`${lower}-team`}
            value={state[key('teamName')] as string}
            onChange={(e) => onText(`teamName${side}`, e.target.value)}
            className="field resize-none"
            rows={2}
          />
        </Field>

        <Field label="Players" htmlFor={`${lower}-players`}>
          <textarea
            id={`${lower}-players`}
            value={state[key('playerNames')] as string}
            onChange={(e) => onText(`playerNames${side}`, e.target.value)}
            className="field resize-none"
            rows={3}
          />
        </Field>

        <div>
          <p className="label">Score</p>
          <Stepper
            label={`${side} score`}
            value={state[key('score')] as string}
            onChange={(value) => onText(`score${side}`, value)}
          />
        </div>

        <div>
          <p className="label">Games won</p>
          <Segmented
            label={`${side} games won`}
            options={[0, 1, 2, 3, 4, 5]}
            value={state[key('wins')] as number}
            onChange={(wins) => onWins(side, wins)}
          />
        </div>

        <div>
          <p className="label">Team colour</p>
          <ColorPicker value={state[key('teamColor')] as string} onChange={(color) => onColor(side, color)} />
        </div>
      </div>
    </div>
  );
};

interface StatusDotProps {
  tone: 'ok' | 'warn';
  children: ReactNode;
}

const StatusDot: FC<StatusDotProps> = ({ tone, children }) => (
  <p className="flex items-center gap-2.5 text-[15px] text-ink-200" aria-live="polite">
    <span className={`h-2.5 w-2.5 ${tone === 'ok' ? 'bg-signal' : 'animate-livePulse bg-caution'}`} aria-hidden="true" />
    {children}
  </p>
);

export const ControlsPage: FC = () => {
  const { pushNotification } = useNotifications();
  const { writeOverlayJSON, writeOverlayJSONValues } = useJsonHandler();
  const { overlays, updateOverlayList } = useOverlayHandler(true);
  const { getMultipleOverlayImages, imageCache } = useOverlayImages();
  const [nameMap, setNameMap] = useState<Record<string, string>>({});
  const [codeDir, setCodeDir] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [state, setState] = useState<MatchState>({
    scoreLeft: '0',
    scoreRight: '0',
    playerNamesLeft: '',
    playerNamesRight: '',
    teamNameLeft: '',
    teamNameRight: '',
    teamColorLeft: '#be0f32',
    teamColorRight: '#ffffff',
    winsLeft: 0,
    winsRight: 0,
    week: 1,
    currentOverlay: '',
  });

  // What the overlay is showing right now, used to tell which edits haven't been sent yet
  const [sent, setSent] = useState<Record<string, string> | null>(null);

  const snapshot = (source: MatchState) =>
    Object.fromEntries(OVERLAY_KEYS.map((key) => [key, String(source[key as keyof MatchState]).replace(/"/g, '')]));

  useEffect(() => {
    const initialize = async () => {
      try {
        // The calls are independent so they run concurrently
        const [names, code, , overlay, overlayState] = await Promise.all([
          getNameMap(),
          getCodeDir(),
          updateOverlayList(),
          invoke<string>('get_current_overlay'),
          getOverlayStateJSON(),
        ]);

        const merged = { ...overlayState, currentOverlay: overlay } as unknown as MatchState;

        setNameMap(names);
        setCodeDir(code);
        setState((prev) => ({ ...prev, ...merged }));
        setSent(snapshot({ ...state, ...merged }));
      } catch (error) {
        console.error('Error initializing controls page:', error);
        pushNotification('Could not load the current overlay settings', 'error');
      } finally {
        setLoaded(true);
      }
    };

    initialize();
  }, []);

  useEffect(() => {
    if (overlays.length > 0 && codeDir) {
      getMultipleOverlayImages(overlays, codeDir);
    }
  }, [overlays, codeDir, getMultipleOverlayImages]);

  const dirty = useMemo(() => {
    if (!sent) return false;
    const now = snapshot(state);
    return OVERLAY_KEYS.some((key) => now[key] !== sent[key]);
  }, [state, sent]);

  const setField = (key: string, value: string | number) => setState((prev) => ({ ...prev, [key]: value }));

  const handleSend = useCallback(async () => {
    try {
      const values = snapshot(state);
      await writeOverlayJSONValues(values);
      setSent(values);
      pushNotification('Sent to the overlay', 'success');
    } catch {
      pushNotification('Could not update the overlay', 'error');
    }
  }, [state, writeOverlayJSONValues, pushNotification]);

  // Cmd/Ctrl + Enter sends from anywhere on the page
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter' && dirty) {
        event.preventDefault();
        handleSend();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dirty, handleSend]);

  const handleSwap = () => {
    setState((prev) => ({
      ...prev,
      scoreLeft: prev.scoreRight,
      scoreRight: prev.scoreLeft,
      playerNamesLeft: prev.playerNamesRight,
      playerNamesRight: prev.playerNamesLeft,
      teamNameLeft: prev.teamNameRight,
      teamNameRight: prev.teamNameLeft,
      teamColorLeft: prev.teamColorRight,
      teamColorRight: prev.teamColorLeft,
    }));
  };

  // Wins, colours and the chosen overlay go live straight away, text and scores wait for Send
  const handleWins = async (side: Side, wins: number) => {
    setField(`wins${side}`, wins);

    try {
      await writeOverlayJSON(`wins${side}`, String(wins));
    } catch {
      pushNotification('Could not update the games won', 'error');
    }
  };

  const handleColor = async (side: Side, color: string) => {
    setField(`teamColor${side}`, color);
    setSent((prev) => (prev ? { ...prev, [`teamColor${side}`]: color } : prev));

    try {
      await writeOverlayJSON(`teamColor${side}`, color);
    } catch {
      pushNotification('Could not update the team colour', 'error');
    }
  };

  const handleSwitchOverlay = async (overlay: string) => {
    setField('currentOverlay', overlay);

    try {
      await writeOverlayJSON('overlay', overlay);
      pushNotification(`On air: ${nameMap[overlay] || overlay}`, 'success');
    } catch {
      pushNotification('Could not change the overlay', 'error');
    }
  };

  const nameOf = (overlay: string) => nameMap[overlay] || overlay;

  return (
    <>
      <PageHeader
        eyebrow="Live control"
        title="Controls"
        actions={
          <button onClick={() => setShowPreview(true)} className="btn btn-secondary">
            <EyeIcon size={16} /> Preview
          </button>
        }
      />

      <Panel
        title="On air"
        bodyClassName="p-5"
        actions={
          <label className="flex items-center gap-3">
            <span className="label !mb-0">Week</span>
            <input
              type="number"
              min={0}
              value={state.week}
              onChange={(e) => setField('week', Number(e.target.value))}
              className="field h-8 w-20 py-0 text-center font-mono"
            />
          </label>
        }
      >
        {loaded && overlays.length === 0 ? (
          <p className="py-4 text-ink-300">
            No overlays are switched on.{' '}
            <Link to="/files" className="text-white underline underline-offset-4 hover:text-falcons-bright">
              Install one on the Overlays page
            </Link>{' '}
            to use it here.
          </p>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-1" role="group" aria-label="Overlay">
            {overlays.map((overlay) => {
              const active = state.currentOverlay === overlay;
              const image = imageCache[overlay];
              const hasImage = image && image !== 'images/missing.jpg';

              return (
                <button
                  key={overlay}
                  onClick={() => handleSwitchOverlay(overlay)}
                  aria-pressed={active}
                  className="group relative flex w-[112px] shrink-0 flex-col items-start justify-start self-start text-left"
                >
                  <span
                    className={`relative block h-[112px] w-[112px] overflow-hidden border-2 bg-ink-900 transition-colors ${
                      active ? 'border-falcons-primary' : 'border-ink-600 group-hover:border-ink-400'
                    }`}
                  >
                    {hasImage ? (
                      <img src={image} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center px-2 text-center font-display text-sm uppercase text-ink-400">
                        {nameOf(overlay)}
                      </span>
                    )}
                    {active && (
                      <span className="absolute left-0 top-0 bg-falcons-primary px-2 py-0.5 font-display text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                        On air
                      </span>
                    )}
                  </span>
                  <span
                    className={`mt-2 line-clamp-2 block font-display text-[14px] font-medium uppercase leading-tight tracking-[0.06em] ${
                      active ? 'text-white' : 'text-ink-300 group-hover:text-white'
                    }`}
                  >
                    {nameOf(overlay)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </Panel>

      <div className="mt-6 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-4">
        <TeamPanel side="Left" state={state} onText={setField} onWins={handleWins} onColor={handleColor} />

        <div className="flex flex-col items-center justify-center gap-3">
          <span className="font-display text-2xl font-bold tracking-widest text-ink-500">VS</span>
          <button
            onClick={handleSwap}
            className="btn btn-secondary btn-icon"
            aria-label="Swap teams"
            title="Swap teams"
          >
            <SwapIcon size={18} />
          </button>
        </div>

        <TeamPanel side="Right" state={state} onText={setField} onWins={handleWins} onColor={handleColor} />
      </div>

      <div className="sticky bottom-0 -mx-10 -mb-9 mt-8 flex items-center justify-between gap-6 border-t border-ink-600 bg-ink-950 px-10 py-4">
        {dirty ? (
          <StatusDot tone="warn">Changes aren't on the overlay yet</StatusDot>
        ) : (
          <StatusDot tone="ok">Overlay is up to date</StatusDot>
        )}

        <div className="flex items-center gap-4">
          <span className="hidden font-mono text-xs text-ink-400 lg:block">⌘ / Ctrl + Enter</span>
          <button onClick={handleSend} disabled={!dirty} className="btn btn-primary h-11 px-8 text-base">
            Send to overlay
          </button>
        </div>
      </div>

      {showPreview && <PreviewModal onClose={() => setShowPreview(false)} />}
    </>
  );
};
