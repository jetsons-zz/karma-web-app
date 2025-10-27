# 🎭 西部世界主题集成指南

完整的西部世界 (HBO Westworld) 主题 AI 分身系统实现文档

---

## 📦 已实现功能

### 1. 核心系统组件

#### ✅ 角色配置系统
**文件**: `src/lib/westworld/characters.ts`

- 8 个完整的西部世界角色定义
- 每个角色包含详细的配色方案、能力数据、经典台词
- 工具函数用于角色查询和推荐

**角色列表**:
- **Dolores** (领导者) - 金发蓝裙，觉醒的引领者
- **Maeve** (策略家) - 红衣老鸨，智慧的协调者
- **Bernard** (技术专家) - 眼镜西装，理性的分析者
- **Teddy** (执行者) - 牛仔英雄，可靠的行动派
- **Clementine** (支持者) - 红发温柔，关怀型伴侣
- **Ford** (创始人) - 白发造物主，愿景领袖
- **Man in Black** (探索者) - 黑衣神秘，真相追寻者
- **Elsie** (调试者) - 年轻程序员，问题解决者

#### ✅ SVG 图标组件
**文件**: `src/lib/westworld/CharacterIcon.tsx`

- 扁平化二维设计风格
- 每个角色独特的视觉特征
- 4 种状态变体：默认、激活、离线、警告
- 内置 SVG 动画效果

#### ✅ 增强的 Avatar 组件
**文件**: `src/components/ui/Avatar.tsx`

**新增 Props**:
```typescript
theme?: 'default' | 'westworld'
westworldCharacter?: WestworldCharacterId
iconStatus?: 'default' | 'active' | 'offline' | 'warning'
status?: 'online' | 'busy' | 'offline' | 'thinking'
```

**向后兼容**: 原有功能完全保留

#### ✅ 角色选择器组件
**文件**: `src/components/westworld/CharacterSelector.tsx`

**两个版本**:
1. **完整版 CharacterSelector**:
   - 大型角色详情展示
   - 能力雷达图
   - 适用场景列表
   - 经典台词展示

2. **紧凑版 CompactCharacterSelector**:
   - 小空间友好
   - 快速选择
   - 适合对话框和侧边栏

#### ✅ CSS 动画系统
**文件**: `src/lib/westworld/westworld-animations.css`

**核心动画**:
- `avatar-activate` - 激活动画
- `pulse` - 呼吸灯效果
- `hologram` - 全息效果
- `glow` - 光晕效果
- `ripple` - 波纹扩散
- `blink` - 闪烁警告
- `scanline` - 扫描线效果
- `glitch` - 故障效果

**角色特定动画**:
- `westworld-dolores-awakening` - Dolores 觉醒光芒
- `westworld-maeve-control` - Maeve 控制力场
- `westworld-bernard-data` - Bernard 数据流
- `westworld-ford-omniscient` - Ford 全知之眼
- `westworld-mib-shadow` - Man in Black 阴影效果

#### ✅ 西部世界主题演示页面
**文件**: `src/app/avatars/westworld/page.tsx`

**功能**:
- 角色选择器视图
- 分身网格视图（西部世界主题）
- 完整角色阵容展示
- 迷宫彩蛋

---

## 🚀 快速开始

### 访问西部世界主题页面

启动开发服务器后，访问：

```
http://localhost:3000/avatars/westworld
```

### 基本使用示例

#### 1. 显示西部世界角色 Avatar

```tsx
import { Avatar } from '@/components/ui/Avatar';

function MyComponent() {
  return (
    <Avatar
      theme="westworld"
      westworldCharacter="dolores"
      size="lg"
      status="thinking"
      iconStatus="active"
    />
  );
}
```

#### 2. 使用角色选择器

```tsx
import { useState } from 'react';
import { CharacterSelector } from '@/components/westworld/CharacterSelector';
import { WestworldCharacterId } from '@/lib/westworld/characters';

function MyComponent() {
  const [selected, setSelected] = useState<WestworldCharacterId>('dolores');

  return (
    <CharacterSelector
      selectedCharacter={selected}
      onSelect={setSelected}
      onConfirm={() => {
        console.log('Selected:', selected);
      }}
    />
  );
}
```

#### 3. 紧凑型选择器

```tsx
import { CompactCharacterSelector } from '@/components/westworld/CharacterSelector';

function MyDialog() {
  return (
    <div className="dialog">
      <h3>选择角色</h3>
      <CompactCharacterSelector
        selectedCharacter={selected}
        onSelect={setSelected}
      />
    </div>
  );
}
```

---

## 💡 高级用法

### 获取角色信息

```typescript
import { getCharacter, getAllCharacters } from '@/lib/westworld/characters';

// 获取单个角色
const dolores = getCharacter('dolores');
console.log(dolores.name); // "Dolores"
console.log(dolores.visual.primaryColor); // "#87CEEB"
console.log(dolores.quotes[0]); // "These violent delights..."

// 获取所有角色
const allCharacters = getAllCharacters();
allCharacters.forEach(char => {
  console.log(char.name, char.role);
});
```

### 根据能力筛选角色

```typescript
import { getCharactersByAbility } from '@/lib/westworld/characters';

// 获取编程能力最强的角色
const topCoders = getCharactersByAbility('coding', 3);
topCoders.forEach(char => {
  console.log(`${char.name}: ${char.abilities.coding}`);
});
```

### 角色推荐

```typescript
import { recommendCharacter } from '@/lib/westworld/characters';

// 根据任务类型推荐角色
const devCharacter = recommendCharacter('development'); // Returns Bernard
const designCharacter = recommendCharacter('design'); // Returns Dolores
const writingCharacter = recommendCharacter('writing'); // Returns Maeve
```

### 使用动画类

```tsx
// 激活动画
<div className="westworld-avatar-active">
  <Avatar theme="westworld" westworldCharacter="dolores" />
</div>

// 呼吸灯效果
<div className="westworld-pulse">...</div>

// 全息效果
<div className="westworld-hologram">...</div>

// 光晕效果
<div className="westworld-glow">...</div>

// Dolores 特定效果
<div className="westworld-dolores-awakening">
  <Avatar theme="westworld" westworldCharacter="dolores" />
</div>

// Bernard 数据流
<div className="westworld-bernard-data">
  <Avatar theme="westworld" westworldCharacter="bernard" />
</div>
```

---

## 🎨 自定义与扩展

### 添加新角色

1. 编辑 `src/lib/westworld/characters.ts`
2. 在 `WestworldCharacterId` 类型中添加新 ID
3. 在 `westworldCharacters` 对象中添加完整配置
4. 更新 `characterIds` 数组
5. 在 `CharacterIcon.tsx` 中添加 SVG 图标渲染逻辑

示例：

```typescript
// 1. 添加类型
export type WestworldCharacterId =
  | 'dolores'
  | 'maeve'
  | 'your-new-character'; // 添加这里

// 2. 添加配置
export const westworldCharacters: Record<WestworldCharacterId, WestworldCharacter> = {
  // ... 现有角色
  'your-new-character': {
    id: 'your-new-character',
    name: 'Character Name',
    fullName: 'Full Character Name',
    description: '...',
    role: '角色类型',
    personality: ['特点1', '特点2'],
    visual: {
      primaryColor: '#HEXCODE',
      secondaryColor: '#HEXCODE',
      accentColor: '#HEXCODE',
      iconShape: 'circle',
      emoji: '🎭',
    },
    // ... 其他配置
  },
};

// 3. 更新 ID 数组
export const characterIds: WestworldCharacterId[] = [
  // ... 现有 ID
  'your-new-character',
];
```

### 修改角色配色

直接编辑角色配置中的 `visual` 对象：

```typescript
visual: {
  primaryColor: '#87CEEB',    // 主色调
  secondaryColor: '#FFD700',  // 辅助色
  accentColor: '#4169E1',     // 强调色
  iconShape: 'circle',         // 容器形状
  emoji: '🌻',                // 表情符号
}
```

### 创建自定义动画

在 `westworld-animations.css` 中添加：

```css
@keyframes your-custom-animation {
  0% { /* 起始状态 */ }
  100% { /* 结束状态 */ }
}

.your-custom-class {
  animation: your-custom-animation 2s ease-in-out infinite;
}
```

---

## 🧪 测试建议

### 浏览器测试清单

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] 移动浏览器 (iOS Safari, Chrome Mobile)

### 功能测试

#### Avatar 组件
- [ ] 默认主题正常显示
- [ ] 西部世界主题正常显示
- [ ] 所有 8 个角色图标渲染正确
- [ ] 状态指示器（online/busy/offline/thinking）正常
- [ ] 图标状态（default/active/offline/warning）动画正确
- [ ] 不同尺寸（xs/sm/md/lg/xl）显示正常
- [ ] Hover 效果流畅

#### 角色选择器
- [ ] 角色切换实时更新
- [ ] 能力雷达图正确显示
- [ ] 适用场景标签完整
- [ ] 经典台词显示
- [ ] 紧凑版选择器在小空间正常工作
- [ ] 确认按钮功能正常

#### 动画效果
- [ ] 激活动画流畅
- [ ] 呼吸灯效果自然
- [ ] 全息效果正确
- [ ] 光晕效果美观
- [ ] 角色特定动画正确
- [ ] 无性能问题（60fps）

#### 主题页面
- [ ] 页面加载正常
- [ ] 视图切换（选择器/网格）工作正常
- [ ] 角色阵容展示完整
- [ ] 迷宫彩蛋可交互
- [ ] 响应式布局正确

### 性能测试

```bash
# 运行构建
npm run build

# 检查构建大小
du -h .next/static/**/*.js | sort -h

# 检查图标文件大小
ls -lh src/lib/westworld/
```

**预期**:
- 角色配置: < 50KB
- SVG 图标组件: < 30KB
- CSS 动画: < 20KB
- 总增加量: < 100KB

---

## 📚 API 参考

### Avatar 组件 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `theme` | `'default' \| 'westworld'` | `'default'` | 主题模式 |
| `westworldCharacter` | `WestworldCharacterId` | - | 西部世界角色 ID |
| `iconStatus` | `'default' \| 'active' \| 'offline' \| 'warning'` | `'default'` | 图标状态 |
| `status` | `'online' \| 'busy' \| 'offline' \| 'thinking'` | - | 在线状态 |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | 大小 |
| `showRole` | `boolean` | `false` | 显示角色标签 |

### CharacterSelector Props

| Prop | Type | Description |
|------|------|-------------|
| `selectedCharacter` | `WestworldCharacterId` | 当前选中的角色 |
| `onSelect` | `(id: WestworldCharacterId) => void` | 选择回调 |
| `onConfirm` | `() => void` | 确认回调 (可选) |
| `className` | `string` | 自定义类名 |

### WestworldCharacter 接口

```typescript
interface WestworldCharacter {
  id: WestworldCharacterId;
  name: string;
  fullName: string;
  description: string;
  role: string;
  personality: string[];

  visual: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    iconShape: 'circle' | 'ellipse' | 'square' | 'shield' | 'hexagon' | 'heart';
    emoji: string;
  };

  elements: {
    hair: string;
    eyes: string;
    accessory: string;
    signature: string;
  };

  useCases: string[];

  abilities: {
    coding: number;
    design: number;
    writing: number;
    analysis: number;
    communication: number;
    leadership: number;
  };

  quotes: string[];
}
```

---

## 🎬 彩蛋与细节

### 已实现的彩蛋

1. **迷宫图案** - 在西部世界页面底部
2. **经典台词** - 每个角色的标志性台词
3. **状态动画** - thinking 状态显示全息效果
4. **角色特定动画** - 每个角色独特的视觉效果

### 可添加的彩蛋建议

1. **Konami Code** - 输入特定按键序列解锁隐藏内容
2. **循环记忆** - 分身记住用户的选择偏好
3. **觉醒进度** - 用户使用分身达到一定次数后"觉醒"
4. **二元对立** - 在关键选择中记录用户的道德倾向

---

## 🐛 故障排除

### 图标不显示

**问题**: SVG 图标渲染为空白

**解决方案**:
1. 检查 `westworldCharacter` prop 是否正确
2. 确认 `theme="westworld"` 已设置
3. 查看浏览器控制台是否有错误

### 动画不流畅

**问题**: 动画卡顿或不播放

**解决方案**:
1. 检查 CSS 文件是否正确导入
2. 确认浏览器支持 CSS 动画
3. 检查是否启用了 `prefers-reduced-motion`
4. 尝试添加 `westworld-gpu-accelerated` 类

### 颜色显示不正确

**问题**: 角色颜色与预期不符

**解决方案**:
1. 确认角色配置中的颜色代码正确
2. 检查是否有全局 CSS 覆盖
3. 验证浏览器颜色模式（深色/浅色）

### TypeScript 类型错误

**问题**: `WestworldCharacterId` 类型报错

**解决方案**:
```typescript
import { WestworldCharacterId } from '@/lib/westworld/characters';

// 确保使用正确的类型
const characterId: WestworldCharacterId = 'dolores'; // ✅ 正确
const characterId: string = 'dolores'; // ❌ 错误
```

---

## 📖 相关文档

- [WESTWORLD-AVATAR-DESIGN.md](./WESTWORLD-AVATAR-DESIGN.md) - 完整设计规范
- [HBO Westworld 官方网站](https://www.hbo.com/westworld)
- [Westworld Wiki](https://westworld.fandom.com/)

---

## ✅ 部署检查清单

在部署到生产环境前，确保：

- [ ] 所有角色图标正确显示
- [ ] 动画在所有主流浏览器中正常工作
- [ ] 没有控制台错误或警告
- [ ] TypeScript 编译无错误
- [ ] Build 成功且大小合理
- [ ] 移动端响应式正常
- [ ] 无障碍性（a11y）合规
- [ ] SEO 元数据正确
- [ ] 性能指标达标（Lighthouse > 90）

---

## 🎉 总结

西部世界主题已完全集成到 Karma Web App 中！

**核心文件**:
- `src/lib/westworld/characters.ts` - 角色配置
- `src/lib/westworld/CharacterIcon.tsx` - SVG 图标
- `src/lib/westworld/westworld-animations.css` - 动画样式
- `src/components/ui/Avatar.tsx` - 增强的 Avatar 组件
- `src/components/westworld/CharacterSelector.tsx` - 选择器组件
- `src/app/avatars/westworld/page.tsx` - 演示页面

**快速开始**:
```
npm run dev
# 访问 http://localhost:3000/avatars/westworld
```

**下一步**:
1. 访问演示页面测试所有功能
2. 在你的页面中使用 `<Avatar theme="westworld" />`
3. 自定义角色配色和动画
4. 添加更多彩蛋！

---

**版本**: 1.0
**最后更新**: 2025-10-27
**维护者**: Karma Design Team

> "It's not a real magic trick if you know how it works."
> — Dr. Robert Ford, Westworld
