import os
import sys
import torch
from PIL import Image
from pathlib import Path
import logging
from typing import Optional
import time

# Set HuggingFace cache to D drive
os.environ['HF_HOME'] = 'D:/huggingface_cache'
os.environ['TRANSFORMERS_CACHE'] = 'D:/huggingface_cache/transformers'
os.environ['HF_DATASETS_CACHE'] = 'D:/huggingface_cache/datasets'

logger = logging.getLogger(__name__)

class TryOnService:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        logger.info(f"TryOnService initialized on device: {self.device}")
        
        self.results_dir = Path("results")
        self.results_dir.mkdir(exist_ok=True)
        
        self.model_loaded = False
        self.pipe = None
    
    def _load_model(self):
        if self.model_loaded:
            return
        
        try:
            logger.info("Loading Stable Diffusion Inpainting model...")
            logger.info("This will download ~4GB on first run to D:/huggingface_cache/")
            logger.info("Please be patient, this is a one-time download...")
            
            from diffusers import StableDiffusionInpaintPipeline
            
            model_id = "runwayml/stable-diffusion-inpainting"
            
            self.pipe = StableDiffusionInpaintPipeline.from_pretrained(
                model_id,
                torch_dtype=torch.float32,  # Use float32 for 4GB VRAM
                safety_checker=None,
                requires_safety_checker=False
            )
            self.pipe = self.pipe.to(self.device)
            
            # Memory optimizations for 4GB GPU
            if self.device != "cpu":
                self.pipe.enable_attention_slicing()
                logger.info("Enabled attention slicing for 4GB GPU")
            
            self.model_loaded = True
            logger.info("Stable Diffusion Inpainting model loaded successfully!")
        
        except Exception as e:
            logger.error(f"Failed to load model: {str(e)}", exc_info=True)
            logger.warning("Falling back to mock mode for testing...")
            self.model_loaded = False
    
    async def run_tryon(self, cloth_path: str, person_path: str, category: str) -> str:
        logger.info(f"Running virtual try-on: cloth={cloth_path}, person={person_path}, category={category}")
        
        # Try HuggingFace Space API first
        try:
            from services.hf_space_integration import HFSpaceOOTD
            # Use HF token from environment variable
            hf_token = os.getenv("HUGGINGFACE_TOKEN")
            if not hf_token:
                logger.warning("HUGGINGFACE_TOKEN not set in environment variables. Skipping HF Space API.")
                raise ValueError("HUGGINGFACE_TOKEN not configured")
            hf_space = HFSpaceOOTD(hf_token=hf_token)
            logger.info("Using HuggingFace Space API for OOTDiffusion...")
            result_path = await hf_space.run_tryon(cloth_path, person_path, category)
            return result_path
        except Exception as e:
            logger.warning(f"HF Space API failed: {e}")
            logger.info("Falling back to local compositing...")
            
            # Fallback to local compositing
            cloth_img = Image.open(cloth_path).convert("RGB")
            person_img = Image.open(person_path).convert("RGB")
            
            result_img = self._mock_tryon(person_img, cloth_img)
            
            timestamp = int(time.time())
            result_filename = f"tryon_result_{timestamp}.png"
            result_path = self.results_dir / result_filename
            result_img.save(result_path)
            
            logger.info(f"Try-on result saved: {result_path}")
            return str(result_path)
    
    def _run_ootdiffusion(self, person_img: Image.Image, cloth_img: Image.Image, category: str) -> Image.Image:
        logger.info("Running Stable Diffusion Inpainting inference...")
        
        try:
            # Generate prompt based on clothing item
            prompt = self._generate_prompt_from_cloth(cloth_img, category)
            
            # Create mask for clothing region
            mask = self._create_clothing_mask(person_img, category)
            
            # Ensure images are RGB
            if person_img.mode != 'RGB':
                person_img = person_img.convert('RGB')
            if cloth_img.mode != 'RGB':
                cloth_img = cloth_img.convert('RGB')
            
            # Resize cloth to match person for better blending
            cloth_img_resized = cloth_img.resize(person_img.size, Image.Resampling.LANCZOS)
            
            # Run inpainting
            logger.info(f"Running inference with prompt: {prompt}")
            result = self.pipe(
                prompt=prompt,
                image=person_img,
                mask_image=mask,
                guidance_scale=7.5,
                num_inference_steps=25,
                strength=0.8
            ).images[0]
            
            return result
        
        except Exception as e:
            logger.error(f"Inference failed: {str(e)}", exc_info=True)
            return self._mock_tryon(person_img, cloth_img)
    
    def _create_clothing_mask(self, person_img: Image.Image, category: str) -> Image.Image:
        import numpy as np
        from PIL import ImageDraw
        
        width, height = person_img.size
        mask = Image.new('L', (width, height), 0)
        draw = ImageDraw.Draw(mask)
        
        if category in ["upper_body", "upperbody", "top", "shirt"]:
            draw.rectangle(
                [(width * 0.2, height * 0.15), (width * 0.8, height * 0.6)],
                fill=255
            )
        elif category in ["lower_body", "lowerbody", "bottom", "pants"]:
            draw.rectangle(
                [(width * 0.25, height * 0.45), (width * 0.75, height * 0.9)],
                fill=255
            )
        elif category in ["dress", "full_body", "fullbody"]:
            draw.rectangle(
                [(width * 0.2, height * 0.15), (width * 0.8, height * 0.9)],
                fill=255
            )
        else:
            draw.rectangle(
                [(width * 0.2, height * 0.15), (width * 0.8, height * 0.6)],
                fill=255
            )
        
        return mask
    
    def _generate_prompt_from_cloth(self, cloth_img: Image.Image, category: str) -> str:
        # Generate descriptive prompt based on category
        prompts = {
            "upper_body": "person wearing a stylish shirt, professional photo, high quality, realistic, natural lighting, well-fitted clothing",
            "lower_body": "person wearing fashionable pants, professional photo, high quality, realistic, natural lighting, well-fitted clothing",
            "dress": "person wearing an elegant dress, professional photo, high quality, realistic, natural lighting, well-fitted clothing"
        }
        return prompts.get(category, "person wearing stylish clothes, professional photo, high quality, realistic, natural lighting")
    
    def _mock_tryon(self, person_img: Image.Image, cloth_img: Image.Image) -> Image.Image:
        logger.info("Running smart compositing (instant local processing)...")
        
        import numpy as np
        import cv2
        
        # Convert to numpy arrays
        person_array = np.array(person_img.convert('RGB'))
        cloth_array = np.array(cloth_img.convert('RGBA'))
        
        # Get dimensions
        p_h, p_w = person_array.shape[:2]
        
        # Calculate cloth placement based on upper body region
        # Position: centered horizontally, upper 60% vertically
        cloth_width = int(p_w * 0.6)  # 60% of person width
        cloth_height = int(p_h * 0.45)  # 45% of person height
        
        # Resize cloth maintaining aspect ratio
        cloth_resized = cv2.resize(cloth_array, (cloth_width, cloth_height), interpolation=cv2.INTER_LANCZOS4)
        
        # Position cloth on torso area
        x_offset = int(p_w * 0.2)  # Center horizontally
        y_offset = int(p_h * 0.2)  # Upper torso
        
        # Create result as copy of person
        result = person_array.copy()
        
        # Extract alpha channel from cloth if exists
        if cloth_resized.shape[2] == 4:
            cloth_rgb = cloth_resized[:, :, :3]
            cloth_alpha = cloth_resized[:, :, 3] / 255.0
        else:
            cloth_rgb = cloth_resized[:, :, :3]
            # Create alpha from brightness (dark areas = transparent)
            gray = cv2.cvtColor(cloth_rgb, cv2.COLOR_RGB2GRAY)
            _, cloth_alpha = cv2.threshold(gray, 10, 1.0, cv2.THRESH_BINARY)
            cloth_alpha = cloth_alpha.astype(float)
        
        # Apply Gaussian blur to alpha for smooth edges
        cloth_alpha = cv2.GaussianBlur(cloth_alpha, (21, 21), 11)
        
        # Ensure cloth fits within image bounds
        y_end = min(y_offset + cloth_height, p_h)
        x_end = min(x_offset + cloth_width, p_w)
        actual_h = y_end - y_offset
        actual_w = x_end - x_offset
        
        # Crop cloth if needed
        cloth_rgb = cloth_rgb[:actual_h, :actual_w]
        cloth_alpha = cloth_alpha[:actual_h, :actual_w]
        
        # Extract region of interest from person image
        roi = result[y_offset:y_end, x_offset:x_end]
        
        # Color matching: adjust cloth colors to match person's lighting
        person_mean = roi.mean(axis=(0, 1))
        cloth_mean = cloth_rgb.mean(axis=(0, 1))
        color_ratio = person_mean / (cloth_mean + 1e-6)
        color_ratio = np.clip(color_ratio, 0.7, 1.3)  # Limit adjustment
        cloth_rgb_adjusted = np.clip(cloth_rgb * color_ratio, 0, 255).astype(np.uint8)
        
        # Alpha blending
        cloth_alpha_3ch = np.stack([cloth_alpha] * 3, axis=2)
        blended = (cloth_rgb_adjusted * cloth_alpha_3ch + roi * (1 - cloth_alpha_3ch)).astype(np.uint8)
        
        # Place blended result back
        result[y_offset:y_end, x_offset:x_end] = blended
        
        # Convert back to PIL
        result_img = Image.fromarray(result)
        
        logger.info("Smart compositing complete!")
        return result_img
