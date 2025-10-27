import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  status?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showLabel = false, status = 'default', size = 'md', style, ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    const statusColors = {
      default: 'var(--color-brand-primary)',
      success: 'var(--color-accent-success)',
      warning: 'var(--color-accent-warning)',
      danger: 'var(--color-accent-danger)',
    };

    const heightMap = {
      sm: '4px',
      md: '6px',
      lg: '8px',
    };

    return (
      <div ref={ref} className={cn('w-full', className)} style={style} {...props}>
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: heightMap[size],
            borderRadius: 'var(--radius-xs)',
            backgroundColor: 'var(--color-bg-elevated)',
          }}
        >
          <div
            className="h-full transition-all"
            style={{
              width: `${percentage}%`,
              backgroundColor: statusColors[status],
              transitionDuration: 'var(--duration-std)',
              transitionTimingFunction: 'var(--ease-karma)',
            }}
          />
        </div>
        {showLabel && (
          <p
            className="mt-1 text-xs text-right"
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {Math.round(percentage)}%
          </p>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';
