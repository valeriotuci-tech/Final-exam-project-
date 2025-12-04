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
        // Custom gold theme to match logo - deeper, richer gold
        primary: {
          50: '#fef3c7',
          100: '#fde68a',
          200: '#fcd34d',
          300: '#f4b740',
          400: '#e8a62e',
          500: '#d4941d',
          600: '#b8820c',
          700: '#8f6508',
          800: '#6b4d06',
          900: '#4a3404',
        },
      }
    }
  },
  plugins: []
};

export default config;
