'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { DataTile } from '@/components/ui/DataTile';
import { Progress } from '@/components/ui/Progress';
import { Toggle } from '@/components/ui/Toggle';
import { getAllProjects, type Project } from '@/lib/mock/projectStore';
import { formatDate } from '@/lib/utils';

export default function ProjectsPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [autoMode, setAutoMode] = useState(true);
  const [mockProjects, setMockProjects] = useState<Project[]>([]);

  // Load projects from store on mount and when page gains focus
  useEffect(() => {
    const loadProjects = () => {
      setMockProjects(getAllProjects());
    };

    loadProjects();

    // Reload when window gains focus (user returns from create page)
    window.addEventListener('focus', loadProjects);
    return () => window.removeEventListener('focus', loadProjects);
  }, []);

  // Calculate metrics
  const activeProjects = mockProjects.filter(p => p.status === 'in-progress').length;
  const totalProjects = mockProjects.length;
  const avgProgress = totalProjects > 0 ? Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / totalProjects) : 0;
  const totalMembers = new Set(mockProjects.flatMap(p => p.team || [])).size;

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
            <Button size="lg" onClick={() => router.push('/projects/create')}>
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
              status={project.status === 'in-progress' ? 'active' : 'default'}
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
                  <Badge variant={
                    project.status === 'in-progress' ? 'success' :
                    project.status === 'completed' ? 'secondary' :
                    project.status === 'on-hold' ? 'warning' : 'default'
                  }>
                    {project.status === 'in-progress' ? '进行中' :
                     project.status === 'completed' ? '已完成' :
                     project.status === 'on-hold' ? '暂停' :
                     project.status === 'planning' ? '规划中' : '审核中'}
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
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--color-text-secondary)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                    }}>
                      {(project.team || []).length} 个成员
                    </span>
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
