@echo off
echo ===================================
echo Starting Look1nce Backend Server
echo ===================================
echo.

cd /d D:\Look1nce\backend
call venv\Scripts\activate.bat
echo Virtual environment activated
echo.
echo Starting FastAPI server on http://localhost:8000
echo Keep this window open while using the app!
echo Press Ctrl+C to stop the server
echo.
python -m uvicorn main:app --host 0.0.0.0 --port 8000
