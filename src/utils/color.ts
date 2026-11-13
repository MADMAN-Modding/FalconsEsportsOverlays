export const DEFAULT_ACCENT = '#bf0f35';

const ACCENT_STORAGE_KEY = 'accent';

export const isHexColor = (value: string) => /^#[0-9a-fA-F]{6}$/.test(value);

export const hexToHsl = (hex: string): [number, number, number] => {
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

export const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100; l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const rgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];

// WCAG relative luminance, used to pick text that stays readable on the accent
const luminance = (hex: string) => {
  const [r, g, b] = rgb(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export interface AccentShades {
  primary: string;
  bright: string;
  deep: string;
  on: string;
}

// The UI sits on near-black, so a very dark pick is lifted until it can be seen
export const deriveAccent = (hex: string): AccentShades => {
  const [h, s, l] = hexToHsl(hex);
  const base = clamp(l, 30, 85);
  const primary = hslToHex(h, s, base);

  return {
    primary,
    bright: hslToHex(h, s, clamp(base + 9, 52, 92)),
    deep: hslToHex(h, s, clamp(base - 11, 14, 60)),
    on: luminance(primary) > 0.4 ? '#0c0c10' : '#ffffff',
  };
};

const channels = (hex: string) => rgb(hex).join(' ');

// Writes the accent as CSS variables, which Tailwind's falcons colours read
export const applyAccent = (hex: string) => {
  const color = isHexColor(hex) ? hex : DEFAULT_ACCENT;
  const shades = deriveAccent(color);
  const style = document.documentElement.style;

  style.setProperty('--accent', channels(shades.primary));
  style.setProperty('--accent-bright', channels(shades.bright));
  style.setProperty('--accent-deep', channels(shades.deep));
  style.setProperty('--accent-on', channels(shades.on));
};

// Kept locally as well so the next launch is coloured from the first frame
export const rememberAccent = (hex: string) => localStorage.setItem(ACCENT_STORAGE_KEY, hex);

export const rememberedAccent = (): string | null => {
  const stored = localStorage.getItem(ACCENT_STORAGE_KEY);
  return stored && isHexColor(stored) ? stored : null;
};
