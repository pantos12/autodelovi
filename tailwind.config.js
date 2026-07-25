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
          DEFAULT: 'var(--surface)',
          dim: 'var(--surface-dim)',
          bright: 'var(--surface-bright)',
          variant: 'var(--surface-variant)',
          container: {
            DEFAULT: 'var(--surface-container)',
            lowest: 'var(--surface-container-lowest)',
            low: 'var(--surface-container-low)',
            high: 'var(--surface-container-high)',
            highest: 'var(--surface-container-highest)',
          },
        },
        primary: {
          DEFAULT: 'var(--primary)',
          fixed: 'var(--primary-fixed)',
          'fixed-dim': 'var(--primary-fixed-dim)',
          container: 'var(--primary-container)',
        },
        'on-primary': 'var(--on-primary)',
        'on-primary-container': 'var(--on-primary-container)',
        'racing-red': 'var(--racing-red)',
        secondary: {
          DEFAULT: 'var(--secondary)',
          container: 'var(--secondary-container)',
        },
        'on-secondary': 'var(--on-secondary)',
        'on-secondary-container': 'var(--on-secondary-container)',
        tertiary: {
          DEFAULT: 'var(--tertiary)',
          container: 'var(--tertiary-container)',
        },
        background: 'var(--background)',
        'on-background': 'var(--on-background)',
        'on-surface': 'var(--on-surface)',
        'on-surface-variant': 'var(--on-surface-variant)',
        stock: {
          green: '#22c55e',
          yellow: '#eab308',
          red: '#ef4444',
        },
        accent: '#ff4d00',
      },
      fontFamily: {
        sans: ["'Inter'", "'Helvetica Neue'", 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        btn: '8px',
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
