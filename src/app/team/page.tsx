'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'owner' | 'admin' | 'member';
  department: string;
  joinedAt: string;
  lastActive: string;
  status: 'online' | 'offline' | 'away';
  stats: {
    projectsCount: number;
    tasksCompleted: number;
    avatarsUsed: number;
  };
}

interface Invitation {
  id: string;
  email: string;
  role: 'admin' | 'member';
  sentAt: string;
  status: 'pending' | 'accepted' | 'expired';
}

interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
  details: string;
}

export default function TeamPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'members' | 'invitations' | 'activity'>('members');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin' | 'member'>('member');

  const [members, setMembers] = useState<TeamMember[]>([
    {
      id: 'user-001',
      name: '张伟',
      email: 'zhangwei@company.com',
      avatar: '/avatars/user1.png',
      role: 'owner',
      department: '技术部',
      joinedAt: '2025-01-15',
      lastActive: '2025-10-27T10:30:00',
      status: 'online',
      stats: {
        projectsCount: 12,
        tasksCompleted: 145,
        avatarsUsed: 5,
      },
    },
    {
      id: 'user-002',
      name: '李娜',
      email: 'lina@company.com',
      avatar: '/avatars/user2.png',
      role: 'admin',
      department: '产品部',
      joinedAt: '2025-02-01',
      lastActive: '2025-10-27T09:15:00',
      status: 'online',
      stats: {
        projectsCount: 8,
        tasksCompleted: 98,
        avatarsUsed: 3,
      },
    },
    {
      id: 'user-003',
      name: '王强',
      email: 'wangqiang@company.com',
      avatar: '/avatars/user3.png',
      role: 'member',
      department: '设计部',
      joinedAt: '2025-03-10',
      lastActive: '2025-10-26T16:45:00',
      status: 'offline',
      stats: {
        projectsCount: 6,
        tasksCompleted: 72,
        avatarsUsed: 2,
      },
    },
    {
      id: 'user-004',
      name: '刘芳',
      email: 'liufang@company.com',
      avatar: '/avatars/user4.png',
      role: 'member',
      department: '技术部',
      joinedAt: '2025-04-05',
      lastActive: '2025-10-27T08:20:00',
      status: 'away',
      stats: {
        projectsCount: 5,
        tasksCompleted: 56,
        avatarsUsed: 2,
      },
    },
  ]);

  const [invitations, setInvitations] = useState<Invitation[]>([
    {
      id: 'inv-001',
      email: 'newuser@company.com',
      role: 'member',
      sentAt: '2025-10-25',
      status: 'pending',
    },
    {
      id: 'inv-002',
      email: 'developer@company.com',
      role: 'admin',
      sentAt: '2025-10-20',
      status: 'pending',
    },
  ]);

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([
    {
      id: 'log-001',
      userId: 'user-002',
      userName: '李娜',
      action: '创建项目',
      timestamp: '2025-10-27T10:15:00',
      details: '创建了新项目"移动应用开发"',
    },
    {
      id: 'log-002',
      userId: 'user-003',
      userName: '王强',
      action: '完成任务',
      timestamp: '2025-10-27T09:30:00',
      details: '完成了任务"设计系统优化"',
    },
    {
      id: 'log-003',
      userId: 'user-004',
      userName: '刘芳',
      action: '配置 Avatar',
      timestamp: '2025-10-27T08:45:00',
      details: '为项目配置了 CodeMaster Pro',
    },
    {
      id: 'log-004',
      userId: 'user-001',
      userName: '张伟',
      action: '邀请成员',
      timestamp: '2025-10-25T14:20:00',
      details: '邀请了 newuser@company.com 加入团队',
    },
  ]);

  const getRoleBadgeVariant = (role: TeamMember['role']) => {
    const variants = {
      owner: 'default' as const,
      admin: 'success' as const,
      member: 'default' as const,
    };
    return variants[role];
  };

  const getRoleLabel = (role: TeamMember['role'] | Invitation['role']) => {
    const labels = {
      owner: '所有者',
      admin: '管理员',
      member: '成员',
    };
    return labels[role];
  };

  const getStatusColor = (status: TeamMember['status']) => {
    const colors = {
      online: 'var(--color-success)',
      offline: 'var(--color-text-muted)',
      away: 'var(--color-warning)',
    };
    return colors[status];
  };

  const getStatusLabel = (status: TeamMember['status']) => {
    const labels = {
      online: '在线',
      offline: '离线',
      away: '离开',
    };
    return labels[status];
  };

  const handleInvite = () => {
    if (!inviteEmail) return;

    const newInvitation: Invitation = {
      id: `inv-${Date.now()}`,
      email: inviteEmail,
      role: inviteRole,
      sentAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };

    setInvitations([newInvitation, ...invitations]);
    setShowInviteDialog(false);
    setInviteEmail('');
    setInviteRole('member');
  };

  const handleResendInvite = (invitationId: string) => {
    console.log('Resending invitation:', invitationId);
    // Update invitation status
  };

  const handleCancelInvite = (invitationId: string) => {
    setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
  };

  const handleRemoveMember = (memberId: string) => {
    setMembers(prev => prev.filter(member => member.id !== memberId));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 60) return `${minutes}分钟前`;
    if (hours < 24) return `${hours}小时前`;
    return formatDate(dateString);
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              style={{
                fontSize: 'var(--font-size-h1)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              团队管理
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)',
              }}
            >
              管理团队成员、权限和活动日志
            </p>
          </div>
          <Button onClick={() => setShowInviteDialog(true)}>
            邀请成员
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                总成员数
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {members.length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                在线成员
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {members.filter(m => m.status === 'online').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                待处理邀请
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {invitations.filter(i => i.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                活跃项目
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {members.reduce((sum, m) => sum + m.stats.projectsCount, 0)}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
          {[
            { key: 'members' as const, label: '团队成员', count: members.length },
            { key: 'invitations' as const, label: '邀请管理', count: invitations.length },
            { key: 'activity' as const, label: '活动日志' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="pb-3 px-4 transition-colors flex items-center gap-2"
              style={{
                fontSize: 'var(--font-size-body)',
                fontWeight: activeTab === tab.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                color: activeTab === tab.key ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === tab.key ? '2px solid var(--color-brand-primary)' : 'none',
              }}
            >
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className="px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: activeTab === tab.key ? 'var(--color-brand-primary)' : 'var(--color-surface)',
                    color: activeTab === tab.key ? 'white' : 'var(--color-text-secondary)',
                    fontSize: '11px',
                    fontWeight: 'var(--font-weight-medium)',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="space-y-4">
            {members.map((member) => (
              <Card key={member.id}>
                <CardContent style={{ padding: 'var(--spacing-lg)' }}>
                  <div className="flex items-start gap-6">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      <div
                        className="rounded-full relative"
                        style={{
                          width: '64px',
                          height: '64px',
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        <div
                          className="absolute bottom-0 right-0 rounded-full border-2"
                          style={{
                            width: '16px',
                            height: '16px',
                            backgroundColor: getStatusColor(member.status),
                            borderColor: 'var(--color-surface)',
                          }}
                        />
                      </div>
                    </div>

                    {/* Member Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3
                            style={{
                              fontSize: 'var(--font-size-h3)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)',
                              marginBottom: '4px',
                            }}
                          >
                            {member.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant={getRoleBadgeVariant(member.role)}>
                              {getRoleLabel(member.role)}
                            </Badge>
                            <span
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                color: 'var(--color-text-secondary)',
                              }}
                            >
                              {member.department}
                            </span>
                            <span
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                color: getStatusColor(member.status),
                              }}
                            >
                              • {getStatusLabel(member.status)}
                            </span>
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            {member.email}
                          </div>
                        </div>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-4 gap-4 mb-4">
                        <div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                              marginBottom: '2px',
                            }}
                          >
                            参与项目
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {member.stats.projectsCount}
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                              marginBottom: '2px',
                            }}
                          >
                            完成任务
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {member.stats.tasksCompleted}
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                              marginBottom: '2px',
                            }}
                          >
                            使用 Avatar
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {member.stats.avatarsUsed}
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                              marginBottom: '2px',
                            }}
                          >
                            最后活跃
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {formatTime(member.lastActive)}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      {member.role !== 'owner' && (
                        <div className="flex items-center gap-3">
                          <Button variant="outline" size="sm">
                            编辑权限
                          </Button>
                          <Button variant="ghost" size="sm">
                            查看详情
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveMember(member.id)}
                            style={{ color: 'var(--color-error)' }}
                          >
                            移除
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Invitations Tab */}
        {activeTab === 'invitations' && (
          <div className="space-y-4">
            {invitations.length === 0 ? (
              <Card>
                <CardContent style={{ padding: 'var(--spacing-xxl)', textAlign: 'center' }}>
                  <div
                    style={{
                      fontSize: 'var(--font-size-body)',
                      color: 'var(--color-text-secondary)',
                      marginBottom: 'var(--spacing-lg)',
                    }}
                  >
                    暂无待处理的邀请
                  </div>
                  <Button onClick={() => setShowInviteDialog(true)}>
                    邀请新成员
                  </Button>
                </CardContent>
              </Card>
            ) : (
              invitations.map((invitation) => (
                <Card key={invitation.id}>
                  <CardContent style={{ padding: 'var(--spacing-lg)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-body)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                            marginBottom: '4px',
                          }}
                        >
                          {invitation.email}
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant={invitation.role === 'admin' ? 'success' : 'default'}>
                            {getRoleLabel(invitation.role)}
                          </Badge>
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            发送于 {formatDate(invitation.sentAt)}
                          </span>
                          {invitation.status === 'pending' && (
                            <Badge variant="warning">待接受</Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleResendInvite(invitation.id)}
                        >
                          重新发送
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvite(invitation.id)}
                          style={{ color: 'var(--color-error)' }}
                        >
                          取消邀请
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <Card>
            <CardHeader>
              <CardTitle>最近活动</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activityLogs.map((log) => (
                  <div
                    key={log.id}
                    className="flex items-start gap-4 pb-4"
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                    }}
                  >
                    <div
                      className="rounded-full flex-shrink-0"
                      style={{
                        width: '40px',
                        height: '40px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <div>
                          <span
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-medium)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {log.userName}
                          </span>
                          <span
                            style={{
                              fontSize: 'var(--font-size-body)',
                              color: 'var(--color-text-secondary)',
                              marginLeft: 'var(--spacing-xs)',
                            }}
                          >
                            {log.action}
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-muted)',
                          }}
                        >
                          {formatTime(log.timestamp)}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                        }}
                      >
                        {log.details}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Invite Dialog */}
        {showInviteDialog && (
          <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }}
            onClick={() => setShowInviteDialog(false)}
          >
            <div
              className="rounded-[16px] p-6 max-w-md w-full"
              style={{
                backgroundColor: 'var(--color-surface)',
                boxShadow: 'var(--shadow-xl)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3
                style={{
                  fontSize: 'var(--font-size-h3)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-lg)',
                }}
              >
                邀请新成员
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      display: 'block',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    邮箱地址
                  </label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    placeholder="member@company.com"
                    className="w-full px-4 py-2 rounded-[8px]"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-body)',
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      fontWeight: 'var(--font-weight-medium)',
                      color: 'var(--color-text-primary)',
                      display: 'block',
                      marginBottom: 'var(--spacing-xs)',
                    }}
                  >
                    角色权限
                  </label>
                  <select
                    value={inviteRole}
                    onChange={(e) => setInviteRole(e.target.value as 'admin' | 'member')}
                    className="w-full px-4 py-2 rounded-[8px]"
                    style={{
                      backgroundColor: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-body)',
                    }}
                  >
                    <option value="member">成员 - 可以参与项目和使用 Avatar</option>
                    <option value="admin">管理员 - 可以管理团队和项目设置</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
                  取消
                </Button>
                <Button onClick={handleInvite} disabled={!inviteEmail}>
                  发送邀请
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
