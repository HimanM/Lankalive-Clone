# Lanka Live Clone - Full-Stack News CMS

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge&logo=vercel)](https://lankalive.himanmanduja.fun/)
[![Deploy Lanka Live Clone to VPS](https://github.com/HimanM/Lankalive-Clone/actions/workflows/deploy.yml/badge.svg)](https://github.com/HimanM/Lankalive-Clone/actions/workflows/deploy.yml)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![Flask](https://img.shields.io/badge/Flask-3.0-000000?style=for-the-badge&logo=flask)](https://flask.palletsprojects.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![License](https://img.shields.io/badge/license-MIT-orange?style=for-the-badge)](LICENSE)

A modern, full-featured news content management system built with React, Flask, and PostgreSQL. This portfolio project demonstrates professional web development practices including role-based access control, media management, and containerized deployment.

**🌐 Live Demo:** [https://lankalive.himanmanduja.fun/](https://lankalive.himanmanduja.fun/)

## Overview

This CMS platform enables administrators to create, edit, and manage news content with a clean, responsive interface. Currently configured for single admin use, the architecture is designed to scale for multiple users with different permission levels.

### Key Features

- **Admin Dashboard**: Secure login system with JWT authentication for content management
- **Rich Content Editor**: Create and edit articles with media uploads and categorization
- **Responsive Design**: Modern UI built with React 18 and Tailwind CSS 4
- **Search & Filter**: Advanced search functionality with date range filtering
- **Media Management**: Inline image uploads with automatic optimization
- **Role-Based Access**: Secure admin-only content management (scalable to multi-user system)
- **Production Ready**: Dockerized deployment with Nginx, Gunicorn, and PostgreSQL

### Architecture Highlights

- **Scalable Design**: Built with multi-user capability in mind - easily extendable for team content management
- **Separation of Concerns**: Clean MVC architecture with DAOs, services, and controllers
- **Modern Stack**: React 18 + Vite 7, Flask 3.0, PostgreSQL 16, Docker Compose
- **CI/CD Pipeline**: Automated deployment via GitHub Actions

## Tech Stack

### Backend
- Flask 3.0.0
- SQLAlchemy 2.0.23
- PostgreSQL 15
- JWT Authentication (PyJWT 2.8.0)
- Pillow 10.1.0 for image processing

### Frontend
- React 18
- Vite 7
- React Router v6
- Tailwind CSS 4

### Docker Stack
- PostgreSQL 16-alpine
- Python 3.12-slim
- Node 20-alpine + Nginx-alpine (multi-stage build)

## Features

- ✅ Article management with rich text editor
- ✅ Category and tag organization
- ✅ Media asset management with inline upload
- ✅ Search functionality with debouncing (500ms)
- ✅ Date filtering
- ✅ Featured articles display
- ✅ Latest news page with pagination
- ✅ Role-based access control (Admin/Public)
- ✅ Professional error pages (404, Unauthorized)
- ✅ Privacy Policy and Terms of Service pages

## Local Development Setup

### Prerequisites
- Node.js 20+
- Python 3.12+
- PostgreSQL 15
- npm or yarn

### Environment Configuration

1. Copy the example environment file:
```powershell
Copy-Item .env.example .env
```

2. Update `.env` with your local database credentials:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/lankalive
DEV=true
DOMAIN=
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
JWT_SECRET=your-jwt-secret-here
```

### Database Setup

1. Create the database:
```powershell
psql -U postgres -c "CREATE DATABASE lankalive;"
```

2. Initialize schema:
```powershell
psql -U postgres -d lankalive -f sql_script/init_schema.sql
```

3. (Optional) Load sample data:
```powershell
psql -U postgres -d lankalive -f sql_script/sample_data.sql
```

### Backend Setup

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run.py
```

Backend will run on http://localhost:8000

### Frontend Setup

```powershell
cd frontend
npm install
npm run dev
```

Frontend will run on http://localhost:5173

## Docker Deployment

### Quick Start

1. Copy and configure environment:
```powershell
Copy-Item .env.example .env
```

2. Update `.env` for Docker deployment:
```
DEV=false
DOMAIN=yourdomain.com  # or leave empty for localhost
SECRET_KEY=generate-a-strong-secret-key
JWT_SECRET=generate-a-strong-jwt-secret
```

3. Build and run:
```powershell
docker-compose build
docker-compose up -d
```

4. Access the application:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8080/api (proxied internally)

### Docker Services

The docker-compose stack includes:

1. **PostgreSQL** (postgres:15-alpine)
   - Internal port: 5432
   - Automatically initializes with `init_schema.sql` and `sample_data.sql`
   - Persistent storage via `postgres_data` volume
   - Health checks enabled

2. **Backend** (Python 3.12-slim)
   - Internal port: 8000
   - Connects to postgres container via internal network
   - Mounts `./backend/static` for media uploads
   - Health checks on `/api/health` endpoint

3. **Frontend** (Nginx-alpine)
   - External port: 8080
   - Internal port: 80
   - Serves built React SPA
   - Configured for SPA routing
   - Gzip compression and caching enabled

### Docker Commands

```powershell
# Build all containers
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: deletes database)
docker-compose down -v

# Rebuild specific service
docker-compose build backend
docker-compose up -d backend

# Access container shell
docker-compose exec backend bash
docker-compose exec postgres psql -U postgres -d lankalive
```

### Environment Variables

| Variable | Description | Local Dev | Docker/VPS |
|----------|-------------|-----------|------------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5433/lankalive` | Auto-configured |
| `DEV` | Development mode flag | `true` | `false` |
| `DOMAIN` | Domain for VPS deployment | `` (empty) | `yourdomain.com` |
| `FLASK_ENV` | Flask environment | `development` | `production` |
| `SECRET_KEY` | Flask secret key | Any value | Strong random key |
| `JWT_SECRET` | JWT signing secret | Any value | Strong random key |

### Conditional Database Configuration

The backend uses the `DEV` flag to determine database connection:

- **DEV=true**: Uses `DATABASE_URL` from `.env` file (local PostgreSQL)
- **DEV=false**: Auto-configures to use Docker postgres container (`postgresql://postgres:postgres@postgres:5432/lankalive`)

## VPS Deployment

### 🚀 Automated Deployment with GitHub Actions

This project includes automated deployment via GitHub Actions. Every push to `main` branch automatically deploys to your VPS.

#### Quick Setup:

1. **Add GitHub Secrets** (Settings → Secrets and variables → Actions):
   - See `SECRETS.md` for the complete list of required secrets
   - Generate keys: `python -c "import secrets; print(secrets.token_hex(32))"`

2. **Prepare VPS** (one-time setup):
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
   apt install docker-compose -y
   
   # Clone repository
   git clone https://github.com/HimanM/Lankalive-Clone.git
   cd Lankalive-Clone
   
   # Open port 8080
   ufw allow 8080/tcp
   ```

3. **Deploy:**
   - Push to `main` branch, or
   - Go to **Actions** tab → **Run workflow**

4. **Access:** `http://your-domain-or-ip:8080`

📚 **Full Documentation:** See `DEPLOYMENT.md` for detailed instructions and troubleshooting.

### Manual Deployment Steps

1. Clone repository on VPS:
```bash
git clone https://github.com/HimanM/Lankalive-Clone.git
cd Lankalive-Clone
```

2. Configure environment:
```bash
cp .env.example .env
nano .env
```

Update `.env`:
```
DEV=false
DOMAIN=yourdomain.com
FLASK_ENV=production
SECRET_KEY=<generate-strong-key>
JWT_SECRET=<generate-strong-key>
POSTGRES_PASSWORD=<strong-password>
```

3. Generate secure keys:
```bash
# Generate SECRET_KEY
python3 -c "import secrets; print(secrets.token_hex(32))"

# Generate JWT_SECRET
python3 -c "import secrets; print(secrets.token_hex(32))"
```

4. Build and deploy:
```bash
docker compose build
docker compose up -d
```

5. Verify deployment:
```bash
# Check containers
docker compose ps

# Test backend
curl http://localhost:8000/api/health

# Test through frontend proxy
curl http://localhost:49155/api/articles
```

6. Access application:
- **Frontend:** http://your-vps-ip:49155
- **Backend API:** http://your-vps-ip:8000 (for testing)

### Production Features

- **Gunicorn WSGI Server:** 4 worker processes for production performance
- **Nginx Proxy:** Frontend Nginx proxies `/api/` and `/static/` to backend
- **No CORS Issues:** All requests are same-origin
- **Docker Volumes:** Database and media uploads persist across deployments

### Testing Deployment

```bash
# 1. Check all services are up
docker compose ps

# 2. View logs
docker compose logs -f

# 3. Test individual services
docker compose logs backend -f
docker compose logs frontend -f
docker compose logs postgres -f

# 4. Test API endpoint
curl http://localhost:49155/api/articles
```

## Project Structure

```
lankalive/
├── backend/
│   ├── controllers/      # Route handlers
│   ├── services/         # Business logic
│   ├── daos/            # Database access layer
│   ├── models/          # SQLAlchemy models
│   ├── utils/           # Helper functions
│   ├── static/uploads/  # Media storage
│   ├── Dockerfile       # Backend container
│   ├── requirements.txt # Python dependencies
│   └── run.py          # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   └── App.jsx      # Main app component
│   ├── Dockerfile       # Frontend container
│   ├── nginx.conf       # Nginx configuration
│   └── package.json     # Node dependencies
├── sql_script/
│   ├── init_schema.sql  # Database schema
│   └── sample_data.sql  # Sample data
├── docker-compose.yml   # Docker orchestration
├── .env                 # Environment variables (not in git)
├── .env.example         # Environment template
└── README.md           # This file
```

## API Endpoints

### Public Endpoints
- `GET /api/articles` - List all published articles
- `GET /api/articles/:id` - Get article details
- `GET /api/categories` - List all categories
- `GET /api/latest-news` - Get latest news articles

### Admin Endpoints (Requires Authentication)
- `POST /api/auth/login` - Admin login
- `POST /api/articles` - Create article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article
- `POST /api/media` - Upload media
- `POST /api/categories` - Create category

## Troubleshooting

### Docker Issues

**Issue**: Port 8080 already in use
```powershell
# Find process using port 8080
netstat -ano | findstr :8080
# Kill process by PID
taskkill /PID <pid> /F
```

**Issue**: Database connection refused
```powershell
# Check postgres container health
docker-compose ps
docker-compose logs postgres

# Verify postgres is running
docker-compose exec postgres pg_isready -U postgres
```

**Issue**: Frontend can't connect to backend
- Verify `VITE_API_URL` in docker-compose.yml points to `http://backend:8000`
- Check backend health: `docker-compose logs backend`
- Verify network: `docker network inspect lankalive_lankalive_network`

### Local Development Issues

**Issue**: Database connection error
- Verify PostgreSQL is running on port 5433
- Check credentials in `.env` match your local setup
- Ensure database `lankalive` exists

**Issue**: Frontend can't connect to backend API
- Verify backend is running on http://localhost:8000
- Check CORS configuration in backend
- Verify `VITE_API_URL` in frontend environment

## Contact

Portfolio project by: hghimanmanduja@gmail.com

## Disclaimer

This is a portfolio clone project created for educational purposes. It is not affiliated with the original "Lanka Live" website and is clearly branded as "Lanka Live Clone" throughout the application.

## License

MIT License - See [LICENSE](LICENSE) file for details.

This project is open source and available for educational purposes.
