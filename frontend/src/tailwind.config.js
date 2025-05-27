/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    textColor: {
      DEFAULT: '#f8fafc',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6366f1',       // Modern indigo
          dark: '#4338ca',          
          light: '#818cf8',         
          softer: '#c7d2fe',        
        },
        secondary: {
          DEFAULT: '#ec4899',       // Modern pink
          dark: '#be185d',
          light: '#f472b6',
        },
        accent: {
          purple: '#8b5cf6',
          cyan: '#06b6d4',
          emerald: '#10b981',
          orange: '#f59e0b',
          rose: '#f43f5e',
        },
        bg: {
          dark: '#0f172a',          // Deeper dark
          medium: '#1e293b',        
          light: '#334155',         
          glass: 'rgba(30, 41, 59, 0.8)',
        },
        text: {
          white: '#f8fafc',         
          main: '#cbd5e1',          
          secondary: '#94a3b8',     
          muted: '#64748b',
        },
        border: {
          DEFAULT: '#475569',
          light: '#64748b',
          glass: 'rgba(148, 163, 184, 0.2)',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-pink': '0 0 20px rgba(236, 72, 153, 0.3)',
      }
    },
  },
  plugins: [],
}