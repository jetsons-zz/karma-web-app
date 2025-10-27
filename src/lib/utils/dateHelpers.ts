/**
 * 日期处理工具函数
 */

/**
 * 格式化消息时间戳为分组标签
 * @param timestamp - 时间戳或日期字符串
 * @returns 格式化的日期分组标签
 */
export function formatDateGroup(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // 今天
  if (messageDate.getTime() === today.getTime()) {
    return '今天';
  }

  // 昨天
  if (messageDate.getTime() === yesterday.getTime()) {
    return '昨天';
  }

  // 本周内
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (messageDate > weekAgo) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return weekdays[date.getDay()];
  }

  // 今年内
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  // 其他
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 格式化消息时间为详细时间
 * @param timestamp - 时间戳或日期字符串
 * @returns 格式化的时间字符串
 */
export function formatMessageTime(timestamp: string | Date): string {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  // 1分钟内
  if (diff < 60 * 1000) {
    return '刚刚';
  }

  // 1小时内
  if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes}分钟前`;
  }

  // 今天
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  if (messageDate.getTime() === today.getTime()) {
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  // 昨天
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (messageDate.getTime() === yesterday.getTime()) {
    return `昨天 ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  // 本周内
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  if (messageDate > weekAgo) {
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${weekdays[date.getDay()]} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  }

  // 今年内
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  }

  // 其他
  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

/**
 * 根据日期分组消息
 * @param messages - 消息列表
 * @returns 按日期分组的消息
 */
export function groupMessagesByDate<T extends { timestamp: string }>(
  messages: T[]
): { date: string; messages: T[] }[] {
  const groups = new Map<string, T[]>();

  messages.forEach(message => {
    const dateLabel = formatDateGroup(message.timestamp);
    if (!groups.has(dateLabel)) {
      groups.set(dateLabel, []);
    }
    groups.get(dateLabel)!.push(message);
  });

  return Array.from(groups.entries()).map(([date, messages]) => ({
    date,
    messages,
  }));
}

/**
 * 判断两条消息是否在同一天
 * @param timestamp1 - 第一条消息时间戳
 * @param timestamp2 - 第二条消息时间戳
 * @returns 是否在同一天
 */
export function isSameDay(timestamp1: string | Date, timestamp2: string | Date): boolean {
  const date1 = typeof timestamp1 === 'string' ? new Date(timestamp1) : timestamp1;
  const date2 = typeof timestamp2 === 'string' ? new Date(timestamp2) : timestamp2;

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
