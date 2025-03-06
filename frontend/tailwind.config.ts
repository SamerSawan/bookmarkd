/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-anonymous-default-export */
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        'primary': '#A3C2FF',
        'secondary-dark': "#000D26",
        'secondary-strong': "#FFFFFF",
        'secondary-weak': "#C7C7C7",
        'stroke-strong': "#999999",
        'stroke-weak': "#9999991F",
        'fill': "#9999990F",
        'back': {
          'base': '#12121A',
          'raised': '#1D1D26',
          'overlay': '#2A2933',
        },
        'danger': "#C73A3A"
        
      }
    },
  },
  plugins: [],
};
