/**
 * iOS-inspired Gesture Utilities for Web
 * Provides touch gesture support for mobile web
 */

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // Minimum distance for swipe (default: 50px)
}

interface LongPressConfig {
  onLongPress: () => void;
  delay?: number; // Delay before triggering (default: 500ms)
}

interface PinchConfig {
  onPinchIn?: (scale: number) => void;
  onPinchOut?: (scale: number) => void;
  onPinchEnd?: () => void;
}

/**
 * Swipe Gesture Hook
 * Usage: const handlers = useSwipeGesture({ onSwipeLeft: () => {...} });
 *        <div {...handlers}>Content</div>
 */
export function useSwipeGesture(config: SwipeConfig) {
  const threshold = config.threshold || 50;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
  };

  const handleSwipe = () => {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0) {
          config.onSwipeRight?.();
        } else {
          config.onSwipeLeft?.();
        }
      }
    }
    // Vertical swipe
    else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0) {
          config.onSwipeDown?.();
        } else {
          config.onSwipeUp?.();
        }
      }
    }
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
}

/**
 * Long Press Gesture Hook
 * Usage: const handlers = useLongPress({ onLongPress: () => {...} });
 *        <div {...handlers}>Content</div>
 */
export function useLongPress(config: LongPressConfig) {
  const delay = config.delay || 500;
  let timeoutId: NodeJS.Timeout;
  let isLongPress = false;

  const handleTouchStart = () => {
    isLongPress = false;
    timeoutId = setTimeout(() => {
      isLongPress = true;
      config.onLongPress();
    }, delay);
  };

  const handleTouchEnd = () => {
    clearTimeout(timeoutId);
  };

  const handleTouchMove = () => {
    clearTimeout(timeoutId);
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
    onTouchMove: handleTouchMove,
    onContextMenu: (e: Event) => {
      if (isLongPress) {
        e.preventDefault();
      }
    },
  };
}

/**
 * Pinch Gesture Hook
 * Usage: const handlers = usePinchGesture({ onPinchOut: (scale) => {...} });
 *        <div {...handlers}>Content</div>
 */
export function usePinchGesture(config: PinchConfig) {
  let initialDistance = 0;
  let currentScale = 1;

  const getDistance = (touch1: Touch, touch2: Touch) => {
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      initialDistance = getDistance(e.touches[0], e.touches[1]);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      const currentDistance = getDistance(e.touches[0], e.touches[1]);
      const scale = currentDistance / initialDistance;

      currentScale = scale;

      if (scale > 1) {
        config.onPinchOut?.(scale);
      } else if (scale < 1) {
        config.onPinchIn?.(scale);
      }
    }
  };

  const handleTouchEnd = () => {
    config.onPinchEnd?.();
    initialDistance = 0;
    currentScale = 1;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

/**
 * Pull to Refresh Hook
 * iOS-style pull-to-refresh gesture
 */
export function usePullToRefresh(onRefresh: () => Promise<void>) {
  let startY = 0;
  let currentY = 0;
  let isRefreshing = false;
  const threshold = 80;

  const handleTouchStart = (e: TouchEvent) => {
    if (window.scrollY === 0) {
      startY = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (isRefreshing || window.scrollY > 0) return;

    currentY = e.touches[0].clientY;
    const pullDistance = currentY - startY;

    if (pullDistance > 0) {
      e.preventDefault();
      // Show pull indicator based on pullDistance
    }
  };

  const handleTouchEnd = async () => {
    const pullDistance = currentY - startY;

    if (pullDistance > threshold && !isRefreshing) {
      isRefreshing = true;
      await onRefresh();
      isRefreshing = false;
    }

    startY = 0;
    currentY = 0;
  };

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

/**
 * Example Usage:
 *
 * // Swipe to delete task
 * const TaskCard = ({ task }) => {
 *   const swipeHandlers = useSwipeGesture({
 *     onSwipeLeft: () => deleteTask(task.id),
 *     onSwipeRight: () => completeTask(task.id),
 *   });
 *
 *   return <div {...swipeHandlers}>{task.name}</div>;
 * };
 *
 * // Long press for context menu
 * const MessageBubble = ({ message }) => {
 *   const longPressHandlers = useLongPress({
 *     onLongPress: () => showContextMenu(message),
 *   });
 *
 *   return <div {...longPressHandlers}>{message.text}</div>;
 * };
 *
 * // Pinch to zoom image
 * const ImageViewer = ({ imageUrl }) => {
 *   const [scale, setScale] = useState(1);
 *   const pinchHandlers = usePinchGesture({
 *     onPinchOut: (newScale) => setScale(newScale),
 *     onPinchIn: (newScale) => setScale(newScale),
 *   });
 *
 *   return (
 *     <div {...pinchHandlers}>
 *       <img
 *         src={imageUrl}
 *         style={{ transform: `scale(${scale})` }}
 *       />
 *     </div>
 *   );
 * };
 */
