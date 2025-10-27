# 🚀 快速部署 - 3分钟上线

## 方法选择

你有两种方式部署 Karma Web App：

### 🌐 方法 A: Vercel Web 界面（最简单，推荐首次使用）
不需要命令行，完全可视化操作

### 💻 方法 B: Vercel CLI（快速，适合开发者）
命令行部署，一行命令搞定

---

## 🌐 方法 A: Web 界面部署（5分钟）

### Step 1: 准备 GitHub 仓库
```bash
# 如果还没有推送到 GitHub
git init
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin https://github.com/你的用户名/karma-web-app.git
git push -u origin main
```

### Step 2: 导入到 Vercel
1. 访问 https://vercel.com
2. 用 GitHub 账户登录
3. 点击 "Add New..." → "Project"
4. 导入 `karma-web-app` 仓库

### Step 3: 配置项目
- **Root Directory**: 设置为 `karma-web` ⚠️ 重要！
- **Framework**: Next.js (自动检测)

### Step 4: 添加环境变量
在 "Environment Variables" 中添加：
```
OPENAI_API_KEY = sk-proj-你的新key
OPENAI_MODEL = gpt-4
OPENAI_MAX_TOKENS = 2000
OPENAI_TEMPERATURE = 0.7
```

**⚠️ 重要**: 使用新的 API Key，不要使用已暴露的！

### Step 5: 部署
点击 "Deploy" 等待 2-3 分钟

### ✅ 完成！
你会得到一个 URL，例如：
```
https://karma-web-app.vercel.app
```

---

## 💻 方法 B: CLI 部署（3分钟）

### Step 1: 登录 Vercel
```bash
vercel login
```
选择 GitHub/Email 登录

### Step 2: 部署
```bash
# 进入项目目录
cd /Users/viveka/ClaudeAgentViveka/karma-web-app/karma-web

# 部署（首次会提示配置）
vercel
```

按照提示操作：
```
? Set up and deploy? [Y/n] y
? Which scope? 选择你的账户
? Link to existing project? [y/N] n
? What's your project's name? karma-web-app
? In which directory is your code located? ./
```

### Step 3: 添加环境变量
```bash
vercel env add OPENAI_API_KEY production
# 粘贴你的新 API key（⚠️ 不要使用已暴露的key）

vercel env add OPENAI_MODEL production
# 输入: gpt-4

vercel env add OPENAI_MAX_TOKENS production
# 输入: 2000

vercel env add OPENAI_TEMPERATURE production
# 输入: 0.7
```

### Step 4: 部署到生产环境
```bash
vercel --prod
```

### ✅ 完成！
CLI 会输出你的生产环境 URL

---

## 🔒 安全检查（必做！）

部署前运行：
```bash
npm run security:check
```

确保：
- ✅ 所有检查通过
- ⚠️ 如果 API Key 已暴露，必须先轮换（见下方）

---

## ⚠️ API Key 轮换（如果已暴露）

### 1. 撤销旧 Key
1. 访问 https://platform.openai.com/api-keys
2. 找到并删除旧的 key

### 2. 生成新 Key
1. 点击 "Create new secret key"
2. 命名: `karma-web-production`
3. 复制新 key（只显示一次！）

### 3. 更新本地
编辑 `.env.local`:
```bash
OPENAI_API_KEY=sk-proj-新的key
```

### 4. 更新 Vercel
- **Web 界面**: 项目设置 → Environment Variables → 编辑
- **CLI**: `vercel env rm OPENAI_API_KEY production` 然后重新添加

---

## 🎯 部署后验证

访问你的 URL，测试：
- [ ] 主页加载正常
- [ ] 导航工作
- [ ] GPT-4 对话功能（访问 /conversations）
- [ ] Avatar 管理（访问 /avatars）
- [ ] 设置页面（访问 /profile）

---

## 📊 监控使用情况

### Vercel Dashboard
https://vercel.com/dashboard
- 查看流量
- 查看错误日志
- 查看构建历史

### OpenAI Usage
https://platform.openai.com/usage
- 监控 API 花费
- 查看请求统计

---

## 🚨 常见问题

### Q: 构建失败
```bash
# 清理并重试
rm -rf node_modules .next
npm install
npm run build
```

### Q: API Key 不工作
1. 确认环境变量已设置
2. 验证 key 格式：`sk-proj-...`
3. 重新部署

### Q: 页面 404
确认 Root Directory 设置为 `karma-web`

---

## 📱 分享你的应用

部署成功后，你可以：
- 📧 通过邮件分享 URL
- 💬 在社交媒体分享
- 📲 生成 QR 码让手机扫描

---

## 🎉 成功！

你的 Karma Web App 现在已经：
- ✅ 可以通过外网访问
- ✅ 拥有 HTTPS 安全连接
- ✅ 全球 CDN 加速
- ✅ 自动持续部署

**分享你的成果吧！** 🌟

---

## 📚 需要帮助？

- 📖 完整指南: `DEPLOYMENT-GUIDE.md`
- 🔒 安全指南: `API-KEY-SECURITY-GUIDE.md`
- 💬 遇到问题？查看 [Vercel 文档](https://vercel.com/docs)

---

**快速参考**:
```bash
# 安全检查
npm run security:check

# 登录 Vercel
vercel login

# 部署到预览环境
vercel

# 部署到生产环境
vercel --prod

# 查看部署日志
vercel logs
```

祝你部署顺利！🚀
