'use client'

import { useState } from 'react'

interface BudgetSelectorProps {
  onBudgetChange: (min: number, max: number) => void
  budgetMin?: number
  budgetMax?: number
}

const budgetPresets = [
  { min: 500, max: 2000, label: '$500 - $2K' },
  { min: 2000, max: 5000, label: '$2K - $5K' },
  { min: 5000, max: 10000, label: '$5K - $10K' },
  { min: 10000, max: 20000, label: '$10K - $20K' }
]

export default function BudgetSelector({ onBudgetChange, budgetMin, budgetMax }: BudgetSelectorProps) {
  const [customMin, setCustomMin] = useState(budgetMin || 5000)
  const [customMax, setCustomMax] = useState(budgetMax || 10000)

  const handlePresetClick = (min: number, max: number) => {
    setCustomMin(min)
    setCustomMax(max)
    onBudgetChange(min, max)
  }

  const handleCustomChange = () => {
    onBudgetChange(customMin, customMax)
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Set Your Budget</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {budgetPresets.map((preset) => (
          <button
            key={`${preset.min}-${preset.max}`}
            onClick={() => handlePresetClick(preset.min, preset.max)}
            className={`p-3 rounded-xl border-2 transition-all
              ${budgetMin === preset.min && budgetMax === preset.max
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300'}`}
          >
            <div className="font-medium">{preset.label}</div>
          </button>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Min Budget</label>
          <input
            type="number"
            value={customMin}
            onChange={(e) => {
              setCustomMin(Number(e.target.value))
              handleCustomChange()
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            min="0"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Max Budget</label>
          <input
            type="number"
            value={customMax}
            onChange={(e) => {
              setCustomMax(Number(e.target.value))
              handleCustomChange()
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            min="0"
          />
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="text-lg font-semibold text-blue-600">
          Total Budget: ${budgetMin?.toLocaleString()} - ${budgetMax?.toLocaleString()}
        </div>
      </div>
    </div>
  )
}
