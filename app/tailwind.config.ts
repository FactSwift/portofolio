import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-barlow)'],
        heading: ['var(--font-prompt)'],
        prompt: ['var(--font-prompt)'],
        barlow: ['var(--font-barlow)'],
      },
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        brand: {
          50: '#fff4ef',
          100: '#ffe5d7',
          200: '#ffc5a5',
          300: '#ffab80',
          400: '#ff8c5c',
          500: '#ef6a37',
          600: '#d35728',
          700: '#b54620',
          800: '#933d1f',
          900: '#7a381f',
        },
        mint: {
          50: '#ebfaf8',
          100: '#cdf4ee',
          200: '#99e8de',
          300: '#67d9cd',
          400: '#3bc1b5',
          500: '#1f9d94',
          600: '#1a7f78',
          700: '#186661',
          800: '#18524e',
          900: '#174542',
        },
      }
    },
  },
  plugins: [],
}
export default config
