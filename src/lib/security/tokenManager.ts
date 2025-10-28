/**
 * Token 安全管理模块
 * 使用 IndexedDB 存储加密的 Token
 *
 * @module security/tokenManager
 */

import { encrypt, decrypt } from './encryption';

interface StoredToken {
  key: string;
  value: string;  // 加密后的值
  timestamp: number;
  expiresAt?: number;
}

/**
 * Token 安全管理器（单例模式）
 */
export class SecureTokenManager {
  private static instance: SecureTokenManager;
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'KarmaSecureStorage';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'tokens';

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initDB();
    }
  }

  /**
   * 获取单例实例
   */
  static getInstance(): SecureTokenManager {
    if (!this.instance) {
      this.instance = new SecureTokenManager();
    }
    return this.instance;
  }

  /**
   * 初始化 IndexedDB
   */
  private async initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const objectStore = db.createObjectStore(this.STORE_NAME, { keyPath: 'key' });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('expiresAt', 'expiresAt', { unique: false });
        }
      };
    });
  }

  /**
   * 确保数据库已初始化
   */
  private async ensureDB(): Promise<void> {
    if (!this.db) {
      await this.initDB();
    }
  }

  /**
   * 存储 Token
   *
   * @param key - Token 键名
   * @param token - Token 值
   * @param expiresIn - 过期时间（毫秒），可选
   */
  async storeToken(key: string, token: string, expiresIn?: number): Promise<void> {
    await this.ensureDB();

    // 加密 token
    const encrypted = await encrypt(token);

    const storedToken: StoredToken = {
      key,
      value: encrypted,
      timestamp: Date.now(),
      expiresAt: expiresIn ? Date.now() + expiresIn : undefined,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.put(storedToken);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取 Token
   *
   * @param key - Token 键名
   * @returns Token 值，如果不存在或已过期则返回 null
   */
  async getToken(key: string): Promise<string | null> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(key);

      request.onsuccess = async () => {
        const result = request.result as StoredToken | undefined;

        if (!result) {
          resolve(null);
          return;
        }

        // 检查是否过期
        if (result.expiresAt && Date.now() > result.expiresAt) {
          // 删除过期 token
          await this.deleteToken(key);
          resolve(null);
          return;
        }

        try {
          // 解密 token
          const decrypted = await decrypt(result.value);
          resolve(decrypted);
        } catch (error) {
          console.error('Failed to decrypt token:', error);
          resolve(null);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 删除 Token
   *
   * @param key - Token 键名
   */
  async deleteToken(key: string): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 检查 Token 是否存在且有效
   *
   * @param key - Token 键名
   */
  async hasToken(key: string): Promise<boolean> {
    const token = await this.getToken(key);
    return token !== null;
  }

  /**
   * 更新 Token（如果存在）
   *
   * @param key - Token 键名
   * @param token - 新的 Token 值
   * @param expiresIn - 过期时间（毫秒），可选
   */
  async updateToken(key: string, token: string, expiresIn?: number): Promise<boolean> {
    const exists = await this.hasToken(key);
    if (exists) {
      await this.storeToken(key, token, expiresIn);
      return true;
    }
    return false;
  }

  /**
   * 获取所有 Token 键名
   */
  async getAllKeys(): Promise<string[]> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.getAllKeys();

      request.onsuccess = () => resolve(request.result as string[]);
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 清除所有 Token
   */
  async clearAll(): Promise<void> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 清理过期的 Token
   */
  async cleanupExpired(): Promise<number> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('expiresAt');
      const request = index.openCursor();

      let deletedCount = 0;
      const now = Date.now();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

        if (cursor) {
          const token = cursor.value as StoredToken;

          if (token.expiresAt && now > token.expiresAt) {
            cursor.delete();
            deletedCount++;
          }

          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 获取 Token 的过期时间
   *
   * @param key - Token 键名
   * @returns 过期时间戳，如果不存在或无过期时间则返回 null
   */
  async getTokenExpiry(key: string): Promise<number | null> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(key);

      request.onsuccess = () => {
        const result = request.result as StoredToken | undefined;
        resolve(result?.expiresAt || null);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 检查 Token 是否即将过期（默认 5 分钟）
   *
   * @param key - Token 键名
   * @param threshold - 阈值（毫秒），默认 5 分钟
   */
  async isTokenExpiringSoon(key: string, threshold: number = 5 * 60 * 1000): Promise<boolean> {
    const expiresAt = await this.getTokenExpiry(key);

    if (!expiresAt) return false;

    return Date.now() + threshold > expiresAt;
  }
}

/**
 * 导出单例实例的便捷方法
 */
export const tokenManager = SecureTokenManager.getInstance();

/**
 * React Hook 包装
 */
export function useTokenManager() {
  const manager = SecureTokenManager.getInstance();

  return {
    storeToken: manager.storeToken.bind(manager),
    getToken: manager.getToken.bind(manager),
    deleteToken: manager.deleteToken.bind(manager),
    hasToken: manager.hasToken.bind(manager),
    updateToken: manager.updateToken.bind(manager),
    cleanupExpired: manager.cleanupExpired.bind(manager),
    isTokenExpiringSoon: manager.isTokenExpiringSoon.bind(manager),
  };
}
