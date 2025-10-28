/**
 * 基于角色的访问控制 (RBAC) 模块
 * 提供权限检查和访问控制功能
 *
 * @module security/rbac
 */

import { Permission } from './permissions';
import { Role, RolePermissions, RoleHierarchy } from './roles';

/**
 * 用户权限信息
 */
export interface UserPermissions {
  userId: string;
  roles: Role[];
  customPermissions?: Permission[]; // 额外授予的自定义权限
  deniedPermissions?: Permission[]; // 明确拒绝的权限
}

/**
 * RBAC 管理器（单例模式）
 */
export class RBACManager {
  private static instance: RBACManager;
  private userPermissionsCache: Map<string, UserPermissions> = new Map();

  private constructor() {}

  /**
   * 获取单例实例
   */
  static getInstance(): RBACManager {
    if (!this.instance) {
      this.instance = new RBACManager();
    }
    return this.instance;
  }

  /**
   * 设置用户权限（缓存）
   */
  setUserPermissions(userPermissions: UserPermissions): void {
    this.userPermissionsCache.set(userPermissions.userId, userPermissions);
  }

  /**
   * 获取用户权限
   */
  getUserPermissions(userId: string): UserPermissions | null {
    return this.userPermissionsCache.get(userId) || null;
  }

  /**
   * 清除用户权限缓存
   */
  clearUserPermissions(userId: string): void {
    this.userPermissionsCache.delete(userId);
  }

  /**
   * 清除所有权限缓存
   */
  clearAllPermissions(): void {
    this.userPermissionsCache.clear();
  }

  /**
   * 获取用户的所有权限（从角色推导）
   */
  getAllPermissions(userPermissions: UserPermissions): Permission[] {
    const permissions = new Set<Permission>();

    // 1. 从角色获取权限
    for (const role of userPermissions.roles) {
      const rolePerms = RolePermissions[role] || [];
      rolePerms.forEach((p) => permissions.add(p));
    }

    // 2. 添加自定义权限
    if (userPermissions.customPermissions) {
      userPermissions.customPermissions.forEach((p) => permissions.add(p));
    }

    // 3. 移除被拒绝的权限
    if (userPermissions.deniedPermissions) {
      userPermissions.deniedPermissions.forEach((p) => permissions.delete(p));
    }

    return Array.from(permissions);
  }

  /**
   * 检查用户是否有指定权限
   */
  hasPermission(userPermissions: UserPermissions, permission: Permission): boolean {
    const allPermissions = this.getAllPermissions(userPermissions);
    return allPermissions.includes(permission);
  }

  /**
   * 检查用户是否有所有指定权限
   */
  hasAllPermissions(userPermissions: UserPermissions, permissions: Permission[]): boolean {
    const allPermissions = this.getAllPermissions(userPermissions);
    return permissions.every((p) => allPermissions.includes(p));
  }

  /**
   * 检查用户是否有任一指定权限
   */
  hasAnyPermission(userPermissions: UserPermissions, permissions: Permission[]): boolean {
    const allPermissions = this.getAllPermissions(userPermissions);
    return permissions.some((p) => allPermissions.includes(p));
  }

  /**
   * 检查用户是否有指定角色
   */
  hasRole(userPermissions: UserPermissions, role: Role): boolean {
    return userPermissions.roles.includes(role);
  }

  /**
   * 检查用户是否有所有指定角色
   */
  hasAllRoles(userPermissions: UserPermissions, roles: Role[]): boolean {
    return roles.every((r) => userPermissions.roles.includes(r));
  }

  /**
   * 检查用户是否有任一指定角色
   */
  hasAnyRole(userPermissions: UserPermissions, roles: Role[]): boolean {
    return roles.some((r) => userPermissions.roles.includes(r));
  }

  /**
   * 检查用户角色是否比目标角色权限高
   */
  hasHigherRole(userPermissions: UserPermissions, targetRole: Role): boolean {
    const userMaxLevel = Math.max(
      ...userPermissions.roles.map((r) => RoleHierarchy[r] || 0)
    );
    const targetLevel = RoleHierarchy[targetRole] || 0;
    return userMaxLevel > targetLevel;
  }

  /**
   * 检查用户角色是否比目标角色权限相同或更高
   */
  hasHigherOrEqualRole(userPermissions: UserPermissions, targetRole: Role): boolean {
    const userMaxLevel = Math.max(
      ...userPermissions.roles.map((r) => RoleHierarchy[r] || 0)
    );
    const targetLevel = RoleHierarchy[targetRole] || 0;
    return userMaxLevel >= targetLevel;
  }

  /**
   * 授予用户自定义权限
   */
  grantPermission(userId: string, permission: Permission): void {
    const userPerms = this.getUserPermissions(userId);
    if (!userPerms) return;

    if (!userPerms.customPermissions) {
      userPerms.customPermissions = [];
    }

    if (!userPerms.customPermissions.includes(permission)) {
      userPerms.customPermissions.push(permission);
    }

    // 从拒绝列表中移除（如果存在）
    if (userPerms.deniedPermissions) {
      userPerms.deniedPermissions = userPerms.deniedPermissions.filter(
        (p) => p !== permission
      );
    }

    this.setUserPermissions(userPerms);
  }

  /**
   * 撤销用户自定义权限
   */
  revokePermission(userId: string, permission: Permission): void {
    const userPerms = this.getUserPermissions(userId);
    if (!userPerms) return;

    if (userPerms.customPermissions) {
      userPerms.customPermissions = userPerms.customPermissions.filter(
        (p) => p !== permission
      );
    }

    this.setUserPermissions(userPerms);
  }

  /**
   * 拒绝用户权限（明确拒绝，覆盖角色权限）
   */
  denyPermission(userId: string, permission: Permission): void {
    const userPerms = this.getUserPermissions(userId);
    if (!userPerms) return;

    if (!userPerms.deniedPermissions) {
      userPerms.deniedPermissions = [];
    }

    if (!userPerms.deniedPermissions.includes(permission)) {
      userPerms.deniedPermissions.push(permission);
    }

    // 从自定义权限中移除（如果存在）
    if (userPerms.customPermissions) {
      userPerms.customPermissions = userPerms.customPermissions.filter(
        (p) => p !== permission
      );
    }

    this.setUserPermissions(userPerms);
  }

  /**
   * 添加用户角色
   */
  addRole(userId: string, role: Role): void {
    const userPerms = this.getUserPermissions(userId);
    if (!userPerms) return;

    if (!userPerms.roles.includes(role)) {
      userPerms.roles.push(role);
    }

    this.setUserPermissions(userPerms);
  }

  /**
   * 移除用户角色
   */
  removeRole(userId: string, role: Role): void {
    const userPerms = this.getUserPermissions(userId);
    if (!userPerms) return;

    userPerms.roles = userPerms.roles.filter((r) => r !== role);
    this.setUserPermissions(userPerms);
  }
}

/**
 * 导出单例实例
 */
export const rbacManager = RBACManager.getInstance();

/**
 * 便捷函数 - 检查权限
 */
export function checkPermission(
  userPermissions: UserPermissions,
  permission: Permission
): boolean {
  return rbacManager.hasPermission(userPermissions, permission);
}

/**
 * 便捷函数 - 检查角色
 */
export function checkRole(userPermissions: UserPermissions, role: Role): boolean {
  return rbacManager.hasRole(userPermissions, role);
}

/**
 * 便捷函数 - 检查多个权限（AND）
 */
export function checkAllPermissions(
  userPermissions: UserPermissions,
  permissions: Permission[]
): boolean {
  return rbacManager.hasAllPermissions(userPermissions, permissions);
}

/**
 * 便捷函数 - 检查多个权限（OR）
 */
export function checkAnyPermission(
  userPermissions: UserPermissions,
  permissions: Permission[]
): boolean {
  return rbacManager.hasAnyPermission(userPermissions, permissions);
}

/**
 * React Hook - 使用 RBAC
 */
export function useRBAC(userId: string) {
  const manager = RBACManager.getInstance();
  const userPermissions = manager.getUserPermissions(userId);

  return {
    userPermissions,
    hasPermission: (permission: Permission) =>
      userPermissions ? manager.hasPermission(userPermissions, permission) : false,
    hasAllPermissions: (permissions: Permission[]) =>
      userPermissions ? manager.hasAllPermissions(userPermissions, permissions) : false,
    hasAnyPermission: (permissions: Permission[]) =>
      userPermissions ? manager.hasAnyPermission(userPermissions, permissions) : false,
    hasRole: (role: Role) =>
      userPermissions ? manager.hasRole(userPermissions, role) : false,
    hasAllRoles: (roles: Role[]) =>
      userPermissions ? manager.hasAllRoles(userPermissions, roles) : false,
    hasAnyRole: (roles: Role[]) =>
      userPermissions ? manager.hasAnyRole(userPermissions, roles) : false,
    hasHigherRole: (targetRole: Role) =>
      userPermissions ? manager.hasHigherRole(userPermissions, targetRole) : false,
    getAllPermissions: () =>
      userPermissions ? manager.getAllPermissions(userPermissions) : [],
  };
}

/**
 * 权限守卫 - 用于 API 路由
 */
export function requirePermission(permission: Permission) {
  return (userPermissions: UserPermissions | null): boolean => {
    if (!userPermissions) return false;
    return rbacManager.hasPermission(userPermissions, permission);
  };
}

/**
 * 角色守卫 - 用于 API 路由
 */
export function requireRole(role: Role) {
  return (userPermissions: UserPermissions | null): boolean => {
    if (!userPermissions) return false;
    return rbacManager.hasRole(userPermissions, role);
  };
}

/**
 * 多权限守卫（AND）
 */
export function requireAllPermissions(...permissions: Permission[]) {
  return (userPermissions: UserPermissions | null): boolean => {
    if (!userPermissions) return false;
    return rbacManager.hasAllPermissions(userPermissions, permissions);
  };
}

/**
 * 多权限守卫（OR）
 */
export function requireAnyPermission(...permissions: Permission[]) {
  return (userPermissions: UserPermissions | null): boolean => {
    if (!userPermissions) return false;
    return rbacManager.hasAnyPermission(userPermissions, permissions);
  };
}
