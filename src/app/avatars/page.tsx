'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DataTile } from '@/components/ui/DataTile';
import { Progress } from '@/components/ui/Progress';
import { mockAvatars } from '@/lib/mock/data';

export default function AvatarsPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);

  // Filter avatars by role
  const filteredAvatars = selectedRole
    ? mockAvatars.filter(a => a.role === selectedRole)
    : mockAvatars;

  // Calculate team metrics
  const totalTasks = mockAvatars.reduce((sum, a) => sum + a.performance.completedTasks, 0);
  const totalEarnings = mockAvatars.reduce((sum, a) => sum + a.earnings.today, 0);
  const activeAvatars = mockAvatars.filter(a => a.status !== 'offline').length;
  const avgRating = (mockAvatars.reduce((sum, a) => sum + a.rating, 0) / mockAvatars.length).toFixed(1);

  const roles = ['Forge', 'Vision', 'Scout', 'Capital', 'Flow', 'One'];

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              style={{
                fontSize: 'var(--font-size-h1)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              团队雷达
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)',
              }}
            >
              AI分身 × 角色专精 × 实时状态
            </p>
          </div>
          <Button size="lg">
            <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            创建新分身
          </Button>
        </div>

        {/* Team Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DataTile
            label="总产出"
            value={totalTasks}
            unit="任务"
            trend="up"
            trendValue="+12% 本周"
            status="success"
          />
          <DataTile
            label="团队收益"
            value={`$${totalEarnings}`}
            trend="up"
            trendValue="+8% 本周"
            status="success"
          />
          <DataTile
            label="活跃分身"
            value={`${activeAvatars}/${mockAvatars.length}`}
            status={activeAvatars > mockAvatars.length / 2 ? 'success' : 'warning'}
          />
          <DataTile
            label="平均评分"
            value={avgRating}
            unit="⭐"
            status="success"
          />
        </div>

        {/* Role Filters */}
        <div
          className="flex items-center gap-3 p-4 rounded-[16px] mb-6"
          style={{
            backgroundColor: 'var(--color-bg-elevated)',
            border: '1px solid var(--color-border)',
          }}
        >
          <span
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--color-text-secondary)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            角色筛选:
          </span>
          <button
            onClick={() => setSelectedRole(null)}
            className="px-3 py-1.5 rounded-lg transition-all"
            style={{
              backgroundColor: !selectedRole ? 'var(--color-brand-primary)' : 'transparent',
              color: !selectedRole ? '#FFFFFF' : 'var(--color-text-secondary)',
              fontSize: 'var(--font-size-caption)',
              fontWeight: 'var(--font-weight-medium)',
            }}
          >
            全部
          </button>
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className="px-3 py-1.5 rounded-lg transition-all"
              style={{
                backgroundColor: selectedRole === role ? 'var(--color-brand-primary)' : 'transparent',
                color: selectedRole === role ? '#FFFFFF' : 'var(--color-text-secondary)',
                fontSize: 'var(--font-size-caption)',
                fontWeight: 'var(--font-weight-medium)',
              }}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Avatar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAvatars.map((avatar) => (
            <Card
              key={avatar.id}
              status={avatar.status === 'working' ? 'active' : 'default'}
              className="cursor-pointer"
              onClick={() => router.push(`/avatars/${avatar.id}`)}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar
                    src={avatar.avatar}
                    name={avatar.name}
                    size="lg"
                    status={avatar.status === 'working' ? 'busy' : avatar.status === 'idle' ? 'online' : 'offline'}
                    role={avatar.role as any}
                    showRole
                  />
                  <div className="flex-1">
                    <CardTitle>{avatar.name}</CardTitle>
                    <p
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                        marginTop: 'var(--spacing-xs)',
                        lineHeight: '1.4',
                      }}
                    >
                      {avatar.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge
                        variant={
                          avatar.status === 'working' ? 'warning' :
                          avatar.status === 'idle' ? 'success' : 'secondary'
                        }
                      >
                        {avatar.status === 'working' ? '工作中' :
                         avatar.status === 'idle' ? '空闲' : '离线'}
                      </Badge>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        ⭐ {avatar.rating} ({avatar.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Skills */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    技能
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {avatar.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-1 rounded-md text-xs"
                        style={{
                          backgroundColor: 'var(--color-bg-elevated)',
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-caption)',
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                    {avatar.skills.length > 3 && (
                      <span
                        className="px-2 py-1 rounded-md text-xs"
                        style={{
                          backgroundColor: 'var(--color-bg-elevated)',
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-caption)',
                        }}
                      >
                        +{avatar.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--spacing-xxs)',
                      }}
                    >
                      任务完成
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {avatar.performance.completedTasks}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--spacing-xxs)',
                      }}
                    >
                      成功率
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-accent-success)',
                      }}
                    >
                      {avatar.performance.successRate}%
                    </div>
                  </div>
                </div>

                {/* Earnings Today */}
                <div>
                  <div
                    className="flex items-center justify-between mb-2"
                    style={{
                      fontSize: 'var(--font-size-caption)',
                    }}
                  >
                    <span style={{ color: 'var(--color-text-secondary)' }}>今日收益</span>
                    <span
                      style={{
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-accent-success)',
                      }}
                    >
                      ${avatar.earnings.today}
                    </span>
                  </div>
                  <Progress value={(avatar.earnings.today / 200) * 100} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
