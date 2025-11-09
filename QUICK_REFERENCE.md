# Look1nce - Quick Reference Card

## 🚀 Starting the App

### Backend (Terminal 1)
```bash
cd D:/Look1nce/backend
venv\Scripts\activate
python main.py
```
Wait for: `Uvicorn running on http://0.0.0.0:8000`

### Frontend (Terminal 2)
```bash
cd D:/Look1nce/frontend
bun dev
```
Wait for: `Local: http://localhost:3000`

### Access App
**Open browser:** http://localhost:3000

---

## 📂 Project Structure (Quick View)

```
Look1nce/
├── backend/              # Python FastAPI
│   ├── main.py          # API server
│   └── services/        # Processing logic
├── frontend/            # Next.js React
│   ├── app/            # Pages
│   ├── components/     # UI components
│   └── lib/            # API client
└── [Documentation files]
```

---

## 🔧 Common Commands

### Backend
```bash
# Activate environment
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
python main.py

# Test API
curl http://localhost:8000/health
```

### Frontend
```bash
# Install dependencies
bun install

# Start dev server
bun dev

# Build for production
bun run build
```

---

## 🌐 URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Main app interface |
| Backend API | http://localhost:8000 | API endpoints |
| API Docs | http://localhost:8000/docs | Swagger UI |
| Health Check | http://localhost:8000/health | Status check |

---

## 📡 API Endpoints

```
POST /api/preprocess/cloth    # Upload & process clothing
POST /api/preprocess/person   # Upload & process photo
POST /api/tryon               # Run virtual try-on
GET  /api/result/{filename}   # Get result image
GET  /health                  # Health check
```

---

## ⚙️ Clothing Categories

- `upper_body` - Shirts, T-shirts, Jackets, Tops
- `lower_body` - Pants, Jeans, Shorts, Skirts
- `dress` - Dresses, Full-body outfits

---

## 🎯 User Flow

```
1. Upload cloth image → Select category → Process
          ↓
2. Upload your photo OR Use webcam → Capture
          ↓
3. AI processing (10-30s) → View result → Download
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Check Python installed, venv activated |
| Frontend won't start | Run `bun install` first |
| Port 8000 in use | Kill process or change port in main.py |
| Port 3000 in use | Use `bun dev --port 3001` |
| API connection failed | Ensure backend is running |
| Camera not working | Check browser permissions, or use upload |
| Model download fails | Check internet, need ~5GB space |
| Out of memory | Use CPU instead of GPU, close other apps |

---

## 💻 System Requirements

### Minimum
- Python 3.10+
- Node.js 18+
- 8GB RAM
- 10GB disk space
- Any OS (Windows/Mac/Linux)

### Recommended
- Python 3.11
- 16GB RAM
- NVIDIA GPU with 6GB VRAM
- Fast internet (for model download)

---

## 📦 Key Dependencies

### Backend
- `fastapi` - Web framework
- `torch` - PyTorch (AI models)
- `diffusers` - Stable Diffusion
- `rembg` - Background removal
- `mediapipe` - Pose detection
- `opencv-python` - Image processing

### Frontend
- `next` - React framework
- `react-webcam` - Camera access
- `axios` - HTTP client
- `tailwindcss` - Styling

---

## 🔥 Pro Tips

1. **Better Results**
   - Use high-quality images
   - Good lighting in photos
   - Person facing camera
   - Clear clothing items

2. **Faster Processing**
   - Use GPU if available
   - Reduce image sizes
   - Close other applications

3. **Development**
   - Keep both terminals visible
   - Watch for error messages
   - Check browser console (F12)

---

## 📁 Important Files

| File | Purpose |
|------|---------|
| `backend/main.py` | API server entry point |
| `backend/requirements.txt` | Python packages |
| `backend/services/tryon_service.py` | AI model integration |
| `frontend/app/page.tsx` | Main UI page |
| `frontend/lib/api.ts` | API client |
| `frontend/components/*.tsx` | UI components |

---

## 🎨 Customization Quick Guide

### Change Colors
Edit: `frontend/tailwind.config.ts`
```typescript
colors: {
  primary: '#6366f1',  // Change this
  secondary: '#8b5cf6' // And this
}
```

### Change Processing Speed
Edit: `backend/services/tryon_service.py`
```python
num_inference_steps=20,  # Lower = faster, higher = better
```

### Change Image Resolution
Edit: `backend/services/cloth_preprocessor.py`
```python
target_size: tuple = (768, 1024)  # Change dimensions
```

---

## 🔒 Security Notes

- ⚠️ This is a **LOCAL DEVELOPMENT** setup
- ⚠️ **DO NOT** expose to internet without:
  - Authentication
  - Rate limiting
  - File size limits
  - HTTPS
  - Input validation

---

## 📚 Documentation Files

- `README.md` - Project overview
- `SETUP_GUIDE.md` - Detailed installation
- `ARCHITECTURE.md` - Technical details
- `START_SERVERS.md` - Quick start
- `QUICK_REFERENCE.md` - This file

---

## 🆘 Getting Help

1. Read error message carefully
2. Check both terminal logs
3. Check browser console (F12)
4. Review SETUP_GUIDE.md
5. Copy error message to chat for debugging

---

## ✅ Pre-Flight Checklist

Before using:
- [ ] Python 3.10+ installed
- [ ] Bun installed
- [ ] Backend dependencies installed
- [ ] Frontend dependencies installed
- [ ] Backend running (port 8000)
- [ ] Frontend running (port 3000)
- [ ] http://localhost:3000 loads
- [ ] http://localhost:8000/health returns JSON

---

## 🎬 First Run Steps

1. Open 2 terminals
2. Terminal 1: Start backend (see top)
3. Terminal 2: Start frontend (see top)
4. Open http://localhost:3000
5. Upload clothing image
6. Upload your photo
7. Wait for AI processing
8. View & download result!

---

## 💾 File Cleanup

To free disk space:
```bash
# Delete temporary files
cd D:/Look1nce/backend
rm -rf uploads/* temp/* results/*

# Or manually delete these folders' contents
```

---

## 🔄 Restart Commands

**Backend crashed?**
```bash
# Press Ctrl+C, then:
python main.py
```

**Frontend crashed?**
```bash
# Press Ctrl+C, then:
bun dev
```

**Full restart?**
```bash
# Close both terminals
# Re-run backend and frontend start commands
```

---

## 📊 Performance Metrics

| Operation | Time (GPU) | Time (CPU) |
|-----------|------------|------------|
| Cloth preprocessing | 2-3s | 3-5s |
| Person preprocessing | 3-5s | 5-8s |
| Virtual try-on | 10-15s | 30-60s |
| **Total** | **~20s** | **~50s** |

---

## 🎯 Success Indicators

You'll know it's working when:
- ✅ Both terminals show no errors
- ✅ Backend says "Application startup complete"
- ✅ Frontend says "Ready in XXms"
- ✅ Browser loads Look1nce homepage
- ✅ Can upload images without errors
- ✅ AI generates results successfully

---

## 🚫 Known Limitations

- Single user at a time
- No user accounts/history
- Files stored locally (not cloud)
- No real-time video support
- Requires good lighting in photos
- Processing takes time (not instant)

---

## 🌟 Best Practices

1. Use PNG or JPG images only
2. Keep image sizes under 5MB
3. Take photos in well-lit areas
4. Face camera directly
5. Try different clothing categories
6. Be patient during processing
7. Download results before trying new

---

## 🔗 Useful Commands Cheat Sheet

```bash
# Check Python version
python --version

# Check Bun version
bun --version

# Find process on port 8000
netstat -ano | findstr :8000

# Kill process (Windows)
taskkill /PID <number> /F

# Check GPU availability
python -c "import torch; print(torch.cuda.is_available())"

# List Python packages
pip list

# Update pip
python -m pip install --upgrade pip
```

---

**Keep this file handy for quick reference during development!**
