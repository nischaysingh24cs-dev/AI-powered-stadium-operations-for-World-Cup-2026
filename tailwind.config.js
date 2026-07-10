/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pitchnight: '#0A1120',
        panel: '#111A2E',
        panel2: '#16213A',
        border: '#25314A',
        floodlight: '#F4F7FA',
        mist: '#93A1BD',
        turf: '#16A34A',
        turfdeep: '#0E7C3F',
        gold: '#C9A227',
        amber: '#F5A524',
        critical: '#E5484D',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      backgroundImage: {
        'floodlight-glow':
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,162,39,0.18), rgba(10,17,32,0) 60%)',
        'pitch-lines':
          'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 64px)',
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: '1' },
          '92%': { opacity: '1' },
          '93%': { opacity: '0.4' },
          '94%': { opacity: '1' },
        },
        pulseDot: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.35' },
        },
      },
      animation: {
        flicker: 'flicker 6s infinite',
        pulseDot: 'pulseDot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
