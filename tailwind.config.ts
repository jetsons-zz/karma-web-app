import type { Config } from "tailwindcss";
import tokens from "./tokens/tokens.json";

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          canvas: tokens.colors.bg.canvas,
          panel: tokens.colors.bg.panel,
          elevated: tokens.colors.bg.elevated,
        },
        text: {
          primary: tokens.colors.text.primary,
          secondary: tokens.colors.text.secondary,
          muted: tokens.colors.text.muted,
        },
        brand: {
          primary: tokens.colors.brand.primary,
          secondary: tokens.colors.brand.secondary,
        },
        accent: {
          success: tokens.colors.accent.success,
          warning: tokens.colors.accent.warning,
          danger: tokens.colors.accent.danger,
        },
        border: {
          DEFAULT: tokens.colors.border.default,
        },
        chart: {
          line: tokens.colors.chart.line,
        },
        hitl: {
          wave: tokens.colors.hitl.wave,
        },
      },
      fontFamily: {
        sans: tokens.typography.font.family.split(", "),
      },
      fontSize: {
        h1: [`${tokens.typography.h1.size}px`, { fontWeight: `${tokens.typography.weight.bold}` }],
        h2: [`${tokens.typography.h2.size}px`, { fontWeight: `${tokens.typography.weight.bold}` }],
        h3: [`${tokens.typography.h3.size}px`, { fontWeight: `${tokens.typography.weight.medium}` }],
        body: [`${tokens.typography.body.size}px`, { fontWeight: `${tokens.typography.weight.regular}` }],
        caption: [`${tokens.typography.caption.size}px`, { fontWeight: `${tokens.typography.weight.regular}` }],
        numeric: [`${tokens.typography.numeric.size}px`, { fontWeight: `${tokens.typography.weight.medium}` }],
      },
      borderRadius: {
        xs: `${tokens.radius.xs}px`,
        sm: `${tokens.radius.sm}px`,
        md: `${tokens.radius.md}px`,
        lg: `${tokens.radius.lg}px`,
        xl: `${tokens.radius.xl}px`,
      },
      spacing: {
        xxs: `${tokens.space.xxs}px`,
        xs: `${tokens.space.xs}px`,
        sm: `${tokens.space.sm}px`,
        md: `${tokens.space.md}px`,
        lg: `${tokens.space.lg}px`,
        xl: `${tokens.space.xl}px`,
        xxl: `${tokens.space.xxl}px`,
      },
      boxShadow: {
        sm: tokens.shadow.sm,
        md: tokens.shadow.md,
      },
      transitionDuration: {
        fast: `${tokens.motion.duration.fast}ms`,
        std: `${tokens.motion.duration.std}ms`,
        slow: `${tokens.motion.duration.slow}ms`,
      },
      transitionTimingFunction: {
        karma: tokens.motion.curve,
      },
      animation: {
        'fade-in': 'fadeIn 200ms cubic-bezier(0.2,0.8,0.2,1)',
        'slide-in': 'slideIn 200ms cubic-bezier(0.2,0.8,0.2,1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.2,0.8,0.2,1)',
        'hitl-wave': 'hitlWave 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.96)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        hitlWave: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(0.98)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
