import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      borderRadius: { xl: "0.875rem", "2xl": "1.25rem" },
      fontFamily: { sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"] },
    },
  },
  plugins: [],
};

export default config;
