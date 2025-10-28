#!/bin/bash

# Karma App - 项目结构设置脚本
# 创建所有必要的目录结构

echo "🚀 开始设置 Karma App 项目结构..."
echo ""

# 安全模块
echo "📁 创建安全模块..."
mkdir -p src/lib/security

# 音频模块
echo "📁 创建音频模块..."
mkdir -p src/lib/audio

# AI 模块
echo "📁 创建 AI 模块..."
mkdir -p src/lib/ai

# WebSocket 模块
echo "📁 创建 WebSocket 模块..."
mkdir -p src/lib/websocket

# 协同模块
echo "📁 创建协同模块..."
mkdir -p src/lib/coordination

# HITL 模块
echo "📁 创建 HITL 模块..."
mkdir -p src/lib/hitl

# 支付模块
echo "📁 创建支付模块..."
mkdir -p src/lib/payment

# 订阅模块
echo "📁 创建订阅模块..."
mkdir -p src/lib/subscription

# 收益模块
echo "📁 创建收益模块..."
mkdir -p src/lib/revenue

# 知识模块
echo "📁 创建知识模块..."
mkdir -p src/lib/knowledge

# 机器学习模块
echo "📁 创建机器学习模块..."
mkdir -p src/lib/ml

# 监控模块
echo "📁 创建监控模块..."
mkdir -p src/lib/monitoring

# 恢复模块
echo "📁 创建恢复模块..."
mkdir -p src/lib/recovery

# 自动化模块
echo "📁 创建自动化模块..."
mkdir -p src/lib/automation

# 调度模块
echo "📁 创建调度模块..."
mkdir -p src/lib/scheduler

# 同步模块
echo "📁 创建同步模块..."
mkdir -p src/lib/sync

# 组件目录
echo "📁 创建组件目录..."
mkdir -p src/components/security
mkdir -p src/components/audio
mkdir -p src/components/vision
mkdir -p src/components/coordination
mkdir -p src/components/hitl
mkdir -p src/components/payment
mkdir -p src/components/subscription
mkdir -p src/components/monitoring
mkdir -p src/components/automation

# API 路由
echo "📁 创建 API 路由..."
mkdir -p src/app/api/security/audit
mkdir -p src/app/api/security/permissions
mkdir -p src/app/api/payment/checkout
mkdir -p src/app/api/payment/webhooks/stripe
mkdir -p src/app/api/subscription/create
mkdir -p src/app/api/subscription/cancel
mkdir -p src/app/api/subscription/usage
mkdir -p src/app/api/coordination/messages
mkdir -p src/app/api/coordination/tasks
mkdir -p src/app/api/monitoring/kpi
mkdir -p src/app/api/monitoring/alerts
mkdir -p src/app/api/automation/execute
mkdir -p src/app/api/automation/scripts

# 测试目录
echo "📁 创建测试目录..."
mkdir -p tests/security
mkdir -p tests/audio
mkdir -p tests/coordination
mkdir -p tests/payment
mkdir -p tests/e2e

# 文档目录
echo "📁 创建文档目录..."
mkdir -p docs/security
mkdir -p docs/audio
mkdir -p docs/payment
mkdir -p docs/coordination

# 脚本目录
echo "📁 创建脚本目录..."
mkdir -p scripts

echo ""
echo "✅ 项目结构设置完成！"
echo ""
echo "📊 统计："
echo "   - lib 模块：16 个"
echo "   - components 目录：9 个"
echo "   - API 路由：13 个"
echo "   - 测试目录：5 个"
echo "   - 文档目录：4 个"
echo ""
echo "🎯 下一步："
echo "   1. chmod +x setup-project-structure.sh"
echo "   2. ./setup-project-structure.sh"
echo "   3. npm install (安装新依赖)"
echo "   4. npm run dev (启动开发服务器)"
echo ""
