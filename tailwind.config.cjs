// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = { // Sicherer, module.exports zu verwenden
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
        'pkmn-medium': '#405080',
        'pkmn-light': '#7080a0',
        'pkmn-highlight': '#c0c0d0',
        'pkmn-text-light': '#f8f8f8',
        'pkmn-text-dark': '#081820',
        'pkmn-yellow': '#f8d048',
        'pkmn-green': '#38a048',
        'pkmn-red': '#e03020',
      }
    },
  },
  plugins: [],
}