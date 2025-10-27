'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DataTile } from '@/components/ui/DataTile';
import { Progress } from '@/components/ui/Progress';
import { AvatarPerformanceMonitor } from '@/components/features/AvatarPerformanceMonitor';
import { mockAvatars, mockTasks } from '@/lib/mock/data';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

type TabType = 'overview' | 'workspace' | 'training' | 'earnings';

export default function AvatarDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  // Find avatar by id
  const avatar = mockAvatars.find(a => a.id === id);

  if (!avatar) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Avatar 不存在</h2>
            <p className="text-neutral-600 mb-4">未找到指定的 Avatar</p>
            <Button onClick={() => router.push('/avatars')}>返回团队</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  // Get avatar's tasks
  const avatarTasks = mockTasks.filter(t => t.assignee?.id === avatar.id);
  const recentTasks = avatarTasks.slice(0, 5);

  // Calculate additional metrics
  const avgEarningsPerTask = avatar.earnings.total / avatar.performance.totalTasks;
  const workingDays = Math.floor((Date.now() - new Date(avatar.createdAt).getTime()) / (24 * 60 * 60 * 1000));

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/avatars')}
          className="flex items-center gap-2 mb-6 transition-colors"
          style={{
            fontSize: 'var(--font-size-caption)',
            color: 'var(--color-text-secondary)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--color-brand-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--color-text-secondary)';
          }}
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回团队雷达
        </button>

        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-start gap-6">
            <Avatar
              src={avatar.avatar}
              name={avatar.name}
              size="xl"
              status={
                avatar.status === 'working' ? 'busy' :
                avatar.status === 'idle' ? 'online' : 'offline'
              }
              showRole
            />
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1
                  style={{
                    fontSize: 'var(--font-size-h1)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  {avatar.name}
                </h1>
                <Badge
                  variant={
                    avatar.status === 'working' ? 'warning' :
                    avatar.status === 'idle' ? 'success' : 'secondary'
                  }
                >
                  {avatar.status === 'working' ? '工作中' :
                   avatar.status === 'idle' ? '空闲' : '离线'}
                </Badge>
              </div>
              <p
                style={{
                  fontSize: 'var(--font-size-body)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-md)',
                  maxWidth: '600px',
                }}
              >
                {avatar.description}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: '20px' }}>⭐</span>
                  <span
                    style={{
                      fontSize: 'var(--font-size-body)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {avatar.rating}
                  </span>
                  <span
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    ({avatar.reviewCount} 评价)
                  </span>
                </div>
                <div
                  style={{
                    width: '1px',
                    height: '16px',
                    backgroundColor: 'var(--color-border)',
                  }}
                />
                <span
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  创建于 {formatDate(avatar.createdAt)}
                </span>
                <div
                  style={{
                    width: '1px',
                    height: '16px',
                    backgroundColor: 'var(--color-border)',
                  }}
                />
                <span
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  工作 {workingDays} 天
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="secondary" size="md">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              分享
            </Button>
            <Button variant="secondary" size="md">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              编辑配置
            </Button>
            {avatar.status !== 'offline' && (
              <Button variant="secondary" size="md">
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                暂停工作
              </Button>
            )}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <DataTile
            label="今日收益"
            value={`$${avatar.earnings.today}`}
            trend={avatar.earnings.today > 0 ? 'up' : 'neutral'}
            status="success"
          />
          <DataTile
            label="本周收益"
            value={`$${avatar.earnings.thisWeek}`}
            trend="up"
            trendValue="+15%"
            status="success"
          />
          <DataTile
            label="总收益"
            value={`$${avatar.earnings.total.toLocaleString()}`}
            status="neutral"
          />
          <DataTile
            label="完成任务"
            value={avatar.performance.completedTasks}
            unit="个"
            status="success"
          />
          <DataTile
            label="成功率"
            value={avatar.performance.successRate}
            unit="%"
            status={avatar.performance.successRate > 95 ? 'success' : 'warning'}
          />
        </div>

        {/* Tab Navigation */}
        <div
          className="flex items-center gap-1 p-1 mb-8 rounded-[16px]"
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
          }}
        >
          {[
            { id: 'overview', label: '总览', icon: '📊' },
            { id: 'workspace', label: '工作台', icon: '💼' },
            { id: 'training', label: '训练', icon: '📚' },
            { id: 'earnings', label: '收益', icon: '💰' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-[12px] transition-all"
              style={{
                backgroundColor: activeTab === tab.id ? 'var(--color-brand-primary)' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-body)',
                fontWeight: 'var(--font-weight-medium)',
                minHeight: '44px',
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>技能专长</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {avatar.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-4 py-2 rounded-[12px]"
                      style={{
                        backgroundColor: 'var(--color-bg-elevated)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Abilities Radar */}
            <Card>
              <CardHeader>
                <CardTitle>能力评估</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(avatar.abilities).map(([ability, score]) => {
                    const abilityNames: Record<string, string> = {
                      coding: '编程能力',
                      design: '设计能力',
                      writing: '写作能力',
                      analysis: '分析能力',
                      communication: '沟通能力',
                    };
                    return (
                      <div key={ability}>
                        <div className="flex items-center justify-between mb-2">
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {abilityNames[ability]}
                          </span>
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-bold)',
                              color: score > 80 ? 'var(--color-accent-success)' : 'var(--color-text-primary)',
                            }}
                          >
                            {score}/100
                          </span>
                        </div>
                        <Progress value={score} />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Recent Tasks */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>最近任务</CardTitle>
                  <Button variant="ghost" size="sm">查看全部</Button>
                </div>
              </CardHeader>
              <CardContent>
                {recentTasks.length > 0 ? (
                  <div className="space-y-3">
                    {recentTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between p-4 rounded-[12px] cursor-pointer transition-all"
                        style={{
                          border: '1px solid var(--color-border)',
                          backgroundColor: 'transparent',
                        }}
                        onClick={() => router.push(`/tasks/${task.id}`)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <div className="flex-1">
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-text-primary)',
                              marginBottom: 'var(--spacing-xs)',
                            }}
                          >
                            {task.title}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                task.status === 'completed' ? 'success' :
                                task.status === 'in_progress' ? 'warning' : 'secondary'
                              }
                            >
                              {task.status === 'completed' ? '已完成' :
                               task.status === 'in_progress' ? '进行中' : '审查中'}
                            </Badge>
                            <span
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                              }}
                            >
                              {formatDate(task.updatedAt)}
                            </span>
                          </div>
                        </div>
                        <Badge variant="secondary">{task.priority.toUpperCase()}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div
                    className="text-center py-8"
                    style={{
                      color: 'var(--color-text-muted)',
                      fontSize: 'var(--font-size-caption)',
                    }}
                  >
                    暂无任务记录
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Earnings Trend */}
            <Card>
              <CardHeader>
                <CardTitle>收益趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end justify-between h-32 gap-2">
                    {avatar.earnings.trend.map((value, index) => {
                      const maxValue = Math.max(...avatar.earnings.trend);
                      const height = (value / maxValue) * 100;
                      return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div
                            className="w-full rounded-t-md transition-all cursor-pointer"
                            style={{
                              height: `${height}%`,
                              backgroundColor: index === avatar.earnings.trend.length - 1
                                ? 'var(--color-brand-primary)'
                                : 'var(--color-bg-elevated)',
                            }}
                            title={`$${value}`}
                          />
                          <span
                            style={{
                              fontSize: '10px',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            {['一', '二', '三', '四', '五', '六', '日'][index]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div
                    className="pt-4"
                    style={{
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        本周总计
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-body)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-accent-success)',
                        }}
                      >
                        ${avatar.earnings.thisWeek}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>性能统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      总任务数
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {avatar.performance.totalTasks}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      平均用时
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {avatar.performance.averageTime}h
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      任务收益
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-accent-success)',
                      }}
                    >
                      ${avgEarningsPerTask.toFixed(2)}
                    </span>
                  </div>
                  <div
                    className="pt-4 mt-4"
                    style={{
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        成功率
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {avatar.performance.successRate}%
                      </span>
                    </div>
                    <Progress value={avatar.performance.successRate} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>快速操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="secondary" size="md" fullWidth>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    分配新任务
                  </Button>
                  <Button variant="secondary" size="md" fullWidth>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    训练与优化
                  </Button>
                  <Button variant="secondary" size="md" fullWidth>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    查看详细报告
                  </Button>
                  <div
                    className="pt-3 mt-3"
                    style={{
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <Button variant="danger" size="md" fullWidth>
                      <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      解雇分身
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        )}

        {/* Workspace Tab */}
        {activeTab === 'workspace' && (
          <AvatarPerformanceMonitor avatar={avatar} />
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>技能训练</CardTitle>
                  <Button variant="secondary" size="sm">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    上传训练数据
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div
                  className="text-center py-16"
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-body)',
                  }}
                >
                  <div className="text-6xl mb-4">📚</div>
                  <p className="mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>训练功能开发中</p>
                  <p style={{ fontSize: 'var(--font-size-caption)' }}>
                    将包含：数据上传、技能进阶、学习曲线
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>技能进度</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(avatar.abilities).map(([ability, score]) => {
                      const abilityNames: Record<string, string> = {
                        coding: '编程能力',
                        design: '设计能力',
                        writing: '写作能力',
                        analysis: '分析能力',
                        communication: '沟通能力',
                      };
                      return (
                        <div key={ability}>
                          <div className="flex items-center justify-between mb-2">
                            <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
                              {abilityNames[ability]}
                            </span>
                            <span style={{ fontSize: 'var(--font-size-caption)', fontWeight: 'var(--font-weight-bold)' }}>
                              Level {Math.floor(score / 20)}
                            </span>
                          </div>
                          <Progress value={score} />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>训练记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-caption)' }}>
                    暂无训练记录
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <DataTile
                label="今日收益"
                value={`$${avatar.earnings.today}`}
                trend={avatar.earnings.today > 0 ? 'up' : 'neutral'}
                status="success"
              />
              <DataTile
                label="本周收益"
                value={`$${avatar.earnings.thisWeek}`}
                trend="up"
                trendValue="+15%"
                status="success"
              />
              <DataTile
                label="本月收益"
                value={`$${avatar.earnings.thisMonth}`}
                trend="up"
                trendValue="+22%"
                status="success"
              />
              <DataTile
                label="累计收益"
                value={`$${avatar.earnings.total.toLocaleString()}`}
                status="neutral"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>收益趋势</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-end justify-between h-48 gap-3">
                      {avatar.earnings.trend.map((value, index) => {
                        const maxValue = Math.max(...avatar.earnings.trend);
                        const height = (value / maxValue) * 100;
                        return (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div
                              className="w-full rounded-t-[8px] transition-all cursor-pointer"
                              style={{
                                height: `${height}%`,
                                backgroundColor: index === avatar.earnings.trend.length - 1
                                  ? 'var(--color-brand-primary)'
                                  : 'var(--color-bg-elevated)',
                              }}
                              title={`$${value}`}
                            />
                            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              {['周一', '周二', '周三', '周四', '周五', '周六', '周日'][index]}
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                              ${value}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>提现管理</CardTitle>
                    <Button variant="secondary" size="sm">申请提现</Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div
                    className="text-center py-8"
                    style={{
                      color: 'var(--color-text-muted)',
                      fontSize: 'var(--font-size-body)',
                    }}
                  >
                    <div className="text-5xl mb-4">💰</div>
                    <p className="mb-2" style={{ fontWeight: 'var(--font-weight-medium)' }}>提现功能开发中</p>
                    <p style={{ fontSize: 'var(--font-size-caption)' }}>
                      可提现余额: ${avatar.earnings.total.toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>收益明细</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="text-center py-8"
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--font-size-caption)',
                  }}
                >
                  暂无收益明细记录
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
