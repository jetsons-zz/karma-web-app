'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MessageBubble, MessageData } from '@/components/features/MessageBubble';
import { MultimodalInput } from '@/components/ui/MultimodalInput';
import { TypingIndicator, EmptyState, SkeletonMessage } from '@/components/ui/LoadingStates';
import { DateDivider } from '@/components/ui/DateDivider';
import { formatDate } from '@/lib/utils';
import { groupMessagesByDate, formatMessageTime } from '@/lib/utils/dateHelpers';
import { HapticFeedback } from '@/lib/utils/haptics';
import { showToast } from '@/components/ui/Toast';
import { chatService } from '@/lib/services/chatService';
import {
  getAllConversations,
  getMessagesByConversationId,
  sendMessage,
  markConversationAsRead,
  togglePinConversation,
  toggleMuteConversation,
  type Conversation,
  type Message,
  type ConversationType,
} from '@/lib/mock/messageStore';

// 对话类型图标映射
const getConversationIcon = (type: ConversationType) => {
  switch (type) {
    case 'human-to-human':
      return '👤'; // 人与人
    case 'human-to-avatar':
      return '🤖'; // 人与分身
    case 'avatar-to-avatar':
      return '🔄'; // 分身与分身
    case 'channel':
      return '💬'; // 频道
    default:
      return '💭';
  }
};

// 获取对话类型描述
const getConversationTypeLabel = (type: ConversationType) => {
  switch (type) {
    case 'human-to-human':
      return '团队成员';
    case 'human-to-avatar':
      return 'AI 分身';
    case 'avatar-to-avatar':
      return '分身协作';
    case 'channel':
      return '项目频道';
    default:
      return '';
  }
};

export default function ConversationsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]); // 正在输入的用户
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showNewChannelModal, setShowNewChannelModal] = useState(false);

  // 加载对话列表
  useEffect(() => {
    const loadConversations = () => {
      const convs = getAllConversations();
      setAllConversations(convs);
      if (!selectedConv && convs.length > 0) {
        setSelectedConv(convs[0]);
      }
    };

    loadConversations();

    // 自动刷新（模拟实时更新）
    const interval = setInterval(loadConversations, 5000);
    return () => clearInterval(interval);
  }, []);

  // 加载选中对话的消息
  useEffect(() => {
    if (selectedConv) {
      setIsLoading(true);
      // 模拟加载延迟
      setTimeout(() => {
        const msgs = getMessagesByConversationId(selectedConv.id);
        setMessages(msgs);
        setIsLoading(false);

        // 标记为已读
        if (selectedConv.unreadCount > 0) {
          markConversationAsRead(selectedConv.id);
          // 更新对话列表
          const updatedConvs = getAllConversations();
          setAllConversations(updatedConvs);
        }
      }, 300);
    }
  }, [selectedConv?.id]);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 搜索过滤
  const filteredConversations = allConversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 按类型分组对话
  const groupedConversations = {
    pinned: filteredConversations.filter(c => c.isPinned),
    channels: filteredConversations.filter(c => c.type === 'channel' && !c.isPinned),
    avatars: filteredConversations.filter(c => c.type === 'human-to-avatar' && !c.isPinned),
    humans: filteredConversations.filter(c => c.type === 'human-to-human' && !c.isPinned),
    avatarCollaboration: filteredConversations.filter(c => c.type === 'avatar-to-avatar' && !c.isPinned),
  };

  const handleSendMessage = async (content: string, attachments?: File[]) => {
    if (!selectedConv) return;

    // 发送消息到 messageStore
    const newMessage = sendMessage({
      conversationId: selectedConv.id,
      senderId: 'user-1', // 当前用户 ID
      senderType: 'human',
      content,
      type: attachments && attachments.length > 0 ? 'file' : 'text',
      attachments: attachments?.map((f, i) => ({
        id: `att-${Date.now()}-${i}`,
        name: f.name,
        type: f.type,
        size: f.size,
        url: URL.createObjectURL(f),
      })),
    });

    // 更新本地消息列表
    setMessages(prev => [...prev, newMessage]);
    HapticFeedback.light();

    // 显示正在输入
    setIsTyping(true);

    try {
      // 如果是与 AI 分身对话，调用 AI 响应
      if (selectedConv.type === 'human-to-avatar') {
        const conversationHistory = messages.slice(-10).map(msg => ({
          role: msg.senderType === 'human' ? 'user' as const : 'assistant' as const,
          content: msg.content,
        }));

        const systemMessage = {
          role: 'system' as const,
          content: `你是 ${selectedConv.title}, 一个专业的 AI 助手。请用中文回答用户的问题。`,
        };

        let fullResponse = '';
        const responseId = `msg-${Date.now()}-response`;

        // 创建临时消息
        const tempMessage = sendMessage({
          conversationId: selectedConv.id,
          senderId: selectedConv.participants.find(p => p.type === 'avatar')?.id || 'avatar-unknown',
          senderType: 'avatar',
          content: '',
          type: 'text',
        });

        setMessages(prev => [...prev, tempMessage]);
        setIsTyping(false);

        // 流式接收响应
        for await (const chunk of chatService.sendMessageStream([
          systemMessage,
          ...conversationHistory,
          { role: 'user', content },
        ])) {
          fullResponse += chunk;

          // 实时更新消息内容（在实际应用中应该更新 messageStore）
          setMessages(prev =>
            prev.map(msg =>
              msg.id === tempMessage.id
                ? { ...msg, content: fullResponse }
                : msg
            )
          );
        }

        showToast.success('消息已发送');
        HapticFeedback.success();
      } else {
        setIsTyping(false);
        showToast.success('消息已发送');
      }
    } catch (error: any) {
      console.error('Send message error:', error);
      setIsTyping(false);
      showToast.error('消息发送失败');
      HapticFeedback.error();
    }
  };

  const handleReact = (messageId: string, emoji: string) => {
    // 这里应该调用 addReactionToMessage
    showToast.info(`已添加 ${emoji} 反应`);
  };

  const handlePinConversation = (convId: string) => {
    togglePinConversation(convId);
    const updatedConvs = getAllConversations();
    setAllConversations(updatedConvs);
    HapticFeedback.light();
  };

  const handleMuteConversation = (convId: string) => {
    toggleMuteConversation(convId);
    const updatedConvs = getAllConversations();
    setAllConversations(updatedConvs);
    showToast.info('已更新通知设置');
  };

  const handleCreateChannel = () => {
    setShowNewChannelModal(true);
    // TODO: 实现创建频道的模态框
    showToast.info('创建频道功能开发中');
  };

  // 转换 Message 为 MessageData 格式
  const convertToMessageData = (msg: Message): MessageData => ({
    id: msg.id,
    sender: msg.senderType === 'human' ? 'user' : 'avatar',
    type: msg.type === 'system' ? 'text' : msg.type,
    content: msg.content,
    timestamp: msg.timestamp,
    avatarInfo: msg.senderType !== 'human' ? {
      name: selectedConv?.participants.find(p => p.id === msg.senderId)?.name || 'Avatar',
      role: selectedConv?.participants.find(p => p.id === msg.senderId)?.role || '',
    } : undefined,
    reactions: msg.reactions?.map(r => ({
      emoji: r.emoji,
      count: 1,
      users: [r.userName],
    })),
    attachments: msg.attachments?.map(a => a.name),
  });

  const renderConversationGroup = (title: string, conversations: Conversation[]) => {
    if (conversations.length === 0) return null;

    return (
      <div className="mb-4">
        <div
          className="px-4 py-2"
          style={{
            fontSize: 'var(--font-size-caption)',
            fontWeight: 'var(--font-weight-medium)',
            color: 'var(--color-text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {title}
        </div>
        {conversations.map((conv) => {
          const isActive = selectedConv?.id === conv.id;
          const icon = getConversationIcon(conv.type);

          return (
            <button
              key={conv.id}
              onClick={() => setSelectedConv(conv)}
              className="w-full p-4 text-left transition-all relative"
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
                <div className="relative">
                  <Avatar
                    src={typeof conv.avatar === 'string' && conv.avatar.startsWith('http') ? conv.avatar : undefined}
                    name={conv.title}
                    size="md"
                    status={conv.type === 'human-to-avatar' ? 'online' : undefined}
                  />
                  {/* 对话类型图标 */}
                  <div
                    className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs"
                    style={{
                      backgroundColor: 'var(--color-bg-primary)',
                      border: '2px solid var(--color-bg-primary)',
                    }}
                  >
                    {icon}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h3
                        style={{
                          fontSize: 'var(--font-size-body)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                        }}
                        className="truncate"
                      >
                        {conv.title}
                      </h3>
                      {conv.type === 'channel' && (
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {conv.participants.filter(p => p.type === 'human').length}👤
                          {conv.participants.filter(p => p.type === 'avatar').length}🤖
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {conv.isMuted && <span style={{ fontSize: '14px' }}>🔕</span>}
                      {conv.isPinned && <span style={{ fontSize: '14px' }}>📌</span>}
                    </div>
                  </div>
                  <p
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-secondary)',
                    }}
                    className="truncate mb-1"
                  >
                    {conv.lastMessage?.senderName}: {conv.lastMessage?.content}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {formatDate(conv.lastMessage?.timestamp || conv.updatedAt)}
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
    );
  };

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Conversation List */}
        <div
          className={`w-full md:w-80 flex flex-col ${selectedConv ? 'hidden md:flex' : 'flex'}`}
          style={{
            borderRight: '1px solid var(--color-border)',
          }}
        >
          {/* Header */}
          <div
            className="p-4"
            style={{
              borderBottom: '1px solid var(--color-border)',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h1
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                消息
              </h1>
              <Button size="sm" variant="ghost" onClick={handleCreateChannel}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Button>
            </div>
            <Input
              placeholder="搜索对话..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
            />
          </div>

          {/* Conversation Groups */}
          <div className="flex-1 overflow-y-auto">
            {renderConversationGroup('⭐ 置顶', groupedConversations.pinned)}
            {renderConversationGroup('💬 项目频道', groupedConversations.channels)}
            {renderConversationGroup('🤖 AI 分身', groupedConversations.avatars)}
            {renderConversationGroup('👥 团队成员', groupedConversations.humans)}
            {renderConversationGroup('🔄 分身协作', groupedConversations.avatarCollaboration)}

            {filteredConversations.length === 0 && (
              <div className="p-8 text-center">
                <p style={{ color: 'var(--color-text-muted)' }}>
                  {searchQuery ? '未找到匹配的对话' : '暂无对话'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Conversation Detail */}
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
                    onClick={() => setSelectedConv(null)}
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
                    aria-label="返回对话列表"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <Avatar
                    src={typeof selectedConv.avatar === 'string' && selectedConv.avatar.startsWith('http') ? selectedConv.avatar : undefined}
                    name={selectedConv.title}
                    size="md"
                    status={selectedConv.type === 'human-to-avatar' ? 'online' : undefined}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h2
                        style={{
                          fontSize: 'var(--font-size-body)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        {selectedConv.title}
                      </h2>
                      <span style={{ fontSize: '16px' }}>{getConversationIcon(selectedConv.type)}</span>
                    </div>
                    <p
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {getConversationTypeLabel(selectedConv.type)} • {selectedConv.participants.length} 位成员
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handlePinConversation(selectedConv.id)}
                    >
                      {selectedConv.isPinned ? '📌' : '📍'}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMuteConversation(selectedConv.id)}
                    >
                      {selectedConv.isMuted ? '🔕' : '🔔'}
                    </Button>
                  </div>
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
                      icon="💬"
                      title="开始对话"
                      description={`向 ${selectedConv.title} 发送消息开始协作`}
                    />
                  ) : (
                    <>
                      {groupMessagesByDate(messages.map(convertToMessageData)).map((group, groupIndex) => (
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
                                showToast.info('回复功能开发中');
                              }}
                            />
                          ))}
                        </div>
                      ))}

                      {/* Typing Indicators */}
                      {(isTyping || typingUsers.length > 0) && (
                        <TypingIndicator
                          name={typingUsers.join(', ') || selectedConv.title}
                        />
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
                  placeholder={`发送消息到 ${selectedConv.title}...`}
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
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-lg mb-2">选择一个对话开始聊天</p>
                <p className="text-sm">支持人与人、人与分身、分身与分身的协作</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
