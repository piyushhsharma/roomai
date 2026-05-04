'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { Trash2 } from 'lucide-react'
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { Button } from '@/components/ui/Button'
import { cssBackgroundForDesign } from '@/lib/design-preview'

type Row = {
  id: string
  title: string | null
  imageUrl: string
  createdAt: string
}

export default function InspirationsPage() {
  const [items, setItems] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await fetch('/api/inspirations')
    if (!res.ok) {
      toast.error('Could not load inspirations')
      return
    }
    const data = await res.json()
    setItems(data.inspirations ?? [])
  }, [])

  useEffect(() => {
    load().finally(() => setLoading(false))
  }, [load])

  const remove = async (id: string) => {
    if (!confirm('Remove this inspiration?')) return
    const res = await fetch(`/api/inspirations/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      toast.error('Could not delete')
      return
    }
    toast.success('Removed')
    load()
  }

  return (
    <>
      <DashboardTopbar title="Inspirations" />
      <div className="p-4 lg:p-8">
        <p className="mb-6 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Saved looks from your generations. Anything stored here stays in your workspace until you delete it.
        </p>
        {loading ? (
          <p className="text-sm text-slate-500">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-slate-500">
            No saved inspirations yet. After you generate on the canvas, use &quot;Save to inspirations&quot; to pin a
            result here.
          </p>
        ) : (
          <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i % 8) * 0.03 }}
                className="group relative mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-slate-200/80 dark:border-dark-border"
              >
                <div
                  className="aspect-[4/5] w-full"
                  style={{
                    background: cssBackgroundForDesign(item.imageUrl, null),
                  }}
                />
                <div className="flex items-center justify-between bg-white p-4 dark:bg-dark-card">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{item.title || 'Inspiration'}</p>
                    <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => remove(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
