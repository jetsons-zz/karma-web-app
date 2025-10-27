import { NextRequest, NextResponse } from 'next/server';
import { OpenAIService, ChatMessage } from '@/lib/services/openai';

export const runtime = 'edge'; // 使用 Edge Runtime 提高性能

/**
 * POST /api/chat
 * 处理聊天请求
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, stream = false, model, temperature, max_tokens } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      );
    }

    // 获取 API key（优先从请求头，其次从环境变量）
    const apiKey = request.headers.get('x-openai-key') || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 401 }
      );
    }

    const openai = new OpenAIService(apiKey);

    // 流式响应
    if (stream) {
      const encoder = new TextEncoder();
      const customReadable = new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of openai.chatCompletionStream(messages, {
              model,
              temperature,
              max_tokens,
            })) {
              controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: chunk })}\n\n`));
            }
            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
            controller.close();
          } catch (error) {
            console.error('Stream error:', error);
            controller.error(error);
          }
        },
      });

      return new Response(customReadable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // 非流式响应
    const response = await openai.chatCompletion(messages, {
      model,
      temperature,
      max_tokens,
    });

    return NextResponse.json({ content: response });
  } catch (error: any) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
