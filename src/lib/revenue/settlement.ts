/**
 * 收益结算模块
 * 管理创作者收益和提现
 *
 * @module revenue/settlement
 */

import { Currency } from '../payment/stripe';
import { auditLogger, logSuccess, logFailure } from '../security/auditLog';
import { AuditEventType, AuditCategory } from '../security/auditTypes';

/**
 * 交易类型
 */
export enum TransactionType {
  SALE = 'sale',
  REFUND = 'refund',
  WITHDRAWAL = 'withdrawal',
  COMMISSION = 'commission',
  BONUS = 'bonus',
  ADJUSTMENT = 'adjustment',
}

/**
 * 提现状态
 */
export enum WithdrawalStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * 交易记录
 */
export interface Transaction {
  id: string;
  creatorId: string;
  type: TransactionType;
  amount: number;
  currency: Currency;
  description: string;
  relatedId?: string; // 关联的订单/技能 ID
  createdAt: number;
  metadata?: Record<string, any>;
}

/**
 * 提现请求
 */
export interface WithdrawalRequest {
  id: string;
  creatorId: string;
  amount: number;
  currency: Currency;
  status: WithdrawalStatus;
  method: 'bank_transfer' | 'paypal' | 'stripe';
  accountInfo: Record<string, any>;
  createdAt: number;
  processedAt?: number;
  completedAt?: number;
  error?: string;
  metadata?: Record<string, any>;
}

/**
 * 创作者账户
 */
export interface CreatorAccount {
  creatorId: string;
  balance: number;
  currency: Currency;
  totalEarned: number;
  totalWithdrawn: number;
  pendingWithdrawal: number;
  commissionRate: number; // 平台佣金率 (0-1)
  createdAt: number;
  updatedAt: number;
  metadata?: Record<string, any>;
}

/**
 * 收益统计
 */
export interface RevenueStats {
  totalRevenue: number;
  totalCommission: number;
  netRevenue: number;
  transactionCount: number;
  byType: Record<TransactionType, { count: number; amount: number }>;
  topCreators: Array<{ creatorId: string; revenue: number }>;
}

/**
 * 收益结算管理器（单例模式）
 */
export class RevenueSettlementManager {
  private static instance: RevenueSettlementManager;
  private accounts: Map<string, CreatorAccount> = new Map();
  private transactions: Map<string, Transaction> = new Map();
  private withdrawals: Map<string, WithdrawalRequest> = new Map();
  private readonly DEFAULT_COMMISSION_RATE = 0.3; // 30% 平台佣金
  private readonly MIN_WITHDRAWAL_AMOUNT = 10; // 最小提现金额

  private constructor() {
    // 启动自动结算检查
    this.startAutoSettlement();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): RevenueSettlementManager {
    if (!this.instance) {
      this.instance = new RevenueSettlementManager();
    }
    return this.instance;
  }

  /**
   * 创建或获取创作者账户
   */
  getOrCreateAccount(
    creatorId: string,
    currency: Currency = Currency.USD,
    commissionRate?: number
  ): CreatorAccount {
    let account = this.accounts.get(creatorId);

    if (!account) {
      account = {
        creatorId,
        balance: 0,
        currency,
        totalEarned: 0,
        totalWithdrawn: 0,
        pendingWithdrawal: 0,
        commissionRate: commissionRate ?? this.DEFAULT_COMMISSION_RATE,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      this.accounts.set(creatorId, account);
    }

    return account;
  }

  /**
   * 记录销售收益
   */
  async recordSale(
    creatorId: string,
    amount: number,
    currency: Currency,
    options?: {
      relatedId?: string;
      description?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<Transaction> {
    const account = this.getOrCreateAccount(creatorId, currency);

    // 计算平台佣金
    const commission = amount * account.commissionRate;
    const netAmount = amount - commission;

    // 创建交易记录
    const transaction: Transaction = {
      id: this.generateTransactionId(),
      creatorId,
      type: TransactionType.SALE,
      amount: netAmount,
      currency,
      description: options?.description || 'Sale revenue',
      relatedId: options?.relatedId,
      createdAt: Date.now(),
      metadata: {
        ...options?.metadata,
        grossAmount: amount,
        commission,
        commissionRate: account.commissionRate,
      },
    };

    this.transactions.set(transaction.id, transaction);

    // 更新账户余额
    account.balance += netAmount;
    account.totalEarned += netAmount;
    account.updatedAt = Date.now();

    // 记录平台佣金
    await this.recordCommission(amount, commission, currency, transaction.id);

    // 审计日志
    await logSuccess(AuditEventType.REVENUE_VIEW, AuditCategory.PAYMENT, {
      userId: creatorId,
      resourceId: transaction.id,
      details: { amount: netAmount, currency, type: 'sale' },
    });

    return transaction;
  }

  /**
   * 记录退款
   */
  async recordRefund(
    creatorId: string,
    amount: number,
    currency: Currency,
    options?: {
      relatedId?: string;
      description?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<Transaction> {
    const account = this.getOrCreateAccount(creatorId, currency);

    // 退款从创作者余额扣除
    const transaction: Transaction = {
      id: this.generateTransactionId(),
      creatorId,
      type: TransactionType.REFUND,
      amount: -amount, // 负数表示扣除
      currency,
      description: options?.description || 'Refund',
      relatedId: options?.relatedId,
      createdAt: Date.now(),
      metadata: options?.metadata,
    };

    this.transactions.set(transaction.id, transaction);

    // 更新账户余额
    account.balance -= amount;
    account.updatedAt = Date.now();

    // 审计日志
    await logSuccess(AuditEventType.REVENUE_VIEW, AuditCategory.PAYMENT, {
      userId: creatorId,
      resourceId: transaction.id,
      details: { amount: -amount, currency, type: 'refund' },
    });

    return transaction;
  }

  /**
   * 创建提现请求
   */
  async createWithdrawal(
    creatorId: string,
    amount: number,
    method: 'bank_transfer' | 'paypal' | 'stripe',
    accountInfo: Record<string, any>
  ): Promise<WithdrawalRequest> {
    const account = this.accounts.get(creatorId);

    if (!account) {
      throw new Error('Creator account not found');
    }

    // 验证提现金额
    if (amount < this.MIN_WITHDRAWAL_AMOUNT) {
      throw new Error(`Minimum withdrawal amount is ${this.MIN_WITHDRAWAL_AMOUNT}`);
    }

    if (amount > account.balance - account.pendingWithdrawal) {
      throw new Error('Insufficient balance');
    }

    const withdrawal: WithdrawalRequest = {
      id: this.generateWithdrawalId(),
      creatorId,
      amount,
      currency: account.currency,
      status: WithdrawalStatus.PENDING,
      method,
      accountInfo,
      createdAt: Date.now(),
    };

    this.withdrawals.set(withdrawal.id, withdrawal);

    // 更新待提现金额
    account.pendingWithdrawal += amount;
    account.updatedAt = Date.now();

    // 审计日志
    await logSuccess(AuditEventType.REVENUE_WITHDRAW, AuditCategory.PAYMENT, {
      userId: creatorId,
      resourceId: withdrawal.id,
      details: { amount, currency: account.currency, method },
    });

    return withdrawal;
  }

  /**
   * 处理提现
   */
  async processWithdrawal(withdrawalId: string): Promise<WithdrawalRequest> {
    const withdrawal = this.withdrawals.get(withdrawalId);

    if (!withdrawal) {
      throw new Error(`Withdrawal ${withdrawalId} not found`);
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new Error(`Withdrawal ${withdrawalId} is not pending`);
    }

    withdrawal.status = WithdrawalStatus.PROCESSING;
    withdrawal.processedAt = Date.now();

    // 这里应该调用实际的支付接口（Stripe、PayPal等）
    // 模拟处理过程
    try {
      // await actualPaymentProcessing(withdrawal);

      await this.completeWithdrawal(withdrawalId);
    } catch (error: any) {
      await this.failWithdrawal(withdrawalId, error.message);
    }

    return withdrawal;
  }

  /**
   * 完成提现
   */
  async completeWithdrawal(withdrawalId: string): Promise<WithdrawalRequest> {
    const withdrawal = this.withdrawals.get(withdrawalId);

    if (!withdrawal) {
      throw new Error(`Withdrawal ${withdrawalId} not found`);
    }

    const account = this.accounts.get(withdrawal.creatorId);

    if (!account) {
      throw new Error('Creator account not found');
    }

    withdrawal.status = WithdrawalStatus.COMPLETED;
    withdrawal.completedAt = Date.now();

    // 更新账户
    account.balance -= withdrawal.amount;
    account.pendingWithdrawal -= withdrawal.amount;
    account.totalWithdrawn += withdrawal.amount;
    account.updatedAt = Date.now();

    // 创建提现交易记录
    const transaction: Transaction = {
      id: this.generateTransactionId(),
      creatorId: withdrawal.creatorId,
      type: TransactionType.WITHDRAWAL,
      amount: -withdrawal.amount,
      currency: withdrawal.currency,
      description: `Withdrawal via ${withdrawal.method}`,
      relatedId: withdrawal.id,
      createdAt: Date.now(),
    };

    this.transactions.set(transaction.id, transaction);

    return withdrawal;
  }

  /**
   * 提现失败
   */
  async failWithdrawal(withdrawalId: string, error: string): Promise<WithdrawalRequest> {
    const withdrawal = this.withdrawals.get(withdrawalId);

    if (!withdrawal) {
      throw new Error(`Withdrawal ${withdrawalId} not found`);
    }

    const account = this.accounts.get(withdrawal.creatorId);

    if (!account) {
      throw new Error('Creator account not found');
    }

    withdrawal.status = WithdrawalStatus.FAILED;
    withdrawal.error = error;

    // 释放待提现金额
    account.pendingWithdrawal -= withdrawal.amount;
    account.updatedAt = Date.now();

    // 审计日志
    await logFailure(
      AuditEventType.REVENUE_WITHDRAW,
      AuditCategory.PAYMENT,
      error,
      {
        userId: withdrawal.creatorId,
        resourceId: withdrawal.id,
      }
    );

    return withdrawal;
  }

  /**
   * 取消提现
   */
  async cancelWithdrawal(withdrawalId: string, creatorId: string): Promise<WithdrawalRequest> {
    const withdrawal = this.withdrawals.get(withdrawalId);

    if (!withdrawal) {
      throw new Error(`Withdrawal ${withdrawalId} not found`);
    }

    if (withdrawal.creatorId !== creatorId) {
      throw new Error('Unauthorized');
    }

    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new Error('Can only cancel pending withdrawals');
    }

    const account = this.accounts.get(creatorId);

    if (!account) {
      throw new Error('Creator account not found');
    }

    withdrawal.status = WithdrawalStatus.CANCELLED;

    // 释放待提现金额
    account.pendingWithdrawal -= withdrawal.amount;
    account.updatedAt = Date.now();

    return withdrawal;
  }

  /**
   * 获取账户信息
   */
  getAccount(creatorId: string): CreatorAccount | null {
    return this.accounts.get(creatorId) || null;
  }

  /**
   * 获取交易记录
   */
  getTransactions(
    creatorId: string,
    filter?: {
      type?: TransactionType;
      startDate?: number;
      endDate?: number;
    }
  ): Transaction[] {
    const transactions = Array.from(this.transactions.values()).filter(
      (tx) => tx.creatorId === creatorId
    );

    if (!filter) return transactions;

    return transactions.filter((tx) => {
      if (filter.type && tx.type !== filter.type) return false;
      if (filter.startDate && tx.createdAt < filter.startDate) return false;
      if (filter.endDate && tx.createdAt > filter.endDate) return false;
      return true;
    });
  }

  /**
   * 获取提现记录
   */
  getWithdrawals(
    creatorId: string,
    filter?: { status?: WithdrawalStatus }
  ): WithdrawalRequest[] {
    const withdrawals = Array.from(this.withdrawals.values()).filter(
      (w) => w.creatorId === creatorId
    );

    if (!filter) return withdrawals;

    return withdrawals.filter((w) => {
      if (filter.status && w.status !== filter.status) return false;
      return true;
    });
  }

  /**
   * 记录平台佣金
   */
  private async recordCommission(
    grossAmount: number,
    commission: number,
    currency: Currency,
    relatedId: string
  ): Promise<void> {
    const transaction: Transaction = {
      id: this.generateTransactionId(),
      creatorId: 'platform', // 平台账户
      type: TransactionType.COMMISSION,
      amount: commission,
      currency,
      description: 'Platform commission',
      relatedId,
      createdAt: Date.now(),
      metadata: { grossAmount },
    };

    this.transactions.set(transaction.id, transaction);
  }

  /**
   * 启动自动结算
   */
  private startAutoSettlement(): void {
    // 每天检查待处理的提现
    setInterval(() => {
      for (const withdrawal of this.withdrawals.values()) {
        if (withdrawal.status === WithdrawalStatus.PENDING) {
          // 可以在这里自动处理提现
          // this.processWithdrawal(withdrawal.id);
        }
      }
    }, 24 * 60 * 60 * 1000); // 24小时
  }

  /**
   * 生成交易 ID
   */
  private generateTransactionId(): string {
    return `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成提现 ID
   */
  private generateWithdrawalId(): string {
    return `wdr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取收益统计
   */
  getStats(period?: { startDate: number; endDate: number }): RevenueStats {
    const transactions = Array.from(this.transactions.values()).filter((tx) => {
      if (!period) return true;
      return tx.createdAt >= period.startDate && tx.createdAt <= period.endDate;
    });

    const byType: Record<TransactionType, { count: number; amount: number }> = {} as any;

    Object.values(TransactionType).forEach((type) => {
      byType[type] = { count: 0, amount: 0 };
    });

    let totalRevenue = 0;
    let totalCommission = 0;

    const creatorRevenue: Record<string, number> = {};

    transactions.forEach((tx) => {
      byType[tx.type].count++;
      byType[tx.type].amount += tx.amount;

      if (tx.type === TransactionType.SALE) {
        totalRevenue += tx.amount;
        creatorRevenue[tx.creatorId] = (creatorRevenue[tx.creatorId] || 0) + tx.amount;
      } else if (tx.type === TransactionType.COMMISSION) {
        totalCommission += tx.amount;
      }
    });

    const topCreators = Object.entries(creatorRevenue)
      .map(([creatorId, revenue]) => ({ creatorId, revenue }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    return {
      totalRevenue,
      totalCommission,
      netRevenue: totalRevenue - totalCommission,
      transactionCount: transactions.length,
      byType,
      topCreators,
    };
  }
}

/**
 * 导出单例实例
 */
export const revenueSettlement = RevenueSettlementManager.getInstance();

/**
 * React Hook - 使用收益结算
 */
export function useRevenue(creatorId: string) {
  const manager = RevenueSettlementManager.getInstance();

  return {
    getAccount: () => manager.getAccount(creatorId),
    getTransactions: (filter?: {
      type?: TransactionType;
      startDate?: number;
      endDate?: number;
    }) => manager.getTransactions(creatorId, filter),
    getWithdrawals: (filter?: { status?: WithdrawalStatus }) =>
      manager.getWithdrawals(creatorId, filter),
    createWithdrawal: (
      amount: number,
      method: 'bank_transfer' | 'paypal' | 'stripe',
      accountInfo: Record<string, any>
    ) => manager.createWithdrawal(creatorId, amount, method, accountInfo),
    cancelWithdrawal: (withdrawalId: string) =>
      manager.cancelWithdrawal(withdrawalId, creatorId),
  };
}
