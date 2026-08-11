@echo off
echo ===================================================
echo Starting Project Atlas Local Development Stack
echo ===================================================

if not exist .env (
    echo Creating default .env from .env.example...
    copy .env.example .env >nul
)

:: Python Runner Resolution
where uv >nul 2>&1
if %errorlevel% equ 0 (
    set PY_RUN=uv run uvicorn backend.app.main:app --reload --port 8000
) else (
    set PY_RUN=.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --port 8000
)

:: Node Runner Resolution
where pnpm >nul 2>&1
if %errorlevel% equ 0 (
    set FRONTEND_RUN=pnpm dev
) else (
    set FRONTEND_RUN=npm run dev
)

echo Starting Backend API on http://localhost:8000 ...
start "Atlas Backend API" cmd /k "%PY_RUN%"

echo Starting Frontend Dev Server on http://localhost:5173 ...
start "Atlas Frontend" cmd /k "cd frontend && %FRONTEND_RUN%"

echo Stack launched! API at http://localhost:8000/docs, Web UI at http://localhost:5173
