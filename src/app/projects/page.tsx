'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DataTile } from '@/components/ui/DataTile';
import { Progress } from '@/components/ui/Progress';
import { Toggle } from '@/components/ui/Toggle';
import { mockProjects } from '@/lib/mock/data';
import { formatDate } from '@/lib/utils';

export default function ProjectsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [autoMode, setAutoMode] = useState(true);

  // Calculate metrics
  const activeProjects = mockProjects.filter(p => p.status === 'active').length;
  const totalProjects = mockProjects.length;
  const avgProgress = Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects);
  const totalMembers = new Set(mockProjects.flatMap(p => p.members.map(m => m.userId))).size;

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
              项目驾驶舱
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)',
              }}
            >
              并行项目管理 × Avatar 矩阵
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Toggle
              checked={autoMode}
              onChange={setAutoMode}
              labels={['手动', '自动']}
              showHITLIndicator={autoMode}
            />
            <Button size="lg">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              新建项目
            </Button>
          </div>
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DataTile
            label="活跃项目"
            value={activeProjects}
            unit="个"
            trend="up"
            trendValue="+2 本月"
            status="success"
          />
          <DataTile
            label="总项目数"
            value={totalProjects}
            unit="个"
            status="neutral"
          />
          <DataTile
            label="平均进度"
            value={avgProgress}
            unit="%"
            trend={avgProgress > 50 ? 'up' : 'down'}
            trendValue={`${avgProgress > 50 ? '+' : ''}${avgProgress - 50}%`}
            status={avgProgress > 70 ? 'success' : avgProgress > 40 ? 'warning' : 'danger'}
          />
          <DataTile
            label="团队成员"
            value={totalMembers}
            unit="人"
            status="neutral"
          />
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between mb-6">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-[12px]"
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
            }}
          >
            <button
              onClick={() => setViewMode('grid')}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: viewMode === 'grid' ? 'var(--color-brand-primary)' : 'transparent',
                color: viewMode === 'grid' ? '#FFFFFF' : 'var(--color-text-secondary)',
              }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className="p-2 rounded-lg transition-all"
              style={{
                backgroundColor: viewMode === 'list' ? 'var(--color-brand-primary)' : 'transparent',
                color: viewMode === 'list' ? '#FFFFFF' : 'var(--color-text-secondary)',
              }}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          <span
            style={{
              fontSize: 'var(--font-size-caption)',
              color: 'var(--color-text-muted)',
            }}
          >
            {mockProjects.length} 个项目
          </span>
        </div>

        {/* Project Grid */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
          {mockProjects.map((project) => (
            <Card
              key={project.id}
              status={project.status === 'active' ? 'active' : 'default'}
              className="cursor-pointer"
              onClick={() => router.push(`/projects/${project.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle>{project.name}</CardTitle>
                    <CardDescription style={{ marginTop: 'var(--spacing-xs)' }}>
                      {project.description}
                    </CardDescription>
                  </div>
                  <Badge variant={project.status === 'active' ? 'success' : 'secondary'}>
                    {project.status === 'active' ? '进行中' : '已完成'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Progress */}
                <div style={{ marginBottom: 'var(--spacing-md)' }}>
                  <div
                    className="flex items-center justify-between mb-2"
                    style={{
                      fontSize: 'var(--font-size-caption)',
                    }}
                  >
                    <span style={{ color: 'var(--color-text-secondary)' }}>进度</span>
                    <span
                      style={{
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {project.progress}%
                    </span>
                  </div>
                  <Progress value={project.progress} />
                </div>

                {/* Members */}
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {project.members.slice(0, 3).map((member, idx) => (
                      <Avatar
                        key={idx}
                        src={member.avatar}
                        name={member.name}
                        size="sm"
                        status={idx === 0 ? 'online' : undefined}
                        style={{
                          border: '2px solid var(--color-bg-panel)',
                        }}
                      />
                    ))}
                    {project.members.length > 3 && (
                      <div
                        className="flex items-center justify-center h-8 w-8 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: 'var(--color-bg-elevated)',
                          color: 'var(--color-text-secondary)',
                          border: '2px solid var(--color-bg-panel)',
                        }}
                      >
                        +{project.members.length - 3}
                      </div>
                    )}
                  </div>
                  <span
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    {formatDate(project.updatedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
