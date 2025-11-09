"""
HuggingFace Space API Integration for OOTDiffusion
Calls the official levihsu/OOTDiffusion space API using Gradio Client
"""

from gradio_client import Client, handle_file
import logging
from pathlib import Path
from PIL import Image
import time
import os

logger = logging.getLogger(__name__)

class HFSpaceOOTD:
    def __init__(self, hf_token=None):
        # Check for custom Colab API URL first (for your own GPU!)
        self.colab_url = os.getenv("COLAB_API_URL")
        
        if self.colab_url:
            # Use your Google Colab API
            self.space_id = self.colab_url
            logger.info(f"🚀 Using Google Colab API: {self.space_id}")
        else:
            # Fallback to official OOTDiffusion space (limited quota)
            self.space_id = "levihsu/OOTDiffusion"
            logger.info(f"⚠️ Using HuggingFace Space (limited quota): {self.space_id}")
        
        self.hf_token = hf_token or os.getenv("HF_TOKEN")
        
        self.results_dir = Path("results")
        self.results_dir.mkdir(exist_ok=True)
        
        if self.hf_token:
            logger.info("Using HuggingFace authentication token")
    
    async def run_tryon(self, cloth_path: str, person_path: str, category: str) -> str:
        """
        Run virtual try-on using HuggingFace Space API
        
        Args:
            cloth_path: Path to cloth image
            person_path: Path to person image
            category: Category (upper_body, lower_body, dress)
            
        Returns:
            Path to result image
        """
        logger.info(f"Calling HF Space API for try-on: cloth={cloth_path}, person={person_path}")
        
        try:
            # Initialize Gradio client
            logger.info(f"Connecting to Space: {self.space_id}")
            client = Client(self.space_id, hf_token=self.hf_token)
            
            # Map category to Space format
            cloth_type = self._map_category(category)
            logger.info(f"Using cloth_type: {cloth_type}")
            
            # Call the predict function
            # OOTDiffusion Space expects:
            # - vton_img: cloth image
            # - garm_img: person image  
            # - category: "upperbody" or "lowerbody" or "dress"
            # - n_samples: number of outputs
            # - n_steps: inference steps
            # - image_scale: guidance scale
            # - seed: random seed
            
            logger.info("Calling Space API...")
            # Try HD endpoint first (better quality, auto-detects category)
            try:
                logger.info("Using HD endpoint (better quality)...")
                result = client.predict(
                    vton_img=handle_file(person_path),   # Person image
                    garm_img=handle_file(cloth_path),    # Cloth image
                    n_samples=1,                         # Generate 1 image
                    n_steps=40,                          # 40 inference steps for best quality (slower but better)
                    image_scale=2.0,                     # Guidance scale
                    seed=-1,                             # Random seed
                    api_name="/process_hd"               # HD processing endpoint (better quality)
                )
            except Exception as hd_error:
                logger.warning(f"HD endpoint failed: {hd_error}, falling back to DC endpoint...")
                result = client.predict(
                    vton_img=handle_file(person_path),   # Person image
                    garm_img=handle_file(cloth_path),    # Cloth image
                    category=cloth_type,                 # Category: 'Upper-body', 'Lower-body', 'Dress'
                    n_samples=1,                         # Generate 1 image
                    n_steps=20,                          # 20 inference steps
                    image_scale=2.0,                     # Guidance scale
                    seed=-1,                             # Random seed
                    api_name="/process_dc"               # DC processing endpoint
                )
            
            logger.info(f"API call successful! Result type: {type(result)}")
            logger.info(f"Result content: {result}")
            
            # Result is a Gallery: List[Dict(image: filepath, caption: str | None)]
            if isinstance(result, list) and len(result) > 0:
                # Get the first result
                first_result = result[0]
                
                # Extract image path from dict
                if isinstance(first_result, dict) and 'image' in first_result:
                    result_image_path = first_result['image']
                elif isinstance(first_result, str):
                    result_image_path = first_result
                else:
                    result_image_path = first_result
                
                logger.info(f"Result image path: {result_image_path}")
                
                # Copy to our results directory
                result_img = Image.open(result_image_path)
                timestamp = int(time.time())
                result_filename = f"tryon_result_{timestamp}.png"
                result_path = self.results_dir / result_filename
                result_img.save(result_path)
                
                logger.info(f"Result saved: {result_path}")
                return str(result_path)
            elif isinstance(result, str):
                # Direct path returned
                result_img = Image.open(result)
                timestamp = int(time.time())
                result_filename = f"tryon_result_{timestamp}.png"
                result_path = self.results_dir / result_filename
                result_img.save(result_path)
                
                logger.info(f"Result saved: {result_path}")
                return str(result_path)
            else:
                logger.error(f"Unexpected result format: {type(result)} - {result}")
                raise ValueError(f"Unexpected result format: {type(result)}")
        
        except Exception as e:
            logger.error(f"HF Space API call failed: {str(e)}", exc_info=True)
            raise
    
    def _map_category(self, category: str) -> str:
        """Map our category names to OOTDiffusion Space format"""
        # Space expects: 'Upper-body', 'Lower-body', 'Dress'
        mapping = {
            "upper_body": "Upper-body",
            "upperbody": "Upper-body",
            "top": "Upper-body",
            "shirt": "Upper-body",
            "lower_body": "Lower-body",
            "lowerbody": "Lower-body",
            "bottom": "Lower-body",
            "pants": "Lower-body",
            "dress": "Dress",
            "full_body": "Dress",
            "fullbody": "Dress"
        }
        return mapping.get(category.lower(), "Upper-body")
