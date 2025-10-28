#!/bin/bash

# Karma Backend Specification Package Script
# 打包后端开发规范和文档

set -e

echo "📦 开始打包后端规范..."

# 创建临时目录
TEMP_DIR="karma-backend-spec-delivery"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# 复制后端文档
echo "📖 复制后端文档..."
mkdir -p $TEMP_DIR/docs
cp -r docs/backend $TEMP_DIR/docs/
cp -r docs/api $TEMP_DIR/docs/
cp docs/README.md $TEMP_DIR/docs/

# 复制类型定义（与前端共享）
echo "📝 复制类型定义..."
mkdir -p $TEMP_DIR/types
cp src/types/api.ts $TEMP_DIR/types/

# 创建数据库 Schema 示例
echo "🗄️  创建数据库 Schema 示例..."
mkdir -p $TEMP_DIR/schemas

cat > $TEMP_DIR/schemas/database.sql << 'EOF'
-- Karma Database Schema
-- 参考: docs/backend/README.md

-- 用户表
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user',
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 设备表
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'offline',
  ip VARCHAR(45),
  mac VARCHAR(17) NOT NULL,
  serial_number VARCHAR(255) UNIQUE NOT NULL,
  firmware_version VARCHAR(50),
  last_heartbeat TIMESTAMPTZ,
  capabilities JSONB DEFAULT '{}',
  hardware JSONB DEFAULT '{}',
  network JSONB DEFAULT '{}',
  location JSONB,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_devices_user_id ON devices(user_id);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_serial_number ON devices(serial_number);

-- 设备文件表
CREATE TABLE device_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  path TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  size BIGINT NOT NULL,
  mime_type VARCHAR(255),
  extension VARCHAR(50),
  is_directory BOOLEAN DEFAULT false,
  parent_path TEXT,
  storage_url TEXT,
  thumbnail_url TEXT,
  checksum_md5 VARCHAR(32),
  checksum_sha256 VARCHAR(64),
  metadata JSONB DEFAULT '{}',
  permissions JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  modified_at TIMESTAMPTZ DEFAULT NOW(),
  accessed_at TIMESTAMPTZ
);

CREATE INDEX idx_files_device_id ON device_files(device_id);
CREATE INDEX idx_files_path ON device_files(device_id, path);
CREATE INDEX idx_files_type ON device_files(type);

-- 项目表
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active',
  progress INTEGER DEFAULT 0,
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_members (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);

-- AI 分身表
CREATE TABLE avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'idle',
  base_model VARCHAR(255),
  system_prompt TEXT,
  tools TEXT[] DEFAULT '{}',
  performance JSONB DEFAULT '{}',
  abilities JSONB DEFAULT '{}',
  earnings JSONB DEFAULT '{}',
  is_public BOOLEAN DEFAULT false,
  price DECIMAL(10, 2),
  rating DECIMAL(3, 2),
  review_count INTEGER DEFAULT 0,
  download_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_avatars_created_by ON avatars(created_by);
CREATE INDEX idx_avatars_public ON avatars(is_public) WHERE is_public = true;

-- 订阅表
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
EOF

# 创建 FastAPI 示例
echo "🐍 创建 FastAPI 示例..."
mkdir -p $TEMP_DIR/examples/fastapi

cat > $TEMP_DIR/examples/fastapi/requirements.txt << 'EOF'
fastapi==0.115.0
uvicorn[standard]==0.32.0
sqlalchemy==2.0.36
alembic==1.14.0
psycopg2-binary==2.9.10
pydantic==2.10.3
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.17
ag-ui==0.1.0
EOF

cat > $TEMP_DIR/examples/fastapi/main.py << 'EOF'
"""
Karma Backend - FastAPI 示例
参考: docs/backend/README.md
"""

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

app = FastAPI(title="Karma API")

# CORS 配置
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # 前端地址
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库依赖（示例）
def get_db():
    # 实现数据库连接
    pass

@app.get("/")
def root():
    return {"message": "Karma API v1.0"}

@app.get("/api/devices")
def get_devices(
    status: str = None,
    page: int = 1,
    page_size: int = 20,
    db: Session = Depends(get_db)
):
    """
    获取设备列表
    参考: docs/api/CONTRACT.md
    """
    # 实现查询逻辑
    return {
        "success": True,
        "data": {
            "devices": [],
            "total": 0,
            "page": page,
            "page_size": page_size,
        },
        "timestamp": 1698765432000,
    }

# 更多 API 端点...
# 参考 docs/api/CONTRACT.md 实现

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
EOF

# 创建 NestJS 示例
echo "🟢 创建 NestJS 示例..."
mkdir -p $TEMP_DIR/examples/nestjs

cat > $TEMP_DIR/examples/nestjs/package.json << 'EOF'
{
  "name": "karma-backend-nestjs",
  "version": "1.0.0",
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch"
  },
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^8.0.0",
    "@prisma/client": "^6.0.0",
    "ag-ui": "^0.1.0"
  }
}
EOF

# 创建后端专用 README
cat > $TEMP_DIR/README.md << 'EOF'
# Karma 后端 - 开发规范

## 📚 文档索引

### 必读文档

1. **`docs/backend/README.md`** (30 分钟)
   - 完整的后端开发指南
   - 技术栈选择
   - 数据库设计
   - API 实现示例
   - AG-UI 集成

2. **`docs/api/CONTRACT.md`** (30 分钟)
   - 前后端接口契约
   - 120+ API 端点定义
   - 请求/响应格式
   - 错误码定义
   - 工具定义

3. **`docs/api/AG-UI-PROTOCOL.md`** (20 分钟)
   - AG-UI 协议详解
   - 智能体交互模式
   - 事件类型定义
   - 集成示例

## 🚀 快速开始

### 技术栈选择

#### 选项 A: Python + FastAPI (推荐)

```bash
cd examples/fastapi
pip install -r requirements.txt
python main.py
```

访问 http://localhost:8000

#### 选项 B: Node.js + NestJS

```bash
cd examples/nestjs
npm install
npm run start:dev
```

访问 http://localhost:3000

### 数据库设计

```bash
# 查看 Schema
cat schemas/database.sql

# 执行迁移
psql -U postgres -d karma < schemas/database.sql
```

## 📋 开发任务

查看 `CHECKLIST.md` 中的后端开发检查清单

## 🔗 与前端协作

1. 前端使用 Mock API 独立开发
2. 后端参考接口契约开发 API
3. API 开发完成后提供测试环境地址
4. 前端关闭 Mock，连接真实后端
5. 联调测试，修复问题

## 📞 技术支持

- 查看文档: `docs/`
- 参考示例: `examples/`
- 类型定义: `types/api.ts`

祝开发顺利！🚀
EOF

# 创建检查清单
cat > $TEMP_DIR/CHECKLIST.md << 'EOF'
# 后端团队交接检查清单

## 文档阅读

- [ ] 收到完整规范包
- [ ] 阅读 `README.md`
- [ ] 阅读 `docs/backend/README.md` (完整)
- [ ] 阅读 `docs/api/CONTRACT.md` (重点！)
- [ ] 理解 AG-UI 协议 (`docs/api/AG-UI-PROTOCOL.md`)
- [ ] 查看数据库 Schema (`schemas/database.sql`)
- [ ] 浏览代码示例 (`examples/`)

## 技术选型

- [ ] 选择技术栈 (FastAPI / NestJS)
- [ ] 确认开发环境 (Python/Node.js 版本)
- [ ] 安装依赖包
- [ ] 配置数据库 (PostgreSQL)
- [ ] 配置 Redis (可选)
- [ ] 配置文件存储 (S3/MinIO)

## 数据库设计

- [ ] 理解数据库 Schema
- [ ] 创建数据库
- [ ] 执行迁移脚本
- [ ] 创建测试数据
- [ ] 验证表结构

## API 开发

- [ ] 理解 API 端点定义
- [ ] 理解请求/响应格式
- [ ] 理解错误码定义
- [ ] 创建项目结构
- [ ] 实现第一个 API (`GET /api/devices`)
- [ ] 测试 API 返回格式

## AG-UI 集成

- [ ] 安装 AG-UI SDK
- [ ] 理解智能体端点 (`POST /api/agent`)
- [ ] 理解事件类型
- [ ] 了解工具定义
- [ ] 准备 LangGraph/CrewAI 环境

## 测试与部署

- [ ] 编写单元测试
- [ ] 编写集成测试
- [ ] 配置 CI/CD
- [ ] 准备开发环境
- [ ] 准备测试环境

## 与前端协作

- [ ] 理解前端使用 Mock API
- [ ] 知道如何通知前端 API 就绪
- [ ] 准备 API 文档 (Swagger/OpenAPI)
- [ ] 制定联调计划

完成日期: ____________
确认人: ____________
EOF

# 打包
echo "🗜️  压缩打包..."
tar -czf karma-backend-spec-$(date +%Y%m%d).tar.gz $TEMP_DIR

echo "✅ 打包完成！"
echo "📦 输出文件: karma-backend-spec-$(date +%Y%m%d).tar.gz"
echo ""
echo "📋 包含内容:"
echo "  - 后端开发文档 (docs/backend/)"
echo "  - API 接口契约 (docs/api/)"
echo "  - 数据库 Schema (schemas/)"
echo "  - TypeScript 类型定义 (types/)"
echo "  - FastAPI 示例 (examples/fastapi/)"
echo "  - NestJS 示例 (examples/nestjs/)"
echo "  - 快速开始指南"
echo "  - 开发检查清单"
echo ""
echo "📤 发送方式:"
echo "  1. 上传到文件服务器"
echo "  2. 或通过邮件发送"
echo "  3. 或创建 GitHub Release"

# 清理临时目录（可选）
# rm -rf $TEMP_DIR
