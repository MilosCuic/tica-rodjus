/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#1a0533',
          pink: '#e91e8c',
          gold: '#ffd700',
          light: '#f8e7ff',
        }
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['"Poppins"', 'sans-serif'],
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 20px #e91e8c66' },
          '50%': { boxShadow: '0 0 50px #e91e8ccc, 0 0 80px #e91e8c44' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        }
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        pulse_glow: 'pulse_glow 2s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      }
    },
  },
  plugins: [],
}

