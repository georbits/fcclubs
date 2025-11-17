/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0ea5e9',
          accent: '#c084fc',
          surface: '#0f172a',
        },
      },
    },
  },
  plugins: [],
};
