'use client'

import { useState } from 'react'

const colorPalettes = [
  { id: 'warm-neutrals', name: 'Warm Neutrals', colors: ['#F5E6D3', '#C4956A', '#8B6914'] },
  { id: 'cool-grays', name: 'Cool Grays', colors: ['#E8EAF0', '#9BA3B5', '#4A5568'] },
  { id: 'earth-tones', name: 'Earth Tones', colors: ['#D4A574', '#8B6914', '#5C4033'] },
  { id: 'ocean-blues', name: 'Ocean Blues', colors: ['#E0F2F1', '#4DB6AC', '#00695C'] },
  { id: 'blush-pink', name: 'Blush Pink', colors: ['#FCE4EC', '#F48FB1', '#880E4F'] },
  { id: 'forest-green', name: 'Forest Green', colors: ['#E8F5E9', '#66BB6A', '#1B5E20'] },
  { id: 'midnight-dark', name: 'Midnight Dark', colors: ['#1A1A2E', '#16213E', '#0F3460'] },
  { id: 'custom', name: 'Custom', colors: ['#FF0000', '#00FF00', '#0000FF'] }
]

interface ColorPaletteSelectorProps {
  onPaletteSelect: (palette: string) => void
  selectedPalette?: string
}

export default function ColorPaletteSelector({ onPaletteSelect, selectedPalette }: ColorPaletteSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Choose Color Palette</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {colorPalettes.map((palette) => (
          <button
            key={palette.id}
            onClick={() => onPaletteSelect(palette.id)}
            className={`p-3 rounded-xl border-2 transition-all
              ${selectedPalette === palette.id 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-200 hover:border-gray-300'}`}
          >
            <div className="flex justify-center mb-2">
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <div className="text-xs font-medium">{palette.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
