# Karma Web App

Karma 是一个 AI 驱动的团队协作平台,通过 Avatar(AI 分身)实现高效的项目管理和任务执行。

## 🆕 最新更新

### v1.2.0 (2025-10-25) ⭐ 最新

#### 🤖 GPT 对话集成
- ✨ **OpenAI GPT API 集成** - 真实的 AI 对话功能
- ✨ **流式响应** - 打字机效果，实时显示 AI 回复
- ✨ **上下文记忆** - 支持多轮对话(最近10条消息)
- ✨ **多模型支持** - GPT-4, GPT-3.5-turbo 等

#### 📅 消息日期分组
- ✨ **智能日期标签** - 自动显示"今天"、"昨天"、"周X"等
- ✨ **自动分组** - 按日期自动分组消息
- ✨ **相对时间** - "刚刚"、"5分钟前"等人性化显示

### v1.1.0 (2025-10-25)

- ✨ **文件分析组件** - 完整的代码质量分析和建议系统
- ✨ **多类型消息系统** - 支持文本、代码、文件、分析等6种消息类型
- ✨ **加载状态组件库** - 骨架屏、输入指示器、空状态等
- ✨ **对话页面重构** - 完整的消息流、实时交互、响应式布局
- ✨ **移动端优化** - 完善的触控体验和自适应布局

### 查看详情
- 🤖 [GPT 集成指南](./GPT-INTEGRATION-GUIDE.md) - GPT 使用详细说明 ⭐ 新
- 📝 [新功能总结](./NEW-FEATURES-SUMMARY.md) - 最新功能完成总结 ⭐ 新
- 📖 [改进总结](./IMPROVEMENTS.md) - 详细功能说明
- 💻 [使用示例](./EXAMPLES.md) - 代码示例和最佳实践
- 📊 [完成总结](./SUMMARY.md) - 改进对比和成果展示
- 📋 [变更日志](./CHANGELOG.md) - 完整版本历史

---

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 📁 项目结构

```
karma-web/
├── src/
│   ├── app/                    # Next.js App Router 页面
│   │   ├── page.tsx           # 主页
│   │   ├── conversations/     # 对话页面 (已重构)
│   │   ├── projects/          # 项目管理
│   │   ├── avatars/           # Avatar 团队
│   │   └── tasks/             # 任务管理
│   ├── components/
│   │   ├── features/          # 功能组件
│   │   │   ├── FileAnalysis.tsx      ✨ 新增
│   │   │   ├── MessageBubble.tsx     ✨ 新增
│   │   │   └── CommandPalette.tsx
│   │   ├── layout/            # 布局组件
│   │   │   ├── MainLayout.tsx
│   │   │   ├── TopNav.tsx
│   │   │   └── LeftSidebar.tsx
│   │   └── ui/                # UI 组件库
│   │       ├── LoadingStates.tsx     ✨ 新增
│   │       ├── Button.tsx
│   │       ├── Card.tsx
│   │       └── ...
│   └── lib/                   # 工具和配置
├── IMPROVEMENTS.md            📝 改进总结
├── EXAMPLES.md                📝 使用示例
└── SUMMARY.md                 📝 完成总结
```

## 🎯 核心功能

### 1. 对话系统
- 支持多种消息类型(文本、代码、文件、分析等)
- 实时消息流
- 消息反应和互动
- 移动端友好

### 2. 文件分析
- 代码质量评分
- 复杂度分析
- 问题检测
- 优化建议

### 3. 项目管理
- 项目驾驶舱
- 任务看板
- 进度跟踪
- Avatar 分配

### 4. Avatar 团队
- 多个 AI 分身协作
- 实时状态显示
- 任务自动分配
- HITL(人机协作)决策

## 🛠️ 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS + CSS Variables
- **状态管理**: React Hooks
- **图表**: Victory (数据可视化)
- **移动端**: 响应式设计 + 触觉反馈

## 📚 文档导航

| 文档 | 说明 |
|------|------|
| [IMPROVEMENTS.md](./IMPROVEMENTS.md) | 详细改进说明,包括所有新增功能和组件 API |
| [EXAMPLES.md](./EXAMPLES.md) | 完整的代码示例和使用方法 |
| [SUMMARY.md](./SUMMARY.md) | 改进前后对比,成果总结 |
| [IOS-INTEGRATION.md](./IOS-INTEGRATION.md) | iOS 集成指南 |

## 🚀 快速体验新功能

1. 启动开发服务器
```bash
npm run dev
```

2. 访问对话页面查看新功能
```
http://localhost:3000/conversations
```

3. 体验功能:
   - 发送消息查看多种消息类型
   - 查看文件分析卡片
   - 测试移动端响应式布局
   - 尝试消息反应功能

## 🎨 设计系统

Karma 使用统一的设计系统:
- **颜色**: 品牌色、状态色、HITL 绿色
- **间距**: 统一的 spacing 变量
- **圆角**: 12px/16px/20px 层级
- **动画**: 流畅的过渡效果

查看 `tailwind.config.ts` 了解完整配置。

## 🤝 贡献指南

1. 遵循 TypeScript 类型定义
2. 保持组件单一职责
3. 使用设计系统变量
4. 添加适当的文档注释
5. 测试响应式布局

---

**版本**: 1.0.0
**最后更新**: 2025-10-25
**维护团队**: Karma Development Team
