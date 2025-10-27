import { NextRequest, NextResponse } from 'next/server';
import { createAvatar } from '@/lib/mock/avatarStore';

export const runtime = 'nodejs';

interface CreateAvatarRequest {
  role: string;
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

/**
 * POST /api/avatars/create
 * 创建新的 Avatar 分身
 */
export async function POST(req: NextRequest) {
  try {
    const body: CreateAvatarRequest = await req.json();

    // 验证必填字段
    if (!body.role || !body.name || !body.description || !body.skills || body.skills.length === 0) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 使用 avatarStore 创建并持久化
    const newAvatar = createAvatar({
      name: body.name,
      role: body.role,
      status: 'idle' as const,
      avatar: '', // createAvatar will generate this
      description: body.description,
      skills: body.skills,
      abilities: body.abilities,
      budget: body.budget,
      isPublic: body.isPublic,
      rating: 5.0,
      reviewCount: 0,
      performance: {
        totalTasks: 0,
        completedTasks: 0,
        successRate: 0,
        averageTime: 0,
      },
      earnings: {
        total: 0,
        today: 0,
        thisWeek: 0,
        thisMonth: 0,
        trend: [],
      },
    });

    // 模拟处理延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      avatar: newAvatar,
      message: `分身 ${body.name} 创建成功！`,
    });
  } catch (error) {
    console.error('Create avatar error:', error);
    return NextResponse.json(
      { error: '创建分身失败，请重试' },
      { status: 500 }
    );
  }
}
