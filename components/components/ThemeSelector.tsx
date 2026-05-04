'use client'

import { useState } from 'react'

const themes = [
  { id: 'modern', name: 'Modern', emoji: '🏢' },
  { id: 'minimal', name: 'Minimal', emoji: '⬜' },
  { id: 'luxury', name: 'Luxury', emoji: '✨' },
  { id: 'bohemian', name: 'Bohemian', emoji: '🌿' },
  { id: 'scandinavian', name: 'Scandinavian', emoji: '🏔️' },
  { id: 'industrial', name: 'Industrial', emoji: '🏭' }
]

interface ThemeSelectorProps {
  onThemeSelect: (theme: string) => void
  selectedTheme?: string
}

export default function ThemeSelector({ onThemeSelect, selectedTheme }: ThemeSelectorProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Choose Your Style</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onThemeSelect(theme.id)}
            className={`p-4 rounded-xl border-2 transition-all
              ${selectedTheme === theme.id 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
          >
            <div className="text-2xl mb-2">{theme.emoji}</div>
            <div className="font-medium">{theme.name}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
