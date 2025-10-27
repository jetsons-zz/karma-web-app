'use client';

import Link from 'next/link';
import { Avatar } from '@/components/ui/Avatar';
import { useUIStore } from '@/lib/stores/uiStore';
import { mockCurrentUser, mockNotifications } from '@/lib/mock/data';

export function TopNav() {
  const { openCommandPalette } = useUIStore();
  const unreadCount = mockNotifications.filter(n => !n.isRead).length;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 h-16 backdrop-blur-md"
      style={{
        borderBottom: '1px solid var(--color-border)',
        backgroundColor: 'rgba(20, 20, 25, 0.8)',
      }}
    >
      <div className="flex h-full items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-[12px] font-bold"
            style={{
              backgroundColor: 'var(--color-brand-primary)',
              color: '#FFFFFF',
              fontSize: 'var(--font-size-h3)',
            }}
          >
            K
          </div>
          <span
            style={{
              fontSize: 'var(--font-size-h2)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
            }}
          >
            Karma
          </span>
        </Link>

        {/* Search Bar */}
        <button
          onClick={openCommandPalette}
          className="flex h-10 w-96 items-center gap-2 rounded-[12px] px-3 transition-all"
          style={{
            border: '1px solid var(--color-border)',
            backgroundColor: 'var(--color-bg-panel)',
            fontSize: 'var(--font-size-caption)',
            color: 'var(--color-text-muted)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-brand-primary)';
            e.currentTarget.style.filter = 'brightness(1.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-border)';
            e.currentTarget.style.filter = 'brightness(1)';
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <span>搜索项目、任务、分身...</span>
          <span className="ml-auto text-xs" style={{ color: 'var(--color-text-muted)' }}>⌘K</span>
        </button>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Command Palette */}
          <button
            onClick={openCommandPalette}
            className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-all focus-ring"
            style={{
              color: 'var(--color-text-secondary)',
            }}
            title="命令面板 (⌘K)"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
              e.currentTarget.style.color = 'var(--color-text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = 'var(--color-text-secondary)';
            }}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>

          {/* Notifications */}
          <button
            className="relative flex h-10 w-10 items-center justify-center rounded-[12px] transition-all focus-ring"
            style={{
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
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-xs"
                style={{
                  backgroundColor: 'var(--color-accent-danger)',
                  color: '#FFFFFF',
                  fontSize: '10px',
                  fontWeight: 'var(--font-weight-bold)',
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {/* Settings */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-[12px] transition-all focus-ring"
            style={{
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
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {/* User Avatar */}
          <button
            className="flex items-center gap-2 rounded-[12px] pl-2 pr-3 py-1.5 transition-all"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <Avatar
              src={mockCurrentUser.avatar}
              name={mockCurrentUser.name}
              size="sm"
              status="online"
            />
            <span
              style={{
                fontSize: 'var(--font-size-caption)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
              }}
            >
              {mockCurrentUser.name}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
