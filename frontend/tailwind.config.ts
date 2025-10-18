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
        'primary-dark': '#7FA3E8',
        'primary-light': '#C5DBFF',
        'secondary-dark': "#000D26",
        'secondary': "#A0A0A8",
        'secondary-strong': "#FFFFFF",
        'secondary-weak': "#C7C7C7",
        'stroke-strong': "#999999",
        'stroke-weak': "#9999991F",
        'fill': "#9999990F",
        'back': {
          'base': '#0F0F15',
          'raised': '#1A1A24',
          'overlay': '#25252F',
        },
        'danger': "#C73A3A",
        'success': '#4CAF50',
        'warning': '#FFA726'
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 16px rgba(163, 194, 255, 0.15)',
      }
    },
  },
  plugins: [],
};
