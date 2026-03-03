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
        gold: "#C9A227",
        "dark-bg": "#1C1A18",
      },
      fontFamily: {
        heading: ["var(--font-playfair)", "Playfair Display", "serif"],
        body: ["var(--font-poppins)", "Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
