# ⚡ Look1nce + Colab Quick Start

## 🎯 Your To-Do List (2 minutes!):

### ✅ Step 1: Upload Simple Notebook to Colab
1. Go to: https://colab.research.google.com/
2. Click **File → Upload notebook**
3. Upload: `OOTDiffusion_Colab_Simple.ipynb` ⭐ (USE THIS ONE - it works!)

### ✅ Step 2: Enable GPU
1. Click **Runtime → Change runtime type**
2. Select **T4 GPU**
3. Click **Save**

### ✅ Step 3: Run Everything
1. Click **Runtime → Run all** (or press `Ctrl+F9`)
2. ⏳ Wait ~2 minutes
3. ☕ Super quick!

### ✅ Step 4: Copy Your URL
Look for this at the bottom:
```
Running on public URL: https://abc123def456.gradio.live
```
**📋 Copy that URL!**

### ✅ Step 5: Update Backend
1. Open: `backend/.env`
2. Paste your URL:
   ```
   COLAB_API_URL=https://abc123def456.gradio.live
   ```
3. Save file

### ✅ Step 6: Start Backend
```bash
cd backend
python main.py
```

Look for: `🚀 Using Google Colab API`

### ✅ Step 7: Start Frontend
```bash
cd frontend
npm run dev
```

### ✅ Step 8: Test!
1. Open: http://localhost:3000
2. Upload images
3. Get results! 🎉

---

## 🔄 Next Time (5 minutes):

1. Open Colab notebook (bookmark it!)
2. Click **Runtime → Run all**
3. Copy new URL
4. Update `backend/.env`
5. Restart backend
6. Done!

---

## ⚠️ Remember:

- ✅ Keep Colab tab open while using app
- ✅ URL changes each session
- ✅ First time takes 10-12 minutes (downloads models)
- ✅ After that only 2-3 minutes
- ✅ FREE tier: 10-20 GPU hours/day
- ⭐ Colab Pro ($10/month): 100+ hours/month

---

## 🆘 Problems?

Read: `COLAB_SETUP_GUIDE.md` for detailed help!

**Most Common Fix:** Re-run Colab cells, copy new URL, update `.env`, restart backend

---

**That's it! Enjoy your GPU-powered virtual try-on! 🚀**
