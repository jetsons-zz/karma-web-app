'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { FileAnalysis, FileAnalysisData } from './FileAnalysis';
import { HapticFeedback } from '@/lib/utils/haptics';

export type MessageType = 'text' | 'code' | 'image' | 'file' | 'milestone' | 'analysis';

export interface MessageData {
  id: string;
  sender: 'user' | 'avatar';
  type: MessageType;
  content: string;
  timestamp: string;
  avatarInfo?: {
    name: string;
    role: string;
  };
  metadata?: {
    // Milestone metadata
    milestone?: string;
    progress?: number;

    // Code metadata
    language?: string;
    codeChanges?: {
      additions: number;
      deletions: number;
    };

    // Image metadata
    imageUrl?: string;
    imageCaption?: string;

    // File metadata
    fileName?: string;
    fileSize?: number;
    fileType?: string;

    // Analysis metadata
    fileAnalysis?: FileAnalysisData;

    // Test metadata
    testCoverage?: number;

    // Warning/Alert
    type?: 'warning' | 'error' | 'info' | 'success';
    action?: 'review_required' | 'approval_needed' | 'info_only';
  };
  attachments?: string[];
  reactions?: {
    emoji: string;
    count: number;
    users: string[];
  }[];
}

interface MessageBubbleProps {
  message: MessageData;
  showAvatar?: boolean;
  onReply?: (messageId: string) => void;
  onReact?: (messageId: string, emoji: string) => void;
}

export function MessageBubble({
  message,
  showAvatar = true,
  onReply,
  onReact,
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [expandedCode, setExpandedCode] = useState(false);

  const isUser = message.sender === 'user';

  const renderContent = () => {
    switch (message.type) {
      case 'code':
        return (
          <div>
            <div
              className="mb-2"
              style={{
                fontSize: 'var(--font-size-caption)',
                color: 'var(--color-text-secondary)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>{message.metadata?.language || 'Code'}</span>
              <button
                onClick={() => {
                  HapticFeedback.light();
                  navigator.clipboard.writeText(message.content);
                  alert('代码已复制');
                }}
                style={{
                  fontSize: '11px',
                  color: 'var(--color-brand-primary)',
                }}
              >
                复制代码
              </button>
            </div>
            <pre
              className="rounded-lg p-3 overflow-x-auto"
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                fontSize: '13px',
                maxHeight: expandedCode ? 'none' : '200px',
                overflowY: expandedCode ? 'visible' : 'auto',
              }}
            >
              <code>{message.content}</code>
            </pre>
            {message.content.split('\n').length > 10 && (
              <button
                onClick={() => setExpandedCode(!expandedCode)}
                className="mt-2 text-sm"
                style={{ color: 'var(--color-brand-primary)' }}
              >
                {expandedCode ? '收起' : '展开全部'}
              </button>
            )}
          </div>
        );

      case 'image':
        return (
          <div>
            {message.content && (
              <p
                className="mb-2"
                style={{
                  fontSize: 'var(--font-size-body)',
                  color: isUser ? '#FFFFFF' : 'var(--color-text-primary)',
                }}
              >
                {message.content}
              </p>
            )}
            {message.metadata?.imageUrl && (
              <div className="rounded-lg overflow-hidden">
                <img
                  src={message.metadata.imageUrl}
                  alt={message.metadata.imageCaption || 'Image'}
                  className="w-full max-w-md"
                  style={{ display: 'block' }}
                />
                {message.metadata.imageCaption && (
                  <p
                    className="mt-2"
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: isUser
                        ? 'rgba(255,255,255,0.8)'
                        : 'var(--color-text-secondary)',
                    }}
                  >
                    {message.metadata.imageCaption}
                  </p>
                )}
              </div>
            )}
          </div>
        );

      case 'file':
        return (
          <div
            className="rounded-lg p-3 flex items-center gap-3"
            style={{
              backgroundColor: isUser
                ? 'rgba(255,255,255,0.1)'
                : 'var(--color-bg-elevated)',
            }}
          >
            <span style={{ fontSize: '32px' }}>📎</span>
            <div className="flex-1">
              <p
                style={{
                  fontSize: 'var(--font-size-body)',
                  fontWeight: 'var(--font-weight-medium)',
                  color: isUser ? '#FFFFFF' : 'var(--color-text-primary)',
                }}
              >
                {message.metadata?.fileName || '文件'}
              </p>
              {message.metadata?.fileSize && (
                <p
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: isUser
                      ? 'rgba(255,255,255,0.7)'
                      : 'var(--color-text-secondary)',
                  }}
                >
                  {(message.metadata.fileSize / 1024).toFixed(1)} KB
                </p>
              )}
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                HapticFeedback.light();
                alert('下载功能待实现');
              }}
            >
              下载
            </Button>
          </div>
        );

      case 'analysis':
        return (
          <div>
            {message.content && (
              <p
                className="mb-3"
                style={{
                  fontSize: 'var(--font-size-body)',
                  color: isUser ? '#FFFFFF' : 'var(--color-text-primary)',
                }}
              >
                {message.content}
              </p>
            )}
            {message.metadata?.fileAnalysis && (
              <FileAnalysis file={message.metadata.fileAnalysis} />
            )}
          </div>
        );

      case 'milestone':
        return (
          <div>
            <p
              style={{
                fontSize: 'var(--font-size-body)',
                color: isUser ? '#FFFFFF' : 'var(--color-text-primary)',
              }}
            >
              {message.content}
            </p>
            {message.metadata?.milestone && (
              <div
                className="mt-3 pt-3"
                style={{
                  borderTop: `1px solid ${
                    isUser ? 'rgba(255,255,255,0.2)' : 'var(--color-border)'
                  }`,
                }}
              >
                <div
                  className="mb-1"
                  style={{
                    fontSize: 'var(--font-size-caption)',
                    color: isUser
                      ? 'rgba(255,255,255,0.9)'
                      : 'var(--color-text-secondary)',
                  }}
                >
                  ✓ {message.metadata.milestone} 完成
                </div>
                {message.metadata.progress !== undefined && (
                  <Progress
                    value={message.metadata.progress}
                    status="success"
                    size="sm"
                    className="mt-2"
                  />
                )}
              </div>
            )}
          </div>
        );

      default:
        return (
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: isUser ? '#FFFFFF' : 'var(--color-text-primary)',
              lineHeight: '1.6',
            }}
          >
            {message.content}
          </p>
        );
    }
  };

  const renderMetadata = () => {
    const { metadata } = message;
    if (!metadata) return null;

    return (
      <>
        {/* Code Changes */}
        {metadata.codeChanges && (
          <div
            className="mt-2 pt-2"
            style={{
              borderTop: `1px solid ${
                isUser ? 'rgba(255,255,255,0.2)' : 'var(--color-border)'
              }`,
              fontSize: 'var(--font-size-caption)',
            }}
          >
            <span style={{ color: 'var(--color-accent-success)' }}>
              +{metadata.codeChanges.additions}
            </span>{' '}
            <span style={{ color: 'var(--color-accent-danger)' }}>
              -{metadata.codeChanges.deletions}
            </span>
          </div>
        )}

        {/* Test Coverage */}
        {metadata.testCoverage !== undefined && (
          <div
            className="mt-2"
            style={{
              fontSize: 'var(--font-size-caption)',
              color: isUser
                ? 'rgba(255,255,255,0.9)'
                : 'var(--color-text-secondary)',
            }}
          >
            测试覆盖率: {metadata.testCoverage}%
          </div>
        )}

        {/* Action Required Badge */}
        {metadata.action && metadata.action !== 'info_only' && (
          <div className="mt-2">
            <Badge
              variant={
                metadata.action === 'review_required' ? 'warning' : 'info'
              }
            >
              {metadata.action === 'review_required' && '需要审核'}
              {metadata.action === 'approval_needed' && '需要批准'}
            </Badge>
          </div>
        )}
      </>
    );
  };

  return (
    <div
      className="flex gap-3"
      style={{
        flexDirection: isUser ? 'row-reverse' : 'row',
      }}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {showAvatar && !isUser && message.avatarInfo && (
        <Avatar
          name={message.avatarInfo.name}
          size="sm"
          role={message.avatarInfo.role as any}
        />
      )}
      {showAvatar && isUser && <Avatar name="You" size="sm" />}

      {/* Message Content */}
      <div
        className="flex-1 max-w-[80%]"
        style={{
          textAlign: isUser ? 'right' : 'left',
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
          {isUser ? '你' : message.avatarInfo?.name || 'Avatar'} ·{' '}
          {message.timestamp}
        </div>

        {/* Message Bubble */}
        <div
          className="p-3 rounded-xl inline-block max-w-full"
          style={{
            backgroundColor: isUser
              ? message.metadata?.type === 'warning'
                ? 'var(--color-accent-warning)'
                : message.metadata?.type === 'error'
                ? 'var(--color-accent-danger)'
                : 'var(--color-brand-primary)'
              : message.metadata?.type === 'warning'
              ? 'rgba(255, 179, 0, 0.1)'
              : message.metadata?.type === 'error'
              ? 'rgba(239, 68, 68, 0.1)'
              : 'var(--color-bg-elevated)',
            color: isUser ? '#FFFFFF' : 'var(--color-text-primary)',
            border: !isUser
              ? `1px solid ${
                  message.metadata?.type === 'warning'
                    ? 'var(--color-accent-warning)'
                    : message.metadata?.type === 'error'
                    ? 'var(--color-accent-danger)'
                    : 'var(--color-border)'
                }`
              : 'none',
          }}
        >
          {renderContent()}
          {renderMetadata()}
        </div>

        {/* Reactions */}
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-1 mt-1">
            {message.reactions.map((reaction, idx) => (
              <button
                key={idx}
                onClick={() => {
                  HapticFeedback.light();
                  onReact?.(message.id, reaction.emoji);
                }}
                className="px-2 py-1 rounded-full text-sm transition-all"
                style={{
                  backgroundColor: 'var(--color-bg-elevated)',
                  border: '1px solid var(--color-border)',
                }}
              >
                {reaction.emoji} {reaction.count}
              </button>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {showActions && (
          <div
            className="flex gap-2 mt-2 transition-opacity"
            style={{
              justifyContent: isUser ? 'flex-end' : 'flex-start',
            }}
          >
            <button
              onClick={() => {
                HapticFeedback.light();
                onReact?.(message.id, '👍');
              }}
              className="text-sm opacity-70 hover:opacity-100"
              title="点赞"
            >
              👍
            </button>
            {onReply && (
              <button
                onClick={() => {
                  HapticFeedback.light();
                  onReply(message.id);
                }}
                className="text-sm opacity-70 hover:opacity-100"
                style={{ color: 'var(--color-text-secondary)' }}
                title="回复"
              >
                回复
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
