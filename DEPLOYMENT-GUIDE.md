# 🚀 Karma Web App 部署指南

本指南将帮助你将 Karma Web App 部署到 Vercel，使其可以通过外网访问。

---

## 📋 部署前准备

### 1. 环境要求
- ✅ Node.js 18+ 已安装
- ✅ npm 或 yarn 包管理器
- ✅ Git 已配置
- ✅ GitHub 账户（用于连接 Vercel）

### 2. 安全检查
在部署前，务必运行安全检查：
```bash
npm run security:check
```

确保所有检查通过，特别是：
- ✅ .env.local 未被 git 追踪
- ✅ OPENAI_API_KEY 已配置
- ⚠️ 如果 key 已暴露，请先轮换（参考 API-KEY-SECURITY-GUIDE.md）

---

## 🌐 方法一：使用 Vercel Web 界面（推荐）

这是最简单的部署方式，适合首次部署。

### 步骤 1: 创建 Vercel 账户

1. 访问 [Vercel](https://vercel.com)
2. 点击 "Sign Up"
3. 使用 GitHub 账户登录
4. 授权 Vercel 访问你的 GitHub

### 步骤 2: 推送代码到 GitHub

```bash
# 如果还没有创建 git 仓库
git init
git add .
git commit -m "Initial commit: Karma Web App ready for deployment"

# 创建 GitHub 仓库后
git remote add origin https://github.com/你的用户名/karma-web-app.git
git branch -M main
git push -u origin main
```

### 步骤 3: 在 Vercel 导入项目

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "Add New..." → "Project"
3. 选择 "Import Git Repository"
4. 找到你的 `karma-web-app` 仓库
5. 点击 "Import"

### 步骤 4: 配置项目

在 "Configure Project" 页面：

#### 基本设置
- **Project Name**: `karma-web-app` (或自定义)
- **Framework Preset**: Next.js (自动检测)
- **Root Directory**: `karma-web` ⚠️ 重要！

#### 构建设置
- **Build Command**: `npm run build` (自动填充)
- **Output Directory**: `.next` (自动填充)
- **Install Command**: `npm install` (自动填充)

#### 环境变量 ⚠️ 最重要
点击 "Environment Variables"，添加以下变量：

| Name | Value | Environment |
|------|-------|-------------|
| `OPENAI_API_KEY` | `sk-proj-你的新key` | Production, Preview, Development |
| `OPENAI_MODEL` | `gpt-4` | Production, Preview, Development |
| `OPENAI_MAX_TOKENS` | `2000` | Production, Preview, Development |
| `OPENAI_TEMPERATURE` | `0.7` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | (留空，Vercel自动设置) | - |

**⚠️ 安全提示**:
- 使用新生成的 API Key，不要使用已暴露的 key
- 在 OpenAI 平台设置使用限制（每月 $50）
- 启用账单警报

### 步骤 5: 部署

1. 点击 "Deploy"
2. 等待构建完成（通常 2-3 分钟）
3. 构建成功后，你会看到：
   - ✅ 构建日志
   - ✅ 部署预览
   - ✅ 生产环境 URL

### 步骤 6: 访问你的应用

部署成功后，你会获得：
- **生产环境**: `https://karma-web-app.vercel.app`
- **预览环境**: `https://karma-web-app-[hash].vercel.app`

🎉 恭喜！你的应用现在可以通过外网访问了！

---

## 💻 方法二：使用 Vercel CLI

这种方式更快，适合开发者。

### 步骤 1: 安装 Vercel CLI

```bash
# 全局安装
npm install -g vercel

# 或者使用 npx（无需安装）
npx vercel
```

### 步骤 2: 登录 Vercel

```bash
vercel login
```

选择登录方式（GitHub/GitLab/Bitbucket/Email）

### 步骤 3: 配置环境变量

在项目根目录创建 `.env.production`:
```bash
OPENAI_API_KEY=sk-proj-你的新key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

⚠️ 注意：不要提交 `.env.production` 到 git！

### 步骤 4: 部署到 Vercel

```bash
# 进入项目目录
cd karma-web

# 首次部署（会提示配置）
vercel

# 或直接部署到生产环境
vercel --prod
```

按照提示操作：
```
? Set up and deploy "~/karma-web"? [Y/n] y
? Which scope do you want to deploy to? 选择你的账户
? Link to existing project? [y/N] n
? What's your project's name? karma-web-app
? In which directory is your code located? ./
? Want to override the settings? [y/N] n
```

### 步骤 5: 设置环境变量

```bash
# 添加环境变量到 Vercel
vercel env add OPENAI_API_KEY production
# 粘贴你的 API key

vercel env add OPENAI_MODEL production
# 输入: gpt-4

# 重复其他环境变量...
```

### 步骤 6: 重新部署

```bash
vercel --prod
```

---

## 🔧 部署后配置

### 1. 自定义域名（可选）

在 Vercel Dashboard:
1. 进入你的项目
2. 点击 "Settings" → "Domains"
3. 添加自定义域名
4. 按照指示配置 DNS

### 2. 设置环境变量

在 Vercel Dashboard:
1. 进入项目 → "Settings" → "Environment Variables"
2. 添加或修改环境变量
3. 选择应用的环境（Production/Preview/Development）
4. 保存后重新部署

### 3. 配置 API 限制

在 OpenAI Platform:
1. 访问 [Usage Limits](https://platform.openai.com/account/limits)
2. 设置硬限制：每月 $50
3. 设置软限制：80% 时邮件提醒
4. 启用账单警报

---

## 📊 监控和管理

### 查看部署状态

访问 [Vercel Dashboard](https://vercel.com/dashboard)：
- 📈 查看构建日志
- 🔍 监控实时流量
- ⚡ 查看性能指标
- 📊 分析错误日志

### 查看 API 使用情况

访问 [OpenAI Usage](https://platform.openai.com/usage)：
- 💰 查看当前花费
- 📈 查看请求统计
- 🔍 分析使用趋势

### 回滚到之前的版本

在 Vercel Dashboard:
1. 进入项目 → "Deployments"
2. 找到想要回滚的版本
3. 点击 "..." → "Promote to Production"

---

## 🚨 常见问题

### Q1: 构建失败，提示找不到模块
**解决方案**:
```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

### Q2: API Key 不工作
**解决方案**:
1. 检查 Vercel 环境变量是否正确设置
2. 确保 key 以 `sk-proj-` 开头
3. 在 OpenAI 平台验证 key 是否有效
4. 重新部署：`vercel --prod`

### Q3: 页面显示 404
**解决方案**:
1. 确认 Root Directory 设置为 `karma-web`
2. 检查 `vercel.json` 配置是否正确
3. 重新部署

### Q4: 环境变量不生效
**解决方案**:
1. 在 Vercel Dashboard 确认变量已添加
2. 确保选择了正确的环境（Production）
3. 重新部署使变量生效

### Q5: 构建时间过长或超时
**解决方案**:
```bash
# 优化 next.config.ts
# 添加以下配置
export default {
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}
```

---

## 🔒 安全最佳实践

### 1. API Key 保护
- ✅ 使用 Vercel 环境变量，不要硬编码
- ✅ 定期轮换 API Key（建议每月）
- ✅ 设置使用限制和警报
- ✅ 监控异常使用

### 2. 环境分离
- **Production**: 生产环境，使用限制最严格
- **Preview**: 预览环境，用于测试新功能
- **Development**: 开发环境，本地开发使用

### 3. 访问控制（可选）
如果需要限制访问，可以使用 Vercel 的密码保护：
1. 项目设置 → "Deployment Protection"
2. 启用 "Password Protection"
3. 设置密码

---

## 📈 性能优化

### 1. 启用缓存
Vercel 自动为静态资源启用缓存，确保：
- Images 使用 Next.js Image 组件
- API 路由返回适当的缓存头

### 2. 代码分割
Next.js 自动进行代码分割，但可以优化：
```typescript
// 使用动态导入
const HeavyComponent = dynamic(() => import('./HeavyComponent'))
```

### 3. 图片优化
使用 Next.js Image 组件：
```typescript
import Image from 'next/image'

<Image
  src="/avatar.png"
  width={100}
  height={100}
  alt="Avatar"
/>
```

---

## 🔄 持续部署

Vercel 自动为每次 git push 创建预览部署：

1. **主分支** (main) → 生产环境
2. **其他分支** → 预览环境

### 设置自动部署

1. 在 Vercel Dashboard → 项目设置
2. "Git" → "Production Branch"
3. 选择 `main` 或 `master`
4. 每次推送都会自动部署

---

## 📱 移动端访问

部署后，你的应用自动支持移动端访问：
- 📱 iOS Safari
- 🤖 Android Chrome
- 💻 桌面浏览器

测试移动端：
1. 使用手机浏览器访问部署的 URL
2. 或在 Chrome DevTools 使用设备模拟器（F12 → Toggle Device Toolbar）

---

## 🎯 快速部署检查清单

部署前检查：
- [ ] 运行 `npm run security:check` 全部通过
- [ ] OpenAI API Key 已轮换（如果之前暴露）
- [ ] 代码已推送到 GitHub
- [ ] .env.local 未提交到 git
- [ ] package.json 中的依赖完整

Vercel 配置：
- [ ] Root Directory 设置为 `karma-web`
- [ ] 环境变量已添加
- [ ] Framework 选择 Next.js
- [ ] 构建命令正确

安全配置：
- [ ] OpenAI 使用限制已设置
- [ ] 账单警报已启用
- [ ] API Key 仅在 Vercel 环境变量中
- [ ] 监控已配置

---

## 🆘 获取帮助

### Vercel 支持
- 📖 [Vercel 文档](https://vercel.com/docs)
- 💬 [Vercel 社区](https://github.com/vercel/vercel/discussions)
- 📧 [Support](https://vercel.com/support)

### Next.js 支持
- 📖 [Next.js 文档](https://nextjs.org/docs)
- 💬 [Discord 社区](https://nextjs.org/discord)

### OpenAI 支持
- 📖 [OpenAI 文档](https://platform.openai.com/docs)
- 💬 [开发者论坛](https://community.openai.com)

---

## 📝 部署后验证

部署成功后，测试以下功能：

### 基础功能
- [ ] 主页加载正常
- [ ] 导航菜单工作
- [ ] 所有页面可访问

### 核心功能
- [ ] GPT-4 对话功能正常
- [ ] Avatar 创建流程正常
- [ ] 项目管理功能正常
- [ ] 设置页面可访问

### 性能测试
- [ ] 页面加载速度 < 3秒
- [ ] API 响应速度正常
- [ ] 图片加载正常

---

## 🎉 成功部署

如果一切顺利，你现在应该有：

✅ 一个可以通过外网访问的 URL
✅ 自动的 HTTPS 证书
✅ 全球 CDN 加速
✅ 自动的持续部署
✅ 实时监控和日志

**你的 Karma Web App 现在已经可以与全世界分享了！** 🌍

---

**文档版本**: 1.0
**最后更新**: 2025-10-26
**维护者**: Karma Development Team

祝你部署顺利！🚀
