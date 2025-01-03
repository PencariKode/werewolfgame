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
  plugins: [],
};
