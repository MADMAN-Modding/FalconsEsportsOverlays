/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Cool near-black neutrals, deliberately not Tailwind's gray
        ink: {
          950: "#07070a",
          900: "#0c0c10",
          850: "#111116",
          800: "#16161c",
          700: "#1e1e26",
          600: "#2a2a34",
          500: "#3b3b48",
          400: "#6a6a7a",
          300: "#9696a6",
          200: "#c2c2cf",
          100: "#e7e7ee",
        },
        // The accent is set at runtime from Settings, see src/utils/color.ts
        falcons: {
          primary: 'rgb(var(--accent) / <alpha-value>)',
          bright: 'rgb(var(--accent-bright) / <alpha-value>)',
          deep: 'rgb(var(--accent-deep) / <alpha-value>)',
          on: 'rgb(var(--accent-on) / <alpha-value>)',
          dark: '#000000',
          light: '#ffffff',
        },
        danger: '#e0153f',
        signal: '#35d07f',
        caution: '#f2a51a',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', 'Barlow', 'system-ui', 'sans-serif'],
        sans: ['Barlow', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      keyframes: {
        toastIn: {
          from: { opacity: '0', transform: 'translateX(16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        livePulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        toastIn: 'toastIn 180ms ease-out',
        livePulse: 'livePulse 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
