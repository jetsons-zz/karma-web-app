/**
 * SkipLink Component
 *
 * Provides keyboard users a way to skip navigation and jump directly to main content.
 * WCAG 2.1 Level A requirement for accessibility.
 *
 * Usage:
 * <SkipLink href="#main-content">Skip to main content</SkipLink>
 */

import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
}

export function SkipLink({ href, children }: SkipLinkProps) {
  return (
    <a
      href={href}
      className="skip-link"
      style={{
        position: 'absolute',
        left: '-9999px',
        zIndex: 9999,
        padding: '16px',
        backgroundColor: 'var(--color-brand-primary)',
        color: '#FFFFFF',
        textDecoration: 'none',
        borderRadius: '4px',
        fontWeight: 'var(--font-weight-medium)',
        fontSize: 'var(--font-size-body)',
      }}
      onFocus={(e) => {
        e.currentTarget.style.left = '16px';
        e.currentTarget.style.top = '16px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.left = '-9999px';
      }}
    >
      {children}
    </a>
  );
}
