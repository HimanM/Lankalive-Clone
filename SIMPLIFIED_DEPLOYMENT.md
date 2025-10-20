# 🚀 Simplified Production Setup

## What Changed?

We've **removed the need for VPS Nginx reverse proxy** and **simplified the architecture**:

### Old Architecture (Complex)
```
Browser → VPS Nginx → Frontend Container → Backend Container
                  ↓
                  → Backend Container
```

### New Architecture (Simplified)
```
Browser → Frontend Container (Nginx) → Backend Container
                                   ↓
                              PostgreSQL Container
```

**Benefits:**
- ✅ No CORS issues - same origin
- ✅ No VPS Nginx configuration needed
- ✅ No SSL certificate setup required
- ✅ Works with IP address or domain
- ✅ Frontend Nginx handles all proxying
- ✅ Production-ready with Gunicorn

---

## Architecture Details

### Frontend Container
- **Nginx on port 80** (exposed as port 49155 on host)
- Serves React SPA
- Proxies `/api/*` → `backend:8000`
- Proxies `/static/*` → `backend:8000`
- Handles CORS headers

### Backend Container
- **Gunicorn WSGI server** (production) or Flask dev server (DEV=true)
- Port 8000 (internal to Docker network + exposed to host for testing)
- Serves API endpoints
- Serves media uploads from `/static/uploads`

### PostgreSQL Container
- Port 5432 (internal to Docker network only)
- Persistent data with Docker volume

---

## API URL Configuration

### Production (Docker)
```javascript
// frontend/src/api/index.js
const API_BASE = '' // Empty string = same origin

// API calls:
fetch('/api/articles') // Goes to http://localhost:49155/api/articles
                       // Nginx proxies to http://backend:8000/api/articles
```

### Development (Local)
```javascript
// vite.config.js has proxy configured
server: {
  proxy: {
    '/api': { target: 'http://localhost:8000' },
    '/static': { target: 'http://localhost:8000' }
  }
}

// When running `npm run dev`, Vite proxies API calls to backend
```

---

## Files Changed

### 1. `frontend/nginx.conf`
```nginx
# Added proxy rules
location /api/ {
    proxy_pass http://backend:8000/api/;
    # CORS headers
    # Proxy headers
}

location /static/ {
    proxy_pass http://backend:8000/static/;
}
```

### 2. `frontend/vite.config.js`
```javascript
// Added dev server proxy
server: {
  host: '0.0.0.0',
  port: 5173,
  proxy: {
    '/api': { target: 'http://localhost:8000' },
    '/static': { target: 'http://localhost:8000' }
  }
}
```

### 3. `backend/Dockerfile`
```dockerfile
# Added Gunicorn for production
RUN pip install gunicorn

CMD if [ "$DEV" = "true" ]; then \
        python run.py; \
    else \
        gunicorn -w 4 -b 0.0.0.0:8000 "run:app"; \
    fi
```

### 4. `backend/run.py`
```python
# Export app for Gunicorn
app = create_app()
```

### 5. `frontend/src/api/index.js`
```javascript
// Use empty API_BASE for same-origin requests
const API_BASE = import.meta.env.VITE_API_BASE || ''
```

### 6. `docker-compose.yml`
```yaml
frontend:
  build:
    args:
      VITE_API_BASE: ""  # Empty = same origin
```

### 7. `.github/workflows/deploy.yml`
- Removed `VITE_API_BASE` from .env file
- Updated deployment URL to show IP:49155

---

## Deployment Steps

### Clean Deployment
```bash
# SSH to VPS
ssh user@your-vps

# Navigate to project
cd ~/Lankalive-Clone

# Pull latest changes
git pull origin main

# Remove old containers and images
docker compose down --volumes --rmi all

# Rebuild from scratch
docker compose build --no-cache

# Start services
docker compose up -d

# Check status
docker compose ps

# View logs
docker compose logs -f
```

### Quick Deployment (after first deploy)
```bash
cd ~/Lankalive-Clone
git pull origin main
docker compose down
docker compose build
docker compose up -d
```

---

## Testing

### 1. Check Containers
```bash
docker compose ps

# Should show 3 containers running:
# - lankalive_postgres
# - lankalive_backend
# - lankalive_frontend
```

### 2. Test Backend Directly
```bash
# From VPS
curl http://localhost:8000/api/health
# Should return: {"status":"ok"}

curl http://localhost:8000/api/articles
# Should return: JSON array of articles
```

### 3. Test Through Frontend
```bash
# From VPS
curl http://localhost:49155/api/articles
# Should return: Same JSON array (proxied through Nginx)
```

### 4. Test From Browser
Open: `http://YOUR_VPS_IP:49155`

Check DevTools:
- **Console:** No errors
- **Network tab:**
  - `/api/articles` → 200 OK → JSON response
  - No CORS errors

---

## Production Checklist

✅ **Gunicorn Running**
```bash
docker compose logs backend | grep gunicorn
# Should see: "Listening at: http://0.0.0.0:8000"
```

✅ **API Proxying Works**
```bash
curl http://localhost:49155/api/health
# Returns JSON through Nginx proxy
```

✅ **Static Files Work**
```bash
# Upload a test image through admin
# Check it loads: http://YOUR_VPS_IP:49155/static/uploads/filename.jpg
```

✅ **Database Persists**
```bash
docker compose down
docker compose up -d
# Articles should still be there (volume persists)
```

---

## Troubleshooting

### Issue: 502 Bad Gateway on /api/ requests

**Cause:** Backend container not running or not accessible

**Fix:**
```bash
# Check backend container
docker compose logs backend --tail 50

# Restart backend
docker compose restart backend
```

### Issue: Frontend shows white screen

**Cause:** Old build with wrong API_BASE

**Fix:**
```bash
# Rebuild frontend
docker compose build --no-cache frontend
docker compose up -d frontend

# Clear browser cache or use incognito
```

### Issue: Database connection error

**Cause:** PostgreSQL container not ready

**Fix:**
```bash
# Check postgres logs
docker compose logs postgres

# Restart in order
docker compose restart postgres
sleep 5
docker compose restart backend
```

### Issue: "Cannot connect to Docker daemon"

**Cause:** Docker service not running

**Fix:**
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

---

## Performance

### Gunicorn Configuration
```python
# 4 worker processes (adjust based on CPU cores)
gunicorn -w 4 -b 0.0.0.0:8000 --timeout 120 "run:app"

# For 2 CPU cores: -w 4 (2 * cores)
# For 4 CPU cores: -w 8 (2 * cores)
```

### Nginx Caching
Static assets cached for 1 year:
```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## Optional: Add SSL Later

If you want HTTPS, you can add SSL termination to the frontend Nginx:

```nginx
# In frontend/nginx.conf
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # Rest of config stays the same
}
```

Mount certificates in docker-compose.yml:
```yaml
frontend:
  volumes:
    - /path/to/ssl:/etc/nginx/ssl:ro
```

---

## Summary

**Before:**
- Complex VPS Nginx setup
- CORS configuration issues
- Multiple SSL certificates
- Hard to debug

**After:**
- Single port exposure (49155)
- No CORS issues (same origin)
- Frontend Nginx handles proxying
- Gunicorn for production performance
- Easy to test and debug

**Access:** `http://YOUR_VPS_IP:49155`

That's it! 🎉
