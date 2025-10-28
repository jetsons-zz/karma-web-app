/**
 * ThemeProvider Component
 *
 * Manages application-wide theme (dark/light mode) with:
 * - System preference detection
 * - LocalStorage persistence
 * - No flash of unstyled content (FOUC)
 * - Smooth transitions
 *
 * Usage:
 * Wrap your app with ThemeProvider in the root layout
 */

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'karma-theme',
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // Resolve theme (system -> actual light/dark)
  const resolveTheme = (theme: Theme): 'light' | 'dark' => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  };

  // Apply theme to document
  const applyTheme = (resolved: 'light' | 'dark', disableTransition = false) => {
    const root = document.documentElement;

    // Disable transitions temporarily
    if (disableTransition && !disableTransitionOnChange) {
      root.style.setProperty('--theme-transition', 'none');
    }

    // Remove both classes first
    root.classList.remove('light', 'dark');

    // Add the new class
    root.classList.add(resolved);

    // Set color-scheme for native elements
    root.style.colorScheme = resolved;

    // Re-enable transitions after a brief delay
    if (disableTransition && !disableTransitionOnChange) {
      setTimeout(() => {
        root.style.removeProperty('--theme-transition');
      }, 50);
    }

    setResolvedTheme(resolved);
  };

  // Set theme
  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (e) {
      console.warn('Failed to save theme to localStorage:', e);
    }

    setThemeState(newTheme);
    const resolved = resolveTheme(newTheme);
    applyTheme(resolved);
  };

  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);

    // Get saved theme from localStorage
    let savedTheme: Theme = defaultTheme;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        savedTheme = stored as Theme;
      }
    } catch (e) {
      console.warn('Failed to read theme from localStorage:', e);
    }

    setThemeState(savedTheme);
    const resolved = resolveTheme(savedTheme);
    applyTheme(resolved, true); // Disable transition on initial load
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (!enableSystem || theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      const resolved = resolveTheme('system');
      applyTheme(resolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, enableSystem]);

  // Prevent flash of unstyled content by not rendering until mounted
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Script to prevent FOUC (Flash of Unstyled Content)
 * Add this to your root layout's <head> or <body>
 */
export function ThemeScript({ storageKey = 'karma-theme' }: { storageKey?: string }) {
  const themeScript = `
    (function() {
      try {
        var theme = localStorage.getItem('${storageKey}') || 'system';
        var resolved = theme;

        if (theme === 'system') {
          resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        document.documentElement.classList.add(resolved);
        document.documentElement.style.colorScheme = resolved;
      } catch (e) {
        console.error('Theme initialization error:', e);
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: themeScript }}
      suppressHydrationWarning
    />
  );
}
