from fastapi import APIRouter

from backend.app.api.v1.endpoints import connectors, health, identity, knowledge

api_router = APIRouter()
api_router.include_router(health.router, tags=["System Health"])
api_router.include_router(identity.router, prefix="/identity", tags=["Identity & Authorization"])
api_router.include_router(knowledge.router, prefix="/knowledge", tags=["RAG Knowledge Engine"])
api_router.include_router(connectors.router, prefix="/connectors", tags=["Infrastructure Asset & Connectors"])
