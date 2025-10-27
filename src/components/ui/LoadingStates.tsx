'use client';

/**
 * Loading States Components
 * Provides various loading indicators and skeleton screens
 */

// Spinner Component
export function Spinner({
  size = 'md',
  color = 'var(--color-brand-primary)',
}: {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}) {
  const sizes = {
    sm: '16px',
    md: '24px',
    lg: '40px',
  };

  return (
    <div
      className="inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent"
      style={{
        width: sizes[size],
        height: sizes[size],
        color,
        borderTopColor: 'transparent',
      }}
      role="status"
      aria-label="Loading"
    />
  );
}

// Skeleton Components for Loading States
export function SkeletonText({
  lines = 1,
  className = '',
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded animate-pulse"
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            width: i === lines - 1 ? '80%' : '100%',
          }}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-[16px] p-4 ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-panel)',
        border: '1px solid var(--color-border)',
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div
            className="h-6 w-3/4 rounded animate-pulse mb-2"
            style={{ backgroundColor: 'var(--color-bg-elevated)' }}
          />
          <div
            className="h-4 w-1/2 rounded animate-pulse"
            style={{ backgroundColor: 'var(--color-bg-elevated)' }}
          />
        </div>
        <div
          className="h-6 w-16 rounded-full animate-pulse"
          style={{ backgroundColor: 'var(--color-bg-elevated)' }}
        />
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div
          className="h-4 w-full rounded animate-pulse"
          style={{ backgroundColor: 'var(--color-bg-elevated)' }}
        />
        <div
          className="h-4 w-5/6 rounded animate-pulse"
          style={{ backgroundColor: 'var(--color-bg-elevated)' }}
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <div
            className="h-8 w-8 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--color-bg-elevated)' }}
          />
          <div
            className="h-8 w-8 rounded-full animate-pulse"
            style={{ backgroundColor: 'var(--color-bg-elevated)' }}
          />
        </div>
        <div
          className="h-4 w-20 rounded animate-pulse"
          style={{ backgroundColor: 'var(--color-bg-elevated)' }}
        />
      </div>
    </div>
  );
}

export function SkeletonMessage({
  isUser = false,
}: {
  isUser?: boolean;
}) {
  return (
    <div
      className="flex gap-3"
      style={{
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
    >
      {/* Avatar */}
      <div
        className="h-8 w-8 rounded-full animate-pulse flex-shrink-0"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
      />

      {/* Message */}
      <div
        className="flex-1 max-w-[80%]"
        style={{
          textAlign: isUser ? 'right' : 'left',
        }}
      >
        <div
          className="h-3 w-24 rounded animate-pulse mb-2"
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            marginLeft: isUser ? 'auto' : '0',
          }}
        />
        <div
          className="rounded-xl p-3 animate-pulse inline-block"
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            minWidth: '200px',
          }}
        >
          <div className="space-y-2">
            <div
              className="h-4 w-full rounded"
              style={{ backgroundColor: 'var(--color-bg-panel)' }}
            />
            <div
              className="h-4 w-3/4 rounded"
              style={{ backgroundColor: 'var(--color-bg-panel)' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

// Typing Indicator
export function TypingIndicator({ name = 'Avatar' }: { name?: string }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="h-8 w-8 rounded-full"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
      />
      <div
        className="rounded-xl px-4 py-3"
        style={{ backgroundColor: 'var(--color-bg-elevated)' }}
      >
        <div className="flex gap-1">
          <div
            className="h-2 w-2 rounded-full animate-bounce"
            style={{
              backgroundColor: 'var(--color-text-secondary)',
              animationDelay: '0ms',
            }}
          />
          <div
            className="h-2 w-2 rounded-full animate-bounce"
            style={{
              backgroundColor: 'var(--color-text-secondary)',
              animationDelay: '150ms',
            }}
          />
          <div
            className="h-2 w-2 rounded-full animate-bounce"
            style={{
              backgroundColor: 'var(--color-text-secondary)',
              animationDelay: '300ms',
            }}
          />
        </div>
      </div>
      <span
        style={{
          fontSize: 'var(--font-size-caption)',
          color: 'var(--color-text-muted)',
        }}
      >
        {name} 正在输入...
      </span>
    </div>
  );
}

// Full Page Loading
export function LoadingScreen({ message = '加载中...' }: { message?: string }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        backgroundColor: 'var(--color-bg-canvas)',
        zIndex: 9999,
      }}
    >
      <div className="text-center">
        <Spinner size="lg" />
        <p
          className="mt-4"
          style={{
            fontSize: 'var(--font-size-body)',
            color: 'var(--color-text-secondary)',
          }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

// Empty State
export function EmptyState({
  icon = '📭',
  title,
  description,
  action,
}: {
  icon?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      style={{ minHeight: '300px' }}
    >
      <div
        style={{
          fontSize: '64px',
          marginBottom: 'var(--spacing-lg)',
          opacity: 0.5,
        }}
      >
        {icon}
      </div>
      <h3
        style={{
          fontSize: 'var(--font-size-h3)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-sm)',
        }}
      >
        {title}
      </h3>
      {description && (
        <p
          style={{
            fontSize: 'var(--font-size-body)',
            color: 'var(--color-text-secondary)',
            maxWidth: '400px',
            marginBottom: 'var(--spacing-lg)',
          }}
        >
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
}

// Error State
export function ErrorState({
  title = '出错了',
  description = '加载数据时发生错误',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-12 px-4 text-center"
      style={{ minHeight: '300px' }}
    >
      <div
        style={{
          fontSize: '64px',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        ⚠️
      </div>
      <h3
        style={{
          fontSize: 'var(--font-size-h3)',
          fontWeight: 'var(--font-weight-medium)',
          color: 'var(--color-text-primary)',
          marginBottom: 'var(--spacing-sm)',
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: 'var(--font-size-body)',
          color: 'var(--color-text-secondary)',
          maxWidth: '400px',
          marginBottom: 'var(--spacing-lg)',
        }}
      >
        {description}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 rounded-lg transition-all"
          style={{
            backgroundColor: 'var(--color-brand-primary)',
            color: '#FFFFFF',
            fontSize: 'var(--font-size-body)',
            fontWeight: 'var(--font-weight-medium)',
          }}
        >
          重试
        </button>
      )}
    </div>
  );
}
