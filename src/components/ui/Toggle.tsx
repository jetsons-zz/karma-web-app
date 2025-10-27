import { forwardRef, ButtonHTMLAttributes, useState } from 'react';
import { cn } from '@/lib/utils';

export interface ToggleProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  labels?: [string, string]; // [unchecked label, checked label]
  size?: 'sm' | 'md' | 'lg';
  showHITLIndicator?: boolean;
}

const sizeMap = {
  sm: {
    height: 24,
    width: 44,
    thumbSize: 18,
    padding: 3,
  },
  md: {
    height: 28,
    width: 52,
    thumbSize: 22,
    padding: 3,
  },
  lg: {
    height: 32,
    width: 60,
    thumbSize: 26,
    padding: 3,
  },
};

export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(
  ({
    className,
    checked = false,
    onChange,
    labels,
    size = 'md',
    showHITLIndicator = false,
    disabled,
    style,
    ...props
  }, ref) => {
    const [isChecked, setIsChecked] = useState(checked);
    const sizes = sizeMap[size];

    const handleToggle = () => {
      if (!disabled) {
        const newValue = !isChecked;
        setIsChecked(newValue);
        onChange?.(newValue);
      }
    };

    return (
      <div className="inline-flex items-center gap-3">
        {/* Left label */}
        {labels && labels[0] && (
          <span
            style={{
              fontSize: 'var(--font-size-caption)',
              color: !isChecked ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              fontWeight: !isChecked ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
              transition: 'all var(--duration-std) var(--ease-karma)',
            }}
          >
            {labels[0]}
          </span>
        )}

        {/* Toggle switch */}
        <button
          ref={ref}
          type="button"
          role="switch"
          aria-checked={isChecked}
          disabled={disabled}
          className={cn(
            'relative inline-flex items-center rounded-full focus-ring',
            className
          )}
          style={{
            width: `${sizes.width}px`,
            height: `${sizes.height}px`,
            backgroundColor: isChecked ? 'var(--color-brand-primary)' : 'var(--color-border)',
            transition: 'all var(--duration-std) var(--ease-karma)',
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            ...style,
          }}
          onClick={handleToggle}
          {...props}
        >
          <span
            className="inline-block rounded-full shadow-sm transform"
            style={{
              width: `${sizes.thumbSize}px`,
              height: `${sizes.thumbSize}px`,
              backgroundColor: '#FFFFFF',
              transform: isChecked
                ? `translateX(${sizes.width - sizes.thumbSize - sizes.padding * 2}px)`
                : `translateX(0)`,
              marginLeft: `${sizes.padding}px`,
              transition: 'transform var(--duration-std) var(--ease-karma)',
              boxShadow: showHITLIndicator && isChecked ? '0 0 8px var(--color-hitl-wave)' : 'var(--shadow-sm)',
            }}
          />
        </button>

        {/* Right label */}
        {labels && labels[1] && (
          <span
            style={{
              fontSize: 'var(--font-size-caption)',
              color: isChecked ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
              fontWeight: isChecked ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
              transition: 'all var(--duration-std) var(--ease-karma)',
            }}
          >
            {labels[1]}
          </span>
        )}

        {/* HITL indicator */}
        {showHITLIndicator && isChecked && (
          <span
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md"
            style={{
              backgroundColor: 'rgba(122, 228, 199, 0.1)',
              color: 'var(--color-hitl-wave)',
              fontSize: 'var(--font-size-caption)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
            HITL
          </span>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';
