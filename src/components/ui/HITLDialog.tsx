'use client';

import { forwardRef, HTMLAttributes, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './Button';
import { DecisionCardType } from '@/schemas/zod';

export interface HITLDialogProps extends HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
  decisionCard?: DecisionCardType;
  onApprove?: (alternativeId: string) => void;
  onReject?: () => void;
}

export const HITLDialog = forwardRef<HTMLDivElement, HITLDialogProps>(
  ({
    className,
    open = false,
    onClose,
    decisionCard,
    onApprove,
    onReject,
    style,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = useState(open);
    const [selectedAlt, setSelectedAlt] = useState<string | null>(null);

    useEffect(() => {
      setIsOpen(open);
    }, [open]);

    if (!isOpen || !decisionCard) return null;

    const handleApprove = () => {
      if (selectedAlt) {
        onApprove?.(selectedAlt);
        setIsOpen(false);
        onClose?.();
      }
    };

    const handleReject = () => {
      onReject?.();
      setIsOpen(false);
      onClose?.();
    };

    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 z-40"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => {
            setIsOpen(false);
            onClose?.();
          }}
        />

        {/* Dialog */}
        <div
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-50 w-full max-w-2xl transform -translate-x-1/2 -translate-y-1/2 rounded-[20px] shadow-lg animate-scale-in',
            className
          )}
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-hitl-wave)',
            boxShadow: '0 0 32px rgba(122, 228, 199, 0.3)',
            maxHeight: '90vh',
            overflow: 'auto',
            ...style,
          }}
          {...props}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between p-6 border-b"
            style={{
              borderColor: 'var(--color-border)',
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: 'var(--color-hitl-wave)',
                }}
              />
              <h2
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                决策审批
              </h2>
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                onClose?.();
              }}
              className="text-2xl focus-ring rounded-lg p-1"
              style={{
                color: 'var(--color-text-muted)',
                transition: 'color var(--duration-std) var(--ease-karma)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--color-text-muted)';
              }}
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Goal */}
            <div>
              <h3
                className="mb-2"
                style={{
                  fontSize: 'var(--font-size-h3)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                }}
              >
                目标
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-body)',
                  color: 'var(--color-text-secondary)',
                  lineHeight: '1.6',
                }}
              >
                {decisionCard.goal}
              </p>
            </div>

            {/* Alternatives */}
            <div>
              <h3
                className="mb-3"
                style={{
                  fontSize: 'var(--font-size-h3)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                }}
              >
                备选方案
              </h3>
              <div className="space-y-3">
                {decisionCard.alternatives.map((alt) => {
                  const simulation = decisionCard.simulation?.results.find(
                    (r) => r.alt === alt.id
                  );
                  const isSelected = selectedAlt === alt.id;

                  return (
                    <div
                      key={alt.id}
                      className="rounded-[16px] p-4 cursor-pointer transition-all"
                      style={{
                        backgroundColor: isSelected
                          ? 'rgba(108, 99, 255, 0.1)'
                          : 'var(--color-bg-panel)',
                        border: isSelected
                          ? '2px solid var(--color-brand-primary)'
                          : '1px solid var(--color-border)',
                        transitionDuration: 'var(--duration-std)',
                        transitionTimingFunction: 'var(--ease-karma)',
                      }}
                      onClick={() => setSelectedAlt(alt.id)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h4
                          style={{
                            fontSize: 'var(--font-size-body)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          方案 {alt.id}
                        </h4>
                        {simulation && (
                          <div className="flex gap-4">
                            <span
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                color: 'var(--color-accent-success)',
                              }}
                            >
                              ROI: {(simulation.roi * 100).toFixed(1)}%
                            </span>
                            <span
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                color:
                                  simulation.risk > 0.5
                                    ? 'var(--color-accent-danger)'
                                    : 'var(--color-accent-warning)',
                              }}
                            >
                              风险: {(simulation.risk * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>

                      <ul className="space-y-1.5">
                        {alt.actions.map((action, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2"
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            <span>•</span>
                            <span>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recommendation */}
            {decisionCard.recommendation && (
              <div
                className="rounded-[12px] p-4"
                style={{
                  backgroundColor: 'rgba(108, 99, 255, 0.05)',
                  border: '1px solid rgba(108, 99, 255, 0.2)',
                }}
              >
                <h4
                  className="mb-2"
                  style={{
                    fontSize: 'var(--font-size-body)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-brand-primary)',
                  }}
                >
                  AI 推荐
                </h4>
                <p
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                    lineHeight: '1.5',
                  }}
                >
                  {decisionCard.recommendation}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex items-center justify-between p-6 border-t"
            style={{
              borderColor: 'var(--color-border)',
            }}
          >
            <span
              style={{
                fontSize: 'var(--font-size-caption)',
                color: 'var(--color-text-muted)',
              }}
            >
              过期时间: {new Date(decisionCard.expires_at).toLocaleString('zh-CN')}
            </span>
            <div className="flex gap-3">
              <Button variant="secondary" size="md" onClick={handleReject}>
                拒绝
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleApprove}
                disabled={!selectedAlt}
              >
                批准方案
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }
);

HITLDialog.displayName = 'HITLDialog';
