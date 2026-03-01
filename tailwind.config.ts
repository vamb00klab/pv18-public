import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        volt: {
          yellow:  "#fee023",
          cyan:    "#43d9bf",
          surface: "#111111",
          edge:    "#2a2a2a",
          muted:   "#8891a4",
        },
      },
    },
  },
  plugins: [],
};

export default config;
