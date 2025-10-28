'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useLayoutStore } from '@/lib/stores/layoutStore';

const navItems = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: '主页',
    href: '/',
    shortcut: '⌘1',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    label: '对话',
    href: '/conversations',
    shortcut: '⌘2',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
    ),
    label: '项目',
    href: '/projects',
    shortcut: '⌘3',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    label: '分身',
    href: '/avatars',
    shortcut: '⌘4',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    label: '商店',
    href: '/store',
    shortcut: '⌘5',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: '设备',
    href: '/devices',
    shortcut: '⌘6',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    label: '我的',
    href: '/economy',
    shortcut: '⌘7',
  },
];

export function LeftSidebar() {
  const pathname = usePathname();
  const { leftSidebarOpen, toggleLeftSidebar } = useLayoutStore();

  if (!leftSidebarOpen) {
    return (
      <button
        onClick={toggleLeftSidebar}
        className="fixed left-0 top-20 z-40 flex h-10 w-10 items-center justify-center rounded-r-[12px] transition-all"
        style={{
          backgroundColor: 'var(--color-bg-panel)',
          borderRight: '1px solid var(--color-border)',
          borderTop: '1px solid var(--color-border)',
          borderBottom: '1px solid var(--color-border)',
          color: 'var(--color-text-secondary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
          e.currentTarget.style.color = 'var(--color-text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-panel)';
          e.currentTarget.style.color = 'var(--color-text-secondary)';
        }}
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  }

  return (
    <div
      className="fixed left-0 top-16 bottom-0 w-60 pt-4"
      style={{
        borderRight: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-panel)',
      }}
    >
      {/* Navigation Items */}
      <nav className="space-y-1 px-3">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center justify-between rounded-[12px] px-3 py-2.5 transition-all',
              )}
              style={{
                backgroundColor: isActive ? 'var(--color-brand-primary)' : 'transparent',
                color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-caption)',
                fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
                  e.currentTarget.style.color = 'var(--color-text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = 'var(--color-text-secondary)';
                }
              }}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              <span
                className="text-xs"
                style={{
                  color: isActive ? 'rgba(255, 255, 255, 0.7)' : 'var(--color-text-muted)',
                }}
              >
                {item.shortcut}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Divider */}
      <div
        className="my-4 mx-3"
        style={{
          borderTop: '1px solid var(--color-border)',
        }}
      />

      {/* Quick Stats */}
      <div className="px-3">
        <h3
          className="mb-2 px-3 text-xs font-semibold uppercase"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: '11px',
            letterSpacing: '0.05em',
          }}
        >
          快速视图
        </h3>
        <div className="space-y-1">
          <button
            className="flex w-full items-center justify-between rounded-[12px] px-3 py-2 transition-all"
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <span>进行中</span>
            <span
              className="px-2 py-0.5 rounded-md text-xs"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                color: 'var(--color-accent-success)',
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              12
            </span>
          </button>
          <button
            className="flex w-full items-center justify-between rounded-[12px] px-3 py-2 transition-all"
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <span>待审批</span>
            <span
              className="px-2 py-0.5 rounded-md text-xs"
              style={{
                backgroundColor: 'rgba(122, 228, 199, 0.1)',
                color: 'var(--color-hitl-wave)',
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              3
            </span>
          </button>
          <button
            className="flex w-full items-center justify-between rounded-[12px] px-3 py-2 transition-all"
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <span>已完成</span>
            <span
              className="px-2 py-0.5 rounded-md text-xs"
              style={{
                backgroundColor: 'var(--color-bg-elevated)',
                color: 'var(--color-text-muted)',
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              45
            </span>
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={toggleLeftSidebar}
        className="absolute top-4 -right-3 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-all"
        style={{
          border: '1px solid var(--color-border)',
          backgroundColor: 'var(--color-bg-panel)',
          color: 'var(--color-text-secondary)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
          e.currentTarget.style.color = 'var(--color-text-primary)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'var(--color-bg-panel)';
          e.currentTarget.style.color = 'var(--color-text-secondary)';
        }}
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    </div>
  );
}
