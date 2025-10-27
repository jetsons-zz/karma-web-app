'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { Card, CardContent } from '@/components/ui/Card';
import { SwipeableTaskCard } from '@/components/ui/SwipeableTaskCard';
import { DraggableKanbanBoard } from '@/components/features/DraggableKanbanBoard';
import { ProjectDashboard } from '@/components/features/ProjectDashboard';
import { mockProjects, mockTasks, mockAvatars } from '@/lib/mock/data';
import { formatDate, cn } from '@/lib/utils';
import { showToast } from '@/components/ui/Toast';
import { useModalStore } from '@/lib/stores/modalStore';
import type { Task } from '@/types';

// Helper function to map mock status to Avatar component status
const mapStatusToAvatarStatus = (status: string | undefined): 'online' | 'busy' | 'offline' | 'thinking' | undefined => {
  if (!status) return undefined;

  const statusMap: Record<string, 'online' | 'busy' | 'offline' | 'thinking'> = {
    'online': 'online',
    'idle': 'online',
    'working': 'busy',
    'busy': 'busy',
    'offline': 'offline',
    'thinking': 'thinking',
  };

  return statusMap[status] || undefined;
};

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'kanban' | 'timeline' | 'dashboard'>('list');
  const { openModal } = useModalStore();

  const project = mockProjects.find(p => p.id === params.id);
  const tasks = mockTasks.filter(t => t.projectId === params.id);

  if (!project) {
    return <div>Project not found</div>;
  }

  const tasksByStatus = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    review: tasks.filter(t => t.status === 'review'),
    completed: tasks.filter(t => t.status === 'completed'),
  };

  // 处理任务操作
  const handleDeleteTask = (task: Task) => {
    openModal('delete-confirm', {
      message: `确定要删除任务 "${task.title}" 吗？`,
      onConfirm: () => {
        showToast.success('任务已删除');
        // TODO: 实际删除逻辑
      },
    });
  };

  const handleEditTask = (task: Task) => {
    openModal('edit-task', { title: task.title, taskId: task.id });
  };

  const handleCompleteTask = (task: Task) => {
    showToast.success(`任务 "${task.title}" 已完成`);
    // TODO: 实际更新任务状态逻辑
  };

  const TaskCard = ({ task }: { task: Task }) => (
    <SwipeableTaskCard
      onDelete={() => handleDeleteTask(task)}
      onEdit={() => handleEditTask(task)}
      onComplete={task.status !== 'completed' ? () => handleCompleteTask(task) : undefined}
    >
      <Card
        className="cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => router.push(`/projects/${project.id}/tasks/${task.id}`)}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-medium text-neutral-900">{task.title}</h3>
            <Badge variant={
              task.priority === 'p0' ? 'error' :
              task.priority === 'p1' ? 'warning' : 'secondary'
            }>
              {task.priority.toUpperCase()}
            </Badge>
          </div>
          {task.description && (
            <p className="text-sm text-neutral-600 mb-3">{task.description}</p>
          )}
          <div className="flex items-center justify-between">
            {task.assignee && (
              <div className="flex items-center space-x-2">
                <Avatar src={task.assignee.avatar} size="xs" status={mapStatusToAvatarStatus(task.assignee.status)} />
                <span className="text-xs text-neutral-600">{task.assignee.name}</span>
              </div>
            )}
            <span className="text-xs text-neutral-400">
              {formatDate(task.updatedAt)}
            </span>
          </div>
        </CardContent>
      </Card>
    </SwipeableTaskCard>
  );

  // Right Sidebar
  const rightSidebar = (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-neutral-900 mb-4">项目详情</h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-neutral-500">进度</span>
            <Progress value={project.progress} showLabel className="mt-2" />
          </div>
          <div>
            <span className="text-sm text-neutral-500">状态</span>
            <div className="mt-1">
              <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
                {project.status === 'active' ? '进行中' : '已完成'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="font-semibold text-neutral-900 mb-4">团队成员 ({project.members.length})</h3>
        <div className="space-y-3">
          {project.members.map((member) => (
            <div key={member.userId} className="flex items-center space-x-3">
              <Avatar src={member.avatar} size="sm" />
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-900">{member.name}</div>
                <div className="text-xs text-neutral-500">{member.role === 'owner' ? '拥有者' : '成员'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="font-semibold text-neutral-900 mb-4">工作中的分身</h3>
        <div className="space-y-3">
          {mockAvatars.filter(a => a.status === 'working').map((avatar) => (
            <div key={avatar.id} className="flex items-center space-x-3">
              <Avatar src={avatar.avatar} size="sm" status={mapStatusToAvatarStatus(avatar.status)} />
              <div className="flex-1">
                <div className="text-sm font-medium text-neutral-900">{avatar.name}</div>
                <div className="text-xs text-neutral-500">处理 {avatar.performance.totalTasks - avatar.performance.completedTasks} 个任务</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <MainLayout rightSidebar={rightSidebar}>
      <div className="p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-neutral-600 mb-2">
            <button onClick={() => router.push('/projects')} className="hover:text-primary-500">
              项目
            </button>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{project.name}</span>
          </div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">{project.name}</h1>
              <p className="text-neutral-600">{project.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline">编辑</Button>
              <Button>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新建任务
              </Button>
            </div>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="border-b border-neutral-200 mb-6">
          <div className="flex space-x-6">
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'pb-3 text-sm font-medium border-b-2 transition-colors',
                viewMode === 'list'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              )}
            >
              列表视图
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              className={cn(
                'pb-3 text-sm font-medium border-b-2 transition-colors',
                viewMode === 'kanban'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              )}
            >
              看板视图
            </button>
            <button
              onClick={() => setViewMode('dashboard')}
              className={cn(
                'pb-3 text-sm font-medium border-b-2 transition-colors',
                viewMode === 'dashboard'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              )}
            >
              数据面板
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={cn(
                'pb-3 text-sm font-medium border-b-2 transition-colors',
                viewMode === 'timeline'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-600 hover:text-neutral-900'
              )}
            >
              时间线视图
            </button>
          </div>
        </div>

        {/* Tasks */}
        {viewMode === 'list' && (
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}

        {viewMode === 'kanban' && (
          <DraggableKanbanBoard
            tasks={tasks}
            onTaskClick={(task) => router.push(`/projects/${project.id}/tasks/${task.id}`)}
            onTaskDelete={handleDeleteTask}
            onTaskEdit={handleEditTask}
            onTaskMove={(taskId, newStatus) => {
              console.log(`Task ${taskId} moved to ${newStatus}`);
              // TODO: 更新任务状态到后端
            }}
            onTaskReorder={(reorderedTasks) => {
              console.log('Tasks reordered:', reorderedTasks.length);
              // TODO: 保存任务顺序到后端
            }}
          />
        )}

        {viewMode === 'dashboard' && (
          <ProjectDashboard project={project} tasks={tasks} />
        )}

        {viewMode === 'timeline' && (
          <div className="text-center py-12 text-neutral-400">
            时间线视图正在开发中...
          </div>
        )}
      </div>
    </MainLayout>
  );
}
