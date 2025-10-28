/**
 * 权限定义模块
 * 定义系统中所有可用的权限
 *
 * @module security/permissions
 */

/**
 * 权限枚举 - 定义所有系统权限
 */
export enum Permission {
  // ========== 用户管理权限 ==========
  USER_VIEW = 'user:view',
  USER_CREATE = 'user:create',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',

  // ========== 任务/会话权限 ==========
  TASK_VIEW = 'task:view',
  TASK_CREATE = 'task:create',
  TASK_EDIT = 'task:edit',
  TASK_DELETE = 'task:delete',
  TASK_SHARE = 'task:share',
  TASK_EXPORT = 'task:export',

  // ========== 分身管理权限 ==========
  AVATAR_VIEW = 'avatar:view',
  AVATAR_CREATE = 'avatar:create',
  AVATAR_EDIT = 'avatar:edit',
  AVATAR_DELETE = 'avatar:delete',
  AVATAR_ACTIVATE = 'avatar:activate',
  AVATAR_DEACTIVATE = 'avatar:deactivate',

  // ========== 技能/项目权限 ==========
  SKILL_VIEW = 'skill:view',
  SKILL_CREATE = 'skill:create',
  SKILL_EDIT = 'skill:edit',
  SKILL_DELETE = 'skill:delete',
  SKILL_PUBLISH = 'skill:publish',
  SKILL_UNPUBLISH = 'skill:unpublish',

  PROJECT_VIEW = 'project:view',
  PROJECT_CREATE = 'project:create',
  PROJECT_EDIT = 'project:edit',
  PROJECT_DELETE = 'project:delete',
  PROJECT_PUBLISH = 'project:publish',
  PROJECT_UNPUBLISH = 'project:unpublish',

  // ========== 商店权限 ==========
  STORE_VIEW = 'store:view',
  STORE_PURCHASE = 'store:purchase',
  STORE_MANAGE = 'store:manage',
  STORE_ANALYTICS = 'store:analytics',

  // ========== 支付和订阅权限 ==========
  PAYMENT_VIEW = 'payment:view',
  PAYMENT_CREATE = 'payment:create',
  PAYMENT_REFUND = 'payment:refund',

  SUBSCRIPTION_VIEW = 'subscription:view',
  SUBSCRIPTION_MANAGE = 'subscription:manage',
  SUBSCRIPTION_CANCEL = 'subscription:cancel',

  // ========== 收益权限 ==========
  REVENUE_VIEW = 'revenue:view',
  REVENUE_WITHDRAW = 'revenue:withdraw',
  REVENUE_ANALYTICS = 'revenue:analytics',

  // ========== 审计和日志权限 ==========
  AUDIT_VIEW = 'audit:view',
  AUDIT_EXPORT = 'audit:export',
  AUDIT_DELETE = 'audit:delete',

  // ========== 系统管理权限 ==========
  SYSTEM_SETTINGS = 'system:settings',
  SYSTEM_USERS = 'system:users',
  SYSTEM_ROLES = 'system:roles',
  SYSTEM_MONITOR = 'system:monitor',

  // ========== API 密钥管理权限 ==========
  API_KEY_VIEW = 'api_key:view',
  API_KEY_CREATE = 'api_key:create',
  API_KEY_DELETE = 'api_key:delete',

  // ========== 文件管理权限 ==========
  FILE_UPLOAD = 'file:upload',
  FILE_DOWNLOAD = 'file:download',
  FILE_DELETE = 'file:delete',

  // ========== HITL 权限 ==========
  HITL_APPROVE = 'hitl:approve',
  HITL_REJECT = 'hitl:reject',
  HITL_VIEW = 'hitl:view',

  // ========== 自动化权限 ==========
  AUTOMATION_VIEW = 'automation:view',
  AUTOMATION_CREATE = 'automation:create',
  AUTOMATION_EDIT = 'automation:edit',
  AUTOMATION_DELETE = 'automation:delete',
  AUTOMATION_EXECUTE = 'automation:execute',
}

/**
 * 权限分组 - 方便批量分配权限
 */
export const PermissionGroups = {
  // 用户基础权限
  USER_BASIC: [
    Permission.TASK_VIEW,
    Permission.TASK_CREATE,
    Permission.TASK_EDIT,
    Permission.TASK_DELETE,
    Permission.AVATAR_VIEW,
    Permission.SKILL_VIEW,
    Permission.PROJECT_VIEW,
    Permission.STORE_VIEW,
    Permission.FILE_UPLOAD,
    Permission.FILE_DOWNLOAD,
  ],

  // 用户完整权限
  USER_FULL: [
    ...PermissionGroups.USER_BASIC,
    Permission.TASK_SHARE,
    Permission.TASK_EXPORT,
    Permission.AVATAR_CREATE,
    Permission.AVATAR_EDIT,
    Permission.AVATAR_ACTIVATE,
    Permission.AVATAR_DEACTIVATE,
    Permission.STORE_PURCHASE,
    Permission.PAYMENT_VIEW,
    Permission.PAYMENT_CREATE,
    Permission.SUBSCRIPTION_VIEW,
    Permission.SUBSCRIPTION_MANAGE,
    Permission.FILE_DELETE,
  ],

  // 创作者权限
  CREATOR: [
    Permission.SKILL_CREATE,
    Permission.SKILL_EDIT,
    Permission.SKILL_DELETE,
    Permission.SKILL_PUBLISH,
    Permission.SKILL_UNPUBLISH,
    Permission.PROJECT_CREATE,
    Permission.PROJECT_EDIT,
    Permission.PROJECT_DELETE,
    Permission.PROJECT_PUBLISH,
    Permission.PROJECT_UNPUBLISH,
    Permission.REVENUE_VIEW,
    Permission.REVENUE_WITHDRAW,
    Permission.REVENUE_ANALYTICS,
    Permission.STORE_ANALYTICS,
  ],

  // 管理员权限
  ADMIN: Object.values(Permission),

  // HITL 审批权限
  APPROVER: [
    Permission.HITL_VIEW,
    Permission.HITL_APPROVE,
    Permission.HITL_REJECT,
  ],

  // 自动化权限
  AUTOMATION: [
    Permission.AUTOMATION_VIEW,
    Permission.AUTOMATION_CREATE,
    Permission.AUTOMATION_EDIT,
    Permission.AUTOMATION_DELETE,
    Permission.AUTOMATION_EXECUTE,
  ],
} as const;

/**
 * 权限描述 - 用于 UI 显示
 */
export const PermissionDescriptions: Record<Permission, { name: string; description: string }> = {
  // 用户管理
  [Permission.USER_VIEW]: {
    name: '查看用户',
    description: '可以查看用户列表和详细信息',
  },
  [Permission.USER_CREATE]: {
    name: '创建用户',
    description: '可以创建新用户',
  },
  [Permission.USER_EDIT]: {
    name: '编辑用户',
    description: '可以修改用户信息',
  },
  [Permission.USER_DELETE]: {
    name: '删除用户',
    description: '可以删除用户账号',
  },

  // 任务/会话
  [Permission.TASK_VIEW]: {
    name: '查看任务',
    description: '可以查看任务/会话列表',
  },
  [Permission.TASK_CREATE]: {
    name: '创建任务',
    description: '可以创建新任务/会话',
  },
  [Permission.TASK_EDIT]: {
    name: '编辑任务',
    description: '可以修改任务内容',
  },
  [Permission.TASK_DELETE]: {
    name: '删除任务',
    description: '可以删除任务/会话',
  },
  [Permission.TASK_SHARE]: {
    name: '分享任务',
    description: '可以分享任务给其他用户',
  },
  [Permission.TASK_EXPORT]: {
    name: '导出任务',
    description: '可以导出任务数据',
  },

  // 分身管理
  [Permission.AVATAR_VIEW]: {
    name: '查看分身',
    description: '可以查看分身列表',
  },
  [Permission.AVATAR_CREATE]: {
    name: '创建分身',
    description: '可以创建新分身',
  },
  [Permission.AVATAR_EDIT]: {
    name: '编辑分身',
    description: '可以修改分身配置',
  },
  [Permission.AVATAR_DELETE]: {
    name: '删除分身',
    description: '可以删除分身',
  },
  [Permission.AVATAR_ACTIVATE]: {
    name: '激活分身',
    description: '可以启动分身',
  },
  [Permission.AVATAR_DEACTIVATE]: {
    name: '停用分身',
    description: '可以停止分身',
  },

  // 技能/项目
  [Permission.SKILL_VIEW]: {
    name: '查看技能',
    description: '可以查看技能列表',
  },
  [Permission.SKILL_CREATE]: {
    name: '创建技能',
    description: '可以创建新技能',
  },
  [Permission.SKILL_EDIT]: {
    name: '编辑技能',
    description: '可以修改技能内容',
  },
  [Permission.SKILL_DELETE]: {
    name: '删除技能',
    description: '可以删除技能',
  },
  [Permission.SKILL_PUBLISH]: {
    name: '发布技能',
    description: '可以发布技能到商店',
  },
  [Permission.SKILL_UNPUBLISH]: {
    name: '下架技能',
    description: '可以从商店下架技能',
  },

  [Permission.PROJECT_VIEW]: {
    name: '查看项目',
    description: '可以查看项目列表',
  },
  [Permission.PROJECT_CREATE]: {
    name: '创建项目',
    description: '可以创建新项目',
  },
  [Permission.PROJECT_EDIT]: {
    name: '编辑项目',
    description: '可以修改项目内容',
  },
  [Permission.PROJECT_DELETE]: {
    name: '删除项目',
    description: '可以删除项目',
  },
  [Permission.PROJECT_PUBLISH]: {
    name: '发布项目',
    description: '可以发布项目到商店',
  },
  [Permission.PROJECT_UNPUBLISH]: {
    name: '下架项目',
    description: '可以从商店下架项目',
  },

  // 商店
  [Permission.STORE_VIEW]: {
    name: '浏览商店',
    description: '可以浏览商店内容',
  },
  [Permission.STORE_PURCHASE]: {
    name: '购买商品',
    description: '可以购买技能和项目',
  },
  [Permission.STORE_MANAGE]: {
    name: '管理商店',
    description: '可以管理商店配置',
  },
  [Permission.STORE_ANALYTICS]: {
    name: '商店分析',
    description: '可以查看商店数据分析',
  },

  // 支付和订阅
  [Permission.PAYMENT_VIEW]: {
    name: '查看支付',
    description: '可以查看支付记录',
  },
  [Permission.PAYMENT_CREATE]: {
    name: '创建支付',
    description: '可以发起支付',
  },
  [Permission.PAYMENT_REFUND]: {
    name: '退款',
    description: '可以处理退款',
  },

  [Permission.SUBSCRIPTION_VIEW]: {
    name: '查看订阅',
    description: '可以查看订阅信息',
  },
  [Permission.SUBSCRIPTION_MANAGE]: {
    name: '管理订阅',
    description: '可以修改订阅计划',
  },
  [Permission.SUBSCRIPTION_CANCEL]: {
    name: '取消订阅',
    description: '可以取消订阅',
  },

  // 收益
  [Permission.REVENUE_VIEW]: {
    name: '查看收益',
    description: '可以查看收益数据',
  },
  [Permission.REVENUE_WITHDRAW]: {
    name: '提现',
    description: '可以提现收益',
  },
  [Permission.REVENUE_ANALYTICS]: {
    name: '收益分析',
    description: '可以查看收益分析',
  },

  // 审计
  [Permission.AUDIT_VIEW]: {
    name: '查看审计日志',
    description: '可以查看审计日志',
  },
  [Permission.AUDIT_EXPORT]: {
    name: '导出审计日志',
    description: '可以导出审计日志',
  },
  [Permission.AUDIT_DELETE]: {
    name: '删除审计日志',
    description: '可以删除审计日志',
  },

  // 系统管理
  [Permission.SYSTEM_SETTINGS]: {
    name: '系统设置',
    description: '可以修改系统设置',
  },
  [Permission.SYSTEM_USERS]: {
    name: '用户管理',
    description: '可以管理系统用户',
  },
  [Permission.SYSTEM_ROLES]: {
    name: '角色管理',
    description: '可以管理角色和权限',
  },
  [Permission.SYSTEM_MONITOR]: {
    name: '系统监控',
    description: '可以查看系统监控数据',
  },

  // API 密钥
  [Permission.API_KEY_VIEW]: {
    name: '查看 API 密钥',
    description: '可以查看 API 密钥',
  },
  [Permission.API_KEY_CREATE]: {
    name: '创建 API 密钥',
    description: '可以创建新的 API 密钥',
  },
  [Permission.API_KEY_DELETE]: {
    name: '删除 API 密钥',
    description: '可以删除 API 密钥',
  },

  // 文件管理
  [Permission.FILE_UPLOAD]: {
    name: '上传文件',
    description: '可以上传文件',
  },
  [Permission.FILE_DOWNLOAD]: {
    name: '下载文件',
    description: '可以下载文件',
  },
  [Permission.FILE_DELETE]: {
    name: '删除文件',
    description: '可以删除文件',
  },

  // HITL
  [Permission.HITL_APPROVE]: {
    name: '批准请求',
    description: '可以批准 HITL 请求',
  },
  [Permission.HITL_REJECT]: {
    name: '拒绝请求',
    description: '可以拒绝 HITL 请求',
  },
  [Permission.HITL_VIEW]: {
    name: '查看请求',
    description: '可以查看 HITL 请求',
  },

  // 自动化
  [Permission.AUTOMATION_VIEW]: {
    name: '查看自动化',
    description: '可以查看自动化任务',
  },
  [Permission.AUTOMATION_CREATE]: {
    name: '创建自动化',
    description: '可以创建自动化任务',
  },
  [Permission.AUTOMATION_EDIT]: {
    name: '编辑自动化',
    description: '可以修改自动化任务',
  },
  [Permission.AUTOMATION_DELETE]: {
    name: '删除自动化',
    description: '可以删除自动化任务',
  },
  [Permission.AUTOMATION_EXECUTE]: {
    name: '执行自动化',
    description: '可以手动执行自动化任务',
  },
};

/**
 * 检查权限是否有效
 */
export function isValidPermission(permission: string): permission is Permission {
  return Object.values(Permission).includes(permission as Permission);
}

/**
 * 获取权限的显示名称
 */
export function getPermissionName(permission: Permission): string {
  return PermissionDescriptions[permission]?.name || permission;
}

/**
 * 获取权限的描述
 */
export function getPermissionDescription(permission: Permission): string {
  return PermissionDescriptions[permission]?.description || '';
}
