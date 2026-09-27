/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
        },
        risk: {
          low: '#059669',
          medium: '#d97706',
          high: '#e11d48',
          critical: '#991b1b',
        }
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(15, 23, 42, 0.06)',
        'glass-hover': '0 14px 44px 0 rgba(15, 23, 42, 0.10)',
        'glass-active': '0 4px 16px 0 rgba(15, 23, 42, 0.08)',
        'inner-glass': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.8)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      }
    },
  },
  plugins: [],
}
