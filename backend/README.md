# Look1nce Backend

FastAPI backend for virtual try-on using OOTDiffusion.

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv
```

### 2. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

**Note:** This will download ~4GB of dependencies including PyTorch and model weights.

### 4. Run Server

```bash
python main.py
```

Server will start at: **http://localhost:8000**

## API Documentation

Once running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Endpoints

### Health Check
```
GET /health
```

### Preprocess Cloth
```
POST /api/preprocess/cloth
Body: multipart/form-data
  - file: image file
  - category: string (upper_body, lower_body, dress)
```

### Preprocess Person
```
POST /api/preprocess/person
Body: multipart/form-data
  - file: image file
```

### Virtual Try-On
```
POST /api/tryon
Body: form-data
  - cloth_path: string
  - person_path: string
  - category: string
```

### Get Result
```
GET /api/result/{filename}
```

## Troubleshooting

### CUDA Issues
If you don't have CUDA/GPU, the backend will automatically use CPU (slower but works).

To install CPU-only PyTorch:
```bash
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

### Model Download Issues
The OOTDiffusion model will be downloaded automatically on first use (~2GB). Ensure you have:
- Stable internet connection
- Sufficient disk space (~5GB free)

### Memory Issues
If you encounter OOM (Out of Memory) errors:
1. Close other applications
2. Use CPU instead of GPU
3. Reduce image resolution in preprocessing

## Project Structure

```
backend/
├── main.py                    # FastAPI application
├── services/
│   ├── cloth_preprocessor.py  # Cloth image processing
│   ├── person_preprocessor.py # Person image processing
│   └── tryon_service.py       # OOTDiffusion integration
├── uploads/                   # Uploaded files
├── temp/                      # Processed files
└── results/                   # Try-on results
```
