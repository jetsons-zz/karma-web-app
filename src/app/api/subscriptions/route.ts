import { NextResponse } from 'next/server';
import { getAllSubscriptions } from '@/lib/mock/subscriptionStore';

export const runtime = 'nodejs';

/**
 * GET /api/subscriptions
 * 获取所有订阅列表
 */
export async function GET() {
  try {
    const subscriptions = getAllSubscriptions();

    return NextResponse.json({
      success: true,
      subscriptions,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    return NextResponse.json(
      { error: '获取订阅列表失败' },
      { status: 500 }
    );
  }
}
