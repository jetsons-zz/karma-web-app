# Karma Web App - 前后端接口契约

> **版本**: v1.0.0
> **协议**: AG-UI (Agent-User Interaction Protocol)
> **更新日期**: 2025-10-28

---

## 📋 目录

- [通用规范](#通用规范)
- [智能体端点](#智能体端点)
- [业务 API](#业务-api)
- [事件定义](#事件定义)
- [工具定义](#工具定义)
- [状态结构](#状态结构)
- [错误处理](#错误处理)

---

## 通用规范

### Base URL

```
开发环境: http://localhost:3000
生产环境: https://api.karma.ai
```

### 认证方式

```http
Authorization: Bearer <JWT_TOKEN>
```

### 响应格式

#### 成功响应

```json
{
  "success": true,
  "data": { ... },
  "timestamp": 1698765432000
}
```

#### 错误响应

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input",
    "details": { ... }
  },
  "timestamp": 1698765432000
}
```

---

## 智能体端点

### POST /api/agent

**描述**: 主智能体交互端点（支持 AG-UI 协议）

**请求**:

```typescript
interface AgentRequest {
  // 对话消息历史
  messages: Array<{
    role: 'user' | 'assistant' | 'system';
    content: string;
    attachments?: Attachment[];
  }>;

  // 共享状态
  state?: Record<string, any>;

  // 可用工具
  tools?: string[]; // 工具名称数组

  // 上下文
  context?: {
    userId: string;
    projectId?: string;
    deviceId?: string;
  };

  // 配置
  options?: {
    stream?: boolean; // 默认 true
    model?: string;   // 默认 'gpt-4o'
    temperature?: number;
  };
}

interface Attachment {
  type: 'file' | 'image' | 'audio' | 'video';
  url: string;
  name: string;
  size: number;
  mimeType: string;
}
```

**响应**: SSE 事件流

```typescript
// Event: message
{
  "type": "message",
  "role": "assistant",
  "content": "我已经完成了任务分配...",
  "metadata": {
    "agentId": "forge-1",
    "timestamp": 1698765432000
  }
}

// Event: tool_call
{
  "type": "tool_call",
  "id": "call_abc123",
  "name": "assignTask",
  "arguments": {
    "taskId": "task-1",
    "avatarId": "avatar-1"
  },
  "execution": "backend"
}

// Event: state_update
{
  "type": "state_update",
  "path": "project.progress",
  "value": 75,
  "operation": "set"
}

// Event: thinking
{
  "type": "thinking",
  "status": "正在分析项目需求..."
}

// Event: done
{
  "type": "done",
  "summary": {
    "messagesCount": 3,
    "toolsCalled": 2,
    "statesUpdated": 1
  }
}
```

---

## 业务 API

### 1. 设备管理

#### GET /api/devices

**描述**: 获取设备列表

**查询参数**:

```typescript
interface GetDevicesQuery {
  status?: 'online' | 'offline' | 'error' | 'updating';
  model?: 'EOS-3A' | 'EOS-3B' | 'EOS-3C';
  page?: number;
  pageSize?: number;
  sort?: 'name' | 'createdAt' | 'status';
  order?: 'asc' | 'desc';
}
```

**响应**:

```typescript
interface GetDevicesResponse {
  success: true;
  data: {
    devices: Device[];
    total: number;
    page: number;
    pageSize: number;
  };
}

interface Device {
  id: string;
  name: string;
  model: 'EOS-3A' | 'EOS-3B' | 'EOS-3C';
  status: 'online' | 'offline' | 'error' | 'updating';
  ip: string;
  mac: string;
  serialNumber: string;
  firmwareVersion: string;
  lastHeartbeat: number;
  capabilities: {
    aiComputing: boolean;
    videoProcessing: boolean;
    storage: boolean;
    networking: boolean;
  };
  hardware: {
    cpu: string;
    memory: number;
    storage: number;
    gpu?: string;
  };
  network: {
    type: 'wifi' | 'ethernet' | '5g' | 'bluetooth';
    signalStrength?: number;
    bandwidth?: number;
  };
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  tags: string[];
  createdAt: number;
  updatedAt: number;
}
```

---

#### POST /api/devices

**描述**: 添加新设备

**请求体**:

```typescript
interface CreateDeviceRequest {
  name: string;
  model: 'EOS-3A' | 'EOS-3B' | 'EOS-3C';
  serialNumber: string;
  mac: string;
  ip?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  tags?: string[];
}
```

**响应**:

```typescript
interface CreateDeviceResponse {
  success: true;
  data: {
    device: Device;
  };
}
```

---

#### GET /api/devices/:id

**描述**: 获取设备详情

**响应**: 同 `Device` 结构

---

#### PUT /api/devices/:id

**描述**: 更新设备信息

**请求体**:

```typescript
interface UpdateDeviceRequest {
  name?: string;
  location?: { latitude: number; longitude: number; address?: string };
  tags?: string[];
}
```

---

#### DELETE /api/devices/:id

**描述**: 删除设备

**响应**:

```typescript
{ "success": true, "data": null }
```

---

#### POST /api/devices/:id/heartbeat

**描述**: 设备心跳（由设备端调用）

**请求体**:

```typescript
interface HeartbeatRequest {
  status: 'online' | 'offline' | 'error';
  metrics: {
    cpuUsage: number;
    memoryUsage: number;
    diskUsage: number;
    temperature: number;
    uptime: number;
  };
  timestamp: number;
}
```

---

### 2. 文件管理

#### GET /api/devices/:id/files

**描述**: 获取设备文件列表

**查询参数**:

```typescript
interface GetFilesQuery {
  path?: string; // 默认 '/'
  type?: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'code' | 'data' | 'other';
  category?: 'task_output' | 'media' | 'config' | 'log' | 'cache' | 'temp' | 'user';
  sort?: 'name' | 'size' | 'createdAt' | 'modifiedAt';
  order?: 'asc' | 'desc';
}
```

**响应**:

```typescript
interface GetFilesResponse {
  success: true;
  data: {
    files: DeviceFile[];
    folders: DeviceFolder[];
    totalSize: number;
  };
}
```

---

#### POST /api/devices/:id/files/upload

**描述**: 上传文件到设备

**请求**: `multipart/form-data`

```typescript
FormData {
  file: File;
  path: string;
  category?: string;
  overwrite?: boolean;
}
```

**响应**:

```typescript
interface UploadFileResponse {
  success: true;
  data: {
    file: DeviceFile;
  };
}
```

---

#### DELETE /api/devices/:id/files/:fileId

**描述**: 删除文件

---

#### POST /api/devices/:id/files/batch

**描述**: 批量文件操作

**请求体**:

```typescript
interface BatchOperationRequest {
  operation: 'delete' | 'move' | 'copy' | 'download';
  fileIds: string[];
  targetPath?: string; // for move/copy
}
```

---

### 3. 项目管理

#### GET /api/projects

**描述**: 获取项目列表

**响应**:

```typescript
interface GetProjectsResponse {
  success: true;
  data: {
    projects: Project[];
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  progress: number; // 0-100
  status: 'active' | 'paused' | 'completed' | 'archived';
  members: ProjectMember[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectMember {
  userId: string;
  name: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
}
```

---

#### POST /api/projects

**描述**: 创建新项目

**请求体**:

```typescript
interface CreateProjectRequest {
  name: string;
  description?: string;
  members?: string[]; // userId[]
}
```

---

### 4. AI 分身管理

#### GET /api/avatars

**描述**: 获取用户的 AI 分身列表

**响应**:

```typescript
interface GetAvatarsResponse {
  success: true;
  data: {
    avatars: Avatar[];
  };
}

interface Avatar {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  skills: string[];
  status: 'idle' | 'working' | 'error';
  performance: {
    totalTasks: number;
    completedTasks: number;
    averageTime: number;
    successRate: number;
  };
  abilities: {
    coding: number;
    design: number;
    writing: number;
    analysis: number;
    communication: number;
  };
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    total: number;
    trend: number[];
  };
  createdBy: string;
  isPublic: boolean;
  rating?: number;
  reviewCount?: number;
  price?: number;
  createdAt: string;
  updatedAt: string;
}
```

---

#### POST /api/avatars

**描述**: 创建新 AI 分身

**请求体**:

```typescript
interface CreateAvatarRequest {
  name: string;
  role: string;
  description: string;
  skills: string[];
  isPublic: boolean;
  price?: number;
  baseModel: string; // 'gpt-4o', 'claude-3-opus', etc.
  systemPrompt: string;
  tools?: string[]; // 可用工具
}
```

---

### 5. 订阅与支付

#### GET /api/subscriptions

**描述**: 获取用户订阅信息

**响应**:

```typescript
interface GetSubscriptionResponse {
  success: true;
  data: {
    subscription: Subscription | null;
  };
}

interface Subscription {
  id: string;
  userId: string;
  plan: 'free' | 'pro' | 'team' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'trialing';
  currentPeriodStart: number;
  currentPeriodEnd: number;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}
```

---

#### POST /api/subscriptions/create

**描述**: 创建订阅（跳转到 Stripe Checkout）

**请求体**:

```typescript
interface CreateSubscriptionRequest {
  plan: 'pro' | 'team' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
}
```

**响应**:

```typescript
interface CreateSubscriptionResponse {
  success: true;
  data: {
    checkoutUrl: string; // Stripe Checkout URL
  };
}
```

---

## 事件定义

### AG-UI 事件类型

所有通过 `/api/agent` 端点返回的事件：

```typescript
type AgentEvent =
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

// 1. 消息事件
interface MessageEvent {
  type: 'message';
  role: 'assistant' | 'user' | 'system';
  content: string;
  metadata?: {
    agentId?: string;
    timestamp?: number;
  };
}

// 2. 工具调用事件
interface ToolCallEvent {
  type: 'tool_call';
  id: string;
  name: string;
  arguments: Record<string, any>;
  execution: 'frontend' | 'backend';
}

// 3. 工具结果事件
interface ToolResultEvent {
  type: 'tool_result';
  id: string; // 对应 tool_call.id
  result: any;
  error?: string;
}

// 4. 状态更新事件
interface StateUpdateEvent {
  type: 'state_update';
  path: string; // JSON path
  value: any;
  operation: 'set' | 'merge' | 'delete';
}

// 5. UI 事件
interface UIEvent {
  type: 'ui';
  component: string;
  props: Record<string, any>;
}

// 6. 思考事件
interface ThinkingEvent {
  type: 'thinking';
  status: string;
}

// 7. 进度事件
interface ProgressEvent {
  type: 'progress';
  percentage: number;
  message?: string;
}

// 8. 中断事件 (Human-in-the-loop)
interface InterruptEvent {
  type: 'interrupt';
  reason: string;
  options: Array<{
    label: string;
    value: string;
  }>;
}

// 9. 错误事件
interface ErrorEvent {
  type: 'error';
  message: string;
  code?: string;
}

// 10. 完成事件
interface DoneEvent {
  type: 'done';
  summary?: {
    messagesCount: number;
    toolsCalled: number;
    statesUpdated: number;
  };
}
```

---

## 工具定义

### 后端工具 (Backend Tools)

这些工具由后端智能体调用，前端无需感知：

#### 1. assignTask

**描述**: 将任务分配给 AI 分身

```typescript
{
  name: 'assignTask',
  description: '将任务分配给指定的 AI 分身',
  parameters: {
    taskId: { type: 'string', required: true },
    avatarId: { type: 'string', required: true },
    priority?: { type: 'string', enum: ['p0', 'p1', 'p2', 'p3'] }
  },
  execution: 'backend'
}
```

---

#### 2. searchDatabase

**描述**: 搜索数据库

```typescript
{
  name: 'searchDatabase',
  description: '在数据库中搜索项目、任务、设备等',
  parameters: {
    query: { type: 'string', required: true },
    type: { type: 'string', enum: ['project', 'task', 'device', 'avatar'] },
    limit?: { type: 'number', default: 10 }
  },
  execution: 'backend'
}
```

---

#### 3. controlDevice

**描述**: 控制设备

```typescript
{
  name: 'controlDevice',
  description: '发送控制指令到指定设备',
  parameters: {
    deviceId: { type: 'string', required: true },
    command: { type: 'string', required: true },
    params?: { type: 'object' }
  },
  execution: 'backend'
}
```

---

#### 4. analyzePerformance

**描述**: 分析分身性能

```typescript
{
  name: 'analyzePerformance',
  description: '分析 AI 分身的工作表现',
  parameters: {
    avatarId: { type: 'string', required: true },
    timeRange: { type: 'string', enum: ['day', 'week', 'month'] }
  },
  execution: 'backend'
}
```

---

### 前端工具 (Frontend Tools)

这些工具由前端执行，后端发送 `tool_call` 事件，前端返回 `tool_result`：

#### 1. openModal

**描述**: 打开模态框

```typescript
{
  name: 'openModal',
  description: '打开指定的模态框',
  parameters: {
    modalType: { type: 'string', required: true },
    data?: { type: 'object' }
  },
  execution: 'frontend'
}
```

---

#### 2. navigateTo

**描述**: 页面导航

```typescript
{
  name: 'navigateTo',
  description: '导航到指定页面',
  parameters: {
    path: { type: 'string', required: true }
  },
  execution: 'frontend'
}
```

---

#### 3. showNotification

**描述**: 显示通知

```typescript
{
  name: 'showNotification',
  description: '显示系统通知',
  parameters: {
    title: { type: 'string', required: true },
    message: { type: 'string', required: true },
    type: { type: 'string', enum: ['success', 'error', 'warning', 'info'] }
  },
  execution: 'frontend'
}
```

---

## 状态结构

### 共享状态 Schema

前后端通过 AG-UI 协议同步的状态结构：

```typescript
interface SharedState {
  // 用户信息
  user: {
    id: string;
    name: string;
    avatar: string;
  };

  // 当前项目
  project?: {
    id: string;
    name: string;
    progress: number;
    members: string[];
  };

  // 设备列表
  devices: Array<{
    id: string;
    name: string;
    status: 'online' | 'offline' | 'error';
  }>;

  // AI 分身状态
  avatars: Array<{
    id: string;
    name: string;
    status: 'idle' | 'working' | 'error';
    currentTask?: string;
  }>;

  // 实时收益
  earnings: {
    today: number;
    thisWeek: number;
    thisMonth: number;
  };

  // UI 状态
  ui: {
    sidebarOpen: boolean;
    theme: 'light' | 'dark' | 'auto';
  };
}
```

---

## 错误处理

### HTTP 错误码

| 状态码 | 说明 | 示例 |
|-------|------|------|
| 400 | 请求参数错误 | `VALIDATION_ERROR` |
| 401 | 未认证 | `UNAUTHORIZED` |
| 403 | 无权限 | `FORBIDDEN` |
| 404 | 资源不存在 | `NOT_FOUND` |
| 409 | 资源冲突 | `CONFLICT` (设备已存在) |
| 429 | 请求过于频繁 | `RATE_LIMIT_EXCEEDED` |
| 500 | 服务器错误 | `INTERNAL_ERROR` |
| 503 | 服务不可用 | `SERVICE_UNAVAILABLE` |

### 错误响应格式

```typescript
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  timestamp: number;
}
```

### 示例

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid device model",
    "details": {
      "field": "model",
      "expected": ["EOS-3A", "EOS-3B", "EOS-3C"],
      "received": "EOS-4"
    }
  },
  "timestamp": 1698765432000
}
```

---

## 版本管理

### API 版本

当前版本: `v1`

未来版本通过路径区分:
- `/api/v1/devices`
- `/api/v2/devices`

### 协议版本

AG-UI 协议版本: `1.0.0`

请求头指定:
```http
AG-UI-Version: 1.0.0
```

---

## 开发建议

### 前端团队

1. 使用 `@ag-ui/react` SDK 而非直接调用 API
2. 所有智能体交互通过 `/api/agent` 端点
3. CRUD 操作使用标准 REST API
4. 实现前端工具处理器
5. 监听共享状态变化

### 后端团队

1. 实现 `/api/agent` 端点（参考 AG-UI 文档）
2. 实现标准 REST API 端点
3. 定义并注册后端工具
4. 通过 `StateUpdateEvent` 同步状态
5. 使用 LangGraph/CrewAI 等框架编排智能体

---

## 更新日志

### v1.0.0 (2025-10-28)

- 初始版本
- 定义核心 API 接口
- 集成 AG-UI 协议
- 定义工具和状态结构
