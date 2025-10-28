/**
 * 消息总线模块
 * 实现发布/订阅模式，用于分身之间的消息通信
 *
 * @module coordination/messageBus
 */

/**
 * 消息优先级
 */
export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * 消息状态
 */
export enum MessageStatus {
  PENDING = 'pending',
  DELIVERED = 'delivered',
  ACKNOWLEDGED = 'acknowledged',
  FAILED = 'failed',
}

/**
 * 消息接口
 */
export interface Message {
  /** 消息 ID */
  id: string;
  /** 消息主题/频道 */
  topic: string;
  /** 发送者 ID */
  sender: string;
  /** 接收者 ID（可选，为空则广播） */
  receiver?: string;
  /** 消息负载 */
  payload: any;
  /** 优先级 */
  priority: MessagePriority;
  /** 状态 */
  status: MessageStatus;
  /** 创建时间 */
  timestamp: number;
  /** 过期时间（可选） */
  expiresAt?: number;
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 消息处理器
 */
export type MessageHandler = (message: Message) => void | Promise<void>;

/**
 * 订阅配置
 */
export interface SubscriptionConfig {
  /** 主题 */
  topic: string;
  /** 处理器 */
  handler: MessageHandler;
  /** 优先级过滤（只处理该优先级及以上的消息） */
  minPriority?: MessagePriority;
  /** 是否持久订阅（重启后保留） */
  persistent?: boolean;
}

/**
 * 订阅信息
 */
interface Subscription {
  id: string;
  topic: string;
  handler: MessageHandler;
  minPriority: MessagePriority;
  persistent: boolean;
  createdAt: number;
}

/**
 * 消息总线管理器（单例模式）
 */
export class MessageBus {
  private static instance: MessageBus;
  private subscriptions: Map<string, Subscription[]> = new Map();
  private messageQueue: Message[] = [];
  private processingQueue = false;
  private messageHistory: Map<string, Message> = new Map();
  private maxHistorySize = 1000;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): MessageBus {
    if (!this.instance) {
      this.instance = new MessageBus();
    }
    return this.instance;
  }

  /**
   * 发布消息
   */
  async publish(
    topic: string,
    payload: any,
    options: {
      sender: string;
      receiver?: string;
      priority?: MessagePriority;
      expiresIn?: number;
      metadata?: Record<string, any>;
    }
  ): Promise<string> {
    const message: Message = {
      id: this.generateMessageId(),
      topic,
      sender: options.sender,
      receiver: options.receiver,
      payload,
      priority: options.priority || MessagePriority.NORMAL,
      status: MessageStatus.PENDING,
      timestamp: Date.now(),
      expiresAt: options.expiresIn ? Date.now() + options.expiresIn : undefined,
      metadata: options.metadata,
    };

    // 添加到消息历史
    this.addToHistory(message);

    // 添加到队列
    this.enqueueMessage(message);

    // 处理队列
    this.processQueue();

    return message.id;
  }

  /**
   * 订阅主题
   */
  subscribe(config: SubscriptionConfig): string {
    const subscription: Subscription = {
      id: this.generateSubscriptionId(),
      topic: config.topic,
      handler: config.handler,
      minPriority: config.minPriority || MessagePriority.LOW,
      persistent: config.persistent || false,
      createdAt: Date.now(),
    };

    if (!this.subscriptions.has(config.topic)) {
      this.subscriptions.set(config.topic, []);
    }

    this.subscriptions.get(config.topic)!.push(subscription);

    return subscription.id;
  }

  /**
   * 取消订阅
   */
  unsubscribe(subscriptionId: string): boolean {
    for (const [topic, subs] of this.subscriptions.entries()) {
      const index = subs.findIndex((sub) => sub.id === subscriptionId);
      if (index > -1) {
        subs.splice(index, 1);
        if (subs.length === 0) {
          this.subscriptions.delete(topic);
        }
        return true;
      }
    }
    return false;
  }

  /**
   * 取消主题的所有订阅
   */
  unsubscribeTopic(topic: string): number {
    const subs = this.subscriptions.get(topic);
    if (subs) {
      const count = subs.length;
      this.subscriptions.delete(topic);
      return count;
    }
    return 0;
  }

  /**
   * 获取消息
   */
  getMessage(messageId: string): Message | null {
    return this.messageHistory.get(messageId) || null;
  }

  /**
   * 获取主题的所有订阅
   */
  getSubscriptions(topic: string): Subscription[] {
    return this.subscriptions.get(topic) || [];
  }

  /**
   * 获取所有主题
   */
  getAllTopics(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * 清空消息队列
   */
  clearQueue(): void {
    this.messageQueue = [];
  }

  /**
   * 清空消息历史
   */
  clearHistory(): void {
    this.messageHistory.clear();
  }

  /**
   * 将消息加入队列（按优先级排序）
   */
  private enqueueMessage(message: Message): void {
    // 检查是否过期
    if (message.expiresAt && Date.now() > message.expiresAt) {
      message.status = MessageStatus.FAILED;
      return;
    }

    // 按优先级插入
    const priorityOrder = {
      [MessagePriority.URGENT]: 0,
      [MessagePriority.HIGH]: 1,
      [MessagePriority.NORMAL]: 2,
      [MessagePriority.LOW]: 3,
    };

    const insertIndex = this.messageQueue.findIndex(
      (m) => priorityOrder[m.priority] > priorityOrder[message.priority]
    );

    if (insertIndex === -1) {
      this.messageQueue.push(message);
    } else {
      this.messageQueue.splice(insertIndex, 0, message);
    }
  }

  /**
   * 处理消息队列
   */
  private async processQueue(): Promise<void> {
    if (this.processingQueue || this.messageQueue.length === 0) {
      return;
    }

    this.processingQueue = true;

    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()!;

      // 检查是否过期
      if (message.expiresAt && Date.now() > message.expiresAt) {
        message.status = MessageStatus.FAILED;
        this.updateHistory(message);
        continue;
      }

      await this.deliverMessage(message);
    }

    this.processingQueue = false;
  }

  /**
   * 投递消息给订阅者
   */
  private async deliverMessage(message: Message): Promise<void> {
    const subscriptions = this.subscriptions.get(message.topic) || [];

    if (subscriptions.length === 0) {
      message.status = MessageStatus.FAILED;
      this.updateHistory(message);
      return;
    }

    const priorityOrder = {
      [MessagePriority.LOW]: 0,
      [MessagePriority.NORMAL]: 1,
      [MessagePriority.HIGH]: 2,
      [MessagePriority.URGENT]: 3,
    };

    let delivered = false;

    for (const subscription of subscriptions) {
      // 检查优先级
      if (priorityOrder[message.priority] < priorityOrder[subscription.minPriority]) {
        continue;
      }

      // 检查接收者（如果指定）
      if (message.receiver && message.receiver !== subscription.id) {
        continue;
      }

      try {
        await subscription.handler(message);
        delivered = true;
      } catch (error) {
        console.error(`Error delivering message ${message.id}:`, error);
      }
    }

    message.status = delivered ? MessageStatus.DELIVERED : MessageStatus.FAILED;
    this.updateHistory(message);
  }

  /**
   * 添加到消息历史
   */
  private addToHistory(message: Message): void {
    this.messageHistory.set(message.id, message);

    // 限制历史大小
    if (this.messageHistory.size > this.maxHistorySize) {
      const firstKey = this.messageHistory.keys().next().value;
      this.messageHistory.delete(firstKey);
    }
  }

  /**
   * 更新消息历史
   */
  private updateHistory(message: Message): void {
    this.messageHistory.set(message.id, message);
  }

  /**
   * 生成消息 ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成订阅 ID
   */
  private generateSubscriptionId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    topics: number;
    subscriptions: number;
    queuedMessages: number;
    historySize: number;
  } {
    let totalSubscriptions = 0;
    for (const subs of this.subscriptions.values()) {
      totalSubscriptions += subs.length;
    }

    return {
      topics: this.subscriptions.size,
      subscriptions: totalSubscriptions,
      queuedMessages: this.messageQueue.length,
      historySize: this.messageHistory.size,
    };
  }
}

/**
 * 导出单例实例
 */
export const messageBus = MessageBus.getInstance();

/**
 * React Hook - 使用消息总线
 */
export function useMessageBus() {
  const bus = MessageBus.getInstance();

  return {
    publish: (
      topic: string,
      payload: any,
      options: {
        sender: string;
        receiver?: string;
        priority?: MessagePriority;
        expiresIn?: number;
        metadata?: Record<string, any>;
      }
    ) => bus.publish(topic, payload, options),
    subscribe: (config: SubscriptionConfig) => bus.subscribe(config),
    unsubscribe: (subscriptionId: string) => bus.unsubscribe(subscriptionId),
    getMessage: (messageId: string) => bus.getMessage(messageId),
    getStats: () => bus.getStats(),
  };
}

/**
 * 便捷函数 - 发布消息
 */
export async function publish(
  topic: string,
  payload: any,
  sender: string,
  priority: MessagePriority = MessagePriority.NORMAL
): Promise<string> {
  return messageBus.publish(topic, payload, { sender, priority });
}

/**
 * 便捷函数 - 订阅主题
 */
export function subscribe(topic: string, handler: MessageHandler): string {
  return messageBus.subscribe({ topic, handler });
}

/**
 * 便捷函数 - 广播消息（发送给所有订阅者）
 */
export async function broadcast(
  topic: string,
  payload: any,
  sender: string,
  priority: MessagePriority = MessagePriority.NORMAL
): Promise<string> {
  return messageBus.publish(topic, payload, { sender, priority });
}

/**
 * 便捷函数 - 点对点消息
 */
export async function sendToReceiver(
  topic: string,
  payload: any,
  sender: string,
  receiver: string,
  priority: MessagePriority = MessagePriority.NORMAL
): Promise<string> {
  return messageBus.publish(topic, payload, { sender, receiver, priority });
}

/**
 * 预定义主题
 */
export const Topics = {
  // 任务相关
  TASK_CREATED: 'task.created',
  TASK_UPDATED: 'task.updated',
  TASK_COMPLETED: 'task.completed',
  TASK_FAILED: 'task.failed',

  // 分身相关
  AVATAR_STARTED: 'avatar.started',
  AVATAR_STOPPED: 'avatar.stopped',
  AVATAR_STATUS: 'avatar.status',
  AVATAR_ERROR: 'avatar.error',

  // 协同相关
  COLLABORATION_REQUEST: 'collaboration.request',
  COLLABORATION_RESPONSE: 'collaboration.response',
  RESOURCE_LOCK: 'resource.lock',
  RESOURCE_UNLOCK: 'resource.unlock',

  // HITL 相关
  HITL_REQUEST: 'hitl.request',
  HITL_APPROVED: 'hitl.approved',
  HITL_REJECTED: 'hitl.rejected',

  // 系统相关
  SYSTEM_ALERT: 'system.alert',
  SYSTEM_SHUTDOWN: 'system.shutdown',
} as const;
