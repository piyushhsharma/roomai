'use client'

import { motion } from 'framer-motion'
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { Card, CardContent } from '@/components/ui/Card'
import { formatDate } from '@/lib/utils'
import { mockProjects } from '@/lib/mock-data'

export default function ProjectsPage() {
  return (
    <>
      <DashboardTopbar title="Projects" />
      <div className="p-4 lg:p-8">
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {mockProjects.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="overflow-hidden border-slate-200/80 dark:border-dark-border">
                <div className="aspect-[16/10] w-full" style={{ background: p.thumbnail }} />
                <CardContent className="p-5">
                  <h2 className="font-display text-lg font-semibold text-slate-900 dark:text-white">{p.name}</h2>
                  <p className="mt-1 text-sm capitalize text-slate-500">{p.style} · {p.renders} renders</p>
                  <p className="mt-2 text-xs text-slate-400">Updated {formatDate(p.updatedAt)}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  )
}
