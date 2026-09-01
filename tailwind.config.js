/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        kayan: {
          blue: '#7BB9EF',
          lightBlue: '#EAF3FD',
          borderBlue: '#91C5F2',
          darkBlue: '#1B365D',
          hoverBlue: '#6AA8DE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
