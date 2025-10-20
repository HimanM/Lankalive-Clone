# Frontend Deployment Error - Debugging Guide

## 🔍 Issue Diagnosed

**Error:** `Uncaught TypeError: f.slice(...).map is not a function`  
**Symptom:** White page after deployment  
**Cause:** Frontend is calling API but receiving unexpected response (not an array)

---

## 🚨 Root Causes

1. **CORS Issue**: Backend not allowing requests from your domain
2. **API URL Wrong**: Frontend calling wrong API endpoint
3. **Backend Not Running**: Backend container crashed or not started
4. **Network Issue**: Can't reach backend from frontend

---

## ✅ Quick Diagnosis Commands

### On Your VPS:

```bash
# 1. Check if all containers are running
cd ~/Lankalive-Clone
docker-compose ps

# Expected output: All containers should show "Up"
# postgres   Up (healthy)
# backend    Up (healthy)
# frontend   Up

# 2. Check backend logs for errors
docker-compose logs backend --tail=50

# 3. Test backend API directly
curl http://localhost:8000/api/articles

# Should return JSON array: [{"id": "...", "title": "..."}]

# 4. Test from inside frontend container
docker-compose exec frontend wget -O- http://backend:8000/api/articles

# 5. Check nginx logs
docker-compose logs frontend --tail=50
```

---

## 🔧 Fix #1: Check API URL Configuration

### Verify VITE_API_BASE is correct:

```bash
# On VPS
cd ~/Lankalive-Clone
cat .env | grep VITE_API_BASE

# Should show:
# VITE_API_BASE=https://lankalive.himanmanduja.fun
```

### Check what's baked into frontend build:

```bash
# Extract API URL from built JavaScript
docker-compose exec frontend sh -c "cat /usr/share/nginx/html/assets/*.js | grep -o 'https://lankalive.himanmanduja.fun' | head -1"

# Should output: https://lankalive.himanmanduja.fun
```

---

## 🔧 Fix #2: Add Nginx Reverse Proxy for Backend

Your Nginx (outside Docker) needs to proxy API requests to backend:

### Edit your Nginx config:

```bash
sudo nano /etc/nginx/sites-available/lankalive
```

### Add this configuration:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name lankalive.himanmanduja.fun;

    # Frontend (static files from Docker)
    location / {
        proxy_pass http://localhost:49155;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers (if needed)
        add_header 'Access-Control-Allow-Origin' '*' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type' always;
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }
}
```

### Test and reload Nginx:

```bash
# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# If using Certbot SSL, update SSL config too
sudo certbot --nginx -d lankalive.himanmanduja.fun
```

---

## 🔧 Fix #3: Expose Backend Port in Docker Compose

### Update docker-compose.yml:

```yaml
backend:
  build:
    context: ./backend
    dockerfile: Dockerfile
  container_name: lankalive_backend
  environment:
    # ... existing env vars ...
  ports:
    - "8000:8000"  # Add this line to expose backend
  volumes:
    - ./backend/static:/app/static
    - ./backend/.env:/app/.env:ro
  # ... rest of config ...
```

### Apply changes:

```bash
cd ~/Lankalive-Clone
docker-compose up -d backend
```

---

## 🔧 Fix #4: Update Frontend to Use Relative API URL

Since Nginx proxies both frontend and backend, frontend can use relative URLs:

### Option A: Update .env on VPS:

```bash
cd ~/Lankalive-Clone
nano .env

# Change:
VITE_API_BASE=https://lankalive.himanmanduja.fun
# To:
VITE_API_BASE=

# Save and rebuild
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

### Option B: Keep absolute URL but ensure backend is accessible

Test that backend is accessible from your domain:

```bash
curl https://lankalive.himanmanduja.fun/api/articles
```

---

## 🧪 Testing Steps

After applying fixes:

### 1. Test Backend Directly:

```bash
# From VPS
curl http://localhost:8000/api/articles

# Should return JSON array
```

### 2. Test Through Nginx:

```bash
# From anywhere
curl https://lankalive.himanmanduja.fun/api/articles

# Should return same JSON array
```

### 3. Test Frontend:

1. Open: `https://lankalive.himanmanduja.fun`
2. Open DevTools (F12) → Console
3. Check for errors
4. Go to Network tab
5. Reload page
6. Check `/api/articles` request:
   - Should return 200 OK
   - Should return JSON array

---

## 📊 Expected Responses

### Correct API Response:

```json
[
  {
    "id": "uuid-here",
    "title": "Article Title",
    "summary": "Article summary...",
    "status": "published",
    "slug": "article-slug",
    "published_at": "2025-10-20T...",
    "hero_image_url": "/static/uploads/...",
    "primary_category": {
      "name": "Category Name",
      "slug": "category-slug"
    }
  }
]
```

### Wrong Responses (causing errors):

```html
<!-- HTML error page instead of JSON -->
<!DOCTYPE html>
<html>...

<!-- Or null/undefined -->
null

<!-- Or error object -->
{"error": "message"}
```

---

## 🔍 Common Issues

### Issue 1: CORS Error

**Symptom:** Console shows: `Access to fetch at '...' has been blocked by CORS policy`

**Fix:** Add CORS headers in Nginx config (see Fix #2 above)

### Issue 2: 404 Not Found

**Symptom:** API calls return 404

**Fix:** 
- Ensure backend is running: `docker-compose ps backend`
- Check Nginx proxy config points to correct port
- Ensure `/api/` location block exists in Nginx

### Issue 3: 502 Bad Gateway

**Symptom:** API calls return 502

**Fix:**
- Backend container crashed: `docker-compose logs backend`
- Backend not exposing port: Add `ports: ["8000:8000"]` to docker-compose.yml
- Restart: `docker-compose restart backend`

### Issue 4: Mixed Content (HTTP/HTTPS)

**Symptom:** Console shows: `Mixed Content: The page at 'https://...' was loaded over HTTPS, but requested an insecure resource`

**Fix:** Ensure `VITE_API_BASE` uses `https://` not `http://`

---

## 🚀 Recommended Architecture

For best results, use this setup:

```
Browser → Nginx (SSL) → Frontend (port 49155)
                      ↓
                      → Backend (port 8000) → PostgreSQL
```

### Nginx handles:
- SSL/TLS termination
- Static file serving for frontend
- API proxying to backend
- CORS headers

### Docker handles:
- Frontend build and serve
- Backend Flask app
- PostgreSQL database

---

## 📝 Complete Fix Script

Run this on your VPS:

```bash
#!/bin/bash
cd ~/Lankalive-Clone

# 1. Update docker-compose to expose backend
cat > docker-compose-patch.yml << 'EOF'
version: '3.8'
services:
  backend:
    ports:
      - "8000:8000"
EOF

# 2. Merge with docker-compose
docker-compose -f docker-compose.yml -f docker-compose-patch.yml config > docker-compose-new.yml
mv docker-compose-new.yml docker-compose.yml

# 3. Update .env
sed -i 's|VITE_API_BASE=.*|VITE_API_BASE=https://lankalive.himanmanduja.fun|g' .env

# 4. Rebuild and restart
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d

# 5. Wait for services
sleep 10

# 6. Test backend
echo "Testing backend..."
curl http://localhost:8000/api/articles

echo ""
echo "Done! Now configure Nginx to proxy /api/ to localhost:8000"
```

---

## ✅ Verification Checklist

- [ ] Backend container running: `docker-compose ps backend`
- [ ] Backend accessible locally: `curl http://localhost:8000/api/articles`
- [ ] Backend port exposed: `netstat -tuln | grep 8000`
- [ ] Nginx config has `/api/` location block
- [ ] API accessible via domain: `curl https://lankalive.himanmanduja.fun/api/articles`
- [ ] Frontend shows articles (no white page)
- [ ] No console errors in browser DevTools
- [ ] Network tab shows successful API calls

---

**Last Updated:** October 20, 2025  
**Domain:** lankalive.himanmanduja.fun  
**Issue:** TypeError - map is not a function  
**Solution:** Configure Nginx to proxy backend + expose backend port
