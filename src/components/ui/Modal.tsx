'use client';

import { useEffect, useRef } from 'react';
import { Button } from './Button';
import { HapticFeedback } from '@/lib/utils/haptics';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  footer?: React.ReactNode;
  hideCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
  hideCloseButton = false,
  closeOnOverlayClick = true,
  closeOnEscape = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // 处理 ESC 键关闭
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        HapticFeedback.light();
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // 阻止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // 聚焦管理
  useEffect(() => {
    if (isOpen && modalRef.current) {
      // 聚焦到第一个可聚焦元素
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      if (firstElement) {
        firstElement.focus();
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-7xl',
  };

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      HapticFeedback.light();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        animation: 'fadeIn 200ms ease-out',
      }}
      onClick={handleOverlayClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      aria-describedby={description ? 'modal-description' : undefined}
    >
      <div
        ref={modalRef}
        className={`w-full ${sizeClasses[size]} rounded-2xl shadow-2xl`}
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          animation: 'scaleIn 200ms ease-out',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {(title || !hideCloseButton) && (
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div>
              {title && (
                <h2
                  id="modal-title"
                  style={{
                    fontSize: 'var(--font-size-h2)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p
                  id="modal-description"
                  style={{
                    fontSize: 'var(--font-size-body)',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'var(--spacing-xs)',
                  }}
                >
                  {description}
                </p>
              )}
            </div>
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="p-2 rounded-lg transition-all"
                style={{
                  color: 'var(--color-text-secondary)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'var(--spacing-lg)',
          }}
        >
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div
            style={{
              borderTop: '1px solid var(--color-border)',
              padding: 'var(--spacing-md) var(--spacing-lg)',
            }}
          >
            {footer}
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.95);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// 确认对话框
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '确认',
  cancelText = '取消',
  variant = 'info',
}: ConfirmModalProps) {
  const handleConfirm = () => {
    HapticFeedback.success();
    onConfirm();
    onClose();
  };

  const variantColors = {
    danger: 'var(--color-accent-error)',
    warning: 'var(--color-accent-warning)',
    info: 'var(--color-brand-primary)',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div className="flex items-center gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            {cancelText}
          </Button>
          <Button
            fullWidth
            onClick={handleConfirm}
            style={
              variant === 'danger'
                ? { backgroundColor: variantColors[variant] }
                : undefined
            }
          >
            {confirmText}
          </Button>
        </div>
      }
    >
      <p style={{ color: 'var(--color-text-primary)' }}>{message}</p>
    </Modal>
  );
}
