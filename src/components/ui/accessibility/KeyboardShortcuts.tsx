/**
 * KeyboardShortcuts Component
 *
 * Global keyboard shortcut handler with visual help overlay.
 * Provides keyboard navigation throughout the application.
 *
 * Shortcuts:
 * - ? : Show keyboard shortcuts help
 * - / : Focus search
 * - Cmd+K : Open command palette
 * - Esc : Close modals/overlays
 */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '../Button';
import { Card, CardHeader, CardTitle, CardContent } from '../Card';

export function KeyboardShortcuts() {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Show help with ? key
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        // Don't trigger if user is typing in an input
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;
        e.preventDefault();
        setShowHelp(true);
      }

      // Close help with Escape
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false);
      }

      // Global navigation shortcuts
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey) {
        switch (e.key.toLowerCase()) {
          case 'k':
            e.preventDefault();
            // Command palette is handled by the command palette component
            break;
          case '1':
            e.preventDefault();
            router.push('/');
            break;
          case '2':
            e.preventDefault();
            router.push('/projects');
            break;
          case '3':
            e.preventDefault();
            router.push('/avatars');
            break;
          case '4':
            e.preventDefault();
            router.push('/conversations');
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showHelp, router]);

  if (!showHelp) return null;

  const shortcuts = [
    {
      category: 'Navigation',
      items: [
        { keys: ['Cmd', '1'], description: 'Go to Dashboard' },
        { keys: ['Cmd', '2'], description: 'Go to Projects' },
        { keys: ['Cmd', '3'], description: 'Go to Avatars' },
        { keys: ['Cmd', '4'], description: 'Go to Conversations' },
      ],
    },
    {
      category: 'Actions',
      items: [
        { keys: ['Cmd', 'K'], description: 'Open command palette' },
        { keys: ['/'], description: 'Focus search' },
        { keys: ['?'], description: 'Show keyboard shortcuts' },
        { keys: ['Esc'], description: 'Close modal or overlay' },
      ],
    },
    {
      category: 'Accessibility',
      items: [
        { keys: ['Tab'], description: 'Navigate forward' },
        { keys: ['Shift', 'Tab'], description: 'Navigate backward' },
        { keys: ['Enter'], description: 'Activate focused element' },
        { keys: ['Space'], description: 'Toggle checkboxes/buttons' },
      ],
    },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
      }}
      onClick={() => setShowHelp(false)}
      role="dialog"
      aria-modal="true"
      aria-labelledby="shortcuts-title"
    >
      <Card
        style={{ maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle id="shortcuts-title">Keyboard Shortcuts</CardTitle>
            <button
              onClick={() => setShowHelp(false)}
              className="p-2 rounded-lg transition-all"
              style={{
                color: 'var(--color-text-secondary)',
                minHeight: '44px',
                minWidth: '44px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
              aria-label="Close keyboard shortcuts help"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {shortcuts.map((category) => (
              <div key={category.category}>
                <h3
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-md)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {item.description}
                      </span>
                      <div className="flex items-center gap-1">
                        {item.keys.map((key, keyIndex) => (
                          <span
                            key={keyIndex}
                            className="px-2 py-1 rounded"
                            style={{
                              backgroundColor: 'var(--color-bg-elevated)',
                              border: '1px solid var(--color-border)',
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-text-primary)',
                              fontFamily: 'monospace',
                            }}
                          >
                            {key}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
