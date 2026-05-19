/** @type {import('tailwindcss').Config} */
export default {
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx,html}",
  "./src/*.{js,jsx}", // додаємо цей шлях про всяк випадок
],
  theme: {
    extend: {},
  },
  plugins: [],
}