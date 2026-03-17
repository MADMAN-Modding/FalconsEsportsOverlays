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
        falcons: {
          primary: '#bf0f35',
          dark: '#000000',
          light: '#ffffff',
        },
      },
    },
  },
  plugins: [],
}
