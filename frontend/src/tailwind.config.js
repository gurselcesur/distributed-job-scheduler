/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    textColor: {
      DEFAULT: '#f7fafc', // Matches text.white for better readability on dark background
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3182ce',       // Replaces old green with accentBlue
          dark: '#2c5282',          // A darker blue shade
          light: '#63b3ed',         // A lighter blue shade (same as accentInfo)
          softer: '#bee3f8',        // A soft pastel blue
        },
        bg: {
          dark: '#1a202c',          // Matches background
          medium: '#2d3748',        // Matches surface/inputBg
          light: '#4a5568',         // Matches border
        },
        text: {
          white: '#f7fafc',         // Matches text
          main: '#a0aec0',          // Matches textSecondary
          secondary: '#718096',     // Matches accentGray
        },
        accentBlue: '#3182ce',
        accentGreen: '#48bb78',
        accentRed: '#f56565',
        accentGray: '#718096',
        accentInfo: '#63b3ed',
        inputBg: '#2d3748',
        border: '#4a5568',
        placeholder: '#a0aec0',
        surface: '#2d3748',
        background: '#1a202c',
        text: '#f7fafc',
        textSecondary: '#a0aec0',
      },
    },
  },
  plugins: [],
}