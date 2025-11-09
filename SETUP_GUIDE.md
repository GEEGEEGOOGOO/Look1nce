# Look1nce - Complete Setup Guide

## 📋 Prerequisites

Before starting, ensure you have:

### Required Software
- **Python 3.10+**: [Download here](https://www.python.org/downloads/)
- **Node.js 18+**: [Download here](https://nodejs.org/)
- **Bun**: [Install instructions below]

### Optional (Recommended)
- **CUDA-compatible GPU**: For faster processing (NVIDIA GPU)
- **Git**: For version control

---

## 🚀 Step-by-Step Setup

### Step 1: Install Bun

**Windows:**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Verify installation:**
```bash
bun --version
```

---

### Step 2: Backend Setup (Python FastAPI)

Open a terminal and navigate to the backend folder:

```bash
cd D:/Look1nce/backend
```

#### 2.1 Create Virtual Environment

```bash
python -m venv venv
```

#### 2.2 Activate Virtual Environment

**Windows (PowerShell):**
```powershell
venv\Scripts\activate
```

**Windows (CMD):**
```cmd
venv\Scripts\activate.bat
```

You should see `(venv)` in your terminal prompt.

#### 2.3 Install Python Dependencies

```bash
pip install -r requirements.txt
```

**This will take 5-15 minutes** as it downloads:
- PyTorch (~2GB)
- Model dependencies (~1-2GB)
- Other libraries

#### 2.4 Start Backend Server

```bash
python main.py
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Test it:** Open browser at http://localhost:8000 - you should see:
```json
{"message": "Look1nce API is running!", "status": "healthy"}
```

**Keep this terminal open** - backend must run continuously.

---

### Step 3: Frontend Setup (Next.js + Bun)

Open a **NEW terminal** (keep backend running) and navigate to frontend:

```bash
cd D:/Look1nce/frontend
```

#### 3.1 Install Dependencies

```bash
bun install
```

This takes 1-2 minutes.

#### 3.2 Start Development Server

```bash
bun dev
```

You should see:
```
▲ Next.js 14.1.0
- Local:        http://localhost:3000
```

---

### Step 4: Open the App

Open your browser and go to: **http://localhost:3000**

You should see the Look1nce homepage! 🎉

---

## 🎯 How to Use

1. **Upload Cloth Image**
   - Click upload area
   - Select product image from website (Myntra/Amazon screenshot)
   - Choose category (upper body/lower body/dress)
   - Click "Continue"

2. **Upload Your Photo**
   - Choose "Upload Photo" or "Use Camera"
   - If using camera, allow browser permissions
   - Upload/capture a photo of yourself
   - Best results: face camera, good lighting, upper body visible
   - Click "Continue"

3. **View Result**
   - Wait 10-30 seconds for AI processing
   - See yourself wearing the clothing item
   - Download the result or try another outfit

---

## ⚠️ Common Issues & Solutions

### Issue 1: Backend Port Already in Use
**Error:** `Address already in use`

**Solution:**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or change port in backend/main.py (line 145):
uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
```

### Issue 2: Python Not Found
**Error:** `python is not recognized`

**Solution:**
- Install Python from https://www.python.org/downloads/
- During installation, check "Add Python to PATH"
- Restart terminal

### Issue 3: CUDA/GPU Errors
**Error:** `CUDA out of memory` or GPU-related errors

**Solution:**
The app will automatically fall back to CPU. For CPU-only:
```bash
pip uninstall torch torchvision
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### Issue 4: Model Download Fails
**Error:** `Failed to download model`

**Solution:**
- Check internet connection
- Ensure ~5GB free disk space
- Retry - model will resume download
- If persists, use VPN or different network

### Issue 5: Camera Not Working
**Error:** Camera doesn't start

**Solution:**
- Allow camera permissions in browser
- Try different browser (Chrome recommended)
- Use "Upload Photo" option instead

### Issue 6: Frontend Port Already in Use
**Error:** Port 3000 already in use

**Solution:**
```bash
bun dev --port 3001
```

Then update `frontend/.env.local` if needed.

### Issue 7: API Connection Failed
**Error:** `Network Error` or `Failed to fetch`

**Solution:**
1. Verify backend is running (check terminal)
2. Test: http://localhost:8000/health
3. Check `frontend/.env.local` has correct URL
4. Disable firewall/antivirus temporarily

---

## 🔧 Advanced Configuration

### Use GPU for Faster Processing

If you have NVIDIA GPU with CUDA:

1. Install CUDA Toolkit: https://developer.nvidia.com/cuda-downloads
2. Verify GPU is detected:
```bash
python -c "import torch; print(torch.cuda.is_available())"
```

Should print `True` if GPU is available.

### Adjust Image Quality

Edit `backend/services/cloth_preprocessor.py` line 71:
```python
def _resize_cloth(self, img: Image.Image, target_size: tuple = (768, 1024)):
```

Change `(768, 1024)` to higher values for better quality (but slower):
- HD: `(1024, 1536)`
- FHD: `(1536, 2048)`

### Change Processing Speed

Edit `backend/services/tryon_service.py` line 84:
```python
num_inference_steps=20,
```

- Faster (lower quality): `10-15`
- Better quality (slower): `30-50`

---

## 📁 Project Structure

```
Look1nce/
├── backend/                    # Python FastAPI backend
│   ├── main.py                 # API server
│   ├── services/
│   │   ├── cloth_preprocessor.py    # Cloth image processing
│   │   ├── person_preprocessor.py   # Person image processing
│   │   └── tryon_service.py         # OOTDiffusion integration
│   ├── requirements.txt        # Python dependencies
│   ├── uploads/                # Uploaded files (auto-created)
│   ├── temp/                   # Processed files (auto-created)
│   └── results/                # Final results (auto-created)
│
├── frontend/                   # Next.js frontend
│   ├── app/
│   │   ├── page.tsx            # Main page
│   │   ├── layout.tsx          # Layout wrapper
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── ClothUpload.tsx     # Cloth upload component
│   │   ├── PersonUpload.tsx    # Person photo/camera component
│   │   └── TryOnResult.tsx     # Result display
│   ├── lib/
│   │   └── api.ts              # API client
│   └── package.json
│
├── README.md
├── SETUP_GUIDE.md             # This file
└── .gitignore
```

---

## 🧪 Testing the Installation

### Quick Test Flow

1. **Test Backend**
```bash
# In backend terminal:
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy", "services": {...}}
```

2. **Test Frontend**
- Open http://localhost:3000
- Should see Look1nce homepage
- All three steps should be visible

3. **Full Pipeline Test**
- Find any clothing image online (Google Images, Myntra, etc.)
- Save it to your computer
- Find a photo of yourself (or use webcam)
- Run through the full try-on process

---

## 🛠️ Development Tips

### Restart Backend After Code Changes

```bash
# Backend auto-reloads, but if issues occur:
# Press Ctrl+C to stop
python main.py
```

### Restart Frontend After Changes

```bash
# Frontend auto-reloads, but if issues occur:
# Press Ctrl+C to stop
bun dev
```

### View Logs

Backend logs appear in terminal where you ran `python main.py`
Frontend logs appear in browser console (F12)

### Clear Cached Files

```bash
# Backend:
cd D:/Look1nce/backend
rm -rf uploads/* temp/* results/*

# Or manually delete folders
```

---

## 📊 Performance Expectations

### Processing Times
- **Cloth preprocessing**: 2-5 seconds
- **Person preprocessing**: 3-8 seconds
- **Virtual try-on**: 10-30 seconds (GPU) / 30-120 seconds (CPU)

### Resource Usage
- **RAM**: 4-8 GB
- **Disk**: ~5 GB (models + cache)
- **GPU VRAM**: 4-6 GB (if using GPU)

---

## 🆘 Still Having Issues?

1. Check all terminals are running (backend + frontend)
2. Restart both servers
3. Clear browser cache (Ctrl+Shift+Delete)
4. Try different images
5. Check system requirements met
6. Review error messages in terminal

---

## 🎉 Success Checklist

- [ ] Python 3.10+ installed
- [ ] Bun installed
- [ ] Backend virtual environment created
- [ ] Backend dependencies installed
- [ ] Backend running on http://localhost:8000
- [ ] Frontend dependencies installed
- [ ] Frontend running on http://localhost:3000
- [ ] Can access Look1nce homepage
- [ ] Successfully uploaded cloth image
- [ ] Successfully uploaded person photo
- [ ] Generated try-on result

**If all checked - YOU'RE READY TO GO! 🚀**

---

## 📧 Need Help?

Paste error messages in chat and I'll help you debug!
