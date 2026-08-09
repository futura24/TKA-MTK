/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        examblue: {
          DEFAULT: '#1e5fa8',
          dark: '#144a87',
          light: '#e8f1fb',
        },
      },
    },
  },
  plugins: [],
}
