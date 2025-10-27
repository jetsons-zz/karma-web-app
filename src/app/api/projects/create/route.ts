import { NextRequest, NextResponse } from 'next/server';
import { createProject } from '@/lib/mock/projectStore';

export const runtime = 'nodejs';

interface CreateProjectRequest {
  name: string;
  description: string;
  template: string;
  members: string[];
  autoMode: boolean;
  isPrivate: boolean;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: string;
}

/**
 * POST /api/projects/create
 * 创建新项目
 */
export async function POST(req: NextRequest) {
  try {
    const body: CreateProjectRequest = await req.json();

    // 验证必填字段
    if (!body.name || !body.description) {
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 计算默认的 due date (30天后)
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 30);

    // 使用 projectStore 创建并持久化
    const newProject = createProject({
      name: body.name,
      description: body.description,
      status: 'planning',
      progress: 0,
      members: [
        {
          userId: 'user-1',
          name: '你',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=user-1',
          role: 'owner',
        },
      ],
      priority: body.priority || 'medium',
      dueDate: body.dueDate || defaultDueDate.toISOString(),
      team: body.members,
      tasks: {
        total: 0,
        completed: 0,
        inProgress: 0,
      },
      budget: {
        total: 10000,
        used: 0,
      },
      tags: [body.template],
      template: body.template,
      autoMode: body.autoMode,
      isPrivate: body.isPrivate,
    });

    // 模拟处理延迟
    await new Promise((resolve) => setTimeout(resolve, 500));

    return NextResponse.json({
      success: true,
      project: newProject,
      message: `项目 ${body.name} 创建成功！`,
    });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json(
      { error: '创建项目失败，请重试' },
      { status: 500 }
    );
  }
}
