import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    './public/**/*.svg',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f3f8f4',
          100: '#e0f0e3',
          200: '#b8ddb9',
          300: '#8fc98f',
          400: '#5fa85f',
          500: '#2D5A27', // ForestGreen
          600: '#254a20',
          700: '#1d3919',
          800: '#142912',
          900: '#0b180b',
          950: '#061006',
        },
        secondary: {
          50: '#f7faf7',
          100: '#eaf4ea',
          200: '#d2e7d2',
          300: '#b3d7b3',
          400: '#8E9775', // SageLeaf
          500: '#7a8a67',
          600: '#667a59',
          700: '#52694b',
          800: '#3e583d',
          900: '#2a472f',
          950: '#1a2d1b',
        },
        accent: {
          50: '#fff7f3',
          100: '#ffe3d6',
          200: '#ffc2a3',
          300: '#ff9e6d',
          400: '#ff7a37',
          500: '#D96C32', // Terracotta
          600: '#b85a28',
          700: '#96481e',
          800: '#753614',
          900: '#53240a',
          950: '#2e1204',
        },
        neutral: {
          50: '#f8f7f6',
          100: '#eceae7',
          200: '#d6d2cc',
          300: '#b8b0a6',
          400: '#a89b8a',
          500: '#4E342E', // EarthlyGreys (brown/stone)
          600: '#3e2924',
          700: '#2e1e1a',
          800: '#1e1310',
          900: '#0e0806',
          950: '#070403',
        },
      },
      fontFamily: {
        heading: ["'Playfair Display'", 'serif'],
        sans: ["'Plus Jakarta Sans'", 'Geist', 'Inter', 'Arial', 'sans-serif'],
      },
      fontSize: {
        h1: [
          'clamp(2.5rem, 5vw + 1rem, 4rem)',
          { lineHeight: '1.1', fontWeight: '700', fontFamily: 'var(--font-heading)' },
        ],
        h2: [
          'clamp(2rem, 4vw + 1rem, 3rem)',
          { lineHeight: '1.15', fontWeight: '700', fontFamily: 'var(--font-heading)' },
        ],
        h3: [
          'clamp(1.5rem, 3vw + 1rem, 2.25rem)',
          { lineHeight: '1.2', fontWeight: '700', fontFamily: 'var(--font-heading)' },
        ],
        h4: [
          'clamp(1.25rem, 2vw + 1rem, 1.75rem)',
          { lineHeight: '1.25', fontWeight: '600', fontFamily: 'var(--font-heading)' },
        ],
        h5: [
          'clamp(1.125rem, 1vw + 1rem, 1.25rem)',
          { lineHeight: '1.3', fontWeight: '600', fontFamily: 'var(--font-heading)' },
        ],
        h6: [
          'clamp(1rem, 0.5vw + 1rem, 1.125rem)',
          { lineHeight: '1.35', fontWeight: '600', fontFamily: 'var(--font-heading)' },
        ],
        base: [
          'clamp(1rem, 0.8vw + 0.8rem, 1.125rem)',
          { lineHeight: '1.7', fontWeight: '400', fontFamily: 'var(--font-sans)' },
        ],
      },
      borderRadius: {
        'organic': '1.1rem 1.7rem 1.3rem 1.5rem/1.5rem 1.2rem 1.7rem 1.1rem',
        'leaf': '1.5rem 2.2rem 1.2rem 2rem/2rem 1.2rem 2.2rem 1.5rem',
      },
      boxShadow: {
        'organic': '0 4px 32px 0 rgba(45,90,39,0.10), 0 1.5px 6px 0 rgba(142,151,117,0.08)',
        'organic-lg': '0 8px 48px 0 rgba(45,90,39,0.13), 0 2px 8px 0 rgba(142,151,117,0.10)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#1d3919',
            '--tw-prose-headings': '#2D5A27',
            '--tw-prose-links': '#D96C32',
            '--tw-prose-bold': '#2D5A27',
            '--tw-prose-quotes': '#5fa85f',
            '--tw-prose-quote-borders': '#8fc98f',
            '--tw-prose-code': '#4E342E',
            color: '#1d3919',
            maxWidth: 'none',
            h1: { color: '#2D5A27', fontFamily: 'var(--font-heading)' },
            h2: { color: '#2D5A27', fontFamily: 'var(--font-heading)' },
            h3: { color: '#2D5A27', fontFamily: 'var(--font-heading)' },
            a: { color: '#D96C32', '&:hover': { color: '#b85a28' } },
            strong: { color: '#2D5A27' },
            blockquote: { borderColor: '#8fc98f', color: '#5fa85f' },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    plugin(({ addUtilities }) => {
      addUtilities({
        '.glass-morphism': {
          'background': 'rgba(255,255,255,0.7)',
          'backdrop-filter': 'blur(16px) saturate(1.2)',
          'border-radius': '1.5rem',
          'box-shadow': '0 4px 32px 0 rgba(45,90,39,0.10)',
          'border': '1px solid rgba(255,255,255,0.18)',
        },
        '.shimmer-effect': {
          'position': 'relative',
          'overflow': 'hidden',
        },
        ".shimmer-effect::after": {
          content: '""',
          position: "absolute",
          top: "0",
          left: "-150%",
          'width': '200%',
          'height': '100%',
          'background': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          'animation': 'shimmer 1.5s infinite',
        },
        "@keyframes shimmer": {
          "100%": { left: "150%" },
        },
        '.leaf-hover': {
          'transition': 'transform 0.3s cubic-bezier(.4,2,.6,1)',
        },
        '.leaf-hover:hover': {
          'transform': 'scale(1.04) rotate(-2deg)',
        },
      });
    }),
  ],
};

export default config;