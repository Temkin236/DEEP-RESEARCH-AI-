from fastapi import APIRouter
from .health import router as health_router
from .research import router as research_router
from .documents import router as documents_router

api_v1_router = APIRouter(prefix="/v1")
api_v1_router.include_router(health_router)
api_v1_router.include_router(research_router)
api_v1_router.include_router(documents_router)

__all__ = ["api_v1_router"]
