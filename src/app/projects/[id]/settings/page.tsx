'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Toggle } from '@/components/ui/Toggle';
import { Badge } from '@/components/ui/Badge';

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: string;
  action: string;
  enabled: boolean;
}

interface ProjectSettings {
  name: string;
  description: string;
  visibility: 'private' | 'team' | 'public';
  features: {
    aiAssistant: boolean;
    autoReview: boolean;
    notifications: boolean;
    analytics: boolean;
  };
  integrations: {
    github: boolean;
    slack: boolean;
    jira: boolean;
  };
}

export default function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [settings, setSettings] = useState<ProjectSettings>({
    name: '移动应用开发',
    description: '为企业客户开发跨平台移动应用',
    visibility: 'team',
    features: {
      aiAssistant: true,
      autoReview: true,
      notifications: true,
      analytics: true,
    },
    integrations: {
      github: true,
      slack: true,
      jira: false,
    },
  });

  const [members, setMembers] = useState<Member[]>([
    {
      id: 'user-001',
      name: '张伟',
      email: 'zhangwei@company.com',
      role: 'owner',
      joinedAt: '2025-08-01',
    },
    {
      id: 'user-002',
      name: '李娜',
      email: 'lina@company.com',
      role: 'admin',
      joinedAt: '2025-08-15',
    },
    {
      id: 'user-003',
      name: '王强',
      email: 'wangqiang@company.com',
      role: 'member',
      joinedAt: '2025-09-01',
    },
  ]);

  const [automationRules, setAutomationRules] = useState<AutomationRule[]>([
    {
      id: 'rule-001',
      name: '自动分配审查者',
      trigger: '创建 Pull Request 时',
      action: '自动分配相关成员进行代码审查',
      enabled: true,
    },
    {
      id: 'rule-002',
      name: 'CI/CD 自动触发',
      trigger: '合并到主分支时',
      action: '自动运行测试和部署流程',
      enabled: true,
    },
    {
      id: 'rule-003',
      name: '状态同步到 Slack',
      trigger: '任务状态变更时',
      action: '发送通知到 Slack 频道',
      enabled: false,
    },
  ]);

  const [hasChanges, setHasChanges] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'members' | 'integrations' | 'automation'>('general');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const updateFeature = (key: keyof ProjectSettings['features'], value: boolean) => {
    setSettings({
      ...settings,
      features: { ...settings.features, [key]: value },
    });
    setHasChanges(true);
  };

  const updateIntegration = (key: keyof ProjectSettings['integrations'], value: boolean) => {
    setSettings({
      ...settings,
      integrations: { ...settings.integrations, [key]: value },
    });
    setHasChanges(true);
  };

  const toggleRule = (ruleId: string) => {
    setAutomationRules(prev =>
      prev.map(rule =>
        rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    console.log('Saving project settings:', settings);
    setHasChanges(false);
    // Show success message
  };

  const handleDeleteProject = () => {
    console.log('Deleting project:', id);
    router.push('/projects');
  };

  const getRoleBadgeVariant = (role: Member['role']) => {
    const variants = {
      owner: 'default' as const,
      admin: 'success' as const,
      member: 'default' as const,
      viewer: 'default' as const,
    };
    return variants[role];
  };

  const getRoleLabel = (role: Member['role']) => {
    const labels = {
      owner: '所有者',
      admin: '管理员',
      member: '成员',
      viewer: '访客',
    };
    return labels[role];
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push(`/projects/${id}`)}
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
          返回项目
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
            项目设置
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {settings.name}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
          {[
            { key: 'general' as const, label: '通用设置' },
            { key: 'members' as const, label: '成员管理' },
            { key: 'integrations' as const, label: '集成配置' },
            { key: 'automation' as const, label: '自动化规则' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="pb-3 px-4 transition-colors"
              style={{
                fontSize: 'var(--font-size-body)',
                fontWeight: activeTab === tab.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                color: activeTab === tab.key ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === tab.key ? '2px solid var(--color-brand-primary)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* General Settings Tab */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
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
                      项目名称
                    </label>
                    <input
                      type="text"
                      value={settings.name}
                      onChange={(e) => {
                        setSettings({ ...settings, name: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2 rounded-[8px]"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-body)',
                      }}
                    />
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
                      项目描述
                    </label>
                    <textarea
                      value={settings.description}
                      onChange={(e) => {
                        setSettings({ ...settings, description: e.target.value });
                        setHasChanges(true);
                      }}
                      rows={3}
                      className="w-full px-4 py-2 rounded-[8px]"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-body)',
                        resize: 'vertical',
                      }}
                    />
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
                      项目可见性
                    </label>
                    <select
                      value={settings.visibility}
                      onChange={(e) => {
                        setSettings({ ...settings, visibility: e.target.value as any });
                        setHasChanges(true);
                      }}
                      className="w-full px-4 py-2 rounded-[8px]"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-body)',
                      }}
                    >
                      <option value="private">私有 - 仅你可见</option>
                      <option value="team">团队 - 团队成员可见</option>
                      <option value="public">公开 - 所有人可见</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>功能开关</CardTitle>
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
                        AI 助手
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        启用 Avatar 提供智能建议和自动化
                      </div>
                    </div>
                    <Toggle
                      checked={settings.features.aiAssistant}
                      onChange={(checked) => updateFeature('aiAssistant', checked)}
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
                        自动审查
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        自动检查代码质量和安全问题
                      </div>
                    </div>
                    <Toggle
                      checked={settings.features.autoReview}
                      onChange={(checked) => updateFeature('autoReview', checked)}
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
                        通知提醒
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        接收项目相关的通知和提醒
                      </div>
                    </div>
                    <Toggle
                      checked={settings.features.notifications}
                      onChange={(checked) => updateFeature('notifications', checked)}
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
                        数据分析
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        收集项目数据用于分析和优化
                      </div>
                    </div>
                    <Toggle
                      checked={settings.features.analytics}
                      onChange={(checked) => updateFeature('analytics', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>危险操作</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="p-4 rounded-[8px]"
                  style={{
                    backgroundColor: 'var(--color-error)10',
                    border: '1px solid var(--color-error)',
                  }}
                >
                  <div
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-error)',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    删除项目
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-md)',
                    }}
                  >
                    删除后将无法恢复项目数据，包括所有任务、文件和历史记录
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => setShowDeleteDialog(true)}
                    style={{
                      color: 'var(--color-error)',
                      borderColor: 'var(--color-error)',
                    }}
                  >
                    删除项目
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>项目成员</CardTitle>
                  <Button size="sm">邀请成员</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-4 rounded-[8px]"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-full"
                          style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }}
                        />
                        <div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {member.name}
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {member.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge variant={getRoleBadgeVariant(member.role)}>
                          {getRoleLabel(member.role)}
                        </Badge>
                        {member.role !== 'owner' && (
                          <Button variant="ghost" size="sm">
                            管理
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>第三方集成</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-[8px] flex items-center justify-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--color-surface)',
                        }}
                      >
                        📦
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          GitHub
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          同步代码仓库和 Pull Requests
                        </div>
                      </div>
                    </div>
                    <Toggle
                      checked={settings.integrations.github}
                      onChange={(checked) => updateIntegration('github', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-[8px] flex items-center justify-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--color-surface)',
                        }}
                      >
                        💬
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          Slack
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          发送通知到 Slack 频道
                        </div>
                      </div>
                    </div>
                    <Toggle
                      checked={settings.integrations.slack}
                      onChange={(checked) => updateIntegration('slack', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="rounded-[8px] flex items-center justify-center"
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: 'var(--color-surface)',
                        }}
                      >
                        📋
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          Jira
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          同步任务和问题追踪
                        </div>
                      </div>
                    </div>
                    <Toggle
                      checked={settings.integrations.jira}
                      onChange={(checked) => updateIntegration('jira', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Automation Tab */}
        {activeTab === 'automation' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>自动化规则</CardTitle>
                  <Button size="sm">创建规则</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {automationRules.map((rule) => (
                    <div
                      key={rule.id}
                      className="p-4 rounded-[8px]"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-text-primary)',
                              marginBottom: '4px',
                            }}
                          >
                            {rule.name}
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            触发条件: {rule.trigger}
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            执行动作: {rule.action}
                          </div>
                        </div>
                        <Toggle
                          checked={rule.enabled}
                          onChange={() => toggleRule(rule.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button variant="outline" onClick={() => router.push(`/projects/${id}`)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={!hasChanges}>
            保存更改
          </Button>
        </div>

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onClick={() => setShowDeleteDialog(false)}
          >
            <div
              className="rounded-[16px] p-6 max-w-md"
              style={{
                backgroundColor: 'var(--color-surface)',
                boxShadow: 'var(--shadow-xl)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                style={{
                  fontSize: 'var(--font-size-h3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-error)',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                确认删除项目
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-body)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-lg)',
                  lineHeight: '1.6',
                }}
              >
                此操作无法撤销。删除后将永久删除项目"{settings.name}"及其所有数据，包括任务、文件和历史记录。
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  取消
                </Button>
                <Button
                  onClick={handleDeleteProject}
                  style={{
                    backgroundColor: 'var(--color-error)',
                    color: 'white',
                  }}
                >
                  确认删除
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
