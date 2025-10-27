'use client';

import { useDroppable } from '@dnd-kit/core';
import { Badge } from '@/components/ui/Badge';

interface DroppableColumnProps {
  id: string;
  label: string;
  count: number;
  children: React.ReactNode;
}

/**
 * DroppableColumn - 可放置任务的看板列
 */
export function DroppableColumn({ id, label, count, children }: DroppableColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        backgroundColor: isOver ? 'var(--color-bg-elevated)' : 'var(--color-bg-secondary)',
        borderRadius: 'var(--border-radius-lg)',
        padding: 'var(--spacing-md)',
        transition: 'background-color 200ms ease-out',
        minHeight: '400px',
        border: isOver ? '2px dashed var(--color-brand-primary)' : '2px solid transparent',
      }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h3
          style={{
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-primary)',
            fontSize: 'var(--font-size-body)',
          }}
        >
          {label}
        </h3>
        <Badge variant="secondary">{count}</Badge>
      </div>

      {/* Column Content */}
      {children}
    </div>
  );
}
