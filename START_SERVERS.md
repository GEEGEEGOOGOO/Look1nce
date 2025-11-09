# Quick Start Guide

## Starting Look1nce Servers

### Method 1: Two Separate Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd D:/Look1nce/backend
venv\Scripts\activate
python main.py
```

**Terminal 2 - Frontend:**
```bash
cd D:/Look1nce/frontend
bun dev
```

---

### Method 2: PowerShell Script (Windows)

Create a file `start.ps1` with:

```powershell
# Start Backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Look1nce\backend; .\venv\Scripts\activate; python main.py"

# Wait 5 seconds for backend to start
Start-Sleep -Seconds 5

# Start Frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd D:\Look1nce\frontend; bun dev"

# Open browser
Start-Sleep -Seconds 3
Start-Process "http://localhost:3000"
```

Run it:
```powershell
powershell -ExecutionPolicy Bypass -File start.ps1
```

---

## Stopping Servers

In each terminal, press: **Ctrl + C**

---

## Accessing the App

Once both servers are running:

**Frontend:** http://localhost:3000
**Backend API:** http://localhost:8000
**API Docs:** http://localhost:8000/docs

---

## Troubleshooting

**Backend won't start?**
- Make sure virtual environment is activated (you should see `(venv)` in prompt)
- Check port 8000 is not in use

**Frontend won't start?**
- Make sure you ran `bun install` first
- Check port 3000 is not in use

**Can't connect to API?**
- Verify backend is running (check terminal for errors)
- Test: http://localhost:8000/health in browser
