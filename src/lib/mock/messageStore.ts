import { mockConversations } from './data';

// ====================================
// Message Types & Interfaces
// ====================================

/**
 * 消息发送者类型
 */
export type MessageSenderType = 'human' | 'avatar' | 'system';

/**
 * 对话类型
 */
export type ConversationType =
  | 'human-to-human'      // 人与人
  | 'human-to-avatar'     // 人与分身
  | 'avatar-to-avatar'    // 分身与分身
  | 'channel';            // 频道/群聊

/**
 * 消息状态
 */
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

/**
 * 消息参与者
 */
export interface MessageParticipant {
  id: string;
  type: MessageSenderType;
  name: string;
  avatar?: string;
  role?: string;  // For avatars
  isOnline?: boolean;
}

/**
 * 消息内容
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderType: MessageSenderType;
  content: string;
  type: 'text' | 'image' | 'file' | 'code' | 'system';
  status: MessageStatus;
  timestamp: string;

  // Optional fields
  replyTo?: string;  // 回复的消息 ID
  reactions?: Array<{
    emoji: string;
    userId: string;
    userName: string;
  }>;
  attachments?: Array<{
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
  metadata?: Record<string, any>;

  // Timestamps
  deliveredAt?: string;
  readAt?: string;
  editedAt?: string;
}

/**
 * 对话
 */
export interface Conversation {
  id: string;
  type: ConversationType;
  title: string;
  description?: string;
  avatar?: string;

  // 参与者
  participants: MessageParticipant[];

  // 状态
  isActive: boolean;
  isPinned: boolean;
  isMuted: boolean;

  // 最后消息
  lastMessage?: {
    content: string;
    senderId: string;
    senderName: string;
    timestamp: string;
  };

  // 未读数
  unreadCount: number;

  // 频道相关（仅当 type 为 'channel' 时）
  channelInfo?: {
    isPublic: boolean;
    projectId?: string;  // 关联的项目 ID
    createdBy: string;
    memberCount: number;
  };

  // 时间戳
  createdAt: string;
  updatedAt: string;
}

// ====================================
// Storage Keys
// ====================================

const STORAGE_KEYS = {
  CONVERSATIONS: 'karma_conversations',
  MESSAGES: 'karma_messages',
  PARTICIPANTS: 'karma_message_participants',
} as const;

// ====================================
// Initialize Mock Data
// ====================================

const initConversations = (): Conversation[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (stored) {
      return JSON.parse(stored);
    }

    // Initialize with mock data
    const initialConversations: Conversation[] = [
      // KARMA One (个人助手)
      {
        id: 'conv-karma-one',
        type: 'human-to-avatar',
        title: 'KARMA One',
        description: '你的个人 AI 助手',
        avatar: '👔',
        participants: [
          {
            id: 'user-1',
            type: 'human',
            name: '你',
            isOnline: true,
          },
          {
            id: 'avatar-karma-one',
            type: 'avatar',
            name: 'KARMA One',
            role: '首席评估官',
            avatar: '👔',
            isOnline: true,
          },
        ],
        isActive: true,
        isPinned: true,
        isMuted: false,
        lastMessage: {
          content: '今天有 8 个分身工作中，3 个任务完成待审核',
          senderId: 'avatar-karma-one',
          senderName: 'KARMA One',
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        },
        unreadCount: 2,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      },

      // 我的分身 - FORGE #1
      {
        id: 'conv-forge-1',
        type: 'human-to-avatar',
        title: 'FORGE #1',
        description: '前端工程师分身',
        avatar: '🎨',
        participants: [
          {
            id: 'user-1',
            type: 'human',
            name: '你',
            isOnline: true,
          },
          {
            id: 'avatar-forge-1',
            type: 'avatar',
            name: 'FORGE #1',
            role: '前端工程师',
            avatar: '🎨',
            isOnline: true,
          },
        ],
        isActive: true,
        isPinned: false,
        isMuted: false,
        lastMessage: {
          content: '支付集成已完成，等待合并批准',
          senderId: 'avatar-forge-1',
          senderName: 'FORGE #1',
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        },
        unreadCount: 1,
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      },

      // 团队成员 - 张三
      {
        id: 'conv-zhangsan',
        type: 'human-to-human',
        title: '张三 (CTO)',
        avatar: '👨‍💻',
        participants: [
          {
            id: 'user-1',
            type: 'human',
            name: '你',
            isOnline: true,
          },
          {
            id: 'user-zhangsan',
            type: 'human',
            name: '张三',
            role: 'CTO',
            avatar: '👨‍💻',
            isOnline: true,
          },
        ],
        isActive: true,
        isPinned: false,
        isMuted: false,
        lastMessage: {
          content: '支付集成已完成，我的 FORGE 分身说可以合并了',
          senderId: 'user-zhangsan',
          senderName: '张三',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        },
        unreadCount: 0,
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      },

      // 项目频道 - 主产品开发
      {
        id: 'channel-main-product',
        type: 'channel',
        title: '主产品开发',
        description: '主产品开发协作频道',
        avatar: '💼',
        participants: [
          {
            id: 'user-1',
            type: 'human',
            name: '你',
            isOnline: true,
          },
          {
            id: 'user-zhangsan',
            type: 'human',
            name: '张三 (CTO)',
            isOnline: true,
          },
          {
            id: 'user-lisi',
            type: 'human',
            name: '李四 (设计师)',
            isOnline: true,
          },
          {
            id: 'avatar-forge-1',
            type: 'avatar',
            name: 'FORGE #1',
            role: '前端工程师',
            isOnline: true,
          },
          {
            id: 'avatar-forge-2',
            type: 'avatar',
            name: 'FORGE #2',
            role: '后端工程师',
            isOnline: true,
          },
          {
            id: 'avatar-karma-one',
            type: 'avatar',
            name: 'KARMA One',
            role: '频道助手',
            isOnline: true,
          },
        ],
        isActive: true,
        isPinned: true,
        isMuted: false,
        lastMessage: {
          content: '✅ 已更新所有人的日程',
          senderId: 'avatar-karma-one',
          senderName: 'KARMA One',
          timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        },
        unreadCount: 3,
        channelInfo: {
          isPublic: false,
          projectId: 'proj-1',
          createdBy: 'user-1',
          memberCount: 6,
        },
        createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      },
    ];

    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(initialConversations));
    return initialConversations;
  } catch (error) {
    console.error('Failed to initialize conversations:', error);
    return [];
  }
};

const initMessages = (): Message[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (stored) {
      return JSON.parse(stored);
    }

    // Initialize with some mock messages
    const now = Date.now();
    const initialMessages: Message[] = [
      // KARMA One conversation
      {
        id: 'msg-1',
        conversationId: 'conv-karma-one',
        senderId: 'avatar-karma-one',
        senderType: 'avatar',
        content: '早上好！今天有 8 个分身工作中，3 个任务完成待审核',
        type: 'text',
        status: 'delivered',
        timestamp: new Date(now - 5 * 60 * 1000).toISOString(),
      },

      // FORGE #1 conversation
      {
        id: 'msg-2',
        conversationId: 'conv-forge-1',
        senderId: 'user-1',
        senderType: 'human',
        content: '支付集成的进度如何？',
        type: 'text',
        status: 'read',
        timestamp: new Date(now - 20 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-3',
        conversationId: 'conv-forge-1',
        senderId: 'avatar-forge-1',
        senderType: 'avatar',
        content: '支付集成已完成！所有测试通过，可以合并了',
        type: 'text',
        status: 'delivered',
        timestamp: new Date(now - 15 * 60 * 1000).toISOString(),
        replyTo: 'msg-2',
      },

      // Channel conversation
      {
        id: 'msg-4',
        conversationId: 'channel-main-product',
        senderId: 'user-1',
        senderType: 'human',
        content: '@全体 今天的发布会推迟到下午 3 点',
        type: 'text',
        status: 'read',
        timestamp: new Date(now - 12 * 60 * 1000).toISOString(),
      },
      {
        id: 'msg-5',
        conversationId: 'channel-main-product',
        senderId: 'avatar-karma-one',
        senderType: 'avatar',
        content: '✅ 已更新所有人的日程\n✅ 已通知频道内 4 个分身',
        type: 'system',
        status: 'delivered',
        timestamp: new Date(now - 10 * 60 * 1000).toISOString(),
      },
    ];

    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(initialMessages));
    return initialMessages;
  } catch (error) {
    console.error('Failed to initialize messages:', error);
    return [];
  }
};

// ====================================
// Store Functions
// ====================================

/**
 * Get all conversations
 */
export function getAllConversations(): Conversation[] {
  return initConversations();
}

/**
 * Get conversation by ID
 */
export function getConversationById(id: string): Conversation | undefined {
  const conversations = initConversations();
  return conversations.find(c => c.id === id);
}

/**
 * Get messages for a conversation
 */
export function getMessagesByConversationId(conversationId: string): Message[] {
  const messages = initMessages();
  return messages
    .filter(m => m.conversationId === conversationId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Create a new conversation
 */
export function createConversation(
  data: Omit<Conversation, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'unreadCount'>
): Conversation {
  const conversations = initConversations();

  const newConversation: Conversation = {
    ...data,
    id: `conv-${Date.now()}`,
    isActive: true,
    unreadCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  conversations.push(newConversation);
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));

  return newConversation;
}

/**
 * Send a message
 */
export function sendMessage(
  data: Omit<Message, 'id' | 'timestamp' | 'status'>
): Message {
  const messages = initMessages();
  const conversations = initConversations();

  const newMessage: Message = {
    ...data,
    id: `msg-${Date.now()}`,
    status: 'sent',
    timestamp: new Date().toISOString(),
  };

  messages.push(newMessage);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));

  // Update conversation's last message
  const convIndex = conversations.findIndex(c => c.id === data.conversationId);
  if (convIndex !== -1) {
    const participant = conversations[convIndex].participants.find(
      p => p.id === data.senderId
    );

    conversations[convIndex].lastMessage = {
      content: data.content,
      senderId: data.senderId,
      senderName: participant?.name || 'Unknown',
      timestamp: newMessage.timestamp,
    };
    conversations[convIndex].updatedAt = newMessage.timestamp;

    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }

  return newMessage;
}

/**
 * Update message status
 */
export function updateMessageStatus(
  messageId: string,
  status: MessageStatus
): Message | undefined {
  const messages = initMessages();
  const index = messages.findIndex(m => m.id === messageId);

  if (index === -1) return undefined;

  messages[index].status = status;

  if (status === 'delivered') {
    messages[index].deliveredAt = new Date().toISOString();
  } else if (status === 'read') {
    messages[index].readAt = new Date().toISOString();
  }

  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  return messages[index];
}

/**
 * Add reaction to message
 */
export function addReactionToMessage(
  messageId: string,
  userId: string,
  userName: string,
  emoji: string
): Message | undefined {
  const messages = initMessages();
  const index = messages.findIndex(m => m.id === messageId);

  if (index === -1) return undefined;

  if (!messages[index].reactions) {
    messages[index].reactions = [];
  }

  messages[index].reactions!.push({ emoji, userId, userName });
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));

  return messages[index];
}

/**
 * Update conversation unread count
 */
export function updateUnreadCount(conversationId: string, count: number): void {
  const conversations = initConversations();
  const index = conversations.findIndex(c => c.id === conversationId);

  if (index !== -1) {
    conversations[index].unreadCount = count;
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }
}

/**
 * Mark conversation as read
 */
export function markConversationAsRead(conversationId: string): void {
  updateUnreadCount(conversationId, 0);
}

/**
 * Toggle pin conversation
 */
export function togglePinConversation(conversationId: string): Conversation | undefined {
  const conversations = initConversations();
  const index = conversations.findIndex(c => c.id === conversationId);

  if (index === -1) return undefined;

  conversations[index].isPinned = !conversations[index].isPinned;
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));

  return conversations[index];
}

/**
 * Toggle mute conversation
 */
export function toggleMuteConversation(conversationId: string): Conversation | undefined {
  const conversations = initConversations();
  const index = conversations.findIndex(c => c.id === conversationId);

  if (index === -1) return undefined;

  conversations[index].isMuted = !conversations[index].isMuted;
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));

  return conversations[index];
}

/**
 * Delete conversation
 */
export function deleteConversation(conversationId: string): boolean {
  const conversations = initConversations();
  const filteredConversations = conversations.filter(c => c.id !== conversationId);

  if (filteredConversations.length === conversations.length) {
    return false;  // Conversation not found
  }

  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(filteredConversations));

  // Also delete associated messages
  const messages = initMessages();
  const filteredMessages = messages.filter(m => m.conversationId !== conversationId);
  localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(filteredMessages));

  return true;
}
