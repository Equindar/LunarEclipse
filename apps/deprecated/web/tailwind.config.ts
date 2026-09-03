/** @type {import('tailwindcss').Config} */
import './src/assets/themes/default';

const colors = require('tailwindcss/colors');

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    borderWidth: {
      DEFAULT: '1px',
      '0': '0',
      '2': '2px',
      '3': '3px',
      '4': '4px',
      '6': '6px',
      '8': '8px',
      '16': '16px',
    },
    extend: {
      backgroundImage: {
        test: "url('/images/background.webp')",
      },
      colors: {
        background: {
          dark: colors.black,
          DEFAULT: colors.white,
          light: colors.white,
        },
        primary: {
          dark: '#006270',
          DEFAULT: '#009394',
          light: '#00E0C7',
        },
        secondary: '#ecc94b',
        foreground: '#eeeeee',
        equindar_red: '#ff0000',
        legendary: colors.orange,
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeOut: {
          '0%': { opacity: 1 },
          '70%': { opacity: 1 },
          '100%': { opacity: 0 },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        fade: 'fadeOut 5s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
