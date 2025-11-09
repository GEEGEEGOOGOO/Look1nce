import os
import uvicorn
from fastapi import FastAPI, File, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from pathlib import Path
import shutil
from typing import Optional
import logging

from services.cloth_preprocessor import ClothPreprocessor
from services.person_preprocessor import PersonPreprocessor
from services.tryon_service import TryOnService

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Look1nce API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = Path("uploads")
RESULTS_DIR = Path("results")
TEMP_DIR = Path("temp")

for directory in [UPLOAD_DIR, RESULTS_DIR, TEMP_DIR]:
    directory.mkdir(exist_ok=True)

cloth_preprocessor = ClothPreprocessor()
person_preprocessor = PersonPreprocessor()
tryon_service = TryOnService()

@app.get("/")
async def root():
    return {"message": "Look1nce API is running!", "status": "healthy"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "cloth_preprocessor": "ready",
            "person_preprocessor": "ready",
            "tryon_service": "ready"
        }
    }

@app.post("/api/preprocess/cloth")
async def preprocess_cloth(
    file: UploadFile = File(...),
    category: str = Form(...)
):
    try:
        logger.info(f"Preprocessing cloth image: {file.filename}, category: {category}")
        
        cloth_path = UPLOAD_DIR / f"cloth_{file.filename}"
        logger.info(f"Saving uploaded file to: {cloth_path}")
        
        with open(cloth_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        logger.info(f"File saved successfully, size: {cloth_path.stat().st_size} bytes")
        logger.info(f"Starting preprocessing...")
        
        processed_path = cloth_preprocessor.process(str(cloth_path), category)
        
        logger.info(f"Preprocessing complete: {processed_path}")
        
        return JSONResponse({
            "status": "success",
            "message": "Cloth preprocessed successfully",
            "processed_path": processed_path,
            "category": category
        })
    
    except Exception as e:
        logger.error(f"Error preprocessing cloth: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/preprocess/person")
async def preprocess_person(file: UploadFile = File(...)):
    try:
        logger.info(f"Preprocessing person image: {file.filename}")
        
        person_path = UPLOAD_DIR / f"person_{file.filename}"
        with open(person_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        processed_path = person_preprocessor.process(str(person_path))
        
        return JSONResponse({
            "status": "success",
            "message": "Person image preprocessed successfully",
            "processed_path": processed_path
        })
    
    except Exception as e:
        logger.error(f"Error preprocessing person: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/tryon")
async def virtual_tryon(
    cloth_path: str = Form(...),
    person_path: str = Form(...),
    category: str = Form(...)
):
    try:
        logger.info(f"Running virtual try-on: cloth={cloth_path}, person={person_path}, category={category}")
        
        if not os.path.exists(cloth_path) or not os.path.exists(person_path):
            raise HTTPException(status_code=400, detail="Invalid file paths")
        
        result_path = await tryon_service.run_tryon(cloth_path, person_path, category)
        
        return JSONResponse({
            "status": "success",
            "message": "Virtual try-on completed successfully",
            "result_path": result_path
        })
    
    except Exception as e:
        logger.error(f"Error in virtual try-on: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/result/{filename:path}")
async def get_result(filename: str):
    # Remove 'results/' prefix if present (since RESULTS_DIR already has it)
    if filename.startswith("results/") or filename.startswith("results\\"):
        filename = filename.split("/", 1)[-1].split("\\", 1)[-1]
    
    file_path = RESULTS_DIR / filename
    logger.info(f"Fetching result: {file_path}")
    
    if not file_path.exists():
        logger.error(f"Result file not found: {file_path}")
        raise HTTPException(status_code=404, detail="Result not found")
    return FileResponse(file_path)

@app.delete("/api/cleanup")
async def cleanup_files():
    try:
        for directory in [UPLOAD_DIR, RESULTS_DIR, TEMP_DIR]:
            for file in directory.glob("*"):
                if file.is_file():
                    file.unlink()
        return {"status": "success", "message": "Cleanup completed"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    print("Starting Uvicorn server...")
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=False)
