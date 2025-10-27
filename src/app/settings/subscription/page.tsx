'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Subscription {
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  billing: 'monthly' | 'annually';
  amount: number;
  startDate: string;
  nextBillingDate?: string;
  cancelledAt?: string;
}

export default function SubscriptionSettingsPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription>({
    plan: 'pro',
    status: 'active',
    billing: 'monthly',
    amount: 29,
    startDate: '2025-10-01',
    nextBillingDate: '2025-11-01',
  });

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: [
        '1 个 Avatar',
        '基础任务管理',
        '社区支持',
        '每月 100 条 AI 消息',
      ],
    },
    {
      name: 'Pro',
      price: 29,
      features: [
        '5 个 Avatar',
        '高级任务管理',
        '优先支持',
        '无限 AI 消息',
        'GitHub / Jira 集成',
        '高级分析',
      ],
      popular: true,
    },
    {
      name: 'Team',
      price: 99,
      features: [
        '无限 Avatar',
        '团队协作',
        '专属支持',
        '无限 AI 消息',
        '所有集成',
        '高级分析',
        '自定义工作流',
        'SSO 登录',
      ],
    },
    {
      name: 'Enterprise',
      price: null,
      features: [
        '所有 Team 功能',
        '私有部署',
        '专属客户经理',
        'SLA 保证',
        '自定义开发',
        '审计日志',
      ],
      contact: true,
    },
  ];

  const [billingHistory] = useState([
    { date: '2025-10-01', amount: 29, status: 'paid', invoice: '#INV-001' },
    { date: '2025-09-01', amount: 29, status: 'paid', invoice: '#INV-002' },
    { date: '2025-08-01', amount: 29, status: 'paid', invoice: '#INV-003' },
  ]);

  const handleCancelSubscription = () => {
    if (confirm('确定要取消订阅吗？你可以继续使用到当前计费周期结束。')) {
      setSubscription({
        ...subscription,
        status: 'cancelled',
        cancelledAt: new Date().toISOString().split('T')[0],
      });
    }
  };

  const handleReactivate = () => {
    setSubscription({
      ...subscription,
      status: 'active',
      cancelledAt: undefined,
    });
  };

  const handleUpgrade = (plan: string) => {
    console.log('Upgrading to:', plan);
    // Navigate to checkout or show upgrade modal
  };

  const getPlanBadgeVariant = (planName: string) => {
    const current = subscription.plan.toLowerCase();
    if (planName.toLowerCase() === current) return 'primary';
    return 'outline';
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1200px', margin: '0 auto' }}>
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
            订阅管理
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            管理你的订阅计划和账单信息
          </p>
        </div>

        <div className="space-y-6">
          {/* Current Subscription */}
          <Card>
            <CardHeader>
              <CardTitle>当前订阅</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      style={{
                        fontSize: 'var(--font-size-h3)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} 计划
                    </h3>
                    <Badge variant={subscription.status === 'active' ? 'success' : 'warning'}>
                      {subscription.status === 'active' ? '活跃' : '已取消'}
                    </Badge>
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--font-size-h2)',
                      fontWeight: 'var(--font-weight-bold)',
                      color: 'var(--color-brand-primary)',
                      marginBottom: 'var(--spacing-sm)',
                    }}
                  >
                    ${subscription.amount}
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-normal)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      /{subscription.billing === 'monthly' ? '月' : '年'}
                    </span>
                  </p>
                  <div
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                    }}
                  >
                    <p>开始日期: {subscription.startDate}</p>
                    {subscription.status === 'active' && subscription.nextBillingDate && (
                      <p>下次扣费: {subscription.nextBillingDate}</p>
                    )}
                    {subscription.cancelledAt && (
                      <p>取消日期: {subscription.cancelledAt}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {subscription.status === 'active' ? (
                    <Button variant="outline" onClick={handleCancelSubscription}>
                      取消订阅
                    </Button>
                  ) : (
                    <Button onClick={handleReactivate}>重新激活</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Plans */}
          <div>
            <h2
              style={{
                fontSize: 'var(--font-size-h2)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              选择计划
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  style={{
                    position: 'relative',
                    border:
                      plan.name.toLowerCase() === subscription.plan
                        ? '2px solid var(--color-brand-primary)'
                        : undefined,
                  }}
                >
                  {plan.popular && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '-12px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'var(--color-brand-primary)',
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '11px',
                        fontWeight: 'var(--font-weight-semibold)',
                      }}
                    >
                      最受欢迎
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <div
                      style={{
                        fontSize: 'var(--font-size-h2)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                        marginTop: 'var(--spacing-sm)',
                      }}
                    >
                      {plan.price !== null ? (
                        <>
                          ${plan.price}
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-normal)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            /月
                          </span>
                        </>
                      ) : (
                        '联系我们'
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-2"
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          <svg
                            className="h-4 w-4 flex-shrink-0 mt-0.5"
                            style={{ color: 'var(--color-brand-primary)' }}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    {plan.name.toLowerCase() === subscription.plan ? (
                      <Button variant="outline" fullWidth disabled>
                        当前计划
                      </Button>
                    ) : plan.contact ? (
                      <Button variant="outline" fullWidth>
                        联系销售
                      </Button>
                    ) : (
                      <Button
                        fullWidth
                        variant={plan.popular ? 'primary' : 'outline'}
                        onClick={() => handleUpgrade(plan.name)}
                      >
                        {plan.price === 0 ? '降级' : '升级'}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Billing History */}
          <Card>
            <CardHeader>
              <CardTitle>账单历史</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {billingHistory.map((bill, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-4 rounded-[12px]"
                    style={{ border: '1px solid var(--color-border)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {bill.date}
                        </div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {bill.invoice}
                        </div>
                      </div>
                      <Badge variant="success" size="sm">
                        {bill.status === 'paid' ? '已支付' : '待支付'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        style={{
                          fontSize: 'var(--font-size-body)',
                          fontWeight: 'var(--font-weight-semibold)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        ${bill.amount}
                      </div>
                      <Button variant="outline" size="sm">
                        下载发票
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>支付方式</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-[12px]" style={{ border: '1px solid var(--color-border)' }}>
                <div className="flex items-center gap-4">
                  <div
                    style={{
                      width: '48px',
                      height: '32px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--color-bg-secondary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 'var(--font-size-caption)',
                    }}
                  >
                    💳
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      Visa •••• 4242
                    </div>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      过期日期: 12/2026
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  更新
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
