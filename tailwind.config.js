/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jawa: {
          chocolate: "#29170F",
          espresso: "#1A0E08",
          deepbrown: "#432719",
          brown: "#5A3622",
          gold: "#C6A56B",
          goldlight: "#E5C895",
          goldbright: "#DFB76C",
          golddark: "#8C6E3B",
          goldaccent: "#F4E0B9",
          beige: "#D8C4A4",
          beigelight: "#EFE6D8",
          ivory: "#F7F0E4",
          ivorydark: "#EDE2D0",
          maroon: "#762D32",
          maroondark: "#4E1A1E",
          maroonlight: "#9A3B42",
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', '"Playfair Display"', 'serif'],
        cinzeldec: ['"Cinzel Decorative"', '"Cinzel"', 'serif'],
        script: ['"Great Vibes"', '"Pinyon Script"', 'cursive'],
        pinyon: ['"Pinyon Script"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'radial-vignette': 'radial-gradient(circle at center, transparent 30%, rgba(26, 14, 8, 0.85) 100%)',
        'gold-gradient': 'linear-gradient(135deg, #DFB76C 0%, #C6A56B 50%, #8C6E3B 100%)',
        'gold-shimmer': 'linear-gradient(90deg, #C6A56B 0%, #F4E0B9 50%, #C6A56B 100%)',
      },
      animation: {
        'spin-slow': 'spin 18s linear infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'sway-left': 'swayLeft 6s ease-in-out infinite',
        'sway-right': 'swayRight 6s ease-in-out infinite',
      },
      keyframes: {
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        swayLeft: {
          '0%, 100%': { transform: 'rotate(-1.5deg) translateX(0px)' },
          '50%': { transform: 'rotate(1.5deg) translateX(4px)' },
        },
        swayRight: {
          '0%, 100%': { transform: 'rotate(1.5deg) translateX(0px)' },
          '50%': { transform: 'rotate(-1.5deg) translateX(-4px)' },
        }
      }
    },
  },
  plugins: [],
}

