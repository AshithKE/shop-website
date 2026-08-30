/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FBF6EE',
          deep: '#F3E7D4',
          line: '#E9DCC3',
        },
        cocoa: {
          DEFAULT: '#3F2A20',
          light: '#6B4B39',
          soft: '#8A6A56',
        },
        choc: {
          DEFAULT: '#6B3B27',
          dark: '#4A2818',
          light: '#8B5236',
        },
        rose: {
          DEFAULT: '#E8AFAE',
          light: '#F5DADA',
          dark: '#D98B8C',
        },
        pista: {
          DEFAULT: '#B9C99B',
          light: '#DCE6CB',
        },
        gold: {
          DEFAULT: '#C69A3E',
          light: '#E4C888',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Outfit"', 'sans-serif'],
        utility: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(63, 42, 32, 0.25)',
        card: '0 8px 24px -10px rgba(63, 42, 32, 0.18)',
        lift: '0 20px 50px -15px rgba(63, 42, 32, 0.35)',
      },
      borderRadius: {
        cake: '1.75rem',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        popIn: {
          '0%': { transform: 'scale(0.9)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
        drift: {
          '0%,100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(4deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.7s cubic-bezier(0.22,1,0.36,1) both',
        popIn: 'popIn 0.4s cubic-bezier(0.22,1,0.36,1) both',
        drift: 'drift 6s ease-in-out infinite',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
}
