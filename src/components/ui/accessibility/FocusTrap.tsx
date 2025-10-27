/**
 * FocusTrap Component
 *
 * Traps keyboard focus within a specific container (e.g., modals, drawers).
 * Essential for modal dialogs to maintain accessibility.
 *
 * Usage:
 * <FocusTrap>
 *   <Modal>...</Modal>
 * </FocusTrap>
 */

import { useEffect, useRef, ReactNode } from 'react';

interface FocusTrapProps {
  children: ReactNode;
  active?: boolean;
  onEscape?: () => void;
}

export function FocusTrap({ children, active = true, onEscape }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) return;

    // Store the currently focused element
    previousFocusRef.current = document.activeElement as HTMLElement;

    // Focus the first focusable element in the container
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle Escape key
      if (e.key === 'Escape' && onEscape) {
        onEscape();
        return;
      }

      // Handle Tab key for focus trap
      if (e.key === 'Tab') {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: moving backwards
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: moving forwards
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus to the previously focused element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    };
  }, [active, onEscape]);

  return (
    <div ref={containerRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
