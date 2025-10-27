import { forwardRef, ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary: 'shadow-sm',
        secondary: 'border-2',
        ghost: '',
        danger: 'shadow-sm',
      },
      size: {
        sm: 'h-9 px-3 text-[13px] rounded-[12px]',
        md: 'h-11 px-4 text-[16px] rounded-[16px]',
        lg: 'h-14 px-6 text-[20px] rounded-[20px]',
        icon: 'h-11 w-11 rounded-[16px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, fullWidth, children, disabled, ...props }, ref) => {
    // Define styles using CSS variables
    const variantStyles = {
      primary: {
        backgroundColor: 'var(--color-brand-primary)',
        color: 'var(--color-text-primary)',
      },
      secondary: {
        backgroundColor: 'transparent',
        borderColor: 'var(--color-border)',
        color: 'var(--color-text-primary)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--color-text-secondary)',
      },
      danger: {
        backgroundColor: 'var(--color-accent-danger)',
        color: '#FFFFFF',
      },
    };

    const style = variant ? variantStyles[variant] : variantStyles.primary;

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          'focus-ring',
          fullWidth && 'w-full',
          className
        )}
        style={{
          ...style,
          transitionDuration: 'var(--duration-std)',
          transitionTimingFunction: 'var(--ease-karma)',
        }}
        disabled={disabled || isLoading}
        onMouseEnter={(e) => {
          if (!disabled && !isLoading) {
            (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.06)';
          }
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1)';
        }}
        onMouseDown={(e) => {
          if (!disabled && !isLoading) {
            (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(0.9)';
          }
        }}
        onMouseUp={(e) => {
          if (!disabled && !isLoading) {
            (e.currentTarget as HTMLButtonElement).style.filter = 'brightness(1.06)';
          }
        }}
        {...props}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            style={{ color: 'currentColor' }}
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
