/**
 * Karma Web App - API 类型定义
 * 基于 AG-UI 协议和接口契约
 *
 * @see docs/api/CONTRACT.md
 * @see docs/api/AG-UI-PROTOCOL.md
 */

// ============================================================================
// AG-UI 协议事件类型
// ============================================================================

/**
 * AG-UI 消息角色
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * AG-UI 工具执行位置
 */
export type ToolExecution = 'frontend' | 'backend';

/**
 * AG-UI 状态操作类型
 */
export type StateOperation = 'set' | 'merge' | 'delete';

/**
 * AG-UI 附件类型
 */
export interface Attachment {
  type: 'file' | 'image' | 'audio' | 'video';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}

/**
 * AG-UI 消息事件
 */
export interface MessageEvent {
  type: 'message';
  role: MessageRole;
  content: string;
  metadata?: {
    agentId?: string;
    timestamp?: number;
  };
}

/**
 * AG-UI 工具调用事件
 */
export interface ToolCallEvent {
  type: 'tool_call';
  id: string;
  name: string;
  arguments: Record<string, any>;
  execution: ToolExecution;
}

/**
 * AG-UI 工具结果事件
 */
export interface ToolResultEvent {
  type: 'tool_result';
  id: string;
  result: any;
  error?: string;
}

/**
 * AG-UI 状态更新事件
 */
export interface StateUpdateEvent {
  type: 'state_update';
  path: string;
  value: any;
  operation: StateOperation;
}

/**
 * AG-UI UI 事件
 */
export interface UIEvent {
  type: 'ui';
  component: string;
  props: Record<string, any>;
}

/**
 * AG-UI 思考事件
 */
export interface ThinkingEvent {
  type: 'thinking';
  status: string;
}

/**
 * AG-UI 进度事件
 */
export interface ProgressEvent {
  type: 'progress';
  percentage: number;
  message?: string;
}

/**
 * AG-UI 中断事件 (Human-in-the-loop)
 */
export interface InterruptEvent {
  type: 'interrupt';
  reason: string;
  options: Array<{
    label: string;
    value: string;
  }>;
}

/**
 * AG-UI 错误事件
 */
export interface ErrorEvent {
  type: 'error';
  message: string;
  code?: string;
}

/**
 * AG-UI 完成事件
 */
export interface DoneEvent {
  type: 'done';
  summary?: {
    messagesCount: number;
    toolsCalled: number;
    statesUpdated: number;
  };
}

/**
 * AG-UI 事件联合类型
 */
export type AgentEvent =
  | MessageEvent
  | ToolCallEvent
  | ToolResultEvent
  | StateUpdateEvent
  | UIEvent
  | ThinkingEvent
  | ProgressEvent
  | InterruptEvent
  | ErrorEvent
  | DoneEvent;

// ============================================================================
// 智能体请求/响应类型
// ============================================================================

/**
 * 智能体请求消息
 */
export interface AgentMessage {
  role: MessageRole;
  content: string;
  attachments?: Attachment[];
}

/**
 * 智能体请求上下文
 */
export interface AgentContext {
  userId: string;
  projectId?: string;
  deviceId?: string;
}

/**
 * 智能体请求选项
 */
export interface AgentOptions {
  stream?: boolean;
  model?: string;
  temperature?: number;
}

/**
 * POST /api/agent 请求体
 */
export interface AgentRequest {
  messages: AgentMessage[];
  state?: Record<string, any>;
  tools?: string[];
  context?: AgentContext;
  options?: AgentOptions;
}

// ============================================================================
// 通用 API 响应类型
// ============================================================================

/**
 * 成功响应
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
  timestamp: number;
}

/**
 * 错误详情
 */
export interface ErrorDetails {
  code: string;
  message: string;
  details?: Record<string, any>;
}

/**
 * 错误响应
 */
export interface ErrorResponse {
  success: false;
  error: ErrorDetails;
  timestamp: number;
}

/**
 * API 响应联合类型
 */
export type ApiResponse<T = any> = SuccessResponse<T> | ErrorResponse;

// ============================================================================
// 设备 API 类型
// ============================================================================

/**
 * 设备状态
 */
export type DeviceStatus = 'online' | 'offline' | 'error' | 'updating';

/**
 * 设备型号
 */
export type DeviceModel = 'EOS-3A' | 'EOS-3B' | 'EOS-3C';

/**
 * 网络类型
 */
export type NetworkType = 'wifi' | 'ethernet' | '5g' | 'bluetooth';

/**
 * 设备位置
 */
export interface DeviceLocation {
  latitude: number;
  longitude: number;
  address?: string;
}

/**
 * 设备能力
 */
export interface DeviceCapabilities {
  aiComputing: boolean;
  videoProcessing: boolean;
  storage: boolean;
  networking: boolean;
}

/**
 * 设备硬件信息
 */
export interface DeviceHardware {
  cpu: string;
  memory: number;
  storage: number;
  gpu?: string;
}

/**
 * 设备网络信息
 */
export interface DeviceNetwork {
  type: NetworkType;
  signalStrength?: number;
  bandwidth?: number;
}

/**
 * 设备完整信息
 */
export interface Device {
  id: string;
  name: string;
  model: DeviceModel;
  status: DeviceStatus;
  ip: string;
  mac: string;
  serialNumber: string;
  firmwareVersion: string;
  lastHeartbeat: number;
  capabilities: DeviceCapabilities;
  hardware: DeviceHardware;
  network: DeviceNetwork;
  location?: DeviceLocation;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

/**
 * GET /api/devices 查询参数
 */
export interface GetDevicesQuery {
  status?: DeviceStatus;
  model?: DeviceModel;
  page?: number;
  pageSize?: number;
  sort?: 'name' | 'createdAt' | 'status';
  order?: 'asc' | 'desc';
}

/**
 * GET /api/devices 响应
 */
export interface GetDevicesResponse {
  devices: Device[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * POST /api/devices 请求体
 */
export interface CreateDeviceRequest {
  name: string;
  model: DeviceModel;
  serialNumber: string;
  mac: string;
  ip?: string;
  location?: DeviceLocation;
  tags?: string[];
}

/**
 * POST /api/devices 响应
 */
export interface CreateDeviceResponse {
  device: Device;
}

/**
 * PUT /api/devices/:id 请求体
 */
export interface UpdateDeviceRequest {
  name?: string;
  location?: DeviceLocation;
  tags?: string[];
}

/**
 * 设备心跳指标
 */
export interface HeartbeatMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  temperature: number;
  uptime: number;
}

/**
 * POST /api/devices/:id/heartbeat 请求体
 */
export interface HeartbeatRequest {
  status: DeviceStatus;
  metrics: HeartbeatMetrics;
  timestamp: number;
}

// ============================================================================
// 文件 API 类型 (引用现有类型)
// ============================================================================

export type {
  DeviceFile,
  DeviceFolder,
  FileType,
  FileCategory,
  FileOperation,
  FileFilter,
  FileSortOptions,
  FileSearchResult,
  FileUploadRequest,
  FileDownloadRequest,
  FileBatchOperation,
  FileBatchOperationResult,
} from '@/lib/device/files/types';

/**
 * GET /api/devices/:id/files 查询参数
 */
export interface GetFilesQuery {
  path?: string;
  type?: string;
  category?: string;
  sort?: 'name' | 'size' | 'createdAt' | 'modifiedAt';
  order?: 'asc' | 'desc';
}

/**
 * GET /api/devices/:id/files 响应
 */
export interface GetFilesResponse {
  files: any[]; // DeviceFile[]
  folders: any[]; // DeviceFolder[]
  totalSize: number;
}

// ============================================================================
// 项目 API 类型
// ============================================================================

/**
 * 项目状态
 */
export type ProjectStatus = 'active' | 'paused' | 'completed' | 'archived';

/**
 * 项目成员角色
 */
export type ProjectMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

/**
 * 项目成员
 */
export interface ProjectMember {
  userId: string;
  name: string;
  avatar: string;
  role: ProjectMemberRole;
}

/**
 * 项目
 */
export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: ProjectStatus;
  members: ProjectMember[];
  tasks: any[]; // Task[]
  createdAt: string;
  updatedAt: string;
}

/**
 * GET /api/projects 响应
 */
export interface GetProjectsResponse {
  projects: Project[];
}

/**
 * POST /api/projects 请求体
 */
export interface CreateProjectRequest {
  name: string;
  description?: string;
  members?: string[];
}

/**
 * POST /api/projects 响应
 */
export interface CreateProjectResponse {
  project: Project;
}

// ============================================================================
// AI 分身 API 类型
// ============================================================================

/**
 * 分身状态
 */
export type AvatarStatus = 'idle' | 'working' | 'error';

/**
 * 分身性能
 */
export interface AvatarPerformance {
  totalTasks: number;
  completedTasks: number;
  averageTime: number;
  successRate: number;
}

/**
 * 分身能力
 */
export interface AvatarAbilities {
  coding: number;
  design: number;
  writing: number;
  analysis: number;
  communication: number;
}

/**
 * 分身收益
 */
export interface AvatarEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  trend: number[];
}

/**
 * AI 分身
 */
export interface Avatar {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  skills: string[];
  status: AvatarStatus;
  performance: AvatarPerformance;
  abilities: AvatarAbilities;
  earnings: AvatarEarnings;
  createdBy: string;
  isPublic: boolean;
  rating?: number;
  reviewCount?: number;
  price?: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * GET /api/avatars 响应
 */
export interface GetAvatarsResponse {
  avatars: Avatar[];
}

/**
 * POST /api/avatars 请求体
 */
export interface CreateAvatarRequest {
  name: string;
  role: string;
  description: string;
  skills: string[];
  isPublic: boolean;
  price?: number;
  baseModel: string;
  systemPrompt: string;
  tools?: string[];
}

/**
 * POST /api/avatars 响应
 */
export interface CreateAvatarResponse {
  avatar: Avatar;
}

// ============================================================================
// 订阅 API 类型
// ============================================================================

/**
 * 订阅计划
 */
export type SubscriptionPlan = 'free' | 'pro' | 'team' | 'enterprise';

/**
 * 订阅状态
 */
export type SubscriptionStatus = 'active' | 'canceled' | 'past_due' | 'trialing';

/**
 * 计费周期
 */
export type BillingCycle = 'monthly' | 'yearly';

/**
 * 订阅信息
 */
export interface Subscription {
  id: string;
  userId: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

/**
 * GET /api/subscriptions 响应
 */
export interface GetSubscriptionResponse {
  subscription: Subscription | null;
}

/**
 * POST /api/subscriptions/create 请求体
 */
export interface CreateSubscriptionRequest {
  plan: Exclude<SubscriptionPlan, 'free'>;
  billingCycle: BillingCycle;
}

/**
 * POST /api/subscriptions/create 响应
 */
export interface CreateSubscriptionResponse {
  checkoutUrl: string;
}

// ============================================================================
// 共享状态类型
// ============================================================================

/**
 * 用户信息（共享状态）
 */
export interface SharedUserState {
  id: string;
  name: string;
  avatar: string;
}

/**
 * 项目信息（共享状态）
 */
export interface SharedProjectState {
  id: string;
  name: string;
  progress: number;
  members: string[];
}

/**
 * 设备信息（共享状态）
 */
export interface SharedDeviceState {
  id: string;
  name: string;
  status: DeviceStatus;
}

/**
 * 分身信息（共享状态）
 */
export interface SharedAvatarState {
  id: string;
  name: string;
  status: AvatarStatus;
  currentTask?: string;
}

/**
 * 收益信息（共享状态）
 */
export interface SharedEarningsState {
  today: number;
  thisWeek: number;
  thisMonth: number;
}

/**
 * UI 状态（共享状态）
 */
export interface SharedUIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';
}

/**
 * 前后端共享状态
 */
export interface SharedState {
  user: SharedUserState;
  project?: SharedProjectState;
  devices: SharedDeviceState[];
  avatars: SharedAvatarState[];
  earnings: SharedEarningsState;
  ui: SharedUIState;
}

// ============================================================================
// 工具定义类型
// ============================================================================

/**
 * 工具参数定义
 */
export interface ToolParameter {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required?: boolean;
  default?: any;
  enum?: string[];
  description?: string;
}

/**
 * 工具定义
 */
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, ToolParameter>;
  execution: ToolExecution;
  handler?: (args: Record<string, any>) => Promise<any>;
}

// ============================================================================
// 导出默认类型
// ============================================================================

export type { User, Task, Conversation, Message, Notification } from '@/types';
