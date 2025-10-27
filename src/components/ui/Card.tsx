import { forwardRef, HTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  status?: 'default' | 'active' | 'warning' | 'danger';
  hoverable?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, status = 'default', hoverable = true, style, ...props }, ref) => {
    const [brightness, setBrightness] = useState(1);

    const statusColors = {
      default: 'transparent',
      active: 'var(--color-brand-primary)',
      warning: 'var(--color-accent-warning)',
      danger: 'var(--color-accent-danger)',
    };

    const borderStyle = status !== 'default'
      ? `1px solid ${statusColors[status]}`
      : '1px solid var(--color-border)';

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-[16px] shadow-sm',
          className
        )}
        style={{
          backgroundColor: 'var(--color-bg-panel)',
          border: borderStyle,
          transition: 'all var(--duration-std) var(--ease-karma)',
          filter: `brightness(${brightness})`,
          ...style,
        }}
        onMouseEnter={() => hoverable && setBrightness(1.06)}
        onMouseLeave={() => setBrightness(1)}
        onMouseDown={() => hoverable && setBrightness(0.9)}
        onMouseUp={() => hoverable && setBrightness(1.06)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col space-y-1.5', className)}
        style={{
          padding: 'var(--spacing-lg)',
          ...style,
        }}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardTitle = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, style, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn('font-semibold leading-none tracking-tight', className)}
        style={{
          fontSize: 'var(--font-size-h3)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-primary)',
          ...style,
        }}
        {...props}
      />
    );
  }
);

CardTitle.displayName = 'CardTitle';

export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, style, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm', className)}
        style={{
          fontSize: 'var(--font-size-caption)',
          color: 'var(--color-text-secondary)',
          ...style,
        }}
        {...props}
      />
    );
  }
);

CardDescription.displayName = 'CardDescription';

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('pt-0', className)}
        style={{
          padding: `0 var(--spacing-lg) var(--spacing-lg)`,
          ...style,
        }}
        {...props}
      />
    );
  }
);

CardContent.displayName = 'CardContent';

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center pt-0', className)}
        style={{
          padding: `0 var(--spacing-lg) var(--spacing-lg)`,
          ...style,
        }}
        {...props}
      />
    );
  }
);

CardFooter.displayName = 'CardFooter';
