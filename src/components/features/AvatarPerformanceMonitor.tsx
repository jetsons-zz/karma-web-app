'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { DataTile } from '@/components/ui/DataTile';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { Avatar as AvatarType } from '@/types';

interface AvatarPerformanceMonitorProps {
  avatar: AvatarType;
}

/**
 * AvatarPerformanceMonitor - AI分身性能监控仪表盘
 *
 * Features:
 * - 实时性能指标
 * - 任务完成趋势
 * - 资源使用监控
 * - 收益统计
 * - 工作时长分析
 */
export function AvatarPerformanceMonitor({ avatar }: AvatarPerformanceMonitorProps) {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  // 模拟性能数据
  const performanceData = [
    { time: '00:00', cpu: 45, memory: 62, tasks: 3 },
    { time: '04:00', cpu: 32, memory: 58, tasks: 2 },
    { time: '08:00', cpu: 78, memory: 71, tasks: 8 },
    { time: '12:00', cpu: 85, memory: 75, tasks: 10 },
    { time: '16:00', cpu: 92, memory: 82, tasks: 12 },
    { time: '20:00', cpu: 65, memory: 68, tasks: 6 },
  ];

  // 模拟任务完成数据
  const taskCompletionData = [
    { date: '周一', completed: 12, failed: 1, earnings: 240 },
    { date: '周二', completed: 15, failed: 0, earnings: 300 },
    { date: '周三', completed: 18, failed: 2, earnings: 340 },
    { date: '周四', completed: 14, failed: 1, earnings: 270 },
    { date: '周五', completed: 20, failed: 0, earnings: 400 },
    { date: '周六', completed: 8, failed: 1, earnings: 150 },
    { date: '周日', completed: 6, failed: 0, earnings: 120 },
  ];

  // 模拟资源使用数据
  const resourceData = [
    { resource: 'CPU', usage: 75, limit: 100 },
    { resource: 'Memory', usage: 68, limit: 100 },
    { resource: 'Storage', usage: 45, limit: 100 },
    { resource: 'Network', usage: 82, limit: 100 },
  ];

  // 计算关键指标
  const { performance } = avatar;
  const avgResponseTime = 1.2; // 秒
  const uptime = 99.8; // 百分比
  const successRate = performance.totalTasks > 0
    ? Math.round((performance.completedTasks / performance.totalTasks) * 100)
    : 0;

  // 健康状态
  const getHealthStatus = () => {
    if (successRate >= 95) return { label: '优秀', color: 'var(--color-accent-success)' };
    if (successRate >= 85) return { label: '良好', color: 'var(--color-brand-primary)' };
    if (successRate >= 70) return { label: '一般', color: 'var(--color-accent-warning)' };
    return { label: '需优化', color: 'var(--color-accent-error)' };
  };

  const healthStatus = getHealthStatus();

  return (
    <div className="space-y-6">
      {/* 分身信息卡片 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Avatar src={avatar.avatar} size="xl" status="online" />
            <div className="flex-1">
              <h2
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {avatar.name}
              </h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>{avatar.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="success">{avatar.status === 'working' ? '工作中' : '空闲'}</Badge>
                <Badge style={{ backgroundColor: healthStatus.color, color: 'white' }}>
                  健康度: {healthStatus.label}
                </Badge>
              </div>
            </div>
          </div>

          {/* 关键指标 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
                成功率
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {successRate}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
                平均响应
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {avgResponseTime}s
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
                在线时长
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {uptime}%
              </div>
            </div>
            <div>
              <div style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
                今日收益
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-accent-success)',
                }}
              >
                ¥{avatar.earnings.toLocaleString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 时间范围选择 */}
      <div className="flex items-center gap-2">
        {(['24h', '7d', '30d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            style={{
              padding: 'var(--spacing-xs) var(--spacing-md)',
              borderRadius: 'var(--border-radius-md)',
              backgroundColor:
                timeRange === range ? 'var(--color-brand-primary)' : 'var(--color-bg-secondary)',
              color: timeRange === range ? 'white' : 'var(--color-text-primary)',
              border: 'none',
              cursor: 'pointer',
              fontSize: 'var(--font-size-caption)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            {range === '24h' ? '24小时' : range === '7d' ? '7天' : '30天'}
          </button>
        ))}
      </div>

      {/* 性能监控 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 实时性能 */}
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
              实时性能监控
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="time" stroke="var(--color-text-secondary)" />
                <YAxis stroke="var(--color-text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="cpu"
                  name="CPU %"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorCpu)"
                />
                <Area
                  type="monotone"
                  dataKey="memory"
                  name="Memory %"
                  stroke="#f59e0b"
                  fillOpacity={1}
                  fill="url(#colorMemory)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 资源使用 */}
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
              资源使用情况
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resourceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis type="number" domain={[0, 100]} stroke="var(--color-text-secondary)" />
                <YAxis dataKey="resource" type="category" stroke="var(--color-text-secondary)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-bg-primary)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--border-radius-md)',
                  }}
                />
                <Bar dataKey="usage" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 任务完成与收益趋势 */}
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
            任务完成与收益趋势
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={taskCompletionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="date" stroke="var(--color-text-secondary)" />
              <YAxis yAxisId="left" stroke="var(--color-text-secondary)" />
              <YAxis yAxisId="right" orientation="right" stroke="var(--color-text-secondary)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-primary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--border-radius-md)',
                }}
              />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="completed"
                name="完成任务数"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: '#10b981', r: 4 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="failed"
                name="失败任务数"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: '#ef4444', r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="earnings"
                name="收益 (¥)"
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
