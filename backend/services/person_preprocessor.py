import cv2
import numpy as np
from PIL import Image
import mediapipe as mp
from pathlib import Path
import logging

logger = logging.getLogger(__name__)

class PersonPreprocessor:
    def __init__(self):
        self.output_dir = Path("temp/person_processed")
        self.output_dir.mkdir(parents=True, exist_ok=True)
        
        self.mp_pose = mp.solutions.pose
        self.pose = self.mp_pose.Pose(
            static_image_mode=True,
            model_complexity=2,
            enable_segmentation=True,
            min_detection_confidence=0.5
        )
    
    def process(self, image_path: str) -> str:
        try:
            logger.info(f"Processing person image: {image_path}")
            
            img = cv2.imread(image_path)
            if img is None:
                raise ValueError(f"Failed to load image: {image_path}")
            
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            logger.info(f"Loaded image: {img_rgb.shape}")
            
            img_cropped = self._detect_and_crop_person(img_rgb)
            logger.info("Person detected and cropped")
            
            img_enhanced = self._enhance_image(img_cropped)
            logger.info("Image enhanced")
            
            img_resized = self._resize_person(img_enhanced)
            logger.info("Image resized")
            
            output_filename = f"person_processed_{Path(image_path).stem}.png"
            output_path = self.output_dir / output_filename
            
            pil_img = Image.fromarray(img_resized)
            pil_img.save(output_path)
            
            logger.info(f"Person processed successfully: {output_path}")
            return str(output_path)
        except Exception as e:
            logger.error(f"Error processing person image: {str(e)}", exc_info=True)
            raise
    
    def _blur_background(self, img: np.ndarray) -> np.ndarray:
        """Optional: Blur background to emphasize person"""
        logger.info("Blurring background...")
        
        results = self.pose.process(img)
        
        if results.segmentation_mask is not None:
            # Get segmentation mask (person = 1, background = 0)
            mask = results.segmentation_mask
            mask_3channel = np.stack([mask] * 3, axis=-1)
            
            # Blur the entire image
            blurred = cv2.GaussianBlur(img, (21, 21), 0)
            
            # Combine: keep person sharp, blur background
            output = np.where(mask_3channel > 0.5, img, blurred)
            return output.astype(np.uint8)
        
        return img
    
    def _detect_and_crop_person(self, img: np.ndarray) -> np.ndarray:
        logger.info("Detecting person pose and cropping...")
        
        results = self.pose.process(img)
        
        if not results.pose_landmarks:
            logger.warning("No pose detected, using full image")
            return img
        
        h, w, _ = img.shape
        landmarks = results.pose_landmarks.landmark
        
        xs = [lm.x * w for lm in landmarks if lm.visibility > 0.5]
        ys = [lm.y * h for lm in landmarks if lm.visibility > 0.5]
        
        if not xs or not ys:
            return img
        
        x_min, x_max = int(min(xs)), int(max(xs))
        y_min, y_max = int(min(ys)), int(max(ys))
        
        padding_x = int((x_max - x_min) * 0.1)
        padding_y = int((y_max - y_min) * 0.05)
        
        x_min = max(0, x_min - padding_x)
        x_max = min(w, x_max + padding_x)
        y_min = max(0, y_min - padding_y)
        y_max = min(h, y_max + padding_y)
        
        cropped = img[y_min:y_max, x_min:x_max]
        
        return cropped
    
    def _enhance_image(self, img: np.ndarray) -> np.ndarray:
        logger.info("Enhancing image quality...")
        
        lab = cv2.cvtColor(img, cv2.COLOR_RGB2LAB)
        l, a, b = cv2.split(lab)
        
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        l_enhanced = clahe.apply(l)
        
        enhanced_lab = cv2.merge([l_enhanced, a, b])
        enhanced = cv2.cvtColor(enhanced_lab, cv2.COLOR_LAB2RGB)
        
        return enhanced
    
    def _resize_person(self, img: np.ndarray, target_size: tuple = (768, 1024)) -> np.ndarray:
        logger.info(f"Resizing person image to {target_size}...")
        
        h, w = img.shape[:2]
        target_w, target_h = target_size
        
        scale = min(target_w / w, target_h / h)
        new_w, new_h = int(w * scale), int(h * scale)
        
        resized = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
        
        canvas = np.ones((target_h, target_w, 3), dtype=np.uint8) * 255
        
        y_offset = (target_h - new_h) // 2
        x_offset = (target_w - new_w) // 2
        
        canvas[y_offset:y_offset+new_h, x_offset:x_offset+new_w] = resized
        
        return canvas
    
    def __del__(self):
        if hasattr(self, 'pose'):
            self.pose.close()
