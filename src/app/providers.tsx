'use client';

import { CommandPalette } from '@/components/features/CommandPalette';
import { ModalManager } from '@/components/features/ModalManager';
import { ToastContainer } from '@/components/ui/Toast';
import { useKeyboardShortcuts } from '@/lib/hooks/useKeyboardShortcuts';

export function Providers({ children }: { children: React.ReactNode }) {
  useKeyboardShortcuts();

  return (
    <>
      {children}
      <CommandPalette />
      <ModalManager />
      <ToastContainer />
    </>
  );
}
