/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
        body: ["'Inter'", "system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#eef5ff",
          100: "#dceaff",
          200: "#b8d4ff",
          300: "#93bcff",
          400: "#6fa4ff",
          500: "#4b8dff",
          600: "#2f6fda",
          700: "#1f53a8",
          800: "#143b78",
          900: "#0d2850",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
