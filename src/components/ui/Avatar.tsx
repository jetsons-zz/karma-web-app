import { forwardRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'offline';
  role?: 'Forge' | 'Vision' | 'Scout' | 'Capital' | 'Flow' | 'One';
  showRole?: boolean;
  name?: string;
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const statusColors = {
  online: 'var(--color-accent-success)',
  busy: 'var(--color-accent-warning)',
  offline: 'var(--color-text-muted)',
};

const roleColors = {
  Forge: '#FF6B6B',
  Vision: '#4ECDC4',
  Scout: '#45B7D1',
  Capital: '#FFA07A',
  Flow: '#98D8C8',
  One: 'var(--color-brand-primary)',
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size = 'md', status, role, showRole = false, name, src, alt, style, ...props }, ref) => {
    const pixelSize = sizeMap[size];
    const statusSize = size === 'xs' ? 6 : size === 'sm' ? 8 : 10;

    return (
      <div ref={ref} className={cn('relative inline-block', className)}>
        <div
          className="rounded-full overflow-hidden"
          style={{
            width: `${pixelSize}px`,
            height: `${pixelSize}px`,
            border: role ? `2px solid ${roleColors[role]}` : '2px solid var(--color-border)',
            ...style,
          }}
        >
          <img
            src={src || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name || 'default'}`}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            {...props}
          />
        </div>

        {/* Status indicator */}
        {status && (
          <span
            className="absolute bottom-0 right-0 block rounded-full ring-2"
            style={{
              width: `${statusSize}px`,
              height: `${statusSize}px`,
              backgroundColor: statusColors[status],
              borderColor: 'var(--color-bg-panel)',
              borderWidth: '2px',
              borderStyle: 'solid',
            }}
          />
        )}

        {/* Role badge */}
        {showRole && role && (
          <div
            className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-1.5 py-0.5 rounded-md text-xs font-medium"
            style={{
              backgroundColor: roleColors[role],
              color: '#FFFFFF',
              fontSize: 'var(--font-size-caption)',
              fontWeight: 'var(--font-weight-medium)',
              whiteSpace: 'nowrap',
            }}
          >
            {role}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
