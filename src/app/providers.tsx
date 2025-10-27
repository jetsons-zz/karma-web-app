'use client';

import { CommandPalette } from '@/components/features/CommandPalette';
import { ToastContainer } from '@/components/ui/Toast';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

export function Providers({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();

  return (
    <>
      {children}
      <CommandPalette />
      <ToastContainer />
    </>
  );
}
