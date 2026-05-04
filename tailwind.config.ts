import type { Config } from 'tailwindcss'
import tailwindcssAnimate from 'tailwindcss-animate'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          DEFAULT: '#6366F1',
        },
        accent: {
          violet: '#8B5CF6',
          cyan: '#06B6D4',
          green: '#22C55E',
          500: '#8B5CF6',
          600: '#7C3AED',
        },
        roomai: {
          dark: '#080B14',
          light: '#F8FAFC',
          surface: '#0F1424',
          elevated: '#151B2E',
          border: 'rgba(148, 163, 184, 0.12)',
        },
        'dark-bg': '#080B14',
        'dark-card': '#0F1424',
        'dark-border': 'rgba(148, 163, 184, 0.12)',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-geist-sans)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.5rem,6vw,4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        display: ['clamp(2rem,4vw,3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        glow: '0 0 40px -8px rgba(99, 102, 241, 0.45)',
        'glow-lg': '0 0 80px -12px rgba(99, 102, 241, 0.5)',
        'glow-cyan': '0 0 48px -10px rgba(6, 182, 212, 0.4)',
        card: '0 4px 24px rgba(0, 0, 0, 0.06)',
        'card-dark': '0 24px 80px rgba(0, 0, 0, 0.45)',
        float: '0 20px 50px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh-dark':
          'radial-gradient(ellipse 80% 60% at 20% 10%, rgba(99, 102, 241, 0.35), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 0%, rgba(139, 92, 246, 0.28), transparent 50%), radial-gradient(ellipse 60% 40% at 50% 100%, rgba(6, 182, 212, 0.15), transparent 55%)',
        'mesh-light':
          'radial-gradient(ellipse 80% 60% at 20% 0%, rgba(99, 102, 241, 0.12), transparent 55%), radial-gradient(ellipse 70% 50% at 90% 10%, rgba(139, 92, 246, 0.1), transparent 50%)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        float: 'float 5s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
      },
    },
  },
  plugins: [tailwindcssAnimate],
}

export default config
