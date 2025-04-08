/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      colors: {
        'pkmn-dark': '#081820',
        'pkmn-medium': '#3466eb',
        'pkmn-light': '#f8f8f8',
        'pkmn-red': '#e3350d',
        'pkmn-blue': '#3466eb',
        'pkmn-yellow': '#ffcb05',
        'pkmn-green': '#3c8527',
        'pkmn-text-light': '#f8f8f8',
        'pkmn-text-dark': '#081820',
      },
    },
  },
  plugins: [],
} 