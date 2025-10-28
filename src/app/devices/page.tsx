'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DeviceStatus, DeviceType } from '@/lib/device/types';

export default function DevicesPage() {
  const router = useRouter();

  // Mock devices data
  const [devices] = useState([
    {
      id: 'device_001',
      name: 'Karma Box Pro - 办公室',
      type: DeviceType.KARMA_BOX_PRO,
      status: DeviceStatus.ONLINE,
      firmwareVersion: '2.1.0',
      batteryLevel: 85,
      lastSeen: Date.now() - 2000,
      features: {
        hasCamera: true,
        hasMicrophone: true,
        hasSpeaker: true,
        hasDisplay: true,
      },
    },
    {
      id: 'device_002',
      name: 'Karma Box Mini - 家中',
      type: DeviceType.KARMA_BOX_MINI,
      status: DeviceStatus.SLEEP,
      firmwareVersion: '2.0.5',
      batteryLevel: 42,
      lastSeen: Date.now() - 3600000,
      features: {
        hasCamera: false,
        hasMicrophone: true,
        hasSpeaker: true,
        hasDisplay: false,
      },
    },
  ]);

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
    [DeviceStatus.CONNECTING]: {
      label: '连接中',
      color: 'var(--color-brand-primary)',
      bgColor: 'rgba(108, 99, 255, 0.1)',
    },
  };

  const deviceTypeNames = {
    [DeviceType.KARMA_BOX_MINI]: 'Mini',
    [DeviceType.KARMA_BOX_PRO]: 'Pro',
    [DeviceType.KARMA_BOX_STUDIO]: 'Studio',
  };

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
              我的设备
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)',
              }}
            >
              管理您的 Karma Box 设备
            </p>
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/devices/setup')}
          >
            <svg
              className="h-5 w-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            添加设备
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    总设备数
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-h2)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {devices.length}
                  </p>
                </div>
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'rgba(108, 99, 255, 0.1)',
                    color: 'var(--color-brand-primary)',
                  }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    在线设备
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-h2)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-accent-success)',
                    }}
                  >
                    {devices.filter((d) => d.status === DeviceStatus.ONLINE).length}
                  </p>
                </div>
                <span
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: 'var(--color-accent-success)' }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    离线设备
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-h2)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    {
                      devices.filter(
                        (d) =>
                          d.status === DeviceStatus.OFFLINE ||
                          d.status === DeviceStatus.SLEEP
                      ).length
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    平均电量
                  </p>
                  <p
                    style={{
                      fontSize: 'var(--font-size-h2)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-text-primary)',
                    }}
                  >
                    {Math.round(
                      devices.reduce((sum, d) => sum + (d.batteryLevel || 0), 0) /
                        devices.length
                    )}
                    %
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Device List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {devices.map((device) => {
            const statusInfo = statusConfig[device.status];

            return (
              <Card
                key={device.id}
                className="cursor-pointer transition-all"
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'brightness(1.06)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'brightness(1)';
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                }}
                onClick={() => router.push(`/devices/${device.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-16 h-16 rounded-[12px] flex items-center justify-center"
                        style={{
                          backgroundColor: 'var(--color-bg-elevated)',
                          border: '2px solid var(--color-border)',
                        }}
                      >
                        <svg
                          className="h-8 w-8"
                          style={{ color: 'var(--color-brand-primary)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <CardTitle>{device.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className="px-2 py-0.5 rounded-md text-xs"
                            style={{
                              backgroundColor: 'rgba(108, 99, 255, 0.1)',
                              color: 'var(--color-brand-primary)',
                              fontSize: '11px',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            {deviceTypeNames[device.type]}
                          </span>
                          <span
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            v{device.firmwareVersion}
                          </span>
                        </div>
                      </div>
                    </div>
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
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Battery */}
                    {device.batteryLevel !== undefined && (
                      <div>
                        <p
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                            marginBottom: 'var(--spacing-xs)',
                          }}
                        >
                          电量
                        </p>
                        <div className="flex items-center gap-2">
                          <div
                            className="flex-1 h-2 rounded-full overflow-hidden"
                            style={{ backgroundColor: 'var(--color-bg-elevated)' }}
                          >
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${device.batteryLevel}%`,
                                backgroundColor:
                                  device.batteryLevel > 50
                                    ? 'var(--color-accent-success)'
                                    : device.batteryLevel > 20
                                    ? 'var(--color-accent-warning)'
                                    : 'var(--color-accent-danger)',
                              }}
                            />
                          </div>
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-primary)',
                              fontWeight: 'var(--font-weight-medium)',
                            }}
                          >
                            {device.batteryLevel}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div>
                      <p
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                          marginBottom: 'var(--spacing-xs)',
                        }}
                      >
                        功能
                      </p>
                      <div className="flex items-center gap-2">
                        {device.features.hasCamera && (
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{
                              backgroundColor: 'rgba(108, 99, 255, 0.1)',
                              color: 'var(--color-brand-primary)',
                            }}
                            title="摄像头"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                          </div>
                        )}
                        {device.features.hasMicrophone && (
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{
                              backgroundColor: 'rgba(122, 228, 199, 0.1)',
                              color: 'var(--color-accent-success)',
                            }}
                            title="麦克风"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        {device.features.hasSpeaker && (
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{
                              backgroundColor: 'rgba(255, 179, 0, 0.1)',
                              color: 'var(--color-accent-warning)',
                            }}
                            title="扬声器"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        {device.features.hasDisplay && (
                          <div
                            className="w-6 h-6 rounded flex items-center justify-center"
                            style={{
                              backgroundColor: 'rgba(235, 115, 255, 0.1)',
                              color: 'var(--color-brand-secondary)',
                            }}
                            title="显示屏"
                          >
                            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--color-border)]">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/devices/${device.id}/settings`);
                      }}
                    >
                      设置
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/devices/${device.id}/logs`);
                      }}
                    >
                      日志
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {devices.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <div
                className="w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <h3
                style={{
                  fontSize: 'var(--font-size-h3)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                还没有设备
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-body)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-lg)',
                }}
              >
                添加您的第一台 Karma Box 设备开始使用
              </p>
              <Button variant="primary" size="lg" onClick={() => router.push('/devices/setup')}>
                添加设备
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}
