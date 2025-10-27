# 🔐 OpenAI API Key 轮换指南

**⚠️ 紧急：你的 API Key 已暴露，需要立即轮换！**

---

## 🚨 安全问题

你的 OpenAI API Key 在之前的对话中被暴露：

```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx（已隐藏）
```

**风险**：
- ❌ 任何人都可以使用这个 Key
- ❌ 可能产生意外费用
- ❌ 账户安全受威胁

---

## ✅ 轮换步骤（3分钟完成）

### 步骤 1: 撤销旧 Key

1. 访问 OpenAI 平台：https://platform.openai.com/api-keys
2. 登录你的账户
3. 找到以 `sk-proj-3vS...` 开头的 Key
4. 点击 **"Revoke"** 或 **"删除"** 按钮
5. 确认撤销

### 步骤 2: 生成新 Key

1. 在同一页面点击 **"Create new secret key"**
2. 给 Key 起个名字（例如：`Karma-Web-App-Production`）
3. **重要**：设置权限为 **"All"** 或至少包含 **"Model capabilities"**
4. 点击 **"Create secret key"**
5. **立即复制新 Key**（只显示一次！）

### 步骤 3: 更新本地配置

打开你的 `.env.local` 文件并替换旧 Key：

```bash
# 旧的（已暴露，已撤销）
# OPENAI_API_KEY=sk-proj-xxxxxxxxxx（已隐藏）

# 新的（替换为你刚生成的）
OPENAI_API_KEY=sk-proj-YOUR_NEW_KEY_HERE
```

### 步骤 4: 重启开发服务器

```bash
# 停止当前运行的服务器（Ctrl+C）
# 然后重新启动
npm run dev
```

### 步骤 5: 测试新 Key

1. 访问 http://localhost:3000/conversations
2. 发送一条测试消息
3. 确认 GPT 能正常响应

---

## 🔒 安全最佳实践

### ✅ 应该做的

1. **永远不要**在代码中硬编码 API Key
2. **永远不要**提交 `.env.local` 到 Git
3. **使用**环境变量管理敏感信息
4. **定期轮换** API Key（每3-6个月）
5. **设置使用限额**（在 OpenAI 平台设置每月最大消费）
6. **监控使用情况**（定期检查 OpenAI 账单）

### ❌ 不应该做的

1. ❌ 在聊天、邮件、文档中分享 API Key
2. ❌ 截图包含 API Key 的界面
3. ❌ 把 Key 存储在公共可访问的地方
4. ❌ 使用同一个 Key 用于开发和生产环境
5. ❌ 给 Key 设置过高的权限

---

## 📝 我已为你做的安全配置

### 1. `.gitignore` 已更新

确保 `.env.local` 不会被提交到 Git：

```gitignore
# Environment variables
.env.local
.env.*.local
```

### 2. `.env.local.example` 模板

创建了示例文件，不包含真实 Key：

```bash
# OpenAI Configuration
OPENAI_API_KEY=sk-proj-your_key_here
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=2000
OPENAI_TEMPERATURE=0.7
```

---

## 🎯 检查清单

完成以下步骤后，打勾确认：

- [ ] 已访问 OpenAI 平台
- [ ] 已撤销旧的暴露 Key
- [ ] 已生成新的 API Key
- [ ] 已复制新 Key（只显示一次！）
- [ ] 已更新 `.env.local` 文件
- [ ] 已重启开发服务器
- [ ] 已测试新 Key 工作正常
- [ ] 已设置账户使用限额（推荐 $50/月）
- [ ] 已保存新 Key 到安全的密码管理器

---

## 💡 额外建议

### 生产环境

如果要部署到生产环境（Vercel/Netlify 等）：

1. **不要**在代码仓库中存储 Key
2. **使用**平台的环境变量功能：
   - Vercel: Settings → Environment Variables
   - Netlify: Site settings → Environment variables
3. **使用**不同的 Key 用于开发和生产环境

### 成本控制

在 OpenAI 平台设置使用限额：

1. 访问：https://platform.openai.com/account/billing/limits
2. 设置 **Hard limit**（硬限制）：$50/月（推荐）
3. 设置 **Soft limit**（软限制）：$30/月
4. 启用邮件提醒

### 监控使用

定期检查：
- 使用情况：https://platform.openai.com/usage
- 账单：https://platform.openai.com/account/billing/overview

---

## ❓ 常见问题

### Q: 撤销旧 Key 后会发生什么？

A: 所有使用旧 Key 的请求会立即失败（返回 401 错误）。这正是我们想要的！

### Q: 新 Key 什么时候生效？

A: 立即生效。生成后就可以使用。

### Q: 如果忘记复制新 Key 怎么办？

A: 无法再次查看，只能重新生成一个新的 Key。

### Q: 要通知团队成员吗？

A: 如果有其他开发者，需要安全地共享新 Key（使用加密的密码管理器，不要通过聊天/邮件）。

### Q: 开发环境和生产环境用同一个 Key 吗？

A: 不推荐。最好使用不同的 Key，方便独立管理和监控。

---

## 📞 需要帮助？

如果遇到问题：

1. **OpenAI 文档**：https://platform.openai.com/docs/guides/authentication
2. **OpenAI 支持**：https://help.openai.com/
3. **紧急问题**：立即撤销所有 Key，然后联系 OpenAI 支持

---

**重要提醒**：完成轮换后，请**立即删除**此文档中的旧 Key 记录！

**状态**: ⚠️ 待完成
**优先级**: 🔴 最高
**预计时间**: 3-5 分钟
