# Lanka Live Clone

A full-featured news CMS clone built as a portfolio project.

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
- PostgreSQL 15-alpine
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

### Prerequisites
- Docker and Docker Compose installed on VPS
- Domain pointing to VPS IP (optional)
- Open port 8080 in firewall

### Deployment Steps

1. Clone repository on VPS:
```bash
git clone <your-repo-url>
cd lankalive
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
```

3. Generate secure keys:
```bash
# Generate SECRET_KEY
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# Generate JWT_SECRET
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

4. Build and deploy:
```bash
docker-compose build
docker-compose up -d
```

5. Verify deployment:
```bash
docker-compose ps
docker-compose logs -f
```

6. Access application:
- http://yourdomain.com:8080 (or http://your-vps-ip:8080)

### Reverse Proxy Setup (Optional)

To serve on standard ports (80/443), configure Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Then use Certbot for SSL:
```bash
sudo certbot --nginx -d yourdomain.com
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

This is a portfolio project. All rights reserved.
