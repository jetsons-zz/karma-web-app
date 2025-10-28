/**
 * Karma Box 设备管理器
 * 负责设备的生命周期管理
 *
 * @module device/manager
 */

import {
  KarmaBoxDevice,
  DeviceType,
  DeviceStatus,
  ConnectionType,
  DeviceConfig,
  DeviceLog,
  DeviceStats,
  PairingRequest,
  PairingResponse,
  DeviceNotification,
} from './types';
import { auditLogger, logSuccess, logFailure } from '../security/auditLog';
import { AuditEventType, AuditCategory } from '../security/auditTypes';
import { encrypt, decrypt } from '../security/encryption';

/**
 * 设备管理器（单例模式）
 */
export class DeviceManager {
  private static instance: DeviceManager;
  private devices: Map<string, KarmaBoxDevice> = new Map();
  private configs: Map<string, DeviceConfig> = new Map();
  private logs: Map<string, DeviceLog[]> = new Map();
  private notifications: Map<string, DeviceNotification[]> = new Map();

  private constructor() {
    // 启动心跳检查
    this.startHeartbeatCheck();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): DeviceManager {
    if (!this.instance) {
      this.instance = new DeviceManager();
    }
    return this.instance;
  }

  /**
   * 注册新设备
   */
  async registerDevice(
    userId: string,
    deviceData: Omit<
      KarmaBoxDevice,
      'id' | 'status' | 'lastSeen' | 'activatedAt' | 'createdAt' | 'updatedAt'
    >
  ): Promise<KarmaBoxDevice> {
    const device: KarmaBoxDevice = {
      id: this.generateDeviceId(),
      status: DeviceStatus.OFFLINE,
      lastSeen: Date.now(),
      activatedAt: Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      userId,
      ...deviceData,
    };

    this.devices.set(device.id, device);

    // 初始化配置
    this.configs.set(device.id, this.getDefaultConfig(device.type));

    // 初始化日志和通知
    this.logs.set(device.id, []);
    this.notifications.set(device.id, []);

    // 记录审计日志
    await logSuccess(AuditEventType.USER_LOGIN, AuditCategory.SYSTEM, {
      userId,
      resourceId: device.id,
      details: { deviceType: device.type, serialNumber: device.serialNumber },
    });

    await this.addLog(device.id, 'info', 'device', '设备已注册');

    return device;
  }

  /**
   * 配对设备
   */
  async pairDevice(request: PairingRequest, userId: string): Promise<PairingResponse> {
    try {
      // 验证配对码
      const isValid = await this.validatePairingCode(
        request.deviceId,
        request.pairingCode
      );

      if (!isValid) {
        await logFailure(
          AuditEventType.USER_LOGIN,
          AuditCategory.SYSTEM,
          'Invalid pairing code',
          { userId, deviceId: request.deviceId }
        );

        return {
          success: false,
          error: '配对码无效',
        };
      }

      // 生成会话令牌
      const sessionToken = await this.generateSessionToken(request.deviceId, userId);

      // 更新设备状态
      const device = this.devices.get(request.deviceId);
      if (device) {
        device.userId = userId;
        device.status = DeviceStatus.ONLINE;
        device.lastSeen = Date.now();
        device.updatedAt = Date.now();
      }

      await logSuccess(AuditEventType.USER_LOGIN, AuditCategory.SYSTEM, {
        userId,
        resourceId: request.deviceId,
        details: { deviceType: request.deviceType },
      });

      await this.addLog(request.deviceId, 'info', 'pairing', '设备配对成功');
      await this.addNotification(request.deviceId, {
        type: 'info',
        title: '配对成功',
        message: '设备已成功连接到您的账户',
      });

      return {
        success: true,
        deviceId: request.deviceId,
        sessionToken,
      };
    } catch (error: any) {
      await logFailure(
        AuditEventType.USER_LOGIN,
        AuditCategory.SYSTEM,
        error.message,
        { userId, deviceId: request.deviceId }
      );

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * 取消配对设备
   */
  async unpairDevice(deviceId: string, userId: string): Promise<boolean> {
    const device = this.devices.get(deviceId);

    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    if (device.userId !== userId) {
      throw new Error('Unauthorized to unpair this device');
    }

    device.status = DeviceStatus.OFFLINE;
    device.updatedAt = Date.now();

    await logSuccess(AuditEventType.USER_LOGOUT, AuditCategory.SYSTEM, {
      userId,
      resourceId: deviceId,
    });

    await this.addLog(deviceId, 'info', 'pairing', '设备已取消配对');

    return true;
  }

  /**
   * 删除设备
   */
  async removeDevice(deviceId: string, userId: string): Promise<boolean> {
    const device = this.devices.get(deviceId);

    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    if (device.userId !== userId) {
      throw new Error('Unauthorized to remove this device');
    }

    this.devices.delete(deviceId);
    this.configs.delete(deviceId);
    this.logs.delete(deviceId);
    this.notifications.delete(deviceId);

    await logSuccess(AuditEventType.USER_DELETE, AuditCategory.SYSTEM, {
      userId,
      resourceId: deviceId,
    });

    return true;
  }

  /**
   * 获取设备
   */
  getDevice(deviceId: string): KarmaBoxDevice | null {
    return this.devices.get(deviceId) || null;
  }

  /**
   * 获取用户的所有设备
   */
  getUserDevices(userId: string, filter?: { status?: DeviceStatus }): KarmaBoxDevice[] {
    const devices = Array.from(this.devices.values()).filter(
      (device) => device.userId === userId
    );

    if (!filter) return devices;

    return devices.filter((device) => {
      if (filter.status && device.status !== filter.status) return false;
      return true;
    });
  }

  /**
   * 更新设备状态
   */
  async updateDeviceStatus(
    deviceId: string,
    status: DeviceStatus,
    metadata?: Record<string, any>
  ): Promise<void> {
    const device = this.devices.get(deviceId);

    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    device.status = status;
    device.lastSeen = Date.now();
    device.updatedAt = Date.now();

    if (metadata) {
      device.metadata = { ...device.metadata, ...metadata };
    }

    await this.addLog(deviceId, 'info', 'status', `设备状态更新: ${status}`);
  }

  /**
   * 更新设备信息
   */
  async updateDevice(
    deviceId: string,
    updates: Partial<KarmaBoxDevice>
  ): Promise<KarmaBoxDevice> {
    const device = this.devices.get(deviceId);

    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    Object.assign(device, updates, {
      updatedAt: Date.now(),
    });

    return device;
  }

  /**
   * 获取设备配置
   */
  getDeviceConfig(deviceId: string): DeviceConfig | null {
    return this.configs.get(deviceId) || null;
  }

  /**
   * 更新设备配置
   */
  async updateDeviceConfig(
    deviceId: string,
    config: Partial<DeviceConfig>
  ): Promise<DeviceConfig> {
    const currentConfig = this.configs.get(deviceId) || {};
    const newConfig = { ...currentConfig, ...config };

    this.configs.set(deviceId, newConfig);

    await this.addLog(deviceId, 'info', 'config', '设备配置已更新');

    return newConfig;
  }

  /**
   * 获取设备日志
   */
  getDeviceLogs(
    deviceId: string,
    options?: {
      level?: string;
      category?: string;
      limit?: number;
      since?: number;
    }
  ): DeviceLog[] {
    let logs = this.logs.get(deviceId) || [];

    if (options?.level) {
      logs = logs.filter((log) => log.level === options.level);
    }

    if (options?.category) {
      logs = logs.filter((log) => log.category === options.category);
    }

    if (options?.since) {
      logs = logs.filter((log) => log.timestamp >= options.since);
    }

    if (options?.limit) {
      logs = logs.slice(-options.limit);
    }

    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 添加设备日志
   */
  async addLog(
    deviceId: string,
    level: 'info' | 'warning' | 'error' | 'debug',
    category: string,
    message: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const logs = this.logs.get(deviceId) || [];

    const log: DeviceLog = {
      id: this.generateLogId(),
      deviceId,
      level,
      category,
      message,
      timestamp: Date.now(),
      metadata,
    };

    logs.push(log);

    // 保留最近 1000 条日志
    if (logs.length > 1000) {
      logs.shift();
    }

    this.logs.set(deviceId, logs);
  }

  /**
   * 获取设备通知
   */
  getDeviceNotifications(deviceId: string, unreadOnly = false): DeviceNotification[] {
    const notifications = this.notifications.get(deviceId) || [];

    if (unreadOnly) {
      return notifications.filter((n) => !n.read);
    }

    return notifications.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 添加设备通知
   */
  async addNotification(
    deviceId: string,
    notification: Omit<DeviceNotification, 'id' | 'deviceId' | 'timestamp' | 'read'>
  ): Promise<void> {
    const notifications = this.notifications.get(deviceId) || [];

    const newNotification: DeviceNotification = {
      id: this.generateNotificationId(),
      deviceId,
      timestamp: Date.now(),
      read: false,
      ...notification,
    };

    notifications.push(newNotification);
    this.notifications.set(deviceId, notifications);
  }

  /**
   * 标记通知为已读
   */
  async markNotificationRead(deviceId: string, notificationId: string): Promise<void> {
    const notifications = this.notifications.get(deviceId) || [];
    const notification = notifications.find((n) => n.id === notificationId);

    if (notification) {
      notification.read = true;
    }
  }

  /**
   * 获取设备统计
   */
  async getDeviceStats(deviceId: string, period: 'day' | 'week' | 'month'): Promise<DeviceStats> {
    // TODO: 实际实现应该从数据库或缓存中获取
    return {
      deviceId,
      period,
      activeTime: 0,
      idleTime: 0,
      tasksProcessed: 0,
      tasksCompleted: 0,
      tasksFailed: 0,
      dataUploaded: 0,
      dataDownloaded: 0,
      audioMinutes: 0,
      videoMinutes: 0,
      avgCpuUsage: 0,
      avgMemoryUsage: 0,
      avgTemperature: 0,
    };
  }

  /**
   * 启动心跳检查
   */
  private startHeartbeatCheck(): void {
    setInterval(() => {
      const now = Date.now();
      const HEARTBEAT_TIMEOUT = 60000; // 60 秒

      for (const [id, device] of this.devices.entries()) {
        if (
          device.status === DeviceStatus.ONLINE &&
          now - device.lastSeen > HEARTBEAT_TIMEOUT
        ) {
          device.status = DeviceStatus.OFFLINE;
          device.updatedAt = now;

          this.addLog(id, 'warning', 'connection', '设备失去连接');
          this.addNotification(id, {
            type: 'warning',
            title: '设备离线',
            message: `${device.name} 已离线`,
          });
        }
      }
    }, 30000); // 每 30 秒检查一次
  }

  /**
   * 验证配对码
   */
  private async validatePairingCode(deviceId: string, pairingCode: string): Promise<boolean> {
    // TODO: 实际实现应该与设备进行加密通信验证
    // 这里简单模拟
    return pairingCode.length === 6 && /^\d+$/.test(pairingCode);
  }

  /**
   * 生成会话令牌
   */
  private async generateSessionToken(deviceId: string, userId: string): Promise<string> {
    const data = JSON.stringify({
      deviceId,
      userId,
      timestamp: Date.now(),
      nonce: Math.random().toString(36).substr(2, 9),
    });

    return await encrypt(data);
  }

  /**
   * 获取默认配置
   */
  private getDefaultConfig(deviceType: DeviceType): DeviceConfig {
    return {
      audio: {
        inputGain: 50,
        outputVolume: 70,
        noiseReduction: true,
        echoCancellation: true,
      },
      video: {
        resolution: '1080p',
        frameRate: 30,
        brightness: 50,
        contrast: 50,
      },
      power: {
        sleepTimeout: 300000, // 5 minutes
        autoShutdown: false,
        lowBatteryThreshold: 20,
      },
      privacy: {
        microphoneEnabled: true,
        cameraEnabled: true,
        locationEnabled: false,
        dataSyncEnabled: true,
      },
    };
  }

  /**
   * 生成设备 ID
   */
  private generateDeviceId(): string {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成日志 ID
   */
  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 生成通知 ID
   */
  private generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalDevices: number;
    byStatus: Record<DeviceStatus, number>;
    byType: Record<DeviceType, number>;
    onlineCount: number;
  } {
    const devices = Array.from(this.devices.values());

    const byStatus: Record<DeviceStatus, number> = {} as any;
    Object.values(DeviceStatus).forEach((status) => {
      byStatus[status] = 0;
    });

    const byType: Record<DeviceType, number> = {} as any;
    Object.values(DeviceType).forEach((type) => {
      byType[type] = 0;
    });

    let onlineCount = 0;

    devices.forEach((device) => {
      byStatus[device.status]++;
      byType[device.type]++;
      if (device.status === DeviceStatus.ONLINE) {
        onlineCount++;
      }
    });

    return {
      totalDevices: devices.length,
      byStatus,
      byType,
      onlineCount,
    };
  }
}

/**
 * 导出单例实例
 */
export const deviceManager = DeviceManager.getInstance();

/**
 * React Hook - 使用设备管理
 */
export function useDeviceManager() {
  const manager = DeviceManager.getInstance();

  return {
    registerDevice: (
      userId: string,
      deviceData: Omit<
        KarmaBoxDevice,
        'id' | 'status' | 'lastSeen' | 'activatedAt' | 'createdAt' | 'updatedAt'
      >
    ) => manager.registerDevice(userId, deviceData),
    pairDevice: (request: PairingRequest, userId: string) =>
      manager.pairDevice(request, userId),
    unpairDevice: (deviceId: string, userId: string) =>
      manager.unpairDevice(deviceId, userId),
    removeDevice: (deviceId: string, userId: string) =>
      manager.removeDevice(deviceId, userId),
    getDevice: (deviceId: string) => manager.getDevice(deviceId),
    getUserDevices: (userId: string, filter?: { status?: DeviceStatus }) =>
      manager.getUserDevices(userId, filter),
    updateDeviceStatus: (
      deviceId: string,
      status: DeviceStatus,
      metadata?: Record<string, any>
    ) => manager.updateDeviceStatus(deviceId, status, metadata),
    updateDevice: (deviceId: string, updates: Partial<KarmaBoxDevice>) =>
      manager.updateDevice(deviceId, updates),
    getDeviceConfig: (deviceId: string) => manager.getDeviceConfig(deviceId),
    updateDeviceConfig: (deviceId: string, config: Partial<DeviceConfig>) =>
      manager.updateDeviceConfig(deviceId, config),
    getDeviceLogs: (
      deviceId: string,
      options?: {
        level?: string;
        category?: string;
        limit?: number;
        since?: number;
      }
    ) => manager.getDeviceLogs(deviceId, options),
    getDeviceNotifications: (deviceId: string, unreadOnly?: boolean) =>
      manager.getDeviceNotifications(deviceId, unreadOnly),
    markNotificationRead: (deviceId: string, notificationId: string) =>
      manager.markNotificationRead(deviceId, notificationId),
    getDeviceStats: (deviceId: string, period: 'day' | 'week' | 'month') =>
      manager.getDeviceStats(deviceId, period),
    getStats: () => manager.getStats(),
  };
}
