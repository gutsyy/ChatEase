/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    fontFamily: {
      greycliff: ["Greycliff CF", "sans-serif"],
    },
    extend: {},
  },
  plugins: [],
};
