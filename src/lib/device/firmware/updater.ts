/**
 * 固件 OTA 更新管理器
 *
 * @module device/firmware/updater
 */

import {
  FirmwareUpdate,
  UpdateStatus,
  DeviceType,
  KarmaBoxDevice,
} from '../types';
import { deviceManager } from '../manager';
import { logSuccess, logFailure } from '../../security/auditLog';
import { AuditEventType, AuditCategory } from '../../security/auditTypes';

/**
 * 更新进度
 */
export interface UpdateProgress {
  deviceId: string;
  status: UpdateStatus;
  percentage: number;
  currentStep: string;
  error?: string;
  startedAt?: number;
  completedAt?: number;
}

/**
 * 固件更新管理器（单例模式）
 */
export class FirmwareUpdater {
  private static instance: FirmwareUpdater;
  private updates: Map<string, UpdateProgress> = new Map();
  private availableUpdates: Map<DeviceType, FirmwareUpdate> = new Map();

  private constructor() {
    this.initializeAvailableUpdates();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): FirmwareUpdater {
    if (!this.instance) {
      this.instance = new FirmwareUpdater();
    }
    return this.instance;
  }

  /**
   * 初始化可用更新（模拟数据）
   */
  private initializeAvailableUpdates(): void {
    const updates: FirmwareUpdate[] = [
      {
        version: '2.2.0',
        releaseDate: '2025-10-20',
        downloadUrl: 'https://firmware.karma.ai/karma_box_pro_2.2.0.bin',
        size: 45 * 1024 * 1024, // 45MB
        checksum: 'sha256:abc123...',
        changelog: [
          '优化语音识别精度',
          '新增离线模式支持',
          '修复蓝牙连接稳定性问题',
          '提升电池续航 15%',
        ],
        required: false,
        compatibleDevices: [DeviceType.KARMA_BOX_PRO],
      },
      {
        version: '2.1.5',
        releaseDate: '2025-10-25',
        downloadUrl: 'https://firmware.karma.ai/karma_box_mini_2.1.5.bin',
        size: 32 * 1024 * 1024, // 32MB
        checksum: 'sha256:def456...',
        changelog: [
          '修复已知安全漏洞',
          '优化内存使用',
          '提升启动速度',
        ],
        required: true,
        compatibleDevices: [DeviceType.KARMA_BOX_MINI],
      },
      {
        version: '3.0.0',
        releaseDate: '2025-10-15',
        downloadUrl: 'https://firmware.karma.ai/karma_box_studio_3.0.0.bin',
        size: 78 * 1024 * 1024, // 78MB
        checksum: 'sha256:ghi789...',
        changelog: [
          '全新 UI 界面',
          '支持 4K 视频输出',
          '新增多房间音频同步',
          '改进的神经网络引擎',
          '支持更多第三方集成',
        ],
        required: false,
        compatibleDevices: [DeviceType.KARMA_BOX_STUDIO],
      },
    ];

    updates.forEach((update) => {
      update.compatibleDevices.forEach((deviceType) => {
        this.availableUpdates.set(deviceType, update);
      });
    });
  }

  /**
   * 检查更新
   */
  async checkForUpdate(deviceId: string): Promise<FirmwareUpdate | null> {
    const device = deviceManager.getDevice(deviceId);

    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    const availableUpdate = this.availableUpdates.get(device.type);

    if (!availableUpdate) {
      return null;
    }

    // 比较版本号
    if (this.compareVersions(availableUpdate.version, device.firmwareVersion) > 0) {
      await deviceManager.addNotification(deviceId, {
        type: availableUpdate.required ? 'warning' : 'info',
        title: availableUpdate.required ? '重要固件更新' : '固件更新可用',
        message: `${device.name} 可更新到版本 ${availableUpdate.version}`,
        actionUrl: `/devices/${deviceId}/settings`,
      });

      return availableUpdate;
    }

    return null;
  }

  /**
   * 开始更新
   */
  async startUpdate(deviceId: string, userId: string): Promise<boolean> {
    const device = deviceManager.getDevice(deviceId);

    if (!device) {
      throw new Error(`Device ${deviceId} not found`);
    }

    if (device.userId !== userId) {
      throw new Error('Unauthorized to update this device');
    }

    const update = await this.checkForUpdate(deviceId);

    if (!update) {
      throw new Error('No update available for this device');
    }

    // 创建更新进度
    const progress: UpdateProgress = {
      deviceId,
      status: UpdateStatus.DOWNLOADING,
      percentage: 0,
      currentStep: '正在下载固件...',
      startedAt: Date.now(),
    };

    this.updates.set(deviceId, progress);

    // 更新设备状态
    await deviceManager.updateDeviceStatus(deviceId, 'updating' as any);
    await deviceManager.addLog(deviceId, 'info', 'firmware', `开始更新到版本 ${update.version}`);

    // 记录审计日志
    await logSuccess(AuditEventType.SYSTEM_CONFIG_CHANGE, AuditCategory.SYSTEM, {
      userId,
      resourceId: deviceId,
      details: { action: 'firmware_update_started', version: update.version },
    });

    // 模拟更新流程
    this.simulateUpdate(deviceId, update, userId);

    return true;
  }

  /**
   * 模拟更新流程
   */
  private async simulateUpdate(
    deviceId: string,
    update: FirmwareUpdate,
    userId: string
  ): Promise<void> {
    const progress = this.updates.get(deviceId)!;

    try {
      // 第一阶段：下载 (0-50%)
      progress.status = UpdateStatus.DOWNLOADING;
      progress.currentStep = '正在下载固件...';

      for (let i = 0; i <= 50; i += 5) {
        await this.delay(200);
        progress.percentage = i;
      }

      // 第二阶段：安装 (50-90%)
      progress.status = UpdateStatus.INSTALLING;
      progress.currentStep = '正在安装固件...';

      for (let i = 50; i <= 90; i += 5) {
        await this.delay(300);
        progress.percentage = i;
      }

      // 第三阶段：验证 (90-100%)
      progress.currentStep = '正在验证固件...';

      for (let i = 90; i <= 100; i += 2) {
        await this.delay(200);
        progress.percentage = i;
      }

      // 完成
      progress.status = UpdateStatus.COMPLETED;
      progress.currentStep = '更新完成';
      progress.completedAt = Date.now();
      progress.percentage = 100;

      // 更新设备固件版本
      await deviceManager.updateDevice(deviceId, {
        firmwareVersion: update.version,
      });

      await deviceManager.updateDeviceStatus(deviceId, 'online' as any);
      await deviceManager.addLog(
        deviceId,
        'info',
        'firmware',
        `成功更新到版本 ${update.version}`
      );

      await deviceManager.addNotification(deviceId, {
        type: 'info',
        title: '固件更新完成',
        message: `${deviceManager.getDevice(deviceId)?.name} 已更新到版本 ${update.version}`,
      });

      await logSuccess(AuditEventType.SYSTEM_CONFIG_CHANGE, AuditCategory.SYSTEM, {
        userId,
        resourceId: deviceId,
        details: { action: 'firmware_update_completed', version: update.version },
      });
    } catch (error: any) {
      progress.status = UpdateStatus.FAILED;
      progress.error = error.message;
      progress.currentStep = '更新失败';

      await deviceManager.updateDeviceStatus(deviceId, 'error' as any);
      await deviceManager.addLog(deviceId, 'error', 'firmware', `更新失败: ${error.message}`);

      await deviceManager.addNotification(deviceId, {
        type: 'error',
        title: '固件更新失败',
        message: error.message,
      });

      await logFailure(
        AuditEventType.SYSTEM_CONFIG_CHANGE,
        AuditCategory.SYSTEM,
        error.message,
        { userId, resourceId: deviceId }
      );
    }
  }

  /**
   * 取消更新
   */
  async cancelUpdate(deviceId: string, userId: string): Promise<boolean> {
    const progress = this.updates.get(deviceId);

    if (!progress) {
      return false;
    }

    if (
      progress.status === UpdateStatus.COMPLETED ||
      progress.status === UpdateStatus.FAILED
    ) {
      return false;
    }

    progress.status = UpdateStatus.FAILED;
    progress.error = 'Update cancelled by user';
    progress.currentStep = '已取消';

    await deviceManager.updateDeviceStatus(deviceId, 'online' as any);
    await deviceManager.addLog(deviceId, 'warning', 'firmware', '固件更新已取消');

    await logSuccess(AuditEventType.SYSTEM_CONFIG_CHANGE, AuditCategory.SYSTEM, {
      userId,
      resourceId: deviceId,
      details: { action: 'firmware_update_cancelled' },
    });

    return true;
  }

  /**
   * 获取更新进度
   */
  getUpdateProgress(deviceId: string): UpdateProgress | null {
    return this.updates.get(deviceId) || null;
  }

  /**
   * 获取所有可用更新
   */
  getAllAvailableUpdates(): FirmwareUpdate[] {
    return Array.from(this.availableUpdates.values());
  }

  /**
   * 比较版本号
   */
  private compareVersions(v1: string, v2: string): number {
    const parts1 = v1.split('.').map(Number);
    const parts2 = v2.split('.').map(Number);

    for (let i = 0; i < Math.max(parts1.length, parts2.length); i++) {
      const part1 = parts1[i] || 0;
      const part2 = parts2[i] || 0;

      if (part1 > part2) return 1;
      if (part1 < part2) return -1;
    }

    return 0;
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  /**
   * 获取更新统计
   */
  getStats(): {
    totalUpdates: number;
    inProgress: number;
    completed: number;
    failed: number;
  } {
    const updates = Array.from(this.updates.values());

    return {
      totalUpdates: updates.length,
      inProgress: updates.filter(
        (u) =>
          u.status === UpdateStatus.DOWNLOADING || u.status === UpdateStatus.INSTALLING
      ).length,
      completed: updates.filter((u) => u.status === UpdateStatus.COMPLETED).length,
      failed: updates.filter((u) => u.status === UpdateStatus.FAILED).length,
    };
  }
}

/**
 * 导出单例实例
 */
export const firmwareUpdater = FirmwareUpdater.getInstance();

/**
 * React Hook - 使用固件更新
 */
export function useFirmwareUpdater() {
  const updater = FirmwareUpdater.getInstance();

  return {
    checkForUpdate: (deviceId: string) => updater.checkForUpdate(deviceId),
    startUpdate: (deviceId: string, userId: string) => updater.startUpdate(deviceId, userId),
    cancelUpdate: (deviceId: string, userId: string) =>
      updater.cancelUpdate(deviceId, userId),
    getUpdateProgress: (deviceId: string) => updater.getUpdateProgress(deviceId),
    getAllAvailableUpdates: () => updater.getAllAvailableUpdates(),
    formatFileSize: (bytes: number) => updater.formatFileSize(bytes),
    getStats: () => updater.getStats(),
  };
}
