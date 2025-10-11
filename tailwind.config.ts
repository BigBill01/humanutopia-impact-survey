import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Raleway', 'sans-serif'],
      },
      colors: {
        'hu': {
          red: '#f92706',           // Company red
          'blue-dark': '#202b59',   // Corporate blue
          'blue-light': '#05b0fe',  // Team blue
          pink: '#e90d88',          // Social pink
          green: '#16af81',         // Social green
          orange: '#fe8210',        // Social orange
          purple: '#7c04d5',        // Social purple
          black: '#303030',         // Text color (off-black)
          'gray-light': '#f0f0f0',  // Light gray for backgrounds
        }
      },
    },
  },
  plugins: [],
}

export default config