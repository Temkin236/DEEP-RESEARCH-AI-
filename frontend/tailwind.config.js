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
        theme: {
          'bg-main': '#FAF7F2',       // Warm ivory
          'bg-secondary': '#F3EADF',  // Light cream
          'primary': '#B89576',       // Light warm brown
          'primary-hover': '#9B785B', // Medium brown
          'surface-soft': '#E8D8C5',  // Soft brown surface
          'border-beige': '#E5D8C8',  // Light border beige
          'text-main': '#332B25',     // Deep warm charcoal
          'text-secondary': '#75685D',// Muted brown-gray
          'card-surface': '#FFFEFC',  // White card surface
          'success': '#52785C',       // Muted forest green
          'warning': '#B77932',       // Warm amber
          'error': '#B6534B',         // Muted red
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px 0 rgba(51, 43, 37, 0.05)',
        'warm-md': '0 4px 12px 0 rgba(51, 43, 37, 0.07)',
        'warm-lg': '0 10px 25px -5px rgba(51, 43, 37, 0.1)',
      },
    },
  },
  plugins: [],
}
