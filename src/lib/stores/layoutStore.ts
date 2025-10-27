import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface LayoutState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  splitViewEnabled: boolean;
  splitViewRatio: number;

  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  setLeftSidebarWidth: (width: number) => void;
  setRightSidebarWidth: (width: number) => void;
  enableSplitView: () => void;
  disableSplitView: () => void;
  setSplitRatio: (ratio: number) => void;
  resetLayout: () => void;
}

export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      leftSidebarOpen: true,
      rightSidebarOpen: false,
      leftSidebarWidth: 240,
      rightSidebarWidth: 320,
      splitViewEnabled: false,
      splitViewRatio: 0.5,

      toggleLeftSidebar: () =>
        set((state) => ({ leftSidebarOpen: !state.leftSidebarOpen })),

      toggleRightSidebar: () =>
        set((state) => ({ rightSidebarOpen: !state.rightSidebarOpen })),

      setLeftSidebarWidth: (width) => set({ leftSidebarWidth: width }),

      setRightSidebarWidth: (width) => set({ rightSidebarWidth: width }),

      enableSplitView: () => set({ splitViewEnabled: true }),

      disableSplitView: () => set({ splitViewEnabled: false }),

      setSplitRatio: (ratio) => set({ splitViewRatio: ratio }),

      resetLayout: () =>
        set({
          leftSidebarOpen: true,
          rightSidebarOpen: false,
          leftSidebarWidth: 240,
          rightSidebarWidth: 320,
          splitViewEnabled: false,
          splitViewRatio: 0.5,
        }),
    }),
    {
      name: 'karma-layout-storage',
    }
  )
);
