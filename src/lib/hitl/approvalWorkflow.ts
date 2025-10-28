/**
 * HITL 审批流程模块
 * 实现人工介入审批机制
 *
 * @module hitl/approvalWorkflow
 */

import { messageBus, Topics, MessagePriority } from '../coordination/messageBus';

/**
 * 审批请求状态
 */
export enum ApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

/**
 * 审批类型
 */
export enum ApprovalType {
  /** 任务执行 */
  TASK_EXECUTION = 'task_execution',
  /** 数据修改 */
  DATA_MODIFICATION = 'data_modification',
  /** 资源访问 */
  RESOURCE_ACCESS = 'resource_access',
  /** 支付操作 */
  PAYMENT_OPERATION = 'payment_operation',
  /** 系统配置 */
  SYSTEM_CONFIG = 'system_config',
  /** 自定义 */
  CUSTOM = 'custom',
}

/**
 * 审批优先级
 */
export enum ApprovalPriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  URGENT = 4,
}

/**
 * 审批请求
 */
export interface ApprovalRequest {
  /** 请求 ID */
  id: string;
  /** 请求类型 */
  type: ApprovalType;
  /** 请求标题 */
  title: string;
  /** 请求描述 */
  description: string;
  /** 请求者 ID */
  requesterId: string;
  /** 请求者名称 */
  requesterName?: string;
  /** 审批者 ID（可选，不指定则任何审批者都可以处理） */
  approverId?: string;
  /** 状态 */
  status: ApprovalStatus;
  /** 优先级 */
  priority: ApprovalPriority;
  /** 请求数据 */
  data: any;
  /** 审批结果数据 */
  result?: any;
  /** 审批意见 */
  comment?: string;
  /** 创建时间 */
  createdAt: number;
  /** 审批时间 */
  approvedAt?: number;
  /** 过期时间 */
  expiresAt?: number;
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 审批回调
 */
export interface ApprovalCallbacks {
  onApproved?: (request: ApprovalRequest) => void | Promise<void>;
  onRejected?: (request: ApprovalRequest) => void | Promise<void>;
  onExpired?: (request: ApprovalRequest) => void | Promise<void>;
  onCancelled?: (request: ApprovalRequest) => void | Promise<void>;
}

/**
 * 审批工作流管理器（单例模式）
 */
export class ApprovalWorkflow {
  private static instance: ApprovalWorkflow;
  private requests: Map<string, ApprovalRequest> = new Map();
  private callbacks: Map<string, ApprovalCallbacks> = new Map();
  private expirationCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    // 订阅审批相关事件
    messageBus.subscribe({
      topic: Topics.HITL_APPROVED,
      handler: this.handleApproved.bind(this),
    });

    messageBus.subscribe({
      topic: Topics.HITL_REJECTED,
      handler: this.handleRejected.bind(this),
    });

    // 启动过期检查
    this.startExpirationCheck();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): ApprovalWorkflow {
    if (!this.instance) {
      this.instance = new ApprovalWorkflow();
    }
    return this.instance;
  }

  /**
   * 创建审批请求
   */
  async createRequest(
    requestData: Omit<ApprovalRequest, 'id' | 'status' | 'createdAt'>,
    callbacks?: ApprovalCallbacks
  ): Promise<string> {
    const request: ApprovalRequest = {
      id: this.generateRequestId(),
      status: ApprovalStatus.PENDING,
      createdAt: Date.now(),
      ...requestData,
    };

    this.requests.set(request.id, request);

    if (callbacks) {
      this.callbacks.set(request.id, callbacks);
    }

    // 发布审批请求事件
    await messageBus.publish(Topics.HITL_REQUEST, request, {
      sender: request.requesterId,
      receiver: request.approverId,
      priority: this.getPriorityMapping(request.priority),
    });

    return request.id;
  }

  /**
   * 批准请求
   */
  async approve(
    requestId: string,
    approverId: string,
    comment?: string,
    result?: any
  ): Promise<boolean> {
    const request = this.requests.get(requestId);

    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    if (request.status !== ApprovalStatus.PENDING) {
      throw new Error(`Request ${requestId} is not pending`);
    }

    // 检查是否过期
    if (request.expiresAt && Date.now() > request.expiresAt) {
      request.status = ApprovalStatus.EXPIRED;
      await this.triggerCallback(request, 'onExpired');
      return false;
    }

    // 检查审批者权限
    if (request.approverId && request.approverId !== approverId) {
      throw new Error(`User ${approverId} is not authorized to approve this request`);
    }

    request.status = ApprovalStatus.APPROVED;
    request.approvedAt = Date.now();
    request.comment = comment;
    request.result = result;

    // 发布审批通过事件
    await messageBus.publish(
      Topics.HITL_APPROVED,
      { requestId, approverId, comment, result },
      {
        sender: approverId,
        receiver: request.requesterId,
        priority: this.getPriorityMapping(request.priority),
      }
    );

    // 触发回调
    await this.triggerCallback(request, 'onApproved');

    return true;
  }

  /**
   * 拒绝请求
   */
  async reject(
    requestId: string,
    approverId: string,
    comment?: string
  ): Promise<boolean> {
    const request = this.requests.get(requestId);

    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    if (request.status !== ApprovalStatus.PENDING) {
      throw new Error(`Request ${requestId} is not pending`);
    }

    // 检查是否过期
    if (request.expiresAt && Date.now() > request.expiresAt) {
      request.status = ApprovalStatus.EXPIRED;
      await this.triggerCallback(request, 'onExpired');
      return false;
    }

    // 检查审批者权限
    if (request.approverId && request.approverId !== approverId) {
      throw new Error(`User ${approverId} is not authorized to reject this request`);
    }

    request.status = ApprovalStatus.REJECTED;
    request.approvedAt = Date.now();
    request.comment = comment;

    // 发布审批拒绝事件
    await messageBus.publish(
      Topics.HITL_REJECTED,
      { requestId, approverId, comment },
      {
        sender: approverId,
        receiver: request.requesterId,
        priority: this.getPriorityMapping(request.priority),
      }
    );

    // 触发回调
    await this.triggerCallback(request, 'onRejected');

    return true;
  }

  /**
   * 取消请求
   */
  async cancel(requestId: string, cancelledBy: string): Promise<boolean> {
    const request = this.requests.get(requestId);

    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    if (request.status !== ApprovalStatus.PENDING) {
      return false;
    }

    // 只有请求者可以取消
    if (request.requesterId !== cancelledBy) {
      throw new Error(`User ${cancelledBy} is not authorized to cancel this request`);
    }

    request.status = ApprovalStatus.CANCELLED;

    // 触发回调
    await this.triggerCallback(request, 'onCancelled');

    return true;
  }

  /**
   * 获取请求
   */
  getRequest(requestId: string): ApprovalRequest | null {
    return this.requests.get(requestId) || null;
  }

  /**
   * 获取所有请求
   */
  getAllRequests(filter?: {
    status?: ApprovalStatus;
    requesterId?: string;
    approverId?: string;
    type?: ApprovalType;
  }): ApprovalRequest[] {
    const requests = Array.from(this.requests.values());

    if (!filter) return requests;

    return requests.filter((request) => {
      if (filter.status && request.status !== filter.status) return false;
      if (filter.requesterId && request.requesterId !== filter.requesterId) return false;
      if (filter.approverId && request.approverId !== filter.approverId) return false;
      if (filter.type && request.type !== filter.type) return false;
      return true;
    });
  }

  /**
   * 获取待审批的请求
   */
  getPendingRequests(approverId?: string): ApprovalRequest[] {
    const now = Date.now();
    const requests = Array.from(this.requests.values()).filter(
      (request) =>
        request.status === ApprovalStatus.PENDING &&
        (!request.expiresAt || request.expiresAt > now) &&
        (!approverId || !request.approverId || request.approverId === approverId)
    );

    // 按优先级和创建时间排序
    return requests.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority; // 优先级高的在前
      }
      return a.createdAt - b.createdAt; // 创建早的在前
    });
  }

  /**
   * 等待审批结果
   */
  async waitForApproval(requestId: string, timeout?: number): Promise<ApprovalRequest> {
    const request = this.requests.get(requestId);

    if (!request) {
      throw new Error(`Request ${requestId} not found`);
    }

    if (request.status !== ApprovalStatus.PENDING) {
      return request;
    }

    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(() => {
        const currentRequest = this.requests.get(requestId);

        if (!currentRequest) {
          clearInterval(checkInterval);
          reject(new Error(`Request ${requestId} not found`));
          return;
        }

        if (currentRequest.status !== ApprovalStatus.PENDING) {
          clearInterval(checkInterval);
          resolve(currentRequest);
        }
      }, 1000);

      if (timeout) {
        setTimeout(() => {
          clearInterval(checkInterval);
          reject(new Error(`Approval timeout for request ${requestId}`));
        }, timeout);
      }
    });
  }

  /**
   * 处理审批通过事件
   */
  private async handleApproved(message: any): Promise<void> {
    // 已在 approve 方法中处理
  }

  /**
   * 处理审批拒绝事件
   */
  private async handleRejected(message: any): Promise<void> {
    // 已在 reject 方法中处理
  }

  /**
   * 触发回调
   */
  private async triggerCallback(
    request: ApprovalRequest,
    callbackName: keyof ApprovalCallbacks
  ): Promise<void> {
    const callbacks = this.callbacks.get(request.id);
    if (callbacks && callbacks[callbackName]) {
      try {
        await callbacks[callbackName]!(request);
      } catch (error) {
        console.error(`Error in callback ${callbackName}:`, error);
      }
    }
  }

  /**
   * 启动过期检查
   */
  private startExpirationCheck(): void {
    this.expirationCheckInterval = setInterval(() => {
      const now = Date.now();

      for (const [id, request] of this.requests.entries()) {
        if (
          request.status === ApprovalStatus.PENDING &&
          request.expiresAt &&
          now > request.expiresAt
        ) {
          request.status = ApprovalStatus.EXPIRED;
          this.triggerCallback(request, 'onExpired');
        }
      }
    }, 60000); // 每分钟检查一次
  }

  /**
   * 获取优先级映射
   */
  private getPriorityMapping(approvalPriority: ApprovalPriority): MessagePriority {
    switch (approvalPriority) {
      case ApprovalPriority.LOW:
        return MessagePriority.LOW;
      case ApprovalPriority.NORMAL:
        return MessagePriority.NORMAL;
      case ApprovalPriority.HIGH:
        return MessagePriority.HIGH;
      case ApprovalPriority.URGENT:
        return MessagePriority.URGENT;
      default:
        return MessagePriority.NORMAL;
    }
  }

  /**
   * 生成请求 ID
   */
  private generateRequestId(): string {
    return `approval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 清理过期请求（手动清理）
   */
  cleanupExpired(): number {
    let count = 0;
    const now = Date.now();

    for (const [id, request] of this.requests.entries()) {
      if (
        request.status === ApprovalStatus.EXPIRED ||
        (request.status === ApprovalStatus.PENDING &&
          request.expiresAt &&
          now > request.expiresAt)
      ) {
        this.requests.delete(id);
        this.callbacks.delete(id);
        count++;
      }
    }

    return count;
  }

  /**
   * 清理已完成的请求
   */
  cleanupCompleted(olderThan?: number): number {
    let count = 0;
    const threshold = olderThan || Date.now() - 7 * 24 * 60 * 60 * 1000; // 默认7天

    for (const [id, request] of this.requests.entries()) {
      if (
        (request.status === ApprovalStatus.APPROVED ||
          request.status === ApprovalStatus.REJECTED ||
          request.status === ApprovalStatus.CANCELLED) &&
        (request.approvedAt || request.createdAt) < threshold
      ) {
        this.requests.delete(id);
        this.callbacks.delete(id);
        count++;
      }
    }

    return count;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    expired: number;
    cancelled: number;
    byType: Record<ApprovalType, number>;
    byPriority: Record<ApprovalPriority, number>;
  } {
    const requests = Array.from(this.requests.values());

    const byType: Record<ApprovalType, number> = {} as any;
    const byPriority: Record<ApprovalPriority, number> = {} as any;

    // 初始化计数器
    Object.values(ApprovalType).forEach((type) => {
      byType[type] = 0;
    });
    Object.values(ApprovalPriority).forEach((priority) => {
      if (typeof priority === 'number') {
        byPriority[priority] = 0;
      }
    });

    requests.forEach((request) => {
      byType[request.type]++;
      byPriority[request.priority]++;
    });

    return {
      total: requests.length,
      pending: requests.filter((r) => r.status === ApprovalStatus.PENDING).length,
      approved: requests.filter((r) => r.status === ApprovalStatus.APPROVED).length,
      rejected: requests.filter((r) => r.status === ApprovalStatus.REJECTED).length,
      expired: requests.filter((r) => r.status === ApprovalStatus.EXPIRED).length,
      cancelled: requests.filter((r) => r.status === ApprovalStatus.CANCELLED).length,
      byType,
      byPriority,
    };
  }
}

/**
 * 导出单例实例
 */
export const approvalWorkflow = ApprovalWorkflow.getInstance();

/**
 * React Hook - 使用审批工作流
 */
export function useApprovalWorkflow() {
  const workflow = ApprovalWorkflow.getInstance();

  return {
    createRequest: (
      request: Omit<ApprovalRequest, 'id' | 'status' | 'createdAt'>,
      callbacks?: ApprovalCallbacks
    ) => workflow.createRequest(request, callbacks),
    approve: (requestId: string, approverId: string, comment?: string, result?: any) =>
      workflow.approve(requestId, approverId, comment, result),
    reject: (requestId: string, approverId: string, comment?: string) =>
      workflow.reject(requestId, approverId, comment),
    cancel: (requestId: string, cancelledBy: string) =>
      workflow.cancel(requestId, cancelledBy),
    getRequest: (requestId: string) => workflow.getRequest(requestId),
    getPendingRequests: (approverId?: string) => workflow.getPendingRequests(approverId),
    getAllRequests: (filter?: {
      status?: ApprovalStatus;
      requesterId?: string;
      approverId?: string;
      type?: ApprovalType;
    }) => workflow.getAllRequests(filter),
    waitForApproval: (requestId: string, timeout?: number) =>
      workflow.waitForApproval(requestId, timeout),
    getStats: () => workflow.getStats(),
  };
}

/**
 * 便捷函数 - 请求审批
 */
export async function requestApproval(
  type: ApprovalType,
  title: string,
  description: string,
  data: any,
  requesterId: string,
  options?: {
    approverId?: string;
    priority?: ApprovalPriority;
    expiresIn?: number;
    callbacks?: ApprovalCallbacks;
  }
): Promise<string> {
  return approvalWorkflow.createRequest(
    {
      type,
      title,
      description,
      data,
      requesterId,
      requesterName: options?.approverId,
      approverId: options?.approverId,
      priority: options?.priority || ApprovalPriority.NORMAL,
      expiresAt: options?.expiresIn ? Date.now() + options.expiresIn : undefined,
    },
    options?.callbacks
  );
}
