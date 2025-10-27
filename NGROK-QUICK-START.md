# 🚀 ngrok 外网访问 - 3步上线

## ✅ 当前状态

- ✅ ngrok 已安装 (版本 3.31.0)
- ✅ 开发服务器已启动 (http://localhost:3000)
- ✅ 准备就绪，只需配置 ngrok！

---

## 🎯 只需 3 步

### 第 1 步：注册 ngrok（1分钟）

访问并注册（免费）：
```
https://dashboard.ngrok.com/signup
```

推荐使用 GitHub 或 Google 账户登录

---

### 第 2 步：配置认证（30秒）

1. 登录后会自动跳转到认证页面
   或访问：https://dashboard.ngrok.com/get-started/your-authtoken

2. 复制你的 authtoken（类似：`2abc123def456ghi789jkl`）

3. 在终端运行：
```bash
ngrok config add-authtoken 你的authtoken
```

**示例**：
```bash
ngrok config add-authtoken 2abc123def456ghi789jkl
```

运行成功会显示：
```
Authtoken saved to configuration file: /Users/viveka/Library/Application Support/ngrok/ngrok.yml
```

---

### 第 3 步：启动 ngrok（10秒）

```bash
ngrok http 3000
```

**成功后你会看到**：
```
ngrok

Session Status                online
Account                       你的邮箱
Version                       3.31.0
Region                        United States (us)
Latency                       -
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok.io -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

---

## 🎉 完成！

你的外网访问 URL 是：
```
https://abc123.ngrok.io
```

**把这个 URL 发给用户即可！**

---

## 📱 分享方式

### 方式 1: 直接分享链接
```
嘿，来测试我的 Karma Web App：
https://abc123.ngrok.io

功能完整，欢迎试用和反馈！
```

### 方式 2: 生成二维码
1. 访问 https://qr.io
2. 输入你的 ngrok URL
3. 生成二维码
4. 用户扫码访问

---

## 🔧 使用技巧

### 查看实时流量

ngrok 启动后，访问：
```
http://127.0.0.1:4040
```

可以看到：
- 📊 所有 HTTP 请求
- 🔍 请求和响应详情
- 🐛 调试信息

### 实时调试流程

1. **用户访问** ngrok URL
2. **你修改代码**
3. **Next.js 自动重新编译**
4. **用户刷新页面看到更新**

不需要重新部署，修改立即生效！

---

## ⚡ 快捷脚本

我已经为你创建了启动脚本：

```bash
cd /Users/viveka/ClaudeAgentViveka/karma-web-app/karma-web
./start-ngrok.sh
```

---

## ⚠️ 注意事项

### 1. 保持运行
- ngrok 需要保持运行才能访问
- 关闭终端或电脑，URL 会失效

### 2. URL 会变化
- 免费版每次启动 URL 都不同
- 需要重新发送新 URL 给用户
- 如需固定 URL，考虑付费版（$8/月）

### 3. 性能
- 取决于你的网络速度
- 建议使用稳定的网络
- 中国用户可以使用亚太区域：`ngrok http 3000 --region=ap`

---

## 🐛 常见问题

### Q: 启动失败，提示需要认证
运行：
```bash
ngrok config add-authtoken 你的token
```

### Q: 端口 3000 被占用
开发服务器已经在 3000 端口运行，直接运行：
```bash
ngrok http 3000
```

### Q: 用户访问很慢
使用离用户更近的区域：
```bash
# 亚太地区（推荐中国用户）
ngrok http 3000 --region=ap

# 美国
ngrok http 3000 --region=us

# 欧洲
ngrok http 3000 --region=eu
```

---

## 📊 当前环境

```
✅ 开发服务器: http://localhost:3000
✅ 本地网络:   http://192.168.9.116:3000
⏳ 外网访问:   需要启动 ngrok
```

---

## 🚀 立即开始

### 完整命令流程

```bash
# 1. 配置认证（首次需要）
ngrok config add-authtoken 你的token

# 2. 启动 ngrok
ngrok http 3000

# 3. 复制显示的 URL，发给用户！
```

---

## 📚 更多帮助

- 📘 完整指南: `NGROK-SETUP.md`
- 🔧 开发预览: `DEV-PREVIEW-GUIDE.md`
- 🔒 安全指南: `API-KEY-SECURITY-GUIDE.md`

---

## 🎊 准备好了！

现在就运行：
```bash
ngrok config add-authtoken 你的token
ngrok http 3000
```

你的应用马上就能被外网用户访问了！🌍
