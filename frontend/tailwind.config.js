/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          50: '#FAF7F4',   // Clean warm canvas
          100: '#F5EFE9',  // Soft warm surface
          150: '#EFE7DF',  // Hover surface
          200: '#E6DCD2',  // Hairline border
          300: '#D5C4B4',  // Active border
          400: '#B8997E',  // Muted light brown
          500: '#9B785B',  // Caramel brown
          600: '#855E40',  // Rich warm light brown (primary button)
          700: '#6E4B31',  // Deep warm brown (hover)
          800: '#4E3420',  // Dark espresso
          900: '#26190E',  // Deepest brown
          dark: '#1F1A15', // Near-black charcoal text
          muted: '#6F6357',// Secondary label text
          subtle: '#9A8C7F',// Tertiary text
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Manrope', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'warm-xs': '0 1px 2px 0 rgba(31, 26, 21, 0.04)',
        'warm-sm': '0 1px 3px 0 rgba(31, 26, 21, 0.05), 0 2px 8px -2px rgba(31, 26, 21, 0.03)',
        'warm-md': '0 4px 16px -2px rgba(31, 26, 21, 0.06), 0 2px 4px -1px rgba(31, 26, 21, 0.03)',
        'warm-lg': '0 12px 32px -4px rgba(31, 26, 21, 0.08), 0 4px 12px -2px rgba(31, 26, 21, 0.04)',
        'warm-focus': '0 0 0 3px rgba(133, 94, 64, 0.18)',
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
}
