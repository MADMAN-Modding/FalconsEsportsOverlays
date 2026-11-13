import { FC, useState, useEffect, useRef } from 'react';

interface Props {
  value: string;
  onChange: (color: string) => void;
}

const hexToHsl = (hex: string): [number, number, number] => {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};

const PRESETS = [
  '#be0f32', '#ffffff', '#000000', '#1a1a2e',
  '#0057b7', '#ffd700', '#00a651', '#ff6b00',
  '#6a0dad', '#00bcd4', '#ff4081', '#607d8b',
];

export const ColorPicker: FC<Props> = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [hex, setHex] = useState(value);
  const [hsl, setHsl] = useState<[number, number, number]>(() => hexToHsl(value));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setHex(value); setHsl(hexToHsl(value)); }, [value]);

  const handleClose = () => {
    setOpen(false);
    onChange(hex);
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [hex]);

  const applyHsl = (h: number, s: number, l: number) => {
    const newHex = hslToHex(h, s, l);
    setHsl([h, s, l]);
    setHex(newHex);
  };

  const handleHexInput = (raw: string) => {
    setHex(raw);
    if (/^#[0-9a-fA-F]{6}$/.test(raw)) {
      setHsl(hexToHsl(raw));
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
          onBlur={() => onChange(hex)}
          className="field font-mono"
          placeholder="#000000"
          maxLength={7}
        />
      </div>

      {open && (
        <div className="absolute bottom-full z-50 mb-2 w-60 border border-ink-500 bg-ink-850 p-4 shadow-xl shadow-black/60">
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
                onClick={() => { setHex(color); setHsl(hexToHsl(color)); setOpen(false); onChange(color); }}
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