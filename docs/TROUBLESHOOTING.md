# Troubleshooting Guide — Tech Research AI

## Common Issues and Resolutions

### 1. Backend Fails to Start: "No module named 'app'"
- **Cause**: Running uvicorn from outside the `backend/` directory or without the virtual environment active.
- **Resolution**:
  ```bash
  cd backend
  .venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
  ```

### 2. Live Web Search Shows Demo Mode Sources
- **Cause**: No external search API key configured or DuckDuckGo rate limiting.
- **Resolution**:
  - Check `SEARCH_PROVIDER` in `backend/.env`.
  - For free automated search, ensure `SEARCH_PROVIDER=duckduckgo`.
  - For high-volume production search, provide `TAVILY_API_KEY` or `SERPER_API_KEY` in `.env` and set `SEARCH_PROVIDER=tavily` or `SEARCH_PROVIDER=serper`.

### 3. SSE Stream Fails to Connect or Drops on Refresh
- **Cause**: Client reverse proxy buffering or connection timeout.
- **Resolution**:
  - The backend sends periodic keepalive `: keep-alive` heartbeats every 15 seconds.
  - If using Nginx as a reverse proxy, configure:
    ```nginx
    proxy_set_header Connection '';
    proxy_http_version 1.1;
    chunked_transfer_encoding off;
    proxy_buffering off;
    proxy_cache off;
    ```

### 4. Scanned PDF Upload Reports "No Extractable Text"
- **Cause**: The PDF consists solely of raster images without an embedded OCR text stream.
- **Resolution**: Pass the scanned document through an OCR utility (e.g. `tesseract` or Adobe OCR) to add an embedded text layer before uploading.

### 5. Database Locked or Permission Errors with SQLite
- **Cause**: Multiple processes writing concurrently to `tech_research.db` without `check_same_thread=False`.
- **Resolution**:
  - In `backend/app/database/session.py`, `check_same_thread=False` is enabled by default.
  - For production multi-worker environments, configure PostgreSQL by setting `DATABASE_URL=postgresql://user:password@localhost:5432/tech_research`.
