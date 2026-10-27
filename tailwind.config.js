/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: {
          950: '#060911',
          900: '#0b0f19',
          850: '#101625',
          800: '#151d30',
          700: '#1e293b',
        },
        aether: {
          cyan: '#00f0ff',
          'cyan-soft': '#38bdf8',
          'cyan-muted': 'rgba(0, 240, 255, 0.12)',
          amber: '#ffaa00',
          'amber-soft': '#fbbf24',
          'amber-muted': 'rgba(255, 170, 0, 0.12)',
          violet: '#a855f7',
          emerald: '#10b981',
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgba(0, 240, 255, 0.25)',
        'glow-cyan-lg': '0 0 45px -5px rgba(0, 240, 255, 0.35)',
        'glow-amber': '0 0 25px -4px rgba(255, 170, 0, 0.25)',
        'glow-amber-lg': '0 0 45px -5px rgba(255, 170, 0, 0.35)',
        'glass-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.12)',
        'glass-subtle': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'sans-serif',
        ],
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'monospace',
        ],
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-slow': 'float 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
