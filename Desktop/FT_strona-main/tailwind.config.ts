import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000", // Pure black for Apple Pro feel
        surface: "#111111", // Slightly lighter for cards
        "surface-highlight": "#1c1c1e", // Apple-ish dark gray
        primary: "#FFFFFF",
        secondary: "#86868b", // Apple gray text
        accent: "#00ff41", // Terminal Green (Matrix style) - or maybe a softer #22c55e
        "accent-dim": "rgba(0, 255, 65, 0.1)",
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #00ff41 0deg, #22c55e 120deg, #06b6d4 240deg, #00ff41 360deg)',
      }
    },
  },
  plugins: [],
};
export default config;
