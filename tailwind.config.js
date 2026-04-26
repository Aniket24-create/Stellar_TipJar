/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      colors: {
        'brand-blue': '#0070f3',
        'brand-purple': '#7928ca',
        'brand-cyan': '#00dfd8',
        'brand-dark': '#0a0a0a',
        'brand-light': '#ffffff',
      },
    },
  },
  plugins: [],
}
