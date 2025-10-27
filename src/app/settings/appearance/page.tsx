'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  language: 'zh-CN' | 'en-US' | 'ja-JP';
  compactMode: boolean;
  animationsEnabled: boolean;
}

export default function AppearanceSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<AppearanceSettings>({
    theme: 'light',
    accentColor: '#6366F1',
    fontSize: 'medium',
    language: 'zh-CN',
    compactMode: false,
    animationsEnabled: true,
  });

  const [hasChanges, setHasChanges] = useState(false);

  const themes = [
    { value: 'light', label: '浅色', icon: '☀️', description: '明亮的浅色主题' },
    { value: 'dark', label: '深色', icon: '🌙', description: '舒适的深色主题' },
    { value: 'system', label: '跟随系统', icon: '💻', description: '根据系统设置自动切换' },
  ];

  const accentColors = [
    { name: '默认蓝', value: '#6366F1' },
    { name: '紫色', value: '#9333EA' },
    { name: '粉色', value: '#EC4899' },
    { name: '橙色', value: '#F97316' },
    { name: '绿色', value: '#10B981' },
    { name: '青色', value: '#06B6D4' },
  ];

  const fontSizes = [
    { value: 'small', label: '小', description: '适合高信息密度' },
    { value: 'medium', label: '中', description: '推荐使用' },
    { value: 'large', label: '大', description: '更易阅读' },
  ];

  const languages = [
    { value: 'zh-CN', label: '简体中文', flag: '🇨🇳' },
    { value: 'en-US', label: 'English', flag: '🇺🇸' },
    { value: 'ja-JP', label: '日本語', flag: '🇯🇵' },
  ];

  const handleSave = () => {
    console.log('Saving appearance settings:', settings);
    setHasChanges(false);
    // Apply settings to the app
  };

  const handleReset = () => {
    setSettings({
      theme: 'light',
      accentColor: '#6366F1',
      fontSize: 'medium',
      language: 'zh-CN',
      compactMode: false,
      animationsEnabled: true,
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
            外观设置
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            自定义 Karma 的外观和感觉
          </p>
        </div>

        <div className="space-y-6">
          {/* Theme */}
          <Card>
            <CardHeader>
              <CardTitle>主题模式</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                选择你喜欢的主题
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themes.map((theme) => (
                  <div
                    key={theme.value}
                    onClick={() => {
                      setSettings({ ...settings, theme: theme.value as any });
                      setHasChanges(true);
                    }}
                    className="flex flex-col items-center p-6 rounded-[16px] cursor-pointer transition-all"
                    style={{
                      border: `2px solid ${settings.theme === theme.value ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                      backgroundColor: settings.theme === theme.value ? 'var(--color-brand-primary)10' : 'transparent',
                    }}
                  >
                    <div style={{ fontSize: '40px', marginBottom: 'var(--spacing-sm)' }}>
                      {theme.icon}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      {theme.label}
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-muted)',
                        textAlign: 'center',
                      }}
                    >
                      {theme.description}
                    </div>
                    {settings.theme === theme.value && (
                      <svg
                        className="h-5 w-5 mt-2"
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

          {/* Accent Color */}
          <Card>
            <CardHeader>
              <CardTitle>主题色</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                选择你喜欢的强调色
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {accentColors.map((color) => (
                  <div
                    key={color.value}
                    onClick={() => {
                      setSettings({ ...settings, accentColor: color.value });
                      setHasChanges(true);
                    }}
                    className="flex flex-col items-center gap-2 p-3 rounded-[12px] cursor-pointer transition-all"
                    style={{
                      border: `2px solid ${settings.accentColor === color.value ? color.value : 'var(--color-border)'}`,
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        backgroundColor: color.value,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {settings.accentColor === color.value && (
                        <svg
                          className="h-6 w-6"
                          style={{ color: 'white' }}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-secondary)',
                        textAlign: 'center',
                      }}
                    >
                      {color.name}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Font Size */}
          <Card>
            <CardHeader>
              <CardTitle>字体大小</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                调整界面文字大小
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {fontSizes.map((size) => (
                  <div
                    key={size.value}
                    onClick={() => {
                      setSettings({ ...settings, fontSize: size.value as any });
                      setHasChanges(true);
                    }}
                    className="flex flex-col items-center p-4 rounded-[12px] cursor-pointer transition-all"
                    style={{
                      border: `2px solid ${settings.fontSize === size.value ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                      backgroundColor: settings.fontSize === size.value ? 'var(--color-brand-primary)10' : 'transparent',
                    }}
                  >
                    <div
                      style={{
                        fontSize: size.value === 'small' ? '12px' : size.value === 'medium' ? '14px' : '16px',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      Aa
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: '4px',
                      }}
                    >
                      {size.label}
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        textAlign: 'center',
                      }}
                    >
                      {size.description}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Language */}
          <Card>
            <CardHeader>
              <CardTitle>语言</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                选择界面显示语言
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {languages.map((lang) => (
                  <div
                    key={lang.value}
                    onClick={() => {
                      setSettings({ ...settings, language: lang.value as any });
                      setHasChanges(true);
                    }}
                    className="flex items-center justify-between p-4 rounded-[12px] cursor-pointer transition-all"
                    style={{
                      border: `2px solid ${settings.language === lang.value ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                      backgroundColor: settings.language === lang.value ? 'var(--color-brand-primary)10' : 'transparent',
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: '24px' }}>{lang.flag}</span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-body)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {lang.label}
                      </span>
                    </div>
                    {settings.language === lang.value && (
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

          {/* Advanced Options */}
          <Card>
            <CardHeader>
              <CardTitle>高级选项</CardTitle>
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
                      紧凑模式
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      减少界面元素间距，显示更多内容
                    </div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={settings.compactMode}
                      onChange={(e) => {
                        setSettings({ ...settings, compactMode: e.target.checked });
                        setHasChanges(true);
                      }}
                      className="sr-only peer"
                    />
                    <span
                      className="absolute inset-0 rounded-full transition-colors peer-checked:bg-[var(--color-brand-primary)] bg-gray-300 cursor-pointer"
                    ></span>
                    <span
                      className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"
                    ></span>
                  </label>
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
                      动画效果
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      启用界面过渡动画
                    </div>
                  </div>
                  <label className="relative inline-block w-12 h-6">
                    <input
                      type="checkbox"
                      checked={settings.animationsEnabled}
                      onChange={(e) => {
                        setSettings({ ...settings, animationsEnabled: e.target.checked });
                        setHasChanges(true);
                      }}
                      className="sr-only peer"
                    />
                    <span
                      className="absolute inset-0 rounded-full transition-colors peer-checked:bg-[var(--color-brand-primary)] bg-gray-300 cursor-pointer"
                    ></span>
                    <span
                      className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-6"
                    ></span>
                  </label>
                </div>
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
