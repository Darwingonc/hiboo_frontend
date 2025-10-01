/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  important: true,  // <--- esto fuerza que todas las clases Tailwind tengan !important
}

