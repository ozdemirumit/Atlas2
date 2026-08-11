@echo off
echo ===================================================
echo Project Atlas Bootstrap Script
echo ===================================================

echo [1/3] Checking environment tools...

:: Python Tool Resolution
where uv >nul 2>&1
if %errorlevel% equ 0 (
    set PYTHON_CMD=uv run
    set PKG_INSTALL_CMD=uv sync --extra dev
) else (
    where python >nul 2>&1
    if %errorlevel% neq 0 (
        echo Error: Neither 'uv' nor 'python' was found in PATH.
        exit /b 1
    )
    if not exist .venv (
        echo Creating virtual environment .venv ...
        python -m venv .venv
    )
    set PYTHON_CMD=.\.venv\Scripts\python.exe
    set PKG_INSTALL_CMD=.\.venv\Scripts\python.exe -m pip install -e .[dev]
)

:: Node Package Manager Resolution
where pnpm >nul 2>&1
if %errorlevel% equ 0 (
    set NPM_CMD=pnpm
) else (
    where npm >nul 2>&1
    if %errorlevel% equ 0 (
        set NPM_CMD=npm
    ) else (
        echo Error: Neither 'pnpm' nor 'npm' was found in PATH.
        exit /b 1
    )
)

echo [2/3] Installing Python dependencies...
call %PKG_INSTALL_CMD%

echo [3/3] Installing Frontend dependencies with %NPM_CMD%...
cd frontend
call %NPM_CMD% install
cd ..

echo.
echo ===================================================
echo Bootstrap complete! Run scripts\dev.cmd to start.
echo ===================================================
