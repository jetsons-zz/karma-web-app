/**
 * Mock Subscription Data Store
 * 使用 localStorage 持久化订阅数据
 */

export interface Subscription {
  id: string;
  avatarId: string;
  avatarName: string;
  plan: 'monthly' | 'yearly';
  price: number;
  status: 'active' | 'cancelled' | 'expired' | 'trial';
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  paymentMethod: 'card' | 'alipay' | 'wechat';
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'karma_subscriptions';

/**
 * 初始化存储
 */
function initStorage(): Subscription[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // 首次访问，返回空数组
    return [];
  } catch (error) {
    console.error('Failed to init subscription storage:', error);
    return [];
  }
}

/**
 * 保存到存储
 */
function saveToStorage(subscriptions: Subscription[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subscriptions));
  } catch (error) {
    console.error('Failed to save subscriptions:', error);
  }
}

/**
 * 获取所有订阅
 */
export function getAllSubscriptions(): Subscription[] {
  return initStorage();
}

/**
 * 根据ID获取单个订阅
 */
export function getSubscriptionById(id: string): Subscription | undefined {
  const subscriptions = getAllSubscriptions();
  return subscriptions.find(s => s.id === id);
}

/**
 * 根据 Avatar ID 获取订阅
 */
export function getSubscriptionByAvatarId(avatarId: string): Subscription | undefined {
  const subscriptions = getAllSubscriptions();
  return subscriptions.find(s => s.avatarId === avatarId && s.status === 'active');
}

/**
 * 创建新订阅
 */
export function createSubscription(
  subscriptionData: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
): Subscription {
  const subscriptions = getAllSubscriptions();

  const newSubscription: Subscription = {
    ...subscriptionData,
    id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedSubscriptions = [...subscriptions, newSubscription];
  saveToStorage(updatedSubscriptions);

  return newSubscription;
}

/**
 * 更新订阅
 */
export function updateSubscription(
  id: string,
  updates: Partial<Subscription>
): Subscription | undefined {
  const subscriptions = getAllSubscriptions();
  const index = subscriptions.findIndex(s => s.id === id);

  if (index === -1) {
    return undefined;
  }

  const updatedSubscription: Subscription = {
    ...subscriptions[index],
    ...updates,
    id: subscriptions[index].id, // 确保 ID 不被修改
    updatedAt: new Date().toISOString(),
  };

  subscriptions[index] = updatedSubscription;
  saveToStorage(subscriptions);

  return updatedSubscription;
}

/**
 * 取消订阅
 */
export function cancelSubscription(id: string): boolean {
  const subscription = getSubscriptionById(id);
  if (!subscription) {
    return false;
  }

  return updateSubscription(id, {
    status: 'cancelled',
    autoRenew: false,
  }) !== undefined;
}

/**
 * 删除订阅
 */
export function deleteSubscription(id: string): boolean {
  const subscriptions = getAllSubscriptions();
  const filteredSubscriptions = subscriptions.filter(s => s.id !== id);

  if (filteredSubscriptions.length === subscriptions.length) {
    return false; // 没有找到要删除的订阅
  }

  saveToStorage(filteredSubscriptions);
  return true;
}

/**
 * 获取活跃订阅
 */
export function getActiveSubscriptions(): Subscription[] {
  return getAllSubscriptions().filter(s => s.status === 'active' || s.status === 'trial');
}

/**
 * 检查 Avatar 是否已订阅
 */
export function isAvatarSubscribed(avatarId: string): boolean {
  return getSubscriptionByAvatarId(avatarId) !== undefined;
}

/**
 * 清空所有数据
 */
export function clearAllSubscriptions(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
