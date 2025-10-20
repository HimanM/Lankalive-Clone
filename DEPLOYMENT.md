# GitHub Secrets Configuration Guide

This document lists all the required GitHub Secrets for automatic deployment to your VPS.

## 📋 Required GitHub Secrets

Go to your GitHub repository: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

### 🖥️ VPS SSH Configuration

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `VPS_HOST` | Your VPS IP address or domain | `123.45.67.89` or `yourserver.com` |
| `VPS_USERNAME` | SSH username (usually `root` or your user) | `root` |
| `VPS_PASSWORD` | SSH password for the user | `YourSecurePassword123!` |
| `VPS_PORT` | SSH port (usually 22) | `22` |
| `VPS_PROJECT_PATH` | Absolute path where project is cloned on VPS | `/root/Lankalive` or `/home/user/lankalive` |

### 🌐 Application Configuration

| Secret Name | Description | Example Value | How to Generate |
|------------|-------------|---------------|-----------------|
| `DOMAIN` | Your domain name (optional, can use IP) | `news.yourdomain.com` or empty | Your registered domain or leave empty |
| `FLASK_SECRET_KEY` | Flask application secret key | `a8f5f167f44f4964e6c998dee827110c` | Run: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `JWT_SECRET` | JWT token signing secret | `9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08` | Run: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `POSTGRES_PASSWORD` | PostgreSQL database password | `SecureDBPassword123!` | Choose a strong password |

---

## 🔧 Step-by-Step Setup Instructions

### Step 1: Generate Secret Keys

On your local machine or VPS, run these commands:

```bash
# Generate FLASK_SECRET_KEY
python -c "import secrets; print(secrets.token_hex(32))"

# Generate JWT_SECRET
python -c "import secrets; print(secrets.token_hex(32))"
```

Copy each output and save for use in GitHub Secrets.

### Step 2: VPS Preparation

1. **SSH into your VPS:**
   ```bash
   ssh -p 22 root@your-vps-ip
   ```

2. **Install Docker and Docker Compose:**
   ```bash
   # Update system
   apt update && apt upgrade -y
   
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   apt install docker-compose -y
   
   # Verify installation
   docker --version
   docker-compose --version
   ```

3. **Clone the repository:**
   ```bash
   cd /root
   git clone https://github.com/HimanM/Lankalive-Clone.git
   cd Lankalive-Clone
   ```

4. **Note the project path** (use this for `VPS_PROJECT_PATH` secret):
   ```bash
   pwd
   # Output example: /root/Lankalive-Clone
   ```

5. **Ensure port 8080 is open:**
   ```bash
   # Check if port 8080 is available
   netstat -tuln | grep 8080
   
   # If you have a firewall, allow port 8080
   ufw allow 8080/tcp
   ```

### Step 3: Add Secrets to GitHub

1. Go to your GitHub repository: `https://github.com/HimanM/Lankalive-Clone`
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add each secret one by one:

#### Example Secret Configuration:

```
VPS_HOST = 123.45.67.89
VPS_USERNAME = root
VPS_PASSWORD = YourVPSPassword123!
VPS_PORT = 22
VPS_PROJECT_PATH = /root/Lankalive-Clone
DOMAIN = news.yourdomain.com (or leave empty to use IP)
FLASK_SECRET_KEY = <generated-key-from-step-1>
JWT_SECRET = <generated-key-from-step-1>
POSTGRES_PASSWORD = SecureDBPassword456!
```

### Step 4: Initial Manual Deployment (First Time Only)

Before using GitHub Actions, do a manual deployment to verify everything works:

```bash
# SSH to VPS
ssh -p 22 root@your-vps-ip

# Navigate to project
cd /root/Lankalive-Clone

# Pull latest code
git pull origin main

# Create .env file manually (first time)
cat > .env << 'EOF'
DATABASE_URL=
DEV=false
DOMAIN=news.yourdomain.com
FLASK_ENV=production
SECRET_KEY=<your-flask-secret-key>
JWT_SECRET=<your-jwt-secret>
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<your-postgres-password>
POSTGRES_DB=lankalive
VITE_API_URL=http://backend:8000
EOF

# Build and start containers
docker-compose build
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 5: Test GitHub Actions Deployment

1. Make a small change to your code (e.g., update README.md)
2. Commit and push to `main` branch:
   ```bash
   git add .
   git commit -m "Test deployment"
   git push origin main
   ```
3. Go to GitHub → **Actions** tab
4. Watch the deployment workflow run
5. Check the deployment summary when complete

### Step 6: Access Your Application

After successful deployment:

- **With Domain:** `http://news.yourdomain.com:8080`
- **With IP:** `http://123.45.67.89:8080`

**Default Admin Login:**
- Check your database for initial admin user
- Or create one manually via backend API

---

## 🔍 Verification Commands (Run on VPS)

```bash
# Check if containers are running
docker-compose ps

# View all logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# Check backend health
curl http://localhost:8000/api/articles

# Check database
docker-compose exec postgres psql -U postgres -d lankalive -c "\dt"

# Restart services
docker-compose restart

# Stop all services
docker-compose down

# Start all services
docker-compose up -d
```

---

## 🚨 Troubleshooting

### Issue: Port 8080 already in use
```bash
# Find process using port 8080
lsof -i :8080
# or
netstat -tuln | grep 8080

# Kill the process
kill -9 <PID>
```

### Issue: Database initialization failed
```bash
# Check postgres logs
docker-compose logs postgres

# Recreate database
docker-compose down -v
docker-compose up -d
```

### Issue: SSH connection failed in GitHub Actions
- Verify VPS_HOST, VPS_USERNAME, VPS_PASSWORD, VPS_PORT are correct
- Test SSH manually: `ssh -p 22 root@your-vps-ip`
- Check if VPS allows password authentication in `/etc/ssh/sshd_config`

### Issue: Out of disk space
```bash
# Clean up Docker
docker system prune -a --volumes -f

# Check disk space
df -h
```

---

## 🔒 Security Recommendations

1. **Use SSH Key Authentication** (more secure than password):
   ```bash
   # Generate SSH key on your local machine
   ssh-keygen -t ed25519 -C "github-actions"
   
   # Copy public key to VPS
   ssh-copy-id -p 22 root@your-vps-ip
   
   # Update GitHub Secret VPS_PASSWORD with the private key content
   ```

2. **Use a Reverse Proxy** (Nginx or Caddy) to serve on port 80/443:
   ```nginx
   server {
       listen 80;
       server_name news.yourdomain.com;
       
       location / {
           proxy_pass http://localhost:8080;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
       }
   }
   ```

3. **Enable SSL with Let's Encrypt**:
   ```bash
   apt install certbot python3-certbot-nginx -y
   certbot --nginx -d news.yourdomain.com
   ```

4. **Change default PostgreSQL password** after deployment

5. **Set up firewall rules**:
   ```bash
   ufw default deny incoming
   ufw default allow outgoing
   ufw allow ssh
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 8080/tcp
   ufw enable
   ```

---

## 📞 Support

If you encounter issues:

1. Check GitHub Actions logs in the **Actions** tab
2. SSH to VPS and run: `docker-compose logs -f`
3. Verify all secrets are correctly set in GitHub
4. Ensure Docker and Docker Compose are installed on VPS
5. Check VPS firewall rules

---

## 🎉 Success Checklist

- [ ] Docker and Docker Compose installed on VPS
- [ ] Repository cloned to VPS
- [ ] All GitHub Secrets added
- [ ] Port 8080 is open and available
- [ ] Manual deployment tested successfully
- [ ] GitHub Actions deployment tested
- [ ] Application accessible via browser
- [ ] Database initialized with schema
- [ ] Admin login working

---

**Last Updated:** October 20, 2025  
**Project:** Lanka Live Clone  
**Repository:** https://github.com/HimanM/Lankalive-Clone
