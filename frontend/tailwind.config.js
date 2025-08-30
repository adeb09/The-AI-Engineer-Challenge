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
        'aol-blue': '#0066CC',
        'aol-light-blue': '#3399FF',
        'aol-dark-blue': '#003366',
        'aol-gray': '#CCCCCC',
        'aol-light-gray': '#F0F0F0',
        'aol-dark-gray': '#666666',
        'aol-green': '#00CC00',
        'aol-yellow': '#FFFF00',
        'aol-orange': '#FF6600',
      },
      fontFamily: {
        'aol': ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        'aol': '2px 2px 4px rgba(0, 0, 0, 0.3)',
      }
    },
  },
  plugins: [],
}
