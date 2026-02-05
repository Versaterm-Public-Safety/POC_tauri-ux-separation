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
      // Transcript window sizing (FR-001, FR-009)
      spacing: {
        'transcript-min': '200px',
      },
      // Badge animation duration
      transitionDuration: {
        'badge': '200ms',
      },
    },
  },
  plugins: [],
}
