# Mock product database for MVP
MOCK_PRODUCTS = [
    {
        "name": "Modern Sectional Sofa",
        "price": 1899.00,
        "retailer": "West Elm",
        "image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        "product_url": "https://www.westelm.com/products/modern-sectional-sofa",
        "style_match_score": 0.92,
        "category": "sofa"
    },
    {
        "name": "Minimal Coffee Table",
        "price": 599.00,
        "retailer": "IKEA",
        "image_url": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
        "product_url": "https://www.ikea.com/products/minimal-coffee-table",
        "style_match_score": 0.88,
        "category": "table"
    },
    {
        "name": "Industrial Floor Lamp",
        "price": 299.00,
        "retailer": "CB2",
        "image_url": "https://images.unsplash.com/photo-1513506003783-3e3859c7e3da?w=400",
        "product_url": "https://www.cb2.com/products/industrial-floor-lamp",
        "style_match_score": 0.85,
        "category": "lamp"
    },
    {
        "name": "Scandinavian Area Rug",
        "price": 449.00,
        "retailer": "Rugs USA",
        "image_url": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        "product_url": "https://www.rugsusa.com/products/scandinavian-rug",
        "style_match_score": 0.90,
        "category": "rug"
    },
    {
        "name": "Luxury Accent Chair",
        "price": 899.00,
        "retailer": "Article",
        "image_url": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
        "product_url": "https://www.article.com/products/luxury-accent-chair",
        "style_match_score": 0.87,
        "category": "chair"
    },
    {
        "name": "Modern Wall Art",
        "price": 199.00,
        "retailer": "Minted",
        "image_url": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
        "product_url": "https://www.minted.com/products/modern-wall-art",
        "style_match_score": 0.83,
        "category": "art"
    },
    {
        "name": "Minimal Bookshelf",
        "price": 799.00,
        "retailer": "Wayfair",
        "image_url": "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400",
        "product_url": "https://www.wayfair.com/products/minimal-bookshelf",
        "style_match_score": 0.89,
        "category": "storage"
    },
    {
        "name": "Designer Pendant Light",
        "price": 549.00,
        "retailer": "Lumens",
        "image_url": "https://images.unsplash.com/photo-1513506003783-3e3859c7e3da?w=400",
        "product_url": "https://www.lumens.com/products/designer-pendant-light",
        "style_match_score": 0.91,
        "category": "lamp"
    }
]

def get_products_by_theme(theme: str, budget_min: int, budget_max: int):
    """Get products filtered by theme and budget"""
    # For MVP, return all products within budget
    filtered_products = []
    
    for product in MOCK_PRODUCTS:
        if budget_min <= product["price"] <= budget_max:
            # Adjust style match score based on theme
            if theme == "modern" and "modern" in product["name"].lower():
                product["style_match_score"] = min(0.95, product["style_match_score"] + 0.05)
            elif theme == "minimal" and "minimal" in product["name"].lower():
                product["style_match_score"] = min(0.95, product["style_match_score"] + 0.05)
            elif theme == "luxury" and "luxury" in product["name"].lower():
                product["style_match_score"] = min(0.95, product["style_match_score"] + 0.05)
            elif theme == "industrial" and "industrial" in product["name"].lower():
                product["style_match_score"] = min(0.95, product["style_match_score"] + 0.05)
            elif theme == "scandinavian" and "scandinavian" in product["name"].lower():
                product["style_match_score"] = min(0.95, product["style_match_score"] + 0.05)
            
            filtered_products.append(product.copy())
    
    # Sort by style match score and return top 6
    filtered_products.sort(key=lambda x: x["style_match_score"], reverse=True)
    return filtered_products[:6]
