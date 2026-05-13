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
        'racing-red': '#f9372c',
        'racing-red-hover': '#e02a20',
        'surface-bg': '#0c0d0f',
        'surface-card': '#1a1b1f',
        'surface-elevated': '#252629',
        'border-subtle': '#2a2b2f',
      },
    },
  },
  plugins: [],
}
