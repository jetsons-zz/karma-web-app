/**
 * 角色定义模块
 * 定义系统中所有角色及其权限映射
 *
 * @module security/roles
 */

import { Permission, PermissionGroups } from './permissions';

/**
 * 角色枚举 - 定义所有系统角色
 */
export enum Role {
  /** 超级管理员 - 拥有所有权限 */
  SUPER_ADMIN = 'super_admin',

  /** 管理员 - 拥有大部分管理权限 */
  ADMIN = 'admin',

  /** 创作者 - 可以创建和发布技能/项目 */
  CREATOR = 'creator',

  /** 高级用户 - 付费用户，拥有更多功能 */
  PREMIUM_USER = 'premium_user',

  /** 普通用户 - 基础功能访问 */
  USER = 'user',

  /** 访客 - 只读权限 */
  GUEST = 'guest',

  /** HITL 审批者 - 专门负责审批 */
  APPROVER = 'approver',

  /** 自动化操作员 - 运行自动化任务 */
  AUTOMATION_OPERATOR = 'automation_operator',
}

/**
 * 角色权限映射
 */
export const RolePermissions: Record<Role, Permission[]> = {
  // 超级管理员 - 所有权限
  [Role.SUPER_ADMIN]: PermissionGroups.ADMIN,

  // 管理员 - 除了某些敏感系统操作外的所有权限
  [Role.ADMIN]: [
    ...PermissionGroups.USER_FULL,
    ...PermissionGroups.CREATOR,
    Permission.USER_VIEW,
    Permission.USER_CREATE,
    Permission.USER_EDIT,
    Permission.SYSTEM_USERS,
    Permission.SYSTEM_MONITOR,
    Permission.AUDIT_VIEW,
    Permission.AUDIT_EXPORT,
    Permission.STORE_MANAGE,
    Permission.PAYMENT_REFUND,
  ],

  // 创作者 - 用户权限 + 创作权限
  [Role.CREATOR]: [
    ...PermissionGroups.USER_FULL,
    ...PermissionGroups.CREATOR,
  ],

  // 高级用户 - 完整用户权限
  [Role.PREMIUM_USER]: PermissionGroups.USER_FULL,

  // 普通用户 - 基础用户权限
  [Role.USER]: [
    ...PermissionGroups.USER_BASIC,
    Permission.AVATAR_CREATE,
    Permission.AVATAR_EDIT,
    Permission.STORE_PURCHASE,
    Permission.PAYMENT_VIEW,
    Permission.SUBSCRIPTION_VIEW,
  ],

  // 访客 - 只读权限
  [Role.GUEST]: [
    Permission.TASK_VIEW,
    Permission.AVATAR_VIEW,
    Permission.SKILL_VIEW,
    Permission.PROJECT_VIEW,
    Permission.STORE_VIEW,
  ],

  // HITL 审批者
  [Role.APPROVER]: [
    ...PermissionGroups.USER_BASIC,
    ...PermissionGroups.APPROVER,
  ],

  // 自动化操作员
  [Role.AUTOMATION_OPERATOR]: [
    ...PermissionGroups.USER_BASIC,
    ...PermissionGroups.AUTOMATION,
  ],
};

/**
 * 角色描述 - 用于 UI 显示
 */
export const RoleDescriptions: Record<Role, { name: string; description: string }> = {
  [Role.SUPER_ADMIN]: {
    name: '超级管理员',
    description: '拥有系统的所有权限，可以管理所有功能和用户',
  },
  [Role.ADMIN]: {
    name: '管理员',
    description: '拥有大部分管理权限，可以管理用户和系统配置',
  },
  [Role.CREATOR]: {
    name: '创作者',
    description: '可以创建、发布技能和项目，并获得收益',
  },
  [Role.PREMIUM_USER]: {
    name: '高级用户',
    description: '付费用户，拥有完整的用户功能',
  },
  [Role.USER]: {
    name: '普通用户',
    description: '拥有基础功能访问权限',
  },
  [Role.GUEST]: {
    name: '访客',
    description: '只能查看和浏览，无法进行操作',
  },
  [Role.APPROVER]: {
    name: '审批者',
    description: '负责审批 HITL 请求',
  },
  [Role.AUTOMATION_OPERATOR]: {
    name: '自动化操作员',
    description: '可以创建和运行自动化任务',
  },
};

/**
 * 角色层级 - 数字越大权限越高
 */
export const RoleHierarchy: Record<Role, number> = {
  [Role.GUEST]: 0,
  [Role.USER]: 10,
  [Role.AUTOMATION_OPERATOR]: 15,
  [Role.APPROVER]: 15,
  [Role.PREMIUM_USER]: 20,
  [Role.CREATOR]: 30,
  [Role.ADMIN]: 80,
  [Role.SUPER_ADMIN]: 100,
};

/**
 * 检查角色是否有效
 */
export function isValidRole(role: string): role is Role {
  return Object.values(Role).includes(role as Role);
}

/**
 * 获取角色的显示名称
 */
export function getRoleName(role: Role): string {
  return RoleDescriptions[role]?.name || role;
}

/**
 * 获取角色的描述
 */
export function getRoleDescription(role: Role): string {
  return RoleDescriptions[role]?.description || '';
}

/**
 * 获取角色的所有权限
 */
export function getRolePermissions(role: Role): Permission[] {
  return RolePermissions[role] || [];
}

/**
 * 检查角色 A 是否比角色 B 权限更高
 */
export function isRoleHigher(roleA: Role, roleB: Role): boolean {
  return RoleHierarchy[roleA] > RoleHierarchy[roleB];
}

/**
 * 检查角色 A 是否比角色 B 权限相同或更高
 */
export function isRoleHigherOrEqual(roleA: Role, roleB: Role): boolean {
  return RoleHierarchy[roleA] >= RoleHierarchy[roleB];
}

/**
 * 获取用户可以分配的角色列表
 * 用户只能分配比自己权限低的角色
 */
export function getAssignableRoles(currentUserRole: Role): Role[] {
  const currentLevel = RoleHierarchy[currentUserRole];
  return Object.entries(RoleHierarchy)
    .filter(([_, level]) => level < currentLevel)
    .map(([role, _]) => role as Role);
}

/**
 * 默认角色 - 新用户注册时的默认角色
 */
export const DEFAULT_ROLE = Role.USER;

/**
 * 公开角色 - 不需要登录就能访问的角色
 */
export const PUBLIC_ROLES = [Role.GUEST];

/**
 * 需要付费的角色
 */
export const PAID_ROLES = [Role.PREMIUM_USER, Role.CREATOR];
