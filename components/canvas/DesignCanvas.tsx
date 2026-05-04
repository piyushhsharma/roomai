'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  RefreshCw,
  Upload,
  Wand2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { mockStyles } from '@/lib/mock-data'
import { useCanvasStore, type RoomType } from '@/lib/stores/canvas-store'
import { cn } from '@/lib/utils'

const roomTypes: { id: RoomType; label: string }[] = [
  { id: 'living', label: 'Living' },
  { id: 'bedroom', label: 'Bedroom' },
  { id: 'kitchen', label: 'Kitchen' },
  { id: 'office', label: 'Office' },
  { id: 'dining', label: 'Dining' },
  { id: 'bathroom', label: 'Bath' },
]

const defaultPalettes = [
  ['#6366F1', '#8B5CF6', '#06B6D4'],
  ['#0f172a', '#334155', '#94a3b8'],
  ['#14532d', '#22c55e', '#bbf7d0'],
  ['#431407', '#ea580c', '#fed7aa'],
]

function styleGradient(styleId: string): string {
  const s = mockStyles.find((x) => x.id === styleId)
  if (!s) return 'linear-gradient(135deg,#6366f1,#8b5cf6)'
  const [a, b, c] = s.colors
  return `linear-gradient(135deg,${a},${b} 45%,${c})`
}

export function DesignCanvas() {
  const {
    uploadedPreview,
    styleId,
    roomType,
    palette,
    prompt,
    generatedPreview,
    isGenerating,
    progress,
    setUploaded,
    setStyle,
    setRoomType,
    setPalette,
    setPrompt,
    setGenerated,
    setGenerating,
    setProgress,
  } = useCanvasStore()

  const [sliderPosition, setSliderPosition] = useState(50)
  const [isDragging, setIsDragging] = useState(false)

  const onDrop = useCallback(
    (accepted: File[]) => {
      const file = accepted[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = () => setUploaded(reader.result as string)
      reader.readAsDataURL(file)
    },
    [setUploaded]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
  })

  const runGenerate = async () => {
    setGenerating(true)
    setProgress(0)
    const steps = [12, 38, 64, 88, 100]
    for (const s of steps) {
      await new Promise((r) => setTimeout(r, 320 + Math.random() * 180))
      setProgress(s)
    }
    const g = styleGradient(styleId)
    setGenerated(g)
    setGenerating(false)
  }

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = generatedPreview ?? styleGradient(styleId)
    link.download = `roomai-${styleId}.png`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const beforeBg = uploadedPreview ?? 'linear-gradient(135deg,#475569,#94a3b8)'
  const afterBg = generatedPreview ?? styleGradient(styleId)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-8">
      <motion.aside
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6 rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-float backdrop-blur-xl dark:border-dark-border dark:bg-dark-card/80"
      >
        <div>
          <Label className="mb-2 block">Room photo</Label>
          <div
            {...getRootProps()}
            className={cn(
              'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-10 transition-colors',
              isDragActive
                ? 'border-primary-500 bg-primary-500/10'
                : 'border-slate-300 hover:border-primary-400 dark:border-slate-600'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mb-2 h-8 w-8 text-slate-400" />
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              Drop an image or click to browse
            </p>
          </div>
          {uploadedPreview && (
            <Button variant="ghost" size="sm" className="mt-2" onClick={() => setUploaded(null)}>
              Remove image
            </Button>
          )}
        </div>

        <div>
          <Label className="mb-2 block">Style</Label>
          <div className="grid grid-cols-2 gap-2">
            {mockStyles.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setStyle(s.id)}
                className={cn(
                  'flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-all',
                  styleId === s.id
                    ? 'border-primary-500 bg-primary-500/15 shadow-glow'
                    : 'border-slate-200 dark:border-dark-border'
                )}
              >
                <span
                  className="h-8 w-8 rounded-lg"
                  style={{ background: `linear-gradient(135deg,${s.colors.join(',')})` }}
                />
                <span className="font-medium text-slate-800 dark:text-slate-100">{s.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Room type</Label>
          <div className="flex flex-wrap gap-2">
            {roomTypes.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRoomType(r.id)}
                className={cn(
                  'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                  roomType === r.id
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300'
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label className="mb-2 block">Palette</Label>
          <div className="space-y-2">
            <div className="flex gap-2">
              {palette.map((c, i) => (
                <input
                  key={i}
                  type="color"
                  value={c}
                  onChange={(e) => {
                    const next = [...palette]
                    next[i] = e.target.value
                    setPalette(next)
                  }}
                  className="h-10 w-full max-w-[3rem] cursor-pointer overflow-hidden rounded-lg border border-slate-200 dark:border-dark-border"
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {defaultPalettes.map((p) => (
                <button
                  key={p.join()}
                  type="button"
                  className="flex gap-0.5 rounded-lg border border-slate-200 p-1 dark:border-dark-border"
                  onClick={() => setPalette([...p])}
                >
                  {p.map((c) => (
                    <span key={c} className="h-6 w-6 rounded" style={{ background: c }} />
                  ))}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="prompt" className="mb-2 block">
            Custom prompt
          </Label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g. Warm oak floors, indirect lighting, editorial minimal art…"
            rows={4}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/40 dark:border-dark-border dark:bg-white/5 dark:text-white"
          />
        </div>

        <Button
          type="button"
          className="w-full rounded-xl shadow-glow"
          size="lg"
          onClick={runGenerate}
          disabled={isGenerating}
          loading={isGenerating}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Generate design
        </Button>

        <AnimatePresence>
          {isGenerating && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden rounded-xl border border-slate-200 dark:border-dark-border"
            >
              <div className="relative h-2 overflow-hidden bg-slate-100 dark:bg-white/10">
                <motion.div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary-500 via-violet-500 to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                />
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
              </div>
              <p className="p-3 text-center text-xs text-slate-500">Synthesizing materials · {progress}%</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-float backdrop-blur-xl dark:border-dark-border dark:bg-dark-card/80 lg:p-6"
      >
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">Output</h2>
            <p className="text-sm text-slate-500">Before / after · drag the handle</p>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl dark:border-dark-border"
              onClick={runGenerate}
              disabled={isGenerating}
            >
              <RefreshCw className={cn('mr-2 h-4 w-4', isGenerating && 'animate-spin')} />
              Regenerate
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              onClick={handleDownload}
              disabled={!generatedPreview && !uploadedPreview}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>

        <div className="relative flex min-h-[280px] flex-1 lg:min-h-[420px]">
          {isGenerating ? (
            <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50 dark:border-dark-border dark:bg-white/5">
              <div className="relative h-40 w-full max-w-md overflow-hidden rounded-2xl">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800" />
                <motion.div
                  className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10"
                  animate={{ x: ['-100%', '400%'] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                />
              </div>
              <p className="mt-6 text-sm text-slate-500">Building depth passes and materials…</p>
            </div>
          ) : (
            <div
              className="relative w-full overflow-hidden rounded-2xl"
              onMouseMove={(e) => {
                if (!isDragging) return
                const rect = e.currentTarget.getBoundingClientRect()
                const x = e.clientX - rect.left
                setSliderPosition(Math.min(100, Math.max(0, (x / rect.width) * 100)))
              }}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
            >
              <div className="relative aspect-[4/3] w-full md:aspect-video">
                <div className="absolute inset-0" style={{ background: beforeBg }} />
                <div
                  className="absolute inset-0"
                  style={{
                    background: afterBg,
                    clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`,
                  }}
                />
                <div
                  className="absolute bottom-0 top-0 w-1 cursor-ew-resize bg-white shadow-lg"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                  onMouseDown={() => setIsDragging(true)}
                >
                  <div className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-glow">
                    <ChevronLeft className="h-3 w-3 text-slate-500" />
                    <ChevronRight className="h-3 w-3 text-slate-500" />
                  </div>
                </div>
                <span className="absolute left-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-xs text-white">
                  Before
                </span>
                <span className="absolute right-3 top-3 rounded-lg bg-black/50 px-2 py-1 text-xs text-white">
                  After
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: 'Style', value: mockStyles.find((s) => s.id === styleId)?.name ?? '—' },
            { label: 'Room', value: roomTypes.find((r) => r.id === roomType)?.label ?? '—' },
            { label: 'Prompt', value: prompt ? 'Custom' : 'Preset mix' },
          ].map((row) => (
            <div
              key={row.label}
              className="rounded-xl border border-slate-200/80 bg-slate-50/80 px-3 py-2 dark:border-dark-border dark:bg-white/5"
            >
              <p className="text-xs text-slate-500">{row.label}</p>
              <p className="text-sm font-medium text-slate-900 dark:text-white">{row.value}</p>
            </div>
          ))}
        </div>
      </motion.section>
    </div>
  )
}
