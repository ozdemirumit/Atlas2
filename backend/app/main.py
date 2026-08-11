import logging
from collections.abc import AsyncIterator, Awaitable, Callable
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.v1.endpoints.health import router as health_root_router
from backend.app.api.v1.router import api_router
from backend.app.core.config import settings

logging.basicConfig(level=settings.LOG_LEVEL)
logger = logging.getLogger("atlas.main")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    logger.info(f"Starting {settings.PROJECT_NAME} v{settings.VERSION} in environment '{settings.ENVIRONMENT}'")
    if settings.ENABLE_DEV_IDENTITY:
        logger.warning(
            "DEVELOPMENT IDENTITY PROVIDER ACTIVE (ADR-003). "
            f"Configured subject: '{settings.DEV_IDENTITY_SUBJECT}' with C0 read scope."
        )
    yield
    logger.info("Shutting down Project Atlas backend API.")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Enterprise-grade AI Infrastructure Operations Platform",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# Permissive Enterprise CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Security Headers Middleware
@app.middleware("http")
async def add_security_headers(
    request: Request,
    call_next: Callable[[Request], Awaitable[Response]],
) -> Response:
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response


# Include Root Health and V1 Router
app.include_router(health_root_router)
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root() -> dict[str, str]:
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
    }
