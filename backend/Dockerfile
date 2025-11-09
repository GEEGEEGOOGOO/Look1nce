# Use Python 3.10 (OOTDiffusion was built with this)
FROM python:3.10-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    wget \
    libgl1 \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Install PyTorch with CUDA 11.8 support (compatible with most GPUs)
RUN pip install --no-cache-dir torch==2.1.0 torchvision==0.16.0 --index-url https://download.pytorch.org/whl/cu118

# Install exact versions for OOTDiffusion compatibility
RUN pip install --no-cache-dir \
    diffusers==0.24.0 \
    transformers==4.36.2 \
    accelerate==0.21.0 \
    huggingface_hub==0.20.0 \
    safetensors==0.4.0 \
    opencv-python==4.8.1.78 \
    opencv-contrib-python==4.8.1.78 \
    Pillow==10.1.0 \
    numpy==1.24.3 \
    fastapi==0.104.1 \
    uvicorn==0.24.0 \
    python-multipart==0.0.6 \
    rembg==2.0.50 \
    mediapipe==0.10.8 \
    einops==0.7.0

# Copy only necessary backend code (not checkpoints, they're mounted)
COPY main.py /app/
COPY services /app/services/
COPY requirements.txt /app/ 2>/dev/null || true

# Create directories
RUN mkdir -p /app/uploads /app/temp /app/results /app/checkpoints

# Expose port
EXPOSE 8000

# Run the FastAPI server
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
