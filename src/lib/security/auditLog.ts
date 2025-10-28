/**
 * 审计日志管理模块
 * 提供审计日志的记录、查询和分析功能
 *
 * @module security/auditLog
 */

import { nanoid } from 'nanoid';
import {
  AuditLogEntry,
  AuditLogQuery,
  AuditLogQueryResult,
  AuditStatistics,
  AuditEventType,
  AuditCategory,
  AuditSeverity,
} from './auditTypes';

/**
 * 审计日志管理器（单例模式）
 * 使用 IndexedDB 存储审计日志
 */
export class AuditLogManager {
  private static instance: AuditLogManager;
  private db: IDBDatabase | null = null;
  private readonly DB_NAME = 'KarmaAuditLogs';
  private readonly DB_VERSION = 1;
  private readonly STORE_NAME = 'audit_logs';

  private constructor() {
    if (typeof window !== 'undefined') {
      this.initDB();
    }
  }

  /**
   * 获取单例实例
   */
  static getInstance(): AuditLogManager {
    if (!this.instance) {
      this.instance = new AuditLogManager();
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
        console.error('Failed to open audit log database:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(this.STORE_NAME)) {
          const objectStore = db.createObjectStore(this.STORE_NAME, { keyPath: 'id' });

          // 创建索引以支持高效查询
          objectStore.createIndex('userId', 'userId', { unique: false });
          objectStore.createIndex('eventType', 'eventType', { unique: false });
          objectStore.createIndex('category', 'category', { unique: false });
          objectStore.createIndex('severity', 'severity', { unique: false });
          objectStore.createIndex('timestamp', 'timestamp', { unique: false });
          objectStore.createIndex('success', 'success', { unique: false });
          objectStore.createIndex('resourceId', 'resourceId', { unique: false });
          objectStore.createIndex('ipAddress', 'ipAddress', { unique: false });
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
   * 记录审计日志
   */
  async log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): Promise<string> {
    await this.ensureDB();

    const logEntry: AuditLogEntry = {
      id: nanoid(),
      timestamp: Date.now(),
      ...entry,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.add(logEntry);

      request.onsuccess = () => {
        // 在开发环境输出日志
        if (process.env.NODE_ENV === 'development') {
          console.log('[Audit]', logEntry.eventType, logEntry);
        }
        resolve(logEntry.id);
      };

      request.onerror = () => {
        console.error('Failed to write audit log:', request.error);
        reject(request.error);
      };
    });
  }

  /**
   * 获取审计日志详情
   */
  async getLog(id: string): Promise<AuditLogEntry | null> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        resolve(request.result || null);
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 查询审计日志
   */
  async query(query: AuditLogQuery = {}): Promise<AuditLogQueryResult> {
    await this.ensureDB();

    const {
      page = 1,
      pageSize = 50,
      sortBy = 'timestamp',
      sortOrder = 'desc',
    } = query;

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readonly');
      const store = transaction.objectStore(this.STORE_NAME);
      const allLogs: AuditLogEntry[] = [];

      const request = store.openCursor();

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

        if (cursor) {
          const log = cursor.value as AuditLogEntry;

          // 应用过滤条件
          if (this.matchesQuery(log, query)) {
            allLogs.push(log);
          }

          cursor.continue();
        } else {
          // 所有日志已收集，进行排序和分页
          const sortedLogs = this.sortLogs(allLogs, sortBy, sortOrder);
          const total = sortedLogs.length;
          const totalPages = Math.ceil(total / pageSize);
          const startIndex = (page - 1) * pageSize;
          const endIndex = startIndex + pageSize;
          const paginatedLogs = sortedLogs.slice(startIndex, endIndex);

          resolve({
            logs: paginatedLogs,
            total,
            page,
            pageSize,
            totalPages,
          });
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 检查日志是否匹配查询条件
   */
  private matchesQuery(log: AuditLogEntry, query: AuditLogQuery): boolean {
    // 用户 ID 过滤
    if (query.userId && log.userId !== query.userId) {
      return false;
    }

    // 事件类型过滤
    if (query.eventType) {
      const eventTypes = Array.isArray(query.eventType)
        ? query.eventType
        : [query.eventType];
      if (!eventTypes.includes(log.eventType)) {
        return false;
      }
    }

    // 类别过滤
    if (query.category) {
      const categories = Array.isArray(query.category) ? query.category : [query.category];
      if (!categories.includes(log.category)) {
        return false;
      }
    }

    // 严重程度过滤
    if (query.severity) {
      const severities = Array.isArray(query.severity) ? query.severity : [query.severity];
      if (!severities.includes(log.severity)) {
        return false;
      }
    }

    // 时间范围过滤
    if (query.startTime && log.timestamp < query.startTime) {
      return false;
    }
    if (query.endTime && log.timestamp > query.endTime) {
      return false;
    }

    // 成功/失败过滤
    if (query.success !== undefined && log.success !== query.success) {
      return false;
    }

    // 资源 ID 过滤
    if (query.resourceId && log.resourceId !== query.resourceId) {
      return false;
    }

    // 资源类型过滤
    if (query.resourceType && log.resourceType !== query.resourceType) {
      return false;
    }

    // IP 地址过滤
    if (query.ipAddress && log.ipAddress !== query.ipAddress) {
      return false;
    }

    return true;
  }

  /**
   * 排序日志
   */
  private sortLogs(
    logs: AuditLogEntry[],
    sortBy: 'timestamp' | 'severity' | 'eventType',
    sortOrder: 'asc' | 'desc'
  ): AuditLogEntry[] {
    return logs.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'timestamp':
          comparison = a.timestamp - b.timestamp;
          break;
        case 'severity':
          const severityOrder = {
            [AuditSeverity.INFO]: 0,
            [AuditSeverity.WARNING]: 1,
            [AuditSeverity.ERROR]: 2,
            [AuditSeverity.CRITICAL]: 3,
          };
          comparison = severityOrder[a.severity] - severityOrder[b.severity];
          break;
        case 'eventType':
          comparison = a.eventType.localeCompare(b.eventType);
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }

  /**
   * 获取统计数据
   */
  async getStatistics(query: AuditLogQuery = {}): Promise<AuditStatistics> {
    const result = await this.query({ ...query, page: 1, pageSize: Number.MAX_SAFE_INTEGER });
    const logs = result.logs;

    const totalEvents = logs.length;

    // 按类别统计
    const byCategory: Record<AuditCategory, number> = {} as any;
    Object.values(AuditCategory).forEach((cat) => {
      byCategory[cat] = 0;
    });
    logs.forEach((log) => {
      byCategory[log.category] = (byCategory[log.category] || 0) + 1;
    });

    // 按严重程度统计
    const bySeverity: Record<AuditSeverity, number> = {} as any;
    Object.values(AuditSeverity).forEach((sev) => {
      bySeverity[sev] = 0;
    });
    logs.forEach((log) => {
      bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;
    });

    // 成功率统计
    const successCount = logs.filter((log) => log.success).length;
    const failedCount = logs.filter((log) => !log.success).length;

    // 最活跃用户
    const userCounts: Record<string, { username?: string; count: number }> = {};
    logs.forEach((log) => {
      if (log.userId) {
        if (!userCounts[log.userId]) {
          userCounts[log.userId] = { username: log.username, count: 0 };
        }
        userCounts[log.userId].count++;
      }
    });
    const topUsers = Object.entries(userCounts)
      .map(([userId, data]) => ({
        userId,
        username: data.username,
        eventCount: data.count,
      }))
      .sort((a, b) => b.eventCount - a.eventCount)
      .slice(0, 10);

    // 最常见事件类型
    const eventTypeCounts: Record<string, number> = {};
    logs.forEach((log) => {
      eventTypeCounts[log.eventType] = (eventTypeCounts[log.eventType] || 0) + 1;
    });
    const topEventTypes = Object.entries(eventTypeCounts)
      .map(([eventType, count]) => ({
        eventType: eventType as AuditEventType,
        count,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      totalEvents,
      byCategory,
      bySeverity,
      successRate: {
        success: successCount,
        failed: failedCount,
        rate: totalEvents > 0 ? successCount / totalEvents : 0,
      },
      topUsers,
      topEventTypes,
    };
  }

  /**
   * 删除指定时间之前的日志（用于清理）
   */
  async deleteBeforeTimestamp(timestamp: number): Promise<number> {
    await this.ensureDB();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.STORE_NAME], 'readwrite');
      const store = transaction.objectStore(this.STORE_NAME);
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(timestamp);
      const request = index.openCursor(range);

      let deletedCount = 0;

      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;

        if (cursor) {
          cursor.delete();
          deletedCount++;
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };

      request.onerror = () => reject(request.error);
    });
  }

  /**
   * 清空所有日志（谨慎使用）
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
   * 导出日志为 JSON
   */
  async exportLogs(query: AuditLogQuery = {}): Promise<string> {
    const result = await this.query({ ...query, page: 1, pageSize: Number.MAX_SAFE_INTEGER });
    return JSON.stringify(result.logs, null, 2);
  }

  /**
   * 导出日志为 CSV
   */
  async exportLogsCSV(query: AuditLogQuery = {}): Promise<string> {
    const result = await this.query({ ...query, page: 1, pageSize: Number.MAX_SAFE_INTEGER });
    const logs = result.logs;

    if (logs.length === 0) return '';

    // CSV 表头
    const headers = [
      'ID',
      'Timestamp',
      'Event Type',
      'Category',
      'Severity',
      'User ID',
      'Username',
      'IP Address',
      'Resource ID',
      'Success',
      'Error Message',
    ];

    // CSV 行
    const rows = logs.map((log) => [
      log.id,
      new Date(log.timestamp).toISOString(),
      log.eventType,
      log.category,
      log.severity,
      log.userId || '',
      log.username || '',
      log.ipAddress || '',
      log.resourceId || '',
      log.success ? 'Yes' : 'No',
      log.errorMessage || '',
    ]);

    // 组合 CSV
    const csvRows = [headers, ...rows];
    return csvRows.map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
  }
}

/**
 * 导出单例实例
 */
export const auditLogger = AuditLogManager.getInstance();

/**
 * React Hook - 使用审计日志
 */
export function useAuditLog() {
  const logger = AuditLogManager.getInstance();

  return {
    log: logger.log.bind(logger),
    getLog: logger.getLog.bind(logger),
    query: logger.query.bind(logger),
    getStatistics: logger.getStatistics.bind(logger),
    exportLogs: logger.exportLogs.bind(logger),
    exportLogsCSV: logger.exportLogsCSV.bind(logger),
  };
}

/**
 * 便捷函数 - 记录成功事件
 */
export async function logSuccess(
  eventType: AuditEventType,
  category: AuditCategory,
  details?: Partial<Omit<AuditLogEntry, 'id' | 'timestamp' | 'eventType' | 'category' | 'success'>>
): Promise<string> {
  return auditLogger.log({
    eventType,
    category,
    severity: AuditSeverity.INFO,
    success: true,
    ...details,
  });
}

/**
 * 便捷函数 - 记录失败事件
 */
export async function logFailure(
  eventType: AuditEventType,
  category: AuditCategory,
  errorMessage: string,
  details?: Partial<Omit<AuditLogEntry, 'id' | 'timestamp' | 'eventType' | 'category' | 'success' | 'errorMessage'>>
): Promise<string> {
  return auditLogger.log({
    eventType,
    category,
    severity: AuditSeverity.ERROR,
    success: false,
    errorMessage,
    ...details,
  });
}

/**
 * 便捷函数 - 记录安全事件
 */
export async function logSecurityEvent(
  eventType: AuditEventType,
  severity: AuditSeverity,
  details?: Partial<Omit<AuditLogEntry, 'id' | 'timestamp' | 'eventType' | 'category' | 'severity'>>
): Promise<string> {
  return auditLogger.log({
    eventType,
    category: AuditCategory.SECURITY,
    severity,
    success: true,
    ...details,
  });
}
