/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14140F",
        "ink-2": "#1B1B14",
        bone: "#EDE6D8",
        "bone-dim": "#C9C0AD",
        stone: "#8B8371",
        brass: "#A6813C",
        "brass-bright": "#C89A4A",
        forest: "#2B342B",
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
