/**
 * 审计日志类型定义
 * 定义所有审计事件类型和相关数据结构
 *
 * @module security/auditTypes
 */

/**
 * 审计事件类别
 */
export enum AuditCategory {
  /** 认证相关 */
  AUTH = 'auth',
  /** 用户管理 */
  USER = 'user',
  /** 任务/会话管理 */
  TASK = 'task',
  /** 分身管理 */
  AVATAR = 'avatar',
  /** 技能/项目管理 */
  SKILL = 'skill',
  /** 支付相关 */
  PAYMENT = 'payment',
  /** 订阅管理 */
  SUBSCRIPTION = 'subscription',
  /** 权限管理 */
  PERMISSION = 'permission',
  /** 系统配置 */
  SYSTEM = 'system',
  /** 文件操作 */
  FILE = 'file',
  /** API 操作 */
  API = 'api',
  /** 安全事件 */
  SECURITY = 'security',
}

/**
 * 审计事件类型
 */
export enum AuditEventType {
  // ========== 认证事件 ==========
  LOGIN_SUCCESS = 'auth.login.success',
  LOGIN_FAILED = 'auth.login.failed',
  LOGOUT = 'auth.logout',
  PASSWORD_CHANGE = 'auth.password.change',
  PASSWORD_RESET = 'auth.password.reset',
  TOKEN_REFRESH = 'auth.token.refresh',
  TOKEN_REVOKE = 'auth.token.revoke',

  // ========== 用户事件 ==========
  USER_CREATE = 'user.create',
  USER_UPDATE = 'user.update',
  USER_DELETE = 'user.delete',
  USER_ROLE_CHANGE = 'user.role.change',
  USER_PERMISSION_GRANT = 'user.permission.grant',
  USER_PERMISSION_REVOKE = 'user.permission.revoke',

  // ========== 任务/会话事件 ==========
  TASK_CREATE = 'task.create',
  TASK_UPDATE = 'task.update',
  TASK_DELETE = 'task.delete',
  TASK_SHARE = 'task.share',
  TASK_EXPORT = 'task.export',

  // ========== 分身事件 ==========
  AVATAR_CREATE = 'avatar.create',
  AVATAR_UPDATE = 'avatar.update',
  AVATAR_DELETE = 'avatar.delete',
  AVATAR_ACTIVATE = 'avatar.activate',
  AVATAR_DEACTIVATE = 'avatar.deactivate',

  // ========== 技能/项目事件 ==========
  SKILL_CREATE = 'skill.create',
  SKILL_UPDATE = 'skill.update',
  SKILL_DELETE = 'skill.delete',
  SKILL_PUBLISH = 'skill.publish',
  SKILL_UNPUBLISH = 'skill.unpublish',

  PROJECT_CREATE = 'project.create',
  PROJECT_UPDATE = 'project.update',
  PROJECT_DELETE = 'project.delete',
  PROJECT_PUBLISH = 'project.publish',
  PROJECT_UNPUBLISH = 'project.unpublish',

  // ========== 支付事件 ==========
  PAYMENT_CREATE = 'payment.create',
  PAYMENT_SUCCESS = 'payment.success',
  PAYMENT_FAILED = 'payment.failed',
  PAYMENT_REFUND = 'payment.refund',

  // ========== 订阅事件 ==========
  SUBSCRIPTION_CREATE = 'subscription.create',
  SUBSCRIPTION_UPDATE = 'subscription.update',
  SUBSCRIPTION_CANCEL = 'subscription.cancel',
  SUBSCRIPTION_RENEW = 'subscription.renew',

  // ========== 权限事件 ==========
  PERMISSION_CHECK = 'permission.check',
  PERMISSION_DENIED = 'permission.denied',
  ROLE_CREATE = 'role.create',
  ROLE_UPDATE = 'role.update',
  ROLE_DELETE = 'role.delete',

  // ========== 系统事件 ==========
  SYSTEM_CONFIG_UPDATE = 'system.config.update',
  SYSTEM_BACKUP = 'system.backup',
  SYSTEM_RESTORE = 'system.restore',

  // ========== 文件事件 ==========
  FILE_UPLOAD = 'file.upload',
  FILE_DOWNLOAD = 'file.download',
  FILE_DELETE = 'file.delete',

  // ========== API 事件 ==========
  API_KEY_CREATE = 'api.key.create',
  API_KEY_DELETE = 'api.key.delete',
  API_CALL = 'api.call',
  API_ERROR = 'api.error',

  // ========== 安全事件 ==========
  SECURITY_BREACH_ATTEMPT = 'security.breach.attempt',
  SECURITY_RATE_LIMIT = 'security.rate_limit',
  SECURITY_SUSPICIOUS_ACTIVITY = 'security.suspicious',
}

/**
 * 审计事件严重程度
 */
export enum AuditSeverity {
  /** 信息 */
  INFO = 'info',
  /** 警告 */
  WARNING = 'warning',
  /** 错误 */
  ERROR = 'error',
  /** 严重 */
  CRITICAL = 'critical',
}

/**
 * 审计日志记录
 */
export interface AuditLogEntry {
  /** 日志 ID */
  id: string;

  /** 事件类型 */
  eventType: AuditEventType;

  /** 事件类别 */
  category: AuditCategory;

  /** 严重程度 */
  severity: AuditSeverity;

  /** 时间戳 */
  timestamp: number;

  /** 用户 ID（可选，某些系统事件可能没有用户） */
  userId?: string;

  /** 用户名 */
  username?: string;

  /** IP 地址 */
  ipAddress?: string;

  /** User Agent */
  userAgent?: string;

  /** 资源 ID（被操作的资源，如任务ID、分身ID等） */
  resourceId?: string;

  /** 资源类型 */
  resourceType?: string;

  /** 操作结果 */
  success: boolean;

  /** 错误消息（如果失败） */
  errorMessage?: string;

  /** 事件详情（JSON 格式的额外数据） */
  details?: Record<string, any>;

  /** 操作前的数据（用于追踪变更） */
  beforeData?: Record<string, any>;

  /** 操作后的数据 */
  afterData?: Record<string, any>;

  /** 会话 ID */
  sessionId?: string;

  /** 请求 ID（用于追踪完整的请求链路） */
  requestId?: string;
}

/**
 * 审计日志查询条件
 */
export interface AuditLogQuery {
  /** 用户 ID */
  userId?: string;

  /** 事件类型 */
  eventType?: AuditEventType | AuditEventType[];

  /** 事件类别 */
  category?: AuditCategory | AuditCategory[];

  /** 严重程度 */
  severity?: AuditSeverity | AuditSeverity[];

  /** 开始时间 */
  startTime?: number;

  /** 结束时间 */
  endTime?: number;

  /** 是否成功 */
  success?: boolean;

  /** 资源 ID */
  resourceId?: string;

  /** 资源类型 */
  resourceType?: string;

  /** IP 地址 */
  ipAddress?: string;

  /** 分页 - 页码 */
  page?: number;

  /** 分页 - 每页数量 */
  pageSize?: number;

  /** 排序字段 */
  sortBy?: 'timestamp' | 'severity' | 'eventType';

  /** 排序方向 */
  sortOrder?: 'asc' | 'desc';
}

/**
 * 审计日志查询结果
 */
export interface AuditLogQueryResult {
  /** 日志列表 */
  logs: AuditLogEntry[];

  /** 总数 */
  total: number;

  /** 当前页 */
  page: number;

  /** 每页数量 */
  pageSize: number;

  /** 总页数 */
  totalPages: number;
}

/**
 * 审计统计数据
 */
export interface AuditStatistics {
  /** 总事件数 */
  totalEvents: number;

  /** 按类别统计 */
  byCategory: Record<AuditCategory, number>;

  /** 按严重程度统计 */
  bySeverity: Record<AuditSeverity, number>;

  /** 成功/失败统计 */
  successRate: {
    success: number;
    failed: number;
    rate: number; // 成功率 0-1
  };

  /** 最活跃用户 */
  topUsers: Array<{
    userId: string;
    username?: string;
    eventCount: number;
  }>;

  /** 最常见事件类型 */
  topEventTypes: Array<{
    eventType: AuditEventType;
    count: number;
  }>;
}
