import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  commandPaletteOpen: boolean;
  currentPage: string;
  selectedProjectId: string | null;
  selectedTaskId: string | null;

  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  toggleCommandPalette: () => void;
  setCurrentPage: (page: string) => void;
  setSelectedProject: (projectId: string | null) => void;
  setSelectedTask: (taskId: string | null) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'light',
      commandPaletteOpen: false,
      currentPage: 'conversations',
      selectedProjectId: null,
      selectedTaskId: null,

      setTheme: (theme) => set({ theme }),

      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),

      openCommandPalette: () => set({ commandPaletteOpen: true }),

      closeCommandPalette: () => set({ commandPaletteOpen: false }),

      toggleCommandPalette: () =>
        set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

      setCurrentPage: (page) => set({ currentPage: page }),

      setSelectedProject: (projectId) => set({ selectedProjectId: projectId }),

      setSelectedTask: (taskId) => set({ selectedTaskId: taskId }),
    }),
    {
      name: 'karma-ui-storage',
    }
  )
);
