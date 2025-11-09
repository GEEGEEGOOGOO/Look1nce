@echo off
echo ===================================
echo Starting Look1nce with Docker
echo ===================================
echo.

echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker not found!
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Docker found!
echo.

echo Building and starting backend...
echo This may take 10 minutes on first run.
echo.

docker-compose up --build

pause
