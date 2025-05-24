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
          DEFAULT: '#07E916',         
          dark: '#05B212',            
          light: '#5CF766',           
          softer: '#C5FDD0',          
        },
        bg: {
          dark: '#1A1A1C',
          medium: '#2D2D30',
          light: '#3E3E42',
        },
        text: {
          white: '#FFFFFF',
          main: '#E8E8E8',
          secondary: '#B8B8B8',
        },
      },
    },
  },
  plugins: [],
}