'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function DeviceLogsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [filterLevel, setFilterLevel] = useState<string>('all');

  // Mock logs
  const logs = [
    { id: '1', level: 'info', category: 'device', message: '设备已上线', timestamp: Date.now() - 1000 },
    { id: '2', level: 'info', category: 'firmware', message: '固件检查完成，当前版本: 2.1.0', timestamp: Date.now() - 2000 },
    { id: '3', level: 'info', category: 'connection', message: '已连接到 WiFi: Office-5G', timestamp: Date.now() - 3000 },
    { id: '4', level: 'info', category: 'task', message: '开始处理任务: task_001', timestamp: Date.now() - 5000 },
    { id: '5', level: 'info', category: 'task', message: '任务 task_001 完成', timestamp: Date.now() - 8000 },
    { id: '6', level: 'warning', category: 'system', message: 'CPU 使用率达到 75%', timestamp: Date.now() - 10000 },
    { id: '7', level: 'info', category: 'sync', message: '数据同步完成，上传 2.5MB', timestamp: Date.now() - 15000 },
    { id: '8', level: 'info', category: 'audio', message: '音频流已启动', timestamp: Date.now() - 20000 },
    { id: '9', level: 'warning', category: 'connection', message: '网络延迟较高: 280ms', timestamp: Date.now() - 25000 },
    { id: '10', level: 'error', category: 'task', message: '任务 task_002 执行失败: timeout', timestamp: Date.now() - 30000 },
    { id: '11', level: 'info', category: 'system', message: '自动清理缓存: 释放 128MB', timestamp: Date.now() - 40000 },
    { id: '12', level: 'debug', category: 'sensor', message: '温度: 42°C, 湿度: 55%', timestamp: Date.now() - 50000 },
  ];

  const levelColors = {
    info: { color: 'var(--color-brand-primary)', bg: 'rgba(108, 99, 255, 0.1)' },
    warning: { color: 'var(--color-accent-warning)', bg: 'rgba(255, 179, 0, 0.1)' },
    error: { color: 'var(--color-accent-danger)', bg: 'rgba(255, 64, 129, 0.1)' },
    debug: { color: 'var(--color-text-muted)', bg: 'rgba(128, 128, 128, 0.1)' },
  };

  const filteredLogs = filterLevel === 'all'
    ? logs
    : logs.filter(log => log.level === filterLevel);

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)' }} className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="md" onClick={() => router.push(`/devices/${resolvedParams.id}`)}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <h1 style={{ fontSize: 'var(--font-size-h1)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              设备日志
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              导出日志
            </Button>
            <Button variant="secondary" onClick={() => window.location.reload()}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Filter */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', fontWeight: 'var(--font-weight-medium)' }}>
                筛选:
              </span>
              <div className="flex gap-2">
                {['all', 'info', 'warning', 'error', 'debug'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setFilterLevel(level)}
                    className="px-3 py-1 rounded-md transition-all"
                    style={{
                      backgroundColor: filterLevel === level ? 'var(--color-brand-primary)' : 'var(--color-bg-elevated)',
                      color: filterLevel === level ? '#FFFFFF' : 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      border: filterLevel === level ? 'none' : '1px solid var(--color-border)',
                    }}
                  >
                    {level === 'all' ? '全部' : level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  共 {filteredLogs.length} 条日志
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Logs */}
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-[var(--color-border)]">
              {filteredLogs.map((log) => {
                const levelStyle = levelColors[log.level as keyof typeof levelColors];
                return (
                  <div key={log.id} className="p-4 hover:bg-[var(--color-bg-elevated)] transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-20 text-right">
                        <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                          {formatDate(log.timestamp)}
                        </div>
                        <div style={{ fontSize: 'var(--font-size-caption)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                          {formatTime(log.timestamp)}
                        </div>
                      </div>
                      <div
                        className="flex-shrink-0 px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: levelStyle.bg,
                          color: levelStyle.color,
                          fontSize: '11px',
                          fontWeight: 'var(--font-weight-bold)',
                          textTransform: 'uppercase',
                          minWidth: '70px',
                          textAlign: 'center',
                        }}
                      >
                        {log.level}
                      </div>
                      <div
                        className="flex-shrink-0 px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: 'var(--color-bg-elevated)',
                          fontSize: '11px',
                          color: 'var(--color-text-secondary)',
                          fontWeight: 'var(--font-weight-medium)',
                        }}
                      >
                        {log.category}
                      </div>
                      <div className="flex-1">
                        <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-primary)', lineHeight: 1.5 }}>
                          {log.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Empty State */}
        {filteredLogs.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <svg className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)' }}>
                没有找到匹配的日志
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
