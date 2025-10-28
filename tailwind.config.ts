import type { Config } from "tailwindcss";
import tokens from "./tokens/tokens.json";

const config: Config = {
  darkMode: 'class', // Use class strategy for manual dark mode toggle
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Override default Tailwind screens with iOS-centric breakpoints
    screens: {
      'xs': '320px',   // iPhone SE
      'sm': '375px',   // iPhone 13 Pro
      'md': '428px',   // iPhone 13 Pro Max
      'lg': '744px',   // iPad Mini (portrait)
      'xl': '1024px',  // iPad Pro (portrait)
      '2xl': '1280px', // MacBook
      '3xl': '1920px', // iMac 5K
    },
    // Override spacing to enforce 8px grid system
    spacing: {
      '0': '0',
      'px': '1px',
      '0.5': '4px',   // 0.5x (special cases only)
      '1': '8px',     // 1x (sm)
      '2': '16px',    // 2x (md)
      '3': '24px',    // 3x (lg)
      '4': '32px',    // 4x (xl)
      '5': '40px',    // 5x (2xl)
      '6': '48px',    // 6x (3xl)
      '7': '56px',    // 7x
      '8': '64px',    // 8x
      '9': '72px',    // 9x
      '10': '80px',   // 10x
      '11': '88px',   // 11x (44px * 2)
      '12': '96px',   // 12x
      '14': '112px',  // 14x
      '16': '128px',  // 16x
      '20': '160px',  // 20x
      '24': '192px',  // 24x
      '28': '224px',  // 28x
      '32': '256px',  // 32x
      '36': '288px',  // 36x
      '40': '320px',  // 40x
      '44': '352px',  // 44x
      '48': '384px',  // 48x
      '52': '416px',  // 52x
      '56': '448px',  // 56x
      '60': '480px',  // 60x
      '64': '512px',  // 64x
      '72': '576px',  // 72x
      '80': '640px',  // 80x
      '96': '768px',  // 96x
      // Keep token-based spacing for compatibility
      'xxs': `${tokens.space.xxs}px`,
      'xs': `${tokens.space.xs}px`,
      'sm': `${tokens.space.sm}px`,
      'md': `${tokens.space.md}px`,
      'lg': `${tokens.space.lg}px`,
      'xl': `${tokens.space.xl}px`,
      'xxl': `${tokens.space.xxl}px`,
    },
    extend: {
      colors: {
        // Keep existing token-based colors
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
        // Add iOS HIG color scales
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#2196F3',
          600: '#1E88E5',
          700: '#1976D2',
          800: '#1565C0',
          900: '#0D47A1',
        },
        secondary: {
          50: '#F3E5F5',
          100: '#E1BEE7',
          200: '#CE93D8',
          300: '#BA68C8',
          400: '#AB47BC',
          500: '#9C27B0',
          600: '#8E24AA',
          700: '#7B1FA2',
          800: '#6A1B9A',
          900: '#4A148C',
        },
        neutral: {
          0: '#FFFFFF',
          50: '#FAFAFA',
          100: '#F5F5F5',
          200: '#EEEEEE',
          300: '#E0E0E0',
          400: '#BDBDBD',
          500: '#9E9E9E',
          600: '#757575',
          700: '#616161',
          800: '#424242',
          900: '#212121',
          1000: '#000000',
        },
        success: {
          light: '#81C784',
          DEFAULT: '#4CAF50',
          dark: '#388E3C',
        },
        warning: {
          light: '#FFB74D',
          DEFAULT: '#FF9800',
          dark: '#F57C00',
        },
        error: {
          light: '#E57373',
          DEFAULT: '#F44336',
          dark: '#D32F2F',
        },
        info: {
          light: '#64B5F6',
          DEFAULT: '#2196F3',
          dark: '#1976D2',
        },
        // Dark theme specific colors
        dark: {
          bg: {
            default: '#121212',
            paper: '#1E1E1E',
            secondary: '#2C2C2C',
            tertiary: '#383838',
          },
          text: {
            primary: 'rgba(255, 255, 255, 0.87)',
            secondary: 'rgba(255, 255, 255, 0.60)',
            disabled: 'rgba(255, 255, 255, 0.38)',
          },
          primary: {
            main: '#90CAF9',
            light: '#E3F2FD',
            dark: '#42A5F5',
          },
          divider: 'rgba(255, 255, 255, 0.12)',
        },
      },
      fontFamily: {
        sans: tokens.typography.font.family.split(", "),
        mono: ['JetBrains Mono', 'Monaco', 'Consolas', 'monospace'],
      },
      fontSize: {
        // Keep token-based sizes
        h1: [`${tokens.typography.h1.size}px`, { fontWeight: `${tokens.typography.weight.bold}` }],
        h2: [`${tokens.typography.h2.size}px`, { fontWeight: `${tokens.typography.weight.bold}` }],
        h3: [`${tokens.typography.h3.size}px`, { fontWeight: `${tokens.typography.weight.medium}` }],
        body: [`${tokens.typography.body.size}px`, { fontWeight: `${tokens.typography.weight.regular}` }],
        caption: [`${tokens.typography.caption.size}px`, { fontWeight: `${tokens.typography.weight.regular}` }],
        numeric: [`${tokens.typography.numeric.size}px`, { fontWeight: `${tokens.typography.weight.medium}` }],
        // Add iOS HIG typography system
        'display-1': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'display-2': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'h4': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-1': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-2': ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'overline': ['10px', { lineHeight: '16px', fontWeight: '600', letterSpacing: '1px' }],
      },
      borderRadius: {
        xs: `${tokens.radius.xs}px`,
        sm: `${tokens.radius.sm}px`,
        md: `${tokens.radius.md}px`,
        lg: `${tokens.radius.lg}px`,
        xl: `${tokens.radius.xl}px`,
        'full': '9999px',
      },
      boxShadow: {
        // Keep token-based shadows
        sm: tokens.shadow.sm,
        md: tokens.shadow.md,
        // Add iOS HIG elevation system
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
        'elevation-2': '0 3px 6px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'elevation-3': '0 6px 12px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.10)',
        'elevation-4': '0 12px 24px rgba(0, 0, 0, 0.18), 0 8px 16px rgba(0, 0, 0, 0.12)',
        'elevation-5': '0 24px 48px rgba(0, 0, 0, 0.20), 0 16px 32px rgba(0, 0, 0, 0.15)',
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
        'fade-in-fast': 'fadeIn 100ms cubic-bezier(0.2,0.8,0.2,1)',
        'fade-in-slow': 'fadeIn 300ms cubic-bezier(0.2,0.8,0.2,1)',
        'slide-in': 'slideIn 200ms cubic-bezier(0.2,0.8,0.2,1)',
        'slide-in-fast': 'slideIn 120ms cubic-bezier(0.2,0.8,0.2,1)',
        'slide-up': 'slideUp 200ms cubic-bezier(0.2,0.8,0.2,1)',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.2,0.8,0.2,1)',
        'scale-in-fast': 'scaleIn 100ms cubic-bezier(0.2,0.8,0.2,1)',
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
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
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
      // iOS HIG Touch target sizes
      minHeight: {
        'touch': '44px', // iOS HIG minimum
        'touch-sm': '36px',
        'touch-lg': '48px',
      },
      minWidth: {
        'touch': '44px',
        'touch-sm': '36px',
        'touch-lg': '48px',
      },
    },
  },
  plugins: [],
};

export default config;
