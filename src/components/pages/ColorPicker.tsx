import { FC, useState, useEffect, useRef } from 'react';
import { hexToHsl, hslToHex, isHexColor } from '../../utils/color';

interface Props {
  value: string;
  onChange: (color: string) => void;
  // Called while a colour is being dragged or typed, before it's committed
  onLiveChange?: (color: string) => void;
  direction?: 'up' | 'down';
}

const PRESETS = [
  '#be0f32', '#ffffff', '#000000', '#1a1a2e',
  '#0057b7', '#ffd700', '#00a651', '#ff6b00',
  '#6a0dad', '#00bcd4', '#ff4081', '#607d8b',
];

export const ColorPicker: FC<Props> = ({ value, onChange, onLiveChange, direction = 'up' }) => {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value);
  const [hsl, setHsl] = useState<[number, number, number]>(() => hexToHsl(value));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHex(value); setHsl(hexToHsl(value)); }, [value]);

  // A half-typed value isn't a colour, so it's put back instead of being sent on
  const commit = () => {
    if (isHexColor(hex)) {
      onChange(hex);
    } else {
      setHex(value);
      setHsl(hexToHsl(value));
    }
  };

  const handleClose = () => {
    setOpen(false);
    commit();
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [hex, open, value]);

  const applyHsl = (h: number, s: number, l: number) => {
    const newHex = hslToHex(h, s, l);
    setHsl([h, s, l]);
    setHex(newHex);
    onLiveChange?.(newHex);
  };

  const handleHexInput = (raw: string) => {
    setHex(raw);
    if (isHexColor(raw)) {
      setHsl(hexToHsl(raw));
      onLiveChange?.(raw);
    }
  };

  const makeSliderBackground = (type: 'h' | 's' | 'l') => {
    const [h, s, l] = hsl;
    if (type === 'h') return `linear-gradient(to right, hsl(0,${s}%,${l}%), hsl(30,${s}%,${l}%), hsl(60,${s}%,${l}%), hsl(120,${s}%,${l}%), hsl(180,${s}%,${l}%), hsl(240,${s}%,${l}%), hsl(300,${s}%,${l}%), hsl(360,${s}%,${l}%))`;
    if (type === 's') return `linear-gradient(to right, hsl(${h},0%,${l}%), hsl(${h},100%,${l}%))`;
    return `linear-gradient(to right, hsl(${h},${s}%,0%), hsl(${h},${s}%,50%), hsl(${h},${s}%,100%))`;
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => open ? handleClose() : setOpen(true)}
          className="h-10 w-10 shrink-0 border border-ink-500"
          style={{ backgroundColor: hex }}
          aria-label="Open colour picker"
        />
        <input
          type="text"
          value={hex}
          onChange={(e) => handleHexInput(e.target.value)}
          onBlur={commit}
          className="field font-mono"
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      {open && (
        <div className={`absolute z-50 w-60 border border-ink-500 bg-ink-850 p-4 shadow-xl shadow-black/60 ${direction === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
          <div className="mb-3 h-8 w-full border border-ink-600" style={{ backgroundColor: hex }} />

          {(['h', 's', 'l'] as const).map((type, i) => (
            <div key={type} className="mb-3">
              <div className="mb-1 flex justify-between font-mono text-[11px] uppercase text-ink-300">
                <span>{type === 'h' ? 'Hue' : type === 's' ? 'Saturation' : 'Lightness'}</span>
                <span>{hsl[i]}{type !== 'h' ? '%' : '°'}</span>
              </div>
              <input
                type="range"
                min={0}
                max={type === 'h' ? 360 : 100}
                value={hsl[i]}
                onChange={(e) => {
                  const updated: [number, number, number] = [...hsl] as [number, number, number];
                  updated[i] = Number(e.target.value);
                  applyHsl(...updated);
                }}
                className="h-3 w-full cursor-pointer appearance-none"
                style={{ background: makeSliderBackground(type) }}
              />
            </div>
          ))}

          <div className="grid grid-cols-6 gap-1 mt-3">
            {PRESETS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => { setHex(color); setHsl(hexToHsl(color)); setOpen(false); onLiveChange?.(color); onChange(color); }}
                className={`h-7 w-7 border transition-transform hover:scale-110 ${hex === color ? 'border-white ring-1 ring-white' : 'border-ink-500'}`}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};