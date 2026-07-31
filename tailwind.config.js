/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Design System Colors
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6', // Primary Blue
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        tealbrand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6', // Secondary Teal
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        // Semantic names mapping
        primary: {
          DEFAULT: '#2563eb', // Brand Blue
          dark: '#1d4ed8',
        },
        secondary: {
          DEFAULT: '#0d9488', // Brand Teal
          dark: '#0f766e',
        },
        success: {
          DEFAULT: '#10b981', // Green
          dark: '#047857',
        },
        warning: {
          DEFAULT: '#f59e0b', // Orange
          dark: '#b45309',
        },
        critical: {
          DEFAULT: '#ef4444', // Red
          dark: '#b91c1c',
        },
        darkbg: {
          DEFAULT: '#0b0f19', // Deep dark blue-gray (Grafana-like)
          card: '#161e2e',
          border: '#1f2a3d',
          input: '#1f2937',
        },
        lightbg: {
          DEFAULT: '#f8fafc', // Very Light Gray
          card: '#ffffff',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Roboto', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.08)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 8px -1px rgba(0, 0, 0, 0.03)',
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)',
      },
    },
  },
  plugins: [],
}
