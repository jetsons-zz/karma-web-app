'use client';

/**
 * 日期分隔线组件
 * 用于在消息列表中显示日期分组
 */

interface DateDividerProps {
  date: string;
  className?: string;
}

export function DateDivider({ date, className = '' }: DateDividerProps) {
  return (
    <div
      className={`flex items-center justify-center my-6 ${className}`}
      role="separator"
      aria-label={`消息日期: ${date}`}
    >
      <div
        className="px-4 py-1.5 rounded-full text-center"
        style={{
          backgroundColor: 'var(--color-bg-elevated)',
          fontSize: 'var(--font-size-caption)',
          color: 'var(--color-text-secondary)',
          fontWeight: 'var(--font-weight-medium)',
          border: '1px solid var(--color-border)',
        }}
      >
        {date}
      </div>
    </div>
  );
}
