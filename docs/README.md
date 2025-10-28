# Karma Web App - 文档中心

> **版本**: v1.0.0
> **架构**: 前后端分离 + AG-UI 协议
> **更新日期**: 2025-10-28

---

## 📚 文档导航

### 🎯 快速开始

根据你的角色，选择对应的文档：

| 角色 | 文档 | 说明 |
|-----|------|------|
| **前端开发** | [前端开发文档](./frontend/README.md) | React 组件、API 调用、AG-UI 集成 |
| **后端开发** | [后端开发指南](./backend/README.md) | API 实现、数据库设计、智能体开发 |
| **全栈/架构** | [API 接口契约](./api/CONTRACT.md) | 前后端接口规范 |
| **研究/学习** | [AG-UI 协议文档](./api/AG-UI-PROTOCOL.md) | 智能体-用户交互协议详解 |

---

## 🏗️ 项目架构

### 整体架构图

```
┌──────────────────────────────────────────────────────────────┐
│                       用户层 (User Layer)                     │
│                    Web浏览器 / 移动浏览器                      │
└─────────────────────────┬────────────────────────────────────┘
                          │ HTTPS
┌─────────────────────────▼────────────────────────────────────┐
│                    前端层 (Frontend Layer)                     │
│          Next.js 16 + React 19 + TypeScript + AG-UI          │
│                     部署: Vercel / Netlify                     │
└──────────────────┬──────────────────┬────────────────────────┘
                   │                  │
                   │ AG-UI Protocol   │ REST API
                   │ (HTTP + SSE)     │ (HTTP JSON)
                   │                  │
┌──────────────────▼──────────────────▼────────────────────────┐
│                    后端层 (Backend Layer)                      │
│              FastAPI / NestJS + LangGraph / CrewAI            │
│                     部署: AWS / 阿里云 / Railway              │
└──────┬──────────────┬───────────────┬────────────────────────┘
       │              │               │
       │              │               │
┌──────▼──────┐ ┌─────▼─────┐ ┌──────▼──────┐
│ PostgreSQL  │ │   Redis   │ │   AWS S3    │
│  (数据库)   │ │  (缓存)   │ │ (文件存储)  │
└─────────────┘ └───────────┘ └─────────────┘
       │
       │
┌──────▼──────────────────────────────────────────────────────┐
│                    AI 服务层 (AI Services)                    │
│              OpenAI / Anthropic / 本地大模型                  │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔗 核心技术

### 前端技术栈

| 技术 | 版本 | 用途 |
|-----|------|------|
| **Next.js** | 16.0.0 | React 框架 + SSR/SSG |
| **React** | 19.2.0 | UI 库 |
| **TypeScript** | 5.x | 类型安全 |
| **Tailwind CSS** | 4.x | 样式框架 |
| **AG-UI SDK** | latest | 智能体交互 |
| **Zustand** | latest | 状态管理 |

### 后端技术栈（推荐）

| 技术 | 版本 | 用途 |
|-----|------|------|
| **FastAPI** | 0.1x | Python Web 框架 |
| **SQLAlchemy** | 2.x | ORM |
| **PostgreSQL** | 15+ | 关系数据库 |
| **Redis** | 7+ | 缓存 + 消息队列 |
| **LangGraph** | latest | 智能体编排 |
| **AG-UI SDK** | latest | 智能体交互协议 |
| **Celery** | latest | 异步任务 |

---

## 📖 核心概念

### 1. AG-UI 协议

**AG-UI (Agent-User Interaction Protocol)** 是一个开放、轻量、事件驱动的协议，用于标准化 AI 智能体与前端应用的连接方式。

**关键特性**:
- 实时流式通信 (SSE)
- 双向状态同步
- 多模态支持（文件、图片、音频）
- Human-in-the-loop 审批流程

**详细文档**: [AG-UI 协议文档](./api/AG-UI-PROTOCOL.md)

---

### 2. 前后端分离

Karma 采用完全的前后端分离架构：

```
前端团队 ────┐
             ├──▶ 通过 API 契约协作 ◀──┐
后端团队 ────┘                        │
                                     AG-UI 协议
```

**优势**:
- 团队独立开发
- 技术栈灵活选择
- 易于扩展和维护
- 标准化接口

---

### 3. 数据流

#### RESTful API 流程

```
前端 ──────▶ REST API ──────▶ 数据库
     (HTTP)           (SQL)
     ◀──────         ◀──────
     (JSON)          (Data)
```

#### AG-UI 智能体流程

```
前端 ──────▶ /api/agent ──────▶ 智能体 ──────▶ 工具调用
     (POST)            (LangGraph)        (数据库/设备)
     ◀──────          ◀──────            ◀──────
     (SSE Stream)     (Events)           (Results)
```

---

## 🚀 快速开始指南

### 前端开发者

1. **阅读文档**
   - [前端开发文档](./frontend/README.md)
   - [API 接口契约](./api/CONTRACT.md)

2. **环境准备**
   ```bash
   cd karma-web
   npm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   # 编辑 .env.local，设置后端 API 地址
   ```

4. **启动开发服务器**
   ```bash
   npm run dev
   ```

5. **开始开发**
   - 使用 `src/lib/api/client.ts` 调用后端 API
   - 参考 `src/types/api.ts` 中的类型定义
   - 集成 AG-UI SDK 实现智能体交互

---

### 后端开发者

1. **阅读文档**
   - [后端开发指南](./backend/README.md)
   - [API 接口契约](./api/CONTRACT.md)
   - [AG-UI 协议文档](./api/AG-UI-PROTOCOL.md)

2. **选择技术栈**
   - 推荐: Python + FastAPI + LangGraph
   - 或: Node.js + NestJS + LangChain.js

3. **设计数据库**
   - 参考 [后端开发指南 - 数据库设计](./backend/README.md#数据库设计)
   - 创建迁移脚本

4. **实现 API 端点**
   - RESTful API (CRUD 操作)
   - AG-UI Agent 端点 (`/api/agent`)

5. **开发智能体**
   - 定义工具 (Tools)
   - 使用 LangGraph 编排智能体
   - 集成到 AG-UI Runtime

---

## 📋 开发检查清单

### 前端团队

- [ ] 环境搭建完成
- [ ] 理解 AG-UI 协议
- [ ] 熟悉 API Client 使用
- [ ] 实现页面组件
- [ ] 集成 AG-UI SDK
- [ ] 实现前端工具处理器
- [ ] 错误处理和加载状态
- [ ] 响应式设计（桌面+移动）
- [ ] 类型安全 (TypeScript)
- [ ] 单元测试

### 后端团队

- [ ] 数据库设计完成
- [ ] 数据库迁移脚本
- [ ] RESTful API 实现
- [ ] AG-UI 端点实现
- [ ] 智能体工具定义
- [ ] 认证与授权
- [ ] 错误处理
- [ ] API 文档生成
- [ ] 单元测试
- [ ] 集成测试
- [ ] 性能优化

---

## 🔧 开发工具

### 推荐 VS Code 扩展

**前端**:
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)

**后端**:
- Python / JavaScript
- Pylance / TypeScript
- REST Client
- Database Client

---

## 🐛 问题排查

### 常见问题

#### Q1: 前端调用 API 返回 404

**解决**:
```
1. 检查后端服务是否启动
2. 检查环境变量 NEXT_PUBLIC_API_BASE_URL
3. 查看浏览器 Network 面板确认请求 URL
```

#### Q2: AG-UI 事件流断开

**解决**:
```
1. 检查 /api/agent 端点是否正常返回 SSE
2. 确认后端使用 StreamingResponse
3. 检查前端 AgUIProvider 配置
```

#### Q3: TypeScript 类型错误

**解决**:
```
1. 确保使用 src/types/api.ts 中的类型
2. 运行 npm run type-check
3. 重启 TypeScript 服务器
```

---

## 📞 获取帮助

### 文档资源

- **本地文档**: 你正在阅读的文档目录
- **AG-UI 官方文档**: https://docs.ag-ui.com
- **Next.js 文档**: https://nextjs.org/docs
- **FastAPI 文档**: https://fastapi.tiangolo.com
- **LangGraph 文档**: https://langchain-ai.github.io/langgraph

### 团队协作

- 前端 Issues: 在项目管理工具中创建前端任务
- 后端 Issues: 在项目管理工具中创建后端任务
- API 契约变更: 需要前后端团队共同评审

---

## 🎉 开始开发！

选择你的角色，开始阅读对应的开发文档：

- 👨‍💻 [前端开发文档](./frontend/README.md)
- 🔧 [后端开发指南](./backend/README.md)
- 📖 [API 接口契约](./api/CONTRACT.md)
- 🤖 [AG-UI 协议文档](./api/AG-UI-PROTOCOL.md)

祝开发顺利！🚀
