# AG-UI 协议集成方案

> **AG-UI (Agent-User Interaction Protocol)** - 智能体与用户交互的开放协议
> 项目地址: https://github.com/ag-ui-protocol/ag-ui
> 官方文档: https://docs.ag-ui.com

---

## 📋 目录

- [协议概述](#协议概述)
- [核心架构](#核心架构)
- [通信流程](#通信流程)
- [事件类型](#事件类型)
- [在 Karma 中的应用](#在-karma-中的应用)
- [前后端集成](#前后端集成)

---

## 协议概述

### 什么是 AG-UI？

AG-UI 是一个**开放、轻量、事件驱动**的协议，用于标准化 AI 智能体与前端应用的连接方式。

### 核心特性

- **实时流式通信**: 基于 SSE (Server-Sent Events) 的事件流
- **多模态支持**: 文件、图片、音频、视频
- **双向状态同步**: 前端与智能体状态实时同步
- **生成式 UI**: 动态渲染结构化消息
- **Human-in-the-loop**: 支持人工审批流程
- **工具调用**: 前端/后端工具动态执行

### 技术栈

```
前端 SDK: @ag-ui/react
后端集成: LangGraph, CrewAI, Mastra, Pydantic AI
通信协议: HTTP POST + SSE Stream
数据格式: JSON Events
```

---

## 核心架构

### 协议层级

```
┌─────────────────────────────────────────────┐
│          User-Facing Application            │
│         (Next.js + React + AG-UI)           │
└─────────────────┬───────────────────────────┘
                  │ AG-UI Protocol (HTTP/SSE)
┌─────────────────▼───────────────────────────┐
│            Agent Backend Layer              │
│   (LangGraph/CrewAI/Custom Implementation)  │
└─────────────────┬───────────────────────────┘
                  │ Standard AI Protocols
┌─────────────────▼───────────────────────────┐
│         LLM Services (OpenAI, etc.)         │
└─────────────────────────────────────────────┘
```

### 关键组件

1. **Application Layer** (前端)
   - React 组件
   - AG-UI SDK
   - 状态管理
   - UI 渲染

2. **Protocol Layer** (通信)
   - HTTP POST 请求
   - SSE 事件流
   - JSON 序列化

3. **Agent Layer** (后端)
   - 智能体编排
   - 工具调用
   - 状态管理
   - 事件发射

---

## 通信流程

### 1. 初始化连接

```typescript
// 前端发起请求
POST /api/agent
Content-Type: application/json

{
  "messages": [...],
  "state": {...},
  "tools": [...]
}
```

### 2. SSE 事件流

```typescript
// 服务端响应 (SSE Stream)
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

event: message
data: {"type":"message","role":"assistant","content":"Hello..."}

event: tool_call
data: {"type":"tool_call","name":"searchDatabase","arguments":{...}}

event: state_update
data: {"type":"state_update","path":"progress","value":50}

event: done
data: {"type":"done"}
```

### 3. 生命周期

```
Client                          Server
  │                               │
  ├─────── POST /api/agent ──────▶│
  │                               │
  │◄───── event: thinking ────────┤
  │◄───── event: message ─────────┤
  │◄───── event: tool_call ───────┤
  │                               │
  ├─────── tool_result ──────────▶│
  │                               │
  │◄───── event: state_update ────┤
  │◄───── event: done ────────────┤
  │                               │
```

---

## 事件类型

### 1. 消息事件 (Message Events)

```typescript
interface MessageEvent {
  type: 'message';
  role: 'assistant' | 'user' | 'system';
  content: string;
  metadata?: {
    timestamp?: number;
    agent_id?: string;
  };
}
```

**用途**: 显示对话内容

---

### 2. 工具调用事件 (Tool Call Events)

```typescript
interface ToolCallEvent {
  type: 'tool_call';
  id: string;
  name: string;
  arguments: Record<string, any>;
  execution: 'frontend' | 'backend';
}
```

**用途**: 执行前端/后端工具（如数据库查询、文件操作）

---

### 3. 状态更新事件 (State Update Events)

```typescript
interface StateUpdateEvent {
  type: 'state_update';
  path: string; // JSON path, e.g., "project.progress"
  value: any;
  operation: 'set' | 'merge' | 'delete';
}
```

**用途**: 同步前后端共享状态

---

### 4. UI 渲染事件 (UI Events)

```typescript
interface UIEvent {
  type: 'ui';
  component: string;
  props: Record<string, any>;
}
```

**用途**: 渲染生成式 UI 组件

---

### 5. 生命周期事件 (Lifecycle Events)

```typescript
type LifecycleEvent =
  | { type: 'thinking'; status: string }
  | { type: 'progress'; percentage: number }
  | { type: 'cancel' }
  | { type: 'done' }
  | { type: 'error'; message: string };
```

**用途**: 控制对话流程

---

## 在 Karma 中的应用

### 场景映射

| Karma 功能 | AG-UI 能力 | 实现方式 |
|-----------|-----------|---------|
| AI 对话 | Streaming Chat | `MessageEvent` |
| 任务分配 | Tool Calls | `ToolCallEvent` (调用 `assignTask`) |
| 项目进度 | State Sync | `StateUpdateEvent` (同步 `project.progress`) |
| 文件上传 | Multimodal | `AttachmentEvent` (图片/文档) |
| 审批流程 | Human-in-the-loop | `InterruptEvent` (等待用户确认) |
| 设备控制 | Backend Tools | `ToolCallEvent` (调用设备 API) |
| 实时收益 | State Sync | `StateUpdateEvent` (同步 `earnings`) |

---

## 前后端集成

### 前端集成 (React)

#### 1. 安装依赖

```bash
npm install @ag-ui/react
```

#### 2. 配置 Provider

```tsx
// src/app/layout.tsx
import { AgUIProvider } from '@ag-ui/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AgUIProvider
          agentEndpoint="/api/agent"
          defaultState={{
            user: { id: 'user-1' },
            project: { id: null },
          }}
        >
          {children}
        </AgUIProvider>
      </body>
    </html>
  );
}
```

#### 3. 使用 Hooks

```tsx
// src/components/ChatInterface.tsx
import { useAgentChat, useAgentState } from '@ag-ui/react';

export function ChatInterface() {
  const { messages, sendMessage, isLoading } = useAgentChat();
  const [projectState, updateState] = useAgentState('project');

  const handleSend = async (text: string) => {
    await sendMessage({
      role: 'user',
      content: text,
    });
  };

  return (
    <div>
      {messages.map((msg) => (
        <div key={msg.id}>{msg.content}</div>
      ))}
      {isLoading && <div>智能体正在思考...</div>}
      <input onSubmit={handleSend} />
      <div>项目进度: {projectState?.progress}%</div>
    </div>
  );
}
```

---

### 后端集成 (Next.js API Routes)

#### 1. 安装依赖

```bash
npm install @ag-ui/core
```

#### 2. 实现 Agent 端点

```typescript
// src/app/api/agent/route.ts
import { NextRequest } from 'next/server';
import { AgentRuntime } from '@ag-ui/core';
import { createLangGraphAgent } from '@/lib/agents/langraph';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { messages, state, tools } = body;

  // 创建 Agent Runtime
  const runtime = new AgentRuntime({
    agent: createLangGraphAgent(),
    tools: tools,
    initialState: state,
  });

  // 返回 SSE 流
  const stream = runtime.run(messages);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
```

#### 3. 定义工具 (Tools)

```typescript
// src/lib/agents/tools.ts
import { AgentTool } from '@ag-ui/core';

export const assignTaskTool: AgentTool = {
  name: 'assignTask',
  description: '将任务分配给 AI 分身',
  parameters: {
    taskId: { type: 'string', required: true },
    avatarId: { type: 'string', required: true },
  },
  execution: 'backend',
  handler: async ({ taskId, avatarId }) => {
    // 调用数据库
    const result = await db.tasks.update({
      where: { id: taskId },
      data: { assigneeId: avatarId },
    });
    return { success: true, task: result };
  },
};
```

---

### 状态同步示例

#### 前端监听状态变化

```tsx
import { useAgentState } from '@ag-ui/react';

function DeviceMonitor() {
  const [devices] = useAgentState('devices');

  return (
    <div>
      {devices.map(device => (
        <div key={device.id}>
          {device.name}: {device.status}
        </div>
      ))}
    </div>
  );
}
```

#### 后端更新状态

```typescript
// 智能体内部
runtime.updateState('devices', (prevDevices) => {
  return prevDevices.map((d) =>
    d.id === deviceId ? { ...d, status: 'online' } : d
  );
});
```

---

## 优势总结

### 对 Karma 项目的好处

1. **前后端完全解耦**
   - 前端团队专注 React UI
   - 后端团队专注智能体逻辑
   - 通过 JSON 事件通信，无需紧密耦合

2. **标准化协议**
   - 避免自定义协议维护成本
   - 社区支持（LangGraph、CrewAI 等）
   - 丰富的工具生态

3. **实时性能**
   - SSE 原生支持流式传输
   - 低延迟双向通信
   - 适合 AI 对话场景

4. **可扩展性**
   - 易于添加新工具
   - 支持多智能体编排
   - 灵活的状态管理

5. **多模态支持**
   - 文件上传/下载
   - 图片/视频处理
   - 语音交互

---

## 下一步

1. ✅ 阅读本文档
2. 📖 参考前端开发文档 (`docs/frontend/README.md`)
3. 🔧 参考后端开发指南 (`docs/backend/README.md`)
4. 💻 查看接口契约 (`docs/api/CONTRACT.md`)
5. 🚀 开始开发！

---

## 参考资源

- 官方文档: https://docs.ag-ui.com
- GitHub: https://github.com/ag-ui-protocol/ag-ui
- CopilotKit: https://www.copilotkit.ai/ag-ui
- 快速开始: `npx create-ag-ui-app my-app`
