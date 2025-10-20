# Frontend API URL Configuration Guide

## 🔧 Problem: Frontend Calling Wrong API URL

If your deployed application is calling `http://127.0.0.1:8000` instead of your domain, here's how to fix it.

---

## ✅ Solution

The frontend needs to be rebuilt with the correct API URL at **build time**.

### Step 1: Update GitHub Secret

Make sure your `DOMAIN` secret is set correctly:

**Go to:** GitHub Repository → Settings → Secrets and variables → Actions

**Update `DOMAIN` secret:**
```
lankalive.himanmanduja.fun
```

**Important:** 
- ❌ Don't include: `http://`
- ❌ Don't include: Port numbers
- ✅ Just the domain: `lankalive.himanmanduja.fun`
- ✅ Or IP address: `123.45.67.89`

---

### Step 2: Rebuild and Redeploy

On your VPS, rebuild the containers:

```bash
cd ~/Lankalive-Clone

# Pull latest code with fixes
git pull origin main

# Stop containers
docker-compose down

# Rebuild with correct API URL (use https if you have SSL/Certbot)
export VITE_API_BASE=https://lankalive.himanmanduja.fun
docker-compose build --no-cache frontend

# Start everything
docker-compose up -d
```

---

### Step 3: Verify Configuration

Check if the API URL is correct:

```bash
# View the built frontend files
docker-compose exec frontend cat /usr/share/nginx/html/index.html | grep -o 'http://[^"]*:49155'

# Should show: http://lankalive.himanmanduja.fun:49155
```

---

## 🔍 Understanding the Fix

### What Changed:

1. **Dockerfile Updated:**
   - Now accepts `VITE_API_BASE` as build argument
   - Bakes the API URL into the built frontend at build time

2. **docker-compose.yml Updated:**
   - Passes `VITE_API_BASE` as build arg
   - Uses domain from environment variable

3. **Deployment Workflow Updated:**
   - Sets `VITE_API_BASE=http://${DOMAIN}:49155` in .env
   - Frontend builds with correct URL

### How It Works:

```
DOMAIN secret → .env file → docker-compose.yml → 
Dockerfile ARG → Vite build → Baked into JS files
```

---

## 📝 Manual Configuration (Alternative)

If you want to configure manually on VPS:

### Option 1: Update .env and Rebuild

```bash
cd ~/Lankalive-Clone

# Edit .env
nano .env

# Add this line (use https if you have SSL/Certbot):
VITE_API_BASE=https://lankalive.himanmanduja.fun

# Save (Ctrl+O, Enter, Ctrl+X)

# Rebuild frontend
docker-compose build --no-cache frontend
docker-compose up -d
```

### Option 2: Use GitHub Actions

Simply push to main branch and let GitHub Actions handle it:

```bash
# Make sure DOMAIN secret is set in GitHub
# Then push any change to trigger deployment
git commit --allow-empty -m "Trigger redeploy with correct API URL"
git push origin main
```

---

## 🧪 Testing

After redeploying, test in browser:

1. **Open DevTools** (F12)
2. **Go to Network tab**
3. **Reload your site**
4. **Check API calls:**
   - ✅ Should call: `http://lankalive.himanmanduja.fun:49155/api/...`
   - ❌ Should NOT call: `http://127.0.0.1:8000/api/...`

---

## 🚨 Common Issues

### Issue: Still calling localhost

**Cause:** Frontend not rebuilt after environment change

**Solution:**
```bash
# Force rebuild frontend without cache
docker-compose build --no-cache frontend
docker-compose up -d --force-recreate frontend
```

### Issue: CORS errors

**Cause:** Backend not allowing your domain

**Solution:** Check backend CORS configuration (should allow all origins by default)

### Issue: 404 on API calls

**Cause:** Wrong port or domain

**Solution:** Verify:
- Frontend accessible at: `http://lankalive.himanmanduja.fun:49155`
- API should use same domain and port
- Check: `curl http://lankalive.himanmanduja.fun:49155/api/articles`

---

## 📊 Environment Variables Reference

### Local Development (.env):
```bash
DEV=true
DOMAIN=
VITE_API_BASE=http://127.0.0.1:8000
```

### VPS Deployment with Nginx Reverse Proxy + SSL (.env):
```bash
DEV=false
DOMAIN=lankalive.himanmanduja.fun
VITE_API_BASE=https://lankalive.himanmanduja.fun
```

### VPS Deployment without Reverse Proxy (.env):
```bash
DEV=false
DOMAIN=123.45.67.89
VITE_API_BASE=http://123.45.67.89:49155
```

### Docker Compose (picks from .env):
```yaml
frontend:
  build:
    args:
      VITE_API_BASE: ${VITE_API_BASE:-http://backend:8000}
```

---

## 🎯 Quick Fix Commands

### Full Rebuild from Scratch:

```bash
cd ~/Lankalive-Clone
git pull origin main
docker-compose down -v
export VITE_API_BASE=http://lankalive.himanmanduja.fun:49155
docker-compose build --no-cache
docker-compose up -d
```

### Check What URL Frontend is Using:

```bash
# Extract API URL from built JavaScript
docker-compose exec frontend sh -c "cat /usr/share/nginx/html/assets/*.js | grep -o 'http://[^\"]*8000'"
```

### View Frontend Build Logs:

```bash
docker-compose logs frontend
```

---

## 💡 Pro Tips

1. **Always rebuild after changing `VITE_API_BASE`:**
   - Vite bakes environment variables into the build
   - Runtime changes don't work for Vite

2. **Use GitHub Actions for deployment:**
   - Automatically sets correct API URL
   - Handles rebuild automatically

3. **Test locally first:**
   ```bash
   # Build locally with your domain
   cd frontend
   VITE_API_BASE=http://lankalive.himanmanduja.fun:49155 npm run build
   # Check dist/assets/*.js for the URL
   grep -r "lankalive.himanmanduja.fun" dist/
   ```

---

## ✅ Verification Checklist

After fixing, verify:

- [ ] `DOMAIN` secret set in GitHub (no http://, no port)
- [ ] `.env` file on VPS has `VITE_API_BASE=http://yourdomain:49155`
- [ ] Frontend container rebuilt: `docker-compose build --no-cache frontend`
- [ ] Containers restarted: `docker-compose up -d`
- [ ] Browser DevTools shows API calls to your domain
- [ ] No 127.0.0.1 or localhost in API calls
- [ ] Login and other API calls work

---

**Last Updated:** October 20, 2025  
**Issue:** Frontend calling 127.0.0.1 instead of domain  
**Fix:** Rebuild frontend with correct `VITE_API_BASE` environment variable
