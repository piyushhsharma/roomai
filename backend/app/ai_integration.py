import os
import json
from typing import Dict, Any

# AI Integration for MVP - Simplified for speed
class AIImageGenerator:
    def __init__(self):
        self.mock_mode = os.getenv("MOCK_MODE", "true").lower() == "true"
        
    def generate_image_prompt(self, theme: str, colors: list, room_type: str = "living room") -> str:
        """Generate a prompt for AI image generation"""
        color_description = self._get_color_description(colors)
        
        prompts = {
            "modern": f"Modern {room_type} interior design, {color_description} color palette, minimalist furniture, clean lines, professional interior photography, architectural digest quality, wide angle shot",
            "minimal": f"Minimalist {room_type} design, {color_description} colors, simple furniture, clutter-free space, natural lighting, professional photography, 8K quality",
            "luxury": f"Luxury {room_type} interior, {color_description} elegant colors, high-end furniture, premium materials, sophisticated design, architectural photography, ultra-realistic",
            "bohemian": f"Bohemian style {room_type}, {color_description} warm colors, eclectic furniture, plants and textiles, cozy atmosphere, professional interior photography",
            "scandinavian": f"Scandinavian {room_type} design, {color_description} light colors, natural wood furniture, cozy minimalism, bright lighting, professional photography",
            "industrial": f"Industrial style {room_type}, {color_description} neutral colors, metal and wood furniture, exposed elements, urban loft feel, professional photography"
        }
        
        return prompts.get(theme, prompts["modern"])
    
    def _get_color_description(self, colors: list) -> str:
        """Convert color palette to description"""
        color_map = {
            "warm-neutrals": "warm neutral beige and cream",
            "cool-grays": "cool gray and silver tones", 
            "earth-tones": "warm earth brown and terracotta",
            "ocean-blues": "calming ocean blue and teal",
            "blush-pink": "soft blush pink and rose",
            "forest-green": "natural forest green and sage",
            "midnight-dark": "deep midnight blue and charcoal"
        }
        
        descriptions = [color_map.get(color, "neutral") for color in colors]
        return " and ".join(descriptions[:2]) if len(descriptions) > 1 else descriptions[0]
    
    async def generate_image(self, prompt: str) -> str:
        """Generate image using AI service"""
        if self.mock_mode:
            # Return placeholder image for MVP
            return "https://picsum.photos/1024/1024?grayscale&random=" + str(hash(prompt) % 1000)
        
        # TODO: Add real AI integration here
        # Options:
        # 1. OpenAI DALL-E 3
        # 2. Replicate SDXL
        # 3. Stability AI
        
        # For now, return placeholder
        return "https://picsum.photos/1024/1024?grayscale&random=" + str(hash(prompt) % 1000)
    
    async def analyze_room_image(self, image_path: str) -> Dict[str, Any]:
        """Analyze uploaded room image"""
        if self.mock_mode:
            return {
                "room_type": "living room",
                "dimensions_estimate": "medium",
                "current_style": "traditional",
                "wall_color": "#F5F0E8",
                "flooring_type": "hardwood",
                "lighting_condition": "bright",
                "existing_furniture": [
                    {"label": "sofa", "position": "center", "condition": "good"},
                    {"label": "coffee table", "position": "front of sofa", "condition": "fair"}
                ],
                "layout_observations": "Open floor plan with good natural light",
                "design_challenges": "Low ceiling height",
                "recommended_focal_point": "large window wall"
            }
        
        # TODO: Add real OpenAI Vision API call
        return {
            "room_type": "living room",
            "dimensions_estimate": "medium",
            "current_style": "traditional",
            "wall_color": "#F5F0E8",
            "flooring_type": "hardwood",
            "lighting_condition": "bright",
            "existing_furniture": [
                {"label": "sofa", "position": "center", "condition": "good"},
                {"label": "coffee table", "position": "front of sofa", "condition": "fair"}
            ],
            "layout_observations": "Open floor plan with good natural light",
            "design_challenges": "Low ceiling height",
            "recommended_focal_point": "large window wall"
        }
    
    async def detect_objects(self, image_path: str) -> list:
        """Detect furniture objects in generated image"""
        if self.mock_mode:
            return [
                {
                    "label": "modern sofa",
                    "category": "sofa",
                    "style": "modern",
                    "color": "gray",
                    "material": "fabric",
                    "bounding_box": {"x": 0.2, "y": 0.3, "w": 0.6, "h": 0.4},
                    "search_query": "modern gray fabric sofa"
                },
                {
                    "label": "coffee table",
                    "category": "table",
                    "style": "minimal",
                    "color": "white",
                    "material": "marble",
                    "bounding_box": {"x": 0.3, "y": 0.6, "w": 0.4, "h": 0.2},
                    "search_query": "minimal white marble coffee table"
                },
                {
                    "label": "floor lamp",
                    "category": "lamp",
                    "style": "industrial",
                    "color": "black",
                    "material": "metal",
                    "bounding_box": {"x": 0.1, "y": 0.2, "w": 0.1, "h": 0.5},
                    "search_query": "industrial black metal floor lamp"
                },
                {
                    "label": "area rug",
                    "category": "rug",
                    "style": "modern",
                    "color": "blue",
                    "material": "wool",
                    "bounding_box": {"x": 0.2, "y": 0.7, "w": 0.6, "h": 0.2},
                    "search_query": "modern blue wool area rug"
                }
            ]
        
        # TODO: Add real OpenAI Vision API call
        return [
            {
                "label": "modern sofa",
                "category": "sofa",
                "style": "modern",
                "color": "gray",
                "material": "fabric",
                "bounding_box": {"x": 0.2, "y": 0.3, "w": 0.6, "h": 0.4},
                "search_query": "modern gray fabric sofa"
            }
        ]
