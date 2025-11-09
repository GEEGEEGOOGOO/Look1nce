import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e50914',
        'primary-dark': '#c40812',
        'primary-light': '#ff6b6b',
        secondary: '#808080',
        'bg-dark': '#0a0a0a',
        'bg-card': '#1a1a1a',
        'bg-card-hover': '#2a2a2a',
        'border-dark': '#2a2a2a',
        'text-muted': '#808080',
        'text-light': '#b3b3b3',
      },
      backgroundImage: {
        'netflix-gradient': 'linear-gradient(to bottom, rgba(229, 9, 20, 0.1), transparent)',
      },
    },
  },
  plugins: [],
}
export default config
