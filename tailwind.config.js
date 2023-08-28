/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/*.html", "./src/js/*.js"],
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Lato", "sans-serif"],
    },
  },
  purge: ["./src/*.html", "./src/js/*.js"],
  plugins: [],
};
