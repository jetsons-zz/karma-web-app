'use client';

import { useEffect, useState } from 'react';
import { HapticFeedback } from '@/lib/utils/haptics';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    handler: () => void;
  };
}

class ToastManager {
  private listeners: Set<(toasts: Toast[]) => void> = new Set();
  private toasts: Toast[] = [];

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.toasts));
  }

  show(toast: Omit<Toast, 'id'>) {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: Toast = { ...toast, id };

    this.toasts = [...this.toasts, newToast];
    this.notify();

    // Haptic feedback
    switch (toast.type) {
      case 'success':
        HapticFeedback.success();
        break;
      case 'error':
        HapticFeedback.error();
        break;
      case 'warning':
        HapticFeedback.warning();
        break;
      default:
        HapticFeedback.light();
    }

    // Auto dismiss
    const duration = toast.duration ?? 3000;
    if (duration > 0) {
      setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    return id;
  }

  dismiss(id: string) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  dismissAll() {
    this.toasts = [];
    this.notify();
  }
}

export const toast = new ToastManager();

/**
 * Toast Container Component
 * Place this in your root layout
 */
export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 right-6 left-6 md:left-auto z-50 flex flex-col gap-2 pointer-events-none"
      style={{
        maxWidth: '400px',
      }}
      role="region"
      aria-label="Notifications"
      aria-live="polite"
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}

function ToastItem({ toast: t }: { toast: Toast }) {
  const [isExiting, setIsExiting] = useState(false);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      toast.dismiss(t.id);
    }, 200);
  };

  const iconMap: Record<ToastType, string> = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const colorMap: Record<ToastType, string> = {
    success: 'var(--color-accent-success)',
    error: 'var(--color-accent-danger)',
    warning: 'var(--color-accent-warning)',
    info: 'var(--color-brand-primary)',
  };

  return (
    <div
      className="pointer-events-auto rounded-xl p-4 shadow-lg backdrop-blur-md transition-all"
      style={{
        backgroundColor: 'rgba(20, 20, 25, 0.95)',
        border: `1px solid ${colorMap[t.type]}`,
        transform: isExiting ? 'translateY(100%)' : 'translateY(0)',
        opacity: isExiting ? 0 : 1,
        animation: isExiting ? 'none' : 'slideUp 200ms ease-out',
      }}
      role="alert"
      aria-atomic="true"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span style={{ fontSize: '20px' }}>{iconMap[t.type]}</span>

        {/* Message */}
        <div className="flex-1">
          <p
            style={{
              color: 'var(--color-text-primary)',
              fontSize: 'var(--font-size-body)',
              lineHeight: '1.5',
            }}
          >
            {t.message}
          </p>

          {/* Action */}
          {t.action && (
            <button
              onClick={() => {
                t.action!.handler();
                handleDismiss();
              }}
              className="mt-2"
              style={{
                color: colorMap[t.type],
                fontSize: 'var(--font-size-caption)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {t.action.label}
            </button>
          )}
        </div>

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="p-1"
          style={{
            color: 'var(--color-text-secondary)',
          }}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * Convenience methods
 */
export const showToast = {
  success: (message: string, duration?: number) =>
    toast.show({ type: 'success', message, duration }),

  error: (message: string, duration?: number) =>
    toast.show({ type: 'error', message, duration }),

  warning: (message: string, duration?: number) =>
    toast.show({ type: 'warning', message, duration }),

  info: (message: string, duration?: number) =>
    toast.show({ type: 'info', message, duration }),

  withAction: (
    type: ToastType,
    message: string,
    action: { label: string; handler: () => void },
    duration?: number
  ) => toast.show({ type, message, action, duration }),
};

/**
 * Example Usage:
 *
 * import { showToast } from '@/components/ui/Toast';
 *
 * showToast.success('任务创建成功！');
 * showToast.error('网络连接失败');
 * showToast.warning('即将达到配额限制');
 * showToast.info('有新的系统更新');
 *
 * showToast.withAction(
 *   'info',
 *   'FORGE #1 需要你的审核',
 *   {
 *     label: '查看',
 *     handler: () => router.push('/tasks/123')
 *   },
 *   5000
 * );
 */
