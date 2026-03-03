/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // RohanRice corporate colors
        'rice-beige': {
          50: '#fef9f3',
          100: '#fdf3e6',
          200: '#fbe7d1',
          300: '#f8d9b8',
          400: '#f4c299',
          500: '#d4a76e',
          600: '#c49766',
          700: '#b08860',
          800: '#9c7860',
          900: '#8a6f5c',
        },
        'rice-green': {
          50: '#f0f5f0',
          100: '#d7e5d4',
          200: '#bfd6b7',
          300: '#9bc385',
          400: '#7ab563',
          500: '#5a9c3d',
          600: '#4a8b2e',
          700: '#3d7425',
          800: '#33611f',
          900: '#2a501a',
        },
        'rice-gold': {
          50: '#fffbf0',
          100: '#fff7e6',
          200: '#ffead1',
          300: '#ffd699',
          400: '#ffcc66',
          500: '#ffb726',
          600: '#e6980f',
          700: '#cc8800',
          800: '#b37700',
          900: '#8c5c00',
        },
        'ivory': '#f5f1e8',
        'charcoal': '#2c2c2c',
        'sage': '#556b5d',
        'warm-white': '#fafaf8',
      },
      backgroundImage: {
        'gradient-rice': 'linear-gradient(135deg, #d4a76e 0%, #5a9c3d 100%)',
        'gradient-premium': 'linear-gradient(180deg, rgba(212,167,110,0.1) 0%, rgba(90,156,61,0.05) 100%)',
        'rice-pattern': 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M30 0L36 20H56L42 32L48 52L30 40L12 52L18 32L4 20H24Z\' fill=\'%23f4c299\' opacity=\'0.05\'/%3E%3C/svg%3E")',
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.2' }],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      boxShadow: {
        'soft': '0 4px 16px rgba(0, 0, 0, 0.08)',
        'medium': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'premium': '0 12px 32px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    function ({ addComponents }) {
      addComponents({
        '.btn-primary': {
          '@apply px-6 py-3 rounded-lg font-semibold text-white bg-rice-green-600 hover:bg-rice-green-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rice-green-500': {},
        },
        '.btn-secondary': {
          '@apply px-6 py-3 rounded-lg font-semibold text-rice-green-700 bg-rice-beige-100 hover:bg-rice-beige-200 border border-rice-beige-300 transition-all duration-200': {},
        },
        '.btn-accent': {
          '@apply px-6 py-3 rounded-lg font-semibold text-white bg-rice-gold-500 hover:bg-rice-gold-600 transition-all duration-200': {},
        },
        '.btn-ghost': {
          '@apply px-4 py-2 text-gray-700 hover:text-rice-green-700 hover:bg-rice-beige-50 transition-all duration-200 rounded-lg': {},
        },
        '.btn-disabled': {
          '@apply opacity-50 cursor-not-allowed': {},
        },
        '.card': {
          '@apply bg-white rounded-lg shadow-soft hover:shadow-medium transition-shadow duration-200 p-6': {},
        },
        '.card-premium': {
          '@apply bg-white rounded-lg border border-rice-beige-200 shadow-soft hover:shadow-premium transition-all duration-200 p-6': {},
        },
        '.input-field': {
          '@apply w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-rice-green-500 focus:ring-2 focus:ring-rice-green-100 transition-all duration-200': {},
        },
        '.badge': {
          '@apply inline-block px-3 py-1 rounded-full text-sm font-semibold': {},
        },
        '.badge-primary': {
          '@apply bg-rice-green-100 text-rice-green-700': {},
        },
        '.badge-gold': {
          '@apply bg-rice-gold-100 text-rice-gold-700': {},
        },
        '.badge-beige': {
          '@apply bg-rice-beige-100 text-rice-beige-900': {},
        },
      });
    },
  ],
};
