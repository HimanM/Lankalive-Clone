# Docker Compose ContainerConfig Error Fix

## 🔍 Error Diagnosed

```
KeyError: 'ContainerConfig'
```

This error occurs when using **old docker-compose version (1.29.2)** with newer Docker images.

---

## ✅ Solution 1: Upgrade Docker Compose (Recommended)

### Remove old docker-compose and install latest:

```bash
# Remove old docker-compose
sudo rm /usr/bin/docker-compose
sudo rm /usr/local/bin/docker-compose

# Install Docker Compose V2 (plugin version)
sudo apt update
sudo apt install docker-compose-plugin -y

# Verify installation
docker compose version

# Should show: Docker Compose version v2.x.x
```

### Update commands to use new syntax:

```bash
# Old command: docker-compose up -d
# New command: docker compose up -d (no hyphen)

# Test it
cd ~/Lankalive-Clone
docker compose up -d
```

---

## ✅ Solution 2: Clean State and Recreate

If you want to keep using old docker-compose, clean everything first:

```bash
cd ~/Lankalive-Clone

# Stop and remove EVERYTHING (including volumes)
docker-compose down -v --remove-orphans

# Remove all containers
docker rm -f $(docker ps -aq) 2>/dev/null || true

# Remove dangling images
docker image prune -f

# Remove old postgres image specifically
docker rmi postgres:16-alpine 2>/dev/null || true
docker rmi postgres:15-alpine 2>/dev/null || true

# Pull fresh images
docker-compose pull

# Start fresh
docker-compose up -d --force-recreate
```

---

## ✅ Solution 3: Use Docker Compose V2 Directly

Download and use standalone Docker Compose V2:

```bash
# Download latest Docker Compose V2
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Make it executable
sudo chmod +x /usr/local/bin/docker-compose

# Verify
docker-compose version

# Should now show v2.x.x
```

---

## 🚀 Quick Fix Script

Run this on your VPS:

```bash
#!/bin/bash
set -e

echo "🔧 Fixing Docker Compose ContainerConfig Error"
echo "=============================================="

cd ~/Lankalive-Clone

# Step 1: Stop everything
echo "🛑 Stopping containers..."
docker-compose down -v --remove-orphans 2>/dev/null || true

# Step 2: Clean up
echo "🧹 Cleaning up..."
docker rm -f lankalive_postgres lankalive_backend lankalive_frontend 2>/dev/null || true
docker volume rm lankalive-clone_postgres_data 2>/dev/null || true

# Step 3: Install Docker Compose V2
echo "📦 Installing Docker Compose V2..."
sudo apt update
sudo apt install -y docker-compose-plugin

# Step 4: Use new docker compose command
echo "🚀 Starting with Docker Compose V2..."
docker compose pull
docker compose up -d --build --force-recreate

# Step 5: Check status
echo ""
echo "📊 Checking status..."
sleep 5
docker compose ps

echo ""
echo "✅ Fix applied!"
echo "From now on, use: docker compose (not docker-compose)"
```

---

## 🔄 Update GitHub Actions Workflow

Update `.github/workflows/deploy.yml` to use `docker compose`:

Find and replace all instances:
- `docker-compose` → `docker compose`

Or add this at the beginning of the script section:

```yaml
# Check if docker compose V2 is available, install if needed
if ! command -v docker compose &> /dev/null; then
  echo "Installing Docker Compose V2..."
  sudo apt update
  sudo apt install -y docker-compose-plugin
fi
```

---

## 📝 After Fix: Update Commands

### Old Commands (docker-compose v1):
```bash
docker-compose up -d
docker-compose down
docker-compose ps
docker-compose logs
docker-compose build
```

### New Commands (docker compose v2):
```bash
docker compose up -d
docker compose down
docker compose ps
docker compose logs
docker compose build
```

**Note:** No hyphen between `docker` and `compose` in v2!

---

## 🧪 Verify Fix

After applying fix:

```bash
# 1. Check docker compose version
docker compose version

# 2. Start services
cd ~/Lankalive-Clone
docker compose up -d

# 3. Verify all containers running
docker compose ps

# 4. Check logs for errors
docker compose logs

# 5. Test application
curl http://localhost:8000/api/articles
curl http://localhost:49155
```

---

## 🔍 Root Cause

The error happens because:

1. **Old docker-compose (v1.29.2)** uses outdated Docker API
2. **Newer Docker images** use different metadata structure
3. Old docker-compose expects `ContainerConfig` key that doesn't exist in new images

**Solution:** Upgrade to Docker Compose V2 which is compatible with modern Docker.

---

## ⚠️ Important Notes

### If using Docker Compose V2:

1. **Command changes:** `docker-compose` → `docker compose` (no hyphen)
2. **Backward compatible:** Most docker-compose.yml files work without changes
3. **Performance:** V2 is faster and more stable
4. **Support:** V1 is deprecated, V2 is actively maintained

### Your deployment workflow needs update:

In `.github/workflows/deploy.yml`, replace:
```bash
docker-compose build
docker-compose up -d
docker-compose ps
docker-compose logs
```

With:
```bash
docker compose build
docker compose up -d
docker compose ps
docker compose logs
```

---

## 🆘 Troubleshooting

### Issue: "docker: 'compose' is not a docker command"

**Solution:**
```bash
# Install Docker Compose plugin
sudo apt update
sudo apt install docker-compose-plugin -y
```

### Issue: Permission denied

**Solution:**
```bash
# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### Issue: Still getting ContainerConfig error

**Solution:**
```bash
# Nuclear option - completely reset Docker
cd ~/Lankalive-Clone
docker compose down -v
docker system prune -a --volumes -f
docker compose up -d --build
```

---

## ✅ Final Deployment Command

After installing Docker Compose V2:

```bash
cd ~/Lankalive-Clone
git pull origin main
docker compose down
docker compose build --pull
docker compose up -d --force-recreate
docker compose ps
```

---

**Last Updated:** October 20, 2025  
**Error:** KeyError: 'ContainerConfig'  
**Solution:** Upgrade to Docker Compose V2  
**Command Change:** `docker-compose` → `docker compose`
