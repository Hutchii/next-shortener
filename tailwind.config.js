module.exports = {
  content: ["./src/pages/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
      colors: {
        lime: {
          450: "#DDFF55",
          550: "#D3FF24",
        },
        gray: {
          650: "#8D8A90",
          750: "#303030",
          850: "#262626",
          950: "#09050D",
        },
      },
      screens: {
        "3xl": "1920px",
      },
      keyframes: {
        "fade-in": {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
