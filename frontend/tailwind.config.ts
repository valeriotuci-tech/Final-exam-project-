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
        // Custom gold theme to match logo - bright yellow-gold like the logo
        primary: {
          50: '#fffef0',
          100: '#fffacd',
          200: '#fff59d',
          300: '#ffed4e',
          400: '#ffd700',
          500: '#f4c430',
          600: '#daa520',
          700: '#b8860b',
          800: '#8b6914',
          900: '#6b5310',
        },
      }
    }
  },
  plugins: []
};

export default config;
