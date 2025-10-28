'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface TabItem {
  id: string;
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

export function BottomTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tabs: TabItem[] = [
    {
      id: 'conversations',
      icon: '💬',
      label: '对话',
      href: '/conversations',
      badge: 3,
    },
    {
      id: 'projects',
      icon: '📁',
      label: '项目',
      href: '/projects',
    },
    {
      id: 'devices',
      icon: '📱',
      label: '设备',
      href: '/devices',
    },
    {
      id: 'avatars',
      icon: '🤖',
      label: '分身',
      href: '/avatars',
    },
    {
      id: 'profile',
      icon: '👤',
      label: '我的',
      href: '/',
    },
  ];

  const handleTabClick = (href: string) => {
    // Haptic feedback (Web Vibration API)
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
    router.push(href);
  };

  // Only show on mobile
  if (!isMobile) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 safe-area-bottom"
      style={{
        height: '56px',
        backgroundColor: 'var(--color-bg-panel)',
        borderTop: '1px solid var(--color-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="flex items-center justify-around h-full px-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href ||
                          (tab.href !== '/' && pathname.startsWith(tab.href));

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.href)}
              className="flex flex-col items-center justify-center flex-1 h-full relative"
              style={{
                color: isActive ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                transition: 'all var(--duration-std) var(--ease-karma)',
                minWidth: '44px', // iOS minimum touch target
              }}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              {/* Icon */}
              <span
                className="text-2xl mb-1"
                style={{
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  transition: 'transform var(--duration-fast) var(--ease-karma)',
                }}
              >
                {tab.icon}
              </span>

              {/* Label */}
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
                }}
              >
                {tab.label}
              </span>

              {/* Badge */}
              {tab.badge && tab.badge > 0 && (
                <span
                  className="absolute top-2 right-1/4"
                  style={{
                    backgroundColor: 'var(--color-accent-danger)',
                    color: '#FFFFFF',
                    fontSize: '10px',
                    fontWeight: 'var(--font-weight-bold)',
                    padding: '2px 6px',
                    borderRadius: '10px',
                    minWidth: '18px',
                    textAlign: 'center',
                  }}
                  aria-label={`${tab.badge} unread items`}
                >
                  {tab.badge > 99 ? '99+' : tab.badge}
                </span>
              )}

              {/* Active Indicator */}
              {isActive && (
                <div
                  className="absolute -bottom-px left-1/2"
                  style={{
                    width: '32px',
                    height: '2px',
                    backgroundColor: 'var(--color-brand-primary)',
                    borderRadius: '2px 2px 0 0',
                    transform: 'translateX(-50%)',
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
