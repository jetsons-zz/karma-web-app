/**
 * MSW Provider - 在开发环境启用 Mock API
 */

'use client';

import { useEffect, useState } from 'react';

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [mswReady, setMswReady] = useState(false);

  useEffect(() => {
    const enableMocking = async () => {
      // 仅在开发环境且启用 Mock 时启动
      if (
        process.env.NODE_ENV === 'development' &&
        process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true'
      ) {
        const { worker } = await import('@/mocks/browser');

        await worker.start({
          onUnhandledRequest: 'bypass', // 不拦截未定义的请求
          quiet: false, // 在控制台显示日志
        });

        console.log('🎭 MSW Mock API 已启用');
        console.log('📝 查看拦截的请求: 打开浏览器 Network 面板');
        console.log('⚙️  关闭 Mock: 设置 NEXT_PUBLIC_ENABLE_MOCK=false');
      }

      setMswReady(true);
    };

    enableMocking();
  }, []);

  // 在 Mock 就绪前不渲染（避免真实请求）
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.NEXT_PUBLIC_ENABLE_MOCK === 'true' &&
    !mswReady
  ) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>🎭 正在启动 Mock API...</div>
      </div>
    );
  }

  return <>{children}</>;
}
