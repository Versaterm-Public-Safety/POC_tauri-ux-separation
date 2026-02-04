/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Versaterm Brand Colors
        primary: {
          DEFAULT: '#2563eb',
          dark: '#1e3a5f',
        },
        accent: {
          DEFAULT: '#059669',
        },
        error: {
          DEFAULT: '#dc2626',
        },
      },
    },
  },
  plugins: [],
}
