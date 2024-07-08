/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'var(--color-background)',
        text: 'var(--color-text)',
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        accent: 'var(--color-accent)',
        border: 'var(--color-border)',
        link: 'var(--color-link)',
      },
    },
  },
  plugins: [require("@tailwindcss/typography"), require('tailwind-scrollbar')({
    nocompatible: true,
    preferredStrategy: 'pseudoelements'
  }),],
}