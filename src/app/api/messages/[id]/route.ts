import { NextRequest, NextResponse } from 'next/server';
import {
  getConversationById,
  getMessagesByConversationId,
  markConversationAsRead,
} from '@/lib/mock/messageStore';

export const runtime = 'nodejs';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/messages/:id
 * 获取对话详情和消息列表
 */
export async function GET(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params;
    const conversationId = params.id;

    const conversation = getConversationById(conversationId);

    if (!conversation) {
      return NextResponse.json(
        { error: '对话不存在' },
        { status: 404 }
      );
    }

    const messages = getMessagesByConversationId(conversationId);

    return NextResponse.json({
      success: true,
      conversation,
      messages,
    });
  } catch (error) {
    console.error('Get conversation error:', error);
    return NextResponse.json(
      { error: '获取对话失败' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/messages/:id
 * 更新对话（标记已读、置顶、静音等）
 */
export async function PUT(
  req: NextRequest,
  context: RouteParams
) {
  try {
    const params = await context.params;
    const conversationId = params.id;
    const body = await req.json();

    if (body.action === 'mark_read') {
      markConversationAsRead(conversationId);

      return NextResponse.json({
        success: true,
        message: '已标记为已读',
      });
    }

    return NextResponse.json(
      { error: '未知操作' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Update conversation error:', error);
    return NextResponse.json(
      { error: '更新对话失败' },
      { status: 500 }
    );
  }
}
