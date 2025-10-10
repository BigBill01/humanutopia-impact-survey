import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hu': {
          red: '#f92706',
          'blue-dark': '#202b59',
          'blue-light': '#05b0fe',
          pink: '#e90d88',
          green: '#16af81',
          orange: '#fe8210',
          purple: '#7c04d5',
          black: '#303030',
          'gray-light': '#f8f9fa',
        },
      },
      fontFamily: {
        sans: ['Raleway', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config