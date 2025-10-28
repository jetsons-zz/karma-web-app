/**
 * Karma Box 设备类型定义
 *
 * @module device/types
 */

/**
 * 设备型号
 */
export enum DeviceType {
  KARMA_BOX_MINI = 'karma_box_mini',
  KARMA_BOX_PRO = 'karma_box_pro',
  KARMA_BOX_STUDIO = 'karma_box_studio',
}

/**
 * 设备状态
 */
export enum DeviceStatus {
  OFFLINE = 'offline',
  ONLINE = 'online',
  CONNECTING = 'connecting',
  SYNCING = 'syncing',
  UPDATING = 'updating',
  ERROR = 'error',
  SLEEP = 'sleep',
}

/**
 * 连接方式
 */
export enum ConnectionType {
  WIFI = 'wifi',
  BLUETOOTH = 'bluetooth',
  USB = 'usb',
  ETHERNET = 'ethernet',
}

/**
 * 设备特性
 */
export interface DeviceFeatures {
  hasCamera: boolean;
  hasMicrophone: boolean;
  hasSpeaker: boolean;
  hasDisplay: boolean;
  hasTouchScreen: boolean;
  sensors: string[];
  audioChannels: number;
  videoResolution?: string;
  storageGB: number;
  ramGB: number;
}

/**
 * Karma Box 设备
 */
export interface KarmaBoxDevice {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  firmwareVersion: string;
  hardwareVersion: string;
  serialNumber: string;

  // 连接信息
  connectionType: ConnectionType;
  ipAddress?: string;
  macAddress: string;
  bluetoothAddress?: string;

  // 状态信息
  batteryLevel?: number;
  isCharging?: boolean;
  temperature?: number;
  cpuUsage?: number;
  memoryUsage?: number;
  storageUsed?: number;

  // 时间戳
  lastSeen: number;
  activatedAt: number;
  createdAt: number;
  updatedAt: number;

  // 特性
  features: DeviceFeatures;

  // 所有者
  userId: string;

  // 元数据
  metadata?: Record<string, any>;
}

/**
 * 设备配对请求
 */
export interface PairingRequest {
  deviceId: string;
  deviceType: DeviceType;
  pairingCode: string;
  publicKey: string;
  timestamp: number;
}

/**
 * 设备配对响应
 */
export interface PairingResponse {
  success: boolean;
  deviceId?: string;
  sessionToken?: string;
  error?: string;
}

/**
 * 设备配置
 */
export interface DeviceConfig {
  // 网络配置
  wifi?: {
    ssid: string;
    password?: string;
    autoConnect: boolean;
  };

  // 音频配置
  audio?: {
    inputGain: number;
    outputVolume: number;
    noiseReduction: boolean;
    echoCancellation: boolean;
  };

  // 视频配置
  video?: {
    resolution: string;
    frameRate: number;
    brightness: number;
    contrast: number;
  };

  // 电源配置
  power?: {
    sleepTimeout: number;
    autoShutdown: boolean;
    lowBatteryThreshold: number;
  };

  // 隐私配置
  privacy?: {
    microphoneEnabled: boolean;
    cameraEnabled: boolean;
    locationEnabled: boolean;
    dataSyncEnabled: boolean;
  };
}

/**
 * 设备日志
 */
export interface DeviceLog {
  id: string;
  deviceId: string;
  level: 'info' | 'warning' | 'error' | 'debug';
  category: string;
  message: string;
  timestamp: number;
  metadata?: Record<string, any>;
}

/**
 * 设备统计
 */
export interface DeviceStats {
  deviceId: string;
  period: 'day' | 'week' | 'month';

  // 使用时长（毫秒）
  activeTime: number;
  idleTime: number;

  // 任务统计
  tasksProcessed: number;
  tasksCompleted: number;
  tasksFailed: number;

  // 数据传输
  dataUploaded: number; // bytes
  dataDownloaded: number; // bytes

  // 语音/视频时长
  audioMinutes: number;
  videoMinutes: number;

  // 平均指标
  avgCpuUsage: number;
  avgMemoryUsage: number;
  avgTemperature: number;
}

/**
 * 固件更新信息
 */
export interface FirmwareUpdate {
  version: string;
  releaseDate: string;
  downloadUrl: string;
  size: number; // bytes
  checksum: string;
  changelog: string[];
  required: boolean;
  compatibleDevices: DeviceType[];
}

/**
 * OTA 更新状态
 */
export enum UpdateStatus {
  CHECKING = 'checking',
  AVAILABLE = 'available',
  DOWNLOADING = 'downloading',
  INSTALLING = 'installing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  UP_TO_DATE = 'up_to_date',
}

/**
 * 设备发现结果
 */
export interface DiscoveredDevice {
  deviceId: string;
  deviceType: DeviceType;
  name: string;
  connectionType: ConnectionType;
  signalStrength?: number;
  isPaired: boolean;
}

/**
 * 传感器数据
 */
export interface SensorData {
  deviceId: string;
  sensorType: string;
  value: number;
  unit: string;
  timestamp: number;
}

/**
 * 设备通知
 */
export interface DeviceNotification {
  id: string;
  deviceId: string;
  type: 'info' | 'warning' | 'error' | 'update';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}
