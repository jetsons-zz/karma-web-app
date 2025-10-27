'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { MultimodalInput } from '@/components/ui/MultimodalInput';
import { HapticFeedback } from '@/lib/utils/haptics';

// Mock data - will be replaced with real data
const mockTask = {
  id: 'task-1',
  title: '支付集成功能',
  status: 'in_progress',
  progress: 75,
  avatar: {
    id: 'forge-1',
    name: 'FORGE #1',
    role: 'Forge',
  },
  project: {
    id: 'proj-1',
    name: '主产品开发',
  },
  branch: 'feature/payment-integration',
  startTime: '2025-10-22 15:30',
  messages: [
    {
      id: '1',
      sender: 'user',
      content: '实现支付集成功能，包括Stripe API集成',
      timestamp: '2025-10-22 15:30',
    },
    {
      id: '2',
      sender: 'avatar',
      content: '好的，我开始分析需求...',
      timestamp: '2025-10-22 15:31',
    },
    {
      id: '3',
      sender: 'avatar',
      content: '已完成需求分析，开始架构设计',
      timestamp: '2025-10-22 16:00',
      metadata: {
        milestone: '需求分析',
        progress: 20,
      },
    },
    {
      id: '4',
      sender: 'avatar',
      content: '架构设计完成，开始代码实现',
      timestamp: '2025-10-22 17:00',
      metadata: {
        milestone: '架构设计',
        progress: 40,
      },
    },
    {
      id: '5',
      sender: 'avatar',
      content: '代码实现完成，已添加450行代码',
      timestamp: '2025-10-23 08:00',
      metadata: {
        milestone: '代码实现',
        progress: 60,
        codeChanges: {
          additions: 450,
          deletions: 20,
        },
      },
    },
    {
      id: '6',
      sender: 'avatar',
      content: '单元测试完成，覆盖率95%',
      timestamp: '2025-10-23 09:00',
      metadata: {
        milestone: '单元测试',
        progress: 75,
        testCoverage: 95,
      },
    },
    {
      id: '7',
      sender: 'avatar',
      content: '⚠️ 发现一个安全问题：支付密钥直接写在代码中，建议移到环境变量',
      timestamp: '2025-10-23 09:30',
      metadata: {
        type: 'warning',
        action: 'review_required',
      },
    },
  ],
};

export default function TaskSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [messages, setMessages] = useState(mockTask.messages);

  const handleSendMessage = (content: string, attachments?: File[]) => {
    HapticFeedback.light();

    const newMessage = {
      id: `${messages.length + 1}`,
      sender: 'user',
      content,
      timestamp: new Date().toLocaleString('zh-CN'),
      attachments: attachments?.map((f) => f.name),
    };

    setMessages([...messages, newMessage]);

    // Simulate avatar response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: `${prev.length + 1}`,
          sender: 'avatar',
          content: '我已收到你的消息，正在处理...',
          timestamp: new Date().toLocaleString('zh-CN'),
        },
      ]);
    }, 1000);
  };

  const handleApprove = () => {
    HapticFeedback.success();
    alert('任务已批准！');
  };

  const handleRequestChanges = () => {
    HapticFeedback.warning();
    alert('已请求修改');
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Task Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <button
                    onClick={() => {
                      HapticFeedback.light();
                      router.back();
                    }}
                    style={{
                      color: 'var(--color-text-secondary)',
                      fontSize: 'var(--font-size-h3)',
                    }}
                    aria-label="Go back"
                  >
                    ←
                  </button>
                  <CardTitle>{mockTask.title}</CardTitle>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <Avatar
                    name={mockTask.avatar.name}
                    size="sm"
                    role={mockTask.avatar.role as any}
                    showRole
                  />
                  <Badge variant="outline">
                    {mockTask.project.name}
                  </Badge>
                  <Badge variant="neutral">
                    {mockTask.branch}
                  </Badge>
                  <span
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    开始于 {mockTask.startTime}
                  </span>
                </div>
              </div>

              <button
                className="p-2"
                style={{ color: 'var(--color-text-secondary)' }}
                aria-label="More options"
              >
                ⋯
              </button>
            </div>
          </CardHeader>

          <CardContent>
            {/* Progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    fontWeight: 'var(--font-weight-medium)',
                    color: 'var(--color-text-primary)',
                  }}
                >
                  任务进度
                </span>
                <span
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  {mockTask.progress}%
                </span>
              </div>
              <Progress value={mockTask.progress} status="success" />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant="primary"
                onClick={handleApprove}
              >
                批准合并
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleRequestChanges}
              >
                请求修改
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  HapticFeedback.light();
                  alert('查看代码变更');
                }}
              >
                查看代码
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  HapticFeedback.light();
                  alert('运行测试');
                }}
              >
                运行测试
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Task = Session: Message Stream */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>任务会话</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[600px] overflow-y-auto mb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="flex gap-3"
                  style={{
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  {/* Avatar */}
                  {message.sender === 'avatar' && (
                    <Avatar
                      name={mockTask.avatar.name}
                      size="sm"
                      role={mockTask.avatar.role as any}
                    />
                  )}

                  {/* Message Content */}
                  <div
                    className="flex-1 max-w-[80%]"
                    style={{
                      textAlign: message.sender === 'user' ? 'right' : 'left',
                    }}
                  >
                    {/* Timestamp and Sender */}
                    <div
                      className="mb-1"
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-muted)',
                      }}
                    >
                      {message.sender === 'user' ? '你' : mockTask.avatar.name}{' '}
                      · {message.timestamp}
                    </div>

                    {/* Message Bubble */}
                    <div
                      className="p-3 rounded-xl inline-block"
                      style={{
                        backgroundColor:
                          message.sender === 'user'
                            ? 'var(--color-brand-primary)'
                            : 'var(--color-bg-elevated)',
                        color:
                          message.sender === 'user'
                            ? '#FFFFFF'
                            : 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-body)',
                      }}
                    >
                      {message.content}

                      {/* Metadata: Milestone Progress */}
                      {message.metadata?.milestone && (
                        <div
                          className="mt-2 pt-2"
                          style={{
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                          }}
                        >
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              opacity: 0.9,
                            }}
                          >
                            ✓ {message.metadata.milestone} 完成
                          </div>
                          {message.metadata.progress && (
                            <Progress
                              value={message.metadata.progress}
                              status="success"
                              size="sm"
                              className="mt-2"
                            />
                          )}
                        </div>
                      )}

                      {/* Metadata: Code Changes */}
                      {message.metadata?.codeChanges && (
                        <div
                          className="mt-2 pt-2"
                          style={{
                            borderTop: '1px solid rgba(255,255,255,0.1)',
                            fontSize: 'var(--font-size-caption)',
                          }}
                        >
                          <span style={{ color: 'var(--color-accent-success)' }}>
                            +{message.metadata.codeChanges.additions}
                          </span>{' '}
                          <span style={{ color: 'var(--color-accent-danger)' }}>
                            -{message.metadata.codeChanges.deletions}
                          </span>
                        </div>
                      )}

                      {/* Metadata: Test Coverage */}
                      {message.metadata?.testCoverage && (
                        <div
                          className="mt-2"
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            opacity: 0.9,
                          }}
                        >
                          测试覆盖率: {message.metadata.testCoverage}%
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Multimodal Input */}
            <MultimodalInput
              onSend={handleSendMessage}
              placeholder={`与 ${mockTask.avatar.name} 对话...`}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
