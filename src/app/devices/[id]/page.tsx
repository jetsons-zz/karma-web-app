'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DeviceStatus, DeviceType } from '@/lib/device/types';
import { UpdateStatus } from '@/lib/device/firmware/updater';

export default function DeviceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock device data
  const device = {
    id: resolvedParams.id,
    name: 'Karma Box Pro - 办公室',
    type: DeviceType.KARMA_BOX_PRO,
    status: DeviceStatus.ONLINE,
    firmwareVersion: '2.1.0',
    hardwareVersion: '1.2',
    serialNumber: 'KB-PRO-2024-001234',
    batteryLevel: 85,
    isCharging: false,
    temperature: 42,
    cpuUsage: 35,
    memoryUsage: 58,
    storageUsed: 12.5,
    storageTotal: 64,
    lastSeen: Date.now() - 2000,
    activatedAt: Date.now() - 86400000 * 30,
    ipAddress: '192.168.1.100',
    macAddress: 'AA:BB:CC:DD:EE:FF',
    features: {
      hasCamera: true,
      hasMicrophone: true,
      hasSpeaker: true,
      hasDisplay: true,
      hasTouchScreen: true,
      sensors: ['温度', '湿度', '光线', '运动'],
      audioChannels: 2,
      videoResolution: '1080p',
      storageGB: 64,
      ramGB: 4,
    },
  };

  // Mock stats
  const stats = {
    activeTime: 25 * 3600 * 1000,
    tasksProcessed: 1247,
    tasksCompleted: 1198,
    tasksFailed: 49,
    dataUploaded: 2.5 * 1024 * 1024 * 1024,
    dataDownloaded: 1.8 * 1024 * 1024 * 1024,
  };

  // Mock update progress
  const [updateProgress, setUpdateProgress] = useState<any>(null);

  const statusConfig = {
    [DeviceStatus.ONLINE]: {
      label: '在线',
      color: 'var(--color-accent-success)',
      bgColor: 'rgba(122, 228, 199, 0.1)',
    },
    [DeviceStatus.OFFLINE]: {
      label: '离线',
      color: 'var(--color-text-muted)',
      bgColor: 'rgba(128, 128, 128, 0.1)',
    },
    [DeviceStatus.SLEEP]: {
      label: '休眠',
      color: 'var(--color-accent-warning)',
      bgColor: 'rgba(255, 179, 0, 0.1)',
    },
    [DeviceStatus.SYNCING]: {
      label: '同步中',
      color: 'var(--color-brand-primary)',
      bgColor: 'rgba(108, 99, 255, 0.1)',
    },
    [DeviceStatus.UPDATING]: {
      label: '更新中',
      color: 'var(--color-brand-primary)',
      bgColor: 'rgba(108, 99, 255, 0.1)',
    },
    [DeviceStatus.ERROR]: {
      label: '错误',
      color: 'var(--color-accent-danger)',
      bgColor: 'rgba(255, 64, 129, 0.1)',
    },
  };

  const statusInfo = statusConfig[device.status];

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  };

  const formatDuration = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分钟`;
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="secondary"
              size="md"
              onClick={() => router.push('/devices')}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <div>
              <h1
                style={{
                  fontSize: 'var(--font-size-h1)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {device.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div
                  className="px-3 py-1 rounded-[8px] flex items-center gap-2"
                  style={{
                    backgroundColor: statusInfo.bgColor,
                    color: statusInfo.color,
                  }}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      device.status === DeviceStatus.ONLINE ? 'animate-pulse' : ''
                    }`}
                    style={{ backgroundColor: statusInfo.color }}
                  />
                  <span
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                    }}
                  >
                    {statusInfo.label}
                  </span>
                </div>
                <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)' }}>
                  序列号: {device.serialNumber}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" size="lg" onClick={() => router.push(`/devices/${device.id}/files`)}>
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              文件管理
            </Button>
            <Button variant="secondary" size="lg" onClick={() => router.push(`/devices/${device.id}/logs`)}>
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              查看日志
            </Button>
            <Button variant="primary" size="lg" onClick={() => router.push(`/devices/${device.id}/settings`)}>
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              设置
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Device Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* System Status */}
            <Card>
              <CardHeader>
                <CardTitle>系统状态</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                      CPU 使用率
                    </p>
                    <div className="flex items-end gap-2">
                      <span style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                        {device.cpuUsage}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                        %
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                      <div className="h-full transition-all" style={{ width: `${device.cpuUsage}%`, backgroundColor: device.cpuUsage > 80 ? 'var(--color-accent-danger)' : device.cpuUsage > 50 ? 'var(--color-accent-warning)' : 'var(--color-accent-success)' }} />
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                      内存使用
                    </p>
                    <div className="flex items-end gap-2">
                      <span style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                        {device.memoryUsage}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                        %
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                      <div className="h-full transition-all" style={{ width: `${device.memoryUsage}%`, backgroundColor: 'var(--color-brand-primary)' }} />
                    </div>
                  </div>

                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                      温度
                    </p>
                    <div className="flex items-end gap-2">
                      <span style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                        {device.temperature}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                        °C
                      </span>
                    </div>
                    <p style={{ fontSize: '11px', color: device.temperature > 60 ? 'var(--color-accent-warning)' : 'var(--color-accent-success)', marginTop: 'var(--spacing-xs)' }}>
                      {device.temperature > 60 ? '⚠ 偏高' : '✓ 正常'}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                      存储空间
                    </p>
                    <div className="flex items-end gap-2">
                      <span style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                        {device.storageUsed}
                      </span>
                      <span style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)', marginBottom: '4px' }}>
                        / {device.storageTotal} GB
                      </span>
                    </div>
                    <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                      <div className="h-full transition-all" style={{ width: `${(device.storageUsed / device.storageTotal) * 100}%`, backgroundColor: 'var(--color-brand-secondary)' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>使用统计（本月）</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                      在线时长
                    </p>
                    <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                      {formatDuration(stats.activeTime)}
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                      处理任务
                    </p>
                    <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
                      {stats.tasksProcessed}
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--color-accent-success)', marginTop: 'var(--spacing-xxs)' }}>
                      完成率 {((stats.tasksCompleted / stats.tasksProcessed) * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                      数据传输
                    </p>
                    <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      ↑ {formatBytes(stats.dataUploaded)}
                    </p>
                    <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-xxs)' }}>
                      ↓ {formatBytes(stats.dataDownloaded)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Real-time Activity (Placeholder for charts) */}
            <Card>
              <CardHeader>
                <CardTitle>实时活动</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 rounded-[12px] flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                  <div className="text-center">
                    <svg className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00 2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <p style={{ color: 'var(--color-text-secondary)' }}>实时性能图表</p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: 'var(--spacing-xs)' }}>
                      显示 CPU、内存、网络使用情况
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Device Details */}
          <div className="space-y-6">
            {/* Device Info */}
            <Card>
              <CardHeader>
                <CardTitle>设备信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>固件版本</p>
                    <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-xxs)' }}>
                      v{device.firmwareVersion}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>硬件版本</p>
                    <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-xxs)' }}>
                      v{device.hardwareVersion}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>IP 地址</p>
                    <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-xxs)' }}>
                      {device.ipAddress}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>MAC 地址</p>
                    <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-xxs)' }}>
                      {device.macAddress}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>激活时间</p>
                    <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginTop: 'var(--spacing-xxs)' }}>
                      {new Date(device.activatedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Battery */}
            {device.batteryLevel !== undefined && (
              <Card>
                <CardHeader>
                  <CardTitle>电池状态</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold mb-2" style={{ color: device.batteryLevel > 50 ? 'var(--color-accent-success)' : device.batteryLevel > 20 ? 'var(--color-accent-warning)' : 'var(--color-accent-danger)' }}>
                      {device.batteryLevel}%
                    </div>
                    {device.isCharging && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(122, 228, 199, 0.1)', color: 'var(--color-accent-success)' }}>
                        <svg className="h-4 w-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                        </svg>
                        <span style={{ fontSize: 'var(--font-size-caption)' }}>充电中</span>
                      </div>
                    )}
                  </div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                    <div className="h-full transition-all" style={{ width: `${device.batteryLevel}%`, backgroundColor: device.batteryLevel > 50 ? 'var(--color-accent-success)' : device.batteryLevel > 20 ? 'var(--color-accent-warning)' : 'var(--color-accent-danger)' }} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Features */}
            <Card>
              <CardHeader>
                <CardTitle>硬件功能</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {device.features.hasCamera && (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" style={{ color: 'var(--color-brand-primary)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                      <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-primary)' }}>
                        摄像头 ({device.features.videoResolution})
                      </span>
                    </div>
                  )}
                  {device.features.hasMicrophone && (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" style={{ color: 'var(--color-accent-success)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                      </svg>
                      <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-primary)' }}>
                        麦克风 ({device.features.audioChannels} 声道)
                      </span>
                    </div>
                  )}
                  {device.features.hasSpeaker && (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" style={{ color: 'var(--color-accent-warning)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                      </svg>
                      <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-primary)' }}>
                        扬声器
                      </span>
                    </div>
                  )}
                  {device.features.hasDisplay && (
                    <div className="flex items-center gap-2">
                      <svg className="h-5 w-5" style={{ color: 'var(--color-brand-secondary)' }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                      </svg>
                      <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-primary)' }}>
                        触摸显示屏
                      </span>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-[var(--color-border)]">
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginBottom: 'var(--spacing-xs)' }}>
                      传感器
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {device.features.sensors.map((sensor) => (
                        <span key={sensor} className="px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--color-bg-elevated)', fontSize: '11px', color: 'var(--color-text-primary)' }}>
                          {sensor}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
