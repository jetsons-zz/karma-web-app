/**
 * 结账流程模块
 * 管理完整的支付流程
 *
 * @module payment/checkout
 */

import { stripeManager, PaymentStatus, Currency, PaymentMethod } from './stripe';
import { auditLogger, logSuccess, logFailure } from '../security/auditLog';
import { AuditEventType, AuditCategory } from '../security/auditTypes';

/**
 * 结账会话状态
 */
export enum CheckoutStatus {
  CREATED = 'created',
  PAYMENT_PENDING = 'payment_pending',
  PAYMENT_PROCESSING = 'payment_processing',
  PAYMENT_COMPLETED = 'payment_completed',
  PAYMENT_FAILED = 'payment_failed',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

/**
 * 订单项
 */
export interface OrderItem {
  id: string;
  name: string;
  description?: string;
  amount: number;
  quantity: number;
  metadata?: Record<string, any>;
}

/**
 * 结账会话
 */
export interface CheckoutSession {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax?: number;
  discount?: number;
  total: number;
  currency: Currency;
  status: CheckoutStatus;
  paymentIntentId?: string;
  paymentMethod?: PaymentMethod;
  customerId?: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  metadata?: Record<string, any>;
}

/**
 * 结账选项
 */
export interface CheckoutOptions {
  userId: string;
  items: OrderItem[];
  currency?: Currency;
  paymentMethod?: PaymentMethod;
  customerId?: string;
  taxRate?: number;
  discountAmount?: number;
  discountPercent?: number;
  expiresIn?: number;
  metadata?: Record<string, any>;
}

/**
 * 结账流程管理器（单例模式）
 */
export class CheckoutManager {
  private static instance: CheckoutManager;
  private sessions: Map<string, CheckoutSession> = new Map();
  private readonly DEFAULT_EXPIRY = 30 * 60 * 1000; // 30 分钟

  private constructor() {
    // 启动过期检查
    this.startExpiryCheck();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): CheckoutManager {
    if (!this.instance) {
      this.instance = new CheckoutManager();
    }
    return this.instance;
  }

  /**
   * 创建结账会话
   */
  async createSession(options: CheckoutOptions): Promise<CheckoutSession> {
    // 计算总额
    const subtotal = options.items.reduce(
      (sum, item) => sum + item.amount * item.quantity,
      0
    );

    let tax = 0;
    if (options.taxRate) {
      tax = subtotal * options.taxRate;
    }

    let discount = 0;
    if (options.discountAmount) {
      discount = options.discountAmount;
    } else if (options.discountPercent) {
      discount = subtotal * options.discountPercent;
    }

    const total = subtotal + tax - discount;

    if (total <= 0) {
      throw new Error('Total amount must be greater than 0');
    }

    const session: CheckoutSession = {
      id: this.generateSessionId(),
      userId: options.userId,
      items: options.items,
      subtotal,
      tax: tax || undefined,
      discount: discount || undefined,
      total,
      currency: options.currency || Currency.USD,
      status: CheckoutStatus.CREATED,
      customerId: options.customerId,
      paymentMethod: options.paymentMethod,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      expiresAt: Date.now() + (options.expiresIn || this.DEFAULT_EXPIRY),
      metadata: options.metadata,
    };

    this.sessions.set(session.id, session);

    // 记录审计日志
    await logSuccess(AuditEventType.PAYMENT_CREATE, AuditCategory.PAYMENT, {
      userId: session.userId,
      resourceId: session.id,
      details: { total: session.total, currency: session.currency },
    });

    return session;
  }

  /**
   * 初始化支付
   */
  async initiatePayment(sessionId: string): Promise<{ clientSecret: string }> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Checkout session ${sessionId} not found`);
    }

    if (session.status !== CheckoutStatus.CREATED) {
      throw new Error(`Checkout session ${sessionId} is not in created state`);
    }

    // 检查是否过期
    if (Date.now() > session.expiresAt) {
      session.status = CheckoutStatus.EXPIRED;
      session.updatedAt = Date.now();
      throw new Error(`Checkout session ${sessionId} has expired`);
    }

    try {
      // 创建支付意图
      const paymentIntent = await stripeManager.createPaymentIntent(
        session.total,
        session.currency,
        {
          customerId: session.customerId,
          paymentMethod: session.paymentMethod,
          description: `Order ${sessionId}`,
          metadata: {
            sessionId: session.id,
            userId: session.userId,
            ...session.metadata,
          },
        }
      );

      session.paymentIntentId = paymentIntent.id;
      session.status = CheckoutStatus.PAYMENT_PENDING;
      session.updatedAt = Date.now();

      return { clientSecret: paymentIntent.clientSecret };
    } catch (error: any) {
      session.status = CheckoutStatus.PAYMENT_FAILED;
      session.updatedAt = Date.now();

      await logFailure(
        AuditEventType.PAYMENT_FAILED,
        AuditCategory.PAYMENT,
        error.message,
        {
          userId: session.userId,
          resourceId: session.id,
        }
      );

      throw error;
    }
  }

  /**
   * 确认支付
   */
  async confirmPayment(
    sessionId: string,
    paymentMethod: any
  ): Promise<{ success: boolean; error?: string }> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Checkout session ${sessionId} not found`);
    }

    if (!session.paymentIntentId) {
      throw new Error(`No payment intent for session ${sessionId}`);
    }

    session.status = CheckoutStatus.PAYMENT_PROCESSING;
    session.updatedAt = Date.now();

    try {
      // 获取支付意图的 client_secret
      const paymentIntent = await stripeManager.getPaymentIntent(session.paymentIntentId);

      // 确认支付
      const result = await stripeManager.confirmPayment(
        paymentIntent.clientSecret,
        paymentMethod
      );

      if (result.success) {
        session.status = CheckoutStatus.PAYMENT_COMPLETED;
        session.updatedAt = Date.now();

        await logSuccess(AuditEventType.PAYMENT_SUCCESS, AuditCategory.PAYMENT, {
          userId: session.userId,
          resourceId: session.id,
          details: {
            total: session.total,
            currency: session.currency,
            paymentIntentId: session.paymentIntentId,
          },
        });
      } else {
        session.status = CheckoutStatus.PAYMENT_FAILED;
        session.updatedAt = Date.now();

        await logFailure(
          AuditEventType.PAYMENT_FAILED,
          AuditCategory.PAYMENT,
          result.error || 'Payment confirmation failed',
          {
            userId: session.userId,
            resourceId: session.id,
          }
        );
      }

      return result;
    } catch (error: any) {
      session.status = CheckoutStatus.PAYMENT_FAILED;
      session.updatedAt = Date.now();

      await logFailure(
        AuditEventType.PAYMENT_FAILED,
        AuditCategory.PAYMENT,
        error.message,
        {
          userId: session.userId,
          resourceId: session.id,
        }
      );

      return { success: false, error: error.message };
    }
  }

  /**
   * 完成结账（支付成功后调用）
   */
  async completeCheckout(sessionId: string): Promise<CheckoutSession> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Checkout session ${sessionId} not found`);
    }

    if (session.status !== CheckoutStatus.PAYMENT_COMPLETED) {
      throw new Error(`Payment not completed for session ${sessionId}`);
    }

    session.status = CheckoutStatus.COMPLETED;
    session.updatedAt = Date.now();

    return session;
  }

  /**
   * 取消结账
   */
  async cancelCheckout(sessionId: string, userId: string): Promise<boolean> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Checkout session ${sessionId} not found`);
    }

    // 只有会话所有者可以取消
    if (session.userId !== userId) {
      throw new Error('Unauthorized to cancel this checkout session');
    }

    // 只能取消未完成的会话
    if (session.status === CheckoutStatus.COMPLETED) {
      return false;
    }

    session.status = CheckoutStatus.CANCELLED;
    session.updatedAt = Date.now();

    return true;
  }

  /**
   * 获取会话
   */
  getSession(sessionId: string): CheckoutSession | null {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * 获取用户的所有会话
   */
  getUserSessions(userId: string, filter?: { status?: CheckoutStatus }): CheckoutSession[] {
    const sessions = Array.from(this.sessions.values()).filter(
      (session) => session.userId === userId
    );

    if (!filter) return sessions;

    return sessions.filter((session) => {
      if (filter.status && session.status !== filter.status) return false;
      return true;
    });
  }

  /**
   * 申请退款
   */
  async requestRefund(
    sessionId: string,
    amount?: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ): Promise<{ success: boolean; refundId?: string; error?: string }> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      throw new Error(`Checkout session ${sessionId} not found`);
    }

    if (!session.paymentIntentId) {
      throw new Error(`No payment for session ${sessionId}`);
    }

    if (session.status !== CheckoutStatus.COMPLETED) {
      throw new Error(`Cannot refund incomplete checkout session ${sessionId}`);
    }

    try {
      const refund = await stripeManager.createRefund(
        session.paymentIntentId,
        amount,
        reason
      );

      await logSuccess(AuditEventType.PAYMENT_REFUND, AuditCategory.PAYMENT, {
        userId: session.userId,
        resourceId: session.id,
        details: {
          refundId: refund.id,
          amount: refund.amount,
          paymentIntentId: session.paymentIntentId,
        },
      });

      return { success: true, refundId: refund.id };
    } catch (error: any) {
      await logFailure(
        AuditEventType.PAYMENT_REFUND,
        AuditCategory.PAYMENT,
        error.message,
        {
          userId: session.userId,
          resourceId: session.id,
        }
      );

      return { success: false, error: error.message };
    }
  }

  /**
   * 启动过期检查
   */
  private startExpiryCheck(): void {
    setInterval(() => {
      const now = Date.now();

      for (const [id, session] of this.sessions.entries()) {
        if (
          session.status === CheckoutStatus.CREATED ||
          session.status === CheckoutStatus.PAYMENT_PENDING
        ) {
          if (now > session.expiresAt) {
            session.status = CheckoutStatus.EXPIRED;
            session.updatedAt = now;
          }
        }
      }
    }, 60000); // 每分钟检查一次
  }

  /**
   * 清理过期会话
   */
  cleanupExpired(): number {
    let count = 0;
    const now = Date.now();

    for (const [id, session] of this.sessions.entries()) {
      if (session.status === CheckoutStatus.EXPIRED && now > session.expiresAt + 86400000) {
        // 过期超过 24 小时
        this.sessions.delete(id);
        count++;
      }
    }

    return count;
  }

  /**
   * 生成会话 ID
   */
  private generateSessionId(): string {
    return `checkout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalSessions: number;
    byStatus: Record<CheckoutStatus, number>;
    totalRevenue: number;
    averageOrderValue: number;
  } {
    const sessions = Array.from(this.sessions.values());

    const byStatus: Record<CheckoutStatus, number> = {} as any;
    Object.values(CheckoutStatus).forEach((status) => {
      byStatus[status] = 0;
    });

    let totalRevenue = 0;

    sessions.forEach((session) => {
      byStatus[session.status]++;
      if (session.status === CheckoutStatus.COMPLETED) {
        totalRevenue += session.total;
      }
    });

    const completedCount = byStatus[CheckoutStatus.COMPLETED];
    const averageOrderValue = completedCount > 0 ? totalRevenue / completedCount : 0;

    return {
      totalSessions: sessions.length,
      byStatus,
      totalRevenue,
      averageOrderValue,
    };
  }
}

/**
 * 导出单例实例
 */
export const checkoutManager = CheckoutManager.getInstance();

/**
 * React Hook - 使用结账流程
 */
export function useCheckout() {
  const manager = CheckoutManager.getInstance();

  return {
    createSession: (options: CheckoutOptions) => manager.createSession(options),
    initiatePayment: (sessionId: string) => manager.initiatePayment(sessionId),
    confirmPayment: (sessionId: string, paymentMethod: any) =>
      manager.confirmPayment(sessionId, paymentMethod),
    completeCheckout: (sessionId: string) => manager.completeCheckout(sessionId),
    cancelCheckout: (sessionId: string, userId: string) =>
      manager.cancelCheckout(sessionId, userId),
    getSession: (sessionId: string) => manager.getSession(sessionId),
    getUserSessions: (userId: string, filter?: { status?: CheckoutStatus }) =>
      manager.getUserSessions(userId, filter),
    requestRefund: (
      sessionId: string,
      amount?: number,
      reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
    ) => manager.requestRefund(sessionId, amount, reason),
    getStats: () => manager.getStats(),
  };
}

/**
 * 便捷函数 - 快速结账
 */
export async function quickCheckout(
  userId: string,
  items: OrderItem[],
  paymentMethod: any,
  options?: {
    currency?: Currency;
    customerId?: string;
    taxRate?: number;
    discountPercent?: number;
  }
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    // 创建会话
    const session = await checkoutManager.createSession({
      userId,
      items,
      currency: options?.currency,
      customerId: options?.customerId,
      taxRate: options?.taxRate,
      discountPercent: options?.discountPercent,
    });

    // 初始化支付
    await checkoutManager.initiatePayment(session.id);

    // 确认支付
    const result = await checkoutManager.confirmPayment(session.id, paymentMethod);

    if (result.success) {
      await checkoutManager.completeCheckout(session.id);
      return { success: true, sessionId: session.id };
    } else {
      return { success: false, error: result.error };
    }
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
