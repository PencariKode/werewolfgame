/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '500px',
      },
      boxShadow: {
        'xs': '1px 1px 1px #0d0d0d',
      },

      colors: {
        dark: {
          bg: '#12100e',
          text: '#F3F3F3',
          primary: '#242426',
          secondary: '#A6986D',
          accent: '#8C0E03',
        },
        
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.no-scrollbar': {
          /* Untuk menyembunyikan scrollbar */
          '-ms-overflow-style': 'none', /* IE */
          'scrollbar-width': 'none', /* Firefox */
        },
        '.no-scrollbar::-webkit-scrollbar': {
          display: 'none', /* Chrome, Safari */
        },
        '.link-underline': {
          'border-bottom-width': '0',
          'background-image': 'linear-gradient(transparent, transparent), linear-gradient(#fff, #fff)',
          'background-size': '0 2px',
          'background-position': '0 100%',
          'background-repeat': 'no-repeat',
          'transition': 'background-size .3s ease-in-out',
        },
        
        '.link-underline-black': {
          'background-image': 'linear-gradient(transparent, transparent), linear-gradient(var(--tw-underline-color), var(--tw-underline-color))',
        },
        
        '.link-underline:hover': {
          'background-size': '100% 2px',
          'background-position': '0 100%',
        }
      });
    },
  ],
};
