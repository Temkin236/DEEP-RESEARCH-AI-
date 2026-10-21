import datetime
import os
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.database.session import get_db
from app.config.settings import settings
from app.services.document_service import document_service

router = APIRouter(prefix="/health", tags=["Health"])

START_TIME = datetime.datetime.now(datetime.timezone.utc)

@router.get("")
def get_health(db: Session = Depends(get_db)):
    """Health check endpoint verifying DB, Vectorstore, and provider status."""
    db_status = "healthy"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    vectorstore_status = "healthy" if document_service.collection is not None else "in-memory-fallback"

    uptime_seconds = (datetime.datetime.now(datetime.timezone.utc) - START_TIME).total_seconds()

    return {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "environment": settings.ENVIRONMENT,
        "database": db_status,
        "vectorstore": vectorstore_status,
        "llm_provider": settings.LLM_PROVIDER,
        "search_provider": settings.SEARCH_PROVIDER,
        "uptime_seconds": round(uptime_seconds, 1),
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "version": "1.0.0"
    }
