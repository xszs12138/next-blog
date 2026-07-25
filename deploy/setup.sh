#!/bin/bash
# next-blog 服务器初始化脚本 (CentOS 8)
# 用法: sudo bash setup.sh
set -euo pipefail

APP_DIR="/opt/next-blog"

echo "=== 1. 检查依赖 ==="

# Node.js
if ! command -v node &> /dev/null; then
    echo "请先安装 Node.js 22+"
    exit 1
fi
echo "Node.js $(node -v)"

# pnpm
if ! command -v pnpm &> /dev/null; then
    echo "安装 pnpm..."
    npm install -g pnpm
fi
echo "pnpm $(pnpm -v)"

# PM2
if ! command -v pm2 &> /dev/null; then
    echo "安装 PM2..."
    npm install -g pm2
fi
echo "PM2 $(pm2 -v)"

# Prisma CLI (用于数据库迁移)
if ! command -v prisma &> /dev/null; then
    echo "安装 Prisma CLI..."
    npm install -g prisma
fi
echo "Prisma $(prisma -v)"

# Nginx
if ! command -v nginx &> /dev/null; then
    echo "安装 Nginx..."
    dnf install -y nginx
    systemctl enable nginx
fi

echo ""
echo "=== 2. 创建目录 ==="
mkdir -p "$APP_DIR"

echo ""
echo "=== 3. 配置 Nginx ==="
cat > /etc/nginx/conf.d/next-blog.conf << 'NGINX'
# HTTP → HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name blog.tjausbj.com.cn;
    return 301 https://$host$request_uri;
}

# HTTPS
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name blog.tjausbj.com.cn;

    ssl_certificate     /etc/nginx/ssl/blog.tjausbj.com.cn/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/blog.tjausbj.com.cn/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    add_header Strict-Transport-Security "max-age=63072000" always;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
NGINX
echo "Nginx 配置已写入 /etc/nginx/conf.d/next-blog.conf"
echo "请将 SSL 证书放置到 /etc/nginx/ssl/blog.tjausbj.com.cn/"
echo "然后运行: systemctl reload nginx"

echo ""
echo "=== 4. 防火墙 ==="
if command -v firewall-cmd &> /dev/null; then
    firewall-cmd --permanent --add-service=http 2>/dev/null || true
    firewall-cmd --permanent --add-service=https 2>/dev/null || true
    firewall-cmd --reload 2>/dev/null || true
    echo "防火墙已开放 80/443 端口"
fi

echo ""
echo "=== 5. PM2 自启动 ==="
pm2 startup systemd -u "$(whoami)" --hp "$HOME" 2>/dev/null || true

echo ""
echo "=== 初始化完成 ==="
echo "下一步:"
echo "1. 上传 SSL 证书到 /etc/nginx/ssl/blog.tjausbj.com.cn/"
echo "2. 运行: systemctl reload nginx"
echo "3. 创建 $APP_DIR/.env (参考 deploy/.env.example)"
echo "4. 推送代码触发 GitHub Actions 部署"
