@echo off
echo ===================================================
echo Project Atlas Bootstrap Script
echo ===================================================

echo [1/3] Checking environment tools...
where uv >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: uv is not installed. Please install uv 0.12.1 or newer.
    exit /b 1
)

where pnpm >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: pnpm is not installed. Please install pnpm 11.7.0 or newer.
    exit /b 1
)

echo [2/3] Installing Python dependencies with uv...
call uv sync --extra dev

echo [3/3] Installing Frontend dependencies with pnpm...
cd frontend
call pnpm install
cd ..

echo.
echo ===================================================
echo Bootstrap complete! Run scripts\dev.cmd to start.
echo ===================================================
