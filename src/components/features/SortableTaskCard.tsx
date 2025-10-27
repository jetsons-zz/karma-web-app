'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { formatDate } from '@/lib/utils';
import type { Task } from '@/types';

interface SortableTaskCardProps {
  task: Task;
  onClick?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  isDragging?: boolean;
}

// Helper function to map mock status to Avatar component status
const mapStatusToAvatarStatus = (
  status: string | undefined
): 'online' | 'busy' | 'offline' | 'thinking' | undefined => {
  if (!status) return undefined;

  const statusMap: Record<string, 'online' | 'busy' | 'offline' | 'thinking'> = {
    online: 'online',
    idle: 'online',
    working: 'busy',
    busy: 'busy',
    offline: 'offline',
    thinking: 'thinking',
  };

  return statusMap[status] || undefined;
};

/**
 * SortableTaskCard - 支持拖拽排序的任务卡片
 */
export function SortableTaskCard({
  task,
  onClick,
  onDelete,
  onEdit,
  isDragging = false,
}: SortableTaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={(e) => {
          // 仅在非拖拽状态下触发点击
          if (!isDragging && !isSortableDragging && onClick) {
            onClick();
          }
        }}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3
              style={{
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
                fontSize: 'var(--font-size-body)',
              }}
            >
              {task.title}
            </h3>
            <Badge
              variant={task.priority === 'p0' ? 'error' : task.priority === 'p1' ? 'warning' : 'secondary'}
            >
              {task.priority.toUpperCase()}
            </Badge>
          </div>
          {task.description && (
            <p
              style={{
                fontSize: 'var(--font-size-caption)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-sm)',
              }}
            >
              {task.description}
            </p>
          )}
          <div className="flex items-center justify-between">
            {task.assignee && (
              <div className="flex items-center space-x-2">
                <Avatar
                  src={task.assignee.avatar}
                  size="xs"
                  status={mapStatusToAvatarStatus(task.assignee.status)}
                />
                <span
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {task.assignee.name}
                </span>
              </div>
            )}
            <span
              style={{
                fontSize: 'var(--font-size-caption)',
                color: 'var(--color-text-tertiary)',
              }}
            >
              {formatDate(task.updatedAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
