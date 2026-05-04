'use client'

import { create } from 'zustand'

export type RoomType = 'living' | 'bedroom' | 'kitchen' | 'office' | 'dining' | 'bathroom'

export interface CanvasState {
  uploadedPreview: string | null
  styleId: string
  roomType: RoomType
  palette: string[]
  prompt: string
  generatedPreview: string | null
  isGenerating: boolean
  progress: number
  setUploaded: (dataUrl: string | null) => void
  setStyle: (id: string) => void
  setRoomType: (t: RoomType) => void
  setPalette: (colors: string[]) => void
  setPrompt: (p: string) => void
  setGenerated: (dataUrl: string | null) => void
  setGenerating: (v: boolean) => void
  setProgress: (n: number) => void
  reset: () => void
}

const defaultPalette = ['#6366F1', '#8B5CF6', '#06B6D4']

export const useCanvasStore = create<CanvasState>((set) => ({
  uploadedPreview: null,
  styleId: 'modern',
  roomType: 'living',
  palette: defaultPalette,
  prompt: '',
  generatedPreview: null,
  isGenerating: false,
  progress: 0,
  setUploaded: (uploadedPreview) => set({ uploadedPreview }),
  setStyle: (styleId) => set({ styleId }),
  setRoomType: (roomType) => set({ roomType }),
  setPalette: (palette) => set({ palette }),
  setPrompt: (prompt) => set({ prompt }),
  setGenerated: (generatedPreview) => set({ generatedPreview }),
  setGenerating: (isGenerating) => set({ isGenerating }),
  setProgress: (progress) => set({ progress }),
  reset: () =>
    set({
      uploadedPreview: null,
      styleId: 'modern',
      roomType: 'living',
      palette: defaultPalette,
      prompt: '',
      generatedPreview: null,
      isGenerating: false,
      progress: 0,
    }),
}))
