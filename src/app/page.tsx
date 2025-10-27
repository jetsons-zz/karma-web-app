'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTile } from '@/components/ui/DataTile';
import { Avatar } from '@/components/ui/Avatar';
import { HITLDialog } from '@/components/ui/HITLDialog';
import { DecisionCardType } from '@/schemas/zod';

export default function Home() {
  const router = useRouter();
  const [showHITL, setShowHITL] = useState(false);

  // Mock data for One's suggestions
  const todayTasks = [
    {
      id: '1',
      title: '完成项目提案审核',
      priority: 'high' as const,
      estimatedTime: '2小时',
      status: 'pending' as const,
    },
    {
      id: '2',
      title: '优化 Avatar 训练参数',
      priority: 'medium' as const,
      estimatedTime: '1.5小时',
      status: 'pending' as const,
    },
    {
      id: '3',
      title: '查看团队周报并反馈',
      priority: 'low' as const,
      estimatedTime: '30分钟',
      status: 'pending' as const,
    },
  ];

  const onesSuggestions = [
    {
      id: '1',
      type: 'opportunity',
      title: '新的市场机会',
      description: 'Scout 发现了一个高潜力的细分市场，建议立即启动调研项目',
      confidence: 87,
      impact: 'high',
    },
    {
      id: '2',
      type: 'optimization',
      title: '资源配置优化',
      description: 'Capital 建议调整 3 个 Avatar 的任务分配以提升整体效率 15%',
      confidence: 92,
      impact: 'medium',
    },
    {
      id: '3',
      type: 'alert',
      title: '风险预警',
      description: 'Vision 检测到项目 Alpha 的交付时间可能延迟，需要人工介入决策',
      confidence: 78,
      impact: 'high',
    },
  ];

  const mockDecisionCard: DecisionCardType = {
    decision_id: 'dec_001',
    goal: '优化团队 Avatar 资源配置以提升整体生产力',
    context_ref: 'project_alpha_resource_allocation',
    alternatives: [
      {
        id: 'A',
        actions: [
          '将 Forge 从项目 Beta 调配到项目 Alpha',
          '增加 Vision 在战略规划上的投入',
          '暂停低优先级任务 Task-7',
        ],
        assumptions: ['项目 Alpha 是当前最高优先级', 'Beta 项目可以延期 1 周'],
      },
      {
        id: 'B',
        actions: [
          '保持当前分配不变',
          '招募 1 个新的 Avatar 支持项目 Alpha',
          '延长项目 Alpha 交付时间 2 周',
        ],
      },
    ],
    simulation: {
      engine: 'jantra.v1',
      results: [
        { alt: 'A', roi: 0.23, risk: 0.35, runway_months: 8 },
        { alt: 'B', roi: 0.15, risk: 0.18, runway_months: 10 },
      ],
    },
    recommendation: '推荐方案 A：虽然风险略高，但 ROI 提升 8%，且可在 2 周内见效',
    hitl_required: true,
    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };

  const priorityColors = {
    high: 'var(--color-accent-danger)',
    medium: 'var(--color-accent-warning)',
    low: 'var(--color-text-muted)',
  };

  const impactColors = {
    high: 'var(--color-accent-danger)',
    medium: 'var(--color-accent-warning)',
    low: 'var(--color-accent-success)',
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)' }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1
              style={{
                fontSize: 'var(--font-size-h1)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
              }}
            >
              欢迎回来
            </h1>
            <div
              className="px-3 py-1 rounded-[8px]"
              style={{
                backgroundColor: 'rgba(122, 228, 199, 0.1)',
                color: 'var(--color-hitl-wave)',
                fontSize: 'var(--font-size-caption)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-current animate-pulse mr-2" />
              One AI 在线
            </div>
          </div>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            今天是 {new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })}
          </p>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DataTile
            label="今日产出"
            value={12}
            unit="任务"
            trend="up"
            trendValue="+3"
            status="success"
          />
          <DataTile
            label="团队效率"
            value={87}
            unit="%"
            trend="up"
            trendValue="+5%"
            status="success"
          />
          <DataTile
            label="待审批"
            value={3}
            unit="项"
            status="warning"
            icon={
              <span
                className="inline-block w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: 'var(--color-hitl-wave)' }}
              />
            }
          />
          <DataTile
            label="今日收益"
            value="$342"
            trend="up"
            trendValue="+12%"
            status="success"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: One's Suggestions */}
          <div className="lg:col-span-2 space-y-6">
            {/* One's Suggestions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name="One"
                      size="md"
                      role="One"
                      status="online"
                    />
                    <div>
                      <CardTitle>One 的智能建议</CardTitle>
                      <p
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                          marginTop: 'var(--spacing-xxs)',
                        }}
                      >
                        基于实时数据分析的战略建议
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {onesSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="rounded-[12px] p-4 cursor-pointer transition-all"
                      style={{
                        backgroundColor: 'var(--color-bg-elevated)',
                        border: '1px solid var(--color-border)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(1.06)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'brightness(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      onClick={() => suggestion.id === '3' && setShowHITL(true)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3
                          style={{
                            fontSize: 'var(--font-size-body)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {suggestion.title}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span
                            className="px-2 py-0.5 rounded-md text-xs"
                            style={{
                              backgroundColor: 'rgba(108, 99, 255, 0.1)',
                              color: 'var(--color-brand-primary)',
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            {suggestion.confidence}% 置信度
                          </span>
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor: impactColors[suggestion.impact as keyof typeof impactColors],
                            }}
                          />
                        </div>
                      </div>
                      <p
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                          lineHeight: '1.5',
                        }}
                      >
                        {suggestion.description}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>快速访问</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => router.push('/projects')}
                    className="justify-start"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                    </svg>
                    项目驾驶舱
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => router.push('/avatars')}
                    className="justify-start"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    团队雷达
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => router.push('/store')}
                    className="justify-start"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Avatar 商店
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={() => router.push('/economy')}
                    className="justify-start"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    经济账本
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Today's Three Things */}
          <div className="space-y-6">
            <Card status="active">
              <CardHeader>
                <CardTitle>今日三件事</CardTitle>
                <p
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'var(--spacing-xs)',
                  }}
                >
                  One 为你规划的优先级任务
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {todayTasks.map((task, index) => (
                    <div
                      key={task.id}
                      className="rounded-[12px] p-3 transition-all cursor-pointer"
                      style={{
                        backgroundColor: 'var(--color-bg-elevated)',
                        border: '1px solid var(--color-border)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.filter = 'brightness(1.06)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.filter = 'brightness(1)';
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex items-center justify-center w-6 h-6 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: 'var(--color-brand-primary)',
                            color: '#FFFFFF',
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-bold)',
                          }}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h4
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-text-primary)',
                              marginBottom: 'var(--spacing-xxs)',
                            }}
                          >
                            {task.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span
                              className="text-xs"
                              style={{
                                color: priorityColors[task.priority],
                                fontSize: '11px',
                              }}
                            >
                              ● {task.priority === 'high' ? '高' : task.priority === 'medium' ? '中' : '低'}优先级
                            </span>
                            <span
                              style={{
                                color: 'var(--color-text-muted)',
                                fontSize: '11px',
                              }}
                            >
                              • {task.estimatedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  variant="primary"
                  size="md"
                  className="w-full mt-4"
                >
                  开始工作
                </Button>
              </CardContent>
            </Card>

            {/* Active Team */}
            <Card>
              <CardHeader>
                <CardTitle>当前活跃 Avatar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Forge', 'Vision', 'Scout'].map((role) => (
                    <div
                      key={role}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={role}
                          size="sm"
                          role={role as any}
                          status="busy"
                        />
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-primary)',
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          {role}
                        </span>
                      </div>
                      <span
                        className="px-2 py-0.5 rounded-md text-xs"
                        style={{
                          backgroundColor: 'rgba(255, 179, 0, 0.1)',
                          color: 'var(--color-accent-warning)',
                          fontSize: '11px',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        工作中
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* HITL Dialog */}
      <HITLDialog
        open={showHITL}
        onClose={() => setShowHITL(false)}
        decisionCard={mockDecisionCard}
        onApprove={(altId) => {
          console.log('Approved alternative:', altId);
          setShowHITL(false);
        }}
        onReject={() => {
          console.log('Rejected');
          setShowHITL(false);
        }}
      />
    </MainLayout>
  );
}
