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
        game: {
          primary: '#2563eb',    // Bright blue for energy
          secondary: '#7c3aed',  // Purple for challenge
          accent: '#f59e0b',     // Amber for excitement
          success: '#10b981',    // Green for team 1
          danger: '#ef4444',     // Red for team 2
          neutral: '#6b7280',    // Gray for no answer
          dark: '#1e293b',       // Dark blue for background
          light: '#f8fafc',      // Light for text
        }
      }
    },
  },
  plugins: [],
}
export default config 