/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gv: {
          dark: '#081410',
          forest: '#0E3B2E',
          deep: '#0F2A21',
          emerald: '#10B981',
          mint: '#34D399',
          lightMint: '#ECFDF5',
          navy: '#0B132B',
          slate: '#0F172A',
          card: '#131F1C',
          border: '#1E3A32',
          subtle: '#64748B',
          bg: '#F8FAFC',
          surface: '#FFFFFF',
          warning: '#F59E0B',
          critical: '#EF4444',
          high: '#F97316',
          resolved: '#10B981',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'scanline': 'scanline 6s linear infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        }
      }
    },
  },
  plugins: [],
}
