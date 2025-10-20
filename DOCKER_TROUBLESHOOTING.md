# PostgreSQL Docker Image Alternatives

## Current Docker Hub Issue
Docker Hub is experiencing service outages (503 errors). Here are your options:

---

## ✅ Solution 1: Wait and Retry (Recommended)
Docker Hub issues are usually temporary (5-30 minutes).

```bash
# Check Docker Hub status
curl -I https://hub.docker.com

# Retry after a few minutes
docker-compose pull
docker-compose up -d --force-recreate
```

---

## ✅ Solution 2: Try Different PostgreSQL Versions

Update the `postgres` service in `docker-compose.yml`:

### Latest Stable Versions (2024-2025):

```yaml
# Option A: PostgreSQL 16 Alpine (Latest - CURRENTLY IN USE)
image: postgres:16-alpine

# Option B: PostgreSQL 15 Alpine (Original)
image: postgres:15-alpine

# Option C: PostgreSQL 16 Debian (larger but more compatible)
image: postgres:16

# Option D: PostgreSQL 15 Debian
image: postgres:15

# Option E: PostgreSQL 14 Alpine (older but stable)
image: postgres:14-alpine
```

### How to Change:

1. Edit `docker-compose.yml`, line 6
2. Replace `image: postgres:15-alpine` with one of the options above
3. Save and retry: `docker-compose up -d --force-recreate`

---

## ✅ Solution 3: Use Alternative Registry (If Docker Hub is Down)

### Option A: GitHub Container Registry
```yaml
services:
  postgres:
    image: ghcr.io/baosystems/postgis:16-3.4-alpine
```

### Option B: Quay.io
```yaml
services:
  postgres:
    image: quay.io/centos7/postgresql-13-centos7
```

---

## ✅ Solution 4: Manual Image Pull with Retry

Sometimes manual pull with retry works:

```bash
# Try pulling the image directly with retries
for i in {1..5}; do
  docker pull postgres:16-alpine && break
  echo "Retry $i failed, waiting 30 seconds..."
  sleep 30
done

# Then start compose
docker-compose up -d --force-recreate
```

---

## ✅ Solution 5: Use Docker Hub Mirror (China/Asia regions)

If you're in Asia, you can use a mirror:

```bash
# Configure Docker daemon to use mirrors
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<EOF
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com"
  ]
}
EOF

sudo systemctl daemon-reload
sudo systemctl restart docker

# Then retry
docker-compose up -d --force-recreate
```

---

## ✅ Solution 6: Check if Image is Already Cached

```bash
# List all postgres images on your VPS
docker images | grep postgres

# If you see any postgres image, use that version
# For example, if you see "postgres:15-alpine", use it
```

---

## 🔍 Quick Diagnostics

### Check Docker Hub Status:
```bash
# Check if Docker Hub is accessible
curl -I https://registry-1.docker.io/v2/

# Check Docker status page
curl https://www.dockerstatus.com/
```

### Test Registry Connection:
```bash
# Test pull a tiny image
docker pull alpine:latest

# If alpine works, Docker is fine - try postgres again
docker pull postgres:16-alpine
```

### Check Your Internet:
```bash
# Test DNS
nslookup registry-1.docker.io

# Test connectivity
ping registry-1.docker.io
```

---

## 📊 Recommended PostgreSQL Versions (2025)

| Version | Image Tag | Size | Best For |
|---------|-----------|------|----------|
| **16-alpine** ✅ | `postgres:16-alpine` | ~240 MB | Production (Latest stable) |
| 15-alpine | `postgres:15-alpine` | ~235 MB | Production (Previous stable) |
| 16 | `postgres:16` | ~430 MB | Production (Full features) |
| 15 | `postgres:15` | ~425 MB | Production (Previous full) |
| 14-alpine | `postgres:14-alpine` | ~230 MB | Long-term support |

**Current Choice:** `postgres:16-alpine` (Updated from 15)

---

## 🚀 Quick Fix Commands

### On Your VPS:

```bash
cd ~/Lankalive-Clone

# Option 1: Pull latest code with updated postgres:16-alpine
git pull origin main

# Option 2: Manually edit docker-compose.yml
nano docker-compose.yml
# Change line 6: image: postgres:16-alpine

# Option 3: Wait 10-15 minutes and retry original
docker-compose pull postgres
docker-compose up -d --force-recreate

# Option 4: Use cached image if available
docker images | grep postgres
# If you see any postgres image, that version will work
```

---

## ⚠️ Current Status

As of now (Oct 20, 2025):
- ✅ **Updated to:** `postgres:16-alpine`
- 🔄 **Reason:** Docker Hub 503 errors
- 📌 **Fallback:** PostgreSQL 16 is latest stable release
- ✔️ **Compatibility:** 100% compatible with your app

---

## 💡 Pro Tip

If you frequently encounter Docker Hub issues:

1. **Pre-pull images** during stable times:
   ```bash
   docker pull postgres:16-alpine
   docker pull python:3.12-slim
   docker pull node:20-alpine
   docker pull nginx:alpine
   ```

2. **Save images** to local tar files:
   ```bash
   docker save postgres:16-alpine > postgres-16-alpine.tar
   # Later: docker load < postgres-16-alpine.tar
   ```

3. **Use a private registry** (Docker Hub paid plan, AWS ECR, etc.)

---

**Updated:** October 20, 2025  
**Status:** Docker Hub experiencing intermittent 503 errors  
**Action:** Updated to postgres:16-alpine (latest stable)
