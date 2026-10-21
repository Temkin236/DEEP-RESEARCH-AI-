import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.config.settings import settings
from app.database.session import init_db
from app.api.v1 import api_v1_router

# Configure root logger
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("deep_research_ai")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup sequence
    logger.info("Initializing Deep Research AI application...")
    init_db()
    logger.info(f"LLM Provider: {settings.LLM_PROVIDER}")
    logger.info(f"Search Provider: {settings.SEARCH_PROVIDER}")
    yield
    # Shutdown sequence
    logger.info("Shutting down Deep Research AI application...")

app = FastAPI(
    title="Deep Research AI API",
    description="Autonomous Multi-Agent Research Assistant powered by LangGraph, FastAPI, and ChromaDB.",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows local development across ports; restrict in strict production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global unhandled exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.exception(f"Unhandled error processing request {request.method} {request.url.path}: {exc}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": "InternalServerError",
            "message": "An unexpected error occurred while processing your request. Please check server logs.",
            "path": request.url.path
        }
    )

# Mount API v1 router under /api
app.include_router(api_v1_router, prefix="/api")

@app.get("/")
def root():
    return {
        "name": "Deep Research AI API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.APP_HOST, port=settings.APP_PORT, reload=True)
