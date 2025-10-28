# Karma Web App - 前端快速开始（5分钟）

> **适用于**: 前端开发、UI设计师、产品经理
> **目标**: 无需后端即可快速开发和预览 UI

---

## 🚀 快速开始（3步）

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

复制环境变量模板：

```bash
cp .env.example .env.local
```

确认 `.env.local` 中 Mock 已启用：

```bash
# .env.local
NEXT_PUBLIC_ENABLE_MOCK=true
```

### 3. 启动开发服务器

```bash
npm run dev
```

打开浏览器访问 http://localhost:3000

**你会看到**:
```
🎭 MSW Mock API 已启用
```

---

## ✅ 验证 Mock API 工作

### 访问设备管理页面

1. 打开 http://localhost:3000/devices
2. 你会看到 5 台模拟设备
3. 打开浏览器开发者工具 → Network 面板
4. 查看 `/api/devices` 请求
5. 你会看到 **MSW** 标记（表示请求被拦截）

### 测试 API 调用

打开浏览器控制台，输入：

```javascript
// 使用 API Client 获取设备列表
import { api } from '@/lib/api/client';

const devices = await api.devices.list({ status: 'online' });
console.log('在线设备:', devices);
```

你会看到返回的模拟数据！

---

## 📖 开发指南

### 调用 API

所有 API 调用都通过 `src/lib/api/client.ts`：

```typescript
import { api } from '@/lib/api/client';

// 获取设备列表
const response = await api.devices.list({
  status: 'online',
  page: 1,
  pageSize: 20,
});

// 创建设备
const newDevice = await api.devices.create({
  name: 'EOS-3A #006',
  model: 'EOS-3A',
  serialNumber: 'EOS3A-2024-006',
  mac: '00:1A:2B:3C:4D:63',
});

// 删除设备
await api.devices.delete('device-1');
```

### 修改 Mock 数据

编辑 `src/mocks/data/devices.ts`：

```typescript
export let mockDevices: Device[] = [
  {
    id: 'device-1',
    name: '我的自定义设备',
    model: 'EOS-3A',
    status: 'online',
    // ... 其他字段
  },
];
```

保存后，页面会自动刷新！

### 添加更多设备

使用数据生成器：

```typescript
import { generateMockDevices } from '@/mocks/data/devices';

// 生成 100 台设备
const devices = generateMockDevices(100);
```

### 模拟网络延迟

编辑 `src/mocks/handlers/devices.ts`：

```typescript
http.get('/api/devices', async ({ request }) => {
  await delay(1000); // 1秒延迟
  // ...
});
```

### 模拟错误

```typescript
http.post('/api/devices', async ({ request }) => {
  // 50% 概率返回错误
  if (Math.random() < 0.5) {
    return HttpResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: '服务器错误',
        },
      },
      { status: 500 }
    );
  }
  // 正常逻辑...
});
```

---

## 🔄 切换到真实后端

当后端开发完成后，**只需修改环境变量**：

```bash
# .env.local

# 关闭 Mock
NEXT_PUBLIC_ENABLE_MOCK=false

# 设置后端地址
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

重启开发服务器：

```bash
npm run dev
```

**所有业务代码无需修改！**

---

## 📚 更多文档

- **Mock API 详细指南**: `docs/frontend/QUICK-START-MOCK.md`
- **前端开发文档**: `docs/frontend/README.md`
- **API 接口契约**: `docs/api/CONTRACT.md`
- **AG-UI 协议**: `docs/api/AG-UI-PROTOCOL.md`

---

## ❓ 常见问题

### Q: 如何查看拦截的请求？

A: 打开浏览器开发者工具 → Network 面板，被 MSW 拦截的请求会有特殊标记

### Q: Mock 数据持久化吗？

A: 不持久化。刷新页面后，数据会重置为初始状态。这是 MSW 的设计。

### Q: 如何添加新的 API Mock？

A:
1. 在 `src/mocks/handlers/` 创建新的 handler 文件
2. 在 `src/mocks/handlers/index.ts` 中导入
3. 参考 `devices.ts` 的写法

### Q: 前端和后端同时开发，如何协作？

A:
- 前端：使用 Mock API 开发 UI
- 后端：参考 `docs/api/CONTRACT.md` 实现 API
- 联调：前端设置 `NEXT_PUBLIC_ENABLE_MOCK=false` 连接后端

### Q: 生产环境会启用 Mock 吗？

A: 不会。MSW 只在以下条件**同时满足**时启用：
- `process.env.NODE_ENV === 'development'`
- `process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true'`

生产环境 `NODE_ENV` 是 `production`，所以不会启用。

---

## 🎉 开始开发吧！

现在你可以：

1. ✅ 无需后端即可开发 UI
2. ✅ 实时预览交互效果
3. ✅ 调试 API 调用逻辑
4. ✅ 后端就绪后一键切换

**祝开发顺利！** 🚀
