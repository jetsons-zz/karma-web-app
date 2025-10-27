'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';

interface NotificationSettings {
  email: {
    taskUpdates: boolean;
    avatarActivity: boolean;
    earnings: boolean;
    weeklyReport: boolean;
    marketing: boolean;
  };
  push: {
    taskComplete: boolean;
    avatarStatus: boolean;
    earnings: boolean;
    mentions: boolean;
  };
  frequency: 'realtime' | 'hourly' | 'daily';
}

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<NotificationSettings>({
    email: {
      taskUpdates: true,
      avatarActivity: true,
      earnings: true,
      weeklyReport: true,
      marketing: false,
    },
    push: {
      taskComplete: true,
      avatarStatus: true,
      earnings: false,
      mentions: true,
    },
    frequency: 'realtime',
  });

  const [hasChanges, setHasChanges] = useState(false);

  const updateEmailSetting = (key: keyof NotificationSettings['email'], value: boolean) => {
    setSettings({
      ...settings,
      email: { ...settings.email, [key]: value },
    });
    setHasChanges(true);
  };

  const updatePushSetting = (key: keyof NotificationSettings['push'], value: boolean) => {
    setSettings({
      ...settings,
      push: { ...settings.push, [key]: value },
    });
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving notification settings:', settings);
    setHasChanges(false);
    // Show success message
  };

  const handleReset = () => {
    // Reset to default values
    setSettings({
      email: {
        taskUpdates: true,
        avatarActivity: true,
        earnings: true,
        weeklyReport: true,
        marketing: false,
      },
      push: {
        taskComplete: true,
        avatarStatus: true,
        earnings: false,
        mentions: true,
      },
      frequency: 'realtime',
    });
    setHasChanges(true);
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1000px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/profile')}
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
          返回个人中心
        </button>

        {/* Header */}
        <div className="mb-8">
          <h1
            style={{
              fontSize: 'var(--font-size-h1)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            通知设置
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            管理你希望接收的通知类型和频率
          </p>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>邮件通知</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                选择你希望通过邮件接收的通知类型
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      任务更新
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      任务状态变更、新任务分配等
                    </div>
                  </div>
                  <Toggle
                    checked={settings.email.taskUpdates}
                    onChange={(checked) => updateEmailSetting('taskUpdates', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      Avatar 活动
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      Avatar 完成任务、状态变更等
                    </div>
                  </div>
                  <Toggle
                    checked={settings.email.avatarActivity}
                    onChange={(checked) => updateEmailSetting('avatarActivity', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      收益通知
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      收益到账、提现成功等
                    </div>
                  </div>
                  <Toggle
                    checked={settings.email.earnings}
                    onChange={(checked) => updateEmailSetting('earnings', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      每周报告
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      每周汇总邮件，包含团队表现和收益
                    </div>
                  </div>
                  <Toggle
                    checked={settings.email.weeklyReport}
                    onChange={(checked) => updateEmailSetting('weeklyReport', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      产品更新和优惠
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      新功能发布、促销活动等
                    </div>
                  </div>
                  <Toggle
                    checked={settings.email.marketing}
                    onChange={(checked) => updateEmailSetting('marketing', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>推送通知</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                选择你希望接收的即时推送通知
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      任务完成
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      Avatar 完成任务时立即通知
                    </div>
                  </div>
                  <Toggle
                    checked={settings.push.taskComplete}
                    onChange={(checked) => updatePushSetting('taskComplete', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      Avatar 状态
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      Avatar 上线/下线、遇到问题等
                    </div>
                  </div>
                  <Toggle
                    checked={settings.push.avatarStatus}
                    onChange={(checked) => updatePushSetting('avatarStatus', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      收益提醒
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      重要的收益变动通知
                    </div>
                  </div>
                  <Toggle
                    checked={settings.push.earnings}
                    onChange={(checked) => updatePushSetting('earnings', checked)}
                  />
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      @提及
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      有人在评论或对话中@你
                    </div>
                  </div>
                  <Toggle
                    checked={settings.push.mentions}
                    onChange={(checked) => updatePushSetting('mentions', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notification Frequency */}
          <Card>
            <CardHeader>
              <CardTitle>通知频率</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                控制接收通知的频率
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { value: 'realtime', label: '实时', desc: '立即接收所有通知' },
                  { value: 'hourly', label: '每小时', desc: '每小时汇总一次' },
                  { value: 'daily', label: '每日', desc: '每天汇总一次' },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSettings({ ...settings, frequency: option.value as any });
                      setHasChanges(true);
                    }}
                    className="flex items-center justify-between p-4 rounded-[12px] cursor-pointer transition-all"
                    style={{
                      border: `2px solid ${settings.frequency === option.value ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                      backgroundColor: settings.frequency === option.value ? 'var(--color-brand-primary)10' : 'transparent',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {option.label}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        {option.desc}
                      </div>
                    </div>
                    {settings.frequency === option.value && (
                      <svg
                        className="h-5 w-5"
                        style={{ color: 'var(--color-brand-primary)' }}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handleReset}>
              恢复默认
            </Button>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => router.push('/profile')}>
                取消
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                保存更改
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
