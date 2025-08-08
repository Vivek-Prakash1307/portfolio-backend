{import('tailwindcss').Config}
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        'dark-primary': '#0A0A0A', // Almost black
        'dark-secondary': '#1A1A1A', // Slightly lighter dark
        'card-dark': '#2A2A2A', // For cards and forms
        'border-color': '#4A4A4A', // Subtle border for dark elements
        'light-text': '#E0E0E0', // Main light text
        'light-text-muted': '#A0A0A0', // Muted text
        'accent-primary': '#00E676', // Vibrant green (for headings, main buttons)
        'accent-secondary': '#64FFDA', // Lighter cyan (for sub-headings, hover states)
        'accent-tertiary': '#FFD700', // Golden yellow (for skill percentages, tags)
        'input-bg': '#3A3A3A', // Background for form inputs
      },
      boxShadow: {
        'glow-primary': '0 0 15px rgba(0, 230, 118, 0.7), 0 0 30px rgba(0, 230, 118, 0.5)', // Green glow
        'glow-secondary': '0 0 10px rgba(100, 255, 218, 0.5), 0 0 20px rgba(100, 255, 218, 0.3)', // Cyan glow
      },
      keyframes: {
        'fade-in-up': {
          'from': { opacity: '0', transform: 'translateY(20px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-left': {
          'from': { opacity: '0', transform: 'translateX(-50px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-right': {
          'from': { opacity: '0', transform: 'translateX(50px)' },
          'to': { opacity: '1', transform: 'translateX(0)' },
        },
        'progress-fill': {
          'from': { width: '0%' },
          'to': { width: 'var(--skill-width)' },
        },
        'shine': {
          '0%': { transform: 'translateX(-100%) skewX(-30deg)' },
          '100%': { transform: 'translateX(100%) skewX(100%)' }, // Adjusted end for full sweep
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in-left': 'fade-in-left 0.8s ease-out forwards',
        'fade-in-right': 'fade-in-right 0.8s ease-out forwards',
        'progress': 'progress-fill 1.5s ease-out forwards',
        'shine': 'shine 1s infinite linear',
      },
    },
  },
  plugins: [],
}