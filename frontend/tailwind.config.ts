import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        // Custom gold theme - very bright yellow-gold to match logo
        primary: {
          50: '#fffff0',
          100: '#fffde7',
          200: '#fff9c4',
          300: '#fff176',
          400: '#ffeb3b',
          500: '#ffd700',
          600: '#ffc107',
          700: '#ffb300',
          800: '#ff8f00',
          900: '#ff6f00',
        },
      }
    }
  },
  plugins: []
};

export default config;
