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
        bg: '#0A0A0A',
        surface: '#111111',
        'surface-2': '#1A1A1A',
        'surface-3': '#222222',
        border: '#2A2A2A',
        'border-light': '#333333',
        primary: '#7C3AED',
        'primary-light': '#8B5CF6',
        'primary-dark': '#6D28D9',
        accent: '#06B6D4',
        'accent-pink': '#EC4899',
        'accent-orange': '#F97316',
        'accent-green': '#10B981',
        'text-primary': '#F5F5F5',
        'text-secondary': '#A1A1AA',
        'text-muted': '#52525B',
      },
      fontFamily: {
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        display: ['var(--font-clash)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-vibe': 'linear-gradient(135deg, #7C3AED, #06B6D4)',
        'gradient-match': 'linear-gradient(135deg, #EC4899, #7C3AED)',
        'gradient-energy': 'linear-gradient(135deg, #F97316, #EF4444)',
        'gradient-calm': 'linear-gradient(135deg, #10B981, #06B6D4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(124, 58, 237, 0.3)' },
          '100%': { boxShadow: '0 0 40px rgba(124, 58, 237, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
