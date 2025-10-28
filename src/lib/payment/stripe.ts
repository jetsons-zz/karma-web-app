/**
 * Stripe 支付集成模块
 * 封装 Stripe API 调用
 *
 * @module payment/stripe
 */

import { loadStripe, Stripe as StripeClient } from '@stripe/stripe-js';
import { tokenManager } from '../security/tokenManager';

/**
 * 支付状态
 */
export enum PaymentStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

/**
 * 支付方式
 */
export enum PaymentMethod {
  CARD = 'card',
  ALIPAY = 'alipay',
  WECHAT_PAY = 'wechat_pay',
}

/**
 * 货币
 */
export enum Currency {
  USD = 'usd',
  CNY = 'cny',
  EUR = 'eur',
  GBP = 'gbp',
  JPY = 'jpy',
}

/**
 * 支付意图
 */
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: Currency;
  status: PaymentStatus;
  clientSecret: string;
  paymentMethod?: string;
  createdAt: number;
  metadata?: Record<string, string>;
}

/**
 * 客户信息
 */
export interface Customer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  metadata?: Record<string, string>;
}

/**
 * 价格信息
 */
export interface Price {
  id: string;
  amount: number;
  currency: Currency;
  interval?: 'day' | 'week' | 'month' | 'year';
  intervalCount?: number;
  productId: string;
}

/**
 * Stripe 管理器（单例模式）
 */
export class StripeManager {
  private static instance: StripeManager;
  private stripeClient: StripeClient | null = null;
  private publishableKey: string | null = null;
  private secretKey: string | null = null;

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): StripeManager {
    if (!this.instance) {
      this.instance = new StripeManager();
    }
    return this.instance;
  }

  /**
   * 初始化 Stripe
   */
  async initialize(publishableKey?: string, secretKey?: string): Promise<void> {
    // 从参数、环境变量或 token 管理器获取密钥
    this.publishableKey =
      publishableKey ||
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
      (await tokenManager.getToken('stripe_publishable_key')) ||
      null;

    this.secretKey =
      secretKey ||
      process.env.STRIPE_SECRET_KEY ||
      (await tokenManager.getToken('stripe_secret_key')) ||
      null;

    if (!this.publishableKey) {
      throw new Error('Stripe publishable key not configured');
    }

    // 加载 Stripe 客户端（浏览器端）
    if (typeof window !== 'undefined') {
      this.stripeClient = await loadStripe(this.publishableKey);
    }
  }

  /**
   * 获取 Stripe 客户端
   */
  async getClient(): Promise<StripeClient> {
    if (!this.stripeClient) {
      await this.initialize();
    }

    if (!this.stripeClient) {
      throw new Error('Stripe client not initialized');
    }

    return this.stripeClient;
  }

  /**
   * 创建支付意图（服务器端）
   */
  async createPaymentIntent(
    amount: number,
    currency: Currency,
    options?: {
      customerId?: string;
      paymentMethod?: PaymentMethod;
      description?: string;
      metadata?: Record<string, string>;
    }
  ): Promise<PaymentIntent> {
    const response = await this.callAPI('/v1/payment_intents', 'POST', {
      amount: Math.round(amount * 100), // 转换为最小货币单位
      currency,
      customer: options?.customerId,
      payment_method_types: options?.paymentMethod ? [options.paymentMethod] : ['card'],
      description: options?.description,
      metadata: options?.metadata,
    });

    return {
      id: response.id,
      amount: response.amount / 100,
      currency: response.currency as Currency,
      status: this.mapStatus(response.status),
      clientSecret: response.client_secret,
      paymentMethod: response.payment_method,
      createdAt: response.created * 1000,
      metadata: response.metadata,
    };
  }

  /**
   * 确认支付（客户端）
   */
  async confirmPayment(
    clientSecret: string,
    paymentMethod: any
  ): Promise<{ success: boolean; error?: string }> {
    const stripe = await this.getClient();

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: paymentMethod,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  }

  /**
   * 创建客户
   */
  async createCustomer(
    email: string,
    options?: {
      name?: string;
      phone?: string;
      metadata?: Record<string, string>;
    }
  ): Promise<Customer> {
    const response = await this.callAPI('/v1/customers', 'POST', {
      email,
      name: options?.name,
      phone: options?.phone,
      metadata: options?.metadata,
    });

    return {
      id: response.id,
      email: response.email,
      name: response.name,
      phone: response.phone,
      metadata: response.metadata,
    };
  }

  /**
   * 获取客户
   */
  async getCustomer(customerId: string): Promise<Customer> {
    const response = await this.callAPI(`/v1/customers/${customerId}`, 'GET');

    return {
      id: response.id,
      email: response.email,
      name: response.name,
      phone: response.phone,
      metadata: response.metadata,
    };
  }

  /**
   * 创建价格
   */
  async createPrice(
    productId: string,
    amount: number,
    currency: Currency,
    options?: {
      interval?: 'day' | 'week' | 'month' | 'year';
      intervalCount?: number;
    }
  ): Promise<Price> {
    const data: any = {
      product: productId,
      unit_amount: Math.round(amount * 100),
      currency,
    };

    if (options?.interval) {
      data.recurring = {
        interval: options.interval,
        interval_count: options.intervalCount || 1,
      };
    }

    const response = await this.callAPI('/v1/prices', 'POST', data);

    return {
      id: response.id,
      amount: response.unit_amount / 100,
      currency: response.currency as Currency,
      interval: response.recurring?.interval,
      intervalCount: response.recurring?.interval_count,
      productId: response.product,
    };
  }

  /**
   * 退款
   */
  async createRefund(
    paymentIntentId: string,
    amount?: number,
    reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  ): Promise<{ id: string; status: string; amount: number }> {
    const data: any = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      data.amount = Math.round(amount * 100);
    }

    if (reason) {
      data.reason = reason;
    }

    const response = await this.callAPI('/v1/refunds', 'POST', data);

    return {
      id: response.id,
      status: response.status,
      amount: response.amount / 100,
    };
  }

  /**
   * 获取支付意图
   */
  async getPaymentIntent(paymentIntentId: string): Promise<PaymentIntent> {
    const response = await this.callAPI(`/v1/payment_intents/${paymentIntentId}`, 'GET');

    return {
      id: response.id,
      amount: response.amount / 100,
      currency: response.currency as Currency,
      status: this.mapStatus(response.status),
      clientSecret: response.client_secret,
      paymentMethod: response.payment_method,
      createdAt: response.created * 1000,
      metadata: response.metadata,
    };
  }

  /**
   * 调用 Stripe API
   */
  private async callAPI(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE',
    data?: any
  ): Promise<any> {
    if (!this.secretKey) {
      throw new Error('Stripe secret key not configured');
    }

    const url = `https://api.stripe.com${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    };

    if (data && method !== 'GET') {
      options.body = new URLSearchParams(this.flattenObject(data)).toString();
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Stripe API error');
    }

    return await response.json();
  }

  /**
   * 展平对象（Stripe API 要求）
   */
  private flattenObject(obj: any, prefix = ''): Record<string, string> {
    const flattened: Record<string, string> = {};

    for (const key in obj) {
      if (obj[key] === null || obj[key] === undefined) continue;

      const newKey = prefix ? `${prefix}[${key}]` : key;

      if (typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
        Object.assign(flattened, this.flattenObject(obj[key], newKey));
      } else if (Array.isArray(obj[key])) {
        obj[key].forEach((item: any, index: number) => {
          if (typeof item === 'object') {
            Object.assign(flattened, this.flattenObject(item, `${newKey}[${index}]`));
          } else {
            flattened[`${newKey}[${index}]`] = String(item);
          }
        });
      } else {
        flattened[newKey] = String(obj[key]);
      }
    }

    return flattened;
  }

  /**
   * 映射状态
   */
  private mapStatus(stripeStatus: string): PaymentStatus {
    const statusMap: Record<string, PaymentStatus> = {
      'requires_payment_method': PaymentStatus.PENDING,
      'requires_confirmation': PaymentStatus.PENDING,
      'requires_action': PaymentStatus.PENDING,
      'processing': PaymentStatus.PROCESSING,
      'requires_capture': PaymentStatus.PROCESSING,
      'succeeded': PaymentStatus.SUCCEEDED,
      'canceled': PaymentStatus.CANCELLED,
    };

    return statusMap[stripeStatus] || PaymentStatus.PENDING;
  }

  /**
   * 创建 Stripe Elements（用于卡片输入）
   */
  async createElements(): Promise<any> {
    const stripe = await this.getClient();
    return stripe.elements();
  }

  /**
   * 处理 webhook 事件
   */
  async constructWebhookEvent(
    payload: string | Buffer,
    signature: string,
    webhookSecret: string
  ): Promise<any> {
    // 注意：这个功能需要在服务器端使用 Stripe Node.js SDK
    // 这里只是接口定义
    throw new Error('Webhook event construction should be done on server side');
  }
}

/**
 * 导出单例实例
 */
export const stripeManager = StripeManager.getInstance();

/**
 * React Hook - 使用 Stripe
 */
export function useStripe() {
  const manager = StripeManager.getInstance();

  return {
    initialize: (publishableKey?: string, secretKey?: string) =>
      manager.initialize(publishableKey, secretKey),
    getClient: () => manager.getClient(),
    createPaymentIntent: (
      amount: number,
      currency: Currency,
      options?: {
        customerId?: string;
        paymentMethod?: PaymentMethod;
        description?: string;
        metadata?: Record<string, string>;
      }
    ) => manager.createPaymentIntent(amount, currency, options),
    confirmPayment: (clientSecret: string, paymentMethod: any) =>
      manager.confirmPayment(clientSecret, paymentMethod),
    createCustomer: (
      email: string,
      options?: {
        name?: string;
        phone?: string;
        metadata?: Record<string, string>;
      }
    ) => manager.createCustomer(email, options),
    getCustomer: (customerId: string) => manager.getCustomer(customerId),
    createRefund: (
      paymentIntentId: string,
      amount?: number,
      reason?: 'duplicate' | 'fraudulent' | 'requested_by_customer'
    ) => manager.createRefund(paymentIntentId, amount, reason),
    getPaymentIntent: (paymentIntentId: string) => manager.getPaymentIntent(paymentIntentId),
    createElements: () => manager.createElements(),
  };
}

/**
 * 便捷函数 - 格式化金额
 */
export function formatAmount(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });

  return formatter.format(amount);
}

/**
 * 便捷函数 - 验证卡号
 */
export function validateCardNumber(cardNumber: string): boolean {
  // Luhn 算法
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}
