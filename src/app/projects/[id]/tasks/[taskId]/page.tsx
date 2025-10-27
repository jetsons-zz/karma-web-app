'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Textarea } from '@/components/ui/Textarea';
import { mockProjects, mockTasks, mockMessages } from '@/lib/mock/data';
import { formatDate, cn } from '@/lib/utils';
import { chatService } from '@/lib/services/chatService';
import { HapticFeedback } from '@/lib/utils/haptics';
import { showToast } from '@/components/ui/Toast';

// Helper function to map mock status to Avatar component status
const mapStatusToAvatarStatus = (status: string | undefined): 'online' | 'busy' | 'offline' | 'thinking' | undefined => {
  if (!status) return undefined;

  const statusMap: Record<string, 'online' | 'busy' | 'offline' | 'thinking'> = {
    'online': 'online',
    'idle': 'online',
    'working': 'busy',
    'busy': 'busy',
    'offline': 'offline',
    'thinking': 'thinking',
  };

  return statusMap[status] || undefined;
};

export default function TaskSessionPage() {
  const params = useParams();
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockMessages.filter(m => m.taskId === params.taskId));
  const [isTyping, setIsTyping] = useState(false);

  const project = mockProjects.find(p => p.id === params.id);
  const task = mockTasks.find(t => t.id === params.taskId);

  if (!project || !task) {
    return <div>Task not found</div>;
  }

  const handleSend = async () => {
    if (!message.trim() || isTyping) return;

    const userMessage = {
      id: `msg-${Date.now()}`,
      taskId: params.taskId as string,
      sender: 'user' as const,
      senderName: '你',
      senderAvatar: '/avatars/user.png',
      type: 'text' as const,
      content: message.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsTyping(true);
    HapticFeedback.light();

    try {
      // 准备对话历史
      const conversationHistory = messages.slice(-5).map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content,
      }));

      // 系统提示
      const systemMessage = {
        role: 'system' as const,
        content: `你是一个专业的 AI 助手，正在帮助用户处理任务"${task.title}"。请提供有针对性的建议和帮助。`,
      };

      // 流式接收响应
      let fullResponse = '';
      const responseId = `msg-${Date.now() + 1}`;

      const avatarMessage = {
        id: responseId,
        taskId: params.taskId as string,
        sender: 'avatar' as const,
        senderName: 'AI 助手',
        senderAvatar: '/avatars/ai.png',
        type: 'text' as const,
        content: '',
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, avatarMessage]);
      setIsTyping(false);

      for await (const chunk of chatService.sendMessageStream([
        systemMessage,
        ...conversationHistory,
        { role: 'user', content: userMessage.content },
      ])) {
        fullResponse += chunk;
        setMessages(prev =>
          prev.map(msg =>
            msg.id === responseId ? { ...msg, content: fullResponse } : msg
          )
        );
      }

      showToast.success('消息已发送');
      HapticFeedback.success();
    } catch (error: any) {
      console.error('Send message error:', error);
      setIsTyping(false);

      const errorMessage = {
        id: `msg-${Date.now() + 2}`,
        taskId: params.taskId as string,
        sender: 'avatar' as const,
        senderName: 'AI 助手',
        senderAvatar: '/avatars/ai.png',
        type: 'text' as const,
        content: `抱歉，发生了错误: ${error.message}。请检查你的 API 配置。`,
        createdAt: new Date().toISOString(),
      };

      setMessages(prev => [...prev, errorMessage]);
      showToast.error('消息发送失败');
      HapticFeedback.error();
    }
  };

  // Right Sidebar - Task Details
  const rightSidebar = (
    <div className="p-6 space-y-6">
      <div>
        <h3 className="font-semibold text-neutral-900 mb-4">任务详情</h3>
        <div className="space-y-3">
          <div>
            <span className="text-sm text-neutral-500">状态</span>
            <div className="mt-1">
              <Badge variant={
                task.status === 'completed' ? 'success' :
                task.status === 'in_progress' ? 'warning' :
                task.status === 'review' ? 'default' : 'secondary'
              }>
                {task.status === 'completed' ? '已完成' :
                 task.status === 'in_progress' ? '进行中' :
                 task.status === 'review' ? '审核中' : '待办'}
              </Badge>
            </div>
          </div>
          <div>
            <span className="text-sm text-neutral-500">优先级</span>
            <div className="mt-1">
              <Badge variant={task.priority === 'p0' ? 'error' : task.priority === 'p1' ? 'warning' : 'secondary'}>
                {task.priority.toUpperCase()}
              </Badge>
            </div>
          </div>
          {task.assignee && (
            <div>
              <span className="text-sm text-neutral-500">分配给</span>
              <div className="mt-2 flex items-center space-x-2">
                <Avatar src={task.assignee.avatar} size="sm" status={mapStatusToAvatarStatus(task.assignee.status)} />
                <span className="text-sm font-medium text-neutral-900">{task.assignee.name}</span>
              </div>
            </div>
          )}
          <div>
            <span className="text-sm text-neutral-500">创建时间</span>
            <div className="mt-1 text-sm text-neutral-900">{formatDate(task.createdAt)}</div>
          </div>
          <div>
            <span className="text-sm text-neutral-500">更新时间</span>
            <div className="mt-1 text-sm text-neutral-900">{formatDate(task.updatedAt)}</div>
          </div>
        </div>
      </div>

      {task.tags.length > 0 && (
        <div className="border-t border-neutral-200 pt-6">
          <h3 className="font-semibold text-neutral-900 mb-3">标签</h3>
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag) => (
              <Badge key={tag} variant="outline">#{tag}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-neutral-200 pt-6">
        <h3 className="font-semibold text-neutral-900 mb-3">附件 ({task.attachments.length})</h3>
        {task.attachments.length === 0 ? (
          <p className="text-sm text-neutral-500">暂无附件</p>
        ) : (
          <div className="space-y-2">
            {task.attachments.map((file) => (
              <div key={file.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-50">
                <div className="flex-1">
                  <div className="text-sm font-medium text-neutral-900">{file.name}</div>
                  <div className="text-xs text-neutral-500">{file.size} KB</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t border-neutral-200 pt-6">
        <Button variant="outline" className="w-full">
          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
          上传附件
        </Button>
      </div>
    </div>
  );

  return (
    <MainLayout rightSidebar={rightSidebar}>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header */}
        <div className="border-b border-neutral-200 p-6">
          <div className="flex items-center text-sm text-neutral-600 mb-2">
            <button onClick={() => router.push('/projects')} className="hover:text-primary-500">
              项目
            </button>
            <span className="mx-2">/</span>
            <button onClick={() => router.push(`/projects/${project.id}`)} className="hover:text-primary-500">
              {project.name}
            </button>
            <span className="mx-2">/</span>
            <span className="text-neutral-900">{task.title}</span>
          </div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-1">任务: {task.title}</h1>
              {task.description && (
                <p className="text-neutral-600">{task.description}</p>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">编辑</Button>
              <Button variant="outline" size="sm">分享</Button>
              <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Messages - Task Session */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-3">
                <Avatar
                  src={msg.sender === 'user' ? msg.senderAvatar : msg.senderAvatar}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-neutral-900">{msg.senderName}</span>
                    <span className="text-xs text-neutral-400">{formatDate(msg.createdAt)}</span>
                  </div>

                  {msg.type === 'text' && (
                    <div className={cn(
                      'rounded-lg p-4 text-sm',
                      msg.sender === 'user'
                        ? 'bg-primary-50 text-neutral-900'
                        : 'bg-neutral-100 text-neutral-900'
                    )}>
                      {msg.content}
                    </div>
                  )}

                  {msg.type === 'code' && (
                    <div className="rounded-lg overflow-hidden border border-neutral-200">
                      <div className="bg-neutral-800 text-neutral-100 px-4 py-2 text-xs flex items-center justify-between">
                        <span>{msg.codeLanguage || 'code'}</span>
                        <button className="text-neutral-400 hover:text-neutral-100">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </button>
                      </div>
                      <pre className="bg-neutral-900 text-neutral-100 p-4 overflow-x-auto text-xs">
                        <code>{msg.content}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-neutral-200 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start space-x-3">
              <Avatar
                src={mockMessages[0]?.senderAvatar}
                size="sm"
              />
              <div className="flex-1">
                <Textarea
                  placeholder="输入消息... (⌘Enter 发送)"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px]"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                      handleSend();
                    }
                  }}
                />
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <button className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </button>
                  </div>
                  <Button onClick={handleSend} disabled={!message.trim() || isTyping}>
                    {isTyping ? '发送中...' : '发送 (⌘Enter)'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
