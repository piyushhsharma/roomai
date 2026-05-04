'use client'

import { useState, useRef } from 'react'

export default function UploadCard() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedStyle, setSelectedStyle] = useState('Modern')
  const [selectedRoomType, setSelectedRoomType] = useState('Living Room')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const styles = [
    'Modern', 'Scandinavian', 'Bohemian', 'Industrial', 
    'Minimalist', 'Japandi', 'Coastal', 'Luxury', 
    'Traditional', 'Art Deco'
  ]

  const roomTypes = [
    'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 
    'Home Office', 'Dining Room'
  ]

  const handleFileUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    const imageFile = files.find(file => file.type.startsWith('image/'))
    
    if (imageFile) {
      handleFileUpload(imageFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleGenerate = () => {
    setIsGenerating(true)
    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <div className="bg-card-bg rounded-large shadow-card p-8">
        {uploadedImage ? (
          <div className="space-y-6">
            {/* Image Preview */}
            <div className="relative">
              <img 
                src={uploadedImage} 
                alt="Uploaded room" 
                className="w-full h-96 object-cover rounded-upload border-2 border-dashed-border"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute top-2 right-2 bg-white border border-border rounded px-3 py-1 text-sm text-text-sub hover:bg-page-bg transition-colors"
              >
                Change photo
              </button>
            </div>

            {/* Style Picker */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary mb-3">Choose your style</h3>
              <div className="flex flex-wrap gap-2">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setSelectedStyle(style)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      selectedStyle === style
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-text-sub border-border hover:border-accent'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            {/* Room Type Picker */}
            <div className="space-y-4">
              <h3 className="font-semibold text-text-primary mb-3">Room type</h3>
              <div className="flex flex-wrap gap-2">
                {roomTypes.map((roomType) => (
                  <button
                    key={roomType}
                    onClick={() => setSelectedRoomType(roomType)}
                    className={`px-4 py-2 rounded-full border transition-colors ${
                      selectedRoomType === roomType
                        ? 'bg-accent text-white border-accent'
                        : 'bg-white text-text-sub border-border hover:border-accent'
                    }`}
                  >
                    {roomType}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full bg-accent text-white rounded-large py-4 text-base font-semibold hover:bg-accent/90 disabled:opacity-50 transition-colors"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Generating your design...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="mr-2">✨</span>
                  Redesign my room
                </div>
              )}
            </button>
          </div>
        ) : (
          /* Upload Zone */
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed border-dashed-border rounded-upload bg-transparent p-[60px_40px] text-center cursor-pointer transition-all ${
              isDragging ? 'border-accent bg-hover-bg' : 'hover:border-accent hover:bg-hover-bg'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFileUpload(file)
              }}
              className="hidden"
            />
            
            {/* Camera emoji with sparkle */}
            <div className="relative">
              <span className="text-5xl">📷</span>
              <span className="absolute -top-2 -right-2 text-lg">✨</span>
            </div>
            
            <h3 className="text-lg font-bold text-text-primary mt-4">
              Upload your room photo
            </h3>
            
            <p className="text-sm text-text-sub mt-1">
              Drag & drop or click to browse
            </p>
            
            <p className="text-xs text-text-muted mt-1">
              Supports: JPEG, PNG, WebP, HEIC (max 10MB)
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
