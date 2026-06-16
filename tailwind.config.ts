import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      colors: {
        bg: {
          primary: "#07072A",
          surface: "#0D0D40",
          card: "#12124E",
          cardHover: "#181870",
        },
        accent: {
          DEFAULT: "#3535E8",
          light: "#6B6BF0",
        },
      },
    },
  },
  plugins: [],
};
export default config;
