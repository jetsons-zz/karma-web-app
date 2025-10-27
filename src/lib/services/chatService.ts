/**
 * 聊天服务 - 客户端
 * 处理与后端 API 的通信
 */

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  apiKey?: string; // 可选：用户自己的 API key
}

export class ChatService {
  private baseURL: string;

  constructor(baseURL: string = '/api') {
    this.baseURL = baseURL;
  }

  /**
   * 发送聊天消息（非流式）
   */
  async sendMessage(
    messages: Message[],
    options: ChatOptions = {}
  ): Promise<string> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // 如果用户提供了自己的 API key
      if (options.apiKey) {
        headers['x-openai-key'] = options.apiKey;
      }

      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages,
          stream: false,
          model: options.model,
          temperature: options.temperature,
          max_tokens: options.max_tokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const data = await response.json();
      return data.content;
    } catch (error: any) {
      console.error('Chat service error:', error);
      throw new Error(error.message || 'Failed to send message');
    }
  }

  /**
   * 发送聊天消息（流式）
   */
  async *sendMessageStream(
    messages: Message[],
    options: ChatOptions = {}
  ): AsyncGenerator<string, void, unknown> {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (options.apiKey) {
        headers['x-openai-key'] = options.apiKey;
      }

      const response = await fetch(`${this.baseURL}/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages,
          stream: true,
          model: options.model,
          temperature: options.temperature,
          max_tokens: options.max_tokens,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const json = JSON.parse(trimmed.slice(6));
            if (json.content) {
              yield json.content;
            }
          } catch (e) {
            console.warn('Failed to parse SSE line:', trimmed);
          }
        }
      }
    } catch (error: any) {
      console.error('Chat stream error:', error);
      throw error;
    }
  }
}

// 导出单例实例
export const chatService = new ChatService();
