/**
 * Karma API Client
 * 前端 API 调用封装
 *
 * @see docs/api/CONTRACT.md
 */

import type {
  ApiResponse,
  SuccessResponse,
  ErrorResponse,
  GetDevicesQuery,
  GetDevicesResponse,
  CreateDeviceRequest,
  CreateDeviceResponse,
  UpdateDeviceRequest,
  Device,
  GetFilesQuery,
  GetFilesResponse,
  GetProjectsResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  Project,
  GetAvatarsResponse,
  CreateAvatarRequest,
  CreateAvatarResponse,
  Avatar,
  GetSubscriptionResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
} from '@/types/api';

/**
 * API 客户端配置
 */
export interface ApiClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * API 错误
 */
export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API 客户端类
 */
export class ApiClient {
  private baseURL: string;
  private timeout: number;
  private headers: Record<string, string>;

  constructor(config: ApiClientConfig = {}) {
    this.baseURL = config.baseURL || '/api';
    this.timeout = config.timeout || 30000;
    this.headers = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * 设置认证 Token
   */
  setAuthToken(token: string) {
    this.headers['Authorization'] = `Bearer ${token}`;
  }

  /**
   * 清除认证 Token
   */
  clearAuthToken() {
    delete this.headers['Authorization'];
  }

  /**
   * 通用 HTTP 请求
   */
  private async request<T>(
    method: string,
    path: string,
    options: {
      query?: Record<string, any>;
      body?: any;
      headers?: Record<string, string>;
    } = {}
  ): Promise<T> {
    // 构建 URL
    let url = `${this.baseURL}${path}`;
    if (options.query) {
      const params = new URLSearchParams();
      Object.entries(options.query).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }

    // 构建请求选项
    const fetchOptions: RequestInit = {
      method,
      headers: {
        ...this.headers,
        ...options.headers,
      },
    };

    if (options.body) {
      fetchOptions.body = JSON.stringify(options.body);
    }

    // 发送请求
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data: ApiResponse<T> = await response.json();

      if (!response.ok || !data.success) {
        const errorData = data as ErrorResponse;
        throw new ApiError(
          errorData.error.code,
          errorData.error.message,
          errorData.error.details
        );
      }

      const successData = data as SuccessResponse<T>;
      return successData.data;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === 'AbortError') {
        throw new ApiError('TIMEOUT', 'Request timeout');
      }

      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError('NETWORK_ERROR', error.message || 'Network error');
    }
  }

  // ============================================================================
  // 设备管理 API
  // ============================================================================

  /**
   * 获取设备列表
   */
  async getDevices(query?: GetDevicesQuery): Promise<GetDevicesResponse> {
    return this.request<GetDevicesResponse>('GET', '/devices', { query });
  }

  /**
   * 获取设备详情
   */
  async getDevice(deviceId: string): Promise<Device> {
    return this.request<Device>('GET', `/devices/${deviceId}`);
  }

  /**
   * 创建设备
   */
  async createDevice(data: CreateDeviceRequest): Promise<CreateDeviceResponse> {
    return this.request<CreateDeviceResponse>('POST', '/devices', { body: data });
  }

  /**
   * 更新设备
   */
  async updateDevice(
    deviceId: string,
    data: UpdateDeviceRequest
  ): Promise<Device> {
    return this.request<Device>('PUT', `/devices/${deviceId}`, { body: data });
  }

  /**
   * 删除设备
   */
  async deleteDevice(deviceId: string): Promise<void> {
    return this.request<void>('DELETE', `/devices/${deviceId}`);
  }

  // ============================================================================
  // 文件管理 API
  // ============================================================================

  /**
   * 获取设备文件列表
   */
  async getDeviceFiles(
    deviceId: string,
    query?: GetFilesQuery
  ): Promise<GetFilesResponse> {
    return this.request<GetFilesResponse>('GET', `/devices/${deviceId}/files`, {
      query,
    });
  }

  /**
   * 上传文件到设备
   */
  async uploadDeviceFile(
    deviceId: string,
    file: File,
    options: {
      path: string;
      category?: string;
      overwrite?: boolean;
    }
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('path', options.path);
    if (options.category) {
      formData.append('category', options.category);
    }
    if (options.overwrite !== undefined) {
      formData.append('overwrite', String(options.overwrite));
    }

    const url = `${this.baseURL}/devices/${deviceId}/files/upload`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: this.headers['Authorization'] || '',
      },
      body: formData,
    });

    const data: ApiResponse<any> = await response.json();

    if (!response.ok || !data.success) {
      const errorData = data as ErrorResponse;
      throw new ApiError(
        errorData.error.code,
        errorData.error.message,
        errorData.error.details
      );
    }

    return (data as SuccessResponse<any>).data;
  }

  /**
   * 删除设备文件
   */
  async deleteDeviceFile(deviceId: string, fileId: string): Promise<void> {
    return this.request<void>('DELETE', `/devices/${deviceId}/files/${fileId}`);
  }

  /**
   * 批量文件操作
   */
  async batchFileOperation(
    deviceId: string,
    operation: {
      operation: 'delete' | 'move' | 'copy' | 'download';
      fileIds: string[];
      targetPath?: string;
    }
  ): Promise<any> {
    return this.request<any>('POST', `/devices/${deviceId}/files/batch`, {
      body: operation,
    });
  }

  // ============================================================================
  // 项目管理 API
  // ============================================================================

  /**
   * 获取项目列表
   */
  async getProjects(): Promise<GetProjectsResponse> {
    return this.request<GetProjectsResponse>('GET', '/projects');
  }

  /**
   * 获取项目详情
   */
  async getProject(projectId: string): Promise<Project> {
    return this.request<Project>('GET', `/projects/${projectId}`);
  }

  /**
   * 创建项目
   */
  async createProject(
    data: CreateProjectRequest
  ): Promise<CreateProjectResponse> {
    return this.request<CreateProjectResponse>('POST', '/projects', {
      body: data,
    });
  }

  /**
   * 更新项目
   */
  async updateProject(
    projectId: string,
    data: Partial<CreateProjectRequest>
  ): Promise<Project> {
    return this.request<Project>('PUT', `/projects/${projectId}`, {
      body: data,
    });
  }

  /**
   * 删除项目
   */
  async deleteProject(projectId: string): Promise<void> {
    return this.request<void>('DELETE', `/projects/${projectId}`);
  }

  // ============================================================================
  // AI 分身管理 API
  // ============================================================================

  /**
   * 获取 AI 分身列表
   */
  async getAvatars(): Promise<GetAvatarsResponse> {
    return this.request<GetAvatarsResponse>('GET', '/avatars');
  }

  /**
   * 获取 AI 分身详情
   */
  async getAvatar(avatarId: string): Promise<Avatar> {
    return this.request<Avatar>('GET', `/avatars/${avatarId}`);
  }

  /**
   * 创建 AI 分身
   */
  async createAvatar(data: CreateAvatarRequest): Promise<CreateAvatarResponse> {
    return this.request<CreateAvatarResponse>('POST', '/avatars', {
      body: data,
    });
  }

  /**
   * 更新 AI 分身
   */
  async updateAvatar(
    avatarId: string,
    data: Partial<CreateAvatarRequest>
  ): Promise<Avatar> {
    return this.request<Avatar>('PUT', `/avatars/${avatarId}`, { body: data });
  }

  /**
   * 删除 AI 分身
   */
  async deleteAvatar(avatarId: string): Promise<void> {
    return this.request<void>('DELETE', `/avatars/${avatarId}`);
  }

  // ============================================================================
  // 订阅与支付 API
  // ============================================================================

  /**
   * 获取订阅信息
   */
  async getSubscription(): Promise<GetSubscriptionResponse> {
    return this.request<GetSubscriptionResponse>('GET', '/subscriptions');
  }

  /**
   * 创建订阅（获取 Stripe Checkout URL）
   */
  async createSubscription(
    data: CreateSubscriptionRequest
  ): Promise<CreateSubscriptionResponse> {
    return this.request<CreateSubscriptionResponse>(
      'POST',
      '/subscriptions/create',
      { body: data }
    );
  }

  /**
   * 取消订阅
   */
  async cancelSubscription(): Promise<void> {
    return this.request<void>('POST', '/subscriptions/cancel');
  }
}

// ============================================================================
// 单例实例
// ============================================================================

/**
 * 默认 API 客户端实例
 */
export const apiClient = new ApiClient();

/**
 * 便捷导出
 */
export const api = {
  // 设备
  devices: {
    list: (query?: GetDevicesQuery) => apiClient.getDevices(query),
    get: (id: string) => apiClient.getDevice(id),
    create: (data: CreateDeviceRequest) => apiClient.createDevice(data),
    update: (id: string, data: UpdateDeviceRequest) =>
      apiClient.updateDevice(id, data),
    delete: (id: string) => apiClient.deleteDevice(id),
  },

  // 文件
  files: {
    list: (deviceId: string, query?: GetFilesQuery) =>
      apiClient.getDeviceFiles(deviceId, query),
    upload: (
      deviceId: string,
      file: File,
      options: { path: string; category?: string; overwrite?: boolean }
    ) => apiClient.uploadDeviceFile(deviceId, file, options),
    delete: (deviceId: string, fileId: string) =>
      apiClient.deleteDeviceFile(deviceId, fileId),
    batch: (
      deviceId: string,
      operation: {
        operation: 'delete' | 'move' | 'copy' | 'download';
        fileIds: string[];
        targetPath?: string;
      }
    ) => apiClient.batchFileOperation(deviceId, operation),
  },

  // 项目
  projects: {
    list: () => apiClient.getProjects(),
    get: (id: string) => apiClient.getProject(id),
    create: (data: CreateProjectRequest) => apiClient.createProject(data),
    update: (id: string, data: Partial<CreateProjectRequest>) =>
      apiClient.updateProject(id, data),
    delete: (id: string) => apiClient.deleteProject(id),
  },

  // AI 分身
  avatars: {
    list: () => apiClient.getAvatars(),
    get: (id: string) => apiClient.getAvatar(id),
    create: (data: CreateAvatarRequest) => apiClient.createAvatar(data),
    update: (id: string, data: Partial<CreateAvatarRequest>) =>
      apiClient.updateAvatar(id, data),
    delete: (id: string) => apiClient.deleteAvatar(id),
  },

  // 订阅
  subscriptions: {
    get: () => apiClient.getSubscription(),
    create: (data: CreateSubscriptionRequest) =>
      apiClient.createSubscription(data),
    cancel: () => apiClient.cancelSubscription(),
  },
};
