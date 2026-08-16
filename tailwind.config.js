/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: '#121416',
          dim: '#121416',
          lowest: '#0c0e10',
          low: '#1a1c1e',
          container: '#1e2022',
          high: '#282a2c',
          highest: '#333537',
          bright: '#37393b',
          variant: '#333537',
        },
        racing: '#f9372c',
        accent: '#ff4d00',
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
}
