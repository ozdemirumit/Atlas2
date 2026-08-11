from datetime import UTC, datetime
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from backend.app.core.config import settings

router = APIRouter()


class HealthResponse(BaseModel):
    status: str
    project: str
    version: str
    environment: str
    timestamp: str


@router.get("/health", response_model=HealthResponse)
async def get_health() -> dict[str, Any]:
    """System health check endpoint (ATLAS-050 & ADR-001)."""
    return {
        "status": "healthy",
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "environment": settings.ENVIRONMENT,
        "timestamp": datetime.now(UTC).isoformat(),
    }
