# 🚀 Deployment Checklist

Use this checklist to ensure smooth deployment of Lanka Live Clone to your VPS.

---

## ✅ Phase 1: GitHub Secrets Configuration

### Required Secrets (9 total):

- [ ] **VPS_HOST** - Your VPS IP or domain (e.g., `123.45.67.89`)
- [ ] **VPS_USERNAME** - SSH username (e.g., `root`)
- [ ] **VPS_PASSWORD** - SSH password
- [ ] **VPS_PORT** - SSH port (usually `22`)
- [ ] **VPS_PROJECT_PATH** - Project path on VPS (e.g., `/root/Lankalive-Clone`)
- [ ] **DOMAIN** - Your domain (e.g., `news.yourdomain.com`) or leave empty
- [ ] **FLASK_SECRET_KEY** - Generated with: `python -c "import secrets; print(secrets.token_hex(32))"`
- [ ] **JWT_SECRET** - Generated with: `python -c "import secrets; print(secrets.token_hex(32))"`
- [ ] **POSTGRES_PASSWORD** - Strong database password

**Where to add:** GitHub Repository → Settings → Secrets and variables → Actions

---

## ✅ Phase 2: VPS Preparation

### One-Time VPS Setup:

- [ ] SSH access to VPS working
- [ ] Docker installed
  ```bash
  curl -fsSL https://get.docker.com -o get-docker.sh
  sh get-docker.sh
  ```
- [ ] Docker Compose installed
  ```bash
  apt install docker-compose -y
  ```
- [ ] Verify Docker installation
  ```bash
  docker --version
  docker-compose --version
  ```
- [ ] Repository cloned on VPS
  ```bash
  cd /root
  git clone https://github.com/HimanM/Lankalive-Clone.git
  ```
- [ ] Note project path for `VPS_PROJECT_PATH` secret
  ```bash
  cd Lankalive-Clone
  pwd
  ```
- [ ] Port 8080 is open
  ```bash
  ufw allow 8080/tcp
  netstat -tuln | grep 8080  # Should be free
  ```

---

## ✅ Phase 3: First Deployment

### Test Manual Deployment First:

- [ ] SSH to VPS
- [ ] Navigate to project directory
- [ ] Create `.env` file manually with production values
- [ ] Run `docker-compose build`
- [ ] Run `docker-compose up -d`
- [ ] Check containers are running: `docker-compose ps`
- [ ] View logs: `docker-compose logs -f`
- [ ] Test backend: `curl http://localhost:8000/api/articles`
- [ ] Test frontend in browser: `http://your-ip:8080`

---

## ✅ Phase 4: GitHub Actions Deployment

### Automated Deployment:

- [ ] All GitHub Secrets added correctly
- [ ] Workflow file exists: `.github/workflows/deploy.yml`
- [ ] Push a commit to `main` branch
  ```bash
  git add .
  git commit -m "Test deployment"
  git push origin main
  ```
- [ ] Go to GitHub → Actions tab
- [ ] Watch deployment workflow run
- [ ] Check for success ✅ or failure ❌
- [ ] If successful, verify application is accessible
- [ ] If failed, check logs and troubleshoot

---

## ✅ Phase 5: Post-Deployment Verification

### Application Health Checks:

- [ ] Frontend loads in browser (`http://your-domain:8080`)
- [ ] Backend API responds (`/api/articles`)
- [ ] Database initialized with schema
- [ ] Static files/uploads directory exists
- [ ] Can login as admin (if user created)
- [ ] Can create/edit/delete articles
- [ ] Media upload working
- [ ] All pages accessible (Home, Categories, Latest News, etc.)

### Container Health:

- [ ] All 3 containers running (`docker-compose ps`)
  - postgres (healthy)
  - backend (healthy)
  - frontend (running)
- [ ] No errors in logs (`docker-compose logs`)
- [ ] Database connection working
  ```bash
  docker-compose exec postgres psql -U postgres -d lankalive
  ```

---

## ✅ Phase 6: Optional Enhancements

### Production Hardening:

- [ ] Set up Nginx reverse proxy for port 80/443
- [ ] Configure SSL with Let's Encrypt
  ```bash
  apt install certbot python3-certbot-nginx
  certbot --nginx -d news.yourdomain.com
  ```
- [ ] Configure firewall rules
  ```bash
  ufw default deny incoming
  ufw allow ssh
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw enable
  ```
- [ ] Set up automatic backups for PostgreSQL
- [ ] Configure monitoring (optional)
- [ ] Set up log rotation

### Security:

- [ ] Change default PostgreSQL password
- [ ] Use SSH keys instead of password
- [ ] Disable password authentication in SSH
- [ ] Keep Docker and system updated
- [ ] Regular security audits

---

## 🆘 Troubleshooting Checklist

If deployment fails, check:

- [ ] SSH connection works manually
- [ ] All 9 GitHub Secrets are set correctly
- [ ] Docker and Docker Compose installed on VPS
- [ ] Port 8080 is not in use
- [ ] Project path exists on VPS
- [ ] VPS has enough disk space (`df -h`)
- [ ] VPS has enough memory (`free -h`)
- [ ] Git pull works on VPS
- [ ] .env file created correctly
- [ ] Container logs for errors (`docker-compose logs`)

---

## 📞 Common Issues & Solutions

### Issue: SSH connection failed in GitHub Actions
**Solution:** Verify VPS_HOST, VPS_USERNAME, VPS_PASSWORD, VPS_PORT secrets

### Issue: Port 8080 already in use
**Solution:** 
```bash
netstat -tuln | grep 8080
lsof -i :8080
kill -9 <PID>
```

### Issue: Database initialization failed
**Solution:**
```bash
docker-compose down -v
docker-compose up -d
docker-compose logs postgres
```

### Issue: Backend can't connect to database
**Solution:** Check DATABASE_URL in .env and postgres container health

### Issue: Out of disk space
**Solution:**
```bash
docker system prune -a --volumes -f
df -h
```

---

## 📊 Deployment Success Indicators

You know deployment is successful when:

✅ GitHub Actions workflow shows green checkmark  
✅ All 3 containers running: `docker-compose ps` shows "Up" status  
✅ Frontend accessible in browser  
✅ Backend API responds correctly  
✅ Database queries work  
✅ No errors in container logs  
✅ Can perform CRUD operations on articles  
✅ Media upload works  

---

## 🎉 Final Steps

After successful deployment:

1. **Create admin user** (if not exists)
2. **Upload some test content**
3. **Test all features**
4. **Share your site!**

**Your Lanka Live Clone is now live at:** `http://your-domain:8080`

---

**Questions or Issues?**
- Check `DEPLOYMENT.md` for detailed guide
- Check `SECRETS.md` for secrets reference
- Review GitHub Actions logs
- SSH to VPS and check `docker-compose logs -f`

---

**Last Updated:** October 20, 2025  
**Project:** Lanka Live Clone  
**GitHub:** https://github.com/HimanM/Lankalive-Clone
