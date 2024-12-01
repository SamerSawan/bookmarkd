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
        'primary': '#8E13FF',
        'text-strong': "#2C1A3D",
        'text-weak': "#6A597A",
        'stroke-strong': "#9380A6",
        'stroke-weak': "#EAE4F0",
        'fill': "#F7F5FA",
        'back': "#FFFFFF"
      },
    },
  },
  plugins: [],
};
