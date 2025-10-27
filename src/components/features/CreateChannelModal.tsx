'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Toggle } from '@/components/ui/Toggle';
import { showToast } from '@/components/ui/Toast';
import { HapticFeedback } from '@/lib/utils/haptics';
import { createConversation, type MessageParticipant } from '@/lib/mock/messageStore';

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateChannelModal({ isOpen, onClose, onSuccess }: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [projectId, setProjectId] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleCreate = async () => {
    if (!channelName.trim()) {
      showToast.error('请输入频道名称');
      return;
    }

    setIsCreating(true);

    try {
      // 创建频道参与者列表（示例）
      const participants: MessageParticipant[] = [
        {
          id: 'user-1',
          type: 'human',
          name: '你',
          isOnline: true,
        },
      ];

      // 创建频道
      const newChannel = createConversation({
        type: 'channel',
        title: channelName,
        description,
        avatar: '💼',
        participants,
        isPinned: false,
        isMuted: false,
        channelInfo: {
          isPublic,
          projectId: projectId || undefined,
          createdBy: 'user-1',
          memberCount: participants.length,
        },
      });

      showToast.success(`频道 #${channelName} 创建成功！`);
      HapticFeedback.success();

      // 重置表单
      setChannelName('');
      setDescription('');
      setProjectId('');
      setIsPublic(true);

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Failed to create channel:', error);
      showToast.error('创建频道失败');
      HapticFeedback.error();
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{
          backgroundColor: 'var(--color-bg-primary)',
          border: '1px solid var(--color-border)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2
            style={{
              fontSize: 'var(--font-size-h2)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
            }}
          >
            创建新频道
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg transition-all"
            style={{
              color: 'var(--color-text-secondary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--color-bg-elevated)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-size-caption)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              频道名称 *
            </label>
            <Input
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder="例如：主产品开发"
              leftIcon={<span>#</span>}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-size-caption)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              频道描述
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简短描述这个频道的用途"
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: 'var(--font-size-caption)',
                fontWeight: 'var(--font-weight-medium)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              关联项目（可选）
            </label>
            <Input
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              placeholder="输入项目ID"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 'var(--font-size-caption)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                频道类型
              </label>
              <p
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                {isPublic ? '公开 - 所有成员可见' : '私密 - 仅受邀成员可见'}
              </p>
            </div>
            <Toggle
              checked={isPublic}
              onChange={setIsPublic}
              labels={['私密', '公开']}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={isCreating}
          >
            取消
          </Button>
          <Button
            fullWidth
            onClick={handleCreate}
            disabled={!channelName.trim() || isCreating}
          >
            {isCreating ? '创建中...' : '创建频道'}
          </Button>
        </div>
      </div>
    </div>
  );
}
