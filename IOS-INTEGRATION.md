# iOS Design Integration - Karma Web App

## 概览

本文档记录了从 Karma iOS 版本设计整合到 Web 版本的所有功能。这次整合实现了移动优先的响应式设计，将 iOS 的优秀交互模式带到了 Web 平台。

---

## 已完成的功能整合

### ✅ 1. 响应式底部Tab导航（移动端）

**文件**: `src/components/layout/BottomTabBar.tsx`

**特性**:
- iOS风格的底部导航栏（仅移动端显示）
- 4个主要Tab：对话、项目、分身、我的
- 活跃状态指示器
- Badge通知计数
- 触觉反馈集成
- 44px最小触摸目标（iOS HIG标准）

**响应式行为**:
```typescript
// 桌面端（≥768px）：显示左侧边栏
// 移动端（<768px）：显示底部Tab栏

<BottomTabBar /> // 自动检测设备宽度
```

**使用示例**:
```tsx
// MainLayout已集成，无需额外配置
<MainLayout>
  <YourPage />
</MainLayout>
```

---

### ✅ 2. 手势支持系统

**文件**: `src/lib/utils/gestures.ts`

**支持的手势**:
- **滑动手势**: 左/右/上/下滑动
- **长按手势**: 长按触发上下文菜单
- **捏合手势**: 双指缩放
- **下拉刷新**: iOS风格的下拉刷新

**使用示例**:
```tsx
import { useSwipeGesture, useLongPress, usePinchGesture } from '@/lib/utils/gestures';

// 滑动删除任务
const TaskCard = ({ task }) => {
  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => deleteTask(task.id),
    onSwipeRight: () => completeTask(task.id),
  });

  return <div {...swipeHandlers}>{task.name}</div>;
};

// 长按显示菜单
const MessageBubble = ({ message }) => {
  const longPressHandlers = useLongPress({
    onLongPress: () => showContextMenu(message),
  });

  return <div {...longPressHandlers}>{message.text}</div>;
};

// 捏合缩放图片
const ImageViewer = ({ imageUrl }) => {
  const [scale, setScale] = useState(1);
  const pinchHandlers = usePinchGesture({
    onPinchOut: (newScale) => setScale(newScale),
    onPinchIn: (newScale) => setScale(newScale),
  });

  return (
    <div {...pinchHandlers}>
      <img src={imageUrl} style={{ transform: `scale(${scale})` }} />
    </div>
  );
};
```

---

### ✅ 3. 触觉反馈（Web Vibration API）

**文件**: `src/lib/utils/haptics.ts`

**反馈类型**:
- `light()` - 轻微反馈（按钮点击）
- `medium()` - 中等反馈（拖拽开始）
- `heavy()` - 强烈反馈（重要操作）
- `success()` - 成功反馈（任务完成）
- `warning()` - 警告反馈（删除确认）
- `error()` - 错误反馈（操作失败）
- `selection()` - 选择反馈（列表选择）

**使用示例**:
```tsx
import { HapticFeedback } from '@/lib/utils/haptics';

<button
  onClick={() => {
    HapticFeedback.light();
    handleClick();
  }}
>
  点击
</button>

// 任务完成
onTaskComplete={() => {
  HapticFeedback.success();
  showSuccessMessage();
}}

// 删除操作
onDelete={() => {
  HapticFeedback.warning();
  confirmDelete();
}}
```

---

### ✅ 4. 多模态输入组件

**文件**: `src/components/ui/MultimodalInput.tsx`

**功能**:
- 📝 文本输入
- 🎤 语音输入（Web Speech API）
- 📷 相机拍照
- 📎 文件上传
- ⌘Enter 快捷键发送

**使用示例**:
```tsx
import { MultimodalInput } from '@/components/ui/MultimodalInput';

<MultimodalInput
  onSend={(content, attachments) => {
    console.log('Message:', content);
    console.log('Files:', attachments);
  }}
  placeholder="输入消息..."
  enableVoice={true}
  enableCamera={true}
  enableFiles={true}
/>
```

**特性**:
- 自动语音识别（中文支持）
- 附件预览和删除
- 触觉反馈集成
- 无障碍支持

---

### ✅ 5. 任务会话页（Task = Session）

**文件**: `src/app/tasks/[id]/page.tsx`

**核心创新**: 将任务详情和聊天界面融合

**功能**:
- 任务信息展示
- 实时进度追踪
- 与AI分身对话
- 里程碑记录
- 代码变更展示
- 测试覆盖率显示
- 快捷操作按钮

**访问**: `/tasks/[id]`

**设计特点**:
```
┌────────────────────────────────┐
│ Task Header (进度、状态、操作) │
├────────────────────────────────┤
│ 💬 Message Stream              │
│ - User messages                │
│ - Avatar responses             │
│ - Milestones                   │
│ - Code changes                 │
│ - Test results                 │
├────────────────────────────────┤
│ Multimodal Input (语音、文件)  │
└────────────────────────────────┘
```

---

### ✅ 6. iOS风格动画系统

**文件**: `src/lib/utils/animations.ts`

**动画预设**:
- `spring` - iOS风格的弹簧动画
- `fadeIn` - 淡入
- `slideUp` - 从底部滑入
- `scaleIn` - 缩放进入（带弹跳）
- `bounceIn` - 弹跳进入
- `celebrate` - 庆祝动画

**使用示例**:
```tsx
import { animateIn, transitions } from '@/lib/utils/animations';

// CSS动画
<div style={{ animation: 'fadeIn 200ms ease-out' }}>
  Content
</div>

// Hover效果
<div style={transitions.cardHover}>
  Card
</div>

// 按钮点击
<button style={transitions.buttonPress}>
  Button
</button>
```

---

### ✅ 7. 国际化支持（i18n）

**文件**: `src/lib/i18n/index.ts`

**支持的语言**:
- 🇺🇸 English
- 🇨🇳 简体中文
- 🇹🇼 繁體中文
- 🇯🇵 日本語
- 🇰🇷 한국어
- 🇪🇸 Español
- 🇫🇷 Français
- 🇩🇪 Deutsch
- 🇷🇺 Русский

**使用示例**:
```tsx
import { t, useTranslation } from '@/lib/i18n';

// 在组件中
const { t, locale } = useTranslation();

<button>{t('common.save')}</button>
<p>{t('projects.progress', { percentage: 75 })}</p>

// 切换语言
setLocale('en'); // 切换到英文
```

**自动特性**:
- 自动检测浏览器语言
- localStorage持久化
- 简单的插值支持

---

### ✅ 8. iOS风格通知系统

**文件**: `src/components/ui/Toast.tsx`

**通知类型**:
- ✅ Success - 成功通知
- ❌ Error - 错误通知
- ⚠️ Warning - 警告通知
- ℹ️ Info - 信息通知

**使用示例**:
```tsx
import { showToast } from '@/components/ui/Toast';

// 简单通知
showToast.success('任务创建成功！');
showToast.error('网络连接失败');
showToast.warning('即将达到配额限制');
showToast.info('有新的系统更新');

// 带操作的通知
showToast.withAction(
  'info',
  'FORGE #1 需要你的审核',
  {
    label: '查看',
    handler: () => router.push('/tasks/123')
  },
  5000 // 5秒后自动消失
);
```

**特性**:
- 自动堆叠显示
- 触觉反馈
- 可操作的通知
- 移动端优化位置
- 滑动消失动画

---

### ✅ 9. 无障碍功能增强

**实现位置**: 所有组件

**WCAG 2.1 AA 合规**:
- ✅ ARIA标签（`aria-label`, `aria-labelledby`）
- ✅ 角色定义（`role="navigation"`, `role="alert"`）
- ✅ 键盘导航支持
- ✅ 焦点管理
- ✅ 颜色对比度 ≥ 4.5:1
- ✅ 最小触摸目标 44x44px

**示例**:
```tsx
// 底部导航
<nav role="navigation" aria-label="Main navigation">
  <button aria-label="对话" aria-current="page">
    💬
  </button>
</nav>

// 通知
<div role="region" aria-label="Notifications" aria-live="polite">
  <div role="alert">任务完成</div>
</div>

// 输入框
<input aria-label="Message input" />
```

---

## 响应式设计规范

### 断点系统

```css
/* Mobile First */
.container {
  padding: 16px; /* 移动端 */
}

@media (min-width: 768px) {
  .container {
    padding: 24px; /* 平板 */
  }
}

@media (min-width: 1024px) {
  .container {
    padding: 32px; /* 桌面 */
  }
}
```

### 布局适配

| 设备 | 宽度 | 导航 | 边栏 |
|------|------|------|------|
| **手机** | < 768px | 底部Tab栏 | 隐藏 |
| **平板** | 768px - 1024px | 底部Tab栏 | 可选 |
| **桌面** | ≥ 1024px | 左侧边栏 | 显示 |

---

## 性能优化

### 1. 代码分割
- 动态导入大型组件
- 按路由分割
- 懒加载非关键资源

### 2. 手势优化
- 使用原生事件
- 防抖/节流处理
- 被动事件监听

### 3. 动画优化
- CSS transform（硬件加速）
- will-change属性
- 避免布局抖动

---

## 使用指南

### 快速开始

```tsx
// 1. 在页面中使用响应式布局
import { MainLayout } from '@/components/layout/MainLayout';

export default function MyPage() {
  return (
    <MainLayout>
      {/* 自动适配桌面/移动端 */}
      <YourContent />
    </MainLayout>
  );
}

// 2. 添加手势支持
import { useSwipeGesture } from '@/lib/utils/gestures';
import { HapticFeedback } from '@/lib/utils/haptics';

const handlers = useSwipeGesture({
  onSwipeLeft: () => {
    HapticFeedback.light();
    handleAction();
  }
});

<div {...handlers}>Content</div>

// 3. 使用多模态输入
import { MultimodalInput } from '@/components/ui/MultimodalInput';

<MultimodalInput
  onSend={handleSend}
  enableVoice
  enableCamera
  enableFiles
/>

// 4. 显示通知
import { showToast } from '@/components/ui/Toast';

showToast.success('操作成功！');

// 5. 国际化
import { t } from '@/lib/i18n';

<p>{t('common.save')}</p>
```

---

## 测试建议

### 移动端测试
1. **真机测试**: 使用真实的移动设备测试
2. **手势测试**: 验证滑动、长按、捏合等手势
3. **触觉测试**: 检查振动反馈是否正常
4. **语音测试**: 测试语音输入功能

### 响应式测试
1. Chrome DevTools 设备模拟
2. 不同屏幕尺寸测试
3. 横屏/竖屏切换测试

### 无障碍测试
1. 使用屏幕阅读器（VoiceOver/NVDA）
2. 纯键盘导航测试
3. 颜色对比度检查（axe DevTools）

---

## 浏览器兼容性

| 功能 | Chrome | Safari | Firefox | Edge |
|------|--------|--------|---------|------|
| 底部Tab栏 | ✅ | ✅ | ✅ | ✅ |
| 触觉反馈 | ✅ | ⚠️ 部分 | ✅ | ✅ |
| 语音输入 | ✅ | ✅ | ❌ | ✅ |
| 手势 | ✅ | ✅ | ✅ | ✅ |
| 国际化 | ✅ | ✅ | ✅ | ✅ |

⚠️ 注意：
- Safari iOS不支持 Vibration API，但不影响功能
- Firefox不支持 Web Speech API，语音输入会被禁用

---

## 下一步计划

### 🚧 待完成
- [ ] WebSocket实时通知
- [ ] Service Worker离线支持
- [ ] PWA安装提示
- [ ] 更多手势动画
- [ ] 深色/浅色模式切换

### 🎯 未来优化
- [ ] Framer Motion动画库集成
- [ ] 更多语言翻译
- [ ] 语音输入优化（更多语言）
- [ ] 手势自定义配置

---

## 相关文档

- [Karma iOS设计文档](../karma-design-docs/)
- [Design System v3.0](../karma-web-design/)
- [无障碍指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web Vibration API](https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API)

---

## 联系方式

如有问题或建议，请联系开发团队。

**最后更新**: 2025-10-24
**版本**: 1.0.0
