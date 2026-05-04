'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react'

export default function BeforeAfterSlider() {
  const [sliderPosition, setSliderPosition] = useState(50)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Auto-animate on mount
    const timer = setTimeout(() => {
      setIsAnimating(true)
      setSliderPosition(80)
      setTimeout(() => setSliderPosition(20), 1000)
      setTimeout(() => setSliderPosition(50), 2000)
      setTimeout(() => {
        setIsAnimating(false)
      }, 3000)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const handleMouseDown = () => setIsDragging(true)
  const handleMouseUp = () => setIsDragging(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return
    
    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.min(100, Math.max(0, percentage)))
  }

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !sliderRef.current) return
    
    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = (x / rect.width) * 100
    setSliderPosition(Math.min(100, Math.max(0, percentage)))
  }

  return (
    <div className="relative w-full max-w-4xl mx-auto">
      <div
        ref={sliderRef}
        className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-glow-lg"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Before Image */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400" />
        
        {/* After Image */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-primary-500 via-violet-500 to-purple-600"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        />

        {/* Slider Line */}
        <div
          className={`absolute top-0 bottom-0 w-1 bg-white shadow-glow cursor-ew-resize ${
            isAnimating ? 'transition-all duration-1000 ease-in-out' : ''
          }`}
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleMouseDown}
        >
          {/* Slider Handle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-glow flex items-center justify-center cursor-ew-resize">
            <div className="flex flex-col items-center justify-center">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </div>
          </div>
        </div>

        {/* Labels */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
          Before
        </div>
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
          After
        </div>
      </div>

      {/* Floating Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-4 left-4 glass-glass rounded-xl p-3 flex items-center space-x-2"
      >
        <Sparkles className="w-4 h-4 text-green-400" />
        <span className="text-sm text-white">Generated in 4.2s</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
        className="absolute top-4 right-4 glass-glass rounded-xl p-3"
      >
        <div className="flex space-x-1">
          {['Modern', 'Scandinavian', 'Boho'].map((style, index) => (
            <div
              key={style}
              className={`px-2 py-1 rounded-lg text-xs ${
                index === 1 ? 'bg-primary-500 text-white' : 'bg-white/20 text-white'
              }`}
            >
              {style}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
