@echo off
echo ===================================================
echo Running Project Atlas Quality Checks
echo ===================================================

echo [1/4] Running Python Linting (Ruff)...
call uv run ruff check .
if %errorlevel% neq 0 (
    echo Ruff check failed!
    exit /b 1
)

echo [2/4] Running Python Type Checking (mypy)...
call uv run mypy backend/app
if %errorlevel% neq 0 (
    echo mypy check failed!
    exit /b 1
)

echo [3/4] Running Backend Tests (pytest)...
call uv run pytest backend/tests
if %errorlevel% neq 0 (
    echo pytest failed!
    exit /b 1
)

echo [4/4] Running Frontend Checks (typecheck & test)...
cd frontend
call pnpm typecheck
if %errorlevel% neq 0 (
    echo Frontend typecheck failed!
    cd ..
    exit /b 1
)

call pnpm test --run
if %errorlevel% neq 0 (
    echo Frontend tests failed!
    cd ..
    exit /b 1
)
cd ..

echo ===================================================
echo ALL CHECKS PASSED SUCCESSFULLY!
echo ===================================================
