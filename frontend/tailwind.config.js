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
        'matrix-green': '#00FF00',
        'matrix-dark-green': '#00CC00',
        'matrix-light-green': '#33FF33',
        'matrix-bg': '#000000',
        'matrix-dark-bg': '#0A0A0A',
        'matrix-darker-bg': '#050505',
        'matrix-gray': '#1A1A1A',
        'matrix-light-gray': '#2A2A2A',
        'matrix-text': '#00FF00',
        'matrix-dim': '#008000',
        'matrix-glow': '#00FF00',
        'terminal-black': '#000000',
        'terminal-green': '#00FF00',
        'terminal-dark-green': '#00AA00',
        'terminal-bright': '#00FF41',
      },
      fontFamily: {
        'terminal': ['Courier New', 'Courier', 'monospace'],
        'matrix': ['Courier New', 'Courier', 'monospace'],
      },
      boxShadow: {
        'matrix': '0 0 10px rgba(0, 255, 0, 0.5)',
        'matrix-glow': '0 0 20px rgba(0, 255, 0, 0.8)',
        'terminal': '0 0 5px rgba(0, 255, 0, 0.3)',
      },
      animation: {
        'matrix-fade': 'matrixFade 2s ease-in-out infinite',
        'terminal-blink': 'terminalBlink 1s infinite',
        'matrix-rain': 'matrixRain 8s linear infinite',
        'matrix-rain-fast': 'matrixRainFast 4s linear infinite',
        'matrix-rain-slow': 'matrixRainSlow 12s linear infinite',
        'glitch': 'glitch 0.3s ease-in-out infinite',
      },
      keyframes: {
        matrixFade: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '1' },
        },
        terminalBlink: {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        matrixRain: {
          '0%': { 
            transform: 'translateY(-100vh)',
            opacity: '0'
          },
          '10%': { 
            opacity: '0.8'
          },
          '90%': { 
            opacity: '0.8'
          },
          '100%': { 
            transform: 'translateY(100vh)',
            opacity: '0'
          },
        },
        matrixRainFast: {
          '0%': { 
            transform: 'translateY(-100vh)',
            opacity: '0'
          },
          '10%': { 
            opacity: '0.9'
          },
          '90%': { 
            opacity: '0.9'
          },
          '100%': { 
            transform: 'translateY(100vh)',
            opacity: '0'
          },
        },
        matrixRainSlow: {
          '0%': { 
            transform: 'translateY(-100vh)',
            opacity: '0'
          },
          '10%': { 
            opacity: '0.7'
          },
          '90%': { 
            opacity: '0.7'
          },
          '100%': { 
            transform: 'translateY(100vh)',
            opacity: '0'
          },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
      },
    },
  },
  plugins: [],
}
