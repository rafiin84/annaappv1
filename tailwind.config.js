/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        saffron: {
          50:  "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          300: "#fdba74",
          400: "#fb923c",
          500: "#FF6B00",
          600: "#ea580c",
          700: "#c2410c",
          800: "#9a3412",
          900: "#7c2d12",
        },
        navy: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#1E3A5F",
          600: "#162d4a",
          700: "#0f1f35",
          800: "#081220",
          900: "#04090f",
        },
        gold: {
          400: "#fbbf24",
          500: "#F59E0B",
          600: "#d97706",
        },
        surface: {
          light: "#FAFAFA",
          dark: "#0A0A0F",
        },
        card: {
          light: "#FFFFFF",
          dark: "#16161E",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
    },
  },
  plugins: [],
};
