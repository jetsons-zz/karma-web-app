import { forwardRef, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { WestworldCharacterId, getCharacter } from '@/lib/westworld/characters';
import { CharacterIcon } from '@/lib/westworld/CharacterIcon';

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'size'> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'busy' | 'offline' | 'thinking';
  role?: 'Forge' | 'Vision' | 'Scout' | 'Capital' | 'Flow' | 'One';
  showRole?: boolean;
  name?: string;
  // 西部世界主题
  theme?: 'default' | 'westworld';
  westworldCharacter?: WestworldCharacterId;
  iconStatus?: 'default' | 'active' | 'offline' | 'warning';
}

const sizeMap = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 48,
  xl: 64,
};

const statusColors = {
  online: '#32CD32',
  busy: '#FF6347',
  offline: '#808080',
  thinking: '#4169E1',
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
  ({
    className,
    size = 'md',
    status,
    role,
    showRole = false,
    name,
    src,
    alt,
    style,
    theme = 'default',
    westworldCharacter,
    iconStatus = 'default',
    ...props
  }, ref) => {
    const pixelSize = sizeMap[size];
    const statusSize = size === 'xs' ? 6 : size === 'sm' ? 8 : 10;

    // 西部世界主题渲染
    if (theme === 'westworld' && westworldCharacter) {
      const character = getCharacter(westworldCharacter);
      const borderColor = character.visual.primaryColor;

      return (
        <div ref={ref} className={cn('relative inline-block', className)}>
          <div
            className="rounded-full overflow-hidden transition-all duration-300 hover:scale-105"
            style={{
              width: `${pixelSize}px`,
              height: `${pixelSize}px`,
              border: `3px solid ${borderColor}`,
              boxShadow: status === 'thinking'
                ? `0 0 12px ${character.visual.accentColor}`
                : '0 4px 8px rgba(0, 0, 0, 0.2)',
              ...style,
            }}
          >
            <CharacterIcon
              characterId={westworldCharacter}
              size={pixelSize}
              status={iconStatus}
            />
          </div>

          {/* Status indicator */}
          {status && (
            <span
              className="absolute bottom-0 right-0 block rounded-full ring-2 animate-pulse"
              style={{
                width: `${statusSize}px`,
                height: `${statusSize}px`,
                backgroundColor: statusColors[status],
                borderColor: '#FFFFFF',
                borderWidth: '2px',
                borderStyle: 'solid',
              }}
            />
          )}

          {/* Role badge with character name */}
          {showRole && (
            <div
              className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap"
              style={{
                backgroundColor: character.visual.primaryColor,
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: '600',
              }}
            >
              {character.role}
            </div>
          )}
        </div>
      );
    }

    // 默认主题渲染
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
