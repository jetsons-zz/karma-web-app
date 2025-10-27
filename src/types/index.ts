// 用户相关类型
export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'admin';
  createdAt: string;
}

// 项目相关类型
export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'archived';
  members: ProjectMember[];
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  userId: string;
  name: string;
  avatar: string;
  role: 'owner' | 'member';
}

// 任务相关类型
export interface Task {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'completed';
  priority: 'p0' | 'p1' | 'p2' | 'p3';
  assignee?: Avatar;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: string[];
  attachments: Attachment[];
}

// 任务会话消息类型
export interface Message {
  id: string;
  taskId: string;
  sender: 'user' | 'avatar';
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'code' | 'file' | 'system';
  codeLanguage?: string;
  codeDiff?: CodeDiff;
  createdAt: string;
}

export interface CodeDiff {
  before: string;
  after: string;
  language: string;
  fileName?: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  createdAt: string;
}

// AI分身相关类型
export interface Avatar {
  id: string;
  name: string;
  description: string;
  avatar: string;
  skills: string[];
  status: 'idle' | 'working' | 'offline';
  performance: AvatarPerformance;
  abilities: AvatarAbilities;
  earnings: AvatarEarnings;
  createdBy: string;
  isPublic: boolean;
  rating: number;
  reviewCount: number;
  price?: number;
  createdAt: string;
}

export interface AvatarPerformance {
  totalTasks: number;
  completedTasks: number;
  averageTime: number;
  successRate: number;
}

export interface AvatarAbilities {
  coding: number;
  design: number;
  writing: number;
  analysis: number;
  communication: number;
}

export interface AvatarEarnings {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  trend: number[];
}

// 对话相关类型
export interface Conversation {
  id: string;
  type: 'avatar' | 'project' | 'team';
  title: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  participants: string[];
  isPinned: boolean;
  createdAt: string;
}

// 通知相关类型
export interface Notification {
  id: string;
  type: 'task' | 'message' | 'system' | 'earning';
  title: string;
  content: string;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

// 商店分身类型
export interface StoreAvatar extends Avatar {
  price: number;
  category: string;
  tags: string[];
  downloads: number;
  samples: string[];
}

// 布局状态类型
export interface LayoutState {
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  leftSidebarWidth: number;
  rightSidebarWidth: number;
  splitViewEnabled: boolean;
  splitViewRatio: number;
}

// UI状态类型
export interface UIState {
  theme: 'light' | 'dark';
  commandPaletteOpen: boolean;
  currentPage: string;
  selectedProject?: string;
  selectedTask?: string;
}
