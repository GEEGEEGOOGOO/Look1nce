import cv2
import numpy as np
from PIL import Image
from rembg import remove
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class ClothPreprocessor:
    def __init__(self):
        self.output_dir = Path("temp/cloth_processed")
        self.output_dir.mkdir(parents=True, exist_ok=True)
    
    def process(self, image_path: str, category: str) -> str:
        try:
            logger.info(f"Processing cloth image: {image_path}")
            
            img = Image.open(image_path)
            logger.info(f"Loaded image: {img.size}, mode: {img.mode}")
            
            img_no_bg = self._remove_background(img)
            logger.info("Background removed")
            
            img_straight = self._straighten_cloth(img_no_bg)
            logger.info("Cloth straightened")
            
            img_clean = self._cleanup_cloth(img_straight)
            logger.info("Cloth cleaned")
            
            img_resized = self._resize_cloth(img_clean)
            logger.info("Cloth resized")
            
            output_filename = f"cloth_processed_{Path(image_path).stem}.png"
            output_path = self.output_dir / output_filename
            img_resized.save(output_path)
            
            logger.info(f"Cloth processed successfully: {output_path}")
            return str(output_path)
        except Exception as e:
            logger.error(f"Error processing cloth image: {str(e)}", exc_info=True)
            raise
    
    def _remove_background(self, img: Image.Image) -> Image.Image:
        logger.info("Removing background from cloth...")
        img_no_bg = remove(img)
        return img_no_bg
    
    def _straighten_cloth(self, img: Image.Image) -> Image.Image:
        logger.info("Straightening cloth...")
        img_array = np.array(img)
        
        if img_array.shape[2] == 4:
            alpha = img_array[:, :, 3]
            rgb = img_array[:, :, :3]
        else:
            alpha = np.ones((img_array.shape[0], img_array.shape[1]), dtype=np.uint8) * 255
            rgb = img_array
        
        coords = cv2.findNonZero(alpha)
        if coords is not None:
            x, y, w, h = cv2.boundingRect(coords)
            cropped_rgb = rgb[y:y+h, x:x+w]
            cropped_alpha = alpha[y:y+h, x:x+w]
            
            img_array = np.dstack([cropped_rgb, cropped_alpha])
        
        return Image.fromarray(img_array)
    
    def _cleanup_cloth(self, img: Image.Image) -> Image.Image:
        logger.info("Cleaning up cloth image...")
        img_array = np.array(img)
        
        if img_array.shape[2] == 4:
            alpha = img_array[:, :, 3]
            
            kernel = np.ones((3, 3), np.uint8)
            alpha_clean = cv2.morphologyEx(alpha, cv2.MORPH_CLOSE, kernel)
            alpha_clean = cv2.morphologyEx(alpha_clean, cv2.MORPH_OPEN, kernel)
            
            img_array[:, :, 3] = alpha_clean
        
        return Image.fromarray(img_array)
    
    def _resize_cloth(self, img: Image.Image, target_size: tuple = (768, 1024)) -> Image.Image:
        logger.info(f"Resizing cloth to {target_size}...")
        
        img.thumbnail(target_size, Image.Resampling.LANCZOS)
        
        new_img = Image.new('RGBA', target_size, (255, 255, 255, 0))
        
        paste_x = (target_size[0] - img.width) // 2
        paste_y = (target_size[1] - img.height) // 2
        new_img.paste(img, (paste_x, paste_y), img if img.mode == 'RGBA' else None)
        
        return new_img
