/**
 * Message Notification System
 * 消息通知系统 - 支持浏览器通知、桌面通知和应用内提示
 */

import { showToast } from '@/components/ui/Toast';
import { HapticFeedback } from './haptics';

export interface MessageNotification {
  id: string;
  conversationId: string;
  conversationTitle: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'message' | 'mention' | 'channel' | 'reaction';
}

// 检查浏览器通知权限
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('This browser does not support desktop notifications');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

// 发送浏览器通知
export function sendBrowserNotification(notification: MessageNotification) {
  if (Notification.permission !== 'granted') {
    return;
  }

  const title = notification.conversationTitle;
  const body = `${notification.senderName}: ${notification.content}`;
  const icon = '/favicon.ico'; // 使用应用图标

  const browserNotification = new Notification(title, {
    body,
    icon,
    badge: icon,
    tag: notification.conversationId, // 相同conversationId的通知会被替换
    requireInteraction: false, // 不需要用户交互就自动关闭
  });

  // 点击通知时聚焦窗口并跳转到对话
  browserNotification.onclick = () => {
    window.focus();
    // 可以在这里添加跳转逻辑
    browserNotification.close();
  };

  // 5秒后自动关闭
  setTimeout(() => {
    browserNotification.close();
  }, 5000);
}

// 发送应用内通知
export function sendInAppNotification(notification: MessageNotification) {
  // 根据通知类型选择不同的提示方式
  switch (notification.type) {
    case 'mention':
      showToast.info(`@${notification.senderName} 在 ${notification.conversationTitle} 中提到了你`);
      HapticFeedback.medium();
      break;
    case 'channel':
      showToast.info(`${notification.senderName} 在 #${notification.conversationTitle} 发送了消息`);
      HapticFeedback.light();
      break;
    case 'reaction':
      showToast.info(`${notification.senderName} 回应了你的消息`);
      HapticFeedback.light();
      break;
    case 'message':
    default:
      // 普通消息不显示 toast，避免打扰
      HapticFeedback.light();
      break;
  }
}

// 综合通知函数
export async function notifyNewMessage(notification: MessageNotification, options?: {
  forceBrowserNotification?: boolean;
  forceInAppNotification?: boolean;
}) {
  // 检查文档是否在后台
  const isBackground = document.hidden;

  // 如果在后台，发送浏览器通知
  if (isBackground || options?.forceBrowserNotification) {
    const hasPermission = await requestNotificationPermission();
    if (hasPermission) {
      sendBrowserNotification(notification);
    }
  }

  // 如果在前台或强制应用内通知，显示应用内提示
  if (!isBackground || options?.forceInAppNotification) {
    // 只对重要通知（@提及、频道消息）显示应用内通知
    if (notification.type === 'mention' || notification.type === 'channel') {
      sendInAppNotification(notification);
    }
  }
}

// 播放通知音效
export function playNotificationSound(type: 'message' | 'mention' | 'system' = 'message') {
  // 使用 Web Audio API 播放简单的提示音
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // 根据类型设置不同的音调
    switch (type) {
      case 'mention':
        oscillator.frequency.value = 800; // 高音
        break;
      case 'system':
        oscillator.frequency.value = 400; // 中音
        break;
      case 'message':
      default:
        oscillator.frequency.value = 600; // 标准音
        break;
    }

    // 音量设置
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error('Failed to play notification sound:', error);
  }
}

// 批量通知管理
class NotificationManager {
  private notifications: Map<string, MessageNotification[]> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();

  // 添加通知到队列
  addNotification(notification: MessageNotification) {
    const key = notification.conversationId;
    const existing = this.notifications.get(key) || [];
    existing.push(notification);
    this.notifications.set(key, existing);

    // 清除现有定时器
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key)!);
    }

    // 设置新的定时器，2秒后批量发送
    const timer = setTimeout(() => {
      this.flushNotifications(key);
    }, 2000);

    this.timers.set(key, timer);
  }

  // 发送批量通知
  private async flushNotifications(conversationId: string) {
    const notifications = this.notifications.get(conversationId);
    if (!notifications || notifications.length === 0) return;

    if (notifications.length === 1) {
      // 单条消息，直接发送
      await notifyNewMessage(notifications[0]);
    } else {
      // 多条消息，合并发送
      const firstNotif = notifications[0];
      await notifyNewMessage({
        ...firstNotif,
        content: `${notifications.length} 条新消息`,
      });
    }

    // 清理
    this.notifications.delete(conversationId);
    this.timers.delete(conversationId);
  }

  // 清除所有待发送的通知
  clear() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.notifications.clear();
    this.timers.clear();
  }
}

// 导出单例
export const notificationManager = new NotificationManager();

// 初始化通知系统
export async function initializeNotificationSystem() {
  // 请求通知权限
  const hasPermission = await requestNotificationPermission();

  if (hasPermission) {
    console.log('Notification system initialized');
  } else {
    console.warn('Notification permission denied');
  }

  // 监听页面可见性变化
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // 页面变为可见时，清除所有待发送的通知
      notificationManager.clear();
    }
  });
}
