'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { DataTile } from '@/components/ui/DataTile';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Project } from '@/types';

interface ProjectDashboardProps {
  project: Project;
  tasks: any[];
}

/**
 * ProjectDashboard - 项目数据可视化仪表盘
 *
 * Features:
 * - 任务状态分布（饼图）
 * - 任务完成趋势（折线图）
 * - 优先级分布（柱状图）
 * - 关键指标卡片
 */
export function ProjectDashboard({ project, tasks }: ProjectDashboardProps) {
  // 计算任务统计
  const tasksByStatus = {
    todo: tasks.filter((t) => t.status === 'todo').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    review: tasks.filter((t) => t.status === 'review').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  };

  const tasksByPriority = {
    p0: tasks.filter((t) => t.priority === 'p0').length,
    p1: tasks.filter((t) => t.priority === 'p1').length,
    p2: tasks.filter((t) => t.priority === 'p2').length,
    p3: tasks.filter((t) => t.priority === 'p3').length,
  };

  // 任务状态分布数据
  const statusData = [
    { name: '待办', value: tasksByStatus.todo, color: '#94a3b8' },
    { name: '进行中', value: tasksByStatus.in_progress, color: '#3b82f6' },
    { name: '审核中', value: tasksByStatus.review, color: '#f59e0b' },
    { name: '已完成', value: tasksByStatus.completed, color: '#10b981' },
  ];

  // 优先级分布数据
  const priorityData = [
    { name: 'P0', value: tasksByPriority.p0, color: '#ef4444' },
    { name: 'P1', value: tasksByPriority.p1, color: '#f59e0b' },
    { name: 'P2', value: tasksByPriority.p2, color: '#3b82f6' },
    { name: 'P3', value: tasksByPriority.p3, color: '#94a3b8' },
  ];

  // 模拟7天完成趋势数据
  const trendData = [
    { date: '周一', completed: 3, created: 5 },
    { date: '周二', completed: 5, created: 4 },
    { date: '周三', completed: 4, created: 6 },
    { date: '周四', completed: 6, created: 3 },
    { date: '周五', completed: 8, created: 7 },
    { date: '周六', completed: 2, created: 1 },
    { date: '周日', completed: 1, created: 2 },
  ];

  // 计算关键指标
  const totalTasks = tasks.length;
  const completedTasks = tasksByStatus.completed;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const inProgressTasks = tasksByStatus.in_progress;
  const highPriorityTasks = tasksByPriority.p0 + tasksByPriority.p1;

  return (
    <div className="space-y-6">
      {/* 关键指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DataTile
          label="总任务数"
          value={totalTasks}
          trend="up"
          trendValue="+12%"
          status="neutral"
        />
        <DataTile
          label="已完成"
          value={completedTasks}
          unit={`${completionRate}%`}
          status="success"
        />
        <DataTile
          label="进行中"
          value={inProgressTasks}
          status="neutral"
        />
        <DataTile
          label="高优先级"
          value={highPriorityTasks}
          status="danger"
        />
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 任务状态分布 - 饼图 */}
        <Card>
          <CardContent className="p-6">
            <h3
              style={{
                fontSize: 'var(--font-size-h3)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              任务状态分布
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name} ${(entry.percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 优先级分布 - 柱状图 */}
        <Card>
          <CardContent className="p-6">
            <h3
              style={{
                fontSize: 'var(--font-size-h3)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              优先级分布
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 任务完成趋势 - 折线图 */}
      <Card>
        <CardContent className="p-6">
          <h3
            style={{
              fontSize: 'var(--font-size-h3)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-md)',
            }}
          >
            本周任务趋势
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
              <YAxis stroke="var(--color-text-secondary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-md)',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="completed"
                name="已完成"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="created"
                name="新建"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
