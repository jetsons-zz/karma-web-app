'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useUIStore } from '@/lib/stores/uiStore';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  label: string;
  icon: string;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen, closeCommandPalette } = useUIStore();
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = [
    // Navigation
    { id: 'nav-conversations', label: '打开对话页面', icon: '💬', shortcut: '⌘1', action: () => router.push('/conversations'), category: '导航' },
    { id: 'nav-projects', label: '打开项目页面', icon: '📁', shortcut: '⌘2', action: () => router.push('/projects'), category: '导航' },
    { id: 'nav-avatars', label: '打开分身页面', icon: '🤖', shortcut: '⌘3', action: () => router.push('/avatars'), category: '导航' },
    { id: 'nav-store', label: '打开商店页面', icon: '🛒', shortcut: '⌘4', action: () => router.push('/store'), category: '导航' },
    { id: 'nav-profile', label: '打开个人中心', icon: '👤', shortcut: '⌘5', action: () => router.push('/profile'), category: '导航' },

    // Creation
    { id: 'create-project', label: '新建项目', icon: '➕', shortcut: 'N', action: () => alert('创建项目'), category: '创建' },
    { id: 'create-task', label: '新建任务', icon: '✓', shortcut: 'T', action: () => alert('创建任务'), category: '创建' },
    { id: 'create-avatar', label: '创建分身', icon: '🤖', action: () => alert('创建分身'), category: '创建' },

    // View
    { id: 'toggle-sidebar', label: '切换侧边栏', icon: '📐', shortcut: '⌘B', action: () => {}, category: '视图' },
    { id: 'toggle-theme', label: '切换主题', icon: '🌓', shortcut: '⌘Shift+D', action: () => {}, category: '视图' },

    // Help
    { id: 'shortcuts', label: '快捷键列表', icon: '⌨️', shortcut: '?', action: () => alert('快捷键列表'), category: '帮助' },
    { id: 'docs', label: '查看文档', icon: '📖', action: () => window.open('https://docs.karma.com', '_blank'), category: '帮助' },
  ];

  const filteredCommands = useMemo(() => {
    if (!search) return commands;
    return commands.filter(cmd =>
      cmd.label.toLowerCase().includes(search.toLowerCase()) ||
      cmd.category.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, commands]);

  useEffect(() => {
    if (!commandPaletteOpen) {
      setSearch('');
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!commandPaletteOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
            closeCommandPalette();
          }
          break;
        case 'Escape':
          e.preventDefault();
          closeCommandPalette();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, filteredCommands, selectedIndex, closeCommandPalette]);

  if (!commandPaletteOpen) return null;

  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, Command[]>);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-[20vh] animate-fade-in"
      onClick={closeCommandPalette}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-lg shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            <svg className="h-5 w-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="输入命令或搜索..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 outline-none text-neutral-900 placeholder:text-neutral-400"
              autoFocus
            />
            <kbd className="px-2 py-1 text-xs font-mono bg-neutral-100 rounded">ESC</kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {Object.entries(groupedCommands).map(([category, cmds]) => (
            <div key={category} className="mb-4">
              <div className="px-3 py-1 text-xs font-semibold text-neutral-500 uppercase">
                {category}
              </div>
              {cmds.map((cmd, index) => {
                const globalIndex = filteredCommands.findIndex(c => c.id === cmd.id);
                return (
                  <button
                    key={cmd.id}
                    onClick={() => {
                      cmd.action();
                      closeCommandPalette();
                    }}
                    className={cn(
                      'w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors',
                      globalIndex === selectedIndex
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-lg">{cmd.icon}</span>
                      <span className="text-sm font-medium">{cmd.label}</span>
                    </div>
                    {cmd.shortcut && (
                      <kbd className="px-2 py-1 text-xs font-mono bg-neutral-100 rounded">
                        {cmd.shortcut}
                      </kbd>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {filteredCommands.length === 0 && (
            <div className="py-12 text-center text-neutral-400">
              未找到匹配的命令
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex items-center space-x-4">
            <span>↑↓ 选择</span>
            <span>Enter 执行</span>
            <span>ESC 关闭</span>
          </div>
          <span>{filteredCommands.length} 个命令</span>
        </div>
      </div>
    </div>
  );
}
