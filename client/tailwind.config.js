// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
 // tailwind.config.js
// ...
content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}", // <--- This looks correct for a React/Vite project
],
// ...
  theme: {
    extend: {
      colors: {
        deepBlue: "#0B1A39",      // deep header blue
        darkGrey: "#1A1A1A",      // dark grey background
        textWhite: "#FFFFFF",     // white text
      },
    },
  },
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
