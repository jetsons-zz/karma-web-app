import {
  User,
  Project,
  Task,
  Avatar,
  Conversation,
  Message,
  StoreAvatar,
  Notification,
} from '@/types';

// Mock当前用户
export const mockCurrentUser: User = {
  id: 'user-1',
  name: 'Viveka',
  email: 'viveka@karma.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viveka',
  role: 'user',
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
};

// Mock AI分身
export const mockAvatars: Avatar[] = [
  {
    id: 'avatar-1',
    name: 'FORGE #1',
    description: '全栈开发专家，擅长React、Node.js和数据库设计',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=forge1',
    skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
    status: 'working',
    performance: {
      totalTasks: 127,
      completedTasks: 120,
      averageTime: 3.2,
      successRate: 94.5,
    },
    abilities: {
      coding: 95,
      design: 60,
      writing: 70,
      analysis: 85,
      communication: 75,
    },
    earnings: {
      today: 127,
      thisWeek: 856,
      thisMonth: 3420,
      total: 12567,
      trend: [120, 150, 180, 200, 190, 210, 127],
    },
    createdBy: 'user-1',
    isPublic: false,
    rating: 4.8,
    reviewCount: 24,
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'avatar-2',
    name: 'FORGE #2',
    description: '后端架构师，专注于高性能系统设计',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=forge2',
    skills: ['Go', 'Kubernetes', 'Redis', 'MongoDB', 'gRPC'],
    status: 'idle',
    performance: {
      totalTasks: 85,
      completedTasks: 82,
      averageTime: 4.1,
      successRate: 96.5,
    },
    abilities: {
      coding: 92,
      design: 55,
      writing: 65,
      analysis: 90,
      communication: 70,
    },
    earnings: {
      today: 0,
      thisWeek: 623,
      thisMonth: 2890,
      total: 8934,
      trend: [100, 120, 110, 150, 140, 160, 0],
    },
    createdBy: 'user-1',
    isPublic: false,
    rating: 4.9,
    reviewCount: 18,
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'avatar-3',
    name: 'VISION',
    description: 'UI/UX设计师，精通Figma和前端实现',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vision',
    skills: ['Figma', 'CSS', 'Animation', 'Design System', 'Tailwind'],
    status: 'working',
    performance: {
      totalTasks: 64,
      completedTasks: 60,
      averageTime: 2.8,
      successRate: 93.8,
    },
    abilities: {
      coding: 75,
      design: 98,
      writing: 80,
      analysis: 70,
      communication: 85,
    },
    earnings: {
      today: 89,
      thisWeek: 445,
      thisMonth: 1867,
      total: 5632,
      trend: [80, 90, 85, 95, 100, 110, 89],
    },
    createdBy: 'user-1',
    isPublic: true,
    rating: 4.7,
    reviewCount: 32,
    price: 49,
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock项目
export const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Karma Web 开发',
    description: '构建全新的Web端生产力平台',
    progress: 72,
    status: 'active',
    members: [
      {
        userId: 'user-1',
        name: 'Viveka',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viveka',
        role: 'owner',
      },
      {
        userId: 'avatar-1',
        name: 'FORGE #1',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=forge1',
        role: 'member',
      },
      {
        userId: 'avatar-3',
        name: 'VISION',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vision',
        role: 'member',
      },
    ],
    tasks: [],
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'project-2',
    name: '电商平台重构',
    description: '使用现代技术栈重构现有电商系统',
    progress: 45,
    status: 'active',
    members: [
      {
        userId: 'user-1',
        name: 'Viveka',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viveka',
        role: 'owner',
      },
      {
        userId: 'avatar-2',
        name: 'FORGE #2',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=forge2',
        role: 'member',
      },
    ],
    tasks: [],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'project-3',
    name: '移动端App设计',
    description: '设计全新的移动应用界面和交互',
    progress: 88,
    status: 'active',
    members: [
      {
        userId: 'user-1',
        name: 'Viveka',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viveka',
        role: 'owner',
      },
      {
        userId: 'avatar-3',
        name: 'VISION',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vision',
        role: 'member',
      },
    ],
    tasks: [],
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock任务
export const mockTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'project-1',
    title: '实现三列布局系统',
    description: '创建响应式的三列布局，支持拖拽调整宽度',
    status: 'completed',
    priority: 'p0',
    assignee: mockAvatars[0],
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    tags: ['frontend', 'layout', 'react'],
    attachments: [],
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    title: '实现命令面板功能',
    description: '开发类似VS Code的命令面板，支持Fuzzy搜索',
    status: 'in_progress',
    priority: 'p0',
    assignee: mockAvatars[0],
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    tags: ['frontend', 'interaction', 'typescript'],
    attachments: [],
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    title: '优化数据库查询性能',
    description: '分析慢查询并添加适当的索引',
    status: 'review',
    priority: 'p1',
    assignee: mockAvatars[1],
    createdBy: 'user-1',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    tags: ['backend', 'database', 'performance'],
    attachments: [],
  },
];

// Mock对话
export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'avatar',
    title: 'FORGE #1',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=forge1',
    lastMessage: '代码审查已完成，我做了一些优化建议',
    lastMessageTime: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    unreadCount: 2,
    participants: ['user-1', 'avatar-1'],
    isPinned: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv-2',
    type: 'project',
    title: 'Karma Web 开发',
    avatar: '📁',
    lastMessage: '新任务已分配：实现键盘快捷键系统',
    lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    unreadCount: 0,
    participants: ['user-1', 'avatar-1', 'avatar-3'],
    isPinned: true,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'conv-3',
    type: 'avatar',
    title: 'VISION',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=vision',
    lastMessage: '设计稿已更新，请查看',
    lastMessageTime: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    unreadCount: 1,
    participants: ['user-1', 'avatar-3'],
    isPinned: false,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock消息
export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    taskId: 'task-2',
    sender: 'user',
    senderName: 'Viveka',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viveka',
    content: '帮我实现一个命令面板，类似VS Code的Cmd+K功能',
    type: 'text',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-2',
    taskId: 'task-2',
    sender: 'avatar',
    senderName: 'FORGE #1',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=forge1',
    content: '好的！我会实现一个命令面板组件，包含以下功能：\n\n1. Fuzzy搜索所有命令\n2. 最近使用记录\n3. 快捷键提示\n4. 键盘导航\n\n这是实现代码：',
    type: 'text',
    createdAt: new Date(Date.now() - 1.9 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-3',
    taskId: 'task-2',
    sender: 'avatar',
    senderName: 'FORGE #1',
    senderAvatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=forge1',
    content: `'use client';

import { useState, useEffect } from 'react';
import { Command } from 'cmdk';

export function CommandPalette() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <Command.Dialog open={open} onOpenChange={setOpen}>
      <Command.Input placeholder="输入命令或搜索..." />
      <Command.List>
        <Command.Empty>未找到结果</Command.Empty>

        <Command.Group heading="最近使用">
          <Command.Item>打开项目</Command.Item>
          <Command.Item>新建任务</Command.Item>
        </Command.Group>

        <Command.Group heading="快速操作">
          <Command.Item>新建项目</Command.Item>
          <Command.Item>切换主题</Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Dialog>
  );
}`,
    type: 'code',
    codeLanguage: 'typescript',
    createdAt: new Date(Date.now() - 1.8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'msg-4',
    taskId: 'task-2',
    sender: 'user',
    senderName: 'Viveka',
    senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Viveka',
    content: '很好！请添加样式和动画效果',
    type: 'text',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock商店分身
export const mockStoreAvatars: StoreAvatar[] = [
  {
    ...mockAvatars[2],
    price: 49,
    category: 'Design',
    tags: ['UI/UX', 'Figma', 'Frontend'],
    downloads: 247,
    samples: [
      'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=400',
      'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400',
    ],
  },
  {
    id: 'store-avatar-1',
    name: '代码审查专家',
    description: '专业的代码审查分身，帮助提升代码质量',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=reviewer',
    skills: ['Code Review', 'Best Practices', 'Security', 'Performance'],
    status: 'idle',
    performance: {
      totalTasks: 520,
      completedTasks: 512,
      averageTime: 1.5,
      successRate: 98.5,
    },
    abilities: {
      coding: 88,
      design: 50,
      writing: 85,
      analysis: 95,
      communication: 80,
    },
    earnings: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      total: 0,
      trend: [],
    },
    createdBy: 'other-user',
    isPublic: true,
    rating: 4.9,
    reviewCount: 156,
    price: 39,
    category: 'Development',
    tags: ['Code Quality', 'Security', 'Best Practices'],
    downloads: 1247,
    samples: [],
    createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'store-avatar-2',
    name: '全栈工程师',
    description: '精通前后端开发的全能型分身',
    avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=fullstack',
    skills: ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker'],
    status: 'idle',
    performance: {
      totalTasks: 384,
      completedTasks: 375,
      averageTime: 4.2,
      successRate: 97.7,
    },
    abilities: {
      coding: 93,
      design: 65,
      writing: 70,
      analysis: 82,
      communication: 75,
    },
    earnings: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      total: 0,
      trend: [],
    },
    createdBy: 'other-user',
    isPublic: true,
    rating: 4.8,
    reviewCount: 89,
    price: 59,
    category: 'Development',
    tags: ['Full Stack', 'React', 'Node.js'],
    downloads: 856,
    samples: [],
    createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock通知
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'task',
    title: '任务已完成',
    content: 'FORGE #1 已完成任务"实现三列布局系统"',
    isRead: false,
    link: '/projects/project-1/tasks/task-1',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    type: 'earning',
    title: '收益到账',
    content: '您的分身VISION获得了$89收益',
    isRead: false,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    type: 'message',
    title: '新消息',
    content: 'FORGE #1 给您发送了一条消息',
    isRead: true,
    link: '/conversations/conv-1',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
];
