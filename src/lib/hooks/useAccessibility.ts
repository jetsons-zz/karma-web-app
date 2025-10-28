/**
 * useAccessibility Hook
 *
 * Provides accessibility utilities and helpers for components.
 * Helps ensure WCAG 2.1 AA compliance.
 */

import { useEffect, useRef } from 'react';

export interface AccessibilityOptions {
  /** Auto-focus element on mount */
  autoFocus?: boolean;
  /** Announce changes to screen readers */
  announceChanges?: boolean;
  /** Trap focus within container */
  trapFocus?: boolean;
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Generate unique ID for accessibility labels
 */
export function useUniqueId(prefix: string = 'a11y'): string {
  const idRef = useRef<string>('');

  if (!idRef.current) {
    idRef.current = `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  }

  return idRef.current;
}

/**
 * Hook for managing focus trap in modals/dialogs
 */
export function useFocusTrap(enabled: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }, [enabled]);

  return containerRef;
}

/**
 * Hook for keyboard navigation in lists
 */
export function useKeyboardNavigation<T extends HTMLElement>(itemCount: number) {
  const containerRef = useRef<T>(null);
  const currentIndexRef = useRef(-1);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!containerRef.current) return;

    const items = Array.from(
      containerRef.current.querySelectorAll('[role="option"], [role="menuitem"], [role="tab"]')
    ) as HTMLElement[];

    switch (e.key) {
      case 'ArrowDown':
      case 'Down':
        e.preventDefault();
        currentIndexRef.current = Math.min(currentIndexRef.current + 1, items.length - 1);
        items[currentIndexRef.current]?.focus();
        break;

      case 'ArrowUp':
      case 'Up':
        e.preventDefault();
        currentIndexRef.current = Math.max(currentIndexRef.current - 1, 0);
        items[currentIndexRef.current]?.focus();
        break;

      case 'Home':
        e.preventDefault();
        currentIndexRef.current = 0;
        items[0]?.focus();
        break;

      case 'End':
        e.preventDefault();
        currentIndexRef.current = items.length - 1;
        items[items.length - 1]?.focus();
        break;
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('keydown', handleKeyDown as any);
    return () => {
      container.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [itemCount]);

  return containerRef;
}

/**
 * Hook to announce route changes to screen readers
 */
export function useRouteAnnouncement(routeName: string) {
  useEffect(() => {
    announceToScreenReader(`Navigated to ${routeName}`, 'polite');
  }, [routeName]);
}

/**
 * Check if user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Export React for useState
import React from 'react';
