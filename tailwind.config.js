/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'lab-bg': '#F7F9FC',
        'royal-blue': '#2563EB',
        'bright-orange': '#FB923C',
        'emerald-green': '#10B981',
        'dark-gray': '#1F2937',
      }
    },
  },
  plugins: [],
}
