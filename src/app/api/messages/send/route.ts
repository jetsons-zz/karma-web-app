import { NextRequest, NextResponse } from 'next/server';
import { sendMessage } from '@/lib/mock/messageStore';

export const runtime = 'nodejs';

interface SendMessageRequest {
  conversationId: string;
  senderId: string;
  senderType: 'human' | 'avatar' | 'system';
  content: string;
  type?: 'text' | 'image' | 'file' | 'code' | 'system';
  replyTo?: string;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  metadata?: Record<string, any>;
}

/**
 * POST /api/messages/send
 * 发送消息
 */
export async function POST(req: NextRequest) {
  try {
    const body: SendMessageRequest = await req.json();

    // Validate required fields
    if (!body.conversationId || !body.senderId || !body.content) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // Send message
    const message = sendMessage({
      conversationId: body.conversationId,
      senderId: body.senderId,
      senderType: body.senderType || 'human',
      content: body.content,
      type: body.type || 'text',
      replyTo: body.replyTo,
      attachments: body.attachments,
      metadata: body.metadata,
    });

    // Simulate a small delay for realism
    await new Promise((resolve) => setTimeout(resolve, 200));

    return NextResponse.json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: '发送消息失败' },
      { status: 500 }
    );
  }
}
