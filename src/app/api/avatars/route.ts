import { NextResponse } from 'next/server';
import { getAllAvatars } from '@/lib/mock/avatarStore';

export const runtime = 'nodejs';

/**
 * GET /api/avatars
 * 获取所有 Avatar 分身列表
 */
export async function GET() {
  try {
    const avatars = getAllAvatars();

    return NextResponse.json({
      success: true,
      avatars,
      total: avatars.length,
    });
  } catch (error) {
    console.error('Get avatars error:', error);
    return NextResponse.json(
      { error: '获取分身列表失败' },
      { status: 500 }
    );
  }
}
