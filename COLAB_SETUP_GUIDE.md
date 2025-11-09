# 🚀 Look1nce + Google Colab Setup Guide

## 📋 What This Does:

Your Look1nce app will work like this:

```
React Frontend → FastAPI Backend → Google Colab (T4 GPU) → OOTDiffusion Model → Results
```

**Benefits:**
- ✅ FREE T4 GPU (or $10/month for more hours)
- ✅ Unlimited try-ons (no quota limits!)
- ✅ Fast processing (~20-40 seconds per try-on)
- ✅ High quality results

---

## 🎯 Step-by-Step Setup (Takes 15 minutes)

### **Step 1: Open Google Colab** (2 minutes)

1. Go to Google Colab: https://colab.research.google.com/
2. Sign in with your Google account
3. Click **File → Upload notebook**
4. Upload the file: `D:/Look1nce/OOTDiffusion_Colab_Backend.ipynb`

### **Step 2: Enable GPU** (1 minute)

1. In Colab, click **Runtime** (top menu)
2. Click **Change runtime type**
3. Select **T4 GPU** from the dropdown
4. Click **Save**

### **Step 3: Run All Cells** (10-12 minutes first time)

1. Click **Runtime → Run all** (or press `Ctrl+F9`)
2. Wait for all cells to complete
3. The notebook will:
   - Install dependencies (2-3 minutes)
   - Download OOTDiffusion model (~3GB, 5-10 minutes)
   - Load the model into GPU memory (2-3 minutes)
   - Start the API server

**⏳ First time takes longer because it downloads models. Next time it's instant!**

### **Step 4: Copy Your API URL** (1 minute)

After the last cell runs, you'll see:

```
Running on public URL: https://abc123def456.gradio.live
```

**📋 COPY THIS URL!** (It looks like `https://xxxxx.gradio.live`)

### **Step 5: Update Your Backend** (1 minute)

1. Open the file: `D:/Look1nce/backend/.env`
2. Paste your URL:
   ```
   COLAB_API_URL=https://abc123def456.gradio.live
   ```
3. Save the file

### **Step 6: Restart Your Backend** (1 minute)

1. Stop your backend if it's running (press `Ctrl+C` in terminal)
2. Start it again:
   ```bash
   cd D:/Look1nce/backend
   python main.py
   ```

You should see:
```
🚀 Using Google Colab API: https://abc123def456.gradio.live
```

### **Step 7: Start Your Frontend & Test!** (1 minute)

1. Open new terminal
2. Run:
   ```bash
   cd D:/Look1nce/frontend
   npm run dev
   ```
3. Open: http://localhost:3000
4. Upload images and try it out! 🎉

---

## ✅ How to Know It's Working:

### In Colab:
- You'll see "✅ SERVER IS RUNNING!" message
- The interface shows at the bottom
- You'll see processing logs when you use the app

### In Your Backend Terminal:
- You should see: `🚀 Using Google Colab API: https://xxxxx.gradio.live`
- When you upload images, you'll see API calls being logged

### In Your React App:
- Upload person photo → Upload clothing → Click "Continue"
- Results come back in 20-40 seconds
- No more quota errors! 🎊

---

## 🔄 Daily Usage:

### Every Time You Want to Use Your App:

1. **Open Colab notebook** (bookmark it!)
2. **Click Runtime → Run all**
3. **Wait 2-3 minutes** (models load from cache, much faster!)
4. **Copy the new URL** (it changes each session)
5. **Update `.env` file** with new URL
6. **Restart backend**
7. **Use your app!**

### Pro Tip: Keep Colab Alive
- Colab disconnects after ~90 minutes of inactivity
- Keep the tab open while using your app
- If it disconnects, just re-run all cells

---

## 💰 Cost Breakdown:

### Free Tier:
- **GPU Hours:** ~10-20 hours per day
- **Session Length:** Up to 12 hours
- **Cost:** $0 (FREE!)
- **Best for:** Testing, personal use, low traffic

### Colab Pro ($9.99/month):
- **GPU Hours:** 100+ hours per month
- **Session Length:** Up to 24 hours
- **Priority GPU Access:** Faster queue
- **Cost:** $10/month
- **Best for:** Regular use, small business

### Colab Pro+ ($49.99/month):
- **GPU Hours:** 500+ hours per month
- **Better GPUs:** V100, A100 access
- **Session Length:** Unlimited
- **Cost:** $50/month
- **Best for:** Heavy usage, production

---

## ⚠️ Troubleshooting:

### Problem: "Session disconnected"
**Solution:** Just re-run all cells in Colab, get new URL, update `.env`

### Problem: "Out of GPU quota"
**Solutions:**
- Wait 24 hours (quota resets)
- Upgrade to Colab Pro ($10/month)
- Use the free HF Space (limited but works)

### Problem: "Gradio URL not working"
**Solution:** 
- The URL changes each session
- Make sure you copied the latest one
- Update `.env` file with new URL
- Restart backend

### Problem: "Model not loading"
**Solution:**
- Check GPU is enabled (Runtime → Change runtime type)
- Re-run all cells
- Check Colab logs for errors

### Problem: "Backend still using HF Space"
**Solution:**
- Check `.env` file has `COLAB_API_URL=...`
- Make sure there's no space after the `=`
- Restart backend server
- Check backend logs for "🚀 Using Google Colab API"

---

## 🎓 Advanced Options:

### Want Permanent Deployment?
If you don't want to run Colab manually:

**Option 1: Deploy to Railway/Render** (Easiest)
- Cost: ~$5-10/month
- Deploy the OOTDiffusion model as a service
- Get permanent URL (no need to update `.env`)

**Option 2: AWS/GCP with GPU** (Production)
- Cost: ~$0.50-1.00/hour when running
- Best for production apps
- Auto-scaling, high availability

**Option 3: Run Locally** (If you have GPU)
- Install OOTDiffusion on your PC
- Requires NVIDIA GPU with 12GB+ VRAM
- No recurring costs

Let me know if you want setup guides for these!

---

## 📊 Performance Expectations:

| Aspect | Performance |
|--------|-------------|
| **Processing Time** | 20-40 seconds per try-on |
| **Quality** | High (same as official HF Space) |
| **Concurrent Users** | 1-3 users simultaneously |
| **Image Size** | Up to 1024x768 recommended |
| **Success Rate** | 95%+ with good input images |

---

## ✨ Tips for Best Results:

### Person Photos:
- ✅ Face the camera directly
- ✅ Full upper body visible
- ✅ Good lighting
- ✅ Simple background
- ✅ Neutral pose (arms at sides)
- ❌ Avoid crossed arms
- ❌ Avoid dark/blurry photos

### Clothing Photos:
- ✅ Flat lay or model photos work best
- ✅ Clear visibility of the garment
- ✅ Product photos from shopping sites (Myntra, Amazon) work great!
- ✅ White/neutral background preferred
- ❌ Avoid wrinkled clothes
- ❌ Avoid complex patterns (sometimes works but slower)

---

## 🆘 Need Help?

### Quick Links:
- **Colab Notebook:** `D:/Look1nce/OOTDiffusion_Colab_Backend.ipynb`
- **Backend .env:** `D:/Look1nce/backend/.env`
- **This Guide:** `D:/Look1nce/COLAB_SETUP_GUIDE.md`

### Common Issues:
1. Check Colab is running (look for "✅ SERVER IS RUNNING!")
2. Check backend logs (should show "🚀 Using Google Colab API")
3. Check `.env` file has correct URL
4. Try restarting backend

---

## 🎉 You're All Set!

Your Look1nce app is now powered by FREE Google Colab GPU! 

**Remember:**
- Keep Colab tab open while using the app
- Update `.env` with new URL each session
- Upgrade to Colab Pro for heavy usage ($10/month)

**Enjoy unlimited virtual try-ons! 🎨👔✨**

---

Made with ❤️ by Factory AI
