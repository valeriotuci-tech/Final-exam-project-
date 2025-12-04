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
        // Custom gold theme - exact logo color #FFCB4B
        primary: {
          50: '#fffef5',
          100: '#fffaeb',
          200: '#fff5d6',
          300: '#ffe9ad',
          400: '#ffdc84',
          500: '#FFCB4B', // Exact logo gold color
          600: '#f5b800',
          700: '#cc9900',
          800: '#a37a00',
          900: '#7a5c00',
        },
      }
    }
  },
  plugins: []
};

export default config;
