# Look1nce Troubleshooting Guide

## 🔍 How to Use This Guide

1. Find your error message in the list below
2. Try the suggested solutions in order
3. If still stuck, copy the full error message and ask for help

---

## 🐍 Python/Backend Errors

### Error: "python is not recognized as an internal or external command"

**Cause:** Python not installed or not in PATH

**Solutions:**
1. Install Python from https://www.python.org/downloads/
2. During installation, CHECK "Add Python to PATH"
3. Restart terminal after installation
4. Verify: `python --version`

**Alternative:**
Try `python3` instead of `python`:
```bash
python3 --version
python3 main.py
```

---

### Error: "No module named 'fastapi'" or similar import errors

**Cause:** Dependencies not installed or wrong environment

**Solutions:**
1. Ensure virtual environment is activated:
   ```bash
   cd D:\Look1nce\backend
   venv\Scripts\activate
   ```
   You should see `(venv)` in your prompt

2. Reinstall dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. If still failing, recreate venv:
   ```bash
   cd D:\Look1nce\backend
   rm -rf venv
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

---

### Error: "Address already in use" on port 8000

**Cause:** Port 8000 is being used by another process

**Solutions:**

**Option 1: Find and kill the process**
```bash
# Find process using port 8000
netstat -ano | findstr :8000

# Kill it (replace <PID> with the number from above)
taskkill /PID <PID> /F
```

**Option 2: Change the port**
Edit `backend/main.py`, line 145:
```python
uvicorn.run(app, host="0.0.0.0", port=8001, reload=True)
```

Then update `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8001
```

---

### Error: "CUDA out of memory" or GPU-related errors

**Cause:** Not enough GPU memory or CUDA not properly installed

**Solutions:**

**Option 1: Use CPU instead (slower but works)**
1. Uninstall PyTorch:
   ```bash
   pip uninstall torch torchvision
   ```

2. Reinstall CPU-only version:
   ```bash
   pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
   ```

**Option 2: Reduce memory usage**
Edit `backend/services/tryon_service.py`, change:
```python
num_inference_steps=20,  # Change to 10 or 15
```

Also reduce image size in `backend/services/cloth_preprocessor.py`:
```python
target_size: tuple = (512, 768)  # Instead of (768, 1024)
```

---

### Error: "Failed to load OOTDiffusion model"

**Cause:** Model download failed or insufficient disk space

**Solutions:**
1. Check internet connection
2. Ensure 5GB+ free disk space
3. Try again - download will resume from where it stopped
4. If persistent, use VPN or different network
5. Check firewall isn't blocking HuggingFace

**Manual download:**
```bash
# In Python:
python
>>> from diffusers import StableDiffusionInpaintPipeline
>>> pipe = StableDiffusionInpaintPipeline.from_pretrained("levihsu/OOTDiffusion")
```

---

### Error: "Can't open file main.py"

**Cause:** Wrong directory

**Solution:**
Navigate to correct directory:
```bash
cd D:\Look1nce\backend
python main.py
```

---

### Error: "venv\Scripts\activate : cannot be loaded"

**Cause:** PowerShell execution policy restriction

**Solution:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\activate
```

---

## ⚛️ Frontend/Node Errors

### Error: "bun: command not found" or "bun is not recognized"

**Cause:** Bun not installed or not in PATH

**Solutions:**

**Option 1: Install Bun**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```
Close and reopen terminal

**Option 2: Use npm instead**
```bash
npm install
npm run dev
```

**Option 3: Use yarn**
```bash
yarn install
yarn dev
```

---

### Error: "Port 3000 already in use"

**Cause:** Another process using port 3000

**Solutions:**

**Option 1: Use different port**
```bash
bun dev --port 3001
```

**Option 2: Kill process on 3000**
```bash
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### Error: "Module not found" in Next.js

**Cause:** Dependencies not installed

**Solution:**
```bash
cd D:\Look1nce\frontend
rm -rf node_modules
bun install
```

Or with npm:
```bash
npm install
```

---

### Error: "Failed to compile" or TypeScript errors

**Cause:** TypeScript type errors

**Solutions:**
1. Check terminal for specific error message
2. Common fixes:
   - Missing semicolons
   - Wrong import paths
   - Type mismatches

3. Quick fix (not recommended for production):
   Edit `tsconfig.json`:
   ```json
   {
     "compilerOptions": {
       "strict": false  // Change from true
     }
   }
   ```

---

## 🌐 Network/API Errors

### Error: "Network Error" or "Failed to fetch" in browser

**Cause:** Backend not running or CORS issues

**Solutions:**
1. Verify backend is running:
   - Check Terminal 1 for backend
   - Visit http://localhost:8000/health
   - Should return JSON

2. Check URL in `frontend/.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

3. Restart both servers:
   - Ctrl+C in both terminals
   - Restart backend first
   - Then restart frontend

4. Check browser console (F12) for detailed error

---

### Error: "CORS policy" in browser console

**Cause:** Frontend URL not allowed in backend

**Solution:**
Edit `backend/main.py`, line 16:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Add your port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### Error: "Request Entity Too Large"

**Cause:** Uploaded file is too large

**Solution:**
1. Reduce image size before uploading (compress or resize)
2. Or edit `backend/main.py` to increase limit (not recommended):
   ```python
   # Add this after creating app
   app.add_middleware(
       # ... existing middleware
   )
   app.add_api_route(..., upload_file_limit=50 * 1024 * 1024)  # 50MB
   ```

---

## 📸 Camera Errors

### Error: "Camera not working" or "Permission denied"

**Cause:** Browser permissions not granted

**Solutions:**
1. Check browser address bar for camera icon
2. Click and allow camera access
3. Try different browser (Chrome recommended)
4. Check camera isn't being used by another app
5. Use "Upload Photo" option instead

---

### Error: "NotFoundError: Requested device not found"

**Cause:** No camera detected

**Solution:**
1. Connect external webcam if no built-in camera
2. Check Device Manager (Windows) for camera
3. Use "Upload Photo" instead of camera option

---

## 🖼️ Image Processing Errors

### Error: "Failed to process image"

**Cause:** Corrupted or unsupported image format

**Solutions:**
1. Try different image
2. Convert image to JPG or PNG
3. Ensure image isn't corrupted:
   - Open in image viewer first
   - Try re-downloading from source
4. Check image size (not too small or too large)
5. Recommended specs:
   - Format: JPG or PNG
   - Size: 500KB - 5MB
   - Resolution: 512x512 to 2048x2048

---

### Error: "No pose detected"

**Cause:** Person not clearly visible in photo

**Solutions:**
1. Ensure person is clearly visible
2. Face camera directly
3. Good lighting
4. Upper body visible
5. No obstructions
6. Try different photo

---

### Error: "Background removal failed"

**Cause:** rembg model issue

**Solution:**
1. Restart backend server
2. Check internet (model may need to download)
3. Try simpler image with clear background
4. Wait and retry

---

## 💾 Storage Errors

### Error: "No space left on device" or "Disk full"

**Cause:** Insufficient disk space

**Solutions:**
1. Free up disk space (need 5GB+)
2. Clean temporary files:
   ```bash
   cd D:\Look1nce\backend
   rm -rf uploads/* temp/* results/*
   ```

---

## 🐛 General Debugging Steps

### Step 1: Check Both Servers Are Running

**Backend:**
```bash
# Should show:
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete.
```

**Frontend:**
```bash
# Should show:
▲ Next.js 14.1.0
- Local:        http://localhost:3000
✓ Ready in XXXms
```

---

### Step 2: Test Each Component

**Test 1: Backend Health**
```bash
curl http://localhost:8000/health
```
Should return JSON with "status": "healthy"

**Test 2: Frontend Loading**
Open http://localhost:3000 in browser
Should see Look1nce homepage

**Test 3: Browser Console**
Press F12, check Console tab
Look for any red error messages

---

### Step 3: Read Error Messages Carefully

1. Copy FULL error message
2. Note which terminal it appeared in
3. Note what action you were performing
4. Share all three pieces of info when asking for help

---

## 🔧 Complete Reset Procedure

If everything is broken and you want to start fresh:

### Reset Backend
```bash
cd D:\Look1nce\backend

# Deactivate venv if active
deactivate

# Remove everything
rm -rf venv uploads temp results

# Recreate
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

### Reset Frontend
```bash
cd D:\Look1nce\frontend

# Remove dependencies and cache
rm -rf node_modules .next

# Reinstall
bun install
bun dev
```

---

## 📊 Performance Issues

### Issue: "App is very slow"

**Possible causes and solutions:**

1. **Using CPU instead of GPU**
   - Check: `python -c "import torch; print(torch.cuda.is_available())"`
   - If False, that's okay but will be slower
   - Expected times: 30-60s per try-on on CPU

2. **Large images**
   - Reduce image size before uploading
   - Backend automatically resizes, but smaller is faster

3. **Low RAM**
   - Close other applications
   - Need at least 8GB RAM

4. **Old computer**
   - Reduce inference steps (see CUDA error solution above)
   - Use smaller images

---

### Issue: "Try-on result looks bad"

**Solutions:**
1. Use better quality images
2. Ensure good lighting in person photo
3. Person should face camera directly
4. Clothing item should be clear and well-lit
5. Try different category selection
6. Increase inference steps in `tryon_service.py`:
   ```python
   num_inference_steps=30,  # Higher = better quality
   ```

---

## 🆘 Still Having Problems?

### Information to Provide When Asking for Help:

1. **Error Message**
   - Copy the FULL error message
   - Include any stack trace

2. **Context**
   - What were you doing when error occurred?
   - Is it your first time or was it working before?

3. **Environment**
   - OS: Windows/Mac/Linux
   - Python version: `python --version`
   - Bun version: `bun --version`

4. **Logs**
   - Copy last 20 lines from backend terminal
   - Copy last 20 lines from frontend terminal
   - Screenshot of browser console errors (F12)

5. **Steps to Reproduce**
   - What exact steps lead to the error?
   - Can you reproduce it consistently?

---

## 📝 Error Reporting Template

Copy this template when reporting errors:

```
**Error Description:**
[Describe what happened]

**Error Message:**
[Paste full error message here]

**What I was doing:**
[Step by step what you clicked/typed]

**Environment:**
- OS: [Windows/Mac/Linux]
- Python: [version]
- Bun: [version]

**Logs:**
Backend terminal:
[Last 20 lines]

Frontend terminal:
[Last 20 lines]

Browser console:
[Screenshot or copy errors]

**Already Tried:**
[List what solutions you already attempted]
```

---

## ✅ Verification After Fixing

After fixing any issue, verify:

1. [ ] Backend starts without errors
2. [ ] Frontend starts without errors
3. [ ] http://localhost:8000/health works
4. [ ] http://localhost:3000 loads
5. [ ] Can upload cloth image
6. [ ] Can upload person photo
7. [ ] Try-on generates result
8. [ ] Can download result

---

## 🔗 Useful Commands for Debugging

```bash
# Check if process is running on port
netstat -ano | findstr :8000
netstat -ano | findstr :3000

# Check Python packages
pip list

# Check if GPU is available
python -c "import torch; print(torch.cuda.is_available())"

# Test backend endpoint
curl http://localhost:8000/health

# View running Python processes
tasklist | findstr python

# View backend logs (run backend with)
python main.py > backend.log 2>&1

# Check disk space
wmic logicaldisk get caption,freespace,size

# Check RAM usage
systeminfo | findstr "Memory"
```

---

## 📚 Additional Resources

- Python docs: https://docs.python.org/
- FastAPI docs: https://fastapi.tiangolo.com/
- Next.js docs: https://nextjs.org/docs
- Bun docs: https://bun.sh/docs
- OOTDiffusion: https://huggingface.co/levihsu/OOTDiffusion

---

**Remember: Most issues are simple fixes. Stay calm, read errors carefully, and try solutions one at a time!**
