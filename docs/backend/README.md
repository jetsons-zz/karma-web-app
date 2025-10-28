# Karma Web App - 后端开发指南

> **协议**: AG-UI (Agent-User Interaction Protocol)
> **推荐技术栈**: Python + FastAPI / Node.js + NestJS
> **更新日期**: 2025-10-28

---

## 📋 目录

- [快速开始](#快速开始)
- [技术栈选择](#技术栈选择)
- [数据库设计](#数据库设计)
- [API 实现](#api-实现)
- [AG-UI 集成](#ag-ui-集成)
- [智能体开发](#智能体开发)
- [认证与授权](#认证与授权)
- [部署架构](#部署架构)

---

## 快速开始

### 前置要求

后端团队需要实现以下内容：

1. **RESTful API 端点** (参考 [接口契约](../api/CONTRACT.md))
2. **AG-UI 智能体端点** (`POST /api/agent`)
3. **数据库设计与实现**
4. **认证与授权系统**
5. **文件存储服务**
6. **实时通信 (WebSocket)**

---

## 技术栈选择

### 方案 A: Python + FastAPI (推荐 AI 场景)

**优势**:
- AI 生态丰富 (LangChain, LangGraph, CrewAI)
- AG-UI 有官方 Python SDK
- 异步性能优秀

**技术栈**:

```yaml
框架: FastAPI
ORM: SQLAlchemy + Alembic
数据库: PostgreSQL
缓存: Redis
任务队列: Celery / Dramatiq
智能体: LangGraph / CrewAI
文件存储: AWS S3 / MinIO
实时通信: FastAPI WebSocket
认证: FastAPI-Users / Authlib
```

**目录结构**:

```
karma-backend/
├── app/
│   ├── main.py                 # FastAPI 应用入口
│   ├── api/
│   │   ├── v1/
│   │   │   ├── devices.py     # 设备 API
│   │   │   ├── files.py       # 文件 API
│   │   │   ├── projects.py    # 项目 API
│   │   │   ├── avatars.py     # 分身 API
│   │   │   └── subscriptions.py
│   │   └── agent.py           # AG-UI 智能体端点
│   ├── models/                # 数据库模型
│   │   ├── device.py
│   │   ├── user.py
│   │   └── ...
│   ├── schemas/               # Pydantic Schemas
│   │   ├── device.py
│   │   └── ...
│   ├── agents/                # 智能体逻辑
│   │   ├── task_agent.py
│   │   ├── device_agent.py
│   │   └── tools/
│   │       ├── database.py
│   │       ├── device_control.py
│   │       └── ...
│   ├── services/              # 业务逻辑
│   ├── core/                  # 核心配置
│   │   ├── config.py
│   │   ├── security.py
│   │   └── database.py
│   └── utils/
├── migrations/                # 数据库迁移
├── tests/
├── requirements.txt
└── .env
```

---

### 方案 B: Node.js + NestJS

**优势**:
- 与前端同语言 (TypeScript)
- 团队技术栈统一

**技术栈**:

```yaml
框架: NestJS
ORM: Prisma
数据库: PostgreSQL
缓存: Redis
任务队列: BullMQ
智能体: LangChain.js / Mastra
文件存储: AWS S3
实时通信: Socket.io
认证: Passport.js
```

**目录结构**:

```
karma-backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── modules/
│   │   ├── devices/
│   │   │   ├── devices.controller.ts
│   │   │   ├── devices.service.ts
│   │   │   ├── devices.module.ts
│   │   │   └── entities/device.entity.ts
│   │   ├── files/
│   │   ├── projects/
│   │   ├── avatars/
│   │   └── agent/           # AG-UI 智能体
│   │       ├── agent.controller.ts
│   │       ├── agent.service.ts
│   │       └── tools/
│   ├── common/
│   │   ├── guards/
│   │   ├── interceptors/
│   │   └── filters/
│   └── config/
├── prisma/
│   └── schema.prisma
├── package.json
└── .env
```

---

## 数据库设计

### 核心表结构

#### 1. users (用户表)

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar TEXT,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'user', -- admin, user
  email_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

#### 2. devices (设备表)

```sql
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  model VARCHAR(50) NOT NULL, -- EOS-3A, EOS-3B, EOS-3C
  status VARCHAR(50) DEFAULT 'offline', -- online, offline, error, updating
  ip VARCHAR(45),
  mac VARCHAR(17) NOT NULL,
  serial_number VARCHAR(255) UNIQUE NOT NULL,
  firmware_version VARCHAR(50),
  last_heartbeat TIMESTAMPTZ,

  -- JSON fields
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
```

---

#### 3. device_files (设备文件表)

```sql
CREATE TABLE device_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  path TEXT NOT NULL,
  type VARCHAR(50) NOT NULL, -- document, image, video, ...
  category VARCHAR(50) NOT NULL, -- task_output, media, config, ...
  size BIGINT NOT NULL,
  mime_type VARCHAR(255),
  extension VARCHAR(50),
  is_directory BOOLEAN DEFAULT false,
  parent_path TEXT,

  -- 文件存储
  storage_url TEXT, -- S3/MinIO URL
  thumbnail_url TEXT,
  checksum_md5 VARCHAR(32),
  checksum_sha256 VARCHAR(64),

  -- 元数据
  metadata JSONB DEFAULT '{}',
  permissions JSONB DEFAULT '{}',

  created_at TIMESTAMPTZ DEFAULT NOW(),
  modified_at TIMESTAMPTZ DEFAULT NOW(),
  accessed_at TIMESTAMPTZ
);

CREATE INDEX idx_files_device_id ON device_files(device_id);
CREATE INDEX idx_files_path ON device_files(device_id, path);
CREATE INDEX idx_files_type ON device_files(type);
```

---

#### 4. projects (项目表)

```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'active', -- active, paused, completed, archived
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  owner_id UUID NOT NULL REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE project_members (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role VARCHAR(50) DEFAULT 'member', -- owner, admin, member, viewer
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);
```

---

#### 5. avatars (AI 分身表)

```sql
CREATE TABLE avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES users(id),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  skills TEXT[] DEFAULT '{}',
  status VARCHAR(50) DEFAULT 'idle', -- idle, working, error

  -- 配置
  base_model VARCHAR(255), -- gpt-4o, claude-3-opus, ...
  system_prompt TEXT,
  tools TEXT[] DEFAULT '{}',

  -- 性能数据
  performance JSONB DEFAULT '{}',
  abilities JSONB DEFAULT '{}',
  earnings JSONB DEFAULT '{}',

  -- 商店信息
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
```

---

#### 6. subscriptions (订阅表)

```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan VARCHAR(50) NOT NULL, -- free, pro, team, enterprise
  status VARCHAR(50) NOT NULL, -- active, canceled, past_due, trialing
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,

  -- Stripe
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_id ON subscriptions(stripe_subscription_id);
```

---

## API 实现

### 1. RESTful API 示例 (FastAPI)

#### 设备列表 API

```python
# app/api/v1/devices.py
from fastapi import APIRouter, Depends, Query
from typing import Optional
from app.schemas.device import DeviceResponse, DeviceListResponse
from app.services.device_service import DeviceService
from app.core.auth import get_current_user

router = APIRouter(prefix="/devices", tags=["devices"])

@router.get("", response_model=DeviceListResponse)
async def get_devices(
    status: Optional[str] = Query(None),
    model: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort: str = Query("created_at"),
    order: str = Query("desc"),
    current_user = Depends(get_current_user),
    device_service: DeviceService = Depends()
):
    """获取设备列表"""
    devices, total = await device_service.list_devices(
        user_id=current_user.id,
        status=status,
        model=model,
        page=page,
        page_size=page_size,
        sort=sort,
        order=order
    )

    return {
        "success": True,
        "data": {
            "devices": devices,
            "total": total,
            "page": page,
            "page_size": page_size
        },
        "timestamp": int(time.time() * 1000)
    }
```

---

#### 创建设备 API

```python
@router.post("", response_model=DeviceResponse, status_code=201)
async def create_device(
    data: CreateDeviceRequest,
    current_user = Depends(get_current_user),
    device_service: DeviceService = Depends()
):
    """创建新设备"""
    device = await device_service.create_device(
        user_id=current_user.id,
        data=data
    )

    return {
        "success": True,
        "data": {"device": device},
        "timestamp": int(time.time() * 1000)
    }
```

---

### 2. 错误处理

```python
# app/core/exceptions.py
from fastapi import HTTPException, status

class KarmaException(HTTPException):
    def __init__(self, code: str, message: str, details: dict = None):
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": code,
                "message": message,
                "details": details or {}
            }
        )

class DeviceNotFoundException(KarmaException):
    def __init__(self, device_id: str):
        super().__init__(
            code="NOT_FOUND",
            message=f"Device {device_id} not found"
        )

class UnauthorizedException(KarmaException):
    def __init__(self):
        super().__init__(
            code="UNAUTHORIZED",
            message="Authentication required"
        )
```

---

## AG-UI 集成

### 1. 安装 AG-UI SDK (Python)

```bash
pip install ag-ui
```

### 2. 实现智能体端点

```python
# app/api/agent.py
from fastapi import APIRouter, Depends, Request
from fastapi.responses import StreamingResponse
from ag_ui import AgentRuntime
from app.agents.task_agent import create_task_agent
from app.core.auth import get_current_user

router = APIRouter()

@router.post("/agent")
async def agent_endpoint(
    request: Request,
    current_user = Depends(get_current_user)
):
    """AG-UI 智能体端点"""
    body = await request.json()
    messages = body.get("messages", [])
    state = body.get("state", {})
    tools = body.get("tools", [])
    context = body.get("context", {})

    # 创建智能体运行时
    runtime = AgentRuntime(
        agent=create_task_agent(user_id=current_user.id),
        tools=get_tools(tools),
        initial_state={
            **state,
            "user": {
                "id": current_user.id,
                "name": current_user.name,
                "avatar": current_user.avatar
            }
        }
    )

    # 返回 SSE 流
    async def event_generator():
        async for event in runtime.run(messages):
            yield f"data: {event.to_json()}\n\n"
        yield "data: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive"
        }
    )
```

---

### 3. 定义工具 (Tools)

```python
# app/agents/tools/database.py
from ag_ui import tool
from app.services.device_service import DeviceService

@tool(
    name="searchDatabase",
    description="在数据库中搜索项目、任务、设备等",
    execution="backend"
)
async def search_database(
    query: str,
    type: str = "device",
    limit: int = 10
):
    """搜索数据库工具"""
    if type == "device":
        service = DeviceService()
        results = await service.search(query, limit=limit)
        return {"results": results}
    elif type == "project":
        # ...
        pass
    else:
        raise ValueError(f"Unknown type: {type}")
```

```python
# app/agents/tools/device_control.py
from ag_ui import tool
from app.services.device_service import DeviceService

@tool(
    name="controlDevice",
    description="发送控制指令到指定设备",
    execution="backend"
)
async def control_device(
    device_id: str,
    command: str,
    params: dict = None
):
    """设备控制工具"""
    service = DeviceService()
    device = await service.get_device(device_id)

    if not device:
        raise ValueError(f"Device {device_id} not found")

    # 发送指令到设备 (通过 MQTT/WebSocket)
    result = await service.send_command(device, command, params)

    return {
        "success": True,
        "device_id": device_id,
        "command": command,
        "result": result
    }
```

---

## 智能体开发

### 1. 使用 LangGraph (推荐)

```python
# app/agents/task_agent.py
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from app.agents.tools import get_all_tools

def create_task_agent(user_id: str):
    """创建任务协作智能体"""

    # 定义状态
    class AgentState:
        messages: list
        current_task: str | None
        devices: list
        projects: list

    # 定义节点
    async def analyze_task(state: AgentState):
        """分析任务需求"""
        llm = ChatOpenAI(model="gpt-4o")
        response = await llm.ainvoke(state["messages"])
        return {"messages": state["messages"] + [response]}

    async def assign_device(state: AgentState):
        """分配设备"""
        # 调用工具
        tool = get_tool("searchDatabase")
        devices = await tool(query="online devices", type="device")
        return {"devices": devices}

    # 构建图
    workflow = StateGraph(AgentState)
    workflow.add_node("analyze", analyze_task)
    workflow.add_node("assign", assign_device)
    workflow.add_edge("analyze", "assign")
    workflow.add_edge("assign", END)
    workflow.set_entry_point("analyze")

    return workflow.compile()
```

---

### 2. 集成到 AG-UI

```python
# app/api/agent.py
from app.agents.task_agent import create_task_agent

runtime = AgentRuntime(
    agent=create_task_agent(user_id=current_user.id),
    tools=[search_database, control_device, assign_task],
    initial_state=state
)
```

---

## 认证与授权

### 1. JWT 认证

```python
# app/core/security.py
from datetime import datetime, timedelta
from jose import jwt, JWTError
from passlib.context import CryptContext

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None
```

---

### 2. 依赖注入

```python
# app/core/auth.py
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.core.security import verify_token
from app.models.user import User

security = HTTPBearer()

async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> User:
    token = credentials.credentials
    payload = verify_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )

    user_id = payload.get("sub")
    user = await User.get(id=user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
```

---

## 部署架构

### 推荐架构

```
┌─────────────────────────────────────────────────┐
│              Vercel (Next.js 前端)              │
└──────────────────┬──────────────────────────────┘
                   │ HTTPS
┌──────────────────▼──────────────────────────────┐
│          API Gateway / Load Balancer            │
│              (Nginx / Cloudflare)               │
└──────┬───────────────────────────────┬──────────┘
       │                               │
┌──────▼────────┐            ┌─────────▼─────────┐
│  FastAPI App  │◄───────────┤    Redis Cache    │
│  (Backend)    │            └───────────────────┘
└───────┬───────┘
        │
┌───────▼────────────────────────────────────────┐
│            PostgreSQL Database                 │
│          (RDS / Managed Service)               │
└────────────────────────────────────────────────┘
        │
┌───────▼────────┐
│   AWS S3       │  (文件存储)
└────────────────┘
```

---

### 环境变量

```bash
# .env
DATABASE_URL=postgresql://user:pass@localhost:5432/karma
REDIS_URL=redis://localhost:6379/0

# JWT
SECRET_KEY=your-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI
OPENAI_API_KEY=sk-...

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=karma-files

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

## 下一步

1. 📖 阅读 [API 接口契约](../api/CONTRACT.md)
2. 🔧 参考 [AG-UI 协议文档](../api/AG-UI-PROTOCOL.md)
3. 💻 查看 [前端开发文档](../frontend/README.md)
4. 🏗️ 设计数据库 Schema
5. 🚀 实现核心 API 端点

---

## 相关资源

- FastAPI 文档: https://fastapi.tiangolo.com
- AG-UI Python SDK: https://docs.ag-ui.com/python
- LangGraph 文档: https://langchain-ai.github.io/langgraph
- PostgreSQL 文档: https://www.postgresql.org/docs
