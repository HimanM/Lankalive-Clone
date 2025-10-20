# GitHub Secrets Quick Reference

## Copy-Paste Template for GitHub Secrets

Add these secrets in GitHub: **Settings → Secrets and variables → Actions → New repository secret**

---

### 1. VPS_HOST
**Value:** `Your VPS IP address or domain`
```
Example: 123.45.67.89
```

---

### 2. VPS_USERNAME
**Value:** `Your SSH username`
```
Example: root
```

---

### 3. VPS_PASSWORD
**Value:** `Your SSH password`
```
Example: YourSecureSSHPassword123!
```

---

### 4. VPS_PORT
**Value:** `SSH port number`
```
Example: 22
```

---

### 5. VPS_PROJECT_PATH
**Value:** `Absolute path to project on VPS`
```
Example: /root/Lankalive-Clone
```

---

### 6. DOMAIN
**Value:** `Your domain name (optional)`
```
Example: news.yourdomain.com
OR leave empty to use IP address
```

---

### 7. FLASK_SECRET_KEY
**Value:** `Generated secret key`

**Generate with:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Example output:**
```
a8f5f167f44f4964e6c998dee827110c9f86d081884c7d659a2feaa0c55ad015
```

---

### 8. JWT_SECRET
**Value:** `Generated JWT secret`

**Generate with:**
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

**Example output:**
```
9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
```

---

### 9. POSTGRES_PASSWORD
**Value:** `Strong database password`
```
Example: SecureDBPassword456!
```

---

## Total Secrets Needed: 9

✅ VPS_HOST  
✅ VPS_USERNAME  
✅ VPS_PASSWORD  
✅ VPS_PORT  
✅ VPS_PROJECT_PATH  
✅ DOMAIN  
✅ FLASK_SECRET_KEY  
✅ JWT_SECRET  
✅ POSTGRES_PASSWORD  

---

## Quick Setup Commands

### On Your Local Machine:
```bash
# Generate secret keys
python -c "import secrets; print('FLASK_SECRET_KEY:', secrets.token_hex(32))"
python -c "import secrets; print('JWT_SECRET:', secrets.token_hex(32))"
```

### On Your VPS:
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh

# Install Docker Compose
apt install docker-compose -y

# Clone repository
cd /root
git clone https://github.com/HimanM/Lankalive-Clone.git
cd Lankalive-Clone

# Get project path (use for VPS_PROJECT_PATH secret)
pwd

# Open port 8080
ufw allow 8080/tcp
```

---

## After Adding Secrets

1. Go to your repo: `https://github.com/HimanM/Lankalive-Clone`
2. Click **Actions** tab
3. Click **Deploy Lanka Live Clone to VPS** workflow
4. Click **Run workflow** → **Run workflow**
5. Watch deployment progress
6. Access app at: `http://your-domain-or-ip:8080`

---

## Troubleshooting

**Can't SSH?**
```bash
# Test SSH connection
ssh -p 22 root@your-vps-ip
```

**Port 8080 in use?**
```bash
# Find what's using it
netstat -tuln | grep 8080
lsof -i :8080
```

**Check deployment logs:**
- GitHub: Actions tab → Latest workflow run
- VPS: `docker-compose logs -f`

---

**Need help?** Check `DEPLOYMENT.md` for detailed instructions.
