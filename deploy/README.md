# 生产部署

本项目使用 SQLite + Next.js standalone + PM2 部署，极致轻量，适合低配服务器。

## 部署流程

```
GitHub push → Actions 构建 → SCP 上传 → SSH 远程 → PM2 重启
```

## 服务器首次准备

1. 确保已安装 Node.js 22+、pnpm、PM2、Nginx
2. 将 `deploy/.env.example` 复制到部署目录，填入生产值
3. 以 root 运行 `bash deploy/setup.sh` 完成初始化
4. 编辑 `/etc/nginx/conf.d/next-blog.conf`，替换域名并配置 SSL 证书
5. 重启 Nginx：`systemctl reload nginx`

## GitHub Secrets

在仓库 **Settings → Secrets and variables → Actions** 创建：

| Secret | 说明 |
|---|---|
| `SSH_HOST` | 服务器 IP |
| `SSH_PORT` | SSH 端口（默认 22） |
| `SSH_USER` | 部署用户 |
| `SSH_PRIVATE_KEY` | 部署专用私钥 |
| `SSH_KNOWN_HOSTS` | 服务器主机指纹 |
| `DEPLOY_PATH` | 部署目录，如 `/opt/next-blog` |

## 服务器目录结构

```
/opt/next-blog/
├── .env              # 环境变量（手动创建）
├── standalone/       # Next.js standalone 构建产物（CI 自动更新）
└── standalone/data.db   # SQLite 数据库（自动迁移）
```

## 本地开发

```bash
# 设置环境变量 (apps/web/.env)
DATABASE_URL=file:./data.db

# 初始化数据库
pnpm --filter web prisma:generate
pnpm --filter web db:migrate:dev

# 启动开发服务器
pnpm --filter web dev
```
