#!/bin/bash

# Karma Frontend Package Script
# 打包前端代码和文档

set -e

echo "📦 开始打包前端代码..."

# 创建临时目录
TEMP_DIR="karma-frontend-delivery"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# 复制前端代码
echo "📁 复制前端代码..."
cp -r src $TEMP_DIR/
cp -r public $TEMP_DIR/
cp -r docs/frontend $TEMP_DIR/docs/
cp -r docs/api $TEMP_DIR/docs/

# 复制配置文件
echo "⚙️  复制配置文件..."
cp package.json $TEMP_DIR/
cp package-lock.json $TEMP_DIR/
cp tsconfig.json $TEMP_DIR/
cp tailwind.config.ts $TEMP_DIR/
cp next.config.ts $TEMP_DIR/
cp postcss.config.mjs $TEMP_DIR/
cp .env.example $TEMP_DIR/
cp .gitignore $TEMP_DIR/

# 复制文档
echo "📖 复制文档..."
cp FRONTEND-QUICKSTART.md $TEMP_DIR/README.md
cp HANDOVER.md $TEMP_DIR/

# 创建前端专用 README
cat > $TEMP_DIR/START-HERE.md << 'EOF'
# Karma 前端 - 快速开始

## 🚀 5分钟启动

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量
cp .env.example .env.local
# 确保 NEXT_PUBLIC_ENABLE_MOCK=true

# 3. 启动开发服务器
npm run dev

# 4. 访问应用
open http://localhost:3000
```

## ✅ 验证 Mock API

1. 浏览器控制台看到: `🎭 MSW Mock API 已启用`
2. 访问 http://localhost:3000/devices
3. 看到 5 台模拟设备
4. 打开 Network 面板，请求被 MSW 拦截

## 📚 文档

- **快速开始**: `README.md`
- **Mock API 指南**: `docs/frontend/QUICK-START-MOCK.md`
- **前端开发文档**: `docs/frontend/README.md`
- **API 接口契约**: `docs/api/CONTRACT.md`
- **项目交接**: `HANDOVER.md`

## 🎯 开发任务

查看 `HANDOVER.md` 中的前端里程碑计划

祝开发顺利！🚀
EOF

# 创建交付清单
cat > $TEMP_DIR/CHECKLIST.md << 'EOF'
# 前端团队交接检查清单

## 环境搭建

- [ ] 收到完整代码包
- [ ] 解压到工作目录
- [ ] 阅读 `START-HERE.md`
- [ ] 安装 Node.js >= 20.0.0
- [ ] 运行 `npm install`
- [ ] 复制 `.env.example` 为 `.env.local`
- [ ] 运行 `npm run dev`
- [ ] 浏览器访问 http://localhost:3000
- [ ] 看到 "🎭 MSW Mock API 已启用"

## 文档阅读

- [ ] 阅读 `START-HERE.md` (5分钟)
- [ ] 阅读 `README.md` (完整快速开始)
- [ ] 阅读 `docs/frontend/README.md`
- [ ] 浏览 `docs/api/CONTRACT.md`
- [ ] 理解 Mock API 工作原理

## 功能验证

- [ ] 访问所有主要页面
- [ ] 测试设备列表 API
- [ ] 修改 Mock 数据看到变化
- [ ] 测试 API Client 调用
- [ ] 理解如何切换真实后端

## 开发准备

- [ ] 配置 IDE (推荐 VS Code)
- [ ] 安装推荐的扩展
- [ ] 理解项目结构
- [ ] 查看现有组件
- [ ] 制定开发计划

完成日期: ____________
确认人: ____________
EOF

# 打包
echo "🗜️  压缩打包..."
tar -czf karma-frontend-$(date +%Y%m%d).tar.gz $TEMP_DIR

echo "✅ 打包完成！"
echo "📦 输出文件: karma-frontend-$(date +%Y%m%d).tar.gz"
echo ""
echo "📋 包含内容:"
echo "  - 完整前端代码 (src/)"
echo "  - Mock API 系统 (src/mocks/)"
echo "  - React 组件 (src/components/)"
echo "  - API 客户端 (src/lib/api/)"
echo "  - TypeScript 类型 (src/types/)"
echo "  - 配置文件 (package.json, tsconfig.json, etc.)"
echo "  - 前端文档 (docs/frontend/)"
echo "  - API 契约 (docs/api/)"
echo "  - 快速开始指南"
echo "  - 交接检查清单"
echo ""
echo "📤 发送方式:"
echo "  1. 上传到文件服务器"
echo "  2. 或通过邮件发送（如果文件不大）"
echo "  3. 或创建 GitHub Release"

# 清理临时目录（可选）
# rm -rf $TEMP_DIR
