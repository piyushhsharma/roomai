'use client'

import type { CSSProperties } from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  RefreshCw,
  Upload,
  Wand2,
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  ChevronDown,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'
import { Label } from '@/components/ui/Label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { mockStyles } from '@/lib/mock-data'
import { useCanvasStore, type RoomType } from '@/lib/stores/canvas-store'
import { cn } from '@/lib/utils'
import type { RAGChunk } from '@/types/rag'

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

function afterCss(generated: string | null, styleId: string): CSSProperties {
  if (!generated) {
    return { background: styleGradient(styleId) }
  }
  if (generated.startsWith('http') || generated.startsWith('data:')) {
    return {
      backgroundImage: `url(${generated})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }
  }
  return { background: generated }
}

type ProjectOpt = { id: string; name: string }

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
  const [uploading, setUploading] = useState(false)
  const [uploadedImageId, setUploadedImageId] = useState<string | null>(null)
  const [lastDesignId, setLastDesignId] = useState<string | null>(null)
  const [persistUrl, setPersistUrl] = useState<string | null>(null)
  const [projects, setProjects] = useState<ProjectOpt[]>([])
  const [projectId, setProjectId] = useState<string>('')
  const [recommendations, setRecommendations] = useState('')
  const [ragChunks, setRagChunks] = useState<RAGChunk[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})

  const categoryColor: Record<string, string> = {
    styles: 'bg-violet-500/20 text-violet-200 border-violet-500/40',
    'color-theory': 'bg-amber-500/20 text-amber-200 border-amber-500/40',
    furniture: 'bg-blue-500/20 text-blue-200 border-blue-500/40',
    lighting: 'bg-yellow-500/20 text-yellow-200 border-yellow-500/40',
    rooms: 'bg-green-500/20 text-green-200 border-green-500/40',
  }

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then((d) => setProjects(d.projects?.map((p: { id: string; name: string }) => ({ id: p.id, name: p.name })) ?? []))
      .catch(() => {})
  }, [])

  const onDrop = useCallback(
    async (accepted: File[]) => {
      const file = accepted[0]
      if (!file) return
      setUploading(true)
      try {
        const fd = new FormData()
        fd.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: fd })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          toast.error(data.error || 'Upload failed')
          return
        }
        setUploaded(data.url)
        setUploadedImageId(data.id)
        toast.success('Image uploaded')
      } catch {
        toast.error('Upload failed')
      } finally {
        setUploading(false)
      }
    },
    [setUploaded]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 1,
    disabled: uploading || isGenerating,
  })

  const runGenerate = async () => {
    setGenerating(true)
    setProgress(8)
    setLastDesignId(null)
    setPersistUrl(null)
    setRecommendations('')
    setRagChunks([])
    setExpandedCards({})
    try {
      const res = await fetch('/api/designs/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          styleId,
          roomType,
          palette,
          prompt: prompt || undefined,
          projectId: projectId || undefined,
          uploadedImageId: uploadedImageId || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        toast.error(data.error || 'Generation failed')
        if (data.usage) {
          toast(`Today: ${data.usage.used}/${data.usage.cap}`, { icon: '⏳' })
        }
        return
      }
      if (data.notice) toast(data.notice, { icon: 'ℹ️' })
      setRecommendations(typeof data.recommendations === 'string' ? data.recommendations : '')
      setRagChunks(Array.isArray(data.rag?.chunks) ? (data.rag.chunks as RAGChunk[]) : [])
      const raw: string = data.design?.resultUrl
      setPersistUrl(raw || null)
      if (raw?.startsWith('http') || raw?.startsWith('data:')) {
        setGenerated(raw)
      } else {
        setGenerated(styleGradient(data.design?.style || styleId))
      }
      setLastDesignId(data.design?.id ?? null)
      setProgress(100)
      toast.success(data.design?.isMock ? 'Preview ready (mock mode)' : 'Design generated')
    } catch {
      toast.error('Network error')
    } finally {
      setGenerating(false)
    }
  }

  const saveInspiration = async () => {
    if (!lastDesignId || !generatedPreview) {
      toast.error('Generate a design first')
      return
    }
    const imageUrl =
      persistUrl && (persistUrl.startsWith('http') || persistUrl.startsWith('data:') || persistUrl.startsWith('mock:'))
        ? persistUrl
        : `mock://${styleId}`

    const res = await fetch('/api/inspirations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: `${mockStyles.find((s) => s.id === styleId)?.name ?? 'Style'} · ${roomType}`,
        imageUrl,
        designId: lastDesignId,
      }),
    })
    if (!res.ok) {
      const j = await res.json().catch(() => ({}))
      toast.error(j.error || 'Could not save')
      return
    }
    toast.success('Saved to inspirations')
  }

  const handleDownload = () => {
    const target = generatedPreview
    if (!target) return
    if (target.startsWith('http')) {
      window.open(target, '_blank', 'noopener,noreferrer')
      return
    }
    const link = document.createElement('a')
    link.href = target
    link.download = `roomai-${styleId}.png`
    document.body.appendChild(link)
    link.click()
    link.remove()
  }

  const beforeBg = uploadedPreview ?? 'linear-gradient(135deg,#475569,#94a3b8)'
  const beforeIsUrl = beforeBg.startsWith('http') || beforeBg.startsWith('data:')
  const afterStyle = afterCss(generatedPreview, styleId)

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
                : 'border-slate-300 hover:border-primary-400 dark:border-slate-600',
              (uploading || isGenerating) && 'pointer-events-none opacity-60'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="mb-2 h-8 w-8 text-slate-400" />
            <p className="text-center text-sm text-slate-600 dark:text-slate-400">
              {uploading ? 'Uploading…' : 'Drop an image or click to browse'}
            </p>
            <p className="mt-1 text-center text-xs text-slate-500">Max 2MB · server-stored for generation</p>
          </div>
          {uploadedPreview && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2"
              onClick={() => {
                setUploaded(null)
                setUploadedImageId(null)
              }}
            >
              Remove image
            </Button>
          )}
        </div>

        <div>
          <Label className="mb-2 block">Link to project (optional)</Label>
          <select
            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm dark:border-dark-border dark:bg-white/5 dark:text-white"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">No project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
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
          disabled={isGenerating || uploading}
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
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl dark:border-dark-border"
              onClick={saveInspiration}
              disabled={!lastDesignId}
            >
              <BookmarkPlus className="mr-2 h-4 w-4" />
              Save
            </Button>
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
                <div
                  className="absolute inset-0"
                  style={
                    beforeIsUrl
                      ? {
                          backgroundImage: `url(${beforeBg})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }
                      : { background: beforeBg }
                  }
                />
                <div
                  className="absolute inset-0"
                  style={{
                    ...afterStyle,
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

        {recommendations ? (
          <Card className="mt-5 border-slate-200/80 bg-slate-50/80 dark:border-dark-border dark:bg-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">AI design recommendation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700 dark:text-slate-300">
                {recommendations}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {ragChunks.length > 0 ? (
          <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-4 dark:border-dark-border dark:bg-white/5">
            <button
              type="button"
              className="flex w-full items-center justify-between text-left"
              onClick={() => setIsOpen((v) => !v)}
            >
              <div>
                <p className="text-base font-semibold text-slate-900 dark:text-white">
                  Design principles used in this recommendation
                </p>
                <p className="text-xs text-slate-500">RAG-retrieved from interior design knowledge base</p>
              </div>
              <span className="ml-3 rounded-lg border border-slate-200 bg-white p-2 dark:border-dark-border dark:bg-dark-card">
                <ChevronDown className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')} />
              </span>
            </button>

            {isOpen ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {ragChunks.map((chunk) => {
                  const expanded = expandedCards[chunk.id] ?? false
                  return (
                    <div
                      key={chunk.id}
                      className="rounded-xl border border-slate-200 bg-white p-3 dark:border-dark-border dark:bg-dark-card"
                    >
                      <div className="mb-2 flex items-center justify-between gap-2">
                        <Badge
                          className={cn(
                            'border px-2 py-0.5 text-[10px] uppercase tracking-wide',
                            categoryColor[chunk.category] || 'bg-slate-500/20 text-slate-200 border-slate-500/40'
                          )}
                        >
                          {chunk.category}
                        </Badge>
                        <span className="text-[11px] text-slate-500">{chunk.source}</span>
                      </div>
                      <p className={cn('text-sm text-slate-700 dark:text-slate-300', !expanded && 'line-clamp-3')}>
                        {chunk.content}
                      </p>
                      <button
                        type="button"
                        className="mt-2 text-xs font-medium text-primary-500 hover:text-primary-400"
                        onClick={() =>
                          setExpandedCards((prev) => ({
                            ...prev,
                            [chunk.id]: !expanded,
                          }))
                        }
                      >
                        {expanded ? 'read less' : 'read more'}
                      </button>
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>
        ) : null}
      </motion.section>
    </div>
  )
}
