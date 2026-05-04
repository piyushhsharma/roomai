'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight, Cpu, ImageIcon, Layers } from 'lucide-react'
import { DashboardTopbar } from '@/components/dashboard/DashboardTopbar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { cssBackgroundForDesign } from '@/lib/design-preview'

type Summary = {
  designCount: number
  projectCount: number
  credits: number
  plan: string
  usage: { dailyUsed: number; dailyCap: number }
}

type ActivityRow = { id: string; type: string; message: string; createdAt: string }

type ProjectRow = {
  id: string
  name: string
  updatedAt: string
  designCount: number
  latestDesign: { resultUrl: string; style: string | null; isMock: boolean } | null
}

type DesignRow = {
  id: string
  resultUrl: string
  style: string | null
  prompt: string | null
  isMock: boolean
  durationMs: number | null
  createdAt: string
}

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [activity, setActivity] = useState<ActivityRow[]>([])
  const [projects, setProjects] = useState<ProjectRow[]>([])
  const [designs, setDesigns] = useState<DesignRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      setLoading(true)
      try {
        const [s, a, p, d] = await Promise.all([
          fetch('/api/dashboard/summary'),
          fetch('/api/activity?take=8'),
          fetch('/api/projects'),
          fetch('/api/designs?take=8'),
        ])
        if (cancelled) return
        if (s.ok) setSummary(await s.json())
        if (a.ok) {
          const j = await a.json()
          setActivity(j.activity ?? [])
        }
        if (p.ok) {
          const j = await p.json()
          setProjects(j.projects ?? [])
        }
        if (d.ok) {
          const j = await d.json()
          setDesigns(j.designs ?? [])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  const stats = summary
    ? [
        { label: 'Total renders', value: summary.designCount, icon: ImageIcon, tone: 'from-primary-500/20' },
        { label: 'Active projects', value: summary.projectCount, icon: Layers, tone: 'from-violet-500/20' },
        { label: 'Credits left', value: summary.credits, icon: Cpu, tone: 'from-cyan-500/20' },
        {
          label: 'Today',
          value: `${summary.usage.dailyUsed}/${summary.usage.dailyCap}`,
          icon: ArrowUpRight,
          tone: 'from-emerald-500/20',
        },
      ]
    : [
        { label: 'Total renders', value: '—', icon: ImageIcon, tone: 'from-primary-500/20' },
        { label: 'Active projects', value: '—', icon: Layers, tone: 'from-violet-500/20' },
        { label: 'Credits left', value: '—', icon: Cpu, tone: 'from-cyan-500/20' },
        { label: 'Today', value: '—', icon: ArrowUpRight, tone: 'from-emerald-500/20' },
      ]

  return (
    <>
      <DashboardTopbar title="Overview" />
      <div className="space-y-8 p-4 lg:p-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="overflow-hidden border-slate-200/80 dark:border-dark-border">
                <CardContent className="flex items-center gap-4 p-5">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${s.tone} to-transparent`}
                  >
                    <s.icon className="h-6 w-6 text-primary-600 dark:text-primary-300" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{s.label}</p>
                    <p className="font-display text-2xl font-bold text-slate-900 dark:text-white">
                      {loading ? '…' : s.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-8 xl:grid-cols-3">
          <Card className="border-slate-200/80 dark:border-dark-border xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg">Projects</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/projects">View all</Link>
              </Button>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {!loading && projects.length === 0 && (
                <p className="col-span-2 text-sm text-slate-500 dark:text-slate-400">
                  No projects yet.{' '}
                  <Link href="/dashboard/projects" className="text-primary-500 hover:underline">
                    Create your first project
                  </Link>
                  .
                </p>
              )}
              {projects.slice(0, 4).map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  className="group overflow-hidden rounded-2xl border border-slate-200/80 dark:border-dark-border"
                >
                  <Link href="/dashboard/projects">
                    <div
                      className="aspect-[16/10] w-full transition-transform duration-500 group-hover:scale-105"
                      style={{
                        background: p.latestDesign
                          ? cssBackgroundForDesign(p.latestDesign.resultUrl, p.latestDesign.style)
                          : 'linear-gradient(135deg,#1e293b,#334155)',
                      }}
                    />
                    <div className="p-4">
                      <p className="font-medium text-slate-900 dark:text-white">{p.name}</p>
                      <p className="text-xs text-slate-500">
                        {p.designCount} designs · {formatDate(new Date(p.updatedAt))}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 dark:border-dark-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!loading && activity.length === 0 && (
                <p className="text-sm text-slate-500">No activity yet. Generate a design to see history here.</p>
              )}
              {activity.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.05 }}
                  className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3 dark:border-dark-border dark:bg-white/5"
                >
                  <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                  <div>
                    <p className="text-sm text-slate-800 dark:text-slate-200">{a.message}</p>
                    <p className="text-xs text-slate-500">{formatRelativeTime(new Date(a.createdAt))}</p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-slate-200/80 dark:border-dark-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="font-display text-lg">Recent AI generations</CardTitle>
            <Button asChild className="rounded-xl">
              <Link href="/dashboard/canvas">New render</Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {!loading && designs.length === 0 && (
              <p className="col-span-full text-sm text-slate-500">
                Nothing generated yet.{' '}
                <Link href="/dashboard/canvas" className="text-primary-500 hover:underline">
                  Open the canvas
                </Link>
                .
              </p>
            )}
            {designs.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * i }}
                className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-dark-border"
              >
                <div
                  className="aspect-video w-full"
                  style={{
                    background: cssBackgroundForDesign(r.resultUrl, r.style),
                  }}
                />
                <div className="p-3">
                  <p className="line-clamp-2 text-sm text-slate-700 dark:text-slate-300">
                    {r.prompt || `${r.style || 'Design'} render`}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {r.durationMs != null ? `${(r.durationMs / 1000).toFixed(1)}s` : '—'} ·{' '}
                    {r.isMock ? 'Preview mode' : 'AI'}
                  </p>
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
