import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/uiStore';
import { useLayoutStore } from '@/lib/stores/layoutStore';

export function useKeyboardShortcuts() {
  const router = useRouter();
  const { openCommandPalette, toggleTheme } = useUIStore();
  const { toggleLeftSidebar, toggleRightSidebar } = useLayoutStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modKey = isMac ? e.metaKey : e.ctrlKey;

      // Command Palette (Cmd/Ctrl + K)
      if (modKey && e.key === 'k') {
        e.preventDefault();
        openCommandPalette();
        return;
      }

      // Navigation shortcuts (Cmd/Ctrl + 1-5)
      if (modKey && !e.shiftKey && /^[1-5]$/.test(e.key)) {
        e.preventDefault();
        const routes = ['/conversations', '/projects', '/avatars', '/store', '/profile'];
        router.push(routes[parseInt(e.key) - 1]);
        return;
      }

      // Toggle sidebars (Cmd/Ctrl + B and Cmd/Ctrl + /)
      if (modKey && e.key === 'b') {
        e.preventDefault();
        toggleLeftSidebar();
        return;
      }

      if (modKey && e.key === '/') {
        e.preventDefault();
        toggleRightSidebar();
        return;
      }

      // Toggle theme (Cmd/Ctrl + Shift + D)
      if (modKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        toggleTheme();
        return;
      }

      // Show shortcuts help (?)
      if (e.key === '?' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        alert('快捷键列表\n\n' +
          '⌘K - 打开命令面板\n' +
          '⌘1-5 - 切换页面\n' +
          '⌘B - 切换左侧边栏\n' +
          '⌘/ - 切换右侧边栏\n' +
          '⌘Shift+D - 切换主题\n' +
          '? - 显示此帮助'
        );
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, openCommandPalette, toggleTheme, toggleLeftSidebar, toggleRightSidebar]);
}
