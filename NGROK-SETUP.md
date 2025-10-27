# 🌐 ngrok 快速设置指南

基于 ngrok 实现外网访问，让用户可以实时访问你的开发环境。

---

## ✅ 已完成

- ✅ ngrok 已安装 (版本 3.31.0)
- ✅ 开发服务器已启动 (端口 3002)

---

## 🚀 快速开始（只需 3 步）

### 步骤 1: 注册 ngrok 账户（1分钟）

1. 访问 https://dashboard.ngrok.com/signup
2. 使用 GitHub 或 Google 账户登录（推荐）
3. 免费注册，无需信用卡

### 步骤 2: 获取认证令牌（30秒）

1. 登录后自动跳转到 https://dashboard.ngrok.com/get-started/your-authtoken
2. 复制你的 authtoken（看起来像：`2abc123def456ghi789jkl`）
3. 在终端运行：

```bash
ngrok config add-authtoken 你的authtoken
```

### 步骤 3: 启动 ngrok（10秒）

```bash
ngrok http 3002
```

**🎉 完成！你会看到外网访问 URL！**

---

## 📋 详细操作步骤

### 当前状态

你的开发服务器正在运行：
```
✅ Local:   http://localhost:3002
✅ Network: http://192.168.9.116:3002
```

现在需要通过 ngrok 将其暴露到外网。

---

## 🔧 完整操作命令

### 1. 配置 ngrok 认证

```bash
# 访问 https://dashboard.ngrok.com/get-started/your-authtoken
# 复制你的 authtoken 后运行：

ngrok config add-authtoken 你的authtoken
```

**示例**：
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl
```

### 2. 启动 ngrok 隧道

```bash
# 方式 A: 基本使用
ngrok http 3002

# 方式 B: 带域名标签（可选）
ngrok http 3002 --domain=karma-dev

# 方式 C: 指定区域（可选，中国用户推荐）
ngrok http 3002 --region=ap
```

### 3. 查看外网 URL

启动后，ngrok 会显示：

```
ngrok

Session Status                online
Account                       你的账户名 (Plan: Free)
Version                       3.31.0
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3002

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**你的外网 URL 就是**: `https://abc123.ngrok.io`

---

## 📱 分享给用户

### 复制 URL 并分享

```
嘿，来测试我的应用：
https://abc123.ngrok.io

功能：
✅ GPT-4 AI 对话
✅ Avatar 管理
✅ 项目协作
✅ 完整设置页面

欢迎反馈！
```

### 生成二维码（可选）

1. 访问 https://qr.io
2. 输入你的 ngrok URL
3. 下载二维码
4. 用户扫码即可访问

---

## 🎯 使用技巧

### 1. 查看实时流量

访问 ngrok Web 界面：
```
http://127.0.0.1:4040
```

可以看到：
- 📊 所有 HTTP 请求
- 🔍 请求详情
- 🐛 调试信息

### 2. 保持 ngrok 运行

ngrok 需要保持运行才能访问。如果关闭：
- ❌ 外网 URL 会失效
- ✅ 重新运行会得到新的 URL

### 3. 固定域名（可选，付费功能）

免费版每次启动 URL 会变化。如果需要固定 URL：
- 升级到付费版（$8/月）
- 获得固定子域名（例如：karma-dev.ngrok.io）

---

## 🔄 工作流程

### 典型的开发调试流程

#### 终端 1：开发服务器
```bash
cd /Users/viveka/ClaudeAgentViveka/karma-web-app/karma-web
npm run dev

# 服务器运行在 http://localhost:3002
# 修改代码会自动重新加载
```

#### 终端 2：ngrok
```bash
ngrok http 3002

# 复制显示的 URL 发给用户
```

#### 开发流程
1. 用户访问 ngrok URL
2. 你修改代码
3. Next.js 自动重新编译
4. 用户刷新页面看到更新
5. 收集反馈，继续迭代

---

## 🐛 常见问题

### Q1: ngrok 启动失败，提示需要认证
**解决方案**：
```bash
# 确保已配置 authtoken
ngrok config add-authtoken 你的token

# 检查配置
ngrok config check
```

### Q2: 用户访问很慢
**解决方案**：
```bash
# 使用离用户更近的区域
# 美国
ngrok http 3002 --region=us

# 欧洲
ngrok http 3002 --region=eu

# 亚太（推荐中国用户）
ngrok http 3002 --region=ap

# 澳大利亚
ngrok http 3002 --region=au
```

### Q3: URL 每次都变化
**情况说明**：
- 免费版每次启动 URL 会变化
- 这是正常的，重新发送新 URL 给用户即可
- 如需固定 URL，考虑升级到付费版

### Q4: 端口 3002 已被占用
**解决方案**：
```bash
# 查找占用端口的进程
lsof -ti:3002

# 停止该进程
kill $(lsof -ti:3002)

# 重新启动开发服务器
npm run dev
```

### Q5: 开发服务器崩溃
**解决方案**：
```bash
# 停止所有 node 进程
pkill -f "next dev"

# 重新启动
cd /Users/viveka/ClaudeAgentViveka/karma-web-app/karma-web
npm run dev
```

---

## ⚡ 快捷命令

### 一键启动脚本

创建 `start-dev.sh`:
```bash
#!/bin/bash

echo "🚀 启动 Karma Web App 开发环境..."

# 启动开发服务器
cd /Users/viveka/ClaudeAgentViveka/karma-web-app/karma-web
npm run dev &

# 等待服务器启动
sleep 5

# 启动 ngrok
echo "🌐 启动 ngrok 隧道..."
ngrok http 3002
```

使用：
```bash
chmod +x start-dev.sh
./start-dev.sh
```

---

## 📊 ngrok 免费版 vs 付费版

### 免费版（当前）
- ✅ 无限使用
- ✅ HTTPS 支持
- ✅ 基础功能完整
- ⚠️ URL 每次变化
- ⚠️ 有连接数限制（40连接/分钟）

### 付费版 ($8/月)
- ✅ 固定子域名
- ✅ 自定义域名
- ✅ 更多连接数
- ✅ IP 白名单
- ✅ 更多区域选择

**对于调试阶段，免费版完全够用！**

---

## 🔒 安全注意事项

### 1. API Key 保护
你的 `.env.local` 包含 OpenAI API Key，确保：
- ✅ 已设置使用限制（每月 $50）
- ✅ 监控 API 使用情况
- ✅ 定期检查账单

### 2. 访问控制
ngrok 免费版没有密码保护，任何人都能访问。如需保护：
- 付费版支持密码保护
- 或者只分享给信任的测试用户

### 3. 数据安全
- ✅ ngrok 使用 HTTPS 加密
- ✅ 所有流量都是安全的
- ✅ 不要在生产环境使用 ngrok

---

## 📈 监控和分析

### ngrok Web 界面

访问 http://127.0.0.1:4040 查看：

1. **请求历史**
   - 所有 HTTP 请求
   - 状态码统计
   - 响应时间

2. **请求详情**
   - Headers
   - Body
   - 响应内容

3. **重放请求**
   - 可以重新发送任何请求
   - 方便调试

---

## 🎉 准备就绪！

你现在有：
- ✅ ngrok 已安装
- ✅ 开发服务器运行中（端口 3002）
- ✅ 详细使用指南

### 下一步操作

#### 1. 配置认证（1分钟）
```bash
# 访问 https://dashboard.ngrok.com/get-started/your-authtoken
# 获取 authtoken 后运行：
ngrok config add-authtoken 你的token
```

#### 2. 启动 ngrok（10秒）
```bash
ngrok http 3002
```

#### 3. 分享 URL
复制显示的 `https://xxx.ngrok.io` 发给用户！

---

## 📚 相关资源

- 📘 ngrok 官方文档: https://ngrok.com/docs
- 📊 ngrok Dashboard: https://dashboard.ngrok.com
- 🔧 DEV-PREVIEW-GUIDE.md - 开发预览完整指南
- 🔒 API-KEY-SECURITY-GUIDE.md - 安全指南

---

## 🆘 需要帮助？

### ngrok 支持
- 文档: https://ngrok.com/docs
- 社区: https://github.com/inconshreveable/ngrok/issues

### Karma Web App 支持
查看项目文档：
- `DEV-PREVIEW-GUIDE.md`
- `README.md`

---

**现在就开始吧！** 🚀

运行这两条命令：
```bash
ngrok config add-authtoken 你的token
ngrok http 3002
```

用户就可以通过外网访问你的应用了！
