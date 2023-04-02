import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
module.exports = {
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    fontFamily: {
      greycliff: [
        "Greycliff CF",
        "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
      ],
      monaco: [
        "Monaco",
        "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji",
      ],
    },
    colors: {
      ...colors,
      dark: {
        100: "#C1C2C5",
        200: "#A6A7AB",
        300: "#909296",
        400: "#5C5F66",
        500: "#373A40",
        600: "#2C2E33",
        700: "#25262B",
        750: "#1D1E21",
        800: "#1A1B1E",
        900: "#141517",
        950: "#101113",
      },
    },
    extend: {},
  },
  plugins: [],
};
