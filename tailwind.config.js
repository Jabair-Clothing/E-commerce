/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury Palette
        primary: {
          DEFAULT: '#1A1A1A', // Deep Charcoal/Black
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#808080',
          500: '#4D4D4D',
          600: '#1A1A1A',
          700: '#141414',
          800: '#0F0F0F',
          900: '#000000',
        },
        accent: {
          DEFAULT: '#D4AF37', // Gold/Bronze
          50: '#FCF9E9',
          100: '#F9F3D4',
          200: '#F1E3A9',
          300: '#E9D47E',
          400: '#E1C453',
          500: '#D4AF37',
          600: '#AA8C2C',
          700: '#806921',
          800: '#554616',
          900: '#2B230B',
        },
        // Keeping lagoon aliases mapped to primary/accent for backward compatibility/easy transition
        lagoon: {
          50: '#F5F5F5',   // mapped to primary-50
          100: '#E5E5E5',  // mapped to primary-100
          200: '#CCCCCC',
          300: '#B3B3B3',
          400: '#808080',
          500: '#D4AF37',  // mapped to accent-500 (buttons etc)
          600: '#AA8C2C',  // mapped to accent-600
          700: '#1A1A1A',  // mapped to primary-600
          800: '#141414',
          900: '#000000',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
}
