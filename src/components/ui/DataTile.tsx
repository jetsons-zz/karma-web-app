import { forwardRef, HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface DataTileProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'success' | 'warning' | 'danger' | 'neutral';
  icon?: React.ReactNode;
}

export const DataTile = forwardRef<HTMLDivElement, DataTileProps>(
  ({
    className,
    label,
    value,
    unit,
    trend,
    trendValue,
    status = 'neutral',
    icon,
    style,
    ...props
  }, ref) => {
    const statusColors = {
      success: 'var(--color-accent-success)',
      warning: 'var(--color-accent-warning)',
      danger: 'var(--color-accent-danger)',
      neutral: 'var(--color-text-primary)',
    };

    const trendColors = {
      up: 'var(--color-accent-success)',
      down: 'var(--color-accent-danger)',
      neutral: 'var(--color-text-secondary)',
    };

    const getTrendIcon = () => {
      if (!trend) return null;
      if (trend === 'up') return '↑';
      if (trend === 'down') return '↓';
      return '→';
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[16px] p-4',
          className
        )}
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          border: '1px solid var(--color-border)',
          transition: 'all var(--duration-std) var(--ease-karma)',
          ...style,
        }}
        {...props}
      >
        {/* Header with label and icon */}
        <div className="flex items-center justify-between mb-2">
          <span
            className="text-sm"
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--color-text-secondary)',
              fontWeight: 'var(--font-weight-regular)',
            }}
          >
            {label}
          </span>
          {icon && (
            <div style={{ color: 'var(--color-text-muted)' }}>
              {icon}
            </div>
          )}
        </div>

        {/* Value display */}
        <div className="flex items-baseline gap-1 mb-1">
          <span
            className="font-medium"
            style={{
              fontSize: 'var(--font-size-numeric)',
              fontWeight: 'var(--font-weight-medium)',
              color: statusColors[status],
            }}
          >
            {value}
          </span>
          {unit && (
            <span
              className="text-sm"
              style={{
                fontSize: 'var(--font-size-caption)',
                color: 'var(--color-text-muted)',
                fontWeight: 'var(--font-weight-regular)',
              }}
            >
              {unit}
            </span>
          )}
        </div>

        {/* Trend indicator */}
        {trend && (
          <div
            className="flex items-center gap-1 text-xs"
            style={{
              fontSize: 'var(--font-size-caption)',
              color: trend ? trendColors[trend] : 'var(--color-text-secondary)',
              fontWeight: 'var(--font-weight-regular)',
            }}
          >
            <span>{getTrendIcon()}</span>
            {trendValue && <span>{trendValue}</span>}
          </div>
        )}
      </div>
    );
  }
);

DataTile.displayName = 'DataTile';
