'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Subscription {
  id: string;
  avatarId: string;
  avatarName: string;
  avatarImage: string;
  plan: {
    name: string;
    type: 'monthly' | 'annually';
    price: number;
  };
  status: 'active' | 'expiring' | 'cancelled';
  startDate: string;
  nextBillingDate: string;
  autoRenew: boolean;
  totalSpent: number;
}

export default function SubscriptionsPage() {
  const router = useRouter();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      id: 'sub-001',
      avatarId: 'avatar-001',
      avatarName: 'CodeMaster Pro',
      avatarImage: '/avatars/codemaster.png',
      plan: {
        name: '专业版',
        type: 'monthly',
        price: 299,
      },
      status: 'active',
      startDate: '2025-09-27',
      nextBillingDate: '2025-11-27',
      autoRenew: true,
      totalSpent: 897,
    },
    {
      id: 'sub-002',
      avatarId: 'avatar-002',
      avatarName: 'DataAnalyst AI',
      avatarImage: '/avatars/dataanalyst.png',
      plan: {
        name: '基础版',
        type: 'monthly',
        price: 199,
      },
      status: 'active',
      startDate: '2025-08-15',
      nextBillingDate: '2025-11-15',
      autoRenew: true,
      totalSpent: 597,
    },
    {
      id: 'sub-003',
      avatarId: 'avatar-003',
      avatarName: 'DesignBot Elite',
      avatarImage: '/avatars/designbot.png',
      plan: {
        name: '企业版',
        type: 'annually',
        price: 2999,
      },
      status: 'expiring',
      startDate: '2024-11-01',
      nextBillingDate: '2025-11-01',
      autoRenew: false,
      totalSpent: 2999,
    },
  ]);

  const [showCancelDialog, setShowCancelDialog] = useState<string | null>(null);

  const getStatusBadge = (status: Subscription['status']) => {
    const styles = {
      active: { variant: 'success' as const, label: '活跃' },
      expiring: { variant: 'warning' as const, label: '即将到期' },
      cancelled: { variant: 'default' as const, label: '已取消' },
    };
    return styles[status];
  };

  const handleRenew = (subscriptionId: string) => {
    console.log('Renewing subscription:', subscriptionId);
    // Update subscription
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === subscriptionId
          ? { ...sub, autoRenew: true, status: 'active' as const }
          : sub
      )
    );
  };

  const handleCancelSubscription = (subscriptionId: string) => {
    console.log('Cancelling subscription:', subscriptionId);
    setSubscriptions(prev =>
      prev.map(sub =>
        sub.id === subscriptionId
          ? { ...sub, autoRenew: false, status: 'expiring' as const }
          : sub
      )
    );
    setShowCancelDialog(null);
  };

  const handleManage = (subscriptionId: string) => {
    router.push(`/store/subscriptions/${subscriptionId}`);
  };

  const handleViewAvatar = (avatarId: string) => {
    router.push(`/avatars/${avatarId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const activeCount = subscriptions.filter(s => s.status === 'active').length;
  const totalSpent = subscriptions.reduce((sum, s) => sum + s.totalSpent, 0);

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1200px', margin: '0 auto' }}>
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
            我的订阅
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            管理你的 Avatar 订阅和账单
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                活跃订阅
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {activeCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                总订阅数
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {subscriptions.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                累计消费
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                ¥{totalSpent.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Subscriptions List */}
        <div className="space-y-6">
          {subscriptions.length === 0 ? (
            <Card>
              <CardContent style={{ padding: 'var(--spacing-xxl)', textAlign: 'center' }}>
                <div
                  style={{
                    fontSize: 'var(--font-size-body)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-lg)',
                  }}
                >
                  你还没有任何订阅
                </div>
                <Button onClick={() => router.push('/store')}>
                  浏览 Avatar 商店
                </Button>
              </CardContent>
            </Card>
          ) : (
            subscriptions.map((subscription) => {
              const statusBadge = getStatusBadge(subscription.status);

              return (
                <Card key={subscription.id}>
                  <CardContent style={{ padding: 'var(--spacing-lg)' }}>
                    <div className="flex items-start gap-6">
                      {/* Avatar Image */}
                      <div
                        className="flex-shrink-0 cursor-pointer"
                        onClick={() => handleViewAvatar(subscription.avatarId)}
                      >
                        <div
                          className="rounded-[16px] overflow-hidden"
                          style={{
                            width: '120px',
                            height: '120px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          }}
                        >
                          {/* Placeholder for avatar image */}
                        </div>
                      </div>

                      {/* Subscription Details */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3
                              className="cursor-pointer hover:underline"
                              onClick={() => handleViewAvatar(subscription.avatarId)}
                              style={{
                                fontSize: 'var(--font-size-h3)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-text-primary)',
                                marginBottom: 'var(--spacing-xxs)',
                              }}
                            >
                              {subscription.avatarName}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge variant={statusBadge.variant}>
                                {statusBadge.label}
                              </Badge>
                              <span
                                style={{
                                  fontSize: 'var(--font-size-caption)',
                                  color: 'var(--color-text-secondary)',
                                }}
                              >
                                {subscription.plan.name}
                              </span>
                            </div>
                          </div>

                          <div style={{ textAlign: 'right' }}>
                            <div
                              style={{
                                fontSize: 'var(--font-size-h3)',
                                fontWeight: 'var(--font-weight-bold)',
                                color: 'var(--color-text-primary)',
                              }}
                            >
                              ¥{subscription.plan.price}
                            </div>
                            <div
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {subscription.plan.type === 'monthly' ? '/月' : '/年'}
                            </div>
                          </div>
                        </div>

                        {/* Subscription Info Grid */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                                marginBottom: '2px',
                              }}
                            >
                              开始日期
                            </div>
                            <div
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                color: 'var(--color-text-primary)',
                              }}
                            >
                              {formatDate(subscription.startDate)}
                            </div>
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                                marginBottom: '2px',
                              }}
                            >
                              下次账单日期
                            </div>
                            <div
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                color: 'var(--color-text-primary)',
                              }}
                            >
                              {formatDate(subscription.nextBillingDate)}
                            </div>
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                                marginBottom: '2px',
                              }}
                            >
                              自动续订
                            </div>
                            <div
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                color: subscription.autoRenew
                                  ? 'var(--color-success)'
                                  : 'var(--color-text-secondary)',
                              }}
                            >
                              {subscription.autoRenew ? '已开启' : '已关闭'}
                            </div>
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                                marginBottom: '2px',
                              }}
                            >
                              累计消费
                            </div>
                            <div
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                color: 'var(--color-text-primary)',
                              }}
                            >
                              ¥{subscription.totalSpent.toLocaleString()}
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleManage(subscription.id)}
                          >
                            管理订阅
                          </Button>

                          {subscription.status === 'expiring' && !subscription.autoRenew && (
                            <Button
                              size="sm"
                              onClick={() => handleRenew(subscription.id)}
                            >
                              续订
                            </Button>
                          )}

                          {subscription.autoRenew && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setShowCancelDialog(subscription.id)}
                            >
                              取消自动续订
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewAvatar(subscription.avatarId)}
                          >
                            查看 Avatar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push('/store')}>
            浏览更多 Avatar
          </Button>
          <Button variant="outline" onClick={() => router.push('/settings/subscription')}>
            管理账单设置
          </Button>
        </div>

        {/* Cancel Confirmation Dialog */}
        {showCancelDialog && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onClick={() => setShowCancelDialog(null)}
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
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-md)',
                }}
              >
                取消自动续订
              </h3>
              <p
                style={{
                  fontSize: 'var(--font-size-body)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-lg)',
                  lineHeight: '1.6',
                }}
              >
                取消后，你的订阅将在当前周期结束时到期。在此之前，你仍可以正常使用该 Avatar 的所有功能。
              </p>
              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowCancelDialog(null)}>
                  返回
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleCancelSubscription(showCancelDialog)}
                  style={{
                    color: 'var(--color-error)',
                    borderColor: 'var(--color-error)',
                  }}
                >
                  确认取消
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
