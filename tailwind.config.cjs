/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        fav: {
          50: "#DAD9C6",
          100: "#A9DDB6",
          200: "#6CC276",
          300: "#619b67",
          400: "#5B6E6E",
          500: "#678583",
          600: "#4B605F"
        },
        me: "#383838",
        discord: "#5865F2",
        google: "#E44539",
        github: "#000"
      },
      fontFamily: {
        sans: ["'M PLUS Rounded 1c'", "Roboto", "sans-serif"]
      }
    }
  },
  plugins: [require("@tailwindcss/line-clamp")]
});
