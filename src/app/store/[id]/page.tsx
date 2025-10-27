'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { mockStoreAvatars } from '@/lib/mock/data';
import { formatDate } from '@/lib/utils';

interface PageProps {
  params: Promise<{ id: string }>;
}

// Mock reviews
const mockReviews = [
  {
    id: '1',
    user: 'Alex Chen',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alex',
    rating: 5,
    comment: '非常专业的代码审查，帮我发现了很多潜在问题，强烈推荐！',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '2',
    user: 'Sarah Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
    rating: 5,
    comment: '工作效率超高，代码质量也很好，值这个价格。',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: '3',
    user: 'Mike Zhang',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
    rating: 4,
    comment: '整体不错，唯一的缺点是偶尔响应速度会有点慢。',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function StoreDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  // Find avatar by id
  const avatar = mockStoreAvatars.find(a => a.id === id);

  if (!avatar) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Avatar 不存在</h2>
            <p className="text-neutral-600 mb-4">未找到指定的 Avatar</p>
            <Button onClick={() => router.push('/store')}>返回商店</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const monthlyPrice = avatar.price || 49;
  const yearlyPrice = Math.round(monthlyPrice * 12 * 0.8); // 年付8折
  const yearlyMonthlyPrice = Math.round(yearlyPrice / 12);

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => router.push('/store')}
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
          返回商店
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div>
              <div className="flex items-start gap-6 mb-6">
                <Avatar src={avatar.avatar} name={avatar.name} size="xxl" showRole />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1
                      style={{
                        fontSize: 'var(--font-size-h1)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {avatar.name}
                    </h1>
                    <Badge variant="outline">{avatar.category}</Badge>
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--font-size-body)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-md)',
                    }}
                  >
                    {avatar.description}
                  </p>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-5 w-5"
                          viewBox="0 0 20 20"
                          style={{
                            fill: i < Math.floor(avatar.rating) ? 'var(--color-accent-warning)' : 'var(--color-bg-elevated)',
                          }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                      <span
                        style={{
                          fontSize: 'var(--font-size-body)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-text-primary)',
                          marginLeft: 'var(--spacing-xs)',
                        }}
                      >
                        {avatar.rating}
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        ({avatar.reviewCount} 评价)
                      </span>
                    </div>
                    <div
                      style={{
                        width: '1px',
                        height: '16px',
                        backgroundColor: 'var(--color-border)',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {avatar.downloads?.toLocaleString()} 次订阅
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {avatar.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-md"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-caption)',
                      border: '1px solid var(--color-border)',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Stats */}
            <Card>
              <CardHeader>
                <CardTitle>性能指标</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      完成任务
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-h2)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {avatar.performance.completedTasks}
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      成功率
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-h2)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-accent-success)',
                      }}
                    >
                      {avatar.performance.successRate}%
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      平均用时
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-h2)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {avatar.performance.averageTime}h
                    </div>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-muted)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      响应速度
                    </div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-h2)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-accent-success)',
                      }}
                    >
                      快速
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills & Abilities */}
            <Card>
              <CardHeader>
                <CardTitle>技能与能力</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Skills */}
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-sm)',
                      }}
                    >
                      专业技能
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {avatar.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-3 py-1.5 rounded-md"
                          style={{
                            backgroundColor: 'var(--color-bg-elevated)',
                            color: 'var(--color-text-primary)',
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Abilities */}
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-sm)',
                      }}
                    >
                      能力评估
                    </div>
                    <div className="space-y-3">
                      {Object.entries(avatar.abilities).map(([ability, score]) => {
                        const abilityNames: Record<string, string> = {
                          coding: '编程能力',
                          design: '设计能力',
                          writing: '写作能力',
                          analysis: '分析能力',
                          communication: '沟通能力',
                        };
                        return (
                          <div key={ability}>
                            <div className="flex items-center justify-between mb-1">
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
                                  color: score > 80 ? 'var(--color-accent-success)' : 'var(--color-text-primary)',
                                }}
                              >
                                {score}/100
                              </span>
                            </div>
                            <Progress value={score} />
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>用户评价 ({mockReviews.length})</CardTitle>
                  <Button variant="ghost" size="sm">查看全部</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div
                      key={review.id}
                      className="pb-4"
                      style={{
                        borderBottom: review.id !== mockReviews[mockReviews.length - 1].id
                          ? '1px solid var(--color-border)'
                          : 'none',
                      }}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <Avatar src={review.avatar} name={review.user} size="sm" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-text-primary)',
                              }}
                            >
                              {review.user}
                            </span>
                            <span
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                              }}
                            >
                              {formatDate(review.date)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className="h-3.5 w-3.5"
                                viewBox="0 0 20 20"
                                style={{
                                  fill: i < review.rating ? 'var(--color-accent-warning)' : 'var(--color-bg-elevated)',
                                }}
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                              lineHeight: '1.5',
                            }}
                          >
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Pricing */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card status="active">
              <CardHeader>
                <CardTitle>选择订阅计划</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Plan Toggle */}
                  <div
                    className="flex items-center gap-2 p-1 rounded-[12px]"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                    }}
                  >
                    <button
                      onClick={() => setSelectedPlan('monthly')}
                      className="flex-1 py-2 px-3 rounded-lg transition-all"
                      style={{
                        backgroundColor: selectedPlan === 'monthly' ? 'var(--color-brand-primary)' : 'transparent',
                        color: selectedPlan === 'monthly' ? '#FFFFFF' : 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      按月
                    </button>
                    <button
                      onClick={() => setSelectedPlan('yearly')}
                      className="flex-1 py-2 px-3 rounded-lg transition-all"
                      style={{
                        backgroundColor: selectedPlan === 'yearly' ? 'var(--color-brand-primary)' : 'transparent',
                        color: selectedPlan === 'yearly' ? '#FFFFFF' : 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                      }}
                    >
                      按年 <Badge variant="success" style={{ marginLeft: '4px' }}>省20%</Badge>
                    </button>
                  </div>

                  {/* Price Display */}
                  <div className="text-center py-4">
                    {selectedPlan === 'monthly' ? (
                      <>
                        <div
                          style={{
                            fontSize: '48px',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-text-primary)',
                            lineHeight: '1',
                          }}
                        >
                          ${monthlyPrice}
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-muted)',
                            marginTop: 'var(--spacing-xs)',
                          }}
                        >
                          每月
                        </div>
                      </>
                    ) : (
                      <>
                        <div
                          style={{
                            fontSize: '48px',
                            fontWeight: 'var(--font-weight-bold)',
                            color: 'var(--color-text-primary)',
                            lineHeight: '1',
                          }}
                        >
                          ${yearlyMonthlyPrice}
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-muted)',
                            marginTop: 'var(--spacing-xs)',
                          }}
                        >
                          每月 (年付 ${yearlyPrice})
                        </div>
                      </>
                    )}
                  </div>

                  {/* CTA Buttons */}
                  <div className="space-y-3">
                    <Button
                      size="lg"
                      fullWidth
                      onClick={() => router.push(`/store/checkout?avatar=${avatar.id}&plan=${selectedPlan}`)}
                    >
                      立即订阅
                    </Button>
                    <Button variant="outline" size="lg" fullWidth>
                      免费试用 7 天
                    </Button>
                  </div>

                  {/* Features */}
                  <div
                    className="pt-4 space-y-2"
                    style={{
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 flex-shrink-0"
                        style={{ color: 'var(--color-accent-success)' }}
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
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        无限任务量
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 flex-shrink-0"
                        style={{ color: 'var(--color-accent-success)' }}
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
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        24/7 在线服务
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 flex-shrink-0"
                        style={{ color: 'var(--color-accent-success)' }}
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
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        优先技术支持
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg
                        className="h-5 w-5 flex-shrink-0"
                        style={{ color: 'var(--color-accent-success)' }}
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
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        随时取消订阅
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>常见问题</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      如何开始使用？
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: '1.5',
                      }}
                    >
                      订阅后，Avatar 会立即加入你的团队，你可以在项目中分配任务给它。
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      可以取消吗？
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: '1.5',
                      }}
                    >
                      可以随时取消订阅，已支付的周期内仍可继续使用。
                    </p>
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      有使用限制吗？
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                        lineHeight: '1.5',
                      }}
                    >
                      订阅期间无任务量限制，但建议合理分配任务以获得最佳效果。
                    </p>
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
