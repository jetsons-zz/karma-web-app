'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function DeviceSettingsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [deviceName, setDeviceName] = useState('Karma Box Pro - 办公室');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);

  // Mock firmware update
  const availableUpdate = {
    version: '2.2.0',
    size: '45 MB',
    releaseDate: '2025-10-20',
    changelog: [
      '优化语音识别精度',
      '新增离线模式支持',
      '修复蓝牙连接稳定性问题',
      '提升电池续航 15%',
    ],
  };

  const handleUpdateFirmware = () => {
    setIsUpdating(true);
    setUpdateProgress(0);

    const interval = setInterval(() => {
      setUpdateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUpdating(false);
            alert('固件更新完成！');
          }, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 100);
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)' }} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="secondary" size="md" onClick={() => router.push(`/devices/${resolvedParams.id}`)}>
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Button>
          <h1 style={{ fontSize: 'var(--font-size-h1)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
            设备设置
          </h1>
        </div>

        <div className="space-y-6">
          {/* Basic Settings */}
          <Card>
            <CardHeader>
              <CardTitle>基本设置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)', fontWeight: 'var(--font-weight-medium)' }}>
                    设备名称
                  </label>
                  <Input type="text" value={deviceName} onChange={(e) => setDeviceName(e.target.value)} />
                </div>
                <Button variant="primary">保存更改</Button>
              </div>
            </CardContent>
          </Card>

          {/* Firmware Update */}
          <Card>
            <CardHeader>
              <CardTitle>固件更新</CardTitle>
            </CardHeader>
            <CardContent>
              {isUpdating ? (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <svg className="animate-spin h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-brand-primary)' }} fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <p style={{ fontSize: 'var(--font-size-h3)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                      正在更新固件...
                    </p>
                    <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)' }}>
                      {updateProgress < 50 ? '正在下载...' : updateProgress < 90 ? '正在安装...' : '正在验证...'}
                    </p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>进度</span>
                      <span style={{ fontSize: 'var(--font-size-caption)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-brand-primary)' }}>{updateProgress}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                      <div className="h-full transition-all duration-300" style={{ width: `${updateProgress}%`, backgroundColor: 'var(--color-brand-primary)' }} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-[12px] space-y-4" style={{ backgroundColor: 'rgba(108, 99, 255, 0.05)', border: '1px solid rgba(108, 99, 255, 0.2)' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)', marginBottom: 'var(--spacing-xs)' }}>
                        版本 {availableUpdate.version} 可用
                      </h3>
                      <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        大小: {availableUpdate.size} · 发布日期: {availableUpdate.releaseDate}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full" style={{ backgroundColor: 'rgba(108, 99, 255, 0.1)', color: 'var(--color-brand-primary)', fontSize: '11px', fontWeight: 'var(--font-weight-medium)' }}>
                      推荐更新
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                      更新内容:
                    </p>
                    <ul className="space-y-1">
                      {availableUpdate.changelog.map((item, index) => (
                        <li key={index} style={{ fontSize: '11px', color: 'var(--color-text-primary)', paddingLeft: '1rem', position: 'relative' }}>
                          <span style={{ position: 'absolute', left: 0 }}>•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button variant="primary" className="w-full" onClick={handleUpdateFirmware}>
                    立即更新
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Audio Settings */}
          <Card>
            <CardHeader>
              <CardTitle>音频设置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                    输入增益
                  </label>
                  <input type="range" min="0" max="100" defaultValue="50" className="w-full" />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xs)' }}>
                    输出音量
                  </label>
                  <input type="range" min="0" max="100" defaultValue="70" className="w-full" />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="noise-reduction" defaultChecked />
                  <label htmlFor="noise-reduction" style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-primary)' }}>
                    启用降噪
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="echo-cancellation" defaultChecked />
                  <label htmlFor="echo-cancellation" style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-primary)' }}>
                    启用回声消除
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle>隐私设置</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 'var(--font-size-caption)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      麦克风
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      允许设备使用麦克风
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 'var(--font-size-caption)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      摄像头
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      允许设备使用摄像头
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{ fontSize: 'var(--font-size-caption)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                      数据同步
                    </p>
                    <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                      自动同步设备数据到云端
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card>
            <CardHeader>
              <CardTitle style={{ color: 'var(--color-accent-danger)' }}>危险操作</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full" onClick={() => { if (confirm('确定要重启设备吗？')) alert('设备正在重启...'); }}>
                  重启设备
                </Button>
                <Button variant="secondary" className="w-full" onClick={() => { if (confirm('确定要恢复出厂设置吗？这将删除所有数据！')) alert('正在恢复出厂设置...'); }}>
                  恢复出厂设置
                </Button>
                <Button variant="secondary" className="w-full" style={{ color: 'var(--color-accent-danger)', borderColor: 'var(--color-accent-danger)' }} onClick={() => { if (confirm('确定要删除这个设备吗？')) router.push('/devices'); }}>
                  删除设备
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
