/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "pe-bg": "#050712",
      },
      boxShadow: {
        "pe-panel": "0 20px 60px rgba(0,0,0,0.75)",
      },
    },
  },
  plugins: [],
}

