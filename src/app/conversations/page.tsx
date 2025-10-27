'use client';

import { useState, useRef, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MessageBubble, MessageData } from '@/components/features/MessageBubble';
import { MultimodalInput } from '@/components/ui/MultimodalInput';
import { TypingIndicator, EmptyState, SkeletonMessage } from '@/components/ui/LoadingStates';
import { DateDivider } from '@/components/ui/DateDivider';
import { mockConversations } from '@/lib/mock/data';
import { formatDate } from '@/lib/utils';
import { groupMessagesByDate, formatMessageTime } from '@/lib/utils/dateHelpers';
import { HapticFeedback } from '@/lib/utils/haptics';
import { showToast } from '@/components/ui/Toast';
import { chatService } from '@/lib/services/chatService';

export default function ConversationsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const conversations = mockConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [selectedConv, setSelectedConv] = useState(conversations[0]);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock initial messages
  useEffect(() => {
    if (selectedConv) {
      setIsLoading(true);
      // Simulate loading messages
      setTimeout(() => {
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);
        const twentyMinutesAgo = new Date(now.getTime() - 20 * 60 * 1000);

        setMessages([
          {
            id: '1',
            sender: 'user',
            type: 'text',
            content: selectedConv.lastMessage,
            timestamp: twoHoursAgo.toISOString(),
          },
          {
            id: '2',
            sender: 'avatar',
            type: 'text',
            content: '我已经收到你的消息,正在处理中...',
            timestamp: oneHourAgo.toISOString(),
            avatarInfo: {
              name: selectedConv.title,
              role: 'Forge',
            },
          },
          {
            id: '3',
            sender: 'avatar',
            type: 'analysis',
            content: '我已经完成了代码分析,以下是详细报告:',
            timestamp: thirtyMinutesAgo.toISOString(),
            avatarInfo: {
              name: selectedConv.title,
              role: 'Forge',
            },
            metadata: {
              fileAnalysis: {
                fileName: 'payment.ts',
                fileType: 'TypeScript',
                size: 2048,
                language: 'TypeScript',
                linesOfCode: 150,
                analysis: {
                  summary: '这是一个支付处理模块,包含Stripe API集成。代码结构清晰,但存在一些安全隐患需要处理。',
                  complexity: 'medium',
                  quality: 85,
                  issues: [
                    {
                      type: 'error',
                      message: 'API密钥不应该硬编码在代码中',
                      line: 15,
                    },
                    {
                      type: 'warning',
                      message: '缺少错误处理逻辑',
                      line: 45,
                    },
                  ],
                  suggestions: [
                    '将API密钥移到环境变量中',
                    '添加更完善的错误处理和日志记录',
                    '考虑添加支付重试机制',
                  ],
                  dependencies: ['stripe', 'axios', 'dotenv'],
                  exports: ['processPayment', 'refundPayment', 'getPaymentStatus'],
                },
                createdAt: new Date().toISOString(),
              },
            },
          },
          {
            id: '4',
            sender: 'avatar',
            type: 'code',
            content: `// 建议的改进代码
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function processPayment(amount: number, currency: string) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Payment error:', error);
    throw new Error('支付处理失败');
  }
}`,
            timestamp: twentyMinutesAgo.toISOString(),
            avatarInfo: {
              name: selectedConv.title,
              role: 'Forge',
            },
            metadata: {
              language: 'typescript',
            },
          },
        ]);
        setIsLoading(false);
      }, 800);
    }
  }, [selectedConv]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    const newMessage: MessageData = {
      id: Date.now().toString(),
      sender: 'user',
      type: attachments && attachments.length > 0 ? 'file' : 'text',
      content,
      timestamp: new Date().toISOString(),
      attachments: attachments?.map(f => f.name),
    };

    setMessages(prev => [...prev, newMessage]);
    HapticFeedback.light();

    // 显示正在输入
    setIsTyping(true);

    try {
      // 准备对话历史（最近10条消息）
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }));

      // 添加系统提示
      const systemMessage = {
        role: 'system' as const,
        content: `你是 ${selectedConv?.title || 'Avatar'}, 一个专业的 AI 助手。请用中文回答用户的问题。`,
      };

      // 调用 GPT API（流式响应）
      let fullResponse = '';
      const responseId = (Date.now() + 1).toString();

      // 创建临时消息占位
      const tempMessage: MessageData = {
        id: responseId,
        sender: 'avatar',
        type: 'text',
        content: '',
        timestamp: new Date().toISOString(),
        avatarInfo: {
          name: selectedConv?.title || 'Avatar',
          role: 'Forge',
        },
      };

      setMessages(prev => [...prev, tempMessage]);
      setIsTyping(false);

      // 流式接收响应
      for await (const chunk of chatService.sendMessageStream([
        systemMessage,
        ...conversationHistory,
        { role: 'user', content },
      ])) {
        fullResponse += chunk;

        // 实时更新消息内容
        setMessages(prev =>
          prev.map(msg =>
            msg.id === responseId
              ? { ...msg, content: fullResponse }
              : msg
          )
        );
      }

      showToast.success('消息已发送');
      HapticFeedback.success();
    } catch (error: any) {
      console.error('Send message error:', error);
      setIsTyping(false);

      // 显示错误消息
      const errorMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        sender: 'avatar',
        type: 'text',
        content: `抱歉，发生了错误: ${error.message}。请检查你的 API 配置。`,
        timestamp: new Date().toISOString(),
        avatarInfo: {
          name: selectedConv?.title || 'Avatar',
          role: 'Forge',
        },
        metadata: {
          type: 'error',
        },
      };

      setMessages(prev => [...prev, errorMessage]);
      showToast.error('消息发送失败');
      HapticFeedback.error();
    }
  };

  const handleReact = (messageId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          const reactions = msg.reactions || [];
          const existing = reactions.find(r => r.emoji === emoji);
          if (existing) {
            existing.count++;
          } else {
            reactions.push({ emoji, count: 1, users: ['You'] });
          }
          return { ...msg, reactions };
        }
        return msg;
      })
    );
    showToast.info(`已添加 ${emoji} 反应`);
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)] md:h-[calc(100vh-4rem)] h-[calc(100vh-8rem)]">
        {/* Conversation List - Hidden on mobile when conversation is selected */}
        <div
          className={`w-full md:w-80 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}
          style={{
            borderRight: '1px solid var(--color-border)',
          }}
        >
          <div
            className="p-4"
            style={{
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <h1
              style={{
                fontSize: 'var(--font-size-h2)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              对话
            </h1>
            <Input
              placeholder="搜索对话..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => {
              const isActive = selectedConv?.id === conv.id;
              return (
                <button
                  key={conv.id}
                  onClick={() => setSelectedConv(conv)}
                  className="w-full p-4 text-left transition-all"
                  style={{
                    borderBottom: '1px solid var(--color-border)',
                    backgroundColor: isActive ? 'var(--color-bg-elevated)' : 'transparent',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={typeof conv.avatar === 'string' && conv.avatar.startsWith('http') ? conv.avatar : undefined}
                      name={conv.title}
                      size="md"
                      status={conv.type === 'avatar' ? 'online' : undefined}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                          className="truncate"
                        >
                          {conv.title}
                        </h3>
                        {conv.isPinned && (
                          <span style={{ fontSize: '14px' }}>📌</span>
                        )}
                      </div>
                      <p
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                        }}
                        className="truncate mb-1"
                      >
                        {conv.lastMessage}
                      </p>
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {formatDate(conv.lastMessageTime)}
                        </span>
                        {conv.unreadCount > 0 && (
                          <Badge variant="error" className="ml-2">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Conversation Detail - Full width on mobile when selected */}
        <div className={`flex-1 flex flex-col ${selectedConv ? 'flex' : 'hidden md:flex'}`}>
          {selectedConv ? (
            <>
              {/* Header */}
              <div
                className="p-4"
                style={{
                  borderBottom: '1px solid var(--color-border)',
                }}
              >
                <div className="flex items-center gap-3">
                  {/* Back button - Only on mobile */}
                  <button
                    onClick={() => setSelectedConv(null as any)}
                    className="md:hidden p-2 rounded-lg transition-all"
                    style={{
                      color: 'var(--color-text-secondary)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                    aria-label="Back to conversations"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <Avatar
                    src={typeof selectedConv.avatar === 'string' && selectedConv.avatar.startsWith('http') ? selectedConv.avatar : undefined}
                    name={selectedConv.title}
                    size="md"
                    status={selectedConv.type === 'avatar' ? 'online' : undefined}
                  />
                  <div className="flex-1">
                    <h2
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {selectedConv.title}
                    </h2>
                    <p
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {selectedConv.type === 'avatar' ? '在线' : `${selectedConv.participants.length} 位成员`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="space-y-4 max-w-3xl mx-auto">
                  {isLoading ? (
                    // Loading skeleton
                    <>
                      <SkeletonMessage />
                      <SkeletonMessage isUser />
                      <SkeletonMessage />
                    </>
                  ) : messages.length === 0 ? (
                    // Empty state
                    <EmptyState
                      icon="💬"
                      title="开始对话"
                      description="向 Avatar 发送消息开始协作"
                    />
                  ) : (
                    // Messages with date grouping
                    <>
                      {groupMessagesByDate(messages).map((group, groupIndex) => (
                        <div key={`group-${groupIndex}`}>
                          {/* Date divider */}
                          <DateDivider date={group.date} />

                          {/* Messages in this date group */}
                          {group.messages.map((message) => (
                            <MessageBubble
                              key={message.id}
                              message={{
                                ...message,
                                timestamp: formatMessageTime(message.timestamp),
                              }}
                              onReact={handleReact}
                              onReply={(id) => {
                                showToast.info('回复功能开发中');
                              }}
                            />
                          ))}
                        </div>
                      ))}

                      {/* Typing Indicator */}
                      {isTyping && (
                        <TypingIndicator name={selectedConv?.title || 'Avatar'} />
                      )}

                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>
              </div>

              {/* Input */}
              <div
                className="p-4"
                style={{
                  borderTop: '1px solid var(--color-border)',
                }}
              >
                <MultimodalInput
                  onSend={handleSendMessage}
                  placeholder={`与 ${selectedConv.title} 对话...`}
                  disabled={isTyping}
                />
              </div>
            </>
          ) : (
            <div
              className="flex-1 flex items-center justify-center"
              style={{
                color: 'var(--color-text-muted)',
              }}
            >
              选择一个对话开始聊天
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
