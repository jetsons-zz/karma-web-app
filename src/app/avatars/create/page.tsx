'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';

type Role = 'Forge' | 'Vision' | 'Scout' | 'Capital' | 'Flow' | 'One';

interface AvatarFormData {
  role: Role | null;
  name: string;
  description: string;
  skills: string[];
  abilities: {
    coding: number;
    design: number;
    writing: number;
    analysis: number;
    communication: number;
  };
  budget: number;
  isPublic: boolean;
}

const roleInfo: Record<Role, { title: string; description: string; color: string; icon: string }> = {
  Forge: {
    title: 'Forge - 开发锻造',
    description: '全栈开发、后端架构、DevOps 专家',
    color: '#FF6B6B',
    icon: '⚒️',
  },
  Vision: {
    title: 'Vision - 设计视觉',
    description: 'UI/UX 设计、品牌设计、创意策划',
    color: '#4ECDC4',
    icon: '🎨',
  },
  Scout: {
    title: 'Scout - 市场侦查',
    description: '市场调研、数据分析、竞品分析',
    color: '#95E1D3',
    icon: '🔍',
  },
  Capital: {
    title: 'Capital - 资本运营',
    description: '财务分析、投资策略、商业模式',
    color: '#FFA07A',
    icon: '💰',
  },
  Flow: {
    title: 'Flow - 流程优化',
    description: '项目管理、流程优化、自动化',
    color: '#A8DADC',
    icon: '⚡',
  },
  One: {
    title: 'One - 全能通用',
    description: '通用型分身，适应多种任务场景',
    color: '#C7CEEA',
    icon: '⭐',
  },
};

export default function CreateAvatarPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<AvatarFormData>({
    role: null,
    name: '',
    description: '',
    skills: [],
    abilities: {
      coding: 50,
      design: 50,
      writing: 50,
      analysis: 50,
      communication: 50,
    },
    budget: 100,
    isPublic: false,
  });
  const [skillInput, setSkillInput] = useState('');

  const totalSteps = 5;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Submit form
      console.log('Creating avatar:', formData);
      router.push('/avatars');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.push('/avatars');
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.role !== null;
      case 2:
        return formData.name.trim().length > 0 && formData.description.trim().length > 0;
      case 3:
        return formData.skills.length > 0;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const addSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skill),
    });
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/avatars')}
            className="flex items-center gap-2 mb-4 transition-colors"
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
            返回团队雷达
          </button>
          <h1
            style={{
              fontSize: 'var(--font-size-h1)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            创建新分身
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            让我们一步步创建你的专属 AI 分身
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span
              style={{
                fontSize: 'var(--font-size-caption)',
                color: 'var(--color-text-secondary)',
              }}
            >
              第 {step} 步，共 {totalSteps} 步
            </span>
            <span
              style={{
                fontSize: 'var(--font-size-caption)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-brand-primary)',
              }}
            >
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {/* Step 1: Choose Role */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>选择角色类型</CardTitle>
                <p
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'var(--spacing-xs)',
                  }}
                >
                  不同角色具有不同的专长领域，选择最适合你需求的角色
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(Object.keys(roleInfo) as Role[]).map((role) => {
                    const info = roleInfo[role];
                    const isSelected = formData.role === role;
                    return (
                      <div
                        key={role}
                        onClick={() => setFormData({ ...formData, role })}
                        className="p-6 rounded-[16px] cursor-pointer transition-all"
                        style={{
                          border: `2px solid ${isSelected ? info.color : 'var(--color-border)'}`,
                          backgroundColor: isSelected ? `${info.color}10` : 'var(--color-bg-panel)',
                        }}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <span style={{ fontSize: '32px' }}>{info.icon}</span>
                          <div className="flex-1">
                            <h3
                              style={{
                                fontSize: 'var(--font-size-body)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--color-text-primary)',
                                marginBottom: 'var(--spacing-xxs)',
                              }}
                            >
                              {info.title}
                            </h3>
                            <p
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                color: 'var(--color-text-secondary)',
                                lineHeight: '1.4',
                              }}
                            >
                              {info.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="h-5 w-5"
                              style={{ color: info.color }}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: info.color,
                              }}
                            >
                              已选择
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Basic Info */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
                <p
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'var(--spacing-xs)',
                  }}
                >
                  为你的分身设置名称和描述
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Selected Role Display */}
                  {formData.role && (
                    <div
                      className="p-4 rounded-[12px] flex items-center gap-3"
                      style={{
                        backgroundColor: `${roleInfo[formData.role].color}10`,
                        border: `1px solid ${roleInfo[formData.role].color}40`,
                      }}
                    >
                      <span style={{ fontSize: '24px' }}>{roleInfo[formData.role].icon}</span>
                      <div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {roleInfo[formData.role].title}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          {roleInfo[formData.role].description}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <Input
                      label="分身名称"
                      placeholder="例如: FORGE #3"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <p
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                        marginTop: 'var(--spacing-xs)',
                      }}
                    >
                      给你的分身起一个独特的名字
                    </p>
                  </div>

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
                      描述 <span style={{ color: 'var(--color-accent-danger)' }}>*</span>
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="描述这个分身的专长和特点..."
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
          )}

          {/* Step 3: Skills */}
          {step === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>技能配置</CardTitle>
                <p
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'var(--spacing-xs)',
                  }}
                >
                  添加这个分身擅长的技能标签
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="输入技能名称，例如: React"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                    />
                    <Button onClick={addSkill} disabled={!skillInput.trim()}>
                      添加
                    </Button>
                  </div>

                  {formData.skills.length > 0 ? (
                    <div>
                      <div
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                          marginBottom: 'var(--spacing-sm)',
                        }}
                      >
                        已添加技能 ({formData.skills.length})
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {formData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-4 py-2 rounded-[12px] flex items-center gap-2"
                            style={{
                              backgroundColor: 'var(--color-bg-elevated)',
                              color: 'var(--color-text-primary)',
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-medium)',
                              border: '1px solid var(--color-border)',
                            }}
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-1"
                              style={{
                                color: 'var(--color-text-muted)',
                              }}
                            >
                              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              </svg>
                            </button>
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className="text-center py-8 rounded-[12px]"
                      style={{
                        backgroundColor: 'var(--color-bg-elevated)',
                        color: 'var(--color-text-muted)',
                        fontSize: 'var(--font-size-caption)',
                      }}
                    >
                      还没有添加任何技能，至少添加 1 个技能
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 4: Abilities */}
          {step === 4 && (
            <Card>
              <CardHeader>
                <CardTitle>能力参数</CardTitle>
                <p
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'var(--spacing-xs)',
                  }}
                >
                  调整分身在各个维度的能力值（总分 {Object.values(formData.abilities).reduce((a, b) => a + b, 0)} / 500）
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(formData.abilities).map(([ability, value]) => {
                    const abilityNames: Record<string, string> = {
                      coding: '编程能力',
                      design: '设计能力',
                      writing: '写作能力',
                      analysis: '分析能力',
                      communication: '沟通能力',
                    };
                    return (
                      <div key={ability}>
                        <div className="flex items-center justify-between mb-2">
                          <label
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {abilityNames[ability]}
                          </label>
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-bold)',
                              color: value > 80 ? 'var(--color-accent-success)' : 'var(--color-text-primary)',
                            }}
                          >
                            {value} / 100
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={value}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              abilities: {
                                ...formData.abilities,
                                [ability]: parseInt(e.target.value),
                              },
                            })
                          }
                          style={{
                            width: '100%',
                            height: '8px',
                            borderRadius: '4px',
                            background: `linear-gradient(to right, var(--color-brand-primary) 0%, var(--color-brand-primary) ${value}%, var(--color-bg-elevated) ${value}%, var(--color-bg-elevated) 100%)`,
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Review & Confirm */}
          {step === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>预览与确认</CardTitle>
                <p
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                    marginTop: 'var(--spacing-xs)',
                  }}
                >
                  请确认以下信息，然后创建你的分身
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Preview Card */}
                  <div
                    className="p-6 rounded-[16px]"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-start gap-4 mb-4">
                      {formData.role && (
                        <div
                          className="flex items-center justify-center rounded-full"
                          style={{
                            width: '64px',
                            height: '64px',
                            backgroundColor: roleInfo[formData.role].color,
                            fontSize: '32px',
                          }}
                        >
                          {roleInfo[formData.role].icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <h3
                          style={{
                            fontSize: 'var(--font-size-h2)',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-text-primary)',
                            marginBottom: 'var(--spacing-xs)',
                          }}
                        >
                          {formData.name}
                        </h3>
                        <Badge variant="success">
                          {formData.role && roleInfo[formData.role].title.split(' - ')[0]}
                        </Badge>
                      </div>
                    </div>

                    <p
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                        marginBottom: 'var(--spacing-md)',
                        lineHeight: '1.5',
                      }}
                    >
                      {formData.description}
                    </p>

                    <div className="mb-4">
                      <div
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                          marginBottom: 'var(--spacing-sm)',
                        }}
                      >
                        技能 ({formData.skills.length})
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="px-3 py-1 rounded-md"
                            style={{
                              backgroundColor: 'var(--color-bg-panel)',
                              color: 'var(--color-text-secondary)',
                              fontSize: 'var(--font-size-caption)',
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                          marginBottom: 'var(--spacing-sm)',
                        }}
                      >
                        能力参数
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(formData.abilities).map(([ability, value]) => {
                          const abilityNames: Record<string, string> = {
                            coding: '编程',
                            design: '设计',
                            writing: '写作',
                            analysis: '分析',
                            communication: '沟通',
                          };
                          return (
                            <div key={ability} className="flex items-center justify-between">
                              <span
                                style={{
                                  fontSize: 'var(--font-size-caption)',
                                  color: 'var(--color-text-secondary)',
                                }}
                              >
                                {abilityNames[ability]}
                              </span>
                              <span
                                style={{
                                  fontSize: 'var(--font-size-caption)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  color: value > 80 ? 'var(--color-accent-success)' : 'var(--color-text-primary)',
                                }}
                              >
                                {value}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-[12px]" style={{ border: '1px solid var(--color-border)' }}>
                      <div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          公开到商店
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          其他用户可以订阅使用此分身
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={formData.isPublic}
                        onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                        style={{
                          width: '20px',
                          height: '20px',
                        }}
                      />
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
                          每月预算
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          此分身的最大月度消耗限额
                        </div>
                      </div>
                      <span
                        style={{
                          fontSize: 'var(--font-size-body)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-brand-primary)',
                        }}
                      >
                        ${formData.budget}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <Button variant="secondary" onClick={handleBack}>
            {step === 1 ? '取消' : '上一步'}
          </Button>
          <Button onClick={handleNext} disabled={!canProceed()}>
            {step === totalSteps ? '创建分身' : '下一步'}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
