/**
 * WebSocket 会话管理模块
 * 提供实时双向通信能力，支持 48+ 小时长连接
 *
 * @module websocket/sessionManager
 */

/**
 * 会话状态
 */
export enum SessionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  CONNECTED = 'connected',
  RECONNECTING = 'reconnecting',
  FAILED = 'failed',
}

/**
 * 消息类型
 */
export enum MessageType {
  // 系统消息
  PING = 'ping',
  PONG = 'pong',
  AUTH = 'auth',
  AUTH_SUCCESS = 'auth_success',
  AUTH_FAILED = 'auth_failed',
  ERROR = 'error',

  // 业务消息
  CHAT_MESSAGE = 'chat_message',
  CHAT_RESPONSE = 'chat_response',
  TASK_UPDATE = 'task_update',
  AVATAR_STATUS = 'avatar_status',
  HITL_REQUEST = 'hitl_request',
  HITL_RESPONSE = 'hitl_response',

  // 文件传输
  FILE_UPLOAD = 'file_upload',
  FILE_CHUNK = 'file_chunk',
  FILE_COMPLETE = 'file_complete',
}

/**
 * WebSocket 消息格式
 */
export interface WSMessage {
  /** 消息 ID */
  id: string;
  /** 消息类型 */
  type: MessageType;
  /** 消息负载 */
  payload: any;
  /** 时间戳 */
  timestamp: number;
  /** 会话 ID */
  sessionId?: string;
}

/**
 * 会话配置
 */
export interface SessionConfig {
  /** WebSocket URL */
  url: string;
  /** 认证 token */
  token?: string;
  /** 心跳间隔（毫秒） */
  heartbeatInterval?: number;
  /** 重连延迟（毫秒） */
  reconnectDelay?: number;
  /** 最大重连次数 */
  maxReconnectAttempts?: number;
  /** 是否自动重连 */
  autoReconnect?: boolean;
}

/**
 * 会话事件回调
 */
export interface SessionCallbacks {
  onConnected?: () => void;
  onDisconnected?: (reason: string) => void;
  onMessage?: (message: WSMessage) => void;
  onError?: (error: Error) => void;
  onReconnecting?: (attempt: number) => void;
  onReconnected?: () => void;
  onAuthSuccess?: () => void;
  onAuthFailed?: (error: string) => void;
}

/**
 * WebSocket 会话管理器
 */
export class WebSocketSessionManager {
  private ws: WebSocket | null = null;
  private state: SessionState = SessionState.DISCONNECTED;
  private config: Required<SessionConfig>;
  private callbacks: SessionCallbacks = {};
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private sessionId: string | null = null;
  private messageHandlers: Map<MessageType, ((message: WSMessage) => void)[]> = new Map();

  constructor(config: SessionConfig) {
    this.config = {
      url: config.url,
      token: config.token || '',
      heartbeatInterval: config.heartbeatInterval || 30000, // 30秒
      reconnectDelay: config.reconnectDelay || 3000, // 3秒
      maxReconnectAttempts: config.maxReconnectAttempts || 10,
      autoReconnect: config.autoReconnect !== undefined ? config.autoReconnect : true,
    };
  }

  /**
   * 连接到 WebSocket 服务器
   */
  connect(): void {
    if (this.state === SessionState.CONNECTED || this.state === SessionState.CONNECTING) {
      console.warn('WebSocket is already connected or connecting');
      return;
    }

    this.setState(SessionState.CONNECTING);

    try {
      this.ws = new WebSocket(this.config.url);
      this.setupEventHandlers();
    } catch (error) {
      this.handleError(error as Error);
      this.attemptReconnect();
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    this.config.autoReconnect = false; // 禁用自动重连
    this.cleanup();

    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }

    this.setState(SessionState.DISCONNECTED);
  }

  /**
   * 设置事件回调
   */
  setCallbacks(callbacks: SessionCallbacks): void {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  /**
   * 注册消息处理器
   */
  on(type: MessageType, handler: (message: WSMessage) => void): void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type)!.push(handler);
  }

  /**
   * 注销消息处理器
   */
  off(type: MessageType, handler: (message: WSMessage) => void): void {
    const handlers = this.messageHandlers.get(type);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 发送消息
   */
  send(type: MessageType, payload: any): boolean {
    if (!this.isConnected()) {
      console.error('Cannot send message: WebSocket is not connected');
      return false;
    }

    const message: WSMessage = {
      id: this.generateMessageId(),
      type,
      payload,
      timestamp: Date.now(),
      sessionId: this.sessionId || undefined,
    };

    try {
      this.ws!.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Failed to send message:', error);
      return false;
    }
  }

  /**
   * 获取当前状态
   */
  getState(): SessionState {
    return this.state;
  }

  /**
   * 检查是否已连接
   */
  isConnected(): boolean {
    return this.state === SessionState.CONNECTED && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 获取会话 ID
   */
  getSessionId(): string | null {
    return this.sessionId;
  }

  /**
   * 设置状态
   */
  private setState(state: SessionState): void {
    this.state = state;
  }

  /**
   * 设置 WebSocket 事件处理器
   */
  private setupEventHandlers(): void {
    if (!this.ws) return;

    this.ws.onopen = () => {
      this.handleOpen();
    };

    this.ws.onmessage = (event) => {
      this.handleMessage(event.data);
    };

    this.ws.onerror = (event) => {
      this.handleError(new Error('WebSocket error'));
    };

    this.ws.onclose = (event) => {
      this.handleClose(event.code, event.reason);
    };
  }

  /**
   * 处理连接打开
   */
  private handleOpen(): void {
    this.setState(SessionState.CONNECTED);
    this.reconnectAttempts = 0;

    // 发送认证消息
    if (this.config.token) {
      this.send(MessageType.AUTH, { token: this.config.token });
    }

    // 启动心跳
    this.startHeartbeat();

    this.callbacks.onConnected?.();

    if (this.reconnectAttempts > 0) {
      this.callbacks.onReconnected?.();
    }
  }

  /**
   * 处理收到的消息
   */
  private handleMessage(data: string): void {
    try {
      const message: WSMessage = JSON.parse(data);

      // 处理系统消息
      switch (message.type) {
        case MessageType.PONG:
          // 心跳响应，无需处理
          break;

        case MessageType.AUTH_SUCCESS:
          this.sessionId = message.payload.sessionId;
          this.callbacks.onAuthSuccess?.();
          break;

        case MessageType.AUTH_FAILED:
          this.callbacks.onAuthFailed?.(message.payload.error || 'Authentication failed');
          this.disconnect();
          break;

        case MessageType.ERROR:
          this.handleError(new Error(message.payload.message || 'Server error'));
          break;

        default:
          // 业务消息
          this.callbacks.onMessage?.(message);
          this.dispatchMessage(message);
          break;
      }
    } catch (error) {
      console.error('Failed to parse message:', error);
    }
  }

  /**
   * 分发消息给注册的处理器
   */
  private dispatchMessage(message: WSMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach((handler) => {
        try {
          handler(message);
        } catch (error) {
          console.error('Message handler error:', error);
        }
      });
    }
  }

  /**
   * 处理连接关闭
   */
  private handleClose(code: number, reason: string): void {
    this.cleanup();
    this.setState(SessionState.DISCONNECTED);

    const reasonText = reason || `Connection closed (code: ${code})`;
    this.callbacks.onDisconnected?.(reasonText);

    // 尝试重连（非正常关闭且启用了自动重连）
    if (code !== 1000 && this.config.autoReconnect) {
      this.attemptReconnect();
    }
  }

  /**
   * 处理错误
   */
  private handleError(error: Error): void {
    console.error('WebSocket error:', error);
    this.callbacks.onError?.(error);
  }

  /**
   * 尝试重连
   */
  private attemptReconnect(): void {
    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      this.setState(SessionState.FAILED);
      this.callbacks.onError?.(new Error('Max reconnect attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    this.setState(SessionState.RECONNECTING);
    this.callbacks.onReconnecting?.(this.reconnectAttempts);

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectDelay);
  }

  /**
   * 启动心跳
   */
  private startHeartbeat(): void {
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected()) {
        this.send(MessageType.PING, {});
      }
    }, this.config.heartbeatInterval);
  }

  /**
   * 清理资源
   */
  private cleanup(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * 生成消息 ID
   */
  private generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

/**
 * React Hook - 使用 WebSocket 会话
 */
export function useWebSocketSession(config: SessionConfig) {
  // 在实际使用中，应该使用 React 的 useState 和 useEffect
  const manager = new WebSocketSessionManager(config);

  return {
    connect: () => manager.connect(),
    disconnect: () => manager.disconnect(),
    send: (type: MessageType, payload: any) => manager.send(type, payload),
    on: (type: MessageType, handler: (message: WSMessage) => void) =>
      manager.on(type, handler),
    off: (type: MessageType, handler: (message: WSMessage) => void) =>
      manager.off(type, handler),
    setCallbacks: (callbacks: SessionCallbacks) => manager.setCallbacks(callbacks),
    getState: () => manager.getState(),
    isConnected: () => manager.isConnected(),
    getSessionId: () => manager.getSessionId(),
  };
}

/**
 * 默认 WebSocket URL（从环境变量读取）
 */
export function getDefaultWebSocketURL(): string {
  if (typeof window === 'undefined') {
    return 'ws://localhost:3000';
  }

  return process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';
}
