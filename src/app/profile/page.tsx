'use client';

import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { mockCurrentUser } from '@/lib/mock/data';

export default function ProfilePage() {
  return (
    <MainLayout>
      <div className="p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">个人中心</h1>
          <p className="text-neutral-600 mt-1">管理你的账户和设置</p>
        </div>

        {/* Profile Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>个人资料</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start space-x-6">
              <div className="flex flex-col items-center">
                <Avatar src={mockCurrentUser.avatar} size="xl" />
                <Button variant="outline" size="sm" className="mt-3">
                  更换头像
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="姓名" defaultValue={mockCurrentUser.name} />
                  <Input label="邮箱" type="email" defaultValue={mockCurrentUser.email} disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    角色
                  </label>
                  <Badge variant="secondary">{mockCurrentUser.role === 'admin' ? '管理员' : '用户'}</Badge>
                </div>
                <div className="flex items-center justify-end space-x-2">
                  <Button variant="outline">取消</Button>
                  <Button>保存更改</Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>账户设置</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-neutral-200">
              <div>
                <div className="font-medium text-neutral-900">通知设置</div>
                <div className="text-sm text-neutral-500">管理你的通知偏好</div>
              </div>
              <Button variant="outline" size="sm">配置</Button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-neutral-200">
              <div>
                <div className="font-medium text-neutral-900">隐私设置</div>
                <div className="text-sm text-neutral-500">控制你的数据和隐私</div>
              </div>
              <Button variant="outline" size="sm">配置</Button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-neutral-200">
              <div>
                <div className="font-medium text-neutral-900">外观设置</div>
                <div className="text-sm text-neutral-500">主题、语言和无障碍设置</div>
              </div>
              <Button variant="outline" size="sm">配置</Button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <div className="font-medium text-neutral-900">数据源连接</div>
                <div className="text-sm text-neutral-500">连接第三方服务</div>
              </div>
              <Button variant="outline" size="sm">管理</Button>
            </div>
          </CardContent>
        </Card>

        {/* Subscription */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>订阅管理</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-neutral-900 mb-1">当前计划: 专业版</div>
                <div className="text-sm text-neutral-500">
                  下次续费日期: 2025-11-24
                </div>
              </div>
              <Button variant="outline">管理订阅</Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <CardTitle className="text-error">危险区域</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-neutral-200">
              <div>
                <div className="font-medium text-neutral-900">注销账户</div>
                <div className="text-sm text-neutral-500">永久删除你的账户和所有数据</div>
              </div>
              <Button variant="danger" size="sm">注销</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
