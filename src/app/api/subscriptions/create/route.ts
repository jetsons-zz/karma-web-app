import { NextRequest, NextResponse } from 'next/server';
import { createSubscription } from '@/lib/mock/subscriptionStore';

export const runtime = 'nodejs';

interface CreateSubscriptionRequest {
  avatarId: string;
  avatarName: string;
  plan: 'monthly' | 'yearly';
  price: number;
  paymentMethod: 'card' | 'alipay' | 'wechat';
}

/**
 * POST /api/subscriptions/create
 * 创建新订阅
 */
export async function POST(req: NextRequest) {
  try {
    const body: CreateSubscriptionRequest = await req.json();

    // 验证必填字段
    if (!body.avatarId || !body.avatarName || !body.plan || !body.price) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 计算订阅开始和结束时间
    const startDate = new Date();
    const endDate = new Date(startDate);

    if (body.plan === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    // 使用 subscriptionStore 创建并持久化
    const newSubscription = createSubscription({
      avatarId: body.avatarId,
      avatarName: body.avatarName,
      plan: body.plan,
      price: body.price,
      status: 'trial', // 7天试用期
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      autoRenew: true,
      paymentMethod: body.paymentMethod,
    });

    // 模拟支付处理延迟
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // 激活订阅
    const activatedSubscription = {
      ...newSubscription,
      status: 'active' as const,
    };

    return NextResponse.json({
      success: true,
      subscription: activatedSubscription,
      message: `订阅 ${body.avatarName} 成功！`,
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    return NextResponse.json(
      { error: '订阅失败，请重试' },
      { status: 500 }
    );
  }
}
