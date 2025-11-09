# Look1nce - Virtual Try-On Application

AI-powered virtual try-on app using OOTDiffusion. Upload a clothing item and your photo to see how it looks on you!

## Architecture

```
Look1nce/
├── frontend/          # Next.js + TypeScript + Bun
├── backend/           # FastAPI + Python
└── README.md
```

## Prerequisites

### System Requirements
- **Node.js**: v18+ (for Bun compatibility)
- **Bun**: Latest version
- **Python**: 3.10+
- **CUDA**: Optional but recommended for GPU acceleration

### Installation Links
- Bun: https://bun.sh/
- Python: https://www.python.org/downloads/

## Quick Start

### 1. Backend Setup (Python FastAPI)

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python main.py
```

Backend will run on: **http://localhost:8000**

### 2. Frontend Setup (Next.js + Bun)

```bash
cd frontend

# Install dependencies
bun install

# Start development server
bun dev
```

Frontend will run on: **http://localhost:3000**

## Usage

1. Open browser at `http://localhost:3000`
2. Upload a clothing item image (from website screenshot or product image)
3. Upload your photo or use camera
4. Select clothing category (upper body, lower body, dress)
5. Click "Try On" and see the result!

## Pipeline Flow

1. **Cloth Upload** → User uploads garment image
2. **Cloth Preprocessing** → Background removal & segmentation
3. **Person Upload** → User uploads photo or takes picture
4. **Person Preprocessing** → Pose detection, cropping
5. **Virtual Try-On** → OOTDiffusion model processes
6. **Result Display** → Show final try-on result

## API Endpoints

- `POST /api/preprocess/cloth` - Preprocess garment image
- `POST /api/preprocess/person` - Preprocess person image
- `POST /api/tryon` - Run virtual try-on
- `GET /health` - Health check

## Troubleshooting

See individual README files in `frontend/` and `backend/` directories for detailed troubleshooting.

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Bun
- **Backend**: FastAPI, PyTorch, OOTDiffusion, OpenCV, rembg
- **AI Model**: OOTDiffusion (levihsu/OOTDiffusion)
