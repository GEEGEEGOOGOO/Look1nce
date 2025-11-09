import os
import sys
import torch
from PIL import Image
from pathlib import Path
import logging
from typing import Optional
import time
import numpy as np

logger = logging.getLogger(__name__)

class OOTDTryOnService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"OOTDTryOnService initialized on device: {self.device}")
        
        self.checkpoints_dir = Path("checkpoints")
        self.results_dir = Path("results")
        self.results_dir.mkdir(exist_ok=True)
        
        self.model_loaded = False
        self.ootd_model = None
        
        # OOTDiffusion paths
        self.model_path = self.checkpoints_dir / "ootd"
        self.vae_path = self.checkpoints_dir / "ootd" / "ootd_vae"
        self.unet_path = self.checkpoints_dir / "ootd" / "ootd_unet"
    
    def _load_model(self):
        """Load OOTDiffusion model"""
        if self.model_loaded:
            return
        
        try:
            logger.info("Loading OOTDiffusion model...")
            logger.info(f"Model path: {self.model_path}")
            logger.info(f"Device: {self.device}")
            
            # Add OOTDiffusion to path
            sys.path.insert(0, str(Path(__file__).parent / "ootd"))
            
            from pipelines_ootd.pipeline_ootd import OotdPipeline
            
            # Load the pipeline
            logger.info("Initializing OOTDiffusion pipeline...")
            
            self.ootd_model = OotdPipeline.from_pretrained(
                str(self.model_path),
                torch_dtype=torch.float32,  # Use float32 for 4GB GPU
                use_safetensors=True
            ).to(self.device)
            
            # Enable memory optimizations
            if self.device != "cpu":
                logger.info("Enabling memory optimizations for 4GB GPU...")
                self.ootd_model.enable_attention_slicing()
                self.ootd_model.enable_vae_slicing()
                if hasattr(self.ootd_model, 'enable_model_cpu_offload'):
                    self.ootd_model.enable_model_cpu_offload()
            
            self.model_loaded = True
            logger.info("OOTDiffusion model loaded successfully!")
        
        except Exception as e:
            logger.error(f"Failed to load OOTDiffusion model: {str(e)}", exc_info=True)
            logger.warning("Model loading failed. Please ensure:")
            logger.warning(f"1. Checkpoints exist in: {self.checkpoints_dir}")
            logger.warning("2. All OOTDiffusion files are properly copied")
            self.model_loaded = False
    
    async def run_tryon(self, cloth_path: str, person_path: str, category: str) -> str:
        """Run virtual try-on"""
        logger.info(f"Running OOTDiffusion try-on: cloth={cloth_path}, person={person_path}, category={category}")
        
        # Load model if not loaded
        if not self.model_loaded:
            self._load_model()
        
        # Load images
        cloth_img = Image.open(cloth_path).convert("RGB")
        person_img = Image.open(person_path).convert("RGB")
        
        if self.model_loaded and self.ootd_model:
            result_img = await self._run_ootd_inference(person_img, cloth_img, category)
        else:
            logger.error("OOTDiffusion model not loaded, cannot perform try-on")
            raise RuntimeError("OOTDiffusion model failed to load")
        
        # Save result
        timestamp = int(time.time())
        result_filename = f"tryon_result_{timestamp}.png"
        result_path = self.results_dir / result_filename
        result_img.save(result_path)
        
        logger.info(f"Try-on result saved: {result_path}")
        return str(result_path)
    
    async def _run_ootd_inference(self, person_img: Image.Image, cloth_img: Image.Image, category: str) -> Image.Image:
        """Run OOTDiffusion inference"""
        logger.info("Running OOTDiffusion inference...")
        
        try:
            # Prepare inputs
            # OOTDiffusion expects specific input format
            cloth_type = self._map_category(category)
            
            logger.info(f"Inference parameters: cloth_type={cloth_type}")
            
            # Run inference
            with torch.no_grad():
                result = self.ootd_model(
                    cloth_image=cloth_img,
                    person_image=person_img,
                    cloth_type=cloth_type,
                    num_inference_steps=20,
                    guidance_scale=2.0,
                )
            
            if isinstance(result, dict) and 'images' in result:
                result_img = result['images'][0]
            elif isinstance(result, list):
                result_img = result[0]
            else:
                result_img = result
            
            logger.info("OOTDiffusion inference complete!")
            return result_img
        
        except Exception as e:
            logger.error(f"OOTDiffusion inference failed: {str(e)}", exc_info=True)
            raise
    
    def _map_category(self, category: str) -> str:
        """Map our category names to OOTDiffusion format"""
        mapping = {
            "upper_body": "upper",
            "upperbody": "upper",
            "top": "upper",
            "shirt": "upper",
            "lower_body": "lower",
            "lowerbody": "lower",
            "bottom": "lower",
            "pants": "lower",
            "dress": "overall",
            "full_body": "overall",
            "fullbody": "overall"
        }
        return mapping.get(category.lower(), "upper")
