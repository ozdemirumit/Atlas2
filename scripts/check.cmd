@echo off
echo ===================================================
echo Running Project Atlas Quality Checks
echo ===================================================

:: Python Runner Resolution
where uv >nul 2>&1
if %errorlevel% equ 0 (
    set PY_EXE=uv run
) else (
    set PY_EXE=.\.venv\Scripts\python.exe -m
)

:: Node Runner Resolution
where pnpm >nul 2>&1
if %errorlevel% equ 0 (
    set NODE_RUN=pnpm
) else (
    set NODE_RUN=npm run
)

echo [1/4] Running Python Linting (Ruff)...
call %PY_EXE% ruff check .
if %errorlevel% neq 0 (
    echo Ruff check failed!
    exit /b 1
)

echo [2/4] Running Python Type Checking (mypy)...
call %PY_EXE% mypy --explicit-package-bases backend/app
if %errorlevel% neq 0 (
    echo mypy check failed!
    exit /b 1
)

echo [3/4] Running Backend Tests (pytest)...
call %PY_EXE% pytest backend/tests
if %errorlevel% neq 0 (
    echo pytest failed!
    exit /b 1
)

echo [4/4] Running Frontend Checks (typecheck & test)...
cd frontend
call %NODE_RUN% typecheck
if %errorlevel% neq 0 (
    echo Frontend typecheck failed!
    cd ..
    exit /b 1
)

call %NODE_RUN% test
if %errorlevel% neq 0 (
    echo Frontend tests failed!
    cd ..
    exit /b 1
)
cd ..

echo ===================================================
echo ALL CHECKS PASSED SUCCESSFULLY!
echo ===================================================
