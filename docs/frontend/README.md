# Karma Web App - 前端开发文档

> **技术栈**: Next.js 16 + React 19 + TypeScript + Tailwind CSS 4
> **协议**: AG-UI (Agent-User Interaction Protocol)
> **更新日期**: 2025-10-28

---

## 📋 目录

- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [核心概念](#核心概念)
- [API 调用](#api-调用)
- [AG-UI 集成](#ag-ui-集成)
- [状态管理](#状态管理)
- [UI 组件](#ui-组件)
- [最佳实践](#最佳实践)
- [调试指南](#调试指南)

---

## 快速开始

### 1. 环境准备

```bash
# Node.js 版本
node >= 20.0.0

# 包管理器
npm >= 10.0.0
```

### 2. 安装依赖

```bash
npm install
```

### 3. 环境变量

创建 `.env.local` 文件：

```bash
# OpenAI API Key (用于对话功能)
OPENAI_API_KEY=sk-...

# 后端 API 地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000

# Stripe 公钥 (用于支付)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. 运行开发服务器

```bash
npm run dev
```

访问 http://localhost:3000

---

## 项目结构

```
karma-web/
├── src/
│   ├── app/                      # Next.js 16 App Router 页面
│   │   ├── layout.tsx           # 根布局
│   │   ├── page.tsx             # 首页
│   │   ├── api/                 # API 路由（前端→后端代理）
│   │   │   └── agent/          # AG-UI 智能体端点
│   │   ├── conversations/      # 对话页面
│   │   ├── projects/           # 项目管理页面
│   │   ├── devices/            # 设备管理页面
│   │   │   └── [id]/
│   │   │       ├── page.tsx    # 设备详情
│   │   │       ├── files/      # 文件管理
│   │   │       ├── logs/       # 日志查看
│   │   │       └── settings/   # 设备设置
│   │   ├── avatars/            # AI 分身页面
│   │   ├── store/              # 分身商店
│   │   ├── pricing/            # 定价页面
│   │   └── subscriptions/      # 订阅管理
│   │
│   ├── components/              # React 组件
│   │   ├── ui/                 # 基础 UI 组件
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── ...
│   │   ├── layout/             # 布局组件
│   │   │   ├── Sidebar.tsx
│   │   │   ├── TopBar.tsx
│   │   │   └── BottomTabBar.tsx
│   │   └── features/           # 功能组件
│   │       ├── DeviceCard.tsx
│   │       ├── AvatarCard.tsx
│   │       └── ...
│   │
│   ├── lib/                     # 工具库和业务逻辑
│   │   ├── api/                # API 客户端
│   │   │   └── client.ts       # HTTP 请求封装
│   │   ├── hooks/              # Custom React Hooks
│   │   │   ├── useDevice.ts
│   │   │   ├── useAvatar.ts
│   │   │   └── useAgent.ts
│   │   ├── stores/             # 状态管理 (Zustand)
│   │   │   ├── uiStore.ts
│   │   │   └── layoutStore.ts
│   │   ├── utils/              # 工具函数
│   │   ├── device/             # 设备相关（临时 Mock）
│   │   ├── security/           # 安全相关
│   │   └── ...
│   │
│   ├── types/                   # TypeScript 类型定义
│   │   ├── api.ts              # API 类型（⭐️ 接口契约）
│   │   └── index.ts            # 通用类型
│   │
│   └── styles/                  # 样式文件
│       └── globals.css         # 全局样式 + Tailwind CSS
│
├── docs/                        # 文档
│   ├── api/                    # API 接口契约
│   ├── frontend/               # 前端文档（本文件）
│   └── backend/                # 后端文档
│
├── public/                      # 静态资源
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

---

## 核心概念

### 1. Next.js 16 App Router

Karma 使用 Next.js 16 的 App Router（应用路由）：

- **文件系统路由**: 每个 `page.tsx` 对应一个路由
- **服务端组件 (RSC)**: 默认所有组件都是服务端渲染
- **客户端组件**: 使用 `'use client'` 声明
- **并行路由**: 使用 `@folder` 语法
- **拦截路由**: 使用 `(.)folder` 语法

**示例**:

```tsx
// src/app/devices/page.tsx
export default function DevicesPage() {
  // 这是服务端组件
  return <div>设备列表</div>;
}

// src/components/ui/Button.tsx
'use client'; // 客户端组件

export function Button({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick}>Click</button>;
}
```

---

### 2. TypeScript 严格模式

项目启用了 TypeScript 严格模式：

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "strictNullChecks": true,
    "noImplicitAny": true
  }
}
```

**所有 API 调用必须使用类型**:

```typescript
import type { GetDevicesQuery, Device } from '@/types/api';

const query: GetDevicesQuery = {
  status: 'online',
  page: 1,
};

const devices: Device[] = await api.devices.list(query);
```

---

### 3. 设计系统

Karma 使用自定义设计 Token：

**颜色系统**:

```css
/* src/styles/globals.css */
:root {
  --color-brand-primary: #00D9FF;
  --color-bg-base: #0A0E14;
  --color-bg-panel: #111722;
  --color-text-primary: #E6EDF3;
  /* ... 更多 Token */
}
```

**使用方式**:

```tsx
<div
  style={{
    backgroundColor: 'var(--color-bg-panel)',
    color: 'var(--color-text-primary)',
  }}
>
  内容
</div>
```

或使用 Tailwind CSS:

```tsx
<div className="bg-bg-panel text-text-primary">内容</div>
```

---

## API 调用

### 1. 使用 API Client

**推荐方式**: 使用 `src/lib/api/client.ts`

```typescript
import { api, ApiError } from '@/lib/api/client';

export function DeviceList() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.devices.list({
        status: 'online',
        page: 1,
        pageSize: 20,
      });

      setDevices(response.devices);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        console.error('API Error:', err.code, err.details);
      } else {
        setError('未知错误');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>加载中...</div>;
  if (error) return <div>错误: {error}</div>;

  return (
    <div>
      {devices.map((device) => (
        <DeviceCard key={device.id} device={device} />
      ))}
    </div>
  );
}
```

---

### 2. 设置认证 Token

```typescript
import { apiClient } from '@/lib/api/client';

// 用户登录后
const token = 'jwt_token_here';
apiClient.setAuthToken(token);

// 用户登出
apiClient.clearAuthToken();
```

---

### 3. 处理文件上传

```typescript
import { api } from '@/lib/api/client';

async function uploadFile(deviceId: string, file: File) {
  try {
    const result = await api.files.upload(deviceId, file, {
      path: '/uploads',
      category: 'user',
      overwrite: false,
    });

    console.log('上传成功:', result.file);
  } catch (error) {
    console.error('上传失败:', error);
  }
}
```

---

## AG-UI 集成

### 1. 安装依赖

```bash
npm install @ag-ui/react
```

### 2. 配置 Provider

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
            user: { id: 'user-1', name: 'Viveka', avatar: '...' },
          }}
        >
          {children}
        </AgUIProvider>
      </body>
    </html>
  );
}
```

---

### 3. 使用 Agent Hooks

#### useAgentChat

```tsx
'use client';

import { useAgentChat } from '@ag-ui/react';

export function ChatInterface() {
  const {
    messages,
    sendMessage,
    isLoading,
    error,
  } = useAgentChat();

  const handleSend = async (text: string) => {
    await sendMessage({
      role: 'user',
      content: text,
    });
  };

  return (
    <div>
      {/* 消息列表 */}
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className={msg.role}>
            {msg.content}
          </div>
        ))}
      </div>

      {/* 输入框 */}
      <input
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleSend(e.currentTarget.value);
            e.currentTarget.value = '';
          }
        }}
        disabled={isLoading}
      />

      {isLoading && <div>智能体正在思考...</div>}
      {error && <div>错误: {error}</div>}
    </div>
  );
}
```

---

#### useAgentState

```tsx
'use client';

import { useAgentState } from '@ag-ui/react';

export function DeviceMonitor() {
  const [devices, updateDevices] = useAgentState('devices');
  const [earnings] = useAgentState('earnings');

  return (
    <div>
      <h2>设备状态 (实时同步)</h2>
      {devices?.map((device) => (
        <div key={device.id}>
          {device.name}: {device.status}
        </div>
      ))}

      <h2>今日收益</h2>
      <div>${earnings?.today || 0}</div>
    </div>
  );
}
```

---

### 4. 实现前端工具 (Frontend Tools)

当智能体调用前端工具时，前端需要处理：

```tsx
'use client';

import { useAgentTools } from '@ag-ui/react';
import { useRouter } from 'next/navigation';

export function ToolHandlers() {
  const router = useRouter();

  useAgentTools({
    // 工具 1: 导航
    navigateTo: async ({ path }) => {
      router.push(path);
      return { success: true };
    },

    // 工具 2: 打开模态框
    openModal: async ({ modalType, data }) => {
      // 打开模态框逻辑
      return { success: true };
    },

    // 工具 3: 显示通知
    showNotification: async ({ title, message, type }) => {
      // 使用 toast 库显示通知
      toast[type](title, message);
      return { success: true };
    },
  });

  return null; // 这个组件不渲染任何内容
}
```

在根布局中使用：

```tsx
// src/app/layout.tsx
<AgUIProvider agentEndpoint="/api/agent">
  <ToolHandlers />
  {children}
</AgUIProvider>
```

---

## 状态管理

### 1. Zustand Store

Karma 使用 Zustand 进行客户端状态管理：

```typescript
// src/lib/stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  theme: 'dark',
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setTheme: (theme) => set({ theme }),
}));
```

使用方式：

```tsx
import { useUIStore } from '@/lib/stores/uiStore';

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className={sidebarOpen ? 'open' : 'closed'}>
      <button onClick={() => setSidebarOpen(!sidebarOpen)}>
        切换
      </button>
    </div>
  );
}
```

---

### 2. AG-UI 共享状态

**重要**: AG-UI 的共享状态是前后端同步的，不要与 Zustand 混用！

| 状态类型 | 使用场景 | 存储方式 |
|---------|---------|---------|
| 客户端 UI 状态 | 侧边栏开关、主题 | Zustand |
| 前后端共享状态 | 设备列表、项目进度 | AG-UI State |

---

## UI 组件

### 1. 基础组件

位置: `src/components/ui/`

**Button**:

```tsx
import { Button } from '@/components/ui/Button';

<Button variant="primary" size="lg" onClick={() => {}}>
  点击我
</Button>
```

**Input**:

```tsx
import { Input } from '@/components/ui/Input';

<Input
  type="text"
  placeholder="请输入..."
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
```

**Modal**:

```tsx
import { Modal } from '@/components/ui/Modal';

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="设备详情"
>
  <div>内容</div>
</Modal>
```

---

### 2. 布局组件

**Sidebar** (`src/components/layout/Sidebar.tsx`):

```tsx
import { Sidebar } from '@/components/layout/Sidebar';

<Sidebar>
  <nav>导航菜单</nav>
</Sidebar>
```

**BottomTabBar** (`src/components/layout/BottomTabBar.tsx`):

移动端底部导航栏，自动在移动设备上显示。

---

## 最佳实践

### 1. 组件设计

**✅ 推荐**:

```tsx
// 服务端组件 - 用于数据获取
export default async function DevicesPage() {
  const devices = await api.devices.list();

  return <DeviceList devices={devices} />;
}

// 客户端组件 - 用于交互
'use client';

export function DeviceList({ devices }) {
  const [selected, setSelected] = useState(null);

  return (
    <div>
      {devices.map((device) => (
        <DeviceCard
          key={device.id}
          device={device}
          onClick={() => setSelected(device.id)}
        />
      ))}
    </div>
  );
}
```

**❌ 避免**:

```tsx
// 不要在一个组件里混合服务端和客户端逻辑
'use client';

export default async function BadPage() {
  // ❌ 客户端组件不能是 async
  const data = await fetch(...);

  const [state, setState] = useState();

  return <div>...</div>;
}
```

---

### 2. 错误处理

**统一错误处理**:

```tsx
import { ApiError } from '@/lib/api/client';

async function handleAction() {
  try {
    await api.devices.delete(deviceId);
  } catch (err) {
    if (err instanceof ApiError) {
      switch (err.code) {
        case 'NOT_FOUND':
          toast.error('设备不存在');
          break;
        case 'UNAUTHORIZED':
          router.push('/login');
          break;
        default:
          toast.error(err.message);
      }
    } else {
      toast.error('未知错误');
      console.error(err);
    }
  }
}
```

---

### 3. 性能优化

**使用 React.memo**:

```tsx
import { memo } from 'react';

export const DeviceCard = memo(function DeviceCard({ device }) {
  return <div>{device.name}</div>;
});
```

**使用 useMemo/useCallback**:

```tsx
const filteredDevices = useMemo(() => {
  return devices.filter((d) => d.status === 'online');
}, [devices]);

const handleDelete = useCallback(
  async (id: string) => {
    await api.devices.delete(id);
  },
  []
);
```

---

## 调试指南

### 1. 开发工具

- **React DevTools**: 检查组件树
- **Network Tab**: 检查 API 请求
- **Console**: 查看错误日志

### 2. AG-UI 调试

启用 AG-UI 调试模式：

```tsx
<AgUIProvider debug={true} agentEndpoint="/api/agent">
  {children}
</AgUIProvider>
```

这会在控制台打印所有 AG-UI 事件。

### 3. 常见问题

**问题 1**: API 请求失败 404

```
解决: 检查后端服务是否启动，环境变量 NEXT_PUBLIC_API_BASE_URL 是否正确
```

**问题 2**: AG-UI 事件未触发

```
解决: 确保 AgUIProvider 已包裹应用，检查 /api/agent 端点是否正常
```

**问题 3**: TypeScript 类型错误

```
解决: 确保使用 @/types/api 中定义的类型，运行 npm run type-check
```

---

## 下一步

1. 📖 阅读 [API 接口契约](../api/CONTRACT.md)
2. 🔧 查看 [AG-UI 协议文档](../api/AG-UI-PROTOCOL.md)
3. 💻 参考 [后端开发指南](../backend/README.md)

---

## 相关资源

- Next.js 文档: https://nextjs.org/docs
- React 文档: https://react.dev
- AG-UI 文档: https://docs.ag-ui.com
- TypeScript 文档: https://www.typescriptlang.org/docs
