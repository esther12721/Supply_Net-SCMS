/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        brand: {
          50: '#eef9ff',
          100: '#d8f0ff',
          200: '#b9e4ff',
          300: '#88d2ff',
          400: '#50b8ff',
          500: '#2896ff',
          600: '#0f74f5',
          700: '#0a5ce1',
          800: '#0f4ab6',
          900: '#12408f',
          950: '#0e2857',
        },
        emerald: {
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: 0 }, '100%': { transform: 'translateY(0)', opacity: 1 } },
      },
    },
  },
  plugins: [],
}
