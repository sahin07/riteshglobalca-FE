import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-montserrat)', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: {
          DEFAULT: '#F19020',
          50: '#FFF3E6',
          100: '#FEE3BF',
          200: '#FBCD8D',
          300: '#F8B45A',
          400: '#F59F33',
          500: '#F19020',
          600: '#D87F1C',
          700: '#B86B17',
          800: '#915513',
          900: '#6F410F',
        },
        brand: {
          dark: '#003B49',
          orange: '#F19020',
        },
        slate: {
          950: '#003B49', // Overriding slate-950 to match brand dark for existing components
          900: '#004d60',
        }
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          lg: '2rem',
        }
      }
    }
  },
  plugins: [],
} satisfies Config
