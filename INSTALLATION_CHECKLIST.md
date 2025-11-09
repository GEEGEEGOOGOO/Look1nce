# Look1nce Installation Checklist

## 📋 Step-by-Step Installation Guide

Follow this checklist in order. Check off each item as you complete it.

---

## Phase 1: Prerequisites Installation

### 1.1 Python Installation
- [ ] Download Python 3.10 or higher from https://www.python.org/downloads/
- [ ] During installation, CHECK "Add Python to PATH"
- [ ] Complete installation
- [ ] Open new terminal and verify:
      ```bash
      python --version
      ```
      Should show: `Python 3.10.x` or higher

### 1.2 Bun Installation (Windows)
- [ ] Open PowerShell as Administrator
- [ ] Run:
      ```powershell
      powershell -c "irm bun.sh/install.ps1 | iex"
      ```
- [ ] Close and reopen terminal
- [ ] Verify installation:
      ```bash
      bun --version
      ```
      Should show version number (e.g., `1.0.x`)

### 1.3 Check Project Files
- [ ] Navigate to `D:\Look1nce`
- [ ] Confirm these folders exist:
  - [ ] `backend/`
  - [ ] `frontend/`
- [ ] Confirm you see documentation files:
  - [ ] `README.md`
  - [ ] `SETUP_GUIDE.md`
  - [ ] This checklist

---

## Phase 2: Backend Setup

### 2.1 Navigate to Backend
- [ ] Open terminal (PowerShell or CMD)
- [ ] Run:
      ```bash
      cd D:\Look1nce\backend
      ```

### 2.2 Create Virtual Environment
- [ ] Run:
      ```bash
      python -m venv venv
      ```
- [ ] Wait for completion (~30 seconds)
- [ ] Verify `venv` folder was created in `backend/`

### 2.3 Activate Virtual Environment
- [ ] **PowerShell:**
      ```powershell
      venv\Scripts\activate
      ```
      **OR CMD:**
      ```cmd
      venv\Scripts\activate.bat
      ```
- [ ] Verify: Your prompt should now show `(venv)` at the beginning

### 2.4 Install Python Dependencies
- [ ] Ensure virtual environment is activated (see `(venv)` in prompt)
- [ ] Run:
      ```bash
      pip install -r requirements.txt
      ```
- [ ] **IMPORTANT:** This takes 5-15 minutes depending on internet speed
- [ ] During installation you'll see many packages being downloaded
- [ ] Wait for: `Successfully installed...` message

### 2.5 Verify Backend Installation
- [ ] All dependencies installed without errors
- [ ] No red error messages in terminal

### 2.6 Test Backend Server
- [ ] Run:
      ```bash
      python main.py
      ```
- [ ] Wait for these messages:
      ```
      INFO:     Started server process
      INFO:     Uvicorn running on http://0.0.0.0:8000
      INFO:     Application startup complete.
      ```
- [ ] Open browser and go to: http://localhost:8000
- [ ] You should see:
      ```json
      {"message": "Look1nce API is running!", "status": "healthy"}
      ```
- [ ] **SUCCESS!** Backend is working
- [ ] Press `Ctrl + C` to stop the server (we'll start it again later)

---

## Phase 3: Frontend Setup

### 3.1 Navigate to Frontend
- [ ] Open a **NEW terminal** (keep backend terminal available)
- [ ] Run:
      ```bash
      cd D:\Look1nce\frontend
      ```

### 3.2 Install Frontend Dependencies
- [ ] Run:
      ```bash
      bun install
      ```
- [ ] This takes 1-3 minutes
- [ ] Watch for progress indicators
- [ ] Wait for completion message

### 3.3 Verify Frontend Installation
- [ ] Check `node_modules/` folder was created
- [ ] No error messages in terminal

### 3.4 Test Frontend Server
- [ ] Run:
      ```bash
      bun dev
      ```
- [ ] Wait for these messages:
      ```
      ▲ Next.js 14.1.0
      - Local:        http://localhost:3000
      - Ready in XXXms
      ```
- [ ] Open browser and go to: http://localhost:3000
- [ ] You should see the Look1nce homepage with:
  - [ ] "Look1nce" title with icon
  - [ ] Three step indicators (1, 2, 3)
  - [ ] Upload cloth section visible
- [ ] **SUCCESS!** Frontend is working
- [ ] Press `Ctrl + C` to stop (we'll start both together next)

---

## Phase 4: Full System Test

### 4.1 Start Backend
- [ ] Terminal 1: Go to backend folder
      ```bash
      cd D:\Look1nce\backend
      ```
- [ ] Activate virtual environment
      ```bash
      venv\Scripts\activate
      ```
- [ ] Start server
      ```bash
      python main.py
      ```
- [ ] Wait for "Application startup complete"
- [ ] **Keep this terminal open**

### 4.2 Start Frontend
- [ ] Terminal 2: Open NEW terminal
- [ ] Go to frontend folder
      ```bash
      cd D:\Look1nce\frontend
      ```
- [ ] Start server
      ```bash
      bun dev
      ```
- [ ] Wait for "Ready in XXXms"
- [ ] **Keep this terminal open**

### 4.3 Access Application
- [ ] Open browser: http://localhost:3000
- [ ] Look1nce app loads successfully
- [ ] All UI elements visible

### 4.4 Test Health Check
- [ ] Open new browser tab: http://localhost:8000/health
- [ ] You should see:
      ```json
      {
        "status": "healthy",
        "services": {
          "cloth_preprocessor": "ready",
          "person_preprocessor": "ready",
          "tryon_service": "ready"
        }
      }
      ```

---

## Phase 5: First Try-On Test

### 5.1 Prepare Test Images
- [ ] Find a clothing item image (Google, Myntra, Amazon)
- [ ] Save it to your computer
- [ ] Find or take a photo of yourself:
  - [ ] Facing camera
  - [ ] Upper body visible
  - [ ] Good lighting
  - [ ] Neutral pose

### 5.2 Step 1: Upload Cloth
- [ ] Go to http://localhost:3000
- [ ] Click upload area in Step 1
- [ ] Select clothing image
- [ ] Image preview appears
- [ ] Select appropriate category:
  - Upper Body (shirts, jackets)
  - Lower Body (pants, jeans)
  - Dress (full outfit)
- [ ] Click "Continue to Photo Upload"
- [ ] Wait for processing (2-5 seconds)
- [ ] Should move to Step 2

### 5.3 Step 2: Upload Person Photo
- [ ] Choose "Upload Photo" button
- [ ] Select your photo
- [ ] Photo preview appears
- [ ] **OR** Choose "Use Camera":
  - [ ] Allow camera permissions
  - [ ] Camera feed appears
  - [ ] Click "Capture Photo"
  - [ ] Preview shows captured image
- [ ] Click "Continue to Try-On"
- [ ] Wait for processing (3-8 seconds)
- [ ] Should move to Step 3

### 5.4 Step 3: View Result
- [ ] Wait for AI processing
- [ ] You'll see progress messages:
  - "Analyzing clothing item..."
  - "Detecting body pose..."
  - "Running AI model..."
  - "Generating result..."
- [ ] **This takes 10-30 seconds on GPU, 30-60 seconds on CPU**
- [ ] Result image appears
- [ ] Green "Success" badge visible
- [ ] Can see yourself wearing the clothing item

### 5.5 Download Result
- [ ] Click "Download" button
- [ ] Image saves to your downloads folder
- [ ] Open downloaded image - verify it looks good

### 5.6 Try Another
- [ ] Click "Try Another" button
- [ ] Returns to Step 1
- [ ] Ready for next try-on

---

## Phase 6: Verification Checklist

### System Check
- [ ] Backend running without errors
- [ ] Frontend running without errors
- [ ] Both terminals show no red errors
- [ ] Can access http://localhost:3000
- [ ] Can access http://localhost:8000/health

### Functionality Check
- [ ] Can upload cloth images
- [ ] Cloth preprocessing works
- [ ] Can upload person photos
- [ ] Person preprocessing works
- [ ] Camera works (if using)
- [ ] Try-on generation completes
- [ ] Result image displays
- [ ] Can download results

### Quality Check
- [ ] Result looks realistic
- [ ] No major distortions
- [ ] Clothing item visible on person
- [ ] Face remains unchanged
- [ ] Body proportions correct

---

## Common Issues During Installation

### Issue: "Python not found"
**Solution:**
1. Reinstall Python
2. Check "Add to PATH" during installation
3. Restart terminal

### Issue: "pip not recognized"
**Solution:**
```bash
python -m pip --version
```
If this works, use `python -m pip install` instead of `pip install`

### Issue: "Virtual environment activation failed"
**Solution:**
Try alternative command:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
venv\Scripts\activate
```

### Issue: "Bun not found"
**Solution:**
1. Close and reopen terminal
2. Try full path: `~/.bun/bin/bun --version`
3. Reinstall if needed

### Issue: "Port 8000 already in use"
**Solution:**
```bash
# Find process
netstat -ano | findstr :8000

# Kill it
taskkill /PID <number> /F
```

### Issue: "Port 3000 already in use"
**Solution:**
```bash
bun dev --port 3001
```
Then update `.env.local` to use port 3001

### Issue: "Module not found" errors
**Solution:**
Backend:
```bash
cd D:\Look1nce\backend
venv\Scripts\activate
pip install -r requirements.txt --force-reinstall
```

Frontend:
```bash
cd D:\Look1nce\frontend
rm -rf node_modules
bun install
```

### Issue: "CUDA/GPU errors"
**Solution:**
App will auto-fallback to CPU. To force CPU:
```bash
pip uninstall torch torchvision
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

---

## Final Success Criteria

### You're ready to use Look1nce when ALL of these are true:

#### Technical Requirements ✅
- [ ] Python 3.10+ installed and working
- [ ] Bun installed and working
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Both servers can start without errors

#### Functional Requirements ✅
- [ ] Backend accessible at http://localhost:8000
- [ ] Frontend accessible at http://localhost:3000
- [ ] Health check returns healthy status
- [ ] Can upload and process images
- [ ] Virtual try-on generates results
- [ ] Results can be downloaded

#### User Experience ✅
- [ ] UI loads and looks good
- [ ] All three steps work
- [ ] Processing times are reasonable
- [ ] Results look realistic
- [ ] No major bugs or crashes

---

## 🎉 Installation Complete!

If you've checked all items above, congratulations! Look1nce is fully installed and ready to use.

### Next Steps:
1. Keep both terminals open while using the app
2. Experiment with different clothing items
3. Try various photos
4. Read QUICK_REFERENCE.md for tips
5. Check ARCHITECTURE.md to understand how it works

### Getting Help:
- If you encounter errors, copy the error message
- Check which phase the error occurred in
- Share the error in chat for debugging
- Include what you were trying to do when it failed

---

## 📝 Notes Space

Use this space to write down any issues you encountered and how you solved them:

```
Issue 1:
_____________________________________________
Solution:
_____________________________________________

Issue 2:
_____________________________________________
Solution:
_____________________________________________

Issue 3:
_____________________________________________
Solution:
_____________________________________________
```

---

## 🔄 Daily Startup Routine

After installation, here's how to start the app each time:

**Terminal 1 (Backend):**
```bash
cd D:\Look1nce\backend
venv\Scripts\activate
python main.py
```

**Terminal 2 (Frontend):**
```bash
cd D:\Look1nce\frontend
bun dev
```

**Browser:**
Open http://localhost:3000

**That's it! Enjoy using Look1nce! 🚀**
