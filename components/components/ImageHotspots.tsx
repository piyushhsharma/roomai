'use client'

import { useState } from 'react'

interface DetectedObject {
  label: string
  category: string
  bounding_box: { x: number; y: number; w: number; h: number }
  search_query: string
}

interface Product {
  name: string
  price: number
  retailer: string
  image_url: string
  product_url: string
  style_match_score: number
}

interface ImageHotspotsProps {
  imageUrl: string
  detectedObjects?: DetectedObject[]
  products?: Product[]
  onProductClick?: (product: Product) => void
}

export default function ImageHotspots({ 
  imageUrl, 
  detectedObjects = [], 
  products = [], 
  onProductClick 
}: ImageHotspotsProps) {
  const [hoveredHotspot, setHoveredHotspot] = useState<number | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  const handleHotspotClick = (objectIndex: number) => {
    // Find matching product for this object
    if (products[objectIndex]) {
      const product = products[objectIndex]
      setSelectedProduct(product)
      onProductClick?.(product)
    }
  }

  return (
    <div className="relative w-full h-full">
      {/* Main Image */}
      <img
        src={imageUrl}
        alt="Redesigned room"
        className="w-full h-full object-cover"
      />
      
      {/* Hotspots */}
      {detectedObjects.map((obj, index) => {
        const bbox = obj.bounding_box
        const product = products[index]
        
        return (
          <div
            key={index}
            className="absolute cursor-pointer group"
            style={{
              left: `${bbox.x * 100}%`,
              top: `${bbox.y * 100}%`,
              width: `${bbox.w * 100}%`,
              height: `${bbox.h * 100}%`
            }}
            onMouseEnter={() => setHoveredHotspot(index)}
            onMouseLeave={() => setHoveredHotspot(null)}
            onClick={() => handleHotspotClick(index)}
          >
            {/* Hotspot Indicator */}
            <div className={`absolute inset-0 border-2 transition-all
              ${hoveredHotspot === index 
                ? 'border-blue-500 bg-blue-500 bg-opacity-20' 
                : 'border-transparent hover:border-blue-300'}`}
            />
            
            {/* Pulse Animation */}
            {hoveredHotspot !== index && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              </div>
            )}
            
            {/* Tooltip */}
            {hoveredHotspot === index && product && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 
                bg-gray-900 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap z-10">
                <div className="font-semibold">{product.name}</div>
                <div className="text-green-400">${product.price}</div>
                <div className="text-xs text-gray-300">{product.retailer}</div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                  <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            )}
          </div>
        )
      })}
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex gap-4 mb-4">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">{selectedProduct.name}</h3>
                <p className="text-gray-600 text-sm mb-2">{selectedProduct.retailer}</p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">
                    ${selectedProduct.price}
                  </span>
                  <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                    {Math.round(selectedProduct.style_match_score * 100)}% match
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <a
                href={selectedProduct.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
              >
                View Product →
              </a>
              <button
                onClick={() => setSelectedProduct(null)}
                className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
