# Look1nce - System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         User Browser                             │
│                     http://localhost:3000                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP/REST API
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                      Frontend (Next.js)                          │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Components:                                              │  │
│  │  - ClothUpload    (Step 1: Upload clothing image)        │  │
│  │  - PersonUpload   (Step 2: Upload/capture photo)         │  │
│  │  - TryOnResult    (Step 3: Show AI result)               │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Client (lib/api.ts)                                  │  │
│  │  - Handles all backend communication                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ Axios HTTP Requests
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   Backend (FastAPI Python)                       │
│                    http://localhost:8000                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Endpoints (main.py):                                 │  │
│  │  - POST /api/preprocess/cloth                             │  │
│  │  - POST /api/preprocess/person                            │  │
│  │  - POST /api/tryon                                        │  │
│  │  - GET  /api/result/{filename}                            │  │
│  └──────────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Services:                                                 │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ ClothPreprocessor                                   │  │  │
│  │  │ - Background removal (rembg)                        │  │  │
│  │  │ - Straighten & crop                                 │  │  │
│  │  │ - Cleanup & resize to 768x1024                      │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ PersonPreprocessor                                  │  │  │
│  │  │ - Pose detection (MediaPipe)                        │  │  │
│  │  │ - Smart crop around person                          │  │  │
│  │  │ - Image enhancement (CLAHE)                         │  │  │
│  │  │ - Resize & center to 768x1024                       │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │ TryOnService                                        │  │  │
│  │  │ - Load OOTDiffusion model                           │  │  │
│  │  │ - Generate clothing mask                            │  │  │
│  │  │ - Run AI inference                                  │  │  │
│  │  │ - Save result                                       │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ PyTorch / HuggingFace
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    OOTDiffusion AI Model                         │
│                   (levihsu/OOTDiffusion)                         │
│  - Stable Diffusion based virtual try-on                        │
│  - Runs on GPU (CUDA) or CPU                                    │
│  - ~2-3 seconds on GPU, ~30-60 seconds on CPU                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Pipeline

### Step 1: Cloth Image Upload
```
User uploads cloth image
        ↓
Frontend → POST /api/preprocess/cloth
        ↓
ClothPreprocessor:
  1. Remove background (rembg AI model)
  2. Find cloth contours and straighten
  3. Cleanup edges (morphology operations)
  4. Resize to 768x1024 (maintain aspect ratio)
  5. Save to temp/cloth_processed/
        ↓
Return processed_path to frontend
```

### Step 2: Person Photo Upload/Capture
```
User uploads photo OR captures from webcam
        ↓
Frontend → POST /api/preprocess/person
        ↓
PersonPreprocessor:
  1. Detect pose landmarks (MediaPipe)
  2. Calculate bounding box around person
  3. Crop with padding
  4. Enhance lighting (CLAHE algorithm)
  5. Resize to 768x1024 (centered)
  6. Save to temp/person_processed/
        ↓
Return processed_path to frontend
```

### Step 3: Virtual Try-On Generation
```
Frontend → POST /api/tryon
  (sends: cloth_path, person_path, category)
        ↓
TryOnService:
  1. Load OOTDiffusion model (first time only)
  2. Load preprocessed images
  3. Generate clothing mask based on category
     - upper_body: torso region
     - lower_body: legs region
     - dress: full body region
  4. Run Stable Diffusion inpainting:
     - Input: person image
     - Mask: clothing region
     - Reference: cloth image
     - Guidance: 7.5
     - Steps: 20
  5. Post-process result
  6. Save to results/ folder
        ↓
Return result_path to frontend
        ↓
Frontend displays result image
User can download or try another
```

---

## Technology Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **TailwindCSS** | Utility-first styling |
| **Axios** | HTTP client for API calls |
| **react-webcam** | Camera integration |
| **Lucide React** | Beautiful icons |
| **Bun** | Fast package manager & runtime |

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance Python web framework |
| **PyTorch** | Deep learning framework |
| **Diffusers** | HuggingFace Stable Diffusion library |
| **Transformers** | NLP & vision models |
| **OpenCV** | Image processing operations |
| **rembg** | AI-powered background removal |
| **MediaPipe** | Pose detection & landmarks |
| **Pillow** | Python image library |
| **Uvicorn** | ASGI server |

### AI Models
| Model | Purpose |
|-------|---------|
| **OOTDiffusion** | Main virtual try-on model |
| **U2Net** | Background removal (via rembg) |
| **MediaPipe Pose** | Human pose estimation |

---

## File System Structure

```
Look1nce/
├── backend/
│   ├── main.py                      # FastAPI server & routes
│   ├── requirements.txt             # Python dependencies
│   ├── services/
│   │   ├── __init__.py
│   │   ├── cloth_preprocessor.py   # Cloth image processing
│   │   ├── person_preprocessor.py  # Person image processing
│   │   └── tryon_service.py        # OOTDiffusion integration
│   ├── uploads/                     # Raw uploaded files
│   ├── temp/
│   │   ├── cloth_processed/        # Processed cloth images
│   │   └── person_processed/       # Processed person images
│   └── results/                     # Final try-on results
│
├── frontend/
│   ├── app/
│   │   ├── layout.tsx              # Root layout
│   │   ├── page.tsx                # Main page (3-step flow)
│   │   └── globals.css             # Global styles
│   ├── components/
│   │   ├── ClothUpload.tsx         # Step 1 component
│   │   ├── PersonUpload.tsx        # Step 2 component
│   │   └── TryOnResult.tsx         # Step 3 component
│   ├── lib/
│   │   └── api.ts                  # API client functions
│   ├── package.json
│   ├── tsconfig.json
│   ├── next.config.js
│   └── tailwind.config.ts
│
├── README.md                        # Project overview
├── SETUP_GUIDE.md                   # Detailed setup instructions
├── ARCHITECTURE.md                  # This file
└── START_SERVERS.md                 # Quick start commands
```

---

## API Reference

### Health Check
```http
GET /health
```

**Response:**
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

### Preprocess Cloth
```http
POST /api/preprocess/cloth
Content-Type: multipart/form-data

file: <image file>
category: "upper_body" | "lower_body" | "dress"
```

**Response:**
```json
{
  "status": "success",
  "message": "Cloth preprocessed successfully",
  "processed_path": "temp/cloth_processed/cloth_processed_xyz.png",
  "category": "upper_body"
}
```

### Preprocess Person
```http
POST /api/preprocess/person
Content-Type: multipart/form-data

file: <image file>
```

**Response:**
```json
{
  "status": "success",
  "message": "Person image preprocessed successfully",
  "processed_path": "temp/person_processed/person_processed_abc.png"
}
```

### Run Virtual Try-On
```http
POST /api/tryon
Content-Type: application/x-www-form-urlencoded

cloth_path: <string>
person_path: <string>
category: <string>
```

**Response:**
```json
{
  "status": "success",
  "message": "Virtual try-on completed successfully",
  "result_path": "results/tryon_result_1699123456.png"
}
```

### Get Result Image
```http
GET /api/result/{filename}
```

**Response:** Image file (PNG)

---

## Performance Optimization

### Backend Optimizations
- ✅ Model loaded once and cached
- ✅ Attention slicing for lower VRAM usage
- ✅ Image preprocessing before AI model
- ✅ Async operations where possible
- ✅ Efficient file handling

### Frontend Optimizations
- ✅ Next.js 14 App Router for fast navigation
- ✅ Client-side image preview (no upload until needed)
- ✅ Progressive loading indicators
- ✅ Optimized bundle size with tree-shaking

### Potential Improvements
- [ ] Implement image caching
- [ ] Add queue system for multiple users
- [ ] Compress result images
- [ ] Add CDN for model hosting
- [ ] Implement Redis for session management

---

## Security Considerations

### Current Implementation
- ✅ CORS restricted to localhost:3000
- ✅ File type validation (images only)
- ✅ File cleanup after processing
- ✅ No sensitive data stored

### Production Recommendations
- [ ] Add authentication (JWT/OAuth)
- [ ] Implement rate limiting
- [ ] Add file size limits (currently unlimited)
- [ ] Sanitize file names
- [ ] Use environment variables for secrets
- [ ] Enable HTTPS
- [ ] Add CSRF protection

---

## Scaling Considerations

### Current Limitations
- Single-threaded processing
- Local file storage
- No user management
- No caching layer

### Scaling Strategy
1. **Horizontal Scaling**: Multiple backend instances with load balancer
2. **Storage**: Use S3/Cloud Storage instead of local files
3. **Queue**: Add Celery/RabbitMQ for async processing
4. **Caching**: Redis for processed images
5. **Database**: PostgreSQL for user data & history
6. **CDN**: CloudFlare for static assets
7. **GPU Cluster**: Multiple GPU workers for parallel processing

---

## Development Workflow

```
Developer makes change
        ↓
Frontend: Bun hot-reload (instant)
Backend: Uvicorn auto-reload (~2s)
        ↓
Test in browser
        ↓
If error: Check terminal logs
        ↓
Debug and fix
        ↓
Commit changes
```

---

## Deployment Options

### Option 1: Docker (Recommended)
```dockerfile
# Future: Create Dockerfile for easy deployment
```

### Option 2: Traditional VPS
- Setup Python + Node.js
- Install dependencies
- Configure Nginx reverse proxy
- Setup SSL with Let's Encrypt

### Option 3: Cloud Platforms
- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render / AWS EC2
- **GPU**: RunPod / Lambda Labs

---

## Monitoring & Logging

### Current Logging
- Backend: Python `logging` module
- Frontend: Browser console
- Terminal output for both

### Production Monitoring
- [ ] Application Performance Monitoring (APM)
- [ ] Error tracking (Sentry)
- [ ] Analytics (Mixpanel/Amplitude)
- [ ] Server monitoring (Datadog/New Relic)

---

## Testing Strategy

### Manual Testing
1. Test cloth upload with different images
2. Test person upload from file
3. Test webcam capture
4. Test different clothing categories
5. Test error scenarios (invalid files, network errors)

### Automated Testing (Future)
- [ ] Unit tests for preprocessing functions
- [ ] Integration tests for API endpoints
- [ ] E2E tests with Playwright
- [ ] Performance benchmarks

---

## Future Enhancements

### Phase 2
- [ ] User accounts & history
- [ ] Save favorite try-ons
- [ ] Share results on social media
- [ ] Multiple clothing items at once
- [ ] Accessory support (glasses, hats, jewelry)

### Phase 3
- [ ] Video try-on (real-time)
- [ ] AR integration (smartphone)
- [ ] Virtual fitting room
- [ ] Size recommendation based on body measurements
- [ ] Color variations

### Phase 4
- [ ] Marketplace integration (direct shopping)
- [ ] Fashion recommendations
- [ ] Style mixing suggestions
- [ ] Community features

---

## License & Credits

### Model Credits
- **OOTDiffusion**: levihsu/OOTDiffusion (HuggingFace)
- **MediaPipe**: Google
- **U2Net**: Xuebin Qin et al.

### Framework Credits
- Next.js by Vercel
- FastAPI by Sebastián Ramírez
- PyTorch by Meta AI
