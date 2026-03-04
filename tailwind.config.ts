// ⭐ PER-CLIENT CONFIG — change colors and fonts here for each new client

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#111111",
        secondary: "#1C1A18",
        accent: "#C9A227",
        "accent-muted": "#8B6B3E",
        cream: "#F5F0E6",
        beige: "#E6D5B8",
        gold: {
          DEFAULT: "#C9A227",
          light: "#E8B92C",
          dark: "#8B6B3E",
        },
        "dark-bg": "#0D0B08",
      },
      backgroundImage: {
        "gold-metallic": "linear-gradient(135deg, #8B6B3E 0%, #C9A227 50%, #8B6B3E 100%)",
        "gold-text": "linear-gradient(135deg, #8B6B3E 0%, #C9A227 50%, #F5F0E6 100%)",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "serif"],
        body: ["var(--font-outfit)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
