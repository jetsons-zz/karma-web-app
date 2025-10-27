'use client';

import { TopNav } from './TopNav';
import { LeftSidebar } from './LeftSidebar';
import { BottomTabBar } from './BottomTabBar';
import { useLayoutStore } from '@/lib/stores/layoutStore';
import { cn } from '@/lib/utils';
import { SkipLink, KeyboardShortcuts } from '@/components/ui/accessibility';

interface MainLayoutProps {
  children: React.ReactNode;
  rightSidebar?: React.ReactNode;
}

export function MainLayout({ children, rightSidebar }: MainLayoutProps) {
  const { leftSidebarOpen, rightSidebarOpen } = useLayoutStore();

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: 'var(--color-bg-canvas)',
      }}
    >
      {/* Skip Link for keyboard navigation */}
      <SkipLink href="#main-content">Skip to main content</SkipLink>

      {/* Global keyboard shortcuts */}
      <KeyboardShortcuts />

      <TopNav />
      <LeftSidebar />

      <main
        id="main-content"
        className={cn(
          'min-h-screen pt-16 transition-all',
          'md:pb-0 pb-20', // Add bottom padding on mobile for bottom tab bar
          leftSidebarOpen ? 'pl-60' : 'pl-0',
          rightSidebarOpen && rightSidebar ? 'pr-80' : 'pr-0'
        )}
        style={{
          transitionDuration: 'var(--duration-std)',
          transitionTimingFunction: 'var(--ease-karma)',
        }}
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>

      {rightSidebar && rightSidebarOpen && (
        <div
          className="fixed right-0 top-16 bottom-0 w-80 overflow-y-auto hidden md:block"
          style={{
            borderLeft: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-panel)',
          }}
        >
          {rightSidebar}
        </div>
      )}

      {/* iOS-style Bottom Tab Bar (Mobile only) */}
      <BottomTabBar />
    </div>
  );
}
