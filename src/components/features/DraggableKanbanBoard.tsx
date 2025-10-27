'use client';

import { useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Badge } from '@/components/ui/Badge';
import { DroppableColumn } from './DroppableColumn';
import { SortableTaskCard } from './SortableTaskCard';
import type { Task } from '@/types';
import { HapticFeedback } from '@/lib/utils/haptics';
import { showToast } from '@/components/ui/Toast';

interface KanbanColumn {
  id: string;
  label: string;
  status: string;
  tasks: Task[];
}

interface DraggableKanbanBoardProps {
  tasks: Task[];
  onTaskMove?: (taskId: string, newStatus: string) => void;
  onTaskReorder?: (tasks: Task[]) => void;
  onTaskClick?: (task: Task) => void;
  onTaskDelete?: (task: Task) => void;
  onTaskEdit?: (task: Task) => void;
}

/**
 * DraggableKanbanBoard - 支持拖拽排序的看板视图
 *
 * Features:
 * - 跨列拖拽任务（改变任务状态）
 * - 同列内拖拽排序
 * - 拖拽预览
 * - 触觉反馈
 * - 平滑动画
 */
export function DraggableKanbanBoard({
  tasks,
  onTaskMove,
  onTaskReorder,
  onTaskClick,
  onTaskDelete,
  onTaskEdit,
}: DraggableKanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      label: '待办',
      status: 'todo',
      tasks: tasks.filter((t) => t.status === 'todo'),
    },
    {
      id: 'in_progress',
      label: '进行中',
      status: 'in_progress',
      tasks: tasks.filter((t) => t.status === 'in_progress'),
    },
    {
      id: 'review',
      label: '审核中',
      status: 'review',
      tasks: tasks.filter((t) => t.status === 'review'),
    },
    {
      id: 'completed',
      label: '已完成',
      status: 'completed',
      tasks: tasks.filter((t) => t.status === 'completed'),
    },
  ]);

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // 配置传感器 - 使用指针传感器支持触摸和鼠标
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 移动8px后才开始拖拽，避免误触
      },
    })
  );

  // 拖拽开始
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = findTask(active.id as string);
    if (task) {
      setActiveTask(task);
      HapticFeedback.medium();
    }
  };

  // 拖拽过程中（悬停）
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // 查找 active 和 over 所在的列
    const activeColumn = findColumnByTaskId(activeId);
    const overColumn = findColumnByTaskId(overId) || findColumnById(overId);

    if (!activeColumn || !overColumn) return;

    // 如果在不同列之间移动
    if (activeColumn.id !== overColumn.id) {
      setColumns((columns) => {
        const activeItems = activeColumn.tasks;
        const overItems = overColumn.tasks;

        const activeIndex = activeItems.findIndex((t) => t.id === activeId);
        const overIndex = overItems.findIndex((t) => t.id === overId);

        const [movedTask] = activeItems.splice(activeIndex, 1);
        movedTask.status = overColumn.status as any;

        overItems.splice(overIndex >= 0 ? overIndex : overItems.length, 0, movedTask);

        return columns.map((col) => {
          if (col.id === activeColumn.id) {
            return { ...col, tasks: activeItems };
          }
          if (col.id === overColumn.id) {
            return { ...col, tasks: overItems };
          }
          return col;
        });
      });
    } else {
      // 同列内排序
      setColumns((columns) => {
        const column = columns.find((c) => c.id === activeColumn.id);
        if (!column) return columns;

        const oldIndex = column.tasks.findIndex((t) => t.id === activeId);
        const newIndex = column.tasks.findIndex((t) => t.id === overId);

        if (oldIndex !== newIndex) {
          const newTasks = arrayMove(column.tasks, oldIndex, newIndex);

          return columns.map((col) =>
            col.id === column.id ? { ...col, tasks: newTasks } : col
          );
        }

        return columns;
      });
    }
  };

  // 拖拽结束
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
      setActiveTask(null);
      return;
    }

    const activeId = active.id as string;
    const task = findTask(activeId);

    if (task) {
      HapticFeedback.success();
      showToast.success(`任务已移动到 ${getColumnLabelByStatus(task.status)}`);

      if (onTaskMove) {
        onTaskMove(task.id, task.status);
      }

      if (onTaskReorder) {
        const allTasks = columns.flatMap((col) => col.tasks);
        onTaskReorder(allTasks);
      }
    }

    setActiveTask(null);
  };

  // 辅助函数
  const findTask = (taskId: string): Task | undefined => {
    for (const column of columns) {
      const task = column.tasks.find((t) => t.id === taskId);
      if (task) return task;
    }
    return undefined;
  };

  const findColumnByTaskId = (taskId: string): KanbanColumn | undefined => {
    return columns.find((col) => col.tasks.some((t) => t.id === taskId));
  };

  const findColumnById = (columnId: string): KanbanColumn | undefined => {
    return columns.find((col) => col.id === columnId);
  };

  const getColumnLabelByStatus = (status: string): string => {
    const column = columns.find((col) => col.status === status);
    return column?.label || status;
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((column) => (
          <DroppableColumn key={column.id} id={column.id} label={column.label} count={column.tasks.length}>
            <SortableContext
              items={column.tasks.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-3">
                {column.tasks.map((task) => (
                  <SortableTaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick?.(task)}
                    onDelete={() => onTaskDelete?.(task)}
                    onEdit={() => onTaskEdit?.(task)}
                  />
                ))}
              </div>
            </SortableContext>
          </DroppableColumn>
        ))}
      </div>

      {/* 拖拽预览 */}
      <DragOverlay>
        {activeTask ? (
          <div
            style={{
              opacity: 0.8,
              transform: 'rotate(5deg)',
              cursor: 'grabbing',
            }}
          >
            <SortableTaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
