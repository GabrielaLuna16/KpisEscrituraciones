const path = require('path')

// Tailwind's glob engine needs forward slashes on Windows
const r = (...args) => path.join(__dirname, ...args).replace(/\\/g, '/')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    r('pages/**/*.{js,ts,jsx,tsx,mdx}'),
    r('components/**/*.{js,ts,jsx,tsx,mdx}'),
    r('app/**/*.{js,ts,jsx,tsx,mdx}'),
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['var(--font-dm-sans)',      'sans-serif'],
        display: ['var(--font-plus-jakarta)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
