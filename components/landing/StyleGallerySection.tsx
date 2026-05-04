'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { SlidersHorizontal } from 'lucide-react'
import { mockGalleryFilters, mockGalleryItems, type GalleryFilter } from '@/lib/mock-data'
import { cn } from '@/lib/utils'

export default function StyleGallerySection() {
  const [filter, setFilter] = useState<GalleryFilter>('All')

  const items = useMemo(() => {
    if (filter === 'All') return mockGalleryItems
    return mockGalleryItems.filter((item) => item.tag === filter)
  }, [filter])

  return (
    <section id="gallery" className="relative bg-roomai-light py-24 dark:bg-roomai-surface">
      <div className="pointer-events-none absolute inset-0 bg-mesh-light opacity-60 dark:opacity-30" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-500">AI style gallery</p>
            <h2 className="font-display mt-3 text-display font-bold text-slate-900 dark:text-white">
              Explore signature ROOMAI looks
            </h2>
            <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-400">
              Procedural previews — every tile is a gradient stand-in for a full neural render. Filter by space type and
              imagine your next transformation.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-sm backdrop-blur-md dark:border-dark-border dark:bg-dark-card/80 dark:text-slate-300">
            <SlidersHorizontal className="h-4 w-4 text-primary-500" />
            Refine collection
          </div>
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-2">
          {mockGalleryFilters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={cn(
                'rounded-full px-4 py-2 text-sm font-medium transition-all',
                filter === f
                  ? 'bg-primary-500 text-white shadow-glow'
                  : 'bg-white text-slate-600 hover:bg-slate-100 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10'
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.05 }}
              className="group mb-4 break-inside-avoid"
            >
              <div
                className="relative overflow-hidden rounded-3xl border border-white/10 shadow-float transition-transform duration-500 group-hover:z-10 group-hover:scale-[1.02]"
                style={{
                  background: item.gradient,
                  aspectRatio: i % 3 === 0 ? '3/4' : '4/3',
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-95" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-white/70">{item.tag}</p>
                  <p className="font-display text-lg font-semibold text-white">{item.label}</p>
                </div>
                <motion.div
                  className="absolute inset-0 opacity-0 mix-blend-overlay transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      'radial-gradient(circle at 30% 20%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(circle at 70% 80%, rgba(99,102,241,0.35), transparent 45%)',
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
