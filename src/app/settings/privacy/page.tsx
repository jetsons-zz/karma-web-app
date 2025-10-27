'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';

interface PrivacySettings {
  profileVisibility: 'public' | 'team' | 'private';
  showAvatars: boolean;
  showProjects: boolean;
  showEarnings: boolean;
  allowAnalytics: boolean;
  allowPersonalization: boolean;
  dataCollection: boolean;
}

export default function PrivacySettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<PrivacySettings>({
    profileVisibility: 'team',
    showAvatars: true,
    showProjects: true,
    showEarnings: false,
    allowAnalytics: true,
    allowPersonalization: true,
    dataCollection: true,
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSave = () => {
    console.log('Saving privacy settings:', settings);
    setHasChanges(false);
  };

  const handleExportData = () => {
    console.log('Exporting user data...');
    // Trigger data export
  };

  const handleDeleteAccount = () => {
    console.log('Deleting account...');
    // Handle account deletion
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
            隐私设置
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            管理你的数据和隐私偏好
          </p>
        </div>

        <div className="space-y-6">
          {/* Profile Visibility */}
          <Card>
            <CardHeader>
              <CardTitle>个人资料可见性</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                控制谁可以查看你的个人资料
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { value: 'public', label: '公开', desc: '所有人都可以查看' },
                  { value: 'team', label: '团队', desc: '仅团队成员可以查看' },
                  { value: 'private', label: '私密', desc: '仅自己可以查看' },
                ].map((option) => (
                  <div
                    key={option.value}
                    onClick={() => {
                      setSettings({ ...settings, profileVisibility: option.value as any });
                      setHasChanges(true);
                    }}
                    className="flex items-center justify-between p-4 rounded-[12px] cursor-pointer transition-all"
                    style={{
                      border: `2px solid ${settings.profileVisibility === option.value ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                      backgroundColor: settings.profileVisibility === option.value ? 'var(--color-brand-primary)10' : 'transparent',
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
                    {settings.profileVisibility === option.value && (
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

          {/* Content Privacy */}
          <Card>
            <CardHeader>
              <CardTitle>内容隐私</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                选择在你的个人资料中显示的内容
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
                      显示我的 Avatar
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      在资料中展示你的 Avatar 团队
                    </div>
                  </div>
                  <Toggle
                    checked={settings.showAvatars}
                    onChange={(checked) => {
                      setSettings({ ...settings, showAvatars: checked });
                      setHasChanges(true);
                    }}
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
                      显示我的项目
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      在资料中展示你的项目
                    </div>
                  </div>
                  <Toggle
                    checked={settings.showProjects}
                    onChange={(checked) => {
                      setSettings({ ...settings, showProjects: checked });
                      setHasChanges(true);
                    }}
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
                      显示收益信息
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      在资料中展示你的收益统计
                    </div>
                  </div>
                  <Toggle
                    checked={settings.showEarnings}
                    onChange={(checked) => {
                      setSettings({ ...settings, showEarnings: checked });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data & Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>数据使用</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                控制我们如何使用你的数据
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
                      使用分析
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      帮助我们改进产品体验
                    </div>
                  </div>
                  <Toggle
                    checked={settings.allowAnalytics}
                    onChange={(checked) => {
                      setSettings({ ...settings, allowAnalytics: checked });
                      setHasChanges(true);
                    }}
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
                      个性化推荐
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      根据你的使用习惯提供个性化内容
                    </div>
                  </div>
                  <Toggle
                    checked={settings.allowPersonalization}
                    onChange={(checked) => {
                      setSettings({ ...settings, allowPersonalization: checked });
                      setHasChanges(true);
                    }}
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
                      数据收集
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      收集使用数据用于产品改进
                    </div>
                  </div>
                  <Toggle
                    checked={settings.dataCollection}
                    onChange={(checked) => {
                      setSettings({ ...settings, dataCollection: checked });
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card>
            <CardHeader>
              <CardTitle>数据管理</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                管理和导出你的数据
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-[12px]" style={{ border: '1px solid var(--color-border)' }}>
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      导出我的数据
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      下载你的所有数据副本（JSON 格式）
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleExportData}>
                    导出
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-[12px]" style={{ border: '1px solid var(--color-border)' }}>
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      清除浏览数据
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      清除本地缓存和浏览历史
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    清除
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: 'var(--color-accent-danger)' }}>危险区域</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                这些操作不可逆，请谨慎操作
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!showDeleteConfirm ? (
                  <div className="flex items-center justify-between p-4 rounded-[12px]" style={{ border: '1px solid var(--color-accent-danger)' }}>
                    <div>
                      <div
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-accent-danger)',
                        }}
                      >
                        删除我的账户
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        永久删除你的账户和所有数据
                      </div>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => setShowDeleteConfirm(true)}>
                      删除账户
                    </Button>
                  </div>
                ) : (
                  <div
                    className="p-4 rounded-[12px]"
                    style={{
                      border: '2px solid var(--color-accent-danger)',
                      backgroundColor: 'var(--color-accent-danger)10',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-accent-danger)',
                        marginBottom: 'var(--spacing-sm)',
                      }}
                    >
                      ⚠️ 确认删除账户？
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--spacing-md)',
                        lineHeight: '1.5',
                      }}
                    >
                      此操作将永久删除你的账户、所有 Avatar、项目和数据。这个操作无法撤销。
                    </p>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" onClick={() => setShowDeleteConfirm(false)}>
                        取消
                      </Button>
                      <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
                        确认删除
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => router.push('/profile')}>
              取消
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges}>
              保存更改
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
