const { white } = require("tailwindcss/colors");
const colors = require("tailwindcss/colors");

module.exports = {
  darkMode: "media",
  purge: {
    content: ["_site/**/*.html"],
    options: {
      whitelist: [],
    },
  },
  theme: {
    fontFamily: {
      sans: ["Work Sans", "sans-sans"],
      serif: ["Kalam", "sans-sans"],
    },
    colors: {
      gray: colors.gray,
      primary: colors.lime,
      white: white,
      beratung: "#64A30C",
      "beratung-light": "#C4EF87",
      therapie: "#8B5CF6",
      "therapie-light": "#DDD6FF",
      bia: "#F49E0B",
      "bia-light": "#FDE689",
      bgf: "#2563EA",
      "bgf-light": "#DBEAFF",
      covid: colors.red[500],
      "covid-light": colors.red[200],
    },
  },
  variants: {
    extend: {
      display: ["dark"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
