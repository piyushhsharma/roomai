'use client'

import { useState } from 'react'

interface Product {
  name: string
  price: number
  retailer: string
  image_url: string
  product_url: string
  style_match_score: number
}

interface DetectedObject {
  label: string
  category: string
  bounding_box: { x: number; y: number; w: number; h: number }
  search_query: string
}

interface ImageHotspotsProps {
  imageUrl: string
  detectedObjects?: DetectedObject[]
  products: Product[]
  onProductClick: (product: Product) => void
}

export default function ImageHotspots({ 
  imageUrl, 
  detectedObjects = [], 
  products, 
  onProductClick 
}: ImageHotspotsProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="relative w-full h-full">
      <img
        src={imageUrl}
        alt="Redesigned room with hotspots"
        className="w-full h-full object-cover"
      />
      
      {/* Hotspots */}
      {detectedObjects.map((obj, index) => {
        const product = products[index]
        if (!product) return null
        
        return (
          <div
            key={index}
            className="absolute cursor-pointer group"
            style={{
              left: `${obj.bounding_box.x}%`,
              top: `${obj.bounding_box.y}%`,
              width: `${obj.bounding_box.w}%`,
              height: `${obj.bounding_box.h}%`,
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onProductClick(product)}
          >
            {/* Hotspot indicator */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`w-8 h-8 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center transition-all ${
                hoveredIndex === index ? 'scale-125' : 'scale-100'
              }`}>
                <span className="text-white text-xs font-bold">+</span>
              </div>
            </div>
            
            {/* Hover tooltip */}
            {hoveredIndex === index && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-white rounded-lg shadow-lg border border-gray-200 p-3 z-10 min-w-max">
                <h4 className="font-semibold text-gray-900 text-sm">{product.name}</h4>
                <p className="text-xs text-gray-600 mt-1">{product.retailer}</p>
                <p className="text-sm font-bold text-green-600 mt-1">${product.price}</p>
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block mt-2">
                  {Math.round(product.style_match_score * 100)}% match
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
