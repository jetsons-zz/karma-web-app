/**
 * 任务协调器模块
 * 负责任务分配、负载均衡和执行管理
 *
 * @module coordination/taskCoordinator
 */

import { messageBus, Topics, MessagePriority } from './messageBus';

/**
 * 任务状态
 */
export enum TaskState {
  PENDING = 'pending',
  ASSIGNED = 'assigned',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * 任务优先级
 */
export enum TaskPriority {
  LOW = 1,
  NORMAL = 2,
  HIGH = 3,
  URGENT = 4,
}

/**
 * 分身状态
 */
export enum AvatarStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  OFFLINE = 'offline',
  ERROR = 'error',
}

/**
 * 任务定义
 */
export interface Task {
  /** 任务 ID */
  id: string;
  /** 任务名称 */
  name: string;
  /** 任务描述 */
  description?: string;
  /** 任务类型 */
  type: string;
  /** 任务优先级 */
  priority: TaskPriority;
  /** 任务状态 */
  state: TaskState;
  /** 分配的分身 ID */
  assignedTo?: string;
  /** 任务参数 */
  params: any;
  /** 任务结果 */
  result?: any;
  /** 错误信息 */
  error?: string;
  /** 创建时间 */
  createdAt: number;
  /** 开始时间 */
  startedAt?: number;
  /** 完成时间 */
  completedAt?: number;
  /** 预计耗时（毫秒） */
  estimatedDuration?: number;
  /** 依赖的任务 ID 列表 */
  dependencies?: string[];
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 分身信息
 */
export interface Avatar {
  /** 分身 ID */
  id: string;
  /** 分身名称 */
  name: string;
  /** 分身状态 */
  status: AvatarStatus;
  /** 当前任务 ID */
  currentTaskId?: string;
  /** 已完成任务数 */
  completedTasks: number;
  /** 失败任务数 */
  failedTasks: number;
  /** 能力标签 */
  capabilities: string[];
  /** 最后心跳时间 */
  lastHeartbeat: number;
  /** 元数据 */
  metadata?: Record<string, any>;
}

/**
 * 任务分配策略
 */
export enum AssignmentStrategy {
  /** 轮询 */
  ROUND_ROBIN = 'round_robin',
  /** 最少任务 */
  LEAST_LOADED = 'least_loaded',
  /** 能力匹配 */
  CAPABILITY_MATCH = 'capability_match',
  /** 随机 */
  RANDOM = 'random',
}

/**
 * 任务协调器配置
 */
export interface CoordinatorConfig {
  /** 分配策略 */
  strategy?: AssignmentStrategy;
  /** 心跳超时时间（毫秒） */
  heartbeatTimeout?: number;
  /** 任务超时时间（毫秒） */
  taskTimeout?: number;
  /** 最大重试次数 */
  maxRetries?: number;
}

/**
 * 任务协调器（单例模式）
 */
export class TaskCoordinator {
  private static instance: TaskCoordinator;
  private tasks: Map<string, Task> = new Map();
  private avatars: Map<string, Avatar> = new Map();
  private taskQueue: Task[] = [];
  private config: Required<CoordinatorConfig>;
  private roundRobinIndex = 0;

  private constructor(config: CoordinatorConfig = {}) {
    this.config = {
      strategy: config.strategy || AssignmentStrategy.LEAST_LOADED,
      heartbeatTimeout: config.heartbeatTimeout || 30000, // 30秒
      taskTimeout: config.taskTimeout || 300000, // 5分钟
      maxRetries: config.maxRetries || 3,
    };

    // 订阅分身状态更新
    messageBus.subscribe({
      topic: Topics.AVATAR_STATUS,
      handler: this.handleAvatarStatus.bind(this),
    });

    // 订阅任务完成事件
    messageBus.subscribe({
      topic: Topics.TASK_COMPLETED,
      handler: this.handleTaskCompleted.bind(this),
    });

    // 订阅任务失败事件
    messageBus.subscribe({
      topic: Topics.TASK_FAILED,
      handler: this.handleTaskFailed.bind(this),
    });

    // 启动心跳检查
    this.startHeartbeatCheck();
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: CoordinatorConfig): TaskCoordinator {
    if (!this.instance) {
      this.instance = new TaskCoordinator(config);
    }
    return this.instance;
  }

  /**
   * 创建任务
   */
  async createTask(taskData: Omit<Task, 'id' | 'state' | 'createdAt'>): Promise<string> {
    const task: Task = {
      id: this.generateTaskId(),
      state: TaskState.PENDING,
      createdAt: Date.now(),
      ...taskData,
    };

    this.tasks.set(task.id, task);
    this.enqueueTask(task);

    // 发布任务创建事件
    await messageBus.publish(Topics.TASK_CREATED, task, {
      sender: 'coordinator',
      priority: this.getPriorityMapping(task.priority),
    });

    // 尝试分配任务
    await this.processQueue();

    return task.id;
  }

  /**
   * 注册分身
   */
  registerAvatar(avatar: Omit<Avatar, 'completedTasks' | 'failedTasks' | 'lastHeartbeat'>): void {
    const fullAvatar: Avatar = {
      completedTasks: 0,
      failedTasks: 0,
      lastHeartbeat: Date.now(),
      ...avatar,
    };

    this.avatars.set(avatar.id, fullAvatar);

    // 发布分身启动事件
    messageBus.publish(Topics.AVATAR_STARTED, fullAvatar, {
      sender: 'coordinator',
    });
  }

  /**
   * 注销分身
   */
  unregisterAvatar(avatarId: string): void {
    const avatar = this.avatars.get(avatarId);
    if (avatar) {
      // 如果有正在执行的任务，重新加入队列
      if (avatar.currentTaskId) {
        const task = this.tasks.get(avatar.currentTaskId);
        if (task && task.state === TaskState.RUNNING) {
          task.state = TaskState.PENDING;
          task.assignedTo = undefined;
          this.enqueueTask(task);
        }
      }

      this.avatars.delete(avatarId);

      // 发布分身停止事件
      messageBus.publish(Topics.AVATAR_STOPPED, { avatarId }, {
        sender: 'coordinator',
      });
    }
  }

  /**
   * 更新分身状态
   */
  updateAvatarStatus(avatarId: string, status: AvatarStatus): void {
    const avatar = this.avatars.get(avatarId);
    if (avatar) {
      avatar.status = status;
      avatar.lastHeartbeat = Date.now();
    }
  }

  /**
   * 获取任务
   */
  getTask(taskId: string): Task | null {
    return this.tasks.get(taskId) || null;
  }

  /**
   * 获取分身
   */
  getAvatar(avatarId: string): Avatar | null {
    return this.avatars.get(avatarId) || null;
  }

  /**
   * 获取所有任务
   */
  getAllTasks(filter?: { state?: TaskState; assignedTo?: string }): Task[] {
    const tasks = Array.from(this.tasks.values());

    if (!filter) return tasks;

    return tasks.filter((task) => {
      if (filter.state && task.state !== filter.state) return false;
      if (filter.assignedTo && task.assignedTo !== filter.assignedTo) return false;
      return true;
    });
  }

  /**
   * 获取所有分身
   */
  getAllAvatars(filter?: { status?: AvatarStatus }): Avatar[] {
    const avatars = Array.from(this.avatars.values());

    if (!filter) return avatars;

    return avatars.filter((avatar) => {
      if (filter.status && avatar.status !== filter.status) return false;
      return true;
    });
  }

  /**
   * 取消任务
   */
  async cancelTask(taskId: string): Promise<boolean> {
    const task = this.tasks.get(taskId);
    if (!task) return false;

    if (task.state === TaskState.COMPLETED || task.state === TaskState.CANCELLED) {
      return false;
    }

    task.state = TaskState.CANCELLED;
    task.completedAt = Date.now();

    // 如果任务已分配，释放分身
    if (task.assignedTo) {
      const avatar = this.avatars.get(task.assignedTo);
      if (avatar) {
        avatar.status = AvatarStatus.IDLE;
        avatar.currentTaskId = undefined;
      }
    }

    return true;
  }

  /**
   * 将任务加入队列（按优先级排序）
   */
  private enqueueTask(task: Task): void {
    // 检查依赖
    if (task.dependencies && task.dependencies.length > 0) {
      const allDependenciesCompleted = task.dependencies.every((depId) => {
        const depTask = this.tasks.get(depId);
        return depTask && depTask.state === TaskState.COMPLETED;
      });

      if (!allDependenciesCompleted) {
        // 依赖未完成，暂不加入队列
        return;
      }
    }

    // 按优先级插入
    const insertIndex = this.taskQueue.findIndex(
      (t) => t.priority < task.priority
    );

    if (insertIndex === -1) {
      this.taskQueue.push(task);
    } else {
      this.taskQueue.splice(insertIndex, 0, task);
    }
  }

  /**
   * 处理任务队列
   */
  private async processQueue(): Promise<void> {
    while (this.taskQueue.length > 0) {
      const task = this.taskQueue[0];
      const avatar = this.selectAvatar(task);

      if (!avatar) {
        // 没有可用的分身，等待
        break;
      }

      // 从队列中移除任务
      this.taskQueue.shift();

      // 分配任务
      await this.assignTask(task, avatar);
    }
  }

  /**
   * 选择分身
   */
  private selectAvatar(task: Task): Avatar | null {
    const availableAvatars = Array.from(this.avatars.values()).filter(
      (avatar) => avatar.status === AvatarStatus.IDLE
    );

    if (availableAvatars.length === 0) return null;

    switch (this.config.strategy) {
      case AssignmentStrategy.ROUND_ROBIN:
        return this.selectRoundRobin(availableAvatars);

      case AssignmentStrategy.LEAST_LOADED:
        return this.selectLeastLoaded(availableAvatars);

      case AssignmentStrategy.CAPABILITY_MATCH:
        return this.selectByCapability(availableAvatars, task);

      case AssignmentStrategy.RANDOM:
        return availableAvatars[Math.floor(Math.random() * availableAvatars.length)];

      default:
        return availableAvatars[0];
    }
  }

  /**
   * 轮询选择
   */
  private selectRoundRobin(avatars: Avatar[]): Avatar {
    const avatar = avatars[this.roundRobinIndex % avatars.length];
    this.roundRobinIndex++;
    return avatar;
  }

  /**
   * 选择负载最少的分身
   */
  private selectLeastLoaded(avatars: Avatar[]): Avatar {
    return avatars.reduce((least, current) => {
      const leastLoad = least.completedTasks + least.failedTasks;
      const currentLoad = current.completedTasks + current.failedTasks;
      return currentLoad < leastLoad ? current : least;
    });
  }

  /**
   * 根据能力选择
   */
  private selectByCapability(avatars: Avatar[], task: Task): Avatar | null {
    const matchingAvatars = avatars.filter((avatar) =>
      avatar.capabilities.includes(task.type)
    );

    if (matchingAvatars.length === 0) {
      // 没有匹配的能力，回退到最少负载策略
      return this.selectLeastLoaded(avatars);
    }

    return this.selectLeastLoaded(matchingAvatars);
  }

  /**
   * 分配任务给分身
   */
  private async assignTask(task: Task, avatar: Avatar): Promise<void> {
    task.state = TaskState.ASSIGNED;
    task.assignedTo = avatar.id;
    task.startedAt = Date.now();

    avatar.status = AvatarStatus.BUSY;
    avatar.currentTaskId = task.id;

    // 发布任务分配事件
    await messageBus.publish(Topics.TASK_UPDATED, task, {
      sender: 'coordinator',
      receiver: avatar.id,
      priority: this.getPriorityMapping(task.priority),
    });

    // 更新任务状态为运行中
    task.state = TaskState.RUNNING;
  }

  /**
   * 处理分身状态更新
   */
  private async handleAvatarStatus(message: any): Promise<void> {
    const { avatarId, status } = message.payload;
    this.updateAvatarStatus(avatarId, status);
  }

  /**
   * 处理任务完成
   */
  private async handleTaskCompleted(message: any): Promise<void> {
    const { taskId, result } = message.payload;
    const task = this.tasks.get(taskId);

    if (task) {
      task.state = TaskState.COMPLETED;
      task.result = result;
      task.completedAt = Date.now();

      // 释放分身
      if (task.assignedTo) {
        const avatar = this.avatars.get(task.assignedTo);
        if (avatar) {
          avatar.status = AvatarStatus.IDLE;
          avatar.currentTaskId = undefined;
          avatar.completedTasks++;
        }
      }

      // 检查是否有依赖此任务的任务
      await this.checkDependentTasks(taskId);

      // 继续处理队列
      await this.processQueue();
    }
  }

  /**
   * 处理任务失败
   */
  private async handleTaskFailed(message: any): Promise<void> {
    const { taskId, error } = message.payload;
    const task = this.tasks.get(taskId);

    if (task) {
      task.state = TaskState.FAILED;
      task.error = error;
      task.completedAt = Date.now();

      // 释放分身
      if (task.assignedTo) {
        const avatar = this.avatars.get(task.assignedTo);
        if (avatar) {
          avatar.status = AvatarStatus.IDLE;
          avatar.currentTaskId = undefined;
          avatar.failedTasks++;
        }
      }

      // 继续处理队列
      await this.processQueue();
    }
  }

  /**
   * 检查依赖此任务的任务
   */
  private async checkDependentTasks(completedTaskId: string): Promise<void> {
    const dependentTasks = Array.from(this.tasks.values()).filter(
      (task) =>
        task.state === TaskState.PENDING &&
        task.dependencies &&
        task.dependencies.includes(completedTaskId)
    );

    for (const task of dependentTasks) {
      this.enqueueTask(task);
    }
  }

  /**
   * 启动心跳检查
   */
  private startHeartbeatCheck(): void {
    setInterval(() => {
      const now = Date.now();
      for (const [avatarId, avatar] of this.avatars.entries()) {
        if (now - avatar.lastHeartbeat > this.config.heartbeatTimeout) {
          avatar.status = AvatarStatus.OFFLINE;
          // 重新分配任务
          if (avatar.currentTaskId) {
            const task = this.tasks.get(avatar.currentTaskId);
            if (task && task.state === TaskState.RUNNING) {
              task.state = TaskState.PENDING;
              task.assignedTo = undefined;
              this.enqueueTask(task);
            }
          }
        }
      }
    }, this.config.heartbeatTimeout / 2);
  }

  /**
   * 获取优先级映射
   */
  private getPriorityMapping(taskPriority: TaskPriority): MessagePriority {
    switch (taskPriority) {
      case TaskPriority.LOW:
        return MessagePriority.LOW;
      case TaskPriority.NORMAL:
        return MessagePriority.NORMAL;
      case TaskPriority.HIGH:
        return MessagePriority.HIGH;
      case TaskPriority.URGENT:
        return MessagePriority.URGENT;
      default:
        return MessagePriority.NORMAL;
    }
  }

  /**
   * 生成任务 ID
   */
  private generateTaskId(): string {
    return `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * 获取统计信息
   */
  getStats(): {
    totalTasks: number;
    pendingTasks: number;
    runningTasks: number;
    completedTasks: number;
    failedTasks: number;
    totalAvatars: number;
    idleAvatars: number;
    busyAvatars: number;
    offlineAvatars: number;
  } {
    const tasks = Array.from(this.tasks.values());
    const avatars = Array.from(this.avatars.values());

    return {
      totalTasks: tasks.length,
      pendingTasks: tasks.filter((t) => t.state === TaskState.PENDING).length,
      runningTasks: tasks.filter((t) => t.state === TaskState.RUNNING).length,
      completedTasks: tasks.filter((t) => t.state === TaskState.COMPLETED).length,
      failedTasks: tasks.filter((t) => t.state === TaskState.FAILED).length,
      totalAvatars: avatars.length,
      idleAvatars: avatars.filter((a) => a.status === AvatarStatus.IDLE).length,
      busyAvatars: avatars.filter((a) => a.status === AvatarStatus.BUSY).length,
      offlineAvatars: avatars.filter((a) => a.status === AvatarStatus.OFFLINE).length,
    };
  }
}

/**
 * 导出单例实例
 */
export const taskCoordinator = TaskCoordinator.getInstance();

/**
 * React Hook - 使用任务协调器
 */
export function useTaskCoordinator() {
  const coordinator = TaskCoordinator.getInstance();

  return {
    createTask: (task: Omit<Task, 'id' | 'state' | 'createdAt'>) =>
      coordinator.createTask(task),
    getTask: (taskId: string) => coordinator.getTask(taskId),
    getAllTasks: (filter?: { state?: TaskState; assignedTo?: string }) =>
      coordinator.getAllTasks(filter),
    cancelTask: (taskId: string) => coordinator.cancelTask(taskId),
    registerAvatar: (avatar: Omit<Avatar, 'completedTasks' | 'failedTasks' | 'lastHeartbeat'>) =>
      coordinator.registerAvatar(avatar),
    unregisterAvatar: (avatarId: string) => coordinator.unregisterAvatar(avatarId),
    getAvatar: (avatarId: string) => coordinator.getAvatar(avatarId),
    getAllAvatars: (filter?: { status?: AvatarStatus }) =>
      coordinator.getAllAvatars(filter),
    getStats: () => coordinator.getStats(),
  };
}
