'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Connection {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: 'connected' | 'disconnected';
  connectedAt?: string;
  features: string[];
}

export default function ConnectionsSettingsPage() {
  const router = useRouter();
  const [connections, setConnections] = useState<Connection[]>([
    {
      id: 'github',
      name: 'GitHub',
      description: '同步代码仓库,自动创建任务',
      icon: '💻',
      status: 'connected',
      connectedAt: '2025-10-20',
      features: ['代码同步', '自动任务', 'PR 跟踪'],
    },
    {
      id: 'jira',
      name: 'Jira',
      description: '导入 Jira 任务,双向同步',
      icon: '📊',
      status: 'disconnected',
      features: ['任务导入', '状态同步', '评论同步'],
    },
    {
      id: 'slack',
      name: 'Slack',
      description: '接收通知,快速创建任务',
      icon: '💬',
      status: 'connected',
      connectedAt: '2025-10-15',
      features: ['通知推送', '快捷命令', '团队协作'],
    },
    {
      id: 'notion',
      name: 'Notion',
      description: '同步文档和数据库',
      icon: '📝',
      status: 'disconnected',
      features: ['文档同步', '数据库集成', '页面嵌入'],
    },
    {
      id: 'figma',
      name: 'Figma',
      description: '同步设计文件和评论',
      icon: '🎨',
      status: 'disconnected',
      features: ['设计文件', '评论同步', '版本跟踪'],
    },
    {
      id: 'google-drive',
      name: 'Google Drive',
      description: '访问和管理云端文件',
      icon: '☁️',
      status: 'disconnected',
      features: ['文件访问', '文件上传', '共享管理'],
    },
  ]);

  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: 'sk-proj-xxxxx',
    anthropic: '',
  });

  const handleConnect = (id: string) => {
    console.log('Connecting to:', id);
    // Open OAuth flow or connection modal
    setConnections(
      connections.map((conn) =>
        conn.id === id
          ? { ...conn, status: 'connected', connectedAt: new Date().toISOString().split('T')[0] }
          : conn
      )
    );
  };

  const handleDisconnect = (id: string) => {
    console.log('Disconnecting from:', id);
    setConnections(
      connections.map((conn) =>
        conn.id === id ? { ...conn, status: 'disconnected', connectedAt: undefined } : conn
      )
    );
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
            数据源连接
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            连接外部服务以增强 Karma 的功能
          </p>
        </div>

        <div className="space-y-6">
          {/* Integrations */}
          <Card>
            <CardHeader>
              <CardTitle>第三方集成</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                连接你常用的工具和服务
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connections.map((conn) => (
                  <div
                    key={conn.id}
                    className="flex items-start justify-between p-4 rounded-[12px]"
                    style={{ border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex gap-4 flex-1">
                      <div
                        style={{
                          fontSize: '32px',
                          width: '48px',
                          height: '48px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 'var(--radius-md)',
                          backgroundColor: 'var(--color-bg-secondary)',
                        }}
                      >
                        {conn.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {conn.name}
                          </h3>
                          <Badge
                            variant={conn.status === 'connected' ? 'success' : 'outline'}
                          >
                            {conn.status === 'connected' ? '已连接' : '未连接'}
                          </Badge>
                        </div>
                        <p
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--spacing-sm)',
                          }}
                        >
                          {conn.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {conn.features.map((feature) => (
                            <span
                              key={feature}
                              style={{
                                fontSize: '11px',
                                padding: '2px 8px',
                                borderRadius: '6px',
                                backgroundColor: 'var(--color-bg-secondary)',
                                color: 'var(--color-text-muted)',
                              }}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                        {conn.status === 'connected' && conn.connectedAt && (
                          <p
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                              marginTop: 'var(--spacing-xs)',
                            }}
                          >
                            连接于 {conn.connectedAt}
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      {conn.status === 'disconnected' ? (
                        <Button size="sm" onClick={() => handleConnect(conn.id)}>
                          连接
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDisconnect(conn.id)}
                        >
                          断开
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card>
            <CardHeader>
              <CardTitle>API 密钥</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                管理你的 API 密钥以访问高级功能
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      display: 'block',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    OpenAI API Key
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKeys.openai}
                      onChange={(e) => setApiKeys({ ...apiKeys, openai: e.target.value })}
                      placeholder="sk-proj-..."
                      className="flex-1 px-4 py-2 rounded-[8px] transition-all"
                      style={{
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-primary)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-caption)',
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowApiKey(!showApiKey)}
                    >
                      {showApiKey ? '隐藏' : '显示'}
                    </Button>
                  </div>
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      marginTop: 'var(--spacing-xs)',
                    }}
                  >
                    用于 GPT 对话功能。获取: <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" style={{color: 'var(--color-brand-primary)'}}>OpenAI 平台</a>
                  </p>
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      display: 'block',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    Anthropic API Key (可选)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKeys.anthropic}
                      onChange={(e) => setApiKeys({ ...apiKeys, anthropic: e.target.value })}
                      placeholder="sk-ant-..."
                      className="flex-1 px-4 py-2 rounded-[8px] transition-all"
                      style={{
                        border: '1px solid var(--color-border)',
                        backgroundColor: 'var(--color-bg-primary)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-caption)',
                      }}
                    />
                  </div>
                  <p
                    style={{
                      fontSize: '11px',
                      color: 'var(--color-text-muted)',
                      marginTop: 'var(--spacing-xs)',
                    }}
                  >
                    用于 Claude AI 功能。获取: <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer" style={{color: 'var(--color-brand-primary)'}}>Anthropic Console</a>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Webhooks */}
          <Card>
            <CardHeader>
              <CardTitle>Webhooks</CardTitle>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginTop: 'var(--spacing-xs)',
                }}
              >
                配置 Webhook 以接收实时事件通知
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  暂无 Webhook 配置
                </p>
                <Button variant="outline" size="sm">
                  添加 Webhook
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => router.push('/profile')}>
              取消
            </Button>
            <Button onClick={() => console.log('Saving connections...')}>
              保存更改
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
