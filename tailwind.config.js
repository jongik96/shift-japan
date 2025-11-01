/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: '#374151',
            lineHeight: '1.75',
            'h2, h3, h4': {
              fontWeight: '700',
              marginTop: '2em',
              marginBottom: '1em',
            },
            'h2': {
              fontSize: '1.875rem',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.5rem',
            },
            'p': {
              marginBottom: '1.5em',
            },
            'ul, ol': {
              marginBottom: '1.5em',
            },
            'li': {
              marginBottom: '0.5em',
            },
            'a': {
              color: '#0284c7',
              textDecoration: 'underline',
              '&:hover': {
                color: '#0369a1',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
}
