# Production Deployment Guide — Tech Research AI

## 1. Containerized Deployment via Docker Compose

The simplest method to deploy Tech Research AI is using the provided multi-service `docker-compose.yml`.

### Architecture:
- `db`: PostgreSQL 16 Alpine container with persistent named volume `postgres_data`.
- `backend`: FastAPI Python 3.12 container with persistent volumes for `chroma_data` and `uploads_data`.
- `frontend`: High-performance Nginx Alpine container serving built React assets with client-side SPA routing support.

### Launch:
```bash
# 1. Provide API keys in root or backend .env
export GEMINI_API_KEY="your_api_key_here"

# 2. Build and start containers in detached mode
docker compose up -d --build

# 3. Access web interface:
http://localhost:3000
```

---

## 2. Cloud Platform Deployments

### A. Frontend (Vercel / Netlify / Cloudflare Pages)
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Public HTTPS URL of the deployed FastAPI backend (e.g. `https://api.deepresearch.example.com`).

### B. Backend & Worker (Render / Railway / Fly.io / GCP Cloud Run)
- **Root Directory**: `backend`
- **Runtime**: Docker or Python 3.12
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Required Environment Variables**:
  - `ENVIRONMENT=production`
  - `DATABASE_URL=postgresql://user:password@host:5432/dbname`
  - `CHROMA_PERSIST_DIRECTORY=/data/chroma_db` (Attach persistent disk/volume)
  - `UPLOAD_DIRECTORY=/data/uploads` (Attach persistent disk/volume)
  - `GEMINI_API_KEY=...`
  - `FRONTEND_URL=https://deepresearch.example.com`

---

## 3. Production Healthcheck Verification

Once deployed, verify backend health:
```bash
curl -f https://<YOUR_BACKEND_URL>/api/v1/health
```
Expected response:
```json
{
  "status": "healthy",
  "database": "healthy",
  "vectorstore": "healthy",
  "version": "1.0.0"
}
```
