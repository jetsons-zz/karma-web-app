/**
 * Mock Avatar Data Store
 * 使用 localStorage 持久化 Avatar 数据
 */

import { mockAvatars } from './data';

export interface Avatar {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'working' | 'offline';
  avatar: string;
  description: string;
  skills: string[];
  abilities?: {
    coding?: number;
    design?: number;
    writing?: number;
    analysis?: number;
    communication?: number;
    leadership?: number;
  };
  budget?: number;
  isPublic?: boolean;
  rating: number;
  reviewCount: number;
  performance: {
    totalTasks: number;
    completedTasks: number;
    successRate: number;
    averageTime: number;
  };
  earnings: {
    total: number;
    today: number;
    thisMonth?: number;
  };
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = 'karma_avatars';

/**
 * 初始化存储
 */
function initStorage(): Avatar[] {
  if (typeof window === 'undefined') {
    return mockAvatars;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // 首次访问，使用 mock 数据初始化
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockAvatars));
    return mockAvatars;
  } catch (error) {
    console.error('Failed to init avatar storage:', error);
    return mockAvatars;
  }
}

/**
 * 保存到存储
 */
function saveToStorage(avatars: Avatar[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(avatars));
  } catch (error) {
    console.error('Failed to save avatars:', error);
  }
}

/**
 * 获取所有 Avatars
 */
export function getAllAvatars(): Avatar[] {
  return initStorage();
}

/**
 * 根据ID获取单个 Avatar
 */
export function getAvatarById(id: string): Avatar | undefined {
  const avatars = getAllAvatars();
  return avatars.find(a => a.id === id);
}

/**
 * 创建新 Avatar
 */
export function createAvatar(avatarData: Omit<Avatar, 'id' | 'createdAt' | 'updatedAt'>): Avatar {
  const avatars = getAllAvatars();

  const newAvatar: Avatar = {
    ...avatarData,
    id: `avatar-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    avatar: avatarData.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedAvatars = [...avatars, newAvatar];
  saveToStorage(updatedAvatars);

  return newAvatar;
}

/**
 * 更新 Avatar
 */
export function updateAvatar(id: string, updates: Partial<Avatar>): Avatar | undefined {
  const avatars = getAllAvatars();
  const index = avatars.findIndex(a => a.id === id);

  if (index === -1) {
    return undefined;
  }

  const updatedAvatar: Avatar = {
    ...avatars[index],
    ...updates,
    id: avatars[index].id, // 确保 ID 不被修改
    updatedAt: new Date().toISOString(),
  };

  avatars[index] = updatedAvatar;
  saveToStorage(avatars);

  return updatedAvatar;
}

/**
 * 删除 Avatar
 */
export function deleteAvatar(id: string): boolean {
  const avatars = getAllAvatars();
  const filteredAvatars = avatars.filter(a => a.id !== id);

  if (filteredAvatars.length === avatars.length) {
    return false; // 没有找到要删除的 Avatar
  }

  saveToStorage(filteredAvatars);
  return true;
}

/**
 * 重置为默认 Mock 数据
 */
export function resetToMockData(): void {
  saveToStorage(mockAvatars);
}

/**
 * 清空所有数据
 */
export function clearAllAvatars(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
