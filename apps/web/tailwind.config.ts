import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E1A22",
        sand: "#F2EEE5",
        mint: "#1D7A6B",
        coral: "#E96A41",
        steel: "#29424F"
      },
      boxShadow: {
        card: "0 12px 28px rgba(18, 46, 54, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
