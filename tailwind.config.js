/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'racing-red': '#f9372c',
        surface: {
          DEFAULT: '#121416',
          dim: '#121416',
          low: '#1a1c1e',
          container: '#1e2022',
          high: '#282a2c',
          highest: '#333537',
          bright: '#37393b',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Helvetica Neue', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
