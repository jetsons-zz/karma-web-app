# 🤖 GPT 集成使用指南

## ⚠️ 安全警告

**请不要在代码中直接写入 API Key!**
始终使用环境变量来存储敏感信息。

---

## 🚀 快速开始

### 1. 配置 API Key

#### 方法一: 使用环境变量(推荐)

1. 在项目根目录创建 `.env.local` 文件:
```bash
cp .env.local.example .env.local
```

2. 编辑 `.env.local` 文件，填入你的 OpenAI API Key:
```env
OPENAI_API_KEY=sk-proj-你的-api-key-这里
OPENAI_MODEL=gpt-4
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000
```

3. 重启开发服务器:
```bash
npm run dev
```

#### 方法二: 使用客户端 API Key

如果你想让用户使用自己的 API key，可以在请求时传入:

```typescript
import { chatService } from '@/lib/services/chatService';

const response = await chatService.sendMessage(messages, {
  apiKey: 'user-provided-key', // 用户自己的 key
  model: 'gpt-4',
});
```

---

## 📖 功能说明

### 1. 消息日期分组

消息会自动按日期分组显示:
- **今天** - 今天的消息
- **昨天** - 昨天的消息
- **周X** - 本周内的消息(如"周一"、"周二")
- **X月X日** - 今年内的消息
- **X年X月X日** - 更早的消息

**特性**:
- ✅ 自动分组和排序
- ✅ 智能显示相对时间或绝对时间
- ✅ 视觉分隔清晰

### 2. GPT 实时对话

**流式响应特性**:
- ✅ 逐字显示 AI 回复
- ✅ 打字机效果
- ✅ 实时更新消息内容
- ✅ "正在输入"指示器

**对话功能**:
- ✅ 支持上下文记忆(最近10条消息)
- ✅ 自定义系统提示
- ✅ 多模型支持(GPT-4, GPT-3.5等)
- ✅ 错误处理和重试

---

## 🛠️ API 使用示例

### 基础对话

```typescript
import { chatService } from '@/lib/services/chatService';

// 发送消息并获取响应
const response = await chatService.sendMessage([
  {
    role: 'system',
    content: '你是一个专业的 AI 助手',
  },
  {
    role: 'user',
    content: '你好!',
  },
], {
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 2000,
});

console.log(response); // AI 的回复
```

### 流式对话

```typescript
// 逐字接收响应
for await (const chunk of chatService.sendMessageStream(messages)) {
  console.log(chunk); // 每个字符或词
  // 可以实时更新 UI
}
```

### 代码分析

```typescript
import { openaiService } from '@/lib/services/openai';

const analysis = await openaiService.analyzeCode(
  'function hello() { console.log("Hello"); }',
  'javascript'
);

console.log(analysis);
// {
//   summary: "...",
//   complexity: "low",
//   quality: 85,
//   issues: [...],
//   suggestions: [...]
// }
```

---

## 🔧 配置选项

### 环境变量

| 变量 | 说明 | 默认值 |
|------|------|--------|
| `OPENAI_API_KEY` | OpenAI API 密钥 | 必填 |
| `OPENAI_MODEL` | 使用的模型 | `gpt-4` |
| `OPENAI_TEMPERATURE` | 创造性(0-2) | `0.7` |
| `OPENAI_MAX_TOKENS` | 最大token数 | `2000` |

### ChatOptions

```typescript
interface ChatOptions {
  model?: string;          // 模型名称
  temperature?: number;    // 0-2，越高越随机
  max_tokens?: number;     // 响应最大长度
  apiKey?: string;         // 可选: 用户自己的 key
}
```

---

## 📱 在对话页面中使用

对话页面已经集成了所有功能!

**功能展示**:

1. **打开对话页面**:
```
http://localhost:3000/conversations
```

2. **发送消息**:
   - 输入文字消息
   - 支持多模态输入(文字/语音/图片)
   - 实时流式接收 GPT 响应

3. **查看历史**:
   - 消息按日期自动分组
   - 智能显示时间标签
   - 支持消息反应和回复

---

## 🔍 组件说明

### DateDivider
日期分隔组件，用于显示日期标签。

```typescript
<DateDivider date="今天" />
```

### 日期工具函数

```typescript
import {
  formatDateGroup,      // 格式化为分组标签
  formatMessageTime,    // 格式化消息时间
  groupMessagesByDate,  // 按日期分组消息
  isSameDay            // 判断是否同一天
} from '@/lib/utils/dateHelpers';

// 使用示例
const label = formatDateGroup(new Date()); // "今天"
const time = formatMessageTime(new Date()); // "刚刚" 或 "15:30"
const groups = groupMessagesByDate(messages);
```

---

## 🚨 常见问题

### 1. API Key 错误

**错误信息**: `OpenAI API key not configured`

**解决方法**:
- 检查 `.env.local` 文件是否存在
- 确认 API Key 格式正确
- 重启开发服务器

### 2. 403 Forbidden

**错误信息**: `Invalid API Key`

**解决方法**:
- 前往 https://platform.openai.com/api-keys 检查 key
- 确认 key 有效且未过期
- 检查账户余额

### 3. 流式响应不工作

**可能原因**:
- 网络问题
- API 限流
- Edge Runtime 配置问题

**解决方法**:
- 检查网络连接
- 降低请求频率
- 查看控制台错误信息

### 4. 如何撤销泄露的 API Key?

1. 立即前往 [OpenAI Platform](https://platform.openai.com/api-keys)
2. 找到泄露的 key 并删除
3. 生成新的 key
4. 更新 `.env.local` 文件

---

## 🎨 自定义配置

### 修改默认模型

在 `.env.local` 中:
```env
OPENAI_MODEL=gpt-3.5-turbo  # 使用 GPT-3.5
```

或在代码中:
```typescript
const response = await chatService.sendMessage(messages, {
  model: 'gpt-3.5-turbo',
});
```

### 调整创造性

```typescript
// 更随机的回复
chatService.sendMessage(messages, {
  temperature: 1.5,
});

// 更确定的回复
chatService.sendMessage(messages, {
  temperature: 0.3,
});
```

### 限制响应长度

```typescript
chatService.sendMessage(messages, {
  max_tokens: 500, // 限制在500 tokens
});
```

---

## 📊 支持的模型

| 模型 | 说明 | 适用场景 |
|------|------|---------|
| `gpt-4` | 最强大 | 复杂任务、代码生成 |
| `gpt-4-turbo` | 速度快 | 平衡性能和成本 |
| `gpt-3.5-turbo` | 经济实惠 | 简单对话、快速响应 |

---

## 🔐 安全最佳实践

1. ✅ **使用环境变量**存储 API Key
2. ✅ **添加 .env.local 到 .gitignore**
3. ✅ **定期轮换 API Key**
4. ✅ **设置使用限额**
5. ✅ **监控 API 使用量**
6. ❌ **不要**在前端暴露 API Key
7. ❌ **不要**提交 API Key 到 Git
8. ❌ **不要**在日志中打印 API Key

---

## 📞 获取帮助

- OpenAI 文档: https://platform.openai.com/docs
- API 参考: https://platform.openai.com/docs/api-reference
- 社区论坛: https://community.openai.com

---

## 🎉 开始使用

1. 配置 `.env.local` 文件
2. 重启开发服务器
3. 访问 `/conversations` 页面
4. 开始聊天!

**祝你使用愉快! 🚀**
