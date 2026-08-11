@echo off
echo ===================================================
echo Starting Project Atlas Local Development Stack
echo ===================================================

if not exist .env (
    echo Creating default .env from .env.example...
    copy .env.example .env >nul
)

echo Starting Backend API on http://localhost:8000 ...
start "Atlas Backend API" cmd /k "uv run uvicorn backend.app.main:app --reload --port 8000"

echo Starting Frontend Dev Server on http://localhost:5173 ...
start "Atlas Frontend" cmd /k "cd frontend && pnpm dev"

echo Stack launched! API at http://localhost:8000/docs, Web UI at http://localhost:5173
