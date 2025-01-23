/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./index.html",
    './src/**/*.{html,js,ts,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
    },
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        bonanova: ['Bona Nova', 'serif'],
      },
      colors: {
        pastelBlue: '#AEC6CF',
        pastelGreen: '#B2D8B6',
        pastelPink: '#F4C2C2',
        pastelYellow: '#FAE3B2',
        pastelPurple: '#D6CDEA',
        pastelOrange: '#F2C9B0',
        'blue': '#0E162B',
        'blue-light-1': '#EBF3FF',
        'blue-light-2': '#D7E8FE',
        'blue-1': '#046BF1',
        'blue-2': '#0362DD',
        'blue-3': '#035969',
        'blue-4': ' #126180',
        'navy-blue-1': '#043677',
        'navy-blue-2': '#032D63',
        'navy-blue-3': '#02244F',
        'navy-blue-4': '#021B3C',
        'navy-blue-5': '#011228',
        'dark-blue': '#060b18',
      }, 
     
    },
  },
  plugins: [],
};
