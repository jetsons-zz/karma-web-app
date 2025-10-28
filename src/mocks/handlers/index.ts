/**
 * MSW Mock Handlers - 主入口
 */

import { deviceHandlers } from './devices';

export const handlers = [
  ...deviceHandlers,
  // 未来添加更多 handlers:
  // ...fileHandlers,
  // ...projectHandlers,
  // ...avatarHandlers,
  // ...subscriptionHandlers,
];
