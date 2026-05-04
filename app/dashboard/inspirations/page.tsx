'use client'

import { motion } from 'framer-motion'
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { mockGalleryItems } from '@/lib/mock-data'

export default function InspirationsPage() {
  return (
    <>
      <DashboardTopbar title="Inspirations" />
      <div className="p-4 lg:p-8">
        <p className="mb-6 max-w-2xl text-slate-600 dark:text-slate-400">
          Curated gradient boards — swap in your own references inside the canvas when you are ready to commit to a
          direction.
        </p>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {mockGalleryItems.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 8) * 0.03 }}
              className="mb-4 break-inside-avoid overflow-hidden rounded-3xl border border-slate-200/80 dark:border-dark-border"
            >
              <div
                className="aspect-[4/5] w-full"
                style={{ background: item.gradient }}
              />
              <div className="bg-white p-4 dark:bg-dark-card">
                <p className="font-medium text-slate-900 dark:text-white">{item.label}</p>
                <p className="text-xs text-slate-500">{item.tag}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
