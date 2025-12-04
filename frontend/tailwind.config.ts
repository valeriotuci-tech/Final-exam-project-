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
        // Custom navy blue theme - exact logo color #14254B
        primary: {
          50: '#e8eaf0',
          100: '#d1d5e1',
          200: '#a3abc3',
          300: '#7581a5',
          400: '#475787',
          500: '#14254B', // Exact logo navy blue
          600: '#101e3c',
          700: '#0c162d',
          800: '#080f1e',
          900: '#04070f',
        },
      }
    }
  },
  plugins: []
};

export default config;
