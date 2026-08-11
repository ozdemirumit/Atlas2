from fastapi import APIRouter

from backend.app.api.v1.endpoints import health, identity

api_router = APIRouter()
api_router.include_router(health.router, tags=["System Health"])
api_router.include_router(identity.router, prefix="/identity", tags=["Identity & Authorization"])
