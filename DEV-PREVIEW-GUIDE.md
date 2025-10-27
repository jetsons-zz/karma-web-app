# 🔧 开发调试阶段 - 外网访问指南

本指南专门针对**调试阶段**，让外网用户可以访问你正在开发的 Karma Web App。

---

## 🎯 调试阶段 vs 生产阶段

### 调试阶段（当前）
- ✅ 快速预览和测试
- ✅ 实时看到代码修改
- ✅ 可以随时重启
- ✅ 适合收集反馈
- ⚠️ 可能不稳定

### 生产阶段（正式发布）
- ✅ 稳定可靠
- ✅ 24/7 在线
- ✅ CDN 加速
- ✅ 自动扩展
- ⚠️ 需要完整测试

---

## 🚀 推荐方案：Vercel Preview（最简单）

这是**最适合调试阶段**的方案，部署后可以立即让外网用户访问。

### 优点
- ✅ 免费
- ✅ 3分钟上线
- ✅ 自动 HTTPS
- ✅ 全球访问
- ✅ 可以随时更新
- ✅ 每次推送自动部署新版本

### 快速部署步骤

#### 1. 登录 Vercel
```bash
vercel login
```

#### 2. 部署到预览环境（不是生产环境）
```bash
cd /Users/viveka/ClaudeAgentViveka/karma-web-app/karma-web

# 部署到预览环境（用于调试）
vercel
```

按照提示操作：
```
? Set up and deploy? Y
? Which scope? 选择你的账户
? Link to existing project? N
? What's your project's name? karma-web-dev
? In which directory is your code located? ./
```

#### 3. 添加环境变量
```bash
# 添加必需的环境变量
vercel env add OPENAI_API_KEY preview development
# 输入你的 API key

vercel env add OPENAI_MODEL preview development
# 输入: gpt-4

vercel env add OPENAI_MAX_TOKENS preview development
# 输入: 2000

vercel env add OPENAI_TEMPERATURE preview development
# 输入: 0.7
```

#### 4. 获取预览 URL
部署完成后，你会得到一个 URL，例如：
```
https://karma-web-dev-abc123.vercel.app
```

#### 5. 分享给用户
直接把这个 URL 发给外网用户测试！

### 更新代码后重新部署
```bash
# 修改代码后
git add .
git commit -m "Update features"

# 重新部署预览
vercel

# 或者推送到 GitHub（如果配置了自动部署）
git push
```

---

## 🌐 方案二：Vercel Dev + ngrok（实时调试）

如果你需要**实时看到代码修改**，使用这个方案。

### 什么是 ngrok？
ngrok 可以将你的本地开发服务器暴露到外网，非常适合实时调试。

### 安装 ngrok

#### macOS
```bash
brew install ngrok
```

#### 或者直接下载
```bash
# 访问 https://ngrok.com/download
# 下载并安装
```

### 使用步骤

#### 1. 启动本地开发服务器
```bash
cd /Users/viveka/ClaudeAgentViveka/karma-web-app/karma-web
npm run dev
```

你的应用运行在 `http://localhost:3000`

#### 2. 新开一个终端，启动 ngrok
```bash
ngrok http 3000
```

#### 3. 获取公网 URL
ngrok 会显示：
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3000
```

#### 4. 分享 URL
把 `https://abc123.ngrok.io` 发给用户即可！

### 优点
- ✅ **实时更新**：修改代码，用户立即看到
- ✅ 不需要重新部署
- ✅ 适合快速迭代
- ✅ 可以看到实时日志

### 缺点
- ⚠️ 需要保持电脑和服务器运行
- ⚠️ 免费版 URL 会变化（每次重启）
- ⚠️ 速度取决于你的网络

### ngrok 配置（可选）
```bash
# 注册 ngrok 账户以获得固定域名
ngrok config add-authtoken YOUR_AUTH_TOKEN

# 使用固定子域名（需要付费账户）
ngrok http 3000 --subdomain=karma-dev
```

---

## ⚡ 方案三：快速预览（临时链接）

使用 Vercel CLI 创建临时预览：

```bash
# 一键部署预览
vercel

# 部署完成后会显示预览 URL
```

每次运行都会创建新的预览链接，适合：
- 快速演示
- 收集反馈
- A/B 测试

---

## 📊 三种方案对比

| 方案 | 速度 | 稳定性 | 实时更新 | 费用 | 适用场景 |
|------|------|--------|----------|------|----------|
| **Vercel Preview** | ⚡⚡⚡ | ⭐⭐⭐⭐⭐ | ❌ 需重新部署 | 免费 | **推荐用于调试** |
| **ngrok** | ⚡⚡ | ⭐⭐⭐ | ✅ 实时 | 免费 | 实时调试 |
| **Vercel Dev** | ⚡⚡⚡ | ⭐⭐⭐⭐ | ❌ 需重新部署 | 免费 | 快速预览 |

---

## 🎯 推荐流程（调试阶段）

### 阶段 1: 初期开发（使用 ngrok）
```bash
# 启动开发服务器
npm run dev

# 另一个终端
ngrok http 3000

# 分享 ngrok URL 给测试用户
```

**优点**: 修改代码立即生效，适合快速迭代

---

### 阶段 2: 功能稳定（使用 Vercel Preview）
```bash
# 部署预览版本
vercel

# 分享 Vercel 预览 URL
```

**优点**: 更稳定，不依赖本地网络

---

### 阶段 3: 准备发布（部署生产环境）
```bash
# 部署到生产环境
vercel --prod
```

**优点**: 24/7 稳定运行

---

## 🔧 具体操作指南

### 立即让用户访问（推荐）

#### 使用 Vercel Preview（3分钟）

```bash
# 1. 进入项目目录
cd /Users/viveka/ClaudeAgentViveka/karma-web-app/karma-web

# 2. 登录 Vercel（首次）
vercel login

# 3. 部署预览
vercel

# 4. 复制显示的 URL，发给用户
```

就这么简单！

---

#### 使用 ngrok（实时调试）

```bash
# 终端 1: 启动开发服务器
cd /Users/viveka/ClaudeAgentViveka/karma-web-app/karma-web
npm run dev

# 终端 2: 启动 ngrok
ngrok http 3000

# 复制 ngrok 显示的 https URL，发给用户
```

---

## 📱 分享方式

拿到外网 URL 后，你可以：

### 1. 直接分享链接
```
嘿，试试我的新应用：
https://karma-web-dev.vercel.app
```

### 2. 生成 QR 码
访问 https://qr.io 输入你的 URL，生成 QR 码
用户扫码即可访问

### 3. 短链接
使用 bit.ly 或 tinyurl.com 缩短 URL

---

## 🔒 安全注意事项

### 调试阶段的安全措施

1. **API Key 保护**
```bash
# 确保使用环境变量
vercel env add OPENAI_API_KEY preview
```

2. **使用限制**
在 OpenAI 平台设置：
- 每月花费限制: $50
- 每日请求限制: 1000

3. **访问控制（可选）**
如果只想让特定用户访问：
```bash
# Vercel 支持密码保护
# 在项目设置中启用 "Password Protection"
```

4. **监控使用**
- Vercel Dashboard 查看流量
- OpenAI Dashboard 查看 API 使用

---

## 🐛 调试技巧

### 查看实时日志

#### Vercel 预览
```bash
vercel logs
```

#### 本地开发
```bash
# 开发服务器自动显示日志
npm run dev
```

### 常见问题排查

#### 1. 用户访问 404
```bash
# 检查 Root Directory 是否设置正确
# 应该是: karma-web
```

#### 2. API 不工作
```bash
# 检查环境变量
vercel env ls

# 重新添加环境变量
vercel env add OPENAI_API_KEY preview
```

#### 3. 页面加载慢
```bash
# 检查 Vercel 区域
# 中国用户建议使用国内服务器
```

---

## 📊 监控和反馈

### 收集用户反馈

1. **使用 Vercel Analytics**
```bash
# Vercel Dashboard 查看：
# - 页面访问量
# - 用户地理位置
# - 性能指标
```

2. **添加反馈入口**
在应用中添加反馈按钮，收集用户意见

3. **错误监控**
使用 Vercel 错误日志或 Sentry

---

## 🎉 快速开始清单

### 方式 A: Vercel Preview（推荐）
- [ ] 运行 `vercel login`
- [ ] 运行 `vercel`
- [ ] 添加环境变量
- [ ] 复制 URL 分享给用户

### 方式 B: ngrok 实时调试
- [ ] 安装 ngrok
- [ ] 运行 `npm run dev`
- [ ] 运行 `ngrok http 3000`
- [ ] 复制 URL 分享给用户

---

## 📚 相关文档

- 📘 `QUICK-DEPLOY.md` - 快速部署指南
- 📖 `DEPLOYMENT-GUIDE.md` - 完整部署指南
- 🔒 `API-KEY-SECURITY-GUIDE.md` - 安全指南

---

## 💡 最佳实践

### 调试阶段建议

1. **使用预览环境**
   - 不要直接部署到生产环境
   - 使用 `vercel` 而不是 `vercel --prod`

2. **频繁更新**
   - 收集反馈后快速迭代
   - 每次更新重新部署预览

3. **监控使用**
   - 关注 API 花费
   - 查看错误日志
   - 收集用户反馈

4. **保持沟通**
   - 告诉用户这是测试版本
   - 欢迎反馈和建议
   - 及时修复问题

---

## 🚀 现在就开始！

### 最快方式（2分钟）

```bash
cd /Users/viveka/ClaudeAgentViveka/karma-web-app/karma-web
vercel login
vercel
```

然后把显示的 URL 发给用户即可！

---

**祝你调试顺利！** 🎉

有任何问题，随时查看文档或运行 `vercel --help`。
