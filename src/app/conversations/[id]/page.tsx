'use client';

import { use, useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { MessageBubble, MessageData } from '@/components/features/MessageBubble';
import { MultimodalInput } from '@/components/ui/MultimodalInput';
import { TypingIndicator, EmptyState, SkeletonMessage } from '@/components/ui/LoadingStates';
import { DateDivider } from '@/components/ui/DateDivider';
import { mockConversations } from '@/lib/mock/data';
import { groupMessagesByDate, formatMessageTime } from '@/lib/utils/dateHelpers';
import { HapticFeedback } from '@/lib/utils/haptics';
import { showToast } from '@/components/ui/Toast';
import { chatService } from '@/lib/services/chatService';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ConversationDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find conversation by ID
  const conversation = mockConversations.find(c => c.id === id);

  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Mock initial messages
  useEffect(() => {
    if (conversation) {
      setIsLoading(true);
      setTimeout(() => {
        const now = new Date();
        const twoHoursAgo = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);
        const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

        setMessages([
          {
            id: '1',
            sender: 'user',
            type: 'text',
            content: conversation.lastMessage,
            timestamp: twoHoursAgo.toISOString(),
          },
          {
            id: '2',
            sender: 'avatar',
            type: 'text',
            content: 'I have received your message and am processing it...',
            timestamp: oneHourAgo.toISOString(),
            avatarInfo: {
              name: conversation.title,
              role: 'Forge',
            },
          },
          {
            id: '3',
            sender: 'avatar',
            type: 'text',
            content: 'Analysis complete. Here are my findings and recommendations.',
            timestamp: thirtyMinutesAgo.toISOString(),
            avatarInfo: {
              name: conversation.title,
              role: 'Forge',
            },
          },
        ]);
        setIsLoading(false);
      }, 800);
    }
  }, [conversation]);

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
    setIsTyping(true);

    try {
      const conversationHistory = messages.slice(-10).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }));

      const systemMessage = {
        role: 'system' as const,
        content: `You are ${conversation?.title || 'Avatar'}, a professional AI assistant. Please respond in English.`,
      };

      let fullResponse = '';
      const responseId = (Date.now() + 1).toString();

      const tempMessage: MessageData = {
        id: responseId,
        sender: 'avatar',
        type: 'text',
        content: '',
        timestamp: new Date().toISOString(),
        avatarInfo: {
          name: conversation?.title || 'Avatar',
          role: 'Forge',
        },
      };

      setMessages(prev => [...prev, tempMessage]);
      setIsTyping(false);

      for await (const chunk of chatService.sendMessageStream([
        systemMessage,
        ...conversationHistory,
        { role: 'user', content },
      ])) {
        fullResponse += chunk;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === responseId ? { ...msg, content: fullResponse } : msg
          )
        );
      }

      showToast.success('Message sent');
      HapticFeedback.success();
    } catch (error: any) {
      console.error('Send message error:', error);
      setIsTyping(false);

      const errorMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        sender: 'avatar',
        type: 'text',
        content: `Sorry, an error occurred: ${error.message}. Please check your API configuration.`,
        timestamp: new Date().toISOString(),
        avatarInfo: {
          name: conversation?.title || 'Avatar',
          role: 'Forge',
        },
        metadata: {
          type: 'error',
        },
      };

      setMessages(prev => [...prev, errorMessage]);
      showToast.error('Failed to send message');
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
    showToast.info(`Added ${emoji} reaction`);
  };

  if (!conversation) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <h2
              style={{
                fontSize: 'var(--font-size-h2)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-md)',
              }}
            >
              Conversation not found
            </h2>
            <p
              style={{
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-lg)',
              }}
            >
              The conversation you are looking for does not exist
            </p>
            <Button onClick={() => router.push('/conversations')}>
              Back to Conversations
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div
          className="p-4"
          style={{
            borderBottom: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/conversations')}
              className="p-2 rounded-lg transition-all"
              style={{
                color: 'var(--color-text-secondary)',
                minHeight: '44px',
                minWidth: '44px',
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
              src={typeof conversation.avatar === 'string' && conversation.avatar.startsWith('http') ? conversation.avatar : undefined}
              name={conversation.title}
              size="md"
              status={conversation.type === 'avatar' ? 'online' : undefined}
            />
            <div className="flex-1">
              <h2
                style={{
                  fontSize: 'var(--font-size-body)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {conversation.title}
              </h2>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {conversation.type === 'avatar' ? 'Online' : `${conversation.participants.length} members`}
              </p>
            </div>

            <Button variant="secondary" size="sm">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4 max-w-3xl mx-auto">
            {isLoading ? (
              <>
                <SkeletonMessage />
                <SkeletonMessage isUser />
                <SkeletonMessage />
              </>
            ) : messages.length === 0 ? (
              <EmptyState
                icon="chat"
                title="Start Conversation"
                description="Send a message to start collaborating"
              />
            ) : (
              <>
                {groupMessagesByDate(messages).map((group, groupIndex) => (
                  <div key={`group-${groupIndex}`}>
                    <DateDivider date={group.date} />
                    {group.messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={{
                          ...message,
                          timestamp: formatMessageTime(message.timestamp),
                        }}
                        onReact={handleReact}
                        onReply={(id) => {
                          showToast.info('Reply feature in development');
                        }}
                      />
                    ))}
                  </div>
                ))}

                {isTyping && <TypingIndicator name={conversation?.title || 'Avatar'} />}
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
            placeholder={`Chat with ${conversation.title}...`}
            disabled={isTyping}
          />
        </div>
      </div>
    </MainLayout>
  );
}
