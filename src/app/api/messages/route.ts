import { NextRequest, NextResponse } from 'next/server';
import { getAllConversations, getConversationById } from '@/lib/mock/messageStore';

export const runtime = 'nodejs';

/**
 * GET /api/messages
 * 获取所有对话列表
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');  // Filter by conversation type
    const pinned = searchParams.get('pinned');  // Filter pinned conversations

    let conversations = getAllConversations();

    // Apply filters
    if (type) {
      conversations = conversations.filter(c => c.type === type);
    }

    if (pinned === 'true') {
      conversations = conversations.filter(c => c.isPinned);
    }

    // Sort by updatedAt (most recent first)
    conversations.sort((a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return NextResponse.json({
      success: true,
      conversations,
      total: conversations.length,
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    return NextResponse.json(
      { error: '获取对话列表失败' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/messages
 * 创建新对话
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validate required fields
    if (!body.type || !body.title || !body.participants || body.participants.length === 0) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // Create conversation using messageStore (to be implemented)
    // For now, return a success response
    return NextResponse.json({
      success: true,
      message: '对话创建成功',
    });
  } catch (error) {
    console.error('Create conversation error:', error);
    return NextResponse.json(
      { error: '创建对话失败' },
      { status: 500 }
    );
  }
}
