'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Avatar } from '@/components/ui/Avatar';
import { Toggle } from '@/components/ui/Toggle';
import { mockAvatars } from '@/lib/mock/data';

const projectTemplates = [
  {
    id: 'blank',
    name: '空白项目',
    description: '从零开始创建自定义项目',
    icon: '📄',
  },
  {
    id: 'web-dev',
    name: 'Web 开发',
    description: '前后端开发项目模板',
    icon: '🌐',
  },
  {
    id: 'design',
    name: '设计项目',
    description: 'UI/UX 设计项目模板',
    icon: '🎨',
  },
  {
    id: 'marketing',
    name: '营销活动',
    description: '市场推广和内容运营',
    icon: '📣',
  },
  {
    id: 'data',
    name: '数据分析',
    description: '数据收集和分析项目',
    icon: '📊',
  },
  {
    id: 'research',
    name: '研究项目',
    description: '市场研究和调研项目',
    icon: '🔍',
  },
];

interface ProjectFormData {
  name: string;
  description: string;
  template: string;
  members: string[];
  autoMode: boolean;
  isPrivate: boolean;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    template: 'blank',
    members: [],
    autoMode: true,
    isPrivate: false,
  });
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsCreating(true);
    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 成功创建，跳转到项目列表
        setTimeout(() => {
          router.push('/projects');
        }, 500);
      } else {
        throw new Error(data.error || '创建失败');
      }
    } catch (error) {
      console.error('Create project error:', error);
      alert(`创建失败: ${error instanceof Error ? error.message : '未知错误'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const toggleMember = (avatarId: string) => {
    setFormData({
      ...formData,
      members: formData.members.includes(avatarId)
        ? formData.members.filter(id => id !== avatarId)
        : [...formData.members, avatarId],
    });
  };

  const canSubmit = formData.name.trim().length > 0 && formData.description.trim().length > 0;

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/projects')}
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
          返回项目列表
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
            创建新项目
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            选择模板并配置你的项目
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle>基本信息</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input
                      label="项目名称"
                      placeholder="例如: Karma Web 开发"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                          marginBottom: 'var(--spacing-xs)',
                        }}
                      >
                        项目描述 <span style={{ color: 'var(--color-accent-danger)' }}>*</span>
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="简要描述项目的目标和范围..."
                        rows={4}
                        style={{
                          width: '100%',
                          padding: 'var(--spacing-sm)',
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-primary)',
                          backgroundColor: 'var(--color-bg-panel)',
                          border: '1px solid var(--color-border)',
                          borderRadius: 'var(--radius-md)',
                          resize: 'vertical',
                        }}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Template Selection */}
              <Card>
                <CardHeader>
                  <CardTitle>选择模板</CardTitle>
                  <p
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                      marginTop: 'var(--spacing-xs)',
                    }}
                  >
                    模板包含预设的任务和工作流程
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {projectTemplates.map((template) => {
                      const isSelected = formData.template === template.id;
                      return (
                        <div
                          key={template.id}
                          onClick={() => setFormData({ ...formData, template: template.id })}
                          className="p-4 rounded-[12px] cursor-pointer transition-all"
                          style={{
                            border: `2px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                            backgroundColor: isSelected ? 'var(--color-brand-primary)10' : 'var(--color-bg-panel)',
                          }}
                        >
                          <div className="flex items-start gap-3">
                            <span style={{ fontSize: '32px' }}>{template.icon}</span>
                            <div className="flex-1">
                              <h3
                                style={{
                                  fontSize: 'var(--font-size-caption)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  color: 'var(--color-text-primary)',
                                  marginBottom: 'var(--spacing-xxs)',
                                }}
                              >
                                {template.name}
                              </h3>
                              <p
                                style={{
                                  fontSize: 'var(--font-size-caption)',
                                  color: 'var(--color-text-secondary)',
                                  lineHeight: '1.4',
                                }}
                              >
                                {template.description}
                              </p>
                            </div>
                            {isSelected && (
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
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card>
                <CardHeader>
                  <CardTitle>添加团队成员</CardTitle>
                  <p
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                      marginTop: 'var(--spacing-xs)',
                    }}
                  >
                    选择参与此项目的 Avatar
                  </p>
                </CardHeader>
                <CardContent>
                  {mockAvatars.length > 0 ? (
                    <div className="space-y-3">
                      {mockAvatars.map((avatar) => {
                        const isSelected = formData.members.includes(avatar.id);
                        return (
                          <div
                            key={avatar.id}
                            onClick={() => toggleMember(avatar.id)}
                            className="flex items-center justify-between p-4 rounded-[12px] cursor-pointer transition-all"
                            style={{
                              border: `1px solid ${isSelected ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                              backgroundColor: isSelected ? 'var(--color-brand-primary)10' : 'transparent',
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar
                                src={avatar.avatar}
                                name={avatar.name}
                                size="md"
                                status={
                                  avatar.status === 'working' ? 'busy' :
                                  avatar.status === 'idle' ? 'online' : 'offline'
                                }
                              />
                              <div>
                                <div
                                  style={{
                                    fontSize: 'var(--font-size-caption)',
                                    fontWeight: 'var(--font-weight-medium)',
                                    color: 'var(--color-text-primary)',
                                    marginBottom: 'var(--spacing-xxs)',
                                  }}
                                >
                                  {avatar.name}
                                </div>
                                <div
                                  style={{
                                    fontSize: '11px',
                                    color: 'var(--color-text-secondary)',
                                  }}
                                >
                                  {avatar.skills.slice(0, 3).join(', ')}
                                </div>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              style={{
                                width: '20px',
                                height: '20px',
                              }}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div
                      className="text-center py-8"
                      style={{
                        color: 'var(--color-text-muted)',
                        fontSize: 'var(--font-size-caption)',
                      }}
                    >
                      还没有 Avatar，
                      <a
                        href="/avatars/create"
                        style={{
                          color: 'var(--color-brand-primary)',
                          textDecoration: 'underline',
                        }}
                      >
                        创建一个
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Settings */}
            <div className="space-y-6">
              {/* Project Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>项目设置</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          自动化模式
                        </label>
                        <Toggle
                          checked={formData.autoMode}
                          onChange={(checked) => setFormData({ ...formData, autoMode: checked })}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                          lineHeight: '1.4',
                        }}
                      >
                        AI 自动分配任务和管理工作流
                      </p>
                    </div>

                    <div
                      className="pt-4"
                      style={{
                        borderTop: '1px solid var(--color-border)',
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <label
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          私有项目
                        </label>
                        <input
                          type="checkbox"
                          checked={formData.isPrivate}
                          onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
                          style={{
                            width: '18px',
                            height: '18px',
                          }}
                        />
                      </div>
                      <p
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                          lineHeight: '1.4',
                        }}
                      >
                        只有团队成员可以查看此项目
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Summary */}
              <Card status="active">
                <CardHeader>
                  <CardTitle>项目概览</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        模板
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {projectTemplates.find(t => t.id === formData.template)?.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        团队成员
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {formData.members.length} 个 Avatar
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        自动化
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: formData.autoMode ? 'var(--color-accent-success)' : 'var(--color-text-muted)',
                        }}
                      >
                        {formData.autoMode ? '已启用' : '已禁用'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        可见性
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {formData.isPrivate ? '私有' : '团队可见'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Create Button */}
              <Button
                type="submit"
                size="lg"
                fullWidth
                disabled={!canSubmit || isCreating}
              >
                {isCreating ? '创建中...' : '创建项目'}
              </Button>

              {/* Help Text */}
              <div
                className="p-4 rounded-[12px]"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                }}
              >
                <div className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 flex-shrink-0"
                    style={{ color: 'var(--color-brand-primary)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-xxs)',
                      }}
                    >
                      小提示
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: '1.5',
                      }}
                    >
                      创建后可以随时修改项目设置，添加更多成员，或调整工作流程
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
