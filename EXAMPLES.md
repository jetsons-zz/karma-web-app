# Karma Web App - 使用示例

本文档提供了新增功能的实际使用示例代码。

---

## 📄 1. 文件分析组件示例

### 基础用法

```typescript
import { FileAnalysis, FileAnalysisData } from '@/components/features/FileAnalysis';

function MyComponent() {
  const analysisData: FileAnalysisData = {
    fileName: 'UserService.ts',
    fileType: 'TypeScript',
    size: 4096,
    language: 'TypeScript',
    linesOfCode: 200,
    analysis: {
      summary: '用户服务模块,包含用户认证和权限管理功能。代码结构合理,但部分函数过于复杂。',
      complexity: 'high',
      quality: 75,
      issues: [
        {
          type: 'error',
          message: '密码存储未使用加密',
          line: 45,
        },
        {
          type: 'warning',
          message: '函数 authenticateUser 圈复杂度过高 (15)',
          line: 78,
        },
        {
          type: 'info',
          message: '建议添加输入验证',
          line: 120,
        },
      ],
      suggestions: [
        '使用 bcrypt 对密码进行哈希处理',
        '将 authenticateUser 拆分为更小的函数',
        '添加 Joi 或 Zod 进行输入验证',
        '增加单元测试覆盖率',
      ],
      dependencies: [
        'express',
        'jsonwebtoken',
        'bcrypt',
        'mongoose',
      ],
      exports: [
        'UserService',
        'authenticateUser',
        'authorizeUser',
        'createUser',
        'updateUser',
      ],
    },
    createdAt: new Date().toISOString(),
  };

  return (
    <FileAnalysis
      file={analysisData}
      onClose={() => console.log('关闭分析')}
      onViewCode={() => console.log('查看代码')}
    />
  );
}
```

---

## 💬 2. 消息气泡组件示例

### 2.1 文本消息

```typescript
import { MessageBubble } from '@/components/features/MessageBubble';

function TextMessageExample() {
  const message = {
    id: '1',
    sender: 'avatar' as const,
    type: 'text' as const,
    content: '你好!我是 Forge,很高兴为你服务。有什么我可以帮助你的吗?',
    timestamp: '2分钟前',
    avatarInfo: {
      name: 'Forge #1',
      role: 'Forge',
    },
  };

  return (
    <MessageBubble
      message={message}
      onReact={(id, emoji) => console.log(`Reacted with ${emoji}`)}
      onReply={(id) => console.log(`Reply to ${id}`)}
    />
  );
}
```

### 2.2 代码消息

```typescript
function CodeMessageExample() {
  const message = {
    id: '2',
    sender: 'avatar' as const,
    type: 'code' as const,
    content: `function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
}

// 使用示例
const total = calculateTotal(cart.items);
console.log(\`总计: $\${total}\`);`,
    timestamp: '5分钟前',
    avatarInfo: {
      name: 'Forge #1',
      role: 'Forge',
    },
    metadata: {
      language: 'typescript',
      codeChanges: {
        additions: 8,
        deletions: 2,
      },
    },
  };

  return <MessageBubble message={message} />;
}
```

### 2.3 文件分析消息

```typescript
function AnalysisMessageExample() {
  const message = {
    id: '3',
    sender: 'avatar' as const,
    type: 'analysis' as const,
    content: '我已完成代码审查,发现以下问题:',
    timestamp: '刚刚',
    avatarInfo: {
      name: 'Vision #1',
      role: 'Vision',
    },
    metadata: {
      fileAnalysis: {
        fileName: 'checkout.ts',
        fileType: 'TypeScript',
        size: 3072,
        language: 'TypeScript',
        linesOfCode: 180,
        analysis: {
          summary: '结账流程实现完整,但缺少错误处理',
          complexity: 'medium',
          quality: 80,
          issues: [
            {
              type: 'warning',
              message: '缺少支付失败的重试逻辑',
              line: 56,
            },
          ],
          suggestions: [
            '添加支付重试机制',
            '增加日志记录',
          ],
          dependencies: ['stripe', 'axios'],
          exports: ['processCheckout', 'validateCart'],
        },
        createdAt: new Date().toISOString(),
      },
    },
  };

  return <MessageBubble message={message} />;
}
```

### 2.4 里程碑消息

```typescript
function MilestoneMessageExample() {
  const message = {
    id: '4',
    sender: 'avatar' as const,
    type: 'milestone' as const,
    content: '单元测试已完成',
    timestamp: '10分钟前',
    avatarInfo: {
      name: 'Forge #1',
      role: 'Forge',
    },
    metadata: {
      milestone: '单元测试',
      progress: 85,
      testCoverage: 92,
    },
  };

  return <MessageBubble message={message} />;
}
```

### 2.5 警告消息

```typescript
function WarningMessageExample() {
  const message = {
    id: '5',
    sender: 'avatar' as const,
    type: 'text' as const,
    content: '⚠️ 发现安全漏洞:SQL注入风险。建议立即使用参数化查询替换字符串拼接。',
    timestamp: '刚刚',
    avatarInfo: {
      name: 'Vision #1',
      role: 'Vision',
    },
    metadata: {
      type: 'warning',
      action: 'review_required',
    },
  };

  return <MessageBubble message={message} />;
}
```

---

## ⏳ 3. 加载状态组件示例

### 3.1 加载中状态

```typescript
import { Spinner, SkeletonMessage, TypingIndicator } from '@/components/ui/LoadingStates';

function LoadingExample() {
  return (
    <div className="space-y-4">
      {/* 简单旋转器 */}
      <Spinner size="md" />

      {/* 消息骨架屏 */}
      <SkeletonMessage />
      <SkeletonMessage isUser />

      {/* 输入中指示器 */}
      <TypingIndicator name="Forge #1" />
    </div>
  );
}
```

### 3.2 空状态

```typescript
import { EmptyState } from '@/components/ui/LoadingStates';
import { Button } from '@/components/ui/Button';

function EmptyConversationsExample() {
  return (
    <EmptyState
      icon="💬"
      title="暂无对话"
      description="开始与你的 Avatar 团队对话,开启高效协作之旅"
      action={
        <Button onClick={() => console.log('新建对话')}>
          新建对话
        </Button>
      }
    />
  );
}
```

### 3.3 错误状态

```typescript
import { ErrorState } from '@/components/ui/LoadingStates';

function ErrorExample() {
  return (
    <ErrorState
      title="加载失败"
      description="网络连接出现问题,请检查网络设置后重试"
      onRetry={() => {
        console.log('重新加载');
        // 重新获取数据
      }}
    />
  );
}
```

---

## 🎤 4. 多模态输入组件示例

```typescript
import { MultimodalInput } from '@/components/ui/MultimodalInput';
import { showToast } from '@/components/ui/Toast';

function ChatInputExample() {
  const handleSend = (content: string, attachments?: File[]) => {
    console.log('发送消息:', content);
    console.log('附件:', attachments);

    // 处理消息发送
    if (attachments && attachments.length > 0) {
      showToast.info(`正在上传 ${attachments.length} 个文件...`);
    }

    showToast.success('消息已发送');
  };

  return (
    <MultimodalInput
      onSend={handleSend}
      placeholder="输入消息或上传文件..."
      enableVoice={true}
      enableCamera={true}
      enableFiles={true}
    />
  );
}
```

---

## 🔔 5. Toast 通知示例

```typescript
import { showToast } from '@/components/ui/Toast';

function ToastExamples() {
  const handleSuccess = () => {
    showToast.success('操作成功!');
  };

  const handleError = () => {
    showToast.error('操作失败,请重试');
  };

  const handleWarning = () => {
    showToast.warning('注意:即将达到配额限制');
  };

  const handleInfo = () => {
    showToast.info('有新的系统更新可用');
  };

  const handleWithAction = () => {
    showToast.withAction(
      'info',
      'Forge #1 需要你的审核',
      {
        label: '查看',
        handler: () => {
          console.log('跳转到审核页面');
        },
      },
      5000 // 5秒后自动消失
    );
  };

  return (
    <div className="space-x-2">
      <button onClick={handleSuccess}>成功</button>
      <button onClick={handleError}>错误</button>
      <button onClick={handleWarning}>警告</button>
      <button onClick={handleInfo}>信息</button>
      <button onClick={handleWithAction}>带操作</button>
    </div>
  );
}
```

---

## 📱 6. 完整对话页面示例

```typescript
'use client';

import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { MessageBubble, MessageData } from '@/components/features/MessageBubble';
import { MultimodalInput } from '@/components/ui/MultimodalInput';
import { TypingIndicator, EmptyState } from '@/components/ui/LoadingStates';
import { showToast } from '@/components/ui/Toast';

export default function ConversationExample() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 自动滚动到底部
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string, attachments?: File[]) => {
    // 添加用户消息
    const userMessage: MessageData = {
      id: Date.now().toString(),
      sender: 'user',
      type: 'text',
      content,
      timestamp: '刚刚',
    };
    setMessages(prev => [...prev, userMessage]);

    // 模拟 Avatar 回复
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const avatarMessage: MessageData = {
        id: (Date.now() + 1).toString(),
        sender: 'avatar',
        type: 'text',
        content: '我收到了你的消息,正在处理...',
        timestamp: '刚刚',
        avatarInfo: {
          name: 'Forge #1',
          role: 'Forge',
        },
      };
      setMessages(prev => [...prev, avatarMessage]);
      showToast.success('消息已发送');
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* 消息区域 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-4 max-w-3xl mx-auto">
            {messages.length === 0 ? (
              <EmptyState
                icon="💬"
                title="开始对话"
                description="向 Avatar 发送消息开始协作"
              />
            ) : (
              <>
                {messages.map(message => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                {isTyping && <TypingIndicator name="Forge #1" />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* 输入区域 */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <MultimodalInput
            onSend={handleSendMessage}
            placeholder="输入消息..."
            disabled={isTyping}
          />
        </div>
      </div>
    </MainLayout>
  );
}
```

---

## 🎨 7. 样式自定义示例

### 自定义消息气泡颜色

```typescript
// 在你的 CSS 或 Tailwind 配置中
const customMessage = {
  ...message,
  metadata: {
    ...message.metadata,
    type: 'warning', // 使用警告色
  },
};

// 组件会自动应用对应的颜色
<MessageBubble message={customMessage} />
```

### 自定义加载动画

```typescript
// 使用自定义颜色的 Spinner
<Spinner
  size="lg"
  color="var(--color-hitl-wave)" // 使用 HITL 绿色
/>
```

---

## 🔧 8. 高级用法

### 消息分组(按日期)

```typescript
function groupMessagesByDate(messages: MessageData[]) {
  const groups: { [date: string]: MessageData[] } = {};

  messages.forEach(msg => {
    const date = new Date(msg.timestamp).toLocaleDateString('zh-CN');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(msg);
  });

  return groups;
}

function MessageListWithDates() {
  const groupedMessages = groupMessagesByDate(messages);

  return (
    <div className="space-y-6">
      {Object.entries(groupedMessages).map(([date, msgs]) => (
        <div key={date}>
          <div className="text-center text-sm text-muted mb-4">
            {date}
          </div>
          <div className="space-y-4">
            {msgs.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 消息搜索高亮

```typescript
function highlightSearchTerm(content: string, searchTerm: string) {
  if (!searchTerm) return content;

  const regex = new RegExp(`(${searchTerm})`, 'gi');
  return content.replace(regex, '<mark>$1</mark>');
}

// 在消息内容中使用
<div dangerouslySetInnerHTML={{
  __html: highlightSearchTerm(message.content, searchQuery)
}} />
```

---

## 📚 更多示例

查看实际运行的示例:
- 对话页面: `/conversations`
- 任务会话: `/tasks/[id]`
- 项目详情: `/projects/[id]`

---

**提示**: 所有组件都支持 TypeScript,IDE 会提供完整的类型提示和自动补全。
