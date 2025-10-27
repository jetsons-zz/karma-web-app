'use client';

import { useState, useRef } from 'react';
import { useSwipeable } from 'react-swipeable';
import { HapticFeedback } from '@/lib/utils/haptics';
import { Button } from './Button';

interface SwipeableTaskCardProps {
  children: React.ReactNode;
  onDelete?: () => void;
  onEdit?: () => void;
  onComplete?: () => void;
}

/**
 * SwipeableTaskCard - 支持滑动操作的任务卡片容器
 *
 * 滑动手势:
 * - 左滑: 显示删除/编辑按钮
 * - 右滑: 快速标记为完成
 *
 * Features:
 * - 平滑动画
 * - 触觉反馈
 * - 自动回弹
 * - 点击外部关闭
 */
export function SwipeableTaskCard({
  children,
  onDelete,
  onEdit,
  onComplete,
}: SwipeableTaskCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const SWIPE_THRESHOLD = 80; // 触发操作的滑动阈值
  const MAX_SWIPE = 160; // 最大滑动距离

  // 处理左滑 - 显示操作按钮
  const handleSwipeLeft = () => {
    if (!onDelete && !onEdit) return;

    HapticFeedback.light();
    setSwipeOffset(-MAX_SWIPE);
    setIsRevealed(true);
  };

  // 处理右滑 - 快速完成
  const handleSwipeRight = () => {
    if (!onComplete) return;

    HapticFeedback.success();
    setSwipeOffset(MAX_SWIPE);

    // 延迟执行完成操作，显示动画
    setTimeout(() => {
      onComplete();
      resetSwipe();
    }, 300);
  };

  // 重置滑动状态
  const resetSwipe = () => {
    setSwipeOffset(0);
    setIsRevealed(false);
  };

  // 配置 swipeable
  const handlers = useSwipeable({
    onSwiping: (eventData) => {
      const delta = eventData.deltaX;

      // 限制滑动范围
      if (delta < 0 && (onDelete || onEdit)) {
        // 左滑
        const offset = Math.max(-MAX_SWIPE, delta);
        setSwipeOffset(offset);
      } else if (delta > 0 && onComplete) {
        // 右滑
        const offset = Math.min(MAX_SWIPE, delta);
        setSwipeOffset(offset);
      }
    },
    onSwiped: (eventData) => {
      const delta = eventData.deltaX;

      if (delta < -SWIPE_THRESHOLD && (onDelete || onEdit)) {
        handleSwipeLeft();
      } else if (delta > SWIPE_THRESHOLD && onComplete) {
        handleSwipeRight();
      } else {
        resetSwipe();
      }
    },
    trackMouse: false, // 禁用鼠标拖拽（仅触摸）
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  // 处理删除
  const handleDelete = () => {
    if (!onDelete) return;

    HapticFeedback.heavy();
    onDelete();
    resetSwipe();
  };

  // 处理编辑
  const handleEdit = () => {
    if (!onEdit) return;

    HapticFeedback.light();
    onEdit();
    resetSwipe();
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        overflow: 'hidden',
        touchAction: 'pan-y', // 允许垂直滚动，阻止水平滚动
      }}
    >
      {/* 左滑显示的操作按钮 */}
      {(onDelete || onEdit) && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--spacing-xs)',
            paddingRight: 'var(--spacing-md)',
            opacity: isRevealed ? 1 : 0,
            transition: 'opacity 200ms ease-out',
          }}
        >
          {onEdit && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleEdit}
              style={{
                minWidth: '60px',
                backgroundColor: 'var(--color-brand-primary)',
                color: 'white',
              }}
            >
              编辑
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              onClick={handleDelete}
              style={{
                minWidth: '60px',
                backgroundColor: 'var(--color-accent-error)',
                color: 'white',
              }}
            >
              删除
            </Button>
          )}
        </div>
      )}

      {/* 右滑显示的完成指示器 */}
      {onComplete && swipeOffset > 0 && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: `${swipeOffset}px`,
            backgroundColor: 'var(--color-accent-success)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: swipeOffset === MAX_SWIPE ? 'width 200ms ease-out' : 'none',
          }}
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            style={{
              opacity: swipeOffset > SWIPE_THRESHOLD ? 1 : swipeOffset / SWIPE_THRESHOLD,
            }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {/* 主要内容 - 可滑动 */}
      <div
        {...handlers}
        style={{
          position: 'relative',
          transform: `translateX(${swipeOffset}px)`,
          transition: isRevealed || swipeOffset === MAX_SWIPE ? 'transform 200ms ease-out' : 'none',
          backgroundColor: 'var(--color-bg-primary)',
          zIndex: 1,
        }}
        onClick={(e) => {
          // 如果已展开，点击任何地方都关闭
          if (isRevealed) {
            e.stopPropagation();
            resetSwipe();
          }
        }}
      >
        {children}
      </div>
    </div>
  );
}
