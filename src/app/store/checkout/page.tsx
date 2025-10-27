'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { mockStoreAvatars } from '@/lib/mock/data';

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const avatarId = searchParams.get('avatar');
  const plan = searchParams.get('plan') as 'monthly' | 'yearly' || 'monthly';

  const avatar = avatarId ? mockStoreAvatars.find(a => a.id === avatarId) : null;
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'alipay' | 'wechat'>('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    email: '',
    acceptTerms: false,
  });

  if (!avatar) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">找不到订单信息</h2>
            <p className="text-neutral-600 mb-4">请从商店选择要订阅的 Avatar</p>
            <Button onClick={() => router.push('/store')}>返回商店</Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  const monthlyPrice = avatar.price || 49;
  const yearlyPrice = Math.round(monthlyPrice * 12 * 0.8);
  const price = plan === 'yearly' ? yearlyPrice : monthlyPrice;
  const yearlyMonthlyPrice = Math.round(yearlyPrice / 12);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      // Process payment
      setStep(3);
    }
  };

  if (step === 3) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Card style={{ maxWidth: '500px', width: '100%' }}>
            <CardContent>
              <div className="text-center py-8">
                <div
                  className="mx-auto mb-6 flex items-center justify-center rounded-full"
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: 'var(--color-accent-success)20',
                  }}
                >
                  <svg
                    className="h-10 w-10"
                    style={{ color: 'var(--color-accent-success)' }}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2
                  style={{
                    fontSize: 'var(--font-size-h1)',
                    fontWeight: 'var(--font-weight-bold)',
                    color: 'var(--color-text-primary)',
                    marginBottom: 'var(--spacing-sm)',
                  }}
                >
                  订阅成功！
                </h2>
                <p
                  style={{
                    fontSize: 'var(--font-size-body)',
                    color: 'var(--color-text-secondary)',
                    marginBottom: 'var(--spacing-xl)',
                  }}
                >
                  {avatar.name} 已加入你的团队，现在可以开始使用了
                </p>
                <div className="flex gap-3 justify-center">
                  <Button variant="outline" onClick={() => router.push('/store')}>
                    继续浏览
                  </Button>
                  <Button onClick={() => router.push('/avatars')}>
                    查看我的团队
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Back Button */}
        <button
          onClick={() => step === 1 ? router.back() : setStep(1)}
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
          {step === 1 ? '返回' : '上一步'}
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
            {step === 1 ? '确认订单' : '支付信息'}
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            {step === 1 ? '请确认你的订单信息' : '请输入支付信息以完成订阅'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit}>
              {step === 1 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>订单详情</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Avatar Info */}
                      <div
                        className="p-4 rounded-[16px] flex items-center gap-4"
                        style={{
                          backgroundColor: 'var(--color-bg-elevated)',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <Avatar src={avatar.avatar} name={avatar.name} size="lg" showRole />
                        <div className="flex-1">
                          <h3
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-bold)',
                              color: 'var(--color-text-primary)',
                              marginBottom: 'var(--spacing-xs)',
                            }}
                          >
                            {avatar.name}
                          </h3>
                          <p
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {avatar.description}
                          </p>
                        </div>
                      </div>

                      {/* Plan Selection */}
                      <div>
                        <label
                          style={{
                            display: 'block',
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                            marginBottom: 'var(--spacing-sm)',
                          }}
                        >
                          订阅计划
                        </label>
                        <div
                          className="p-4 rounded-[12px]"
                          style={{
                            border: '2px solid var(--color-brand-primary)',
                            backgroundColor: 'var(--color-brand-primary)10',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div
                                style={{
                                  fontSize: 'var(--font-size-body)',
                                  fontWeight: 'var(--font-weight-bold)',
                                  color: 'var(--color-text-primary)',
                                  marginBottom: 'var(--spacing-xxs)',
                                }}
                              >
                                {plan === 'yearly' ? '年度订阅' : '月度订阅'}
                              </div>
                              <div
                                style={{
                                  fontSize: 'var(--font-size-caption)',
                                  color: 'var(--color-text-secondary)',
                                }}
                              >
                                {plan === 'yearly'
                                  ? `每月 $${yearlyMonthlyPrice}，年付 $${yearlyPrice}`
                                  : `每月 $${monthlyPrice}`}
                              </div>
                            </div>
                            {plan === 'yearly' && (
                              <Badge variant="success">节省 20%</Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Email */}
                      <div>
                        <Input
                          label="电子邮件"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          required
                        />
                        <p
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                            marginTop: 'var(--spacing-xs)',
                          }}
                        >
                          我们会将收据发送到此邮箱
                        </p>
                      </div>

                      {/* Terms */}
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={formData.acceptTerms}
                          onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })}
                          required
                          style={{
                            width: '18px',
                            height: '18px',
                            marginTop: '2px',
                          }}
                        />
                        <label
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-secondary)',
                            lineHeight: '1.5',
                          }}
                        >
                          我已阅读并同意{' '}
                          <a
                            href="#"
                            style={{
                              color: 'var(--color-brand-primary)',
                              textDecoration: 'underline',
                            }}
                          >
                            服务条款
                          </a>{' '}
                          和{' '}
                          <a
                            href="#"
                            style={{
                              color: 'var(--color-brand-primary)',
                              textDecoration: 'underline',
                            }}
                          >
                            隐私政策
                          </a>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>支付方式</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Payment Method Selection */}
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('card')}
                          className="p-4 rounded-[12px] transition-all"
                          style={{
                            border: `2px solid ${paymentMethod === 'card' ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                            backgroundColor: paymentMethod === 'card' ? 'var(--color-brand-primary)10' : 'transparent',
                          }}
                        >
                          <svg className="h-8 w-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                            />
                          </svg>
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            信用卡
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('alipay')}
                          className="p-4 rounded-[12px] transition-all"
                          style={{
                            border: `2px solid ${paymentMethod === 'alipay' ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                            backgroundColor: paymentMethod === 'alipay' ? 'var(--color-brand-primary)10' : 'transparent',
                          }}
                        >
                          <div
                            className="h-8 w-8 mx-auto mb-2 flex items-center justify-center"
                            style={{
                              fontSize: '24px',
                            }}
                          >
                            💳
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            支付宝
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentMethod('wechat')}
                          className="p-4 rounded-[12px] transition-all"
                          style={{
                            border: `2px solid ${paymentMethod === 'wechat' ? 'var(--color-brand-primary)' : 'var(--color-border)'}`,
                            backgroundColor: paymentMethod === 'wechat' ? 'var(--color-brand-primary)10' : 'transparent',
                          }}
                        >
                          <div
                            className="h-8 w-8 mx-auto mb-2 flex items-center justify-center"
                            style={{
                              fontSize: '24px',
                            }}
                          >
                            💬
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            微信支付
                          </div>
                        </button>
                      </div>

                      {/* Card Payment Form */}
                      {paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <Input
                            label="卡号"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                            required
                          />
                          <Input
                            label="持卡人姓名"
                            placeholder="ZHANG SAN"
                            value={formData.cardName}
                            onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                            required
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="有效期"
                              placeholder="MM/YY"
                              value={formData.expiryDate}
                              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                              required
                            />
                            <Input
                              label="CVV"
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                              required
                            />
                          </div>
                        </div>
                      )}

                      {(paymentMethod === 'alipay' || paymentMethod === 'wechat') && (
                        <div
                          className="text-center py-8"
                          style={{
                            backgroundColor: 'var(--color-bg-elevated)',
                            borderRadius: 'var(--radius-md)',
                          }}
                        >
                          <p
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            点击"完成支付"将跳转到{paymentMethod === 'alipay' ? '支付宝' : '微信'}支付页面
                          </p>
                        </div>
                      )}

                      {/* Security Notice */}
                      <div
                        className="flex items-start gap-3 p-4 rounded-[12px]"
                        style={{
                          backgroundColor: 'var(--color-bg-elevated)',
                        }}
                      >
                        <svg
                          className="h-5 w-5 flex-shrink-0"
                          style={{ color: 'var(--color-accent-success)' }}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
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
                            安全加密支付
                          </div>
                          <p
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                              lineHeight: '1.5',
                            }}
                          >
                            你的支付信息经过加密处理，我们不会存储你的信用卡信息
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="mt-6">
                <Button
                  type="submit"
                  size="lg"
                  fullWidth
                  disabled={step === 1 && !formData.acceptTerms}
                >
                  {step === 1 ? '继续支付' : '完成支付'}
                </Button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <Card status="active">
              <CardHeader>
                <CardTitle>订单摘要</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {plan === 'yearly' ? '年度订阅' : '月度订阅'}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      ${price}
                    </span>
                  </div>

                  {plan === 'yearly' && (
                    <div className="flex items-center justify-between text-success pb-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-accent-success)',
                        }}
                      >
                        年付优惠 (-20%)
                      </span>
                      <span
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-accent-success)',
                        }}
                      >
                        -${monthlyPrice * 12 - yearlyPrice}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      今日支付
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-h2)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-brand-primary)',
                      }}
                    >
                      ${price}
                    </span>
                  </div>

                  <div
                    className="pt-4 space-y-2"
                    style={{
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <svg
                        className="h-4 w-4 flex-shrink-0"
                        style={{ color: 'var(--color-accent-success)', marginTop: '2px' }}
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
                        7 天免费试用
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg
                        className="h-4 w-4 flex-shrink-0"
                        style={{ color: 'var(--color-accent-success)', marginTop: '2px' }}
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
                    <div className="flex items-start gap-2">
                      <svg
                        className="h-4 w-4 flex-shrink-0"
                        style={{ color: 'var(--color-accent-success)', marginTop: '2px' }}
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
                        无任务量限制
                      </span>
                    </div>
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-neutral-600">加载中...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
