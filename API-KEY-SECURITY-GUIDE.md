# 🔐 API Key 安全处理指南

## ⚠️ 紧急情况说明

**当前状态**: OpenAI API Key 已在对话中暴露，需要立即轮换！

**暴露的 Key**: `sk-proj-3vS-xw0NDXRxRN0d_auFJ...` (已部分隐藏)

---

## 🚨 立即行动步骤

### 第一步: 撤销已暴露的 Key (5分钟内完成)

1. **访问 OpenAI 平台**:
   ```
   https://platform.openai.com/api-keys
   ```

2. **登录你的账户**

3. **找到已暴露的 Key**:
   - 查找名称或创建日期
   - 或直接查找以 `sk-proj-3vS-xw` 开头的 key

4. **点击删除/撤销**:
   - 点击 key 旁边的三个点 (...)
   - 选择 "Revoke" 或 "Delete"
   - 确认撤销

### 第二步: 生成新的 API Key

1. **在 OpenAI 平台上**:
   - 点击 "Create new secret key"
   - 输入名称 (例如: `karma-web-app-production`)
   - 选择权限 (建议: 仅限 API 访问)
   - 点击创建

2. **立即复制新 Key**:
   - ⚠️ Key 只显示一次，务必立即复制
   - 建议先保存到密码管理器

### 第三步: 更新本地配置

1. **打开 `.env.local` 文件**:
   ```bash
   code .env.local
   ```

2. **替换 API Key**:
   ```bash
   # 将旧的 key 替换为新生成的 key
   OPENAI_API_KEY=sk-proj-YOUR-NEW-KEY-HERE
   ```

3. **保存文件**

4. **重启开发服务器**:
   ```bash
   npm run dev
   ```

### 第四步: 验证配置

1. **测试对话功能**:
   - 访问 http://localhost:3000/conversations
   - 发送一条测试消息
   - 确认 AI 正常回复

2. **检查错误**:
   - 打开浏览器控制台 (F12)
   - 查看是否有 API 错误

---

## 🛡️ 安全最佳实践

### 1. 环境变量管理

#### ✅ 正确做法:
```bash
# .env.local (仅本地开发)
OPENAI_API_KEY=sk-proj-xxx

# 生产环境: 使用平台的环境变量设置
# Vercel: Project Settings > Environment Variables
# Netlify: Site Settings > Build & Deploy > Environment
```

#### ❌ 错误做法:
```bash
# ❌ 不要将 key 硬编码在代码中
const apiKey = "sk-proj-xxx";

# ❌ 不要提交 .env.local 到 git
git add .env.local  # 危险！

# ❌ 不要在客户端代码中使用
export const openaiKey = process.env.OPENAI_API_KEY; // 会暴露到浏览器
```

### 2. Git 安全配置

**检查 `.gitignore` 是否包含**:
```bash
# 环境变量文件
.env*
.env.local
.env.production
.env.development

# 敏感文件
*.pem
*.key
secrets/
credentials/
```

**验证文件未被追踪**:
```bash
# 检查 .env.local 是否被忽略
git status

# 如果显示 .env.local，立即移除
git rm --cached .env.local
git commit -m "Remove leaked env file"
```

### 3. 代码中的安全实践

#### ✅ 服务端使用 API Key:
```typescript
// ✅ 正确: 在 API Route 或服务端组件中使用
// src/app/api/chat/route.ts
export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY; // 仅服务端可访问
  // ...
}
```

#### ❌ 客户端暴露 API Key:
```typescript
// ❌ 错误: 客户端组件中使用
'use client';
export default function Chat() {
  const key = process.env.OPENAI_API_KEY; // 会暴露到浏览器！
}
```

### 4. 生产环境部署

#### Vercel 部署:
1. 进入项目设置
2. 找到 "Environment Variables"
3. 添加:
   - Name: `OPENAI_API_KEY`
   - Value: `sk-proj-your-new-key`
   - Environment: Production, Preview, Development

4. 重新部署项目

#### 其他平台类似步骤

---

## 🔍 安全检查清单

使用这个清单确保你的配置安全:

### 配置文件安全
- [ ] `.env.local` 包含在 `.gitignore` 中
- [ ] `.env.local` 不在 git 历史中
- [ ] `.env.local.example` 不包含真实 key
- [ ] 生产环境使用平台环境变量

### API Key 管理
- [ ] 已撤销暴露的 key
- [ ] 已生成新的 key
- [ ] 新 key 仅保存在安全位置
- [ ] 设置了 key 的使用限制

### 代码安全
- [ ] API key 仅在服务端使用
- [ ] 没有硬编码的敏感信息
- [ ] API 路由有适当的速率限制
- [ ] 错误消息不暴露敏感信息

### 访问控制
- [ ] 设置了 OpenAI API 使用限制
- [ ] 配置了费用警报
- [ ] 启用了 API 访问日志
- [ ] 定期审查 API 使用情况

---

## 🚀 自动化安全检查

运行我们提供的安全检查脚本:

```bash
npm run security:check
```

这会检查:
- 环境变量配置
- .gitignore 设置
- 敏感文件是否被追踪
- API key 格式是否正确

---

## 📊 OpenAI API 使用监控

### 设置使用限制:

1. **访问 OpenAI 账户设置**:
   ```
   https://platform.openai.com/account/limits
   ```

2. **设置硬限制** (Hard limit):
   - 每月最大花费: $50 (根据需求调整)
   - 每日最大请求数: 1000

3. **设置软限制** (Soft limit):
   - 达到 80% 时发送邮件警告

### 监控使用情况:

1. **查看使用统计**:
   ```
   https://platform.openai.com/usage
   ```

2. **按项目分离**:
   - 为不同环境创建不同的 key
   - 开发: `karma-dev`
   - 测试: `karma-staging`
   - 生产: `karma-production`

---

## 🔄 定期安全审计

### 每月检查:
- [ ] 审查 API 使用情况
- [ ] 检查异常请求
- [ ] 更新过期的 key
- [ ] 审查访问权限

### 每季度检查:
- [ ] 轮换所有 API keys
- [ ] 审查安全最佳实践
- [ ] 更新依赖包
- [ ] 进行安全漏洞扫描

---

## 📚 相关资源

### OpenAI 安全文档:
- [API Keys Best Practices](https://platform.openai.com/docs/guides/production-best-practices)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Safety Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)

### Next.js 环境变量:
- [Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)

### Git 安全:
- [Removing Sensitive Data](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository)

---

## ⚡ 快速参考

### 检查 .env.local 是否泄露:
```bash
git log --all --full-history --source -- .env.local
```

### 从 git 历史中移除:
```bash
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env.local" \
  --prune-empty --tag-name-filter cat -- --all
```

### 验证环境变量:
```bash
# 开发环境
npm run dev

# 检查是否正确加载
node -e "console.log(process.env.OPENAI_API_KEY ? '✓ Loaded' : '✗ Missing')"
```

---

## 🆘 紧急联系

如果发现 API Key 被滥用:

1. **立即撤销 Key**
2. **联系 OpenAI 支持**:
   - Email: support@openai.com
   - 说明情况: "API key compromised, usage spike detected"
3. **查看账单**:
   - https://platform.openai.com/account/billing
4. **请求退款** (如果有未授权使用)

---

## ✅ 完成确认

完成以下步骤后,在此打钩:

- [ ] 已撤销旧的 API Key
- [ ] 已生成新的 API Key
- [ ] 已更新 .env.local
- [ ] 已验证应用正常工作
- [ ] 已设置使用限制和警报
- [ ] 已运行安全检查脚本
- [ ] 已阅读安全最佳实践

**完成日期**: ___________

**检查者**: ___________

---

**版本**: 1.0
**创建日期**: 2025-10-26
**最后更新**: 2025-10-26
**负责人**: Security Team
