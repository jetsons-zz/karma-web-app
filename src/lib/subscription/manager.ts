/**
 * 订阅管理模块
 * 管理用户订阅和计费周期
 *
 * @module subscription/manager
 */

import { stripeManager, Currency } from '../payment/stripe';
import { auditLogger, logSuccess, logFailure } from '../security/auditLog';
import { AuditEventType, AuditCategory } from '../security/auditTypes';

/**
 * 订阅状态
 */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  PAUSED = 'paused',
}

/**
 * 订阅计划
 */
export interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  amount: number;
  currency: Currency;
  interval: 'day' | 'week' | 'month' | 'year';
  intervalCount: number;
  trialDays?: number;
  features: string[];
  metadata?: Record<string, any>;
}

/**
 * 订阅
 */
export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  status: SubscriptionStatus;
  customerId?: string;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAt?: number;
  canceledAt?: number;
  trialStart?: number;
  trialEnd?: number;
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, any>;
}

/**
 * 使用配额
 */
export interface UsageQuota {
  subscriptionId: string;
  feature: string;
  limit: number;
  used: number;
  resetAt: number;
}

/**
 * 订阅管理器（单例模式）
 */
export class SubscriptionManager {
  private static instance: SubscriptionManager;
  private plans: Map<string, SubscriptionPlan> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private quotas: Map<string, UsageQuota> = new Map();

  private constructor() {
    // 初始化预定义计划
    this.initializeDefaultPlans();
    // 启动续费检查
    this.startRenewalCheck();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): SubscriptionManager {
    if (!this.instance) {
      this.instance = new SubscriptionManager();
    }
    return this.instance;
  }

  /**
   * 初始化默认计划
   */
  private initializeDefaultPlans(): void {
    const plans: SubscriptionPlan[] = [
      {
        id: 'free',
        name: '免费版',
        amount: 0,
        currency: Currency.USD,
        interval: 'month',
        intervalCount: 1,
        features: ['5 个任务/月', '1 个分身', '基础功能'],
      },
      {
        id: 'basic',
        name: '基础版',
        amount: 9.99,
        currency: Currency.USD,
        interval: 'month',
        intervalCount: 1,
        trialDays: 7,
        features: ['50 个任务/月', '3 个分身', '语音识别', '图像理解'],
      },
      {
        id: 'pro',
        name: '专业版',
        amount: 29.99,
        currency: Currency.USD,
        interval: 'month',
        intervalCount: 1,
        trialDays: 14,
        features: ['无限任务', '10 个分身', '所有高级功能', '优先支持'],
      },
      {
        id: 'enterprise',
        name: '企业版',
        amount: 99.99,
        currency: Currency.USD,
        interval: 'month',
        intervalCount: 1,
        features: ['无限任务', '无限分身', '定制功能', '专属支持', 'SLA 保证'],
      },
    ];

    plans.forEach((plan) => this.plans.set(plan.id, plan));
  }

  /**
   * 创建订阅
   */
  async createSubscription(
    userId: string,
    planId: string,
    options?: {
      customerId?: string;
      trialDays?: number;
      metadata?: Record<string, any>;
    }
  ): Promise<Subscription> {
    const plan = this.plans.get(planId);

    if (!plan) {
      throw new Error(`Plan ${planId} not found`);
    }

    // 检查用户是否已有活跃订阅
    const existingSubscription = this.getUserActiveSubscription(userId);
    if (existingSubscription) {
      throw new Error('User already has an active subscription');
    }

    const now = Date.now();
    const trialDays = options?.trialDays ?? plan.trialDays ?? 0;

    let currentPeriodStart = now;
    let currentPeriodEnd: number;
    let trialStart: number | undefined;
    let trialEnd: number | undefined;
    let status: SubscriptionStatus;

    if (trialDays > 0) {
      // 试用期
      status = SubscriptionStatus.TRIALING;
      trialStart = now;
      trialEnd = now + trialDays * 24 * 60 * 60 * 1000;
      currentPeriodEnd = trialEnd;
    } else {
      // 正常计费
      status = SubscriptionStatus.ACTIVE;
      currentPeriodEnd = this.calculateNextBillingDate(
        now,
        plan.interval,
        plan.intervalCount
      );
    }

    const subscription: Subscription = {
      id: this.generateSubscriptionId(),
      userId,
      planId,
      status,
      customerId: options?.customerId,
      currentPeriodStart,
      currentPeriodEnd,
      trialStart,
      trialEnd,
      createdAt: now,
      updatedAt: now,
      metadata: options?.metadata,
    };

    this.subscriptions.set(subscription.id, subscription);

    // 初始化配额
    this.initializeQuotas(subscription);

    // 记录审计日志
    await logSuccess(AuditEventType.SUBSCRIPTION_CREATE, AuditCategory.SUBSCRIPTION, {
      userId,
      resourceId: subscription.id,
      details: { planId, status },
    });

    return subscription;
  }

  /**
   * 取消订阅
   */
  async cancelSubscription(
    subscriptionId: string,
    cancelAt?: 'now' | 'period_end'
  ): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);

    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      return subscription;
    }

    const now = Date.now();

    if (cancelAt === 'now') {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.canceledAt = now;
      subscription.cancelAt = now;
    } else {
      // 期末取消
      subscription.cancelAt = subscription.currentPeriodEnd;
    }

    subscription.updatedAt = now;

    // 记录审计日志
    await logSuccess(AuditEventType.SUBSCRIPTION_CANCEL, AuditCategory.SUBSCRIPTION, {
      userId: subscription.userId,
      resourceId: subscription.id,
      details: { cancelAt: cancelAt || 'period_end' },
    });

    return subscription;
  }

  /**
   * 续费订阅
   */
  async renewSubscription(subscriptionId: string): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);

    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const plan = this.plans.get(subscription.planId);

    if (!plan) {
      throw new Error(`Plan ${subscription.planId} not found`);
    }

    // 检查是否需要续费
    const now = Date.now();
    if (now < subscription.currentPeriodEnd) {
      return subscription; // 还未到期
    }

    // 检查是否设置了取消
    if (subscription.cancelAt && now >= subscription.cancelAt) {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.canceledAt = now;
      subscription.updatedAt = now;
      return subscription;
    }

    // 续费
    subscription.currentPeriodStart = subscription.currentPeriodEnd;
    subscription.currentPeriodEnd = this.calculateNextBillingDate(
      subscription.currentPeriodEnd,
      plan.interval,
      plan.intervalCount
    );
    subscription.updatedAt = now;

    // 如果处于试用期，现在转为活跃
    if (subscription.status === SubscriptionStatus.TRIALING) {
      subscription.status = SubscriptionStatus.ACTIVE;
    }

    // 重置配额
    this.resetQuotas(subscription);

    // 记录审计日志
    await logSuccess(AuditEventType.SUBSCRIPTION_RENEW, AuditCategory.SUBSCRIPTION, {
      userId: subscription.userId,
      resourceId: subscription.id,
      details: {
        newPeriodEnd: subscription.currentPeriodEnd,
      },
    });

    return subscription;
  }

  /**
   * 更改订阅计划
   */
  async changePlan(subscriptionId: string, newPlanId: string): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);

    if (!subscription) {
      throw new Error(`Subscription ${subscriptionId} not found`);
    }

    const newPlan = this.plans.get(newPlanId);

    if (!newPlan) {
      throw new Error(`Plan ${newPlanId} not found`);
    }

    if (subscription.planId === newPlanId) {
      return subscription; // 相同计划
    }

    subscription.planId = newPlanId;
    subscription.updatedAt = Date.now();

    // 更新配额
    this.initializeQuotas(subscription);

    // 记录审计日志
    await logSuccess(AuditEventType.SUBSCRIPTION_UPDATE, AuditCategory.SUBSCRIPTION, {
      userId: subscription.userId,
      resourceId: subscription.id,
      details: { newPlanId },
    });

    return subscription;
  }

  /**
   * 获取订阅
   */
  getSubscription(subscriptionId: string): Subscription | null {
    return this.subscriptions.get(subscriptionId) || null;
  }

  /**
   * 获取用户的活跃订阅
   */
  getUserActiveSubscription(userId: string): Subscription | null {
    for (const subscription of this.subscriptions.values()) {
      if (
        subscription.userId === userId &&
        (subscription.status === SubscriptionStatus.ACTIVE ||
          subscription.status === SubscriptionStatus.TRIALING)
      ) {
        return subscription;
      }
    }
    return null;
  }

  /**
   * 获取用户的所有订阅
   */
  getUserSubscriptions(userId: string): Subscription[] {
    return Array.from(this.subscriptions.values()).filter(
      (sub) => sub.userId === userId
    );
  }

  /**
   * 获取计划
   */
  getPlan(planId: string): SubscriptionPlan | null {
    return this.plans.get(planId) || null;
  }

  /**
   * 获取所有计划
   */
  getAllPlans(): SubscriptionPlan[] {
    return Array.from(this.plans.values());
  }

  /**
   * 检查配额
   */
  checkQuota(subscriptionId: string, feature: string): boolean {
    const key = `${subscriptionId}_${feature}`;
    const quota = this.quotas.get(key);

    if (!quota) return true; // 无限制

    // 检查是否需要重置
    if (Date.now() > quota.resetAt) {
      quota.used = 0;
      quota.resetAt = this.calculateNextResetDate(quota.resetAt);
    }

    return quota.used < quota.limit;
  }

  /**
   * 使用配额
   */
  useQuota(subscriptionId: string, feature: string, amount = 1): boolean {
    const key = `${subscriptionId}_${feature}`;
    const quota = this.quotas.get(key);

    if (!quota) return true; // 无限制

    // 检查是否需要重置
    if (Date.now() > quota.resetAt) {
      quota.used = 0;
      quota.resetAt = this.calculateNextResetDate(quota.resetAt);
    }

    if (quota.used + amount > quota.limit) {
      return false; // 超出配额
    }

    quota.used += amount;
    return true;
  }

  /**
   * 获取配额使用情况
   */
  getQuotaUsage(subscriptionId: string, feature: string): UsageQuota | null {
    const key = `${subscriptionId}_${feature}`;
    return this.quotas.get(key) || null;
  }

  /**
   * 初始化配额
   */
  private initializeQuotas(subscription: Subscription): void {
    const plan = this.plans.get(subscription.planId);
    if (!plan) return;

    // 这里可以根据计划定义配额
    // 示例：基础版每月 50 个任务
    if (plan.id === 'free') {
      this.setQuota(subscription.id, 'tasks', 5, subscription.currentPeriodEnd);
    } else if (plan.id === 'basic') {
      this.setQuota(subscription.id, 'tasks', 50, subscription.currentPeriodEnd);
    } else if (plan.id === 'pro') {
      // 无限制，不设置配额
    }
  }

  /**
   * 设置配额
   */
  private setQuota(
    subscriptionId: string,
    feature: string,
    limit: number,
    resetAt: number
  ): void {
    const key = `${subscriptionId}_${feature}`;
    this.quotas.set(key, {
      subscriptionId,
      feature,
      limit,
      used: 0,
      resetAt,
    });
  }

  /**
   * 重置配额
   */
  private resetQuotas(subscription: Subscription): void {
    for (const [key, quota] of this.quotas.entries()) {
      if (quota.subscriptionId === subscription.id) {
        quota.used = 0;
        quota.resetAt = subscription.currentPeriodEnd;
      }
    }
  }

  /**
   * 计算下次计费日期
   */
  private calculateNextBillingDate(
    from: number,
    interval: 'day' | 'week' | 'month' | 'year',
    intervalCount: number
  ): number {
    const date = new Date(from);

    switch (interval) {
      case 'day':
        date.setDate(date.getDate() + intervalCount);
        break;
      case 'week':
        date.setDate(date.getDate() + intervalCount * 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() + intervalCount);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() + intervalCount);
        break;
    }

    return date.getTime();
  }

  /**
   * 计算下次重置日期
   */
  private calculateNextResetDate(from: number): number {
    return this.calculateNextBillingDate(from, 'month', 1);
  }

  /**
   * 启动续费检查
   */
  private startRenewalCheck(): void {
    setInterval(async () => {
      const now = Date.now();

      for (const subscription of this.subscriptions.values()) {
        if (
          (subscription.status === SubscriptionStatus.ACTIVE ||
            subscription.status === SubscriptionStatus.TRIALING) &&
          now >= subscription.currentPeriodEnd
        ) {
          await this.renewSubscription(subscription.id);
        }
      }
    }, 60000); // 每分钟检查一次
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
    totalSubscriptions: number;
    byStatus: Record<SubscriptionStatus, number>;
    byPlan: Record<string, number>;
    monthlyRecurringRevenue: number;
  } {
    const subscriptions = Array.from(this.subscriptions.values());

    const byStatus: Record<SubscriptionStatus, number> = {} as any;
    const byPlan: Record<string, number> = {};

    Object.values(SubscriptionStatus).forEach((status) => {
      byStatus[status] = 0;
    });

    let monthlyRecurringRevenue = 0;

    subscriptions.forEach((sub) => {
      byStatus[sub.status]++;
      byPlan[sub.planId] = (byPlan[sub.planId] || 0) + 1;

      if (sub.status === SubscriptionStatus.ACTIVE) {
        const plan = this.plans.get(sub.planId);
        if (plan) {
          // 转换为月收入
          let monthlyAmount = plan.amount;
          if (plan.interval === 'year') {
            monthlyAmount = plan.amount / 12;
          } else if (plan.interval === 'day') {
            monthlyAmount = plan.amount * 30;
          } else if (plan.interval === 'week') {
            monthlyAmount = plan.amount * 4;
          }
          monthlyRecurringRevenue += monthlyAmount;
        }
      }
    });

    return {
      totalSubscriptions: subscriptions.length,
      byStatus,
      byPlan,
      monthlyRecurringRevenue,
    };
  }
}

/**
 * 导出单例实例
 */
export const subscriptionManager = SubscriptionManager.getInstance();

/**
 * React Hook - 使用订阅管理
 */
export function useSubscription(userId: string) {
  const manager = SubscriptionManager.getInstance();

  return {
    createSubscription: (
      planId: string,
      options?: {
        customerId?: string;
        trialDays?: number;
        metadata?: Record<string, any>;
      }
    ) => manager.createSubscription(userId, planId, options),
    cancelSubscription: (subscriptionId: string, cancelAt?: 'now' | 'period_end') =>
      manager.cancelSubscription(subscriptionId, cancelAt),
    changePlan: (subscriptionId: string, newPlanId: string) =>
      manager.changePlan(subscriptionId, newPlanId),
    getActiveSubscription: () => manager.getUserActiveSubscription(userId),
    getAllSubscriptions: () => manager.getUserSubscriptions(userId),
    getAllPlans: () => manager.getAllPlans(),
    getPlan: (planId: string) => manager.getPlan(planId),
    checkQuota: (subscriptionId: string, feature: string) =>
      manager.checkQuota(subscriptionId, feature),
    useQuota: (subscriptionId: string, feature: string, amount?: number) =>
      manager.useQuota(subscriptionId, feature, amount),
    getQuotaUsage: (subscriptionId: string, feature: string) =>
      manager.getQuotaUsage(subscriptionId, feature),
  };
}
