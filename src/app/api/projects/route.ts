import { NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/mock/projectStore';

export const runtime = 'nodejs';

/**
 * GET /api/projects
 * 获取所有项目列表
 */
export async function GET() {
  try {
    const projects = getAllProjects();

    return NextResponse.json({
      success: true,
      projects,
      total: projects.length,
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json(
      { error: '获取项目列表失败' },
      { status: 500 }
    );
  }
}
