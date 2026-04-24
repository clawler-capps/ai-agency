import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0d0f12",
        paper: "#f4f2ed",
        cream: "#faf8f3",
        accent: {
          DEFAULT: "#e85d26",
          hover: "#d4501f",
          light: "#e85d261a",
        },
        green: {
          DEFAULT: "#1a6b4e",
          hover: "#155a40",
          light: "#1a6b4e1a",
          border: "#1a6b4e40",
        },
        blue: {
          DEFAULT: "#2d5dce",
          hover: "#2550b8",
          light: "#2d5dce1a",
          border: "#2d5dce40",
        },
        purple: {
          DEFAULT: "#8b5cf6",
          hover: "#7c3aed",
          light: "#8b5cf61a",
          border: "#8b5cf640",
        },
        muted: "#7c7a75",
        border: "#ddd9d0",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-texture":
          "radial-gradient(ellipse 100% 60% at 70% 0%, rgba(232,93,38,0.06), transparent)",
      },
      animation: {
        "fade-up": "fadeUp 0.5s ease-out forwards",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
