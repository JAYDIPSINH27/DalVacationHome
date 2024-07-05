/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
    theme: {
    extend: {
      colors:
      {
        "primary": "#222831",
        "light-primary": "#31363F",
        "white": "#fff"
      },
      screens: {
        // 'xsm': {'min': '330px', 'max': '639px'},
      },
    },
  },
  plugins: [],
}

