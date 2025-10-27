/**
 * Mock Project Data Store
 * 使用 localStorage 持久化 Project 数据
 */

import { mockProjects } from './data';

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'planning' | 'in-progress' | 'review' | 'completed' | 'on-hold';
  progress: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: string;
  team: string[];
  tasks: {
    total: number;
    completed: number;
    inProgress: number;
  };
  budget?: {
    total: number;
    used: number;
  };
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  template?: string;
  autoMode?: boolean;
  isPrivate?: boolean;
}

const STORAGE_KEY = 'karma_projects';

/**
 * 初始化存储
 */
function initStorage(): Project[] {
  if (typeof window === 'undefined') {
    return mockProjects;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }

    // 首次访问，使用 mock 数据初始化
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockProjects));
    return mockProjects;
  } catch (error) {
    console.error('Failed to init project storage:', error);
    return mockProjects;
  }
}

/**
 * 保存到存储
 */
function saveToStorage(projects: Project[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Failed to save projects:', error);
  }
}

/**
 * 获取所有 Projects
 */
export function getAllProjects(): Project[] {
  return initStorage();
}

/**
 * 根据ID获取单个 Project
 */
export function getProjectById(id: string): Project | undefined {
  const projects = getAllProjects();
  return projects.find(p => p.id === id);
}

/**
 * 创建新 Project
 */
export function createProject(projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
  const projects = getAllProjects();

  const newProject: Project = {
    ...projectData,
    id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updatedProjects = [...projects, newProject];
  saveToStorage(updatedProjects);

  return newProject;
}

/**
 * 更新 Project
 */
export function updateProject(id: string, updates: Partial<Project>): Project | undefined {
  const projects = getAllProjects();
  const index = projects.findIndex(p => p.id === id);

  if (index === -1) {
    return undefined;
  }

  const updatedProject: Project = {
    ...projects[index],
    ...updates,
    id: projects[index].id, // 确保 ID 不被修改
    updatedAt: new Date().toISOString(),
  };

  projects[index] = updatedProject;
  saveToStorage(projects);

  return updatedProject;
}

/**
 * 删除 Project
 */
export function deleteProject(id: string): boolean {
  const projects = getAllProjects();
  const filteredProjects = projects.filter(p => p.id !== id);

  if (filteredProjects.length === projects.length) {
    return false; // 没有找到要删除的 Project
  }

  saveToStorage(filteredProjects);
  return true;
}

/**
 * 根据状态筛选项目
 */
export function getProjectsByStatus(status: Project['status']): Project[] {
  return getAllProjects().filter(p => p.status === status);
}

/**
 * 根据优先级筛选项目
 */
export function getProjectsByPriority(priority: Project['priority']): Project[] {
  return getAllProjects().filter(p => p.priority === priority);
}

/**
 * 搜索项目
 */
export function searchProjects(query: string): Project[] {
  const lowerQuery = query.toLowerCase();
  return getAllProjects().filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * 重置为默认 Mock 数据
 */
export function resetToMockData(): void {
  saveToStorage(mockProjects);
}

/**
 * 清空所有数据
 */
export function clearAllProjects(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
}
